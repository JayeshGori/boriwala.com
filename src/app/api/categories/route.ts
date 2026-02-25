import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/lib/models/Category';
import { authenticateRequest } from '@/lib/auth';
import { createSlug } from '@/lib/utils';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const parentOnly = searchParams.get('parentOnly') === 'true';
    const activeOnly = searchParams.get('activeOnly') !== 'false';

    const filter: Record<string, unknown> = {};
    if (parentOnly) filter.parent = null;
    if (activeOnly) filter.isActive = true;

    const categories = await Category.find(filter)
      .sort({ order: 1, name: 1 })
      .lean();

    // Attach subcategories
    if (parentOnly) {
      const allSubs = await Category.find({ parent: { $ne: null }, ...(activeOnly ? { isActive: true } : {}) })
        .sort({ order: 1, name: 1 })
        .lean();

      const categoriesWithSubs = categories.map((cat) => ({
        ...cat,
        _id: cat._id.toString(),
        subcategories: allSubs
          .filter((s) => s.parent?.toString() === cat._id.toString())
          .map((s) => ({ ...s, _id: s._id.toString(), parent: s.parent?.toString() })),
      }));

      return NextResponse.json({ success: true, data: categoriesWithSubs });
    }

    const data = categories.map((c) => ({ ...c, _id: c._id.toString(), parent: c.parent?.toString() || null }));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('GET categories error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = authenticateRequest(req);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const body = await req.json();
    const slug = createSlug(body.name);

    const existing = await Category.findOne({ slug });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Category with this name already exists' }, { status: 400 });
    }

    const category = await Category.create({ ...body, slug });
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    console.error('POST category error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
