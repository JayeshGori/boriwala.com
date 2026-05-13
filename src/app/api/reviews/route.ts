import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/lib/models/Review';
import User from '@/lib/models/User';
import { verifyToken, authenticateRequest } from '@/lib/auth';

// Public list (approved only) — also used by admin via ?all=true (with admin token)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('product');
    const all = searchParams.get('all') === 'true';
    const featured = searchParams.get('featured') === 'true';

    const filter: Record<string, unknown> = {};
    if (productId) filter.product = productId;

    if (all) {
      const admin = authenticateRequest(req);
      if (!admin || admin.role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }
    } else {
      filter.isApproved = true;
      if (featured) filter.isFeatured = true;
    }

    const reviews = await Review.find(filter)
      .populate('product', 'name slug images')
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(200)
      .lean();

    let stats: { count: number; avg: number; distribution: Record<number, number> } | null = null;
    if (productId && !all) {
      const approved = await Review.find({ product: productId, isApproved: true }).select('rating').lean();
      const count = approved.length;
      const avg = count ? approved.reduce((s, r) => s + r.rating, 0) / count : 0;
      const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      approved.forEach((r) => {
        distribution[r.rating] = (distribution[r.rating] || 0) + 1;
      });
      stats = { count, avg: Math.round(avg * 10) / 10, distribution };
    }

    return NextResponse.json({
      success: true,
      data: reviews.map((r) => ({
        ...r,
        _id: r._id.toString(),
        product: r.product || null,
        buyer: r.buyer ? r.buyer.toString() : null,
      })),
      stats,
    });
  } catch (err) {
    console.error('GET reviews error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

// Submit review (buyer or guest)
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { product, name, email, companyName, rating, title, comment, videoUrl, imageUrls } = body;

    if (!product || !comment || !rating) {
      return NextResponse.json({ success: false, error: 'Product, rating and comment are required' }, { status: 400 });
    }
    const r = parseInt(rating, 10);
    if (isNaN(r) || r < 1 || r > 5) {
      return NextResponse.json({ success: false, error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Detect logged-in buyer for verified badge
    let buyer: { userId: string; name: string; email: string; companyName?: string } | null = null;
    const buyerToken = req.cookies.get('buyer_token')?.value;
    if (buyerToken) {
      const decoded = verifyToken(buyerToken);
      if (decoded && decoded.role === 'buyer') {
        const u = await User.findById(decoded.userId).select('name email companyName isApproved').lean();
        if (u && u.isApproved) {
          buyer = {
            userId: u._id.toString(),
            name: u.name,
            email: u.email,
            companyName: u.companyName || '',
          };
        }
      }
    }

    if (!buyer && (!name || !email)) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required for guest reviews' },
        { status: 400 },
      );
    }

    const review = await Review.create({
      product,
      buyer: buyer?.userId || undefined,
      name: buyer?.name || name,
      email: buyer?.email || email,
      companyName: buyer?.companyName || companyName || '',
      rating: r,
      title: title || '',
      comment,
      videoUrl: videoUrl || '',
      imageUrls: imageUrls || [],
      isApproved: false,
      isVerified: !!buyer,
      source: 'website',
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your review has been submitted and will appear once approved.',
      data: { _id: review._id.toString() },
    });
  } catch (err) {
    console.error('POST review error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
