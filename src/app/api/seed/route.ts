import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/lib/models/Category';
import Product from '@/lib/models/Product';
import Settings from '@/lib/models/Settings';
import User from '@/lib/models/User';
import { hashPassword } from '@/lib/auth';

const sampleCategories = [
  { name: 'PP Bags', slug: 'pp-bags', description: 'Polypropylene bags for industrial packaging', order: 1, icon: '📦' },
  { name: 'Jute Bags', slug: 'jute-bags', description: 'Eco-friendly jute bags for packaging', order: 2, icon: '🌿' },
  { name: 'Plastic Products', slug: 'plastic-products', description: 'Various plastic products for industrial use', order: 3, icon: '🏭' },
  { name: 'Packaging Materials', slug: 'packaging-materials', description: 'Industrial packaging materials', order: 4, icon: '📋' },
  { name: 'Scrap Materials', slug: 'scrap-materials', description: 'Recyclable scrap materials', order: 5, icon: '♻️' },
  { name: 'HDPE Bags', slug: 'hdpe-bags', description: 'High-density polyethylene bags', order: 6, icon: '🛍️' },
  { name: 'Cement Bags', slug: 'cement-bags', description: 'Heavy-duty cement packaging bags', order: 7, icon: '🏗️' },
  { name: 'Food Grain Bags', slug: 'food-grain-bags', description: 'Food-grade storage bags', order: 8, icon: '🌾' },
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

    // Create categories
    const existingCats = await Category.countDocuments();
    if (existingCats === 0) {
      const cats = await Category.insertMany(sampleCategories);

      // Create subcategories
      const subs = [
        { name: 'New PP Bags', slug: 'new-pp-bags', parent: cats[0]._id, order: 1 },
        { name: 'Used PP Bags', slug: 'used-pp-bags', parent: cats[0]._id, order: 2 },
        { name: 'Printed PP Bags', slug: 'printed-pp-bags', parent: cats[0]._id, order: 3 },
        { name: 'Coffee Jute Bags', slug: 'coffee-jute-bags', parent: cats[1]._id, order: 1 },
        { name: 'Decorative Jute Bags', slug: 'decorative-jute-bags', parent: cats[1]._id, order: 2 },
      ];
      await Category.insertMany(subs);

      // Create sample products
      const sampleProducts = [
        {
          name: 'White PP Woven Bag 50kg',
          slug: 'white-pp-woven-bag-50kg',
          description: 'High-quality white polypropylene woven bag suitable for packaging grains, fertilizers, and industrial materials. Made from virgin PP material with UV stabilization for outdoor storage.',
          shortDescription: 'Premium white PP woven bag for 50kg capacity',
          category: cats[0]._id,
          condition: 'new',
          showPrice: true,
          price: 15,
          specifications: [
            { key: 'Material', value: 'Polypropylene' },
            { key: 'Capacity', value: '50 kg' },
            { key: 'Size', value: '26 x 40 inches' },
            { key: 'GSM', value: '70-80' },
            { key: 'Color', value: 'White' },
          ],
          moq: '1000 pieces',
          availability: 'in_stock',
          isFeatured: true,
          tags: ['pp bag', 'woven bag', 'packaging'],
          material: 'Polypropylene',
          productType: 'Woven Bags',
        },
        {
          name: 'Used PP Bags - Cleaned',
          slug: 'used-pp-bags-cleaned',
          description: 'Quality-checked used PP bags, thoroughly cleaned and sorted. Ideal for cost-effective packaging solutions. Available in bulk quantities.',
          shortDescription: 'Cleaned used PP bags at competitive prices',
          category: cats[0]._id,
          condition: 'old',
          showPrice: false,
          specifications: [
            { key: 'Material', value: 'Polypropylene' },
            { key: 'Condition', value: 'Cleaned & Sorted' },
            { key: 'Size', value: 'Mixed sizes available' },
          ],
          moq: '5000 pieces',
          availability: 'in_stock',
          isFeatured: true,
          tags: ['used bags', 'pp bag', 'recycled'],
          material: 'Polypropylene',
          productType: 'Used Bags',
        },
        {
          name: 'Premium Jute Sack',
          slug: 'premium-jute-sack',
          description: 'Premium quality jute sack for food grain storage. Biodegradable and eco-friendly packaging solution with excellent breathability.',
          shortDescription: 'Eco-friendly premium jute sack for grain storage',
          category: cats[1]._id,
          condition: 'new',
          showPrice: true,
          price: 45,
          specifications: [
            { key: 'Material', value: 'Jute' },
            { key: 'Capacity', value: '100 kg' },
            { key: 'Type', value: 'B-Twill' },
            { key: 'Certification', value: 'JMDC Approved' },
          ],
          moq: '500 pieces',
          availability: 'in_stock',
          isFeatured: true,
          tags: ['jute bag', 'eco-friendly', 'grain storage'],
          material: 'Jute',
          productType: 'Sacks',
        },
        {
          name: 'HDPE Tarpaulin Sheet',
          slug: 'hdpe-tarpaulin-sheet',
          description: 'Heavy-duty HDPE tarpaulin sheet with UV protection. Waterproof and tear-resistant, ideal for covering goods and industrial use.',
          shortDescription: 'Heavy-duty waterproof tarpaulin for industrial use',
          category: cats[2]._id,
          condition: 'new',
          showPrice: true,
          price: 120,
          specifications: [
            { key: 'Material', value: 'HDPE' },
            { key: 'GSM', value: '120-200' },
            { key: 'Feature', value: 'UV Stabilized' },
            { key: 'Waterproof', value: 'Yes' },
          ],
          moq: '100 pieces',
          availability: 'in_stock',
          isFeatured: true,
          tags: ['tarpaulin', 'hdpe', 'waterproof'],
          material: 'HDPE',
          productType: 'Tarpaulin',
        },
        {
          name: 'Stretch Wrap Film',
          slug: 'stretch-wrap-film',
          description: 'High-quality stretch wrap film for pallet wrapping and packaging. Excellent cling and load stability.',
          shortDescription: 'Industrial stretch wrap for pallet packaging',
          category: cats[3]._id,
          condition: 'new',
          showPrice: false,
          specifications: [
            { key: 'Material', value: 'LLDPE' },
            { key: 'Width', value: '500mm' },
            { key: 'Thickness', value: '23 micron' },
            { key: 'Roll Length', value: '300m' },
          ],
          moq: '50 rolls',
          availability: 'in_stock',
          isFeatured: false,
          tags: ['stretch film', 'packaging', 'pallet wrap'],
          material: 'LLDPE',
          productType: 'Films',
        },
        {
          name: 'PP Scrap Granules',
          slug: 'pp-scrap-granules',
          description: 'Recycled PP scrap granules suitable for injection molding and extrusion. Consistent quality with competitive pricing.',
          shortDescription: 'Recycled PP granules for manufacturing',
          category: cats[4]._id,
          condition: 'old',
          showPrice: false,
          specifications: [
            { key: 'Material', value: 'Recycled PP' },
            { key: 'Form', value: 'Granules' },
            { key: 'MFI', value: '8-12 g/10min' },
            { key: 'Color', value: 'Natural / Mixed' },
          ],
          moq: '1 ton',
          availability: 'on_demand',
          isFeatured: false,
          tags: ['scrap', 'recycled', 'granules'],
          material: 'PP Recycled',
          productType: 'Raw Material',
        },
      ];

      await Product.insertMany(sampleProducts);
    }

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
        aboutUs: 'Boriwala Trading Co. is a leading B2B trading company with over 15 years of experience in the packaging industry. We specialize in PP Bags, Jute Bags, Plastic Products, Industrial Packaging Materials, and Scrap Materials. Our commitment to quality, competitive pricing, and reliable service has made us a trusted partner for businesses across India.',
        aboutUsShort: 'Leading B2B trading company dealing in PP Bags, Jute Bags, Plastic Products & Industrial Packaging Materials since 2009.',
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
        heroSubtitle: 'Dealing in PP Bags, Jute Bags, Plastic Products, Packaging Materials & Scrap Materials — Serving Industries Across India',
        googleMapEmbed: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.5!2d72.85!3d19.04!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDAyJzI0LjAiTiA3MsKwNTEnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>',
      });
    }

    return NextResponse.json({ success: true, message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ success: false, error: 'Seed failed' }, { status: 500 });
  }
}
