import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Enquiry from '@/lib/models/Enquiry';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('buyer_token')?.value;
    if (!token) return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'buyer') {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
    await dbConnect();
    const user = await User.findById(decoded.userId).select('email phone').lean();
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

    const enquiries = await Enquiry.find({
      $or: [
        { email: user.email },
        ...(user.phone ? [{ phone: user.phone }] : []),
      ],
    })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({
      success: true,
      data: enquiries.map((e) => ({
        ...e,
        _id: e._id.toString(),
        productId: e.productId ? e.productId.toString() : undefined,
      })),
    });
  } catch (err) {
    console.error('Buyer enquiries error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
