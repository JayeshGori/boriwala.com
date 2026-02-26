import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PushToken from '@/lib/models/PushToken';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { token, platform, deviceName } = await req.json();

    if (!token) {
      return NextResponse.json({ success: false, error: 'Token is required' }, { status: 400 });
    }

    // Upsert: update if token exists, create if new
    await PushToken.findOneAndUpdate(
      { token },
      { token, platform: platform || 'android', deviceName: deviceName || 'Unknown', isActive: true },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Push token save error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
