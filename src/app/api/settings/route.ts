import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';
import { authenticateRequest } from '@/lib/auth';

async function getOrCreateSettings() {
  let settings = await Settings.findOne().lean();
  if (!settings) {
    const created = await Settings.create({
      companyName: 'Boriwala Trading Co.',
      tagline: 'Your Trusted B2B Trading Partner',
      phone: ['+91 99999 99999'],
      email: ['info@boriwala.com'],
      address: 'Mumbai, Maharashtra, India',
      whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999',
      aboutUs: 'We are a leading B2B trading company specializing in PP Bags, Jute Bags, Plastic Products, Industrial Packaging Materials and more. With over 15 years of experience, we serve businesses across India with quality products and competitive pricing.',
      aboutUsShort: 'Leading B2B trading company dealing in PP Bags, Jute Bags, Plastic Products & Industrial Packaging Materials.',
      experience: '15+ Years',
      strengths: ['Quality Products', 'Competitive Pricing', 'Pan India Delivery', 'Bulk Orders', 'Custom Packaging', 'Reliable Service'],
      heroTitle: 'Your Trusted B2B Trading Partner',
      heroSubtitle: 'Dealing in PP Bags, Jute Bags, Plastic Products, Packaging Materials & More',
    });
    settings = await Settings.findById(created._id).lean();
  }
  return settings;
}

export async function GET() {
  try {
    await dbConnect();
    const settings = await getOrCreateSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('GET settings error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = authenticateRequest(req);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const body = await req.json();

    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(body);
    } else {
      Object.assign(settings, body);
      await settings.save();
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('PUT settings error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
