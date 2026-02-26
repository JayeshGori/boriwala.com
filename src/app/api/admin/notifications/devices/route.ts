import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PushToken from '@/lib/models/PushToken';
import { authenticateRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const count = await PushToken.countDocuments({ isActive: true });

    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error('GET device count error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
