import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SellerEnquiry from '@/lib/models/SellerEnquiry';
import { authenticateRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const enquiries = await SellerEnquiry.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, enquiries });
  } catch (error) {
    console.error('GET seller enquiries error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
