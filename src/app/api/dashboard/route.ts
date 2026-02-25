import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import Category from '@/lib/models/Category';
import Enquiry from '@/lib/models/Enquiry';
import { authenticateRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = authenticateRequest(req);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    const [totalProducts, totalCategories, totalEnquiries, pendingEnquiries, recentEnquiries] =
      await Promise.all([
        Product.countDocuments(),
        Category.countDocuments(),
        Enquiry.countDocuments(),
        Enquiry.countDocuments({ isResponded: false }),
        Enquiry.find().sort({ createdAt: -1 }).limit(5).lean(),
      ]);

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        totalCategories,
        totalEnquiries,
        pendingEnquiries,
        recentEnquiries: recentEnquiries.map((e) => ({ ...e, _id: e._id.toString() })),
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
