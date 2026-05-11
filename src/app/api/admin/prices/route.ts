import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MarketPrice from '@/lib/models/MarketPrice';
import { authenticateRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = authenticateRequest(req);
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  try {
    await dbConnect();
    const prices = await MarketPrice.find({}).sort({ displayOrder: 1, name: 1 }).lean();
    return NextResponse.json({ success: true, data: prices });
  } catch (error) {
    console.error('Admin GET prices error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = authenticateRequest(req);
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  try {
    await dbConnect();
    const body = await req.json();
    const created = await MarketPrice.create({
      ...body,
      previousPrice: body.previousPrice ?? body.price,
      lastUpdated: new Date(),
    });
    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error('Admin POST prices error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
