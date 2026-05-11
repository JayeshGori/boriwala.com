'use client';

import Link from 'next/link';
import { FiArrowUpRight, FiPackage } from 'react-icons/fi';

type Subcategory = { name: string; slug: string };

type Category = {
  name: string;
  slug: string;
  desc: string;
  image: string;
  tag: string;
  subcategories?: Subcategory[];
};

const categories: Category[] = [
  {
    name: 'PP Bags/Fabric',
    slug: 'pp-bags-fabric',
    tag: 'Bestseller',
    desc: 'Heavy-duty woven polypropylene bags and patta fabric for cement, food grain, and industrial use.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcITV7hy05B9EERn2hqeD8frjgL-Px8aZ9pw&s',
    subcategories: [
      { name: 'Cement Bags', slug: 'cement-bags' },
      { name: 'Food Grain Bags', slug: 'food-grain-bags' },
      { name: 'Industrial Used PP Bags', slug: 'industrial-used-pp-bags' },
      { name: 'Patta Fabric', slug: 'patta-fabric' },
    ],
  },
  { name: 'BOPP Bags', slug: 'bopp-bags', tag: 'Premium', desc: 'Glossy BOPP laminated bags with high-quality printing.', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2Tv-UIEsSLcLDLxZd18n5333GlqHmV763UA&s' },
  { name: 'Jute Bags', slug: 'jute-bags', tag: 'Eco-Friendly', desc: 'Biodegradable jute sacks for sustainable packaging.', image: 'https://5.imimg.com/data5/SELLER/Default/2023/9/345402631/OA/UB/CM/149005756/jute-sack-bags-250x250.jpg' },
  { name: 'Monofilament Bags', slug: 'monofilament-bags', tag: 'Mesh', desc: 'Breathable mesh bags for onion, garlic & vegetables.', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpJ3FMBstLlzhML6SXBnuxNwlfHNDylH7L-Q&s' },
  { name: 'Leno Bags', slug: 'leno-bags', tag: 'Produce', desc: 'Tubular leno bags for potato and produce packing.', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNkixLS9_5XmWgtnmt9cEwEQ0cQzcZqg4IfA&s' },
  { name: 'PP Granules', slug: 'pp-granules', tag: 'Recycled', desc: 'Reprocessed polypropylene granules for manufacturing.', image: 'https://qualityplast.in/wp-content/uploads/2024/05/Untitled-design-86.jpeg' },
  { name: 'Used Worn Sarees', slug: 'used-worn-sarees', tag: 'Repurposed', desc: 'Sorted used sarees for vegetable & produce packing.', image: 'https://5.imimg.com/data5/SELLER/Default/2023/12/372859847/BW/EV/NQ/10324145/multicolor-old-saree.jpg' },
  { name: 'FIBC Jumbo Bags', slug: 'jumbo-bags', tag: 'Bulk', desc: 'Heavy-duty 1-ton jumbo bags for industrial bulk shipping.', image: 'https://5.imimg.com/data5/SELLER/Default/2021/6/PM/GF/RH/72368631/fibc-jumbo-bag-500x500.jpg' },
];

function FeaturedCard({ cat }: { cat: Category }) {
  return (
    <Link
      href={`/products?category=${cat.slug}`}
      className="group relative overflow-hidden rounded-3xl bg-slate-900 sm:col-span-2 lg:col-span-2 lg:row-span-2 min-h-[280px] lg:min-h-0 shadow-lg hover:shadow-2xl transition-all"
    >
      <img
        src={cat.image}
        alt={cat.name}
        className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a73e8]/70 via-slate-900/60 to-[#f46f25]/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

      {/* Top row: tag + watermark */}
      <div className="absolute top-5 left-5 right-5 flex justify-between items-center z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f46f25] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
          ⭐ {cat.tag}
        </span>
        <span className="text-white/50 text-[10px] font-semibold tracking-widest uppercase">Boriwala.com</span>
      </div>

      {/* Bottom content */}
      <div className="relative h-full flex flex-col justify-end p-6 lg:p-8 z-10">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-2xl lg:text-4xl font-extrabold text-white leading-tight drop-shadow-lg">{cat.name}</h3>
          <div className="shrink-0 w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:bg-[#f46f25] group-hover:border-[#f46f25] group-hover:rotate-45 transition-all duration-300">
            <FiArrowUpRight size={20} className="text-white" />
          </div>
        </div>
        <p className="text-sm lg:text-base text-slate-200 max-w-md drop-shadow mb-5 leading-relaxed">{cat.desc}</p>

        {cat.subcategories && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-white/15">
            {cat.subcategories.map((sub) => (
              <span
                key={sub.slug}
                className="text-xs font-medium text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/15 transition-colors"
              >
                {sub.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

function CategoryCard({ cat }: { cat: Category }) {
  return (
    <Link
      href={`/products?category=${cat.slug}`}
      className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 hover:border-[#f46f25] shadow-sm hover:shadow-2xl transition-all duration-300"
    >
      {/* Image area */}
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img
          src={cat.image}
          alt={cat.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />

        {/* Tag badge */}
        <span className="absolute top-3 left-3 inline-block px-2.5 py-1 bg-white/95 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-[#1a73e8] rounded-md shadow-sm">
          {cat.tag}
        </span>

        {/* Watermark */}
        <span className="absolute top-3 right-3 text-white/70 text-[9px] font-semibold tracking-widest uppercase drop-shadow">
          Boriwala
        </span>

        {/* Arrow */}
        <div className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#f46f25] group-hover:rotate-45 transition-all duration-300 shadow-md">
          <FiArrowUpRight size={16} className="text-slate-800 group-hover:text-white transition-colors" />
        </div>
      </div>

      {/* Text area */}
      <div className="p-5 relative">
        {/* Left accent bar */}
        <span className="absolute left-0 top-5 bottom-5 w-1 bg-gradient-to-b from-[#f46f25] to-[#1a73e8] rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity" />

        <h3 className="text-base font-bold text-slate-800 group-hover:text-[#1a73e8] transition-colors mb-1">
          {cat.name}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{cat.desc}</p>
      </div>
    </Link>
  );
}

export default function CategoryGrid() {
  const featured = categories[0];
  const rest = categories.slice(1);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-20 -left-32 w-72 h-72 bg-[#f46f25]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 -right-32 w-96 h-96 bg-[#1a73e8]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#f46f25]/10 text-[#f46f25] rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              <FiPackage size={14} /> What We Deal In
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              Product <span className="text-[#1a73e8]">Categories</span>
              <span className="inline-block w-2 h-2 rounded-full bg-[#f46f25] ml-2 align-baseline" />
            </h2>
            <p className="text-slate-500 mt-3 text-base leading-relaxed">
              From PP woven bags to FIBC jumbo bags — discover our complete range of industrial packaging and trading materials.
            </p>
          </div>
          <Link
            href="/categories"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-semibold rounded-full text-sm transition-all group"
          >
            View All
            <FiArrowUpRight className="group-hover:rotate-45 transition-transform" />
          </Link>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-fr">
          <FeaturedCard cat={featured} />
          {rest.map((cat) => (
            <CategoryCard key={cat.slug} cat={cat} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="text-center mt-10 md:hidden">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-slate-900 text-slate-900 font-semibold rounded-full text-sm"
          >
            View All Categories <FiArrowUpRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
