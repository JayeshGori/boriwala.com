import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { authenticateRequest } from '@/lib/auth';
import { createSlug } from '@/lib/utils';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    // Try by ID first, then by slug
    let product = await Product.findById(id)
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .lean()
      .catch(() => null);

    if (!product) {
      product = await Product.findOne({ slug: id })
        .populate('category', 'name slug')
        .populate('subcategory', 'name slug')
        .lean();
    }

    if (!product) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { ...product, _id: product._id.toString() } });
  } catch (error) {
    console.error('GET product error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = authenticateRequest(req);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    if (body.name) {
      body.slug = createSlug(body.name);
      const existing = await Product.findOne({ slug: body.slug, _id: { $ne: id } });
      if (existing) body.slug = `${body.slug}-${Date.now()}`;
    }

    const product = await Product.findByIdAndUpdate(id, body, { new: true })
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug');

    if (!product) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('PUT product error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = authenticateRequest(req);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const { id } = await params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error) {
    console.error('DELETE product error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
