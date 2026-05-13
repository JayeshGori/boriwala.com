import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Banner from '@/lib/models/Banner';
import { authenticateRequest } from '@/lib/auth';

// GET /api/banners — public; returns active banners by default
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all') === 'true';

    const filter: Record<string, unknown> = all ? {} : { isActive: true };
    const banners = await Banner.find(filter).sort({ order: 1, createdAt: -1 }).lean();

    const data = banners.map((b) => ({ ...b, _id: b._id.toString() }));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('GET banners error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

// POST /api/banners — admin only
export async function POST(req: NextRequest) {
  try {
    const user = authenticateRequest(req);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const body = await req.json();

    if (!body.title || !body.image) {
      return NextResponse.json({ success: false, error: 'Title and image are required' }, { status: 400 });
    }

    // Auto-assign order if not provided
    if (typeof body.order !== 'number') {
      const last = await Banner.findOne().sort({ order: -1 }).lean();
      body.order = last ? (last.order ?? 0) + 1 : 0;
    }

    const banner = await Banner.create(body);
    return NextResponse.json({ success: true, data: banner }, { status: 201 });
  } catch (error) {
    console.error('POST banner error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
