import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SellerEnquiry from '@/lib/models/SellerEnquiry';

// POST: Submit a new seller enquiry (public, no auth)
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const { name, phone, city, materialType, quantity } = body;

    if (!name || !phone || !city || !materialType || !quantity) {
      return NextResponse.json(
        { success: false, error: 'Name, phone, city, material type, and quantity are required' },
        { status: 400 }
      );
    }

    const enquiry = await SellerEnquiry.create({
      name: body.name,
      phone: body.phone,
      email: body.email || '',
      companyName: body.companyName || '',
      city: body.city,
      materialType: body.materialType,
      materialDescription: body.materialDescription || '',
      quantity: body.quantity,
      videoLinks: body.videoLinks || [],
      photos: body.photos || [],
    });

    return NextResponse.json({ success: true, data: enquiry });
  } catch (error) {
    console.error('Seller enquiry error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
