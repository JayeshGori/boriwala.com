import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import { verifyToken, hashPassword, verifyPassword } from '@/lib/auth';

const ALLOWED_FIELDS = [
  'name',
  'phone',
  'companyName',
  'gstNumber',
  'addressLine1',
  'addressLine2',
  'city',
  'state',
  'pincode',
] as const;

async function getBuyer(req: NextRequest) {
  const token = req.cookies.get('buyer_token')?.value;
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== 'buyer') return null;
  return decoded;
}

export async function PUT(req: NextRequest) {
  try {
    const decoded = await getBuyer(req);
    if (!decoded) return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });

    await dbConnect();
    const body = await req.json();
    const update: Record<string, string> = {};
    for (const f of ALLOWED_FIELDS) {
      if (typeof body[f] === 'string') update[f] = body[f].trim();
    }

    // Email change is allowed but must remain unique and re-trigger approval optionally — keep simple: not changeable here.
    if (body.email) {
      return NextResponse.json(
        { success: false, error: 'Email cannot be changed. Contact support if needed.' },
        { status: 400 },
      );
    }

    // Optional password change
    if (body.newPassword) {
      if (!body.currentPassword) {
        return NextResponse.json(
          { success: false, error: 'Current password required to change password' },
          { status: 400 },
        );
      }
      if (typeof body.newPassword !== 'string' || body.newPassword.length < 6) {
        return NextResponse.json(
          { success: false, error: 'New password must be at least 6 characters' },
          { status: 400 },
        );
      }
      const user = await User.findById(decoded.userId);
      if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
      const ok = await verifyPassword(body.currentPassword, user.password);
      if (!ok) return NextResponse.json({ success: false, error: 'Current password is incorrect' }, { status: 400 });
      user.password = await hashPassword(body.newPassword);
      await user.save();
    }

    if (Object.keys(update).length > 0) {
      await User.findByIdAndUpdate(decoded.userId, update);
    }

    return NextResponse.json({ success: true, message: 'Profile updated' });
  } catch (err) {
    console.error('Profile update error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
