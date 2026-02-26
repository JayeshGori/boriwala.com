import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/lib/models/Category';
import Product from '@/lib/models/Product';
import Settings from '@/lib/models/Settings';
import User from '@/lib/models/User';
import { hashPassword } from '@/lib/auth';

const parentCategories = [
  { name: 'PP Bags', slug: 'pp-bags', description: 'New & used polypropylene woven bags for industrial packaging', order: 1, icon: '📦' },
  { name: 'BOPP Bags', slug: 'bopp-bags', description: 'Biaxially oriented polypropylene bags for premium packaging', order: 2, icon: '🏷️' },
  { name: 'Jute Bags', slug: 'jute-bags', description: 'Eco-friendly jute bags for packaging and storage', order: 3, icon: '🌿' },
  { name: 'Cement Bags', slug: 'cement-bags', description: 'Heavy-duty cement packaging bags', order: 4, icon: '🏗️' },
  { name: 'Food Grain Bags', slug: 'food-grain-bags', description: 'Food-grade bags for grain storage and transport', order: 5, icon: '�' },
  { name: 'Monofilament Bags', slug: 'monofilament-bags', description: 'Monofilament mesh bags for vegetables and produce', order: 6, icon: '🧅' },
  { name: 'PP Granules', slug: 'pp-granules', description: 'Reprocessed polypropylene granules from rafiya bags', order: 7, icon: '⚙️' },
  { name: 'Belar Twine', slug: 'belar-twine', description: 'Industrial belar twine for baling and tying', order: 8, icon: '🧵' },
  { name: 'Lacha Sutli', slug: 'lacha-sutli', description: 'Virgin and semi-virgin lacha sutli rope', order: 9, icon: '🪢' },
  { name: 'Anti Slip Bags', slug: 'anti-slip-bags', description: 'Anti-slip bags for HAL and FCI applications', order: 10, icon: '🛡️' },
  { name: 'Leno Bags', slug: 'leno-bags', description: 'Leno mesh bags for onion, potato and fruit packing', order: 11, icon: '🥔' },
  { name: 'Jumbo Bags', slug: 'jumbo-bags', description: 'FIBC jumbo bags for bulk material handling', order: 12, icon: '�' },
  { name: 'Industrial Used PP Bags', slug: 'industrial-used-pp-bags', description: 'Bulk industrial-grade used PP bags', order: 13, icon: '♻️' },
  { name: 'Patta Fabric (Chalakha)', slug: 'patta-fabric', description: 'PP woven patta fabric / chalakha rolls', order: 14, icon: '🧶' },
  { name: 'Used Worn Sarees', slug: 'used-worn-sarees', description: 'Used worn sarees for vegetable packing', order: 15, icon: '👗' },
];

// subcategory slug → parent index mapping
const subcategoryData: { name: string; slug: string; parentIdx: number; order: number }[] = [
  // PP Bags (0)
  { name: 'New PP Bags', slug: 'new-pp-bags', parentIdx: 0, order: 1 },
  { name: 'Used PP Bags', slug: 'used-pp-bags', parentIdx: 0, order: 2 },
  // BOPP Bags (1)
  { name: 'New BOPP Bags', slug: 'new-bopp-bags', parentIdx: 1, order: 1 },
  { name: 'Used BOPP Bags', slug: 'used-bopp-bags', parentIdx: 1, order: 2 },
  // Jute Bags (2)
  { name: 'New Jute Bags', slug: 'new-jute-bags', parentIdx: 2, order: 1 },
  { name: 'Used Jute Bags', slug: 'used-jute-bags', parentIdx: 2, order: 2 },
  // Cement Bags (3)
  { name: 'New Cement Bags', slug: 'new-cement-bags', parentIdx: 3, order: 1 },
  { name: 'Used Cement Bags', slug: 'used-cement-bags', parentIdx: 3, order: 2 },
  { name: 'Rejected Cement Bags', slug: 'rejected-cement-bags', parentIdx: 3, order: 3 },
  // Monofilament Bags (5)
  { name: 'For Onion Packing', slug: 'monofilament-onion', parentIdx: 5, order: 1 },
  { name: 'For Garlic Packing', slug: 'monofilament-garlic', parentIdx: 5, order: 2 },
  // PP Granules (6)
  { name: 'Rafiya Grade', slug: 'rafiya-grade', parentIdx: 6, order: 1 },
  { name: 'RP Grade', slug: 'rp-grade', parentIdx: 6, order: 2 },
  // Lacha Sutli (8)
  { name: 'Virgin', slug: 'lacha-sutli-virgin', parentIdx: 8, order: 1 },
  { name: 'Semi Virgin', slug: 'lacha-sutli-semi-virgin', parentIdx: 8, order: 2 },
  // Anti Slip Bags (9)
  { name: 'HAL Anti Slip Bags', slug: 'hal-anti-slip-bags', parentIdx: 9, order: 1 },
  { name: 'FCI Anti Slip Bags', slug: 'fci-anti-slip-bags', parentIdx: 9, order: 2 },
  // Leno Bags (10)
  { name: 'Onion Packing', slug: 'leno-onion', parentIdx: 10, order: 1 },
  { name: 'Potato Packing', slug: 'leno-potato', parentIdx: 10, order: 2 },
  { name: 'Fruits Leno Bags', slug: 'leno-fruits', parentIdx: 10, order: 3 },
  // Jumbo Bags (11)
  { name: 'New Jumbo Bags', slug: 'new-jumbo-bags', parentIdx: 11, order: 1 },
  { name: 'Used Jumbo Bags', slug: 'used-jumbo-bags', parentIdx: 11, order: 2 },
  // Used Worn Sarees (14)
  { name: 'Vegetable Packing Sarees', slug: 'vegetable-packing-sarees', parentIdx: 14, order: 1 },
];

export async function POST() {
  try {
    await dbConnect();

    // Create admin user
    const existingUser = await User.findOne({ email: 'admin@boriwala.com' });
    if (!existingUser) {
      await User.create({
        name: 'Admin',
        email: 'admin@boriwala.com',
        password: await hashPassword('admin123'),
        role: 'admin',
      });
    }

    // Clear old data and recreate
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Create parent categories
    const cats = await Category.insertMany(parentCategories);

    // Create subcategories
    const subs = subcategoryData.map((s) => ({
      name: s.name,
      slug: s.slug,
      parent: cats[s.parentIdx]._id,
      order: s.order,
    }));
    await Category.insertMany(subs);

    // Create sample products across categories
    const sampleProducts = [
      {
        name: 'White PP Woven Bag 50kg - Super Gold',
        slug: 'white-pp-woven-bag-50kg-super-gold',
        description: 'High-quality white polypropylene woven bag suitable for packaging grains, fertilizers, and industrial materials. Super Gold quality with UV stabilization.',
        shortDescription: 'Super Gold quality PP woven bag, 50kg capacity',
        category: cats[0]._id,
        condition: 'new',
        showPrice: false,
        specifications: [
          { key: 'Material', value: 'Polypropylene' },
          { key: 'Capacity', value: '50 kg' },
          { key: 'Size', value: '26 x 40 inches' },
          { key: 'GSM', value: '70-80' },
          { key: 'Quality', value: 'Super Gold' },
        ],
        filterAttributes: { quality: 'super-gold', gram: '4', lamination: 'laminated', fillerContent: '10-20' },
        moq: '1000 pieces',
        availability: 'in_stock',
        isFeatured: true,
        tags: ['pp bag', 'woven bag', 'packaging', 'super gold'],
        material: 'Polypropylene',
      },
      {
        name: 'Used PP Bags - Cleaned & Sorted',
        slug: 'used-pp-bags-cleaned-sorted',
        description: 'Quality-checked used PP bags, thoroughly cleaned and sorted. Ideal for cost-effective packaging solutions. Available in bulk.',
        shortDescription: 'Cleaned used PP bags at competitive prices',
        category: cats[0]._id,
        condition: 'old',
        showPrice: false,
        specifications: [
          { key: 'Condition', value: 'Cleaned & Sorted' },
          { key: 'Size', value: 'Mixed sizes available' },
        ],
        moq: '5000 pieces',
        availability: 'in_stock',
        isFeatured: true,
        tags: ['used bags', 'pp bag', 'recycled'],
        material: 'Polypropylene',
      },
      {
        name: 'BOPP Laminated Bag - Gold Quality',
        slug: 'bopp-laminated-bag-gold',
        description: 'Premium BOPP laminated bag with excellent print quality and moisture barrier. Gold quality grade for food and fertilizer packaging.',
        shortDescription: 'Gold quality BOPP laminated bag',
        category: cats[1]._id,
        condition: 'new',
        showPrice: false,
        specifications: [
          { key: 'Material', value: 'BOPP Laminated PP' },
          { key: 'Quality', value: 'Gold' },
          { key: 'Lamination', value: 'BOPP Film' },
        ],
        filterAttributes: { quality: 'gold', gram: '5', lamination: 'laminated', fillerContent: '5-10' },
        moq: '2000 pieces',
        availability: 'in_stock',
        isFeatured: true,
        tags: ['bopp bag', 'laminated', 'gold quality'],
        material: 'BOPP',
      },
      {
        name: 'New Jute Sack - B-Twill',
        slug: 'new-jute-sack-b-twill',
        description: 'Premium quality new jute sack for food grain storage. Biodegradable and eco-friendly with excellent breathability. JMDC approved.',
        shortDescription: 'B-Twill jute sack for grain storage',
        category: cats[2]._id,
        condition: 'new',
        showPrice: false,
        specifications: [
          { key: 'Material', value: 'Jute' },
          { key: 'Type', value: 'B-Twill' },
          { key: 'Capacity', value: '100 kg' },
        ],
        moq: '500 pieces',
        availability: 'in_stock',
        isFeatured: true,
        tags: ['jute bag', 'eco-friendly', 'grain storage'],
        material: 'Jute',
      },
      {
        name: 'New Cement Bag - 50kg Heavy Duty',
        slug: 'new-cement-bag-50kg',
        description: 'Heavy-duty PP woven cement bag designed for 50kg capacity. High tear resistance and moisture protection for cement packaging.',
        shortDescription: '50kg heavy-duty cement packaging bag',
        category: cats[3]._id,
        condition: 'new',
        showPrice: false,
        specifications: [
          { key: 'Capacity', value: '50 kg' },
          { key: 'Material', value: 'PP Woven' },
          { key: 'Feature', value: 'Moisture Barrier' },
        ],
        moq: '5000 pieces',
        availability: 'in_stock',
        isFeatured: true,
        tags: ['cement bag', 'heavy duty', 'packaging'],
        material: 'Polypropylene',
      },
      {
        name: 'Food Grain Storage Bag - 50kg',
        slug: 'food-grain-bag-50kg',
        description: 'Food-grade PP woven bag for storing rice, wheat, pulses and other grains. Safe for food contact with inner lamination.',
        shortDescription: 'Food-grade bag for grain storage',
        category: cats[4]._id,
        condition: 'new',
        showPrice: false,
        specifications: [
          { key: 'Capacity', value: '50 kg' },
          { key: 'Material', value: 'Food-grade PP' },
          { key: 'Inner Lining', value: 'Laminated' },
        ],
        moq: '2000 pieces',
        availability: 'in_stock',
        isFeatured: false,
        tags: ['food grain', 'storage', 'food grade'],
        material: 'Polypropylene',
      },
      {
        name: 'Monofilament Onion Bag - Red',
        slug: 'monofilament-onion-bag-red',
        description: 'Red monofilament mesh bag for onion packing. Excellent ventilation keeps produce fresh during transport and storage.',
        shortDescription: 'Red mesh bag for onion packing',
        category: cats[5]._id,
        condition: 'new',
        showPrice: false,
        specifications: [
          { key: 'Color', value: 'Red' },
          { key: 'Capacity', value: '25-50 kg' },
          { key: 'Type', value: 'Monofilament Mesh' },
        ],
        moq: '5000 pieces',
        availability: 'in_stock',
        isFeatured: false,
        tags: ['monofilament', 'onion bag', 'mesh bag'],
        material: 'PP Monofilament',
      },
      {
        name: 'Reprocessed PP Granules - Rafiya Grade',
        slug: 'reprocessed-pp-granules-rafiya',
        description: 'High-quality reprocessed PP granules from rafiya bags. Suitable for raffia tape extrusion with consistent MFI and low moisture content.',
        shortDescription: 'Rafiya grade reprocessed PP granules',
        category: cats[6]._id,
        condition: 'old',
        showPrice: false,
        specifications: [
          { key: 'Grade', value: 'Rafiya' },
          { key: 'MFI', value: '4-6 g/10min' },
          { key: 'Color', value: 'Natural' },
          { key: 'Moisture', value: 'Low' },
        ],
        filterAttributes: { grade: 'rafiya', mfi: '4-6', color: 'natural', moisture: 'low', contamination: 'clean', application: 'raffia-tape' },
        moq: '1 ton',
        availability: 'in_stock',
        isFeatured: true,
        tags: ['pp granules', 'rafiya', 'recycled', 'reprocessed'],
        material: 'Recycled PP',
      },
      {
        name: 'Leno Bag for Potato - 50kg',
        slug: 'leno-bag-potato-50kg',
        description: 'Durable leno mesh bag for potato packing. Strong mesh construction allows air circulation and easy visual inspection of produce.',
        shortDescription: 'Leno mesh bag for potato packing',
        category: cats[10]._id,
        condition: 'new',
        showPrice: false,
        specifications: [
          { key: 'Capacity', value: '50 kg' },
          { key: 'Type', value: 'Leno Mesh' },
          { key: 'Application', value: 'Potato Packing' },
        ],
        moq: '5000 pieces',
        availability: 'in_stock',
        isFeatured: false,
        tags: ['leno bag', 'potato', 'mesh bag'],
        material: 'PP',
      },
      {
        name: 'New Jumbo Bag - 1 Ton FIBC',
        slug: 'new-jumbo-bag-1-ton',
        description: 'Brand new FIBC jumbo bag with 1 ton capacity. 4-loop design with top fill spout and bottom discharge. UV stabilized for outdoor use.',
        shortDescription: '1 ton capacity FIBC jumbo bag',
        category: cats[11]._id,
        condition: 'new',
        showPrice: false,
        specifications: [
          { key: 'Capacity', value: '1000 kg' },
          { key: 'Loops', value: '4-Loop' },
          { key: 'Feature', value: 'UV Stabilized' },
          { key: 'Top', value: 'Fill Spout' },
        ],
        moq: '100 pieces',
        availability: 'in_stock',
        isFeatured: true,
        tags: ['jumbo bag', 'fibc', 'bulk bag'],
        material: 'Polypropylene',
      },
    ];

    await Product.insertMany(sampleProducts);

    // Create default settings
    const existingSettings = await Settings.findOne();
    if (!existingSettings) {
      await Settings.create({
        companyName: 'Boriwala Trading Co.',
        tagline: 'Your Trusted B2B Trading Partner',
        phone: ['+91 99999 99999', '+91 88888 88888'],
        email: ['info@boriwala.com', 'sales@boriwala.com'],
        address: '123, Industrial Area, Dharavi, Mumbai - 400017, Maharashtra, India',
        whatsappNumber: '919999999999',
        aboutUs: 'Boriwala Trading Co. is a leading B2B trading company with over 15 years of experience in the packaging industry. We specialize in PP Bags, BOPP Bags, Jute Bags, Cement Bags, PP Granules, Jumbo Bags, Leno Bags, and Industrial Packaging Materials. Our commitment to quality, competitive pricing, and reliable service has made us a trusted partner for businesses across India.',
        aboutUsShort: 'Leading B2B trading company dealing in PP Bags, BOPP Bags, Jute Bags, Cement Bags, PP Granules & Industrial Packaging since 2009.',
        experience: '15+ Years',
        infrastructure: 'Our state-of-the-art warehouse and distribution center spans over 50,000 sq. ft., equipped with modern storage facilities and efficient logistics systems.',
        strengths: [
          'Quality Assured Products',
          'Competitive Market Pricing',
          'Pan India Delivery Network',
          'Bulk Order Specialists',
          'Custom Packaging Solutions',
          'Reliable & Timely Service',
          '15+ Years Industry Experience',
          'Wide Product Range',
        ],
        heroTitle: 'Your Trusted B2B Trading Partner',
        heroSubtitle: 'Dealing in PP Bags, BOPP Bags, Jute Bags, Cement Bags, PP Granules, Jumbo Bags & Industrial Packaging — Serving Industries Across India',
        googleMapEmbed: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.5!2d72.85!3d19.04!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDAyJzI0LjAiTiA3MsKwNTEnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>',
      });
    }

    return NextResponse.json({ success: true, message: 'Database seeded with new category structure' });
  } catch (error) {
    console.error('Seed error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: `Seed failed: ${message}` }, { status: 500 });
  }
}
