import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MarketPrice from '@/lib/models/MarketPrice';
import { authenticateRequest } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = authenticateRequest(req);
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const existing = await MarketPrice.findById(id);
    if (!existing) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

    // If price changed, capture previous and recompute trend
    if (typeof body.price === 'number' && body.price !== existing.price) {
      body.previousPrice = existing.price;
      const diff = body.price - existing.price;
      body.changePct = existing.price > 0 ? +((diff / existing.price) * 100).toFixed(2) : 0;
      body.trend = diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat';
    }
    body.lastUpdated = new Date();

    Object.assign(existing, body);
    await existing.save();
    return NextResponse.json({ success: true, data: existing });
  } catch (error) {
    console.error('Admin PATCH price error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = authenticateRequest(req);
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  try {
    await dbConnect();
    const { id } = await params;
    await MarketPrice.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin DELETE price error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
