import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { authenticateRequest } from '@/lib/auth';
import { createSlug } from '@/lib/utils';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    let category = searchParams.get('category');
    let subcategory = searchParams.get('subcategory');
    const condition = searchParams.get('condition');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const material = searchParams.get('material');
    const productType = searchParams.get('productType');
    const activeOnly = searchParams.get('activeOnly') !== 'false';
    const sort = searchParams.get('sort') || 'newest';

    // Resolve slug to ObjectId if needed
    const Category = (await import('@/lib/models/Category')).default;
    if (category && !category.match(/^[0-9a-fA-F]{24}$/)) {
      const cat = await Category.findOne({ slug: category }).lean();
      if (cat) category = cat._id.toString();
      else category = null;
    }
    if (subcategory && !subcategory.match(/^[0-9a-fA-F]{24}$/)) {
      const sub = await Category.findOne({ slug: subcategory }).lean();
      if (sub) subcategory = sub._id.toString();
      else subcategory = null;
    }

    const filter: Record<string, unknown> = {};
    if (activeOnly) filter.isActive = true;
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (condition) filter.condition = condition;
    if (featured === 'true') filter.isFeatured = true;
    if (material) filter.material = { $regex: material, $options: 'i' };
    if (productType) filter.productType = { $regex: productType, $options: 'i' };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { material: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by filterAttributes (e.g. ?fa_quality=gold&fa_gram=5)
    for (const [key, val] of searchParams.entries()) {
      if (key.startsWith('fa_') && val) {
        const attrKey = key.slice(3);
        filter[`filterAttributes.${attrKey}`] = val;
      }
    }

    // Sort options
    let sortObj: Record<string, 1 | -1> = { isFeatured: -1, createdAt: -1 };
    if (sort === 'oldest') sortObj = { createdAt: 1 };
    else if (sort === 'name_asc') sortObj = { name: 1 };
    else if (sort === 'name_desc') sortObj = { name: -1 };
    else if (sort === 'price_asc') sortObj = { price: 1 };
    else if (sort === 'price_desc') sortObj = { price: -1 };

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const data = products.map((p) => ({
      ...p,
      _id: p._id.toString(),
      category: p.category || null,
      subcategory: p.subcategory || null,
      filterAttributes: p.filterAttributes instanceof Map
        ? Object.fromEntries(p.filterAttributes)
        : (p.filterAttributes || {}),
    }));

    return NextResponse.json({
      success: true,
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('GET products error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = authenticateRequest(req);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const body = await req.json();
    let slug = createSlug(body.name);

    const existing = await Product.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const product = await Product.create({ ...body, slug });
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error('POST product error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
