import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MarketPrice from '@/lib/models/MarketPrice';
import { authenticateRequest } from '@/lib/auth';
import { DEFAULT_PRICES } from '@/lib/seed-prices';

export async function POST(req: NextRequest) {
  const user = authenticateRequest(req);
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  try {
    await dbConnect();
    await MarketPrice.deleteMany({});
    await MarketPrice.insertMany(
      DEFAULT_PRICES.map((p) => ({
        ...p,
        previousPrice: p.price,
        trend: 'flat',
        changePct: 0,
        isActive: true,
        manualOverride: false,
        lastUpdated: new Date(),
      }))
    );
    const inserted = await MarketPrice.find({}).sort({ displayOrder: 1 }).lean();
    return NextResponse.json({ success: true, data: inserted });
  } catch (error) {
    console.error('Admin reset prices error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
