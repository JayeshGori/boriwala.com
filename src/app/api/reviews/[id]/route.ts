import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/lib/models/Review';
import { authenticateRequest } from '@/lib/auth';

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const admin = authenticateRequest(req);
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    await dbConnect();
    const { id } = await ctx.params;
    const body = await req.json();
    const allowed = ['isApproved', 'isFeatured', 'isVerified', 'rating', 'title', 'comment', 'name', 'companyName', 'videoUrl', 'imageUrls'];
    const update: Record<string, unknown> = {};
    for (const k of allowed) if (body[k] !== undefined) update[k] = body[k];
    const r = await Review.findByIdAndUpdate(id, update, { new: true });
    if (!r) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: r });
  } catch (err) {
    console.error('PUT review error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const admin = authenticateRequest(req);
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    await dbConnect();
    const { id } = await ctx.params;
    await Review.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE review error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

// Admin manual create
export async function POST(req: NextRequest) {
  try {
    const admin = authenticateRequest(req);
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    await dbConnect();
    const body = await req.json();
    const review = await Review.create({
      ...body,
      isApproved: body.isApproved !== false,
      source: 'admin',
    });
    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (err) {
    console.error('Admin POST review error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
