import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PriceAlert from '@/lib/models/PriceAlert';
import { authenticateRequest } from '@/lib/auth';

// Public — subscribe to alerts
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { product, email, whatsapp, name } = body;
    if (!product) return NextResponse.json({ success: false, error: 'Product required' }, { status: 400 });
    if (!email && !whatsapp) {
      return NextResponse.json({ success: false, error: 'Provide at least email or WhatsApp number' }, { status: 400 });
    }

    // De-dupe: same product + (email or whatsapp)
    const existing = await PriceAlert.findOne({
      product,
      $or: [
        ...(email ? [{ email: email.toLowerCase().trim() }] : []),
        ...(whatsapp ? [{ whatsapp: whatsapp.trim() }] : []),
      ],
    });
    if (existing) {
      existing.isActive = true;
      if (name) existing.name = name;
      await existing.save();
      return NextResponse.json({ success: true, message: 'Alert already active. Confirmed.', data: existing });
    }

    const alert = await PriceAlert.create({
      product,
      email: email?.toLowerCase().trim() || '',
      whatsapp: whatsapp?.trim() || '',
      name: name || '',
      isActive: true,
    });
    return NextResponse.json({ success: true, message: 'Alert subscribed!', data: alert }, { status: 201 });
  } catch (err) {
    console.error('POST price-alert error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

// Admin list
export async function GET(req: NextRequest) {
  try {
    const admin = authenticateRequest(req);
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    await dbConnect();
    const alerts = await PriceAlert.find()
      .populate('product', 'name slug')
      .sort({ createdAt: -1 })
      .limit(500)
      .lean();
    return NextResponse.json({ success: true, data: alerts });
  } catch (err) {
    console.error('GET price-alerts error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
