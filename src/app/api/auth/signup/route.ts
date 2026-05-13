import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import { hashPassword } from '@/lib/auth';
import { sendEmail, welcomeEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, email, password, phone, companyName } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'Name, email, and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json({ success: false, error: 'An account with this email already exists' }, { status: 400 });
    }

    const hashed = await hashPassword(password);
    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name.trim();
    await User.create({
      name: cleanName,
      email: cleanEmail,
      password: hashed,
      phone: phone?.trim() || '',
      companyName: companyName?.trim() || '',
      role: 'buyer',
      isActive: true,
      isApproved: false,
    });

    // Send welcome email (non-blocking — failure must not break signup)
    const tpl = welcomeEmail(cleanName);
    sendEmail({ to: cleanEmail, subject: tpl.subject, html: tpl.html }).catch((err) =>
      console.error('[signup] welcome email failed:', err),
    );

    return NextResponse.json({
      success: true,
      message: 'Registration successful! Your account is pending admin approval. You will be able to view pricing once approved.',
    });
  } catch (error) {
    console.error('Signup error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: `Signup failed: ${message}` }, { status: 500 });
  }
}
