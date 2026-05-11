import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MarketPrice from '@/lib/models/MarketPrice';
import { seedPricesIfEmpty } from '@/lib/seed-prices';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function GET() {
  try {
    await dbConnect();
    await seedPricesIfEmpty();
    const prices = await MarketPrice.find({ isActive: true })
      .sort({ displayOrder: 1, name: 1 })
      .lean();
    return NextResponse.json({ success: true, data: prices });
  } catch (error) {
    console.error('GET /api/prices error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
