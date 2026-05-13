import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import { authenticateRequest } from '@/lib/auth';
import { sendEmail, approvalEmail } from '@/lib/email';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = authenticateRequest(req);
    if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const updateData: Record<string, unknown> = {};
    if (typeof body.isApproved === 'boolean') updateData.isApproved = body.isApproved;
    if (typeof body.isActive === 'boolean') updateData.isActive = body.isActive;

    const before = await User.findOne({ _id: id, role: 'buyer' }).select('isApproved name email').lean();
    const buyer = await User.findOneAndUpdate(
      { _id: id, role: 'buyer' },
      updateData,
      { new: true }
    ).select('-password');

    if (!buyer) {
      return NextResponse.json({ success: false, error: 'Buyer not found' }, { status: 404 });
    }

    // Send approval email when buyer transitions from not-approved -> approved
    if (before && !before.isApproved && updateData.isApproved === true) {
      const tpl = approvalEmail(before.name);
      sendEmail({ to: before.email, subject: tpl.subject, html: tpl.html }).catch((err) =>
        console.error('[buyer-approve] email failed:', err),
      );
    }

    return NextResponse.json({ success: true, data: buyer });
  } catch (error) {
    console.error('PUT buyer error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = authenticateRequest(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    await User.findOneAndDelete({ _id: id, role: 'buyer' });

    return NextResponse.json({ success: true, message: 'Buyer deleted' });
  } catch (error) {
    console.error('DELETE buyer error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
