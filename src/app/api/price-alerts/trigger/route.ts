import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PriceAlert from '@/lib/models/PriceAlert';
import Product from '@/lib/models/Product';
import { authenticateRequest } from '@/lib/auth';
import { sendEmail, priceAlertEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const admin = authenticateRequest(req);
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    await dbConnect();
    const body = await req.json();
    const { product: productId, message } = body;
    if (!productId || !message) {
      return NextResponse.json({ success: false, error: 'product and message required' }, { status: 400 });
    }

    const product = await Product.findById(productId).lean();
    if (!product) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });

    const alerts = await PriceAlert.find({ product: productId, isActive: true });
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://boriwala.com';
    const productUrl = `${siteUrl}/products/${product.slug}`;
    let emailsSent = 0;

    await Promise.all(
      alerts.map(async (a) => {
        if (a.email) {
          const tpl = priceAlertEmail(a.name || 'Customer', product.name, productUrl, message);
          const r = await sendEmail({ to: a.email, subject: tpl.subject, html: tpl.html });
          if (r.success) emailsSent++;
        }
        a.notifiedAt = new Date();
        await a.save();
      }),
    );

    return NextResponse.json({
      success: true,
      message: `Triggered ${alerts.length} alert(s); ${emailsSent} email(s) sent.`,
      total: alerts.length,
      emailsSent,
    });
  } catch (err) {
    console.error('Trigger price-alert error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
