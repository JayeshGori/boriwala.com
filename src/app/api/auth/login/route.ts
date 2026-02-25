import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import { verifyPassword, generateToken, hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password required' }, { status: 400 });
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    // Auto-create admin if no users exist
    if (!user) {
      const userCount = await User.countDocuments();
      if (userCount === 0 && email === (process.env.ADMIN_EMAIL || 'admin@boriwala.com')) {
        const hashed = await hashPassword(process.env.ADMIN_PASSWORD || 'admin123');
        user = await User.create({
          name: 'Admin',
          email: email.toLowerCase(),
          password: hashed,
          role: 'admin',
        });
      }
    }

    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      data: { token, user: { name: user.name, email: user.email, role: user.role } },
    });

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: `Server error: ${message}` }, { status: 500 });
  }
}
