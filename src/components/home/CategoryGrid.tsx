'use client';

import Link from 'next/link';
import { FiArrowRight, FiPackage } from 'react-icons/fi';
import { ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/*  SVG Illustrations                                                  */
/* ------------------------------------------------------------------ */

function PPBagSVG() {
  return (
    <svg viewBox="0 0 100 100" width="100" height="100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bag body */}
      <rect x="20" y="25" width="60" height="65" rx="3" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2" />
      {/* Cross-hatch woven pattern */}
      <line x1="28" y1="25" x2="28" y2="90" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      <line x1="36" y1="25" x2="36" y2="90" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      <line x1="44" y1="25" x2="44" y2="90" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      <line x1="52" y1="25" x2="52" y2="90" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      <line x1="60" y1="25" x2="60" y2="90" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      <line x1="68" y1="25" x2="68" y2="90" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      <line x1="20" y1="35" x2="80" y2="35" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      <line x1="20" y1="45" x2="80" y2="45" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      <line x1="20" y1="55" x2="80" y2="55" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      <line x1="20" y1="65" x2="80" y2="65" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      <line x1="20" y1="75" x2="80" y2="75" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      <line x1="20" y1="85" x2="80" y2="85" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      {/* Top fold / opening */}
      <path d="M20 25 L30 15 L70 15 L80 25" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.08" />
      {/* Stitching line */}
      <line x1="22" y1="28" x2="78" y2="28" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.5" />
    </svg>
  );
}

function BOPPBagSVG() {
  return (
    <svg viewBox="0 0 100 100" width="100" height="100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bag body with rounded corners */}
      <rect x="22" y="20" width="56" height="70" rx="4" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2" />
      {/* Glossy shine marks */}
      <path d="M30 25 L30 80" stroke="currentColor" strokeWidth="3" opacity="0.12" strokeLinecap="round" />
      <path d="M36 30 L36 75" stroke="currentColor" strokeWidth="1.5" opacity="0.08" strokeLinecap="round" />
      {/* Sparkle / shine */}
      <path d="M62 32 L65 28 L68 32 L65 36 Z" fill="currentColor" opacity="0.5" />
      <path d="M58 24 L59.5 21 L61 24 L59.5 27 Z" fill="currentColor" opacity="0.35" />
      <path d="M70 40 L71.5 37.5 L73 40 L71.5 42.5 Z" fill="currentColor" opacity="0.3" />
      {/* Print area rectangle */}
      <rect x="32" y="42" width="36" height="24" rx="2" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.35" />
      {/* Label lines inside print area */}
      <line x1="36" y1="50" x2="64" y2="50" stroke="currentColor" strokeWidth="2" opacity="0.25" strokeLinecap="round" />
      <line x1="36" y1="56" x2="56" y2="56" stroke="currentColor" strokeWidth="2" opacity="0.25" strokeLinecap="round" />
      {/* Top seal line */}
      <line x1="22" y1="24" x2="78" y2="24" stroke="currentColor" strokeWidth="2.5" opacity="0.4" />
    </svg>
  );
}

function JuteBagSVG() {
  return (
    <svg viewBox="0 0 100 100" width="100" height="100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bag body - sack shape */}
      <path d="M25 30 Q22 55 24 88 L76 88 Q78 55 75 30 Z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2" />
      {/* Gathered top with rope */}
      <path d="M25 30 Q35 22 50 22 Q65 22 75 30" stroke="currentColor" strokeWidth="2" fill="none" />
      {/* Rope tie */}
      <ellipse cx="50" cy="26" rx="12" ry="4" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" />
      {/* Rope knot */}
      <circle cx="50" cy="18" r="3" fill="currentColor" opacity="0.4" />
      <path d="M47 18 Q44 10 48 8 M53 18 Q56 10 52 8" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" />
      {/* Burlap/jute texture - diagonal cross lines */}
      <line x1="30" y1="35" x2="35" y2="85" stroke="currentColor" strokeWidth="0.7" opacity="0.2" />
      <line x1="40" y1="33" x2="42" y2="85" stroke="currentColor" strokeWidth="0.7" opacity="0.2" />
      <line x1="50" y1="32" x2="50" y2="85" stroke="currentColor" strokeWidth="0.7" opacity="0.2" />
      <line x1="60" y1="33" x2="58" y2="85" stroke="currentColor" strokeWidth="0.7" opacity="0.2" />
      <line x1="70" y1="35" x2="65" y2="85" stroke="currentColor" strokeWidth="0.7" opacity="0.2" />
      <line x1="25" y1="45" x2="75" y2="45" stroke="currentColor" strokeWidth="0.7" opacity="0.2" />
      <line x1="24" y1="58" x2="76" y2="58" stroke="currentColor" strokeWidth="0.7" opacity="0.2" />
      <line x1="24" y1="71" x2="76" y2="71" stroke="currentColor" strokeWidth="0.7" opacity="0.2" />
    </svg>
  );
}

function MonofilamentBagSVG() {
  return (
    <svg viewBox="0 0 100 100" width="100" height="100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bag outline */}
      <path d="M25 20 L25 88 L75 88 L75 20 Z" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.05" />
      {/* Mesh grid pattern */}
      {[28, 36, 44, 52, 60, 68].map((x) => (
        <line key={`v${x}`} x1={x} y1="20" x2={x} y2="88" stroke="currentColor" strokeWidth="1" opacity="0.25" />
      ))}
      {[28, 36, 44, 52, 60, 68, 76, 84].map((y) => (
        <line key={`h${y}`} x1="25" y1={y} x2="75" y2={y} stroke="currentColor" strokeWidth="1" opacity="0.25" />
      ))}
      {/* Produce shapes visible through mesh */}
      <circle cx="42" cy="55" r="7" fill="currentColor" opacity="0.15" />
      <circle cx="58" cy="50" r="6" fill="currentColor" opacity="0.12" />
      <circle cx="50" cy="68" r="7" fill="currentColor" opacity="0.15" />
      <circle cx="38" cy="72" r="5" fill="currentColor" opacity="0.1" />
      <circle cx="62" cy="65" r="5.5" fill="currentColor" opacity="0.12" />
      {/* Top gathered */}
      <path d="M25 20 L35 14 L65 14 L75 20" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

function LenoBagSVG() {
  return (
    <svg viewBox="0 0 100 100" width="100" height="100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Tubular bag shape */}
      <path d="M28 18 Q25 50 27 85 Q35 90 50 90 Q65 90 73 85 Q75 50 72 18" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.08" />
      {/* Leno weave - twisted pairs */}
      <path d="M35 22 Q37 35 34 50 Q32 65 35 85" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <path d="M43 20 Q45 35 42 50 Q40 65 43 85" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <path d="M50 19 Q50 40 50 60 Q50 75 50 88" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <path d="M57 20 Q55 35 58 50 Q60 65 57 85" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <path d="M65 22 Q63 35 66 50 Q68 65 65 85" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      {/* Horizontal leno weave */}
      <path d="M28 30 Q50 28 72 30" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
      <path d="M27 42 Q50 40 73 42" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
      <path d="M27 54 Q50 52 73 54" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
      <path d="M27 66 Q50 64 73 66" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
      <path d="M28 78 Q50 76 72 78" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
      {/* Top closure */}
      <line x1="28" y1="18" x2="72" y2="18" stroke="currentColor" strokeWidth="2.5" opacity="0.5" strokeLinecap="round" />
    </svg>
  );
}

function PPGranulesSVG() {
  return (
    <svg viewBox="0 0 100 100" width="100" height="100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Pile of granules */}
      {/* Bottom row */}
      <ellipse cx="35" cy="78" rx="5" ry="4.5" fill="currentColor" opacity="0.3" />
      <ellipse cx="46" cy="80" rx="5" ry="4.5" fill="currentColor" opacity="0.25" />
      <ellipse cx="57" cy="79" rx="5" ry="4.5" fill="currentColor" opacity="0.3" />
      <ellipse cx="67" cy="78" rx="5" ry="4.5" fill="currentColor" opacity="0.25" />
      <ellipse cx="28" cy="76" rx="4.5" ry="4" fill="currentColor" opacity="0.2" />
      <ellipse cx="74" cy="77" rx="4.5" ry="4" fill="currentColor" opacity="0.2" />
      {/* Middle row */}
      <ellipse cx="40" cy="68" rx="5" ry="4.5" fill="currentColor" opacity="0.35" />
      <ellipse cx="51" cy="70" rx="5" ry="4.5" fill="currentColor" opacity="0.3" />
      <ellipse cx="62" cy="69" rx="5" ry="4.5" fill="currentColor" opacity="0.35" />
      <ellipse cx="33" cy="70" rx="4" ry="3.5" fill="currentColor" opacity="0.25" />
      <ellipse cx="70" cy="70" rx="4" ry="3.5" fill="currentColor" opacity="0.25" />
      {/* Top row */}
      <ellipse cx="45" cy="60" rx="5" ry="4.5" fill="currentColor" opacity="0.4" />
      <ellipse cx="56" cy="61" rx="5" ry="4.5" fill="currentColor" opacity="0.35" />
      {/* Peak */}
      <ellipse cx="50" cy="52" rx="4.5" ry="4" fill="currentColor" opacity="0.45" />
      {/* Scattered granules */}
      <ellipse cx="20" cy="82" rx="3.5" ry="3" fill="currentColor" opacity="0.15" />
      <ellipse cx="82" cy="83" rx="3" ry="2.5" fill="currentColor" opacity="0.12" />
      <ellipse cx="15" cy="86" rx="3" ry="2.5" fill="currentColor" opacity="0.1" />
      {/* Recycling arrows hint */}
      <path d="M42 35 L50 28 L58 35" stroke="currentColor" strokeWidth="2" opacity="0.3" fill="none" strokeLinecap="round" />
      <path d="M58 35 L58 42 L50 42" stroke="currentColor" strokeWidth="2" opacity="0.3" fill="none" strokeLinecap="round" />
      <path d="M42 35 L42 42 L50 42" stroke="currentColor" strokeWidth="2" opacity="0.3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function SareesSVG() {
  return (
    <svg viewBox="0 0 100 100" width="100" height="100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Stack of folded textiles */}
      {/* Bottom textile */}
      <rect x="22" y="70" width="56" height="10" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.2" />
      <line x1="25" y1="75" x2="75" y2="75" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      {/* Second textile */}
      <rect x="24" y="58" width="52" height="10" rx="2" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.2" />
      <line x1="27" y1="63" x2="73" y2="63" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
      {/* Pattern dots on second */}
      <circle cx="35" cy="63" r="1" fill="currentColor" opacity="0.3" />
      <circle cx="45" cy="63" r="1" fill="currentColor" opacity="0.3" />
      <circle cx="55" cy="63" r="1" fill="currentColor" opacity="0.3" />
      <circle cx="65" cy="63" r="1" fill="currentColor" opacity="0.3" />
      {/* Third textile */}
      <rect x="26" y="46" width="48" height="10" rx="2" fill="currentColor" opacity="0.25" stroke="currentColor" strokeWidth="1.2" />
      {/* Stripe pattern */}
      <line x1="30" y1="46" x2="30" y2="56" stroke="currentColor" strokeWidth="0.6" opacity="0.2" />
      <line x1="38" y1="46" x2="38" y2="56" stroke="currentColor" strokeWidth="0.6" opacity="0.2" />
      <line x1="46" y1="46" x2="46" y2="56" stroke="currentColor" strokeWidth="0.6" opacity="0.2" />
      <line x1="54" y1="46" x2="54" y2="56" stroke="currentColor" strokeWidth="0.6" opacity="0.2" />
      <line x1="62" y1="46" x2="62" y2="56" stroke="currentColor" strokeWidth="0.6" opacity="0.2" />
      <line x1="70" y1="46" x2="70" y2="56" stroke="currentColor" strokeWidth="0.6" opacity="0.2" />
      {/* Top textile */}
      <rect x="28" y="34" width="44" height="10" rx="2" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1.2" />
      {/* Decorative border on top textile */}
      <line x1="30" y1="37" x2="70" y2="37" stroke="currentColor" strokeWidth="1" opacity="0.35" strokeDasharray="2 1.5" />
      <line x1="30" y1="41" x2="70" y2="41" stroke="currentColor" strokeWidth="1" opacity="0.35" strokeDasharray="2 1.5" />
    </svg>
  );
}

function FIBCJumboBagSVG() {
  return (
    <svg viewBox="0 0 100 100" width="100" height="100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Lifting straps */}
      <path d="M30 30 L22 10 L28 10 L34 28" stroke="currentColor" strokeWidth="2" opacity="0.4" fill="none" strokeLinecap="round" />
      <path d="M70 30 L78 10 L72 10 L66 28" stroke="currentColor" strokeWidth="2" opacity="0.4" fill="none" strokeLinecap="round" />
      <path d="M38 28 L35 10 L41 10 L42 28" stroke="currentColor" strokeWidth="2" opacity="0.4" fill="none" strokeLinecap="round" />
      <path d="M62 28 L65 10 L59 10 L58 28" stroke="currentColor" strokeWidth="2" opacity="0.4" fill="none" strokeLinecap="round" />
      {/* Main bag body - large square shape */}
      <rect x="24" y="28" width="52" height="60" rx="3" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2" />
      {/* Side gussets */}
      <line x1="24" y1="35" x2="30" y2="35" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <line x1="30" y1="28" x2="30" y2="88" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
      <line x1="70" y1="28" x2="70" y2="88" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
      <line x1="70" y1="35" x2="76" y2="35" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      {/* Fill spout at top */}
      <rect x="42" y="22" width="16" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.1" />
      {/* Capacity marking */}
      <rect x="36" y="50" width="28" height="14" rx="2" stroke="currentColor" strokeWidth="1" opacity="0.25" fill="none" />
      <line x1="40" y1="55" x2="60" y2="55" stroke="currentColor" strokeWidth="1.5" opacity="0.2" strokeLinecap="round" />
      <line x1="42" y1="60" x2="56" y2="60" stroke="currentColor" strokeWidth="1.5" opacity="0.2" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

type Subcategory = { name: string; slug: string };

type Category = {
  name: string;
  slug: string;
  desc: string;
  tag: string;
  icon: ReactNode;
  gradient: string;
  iconBg: string;
  borderHover: string;
  subcategories?: Subcategory[];
};

const categories: Category[] = [
  {
    name: 'PP Bags/Fabric',
    slug: 'pp-bags-fabric',
    tag: 'Bestseller',
    desc: 'Heavy-duty woven polypropylene bags and patta fabric for cement, food grain, and industrial use.',
    icon: <PPBagSVG />,
    gradient: 'from-blue-600 to-blue-800',
    iconBg: 'bg-blue-50 text-blue-700',
    borderHover: 'hover:border-blue-500',
    subcategories: [
      { name: 'Cement Bags', slug: 'cement-bags' },
      { name: 'Food Grain Bags', slug: 'food-grain-bags' },
      { name: 'Industrial Used PP Bags', slug: 'industrial-used-pp-bags' },
      { name: 'Patta Fabric', slug: 'patta-fabric' },
    ],
  },
  {
    name: 'BOPP Bags',
    slug: 'bopp-bags',
    tag: 'Premium',
    desc: 'Glossy BOPP laminated bags with high-quality printing for brand visibility.',
    icon: <BOPPBagSVG />,
    gradient: 'from-violet-600 to-purple-800',
    iconBg: 'bg-violet-50 text-violet-700',
    borderHover: 'hover:border-violet-500',
  },
  {
    name: 'Jute Bags',
    slug: 'jute-bags',
    tag: 'Eco-Friendly',
    desc: 'Biodegradable jute sacks for sustainable and eco-conscious packaging.',
    icon: <JuteBagSVG />,
    gradient: 'from-amber-600 to-orange-800',
    iconBg: 'bg-amber-50 text-amber-700',
    borderHover: 'hover:border-amber-500',
  },
  {
    name: 'Monofilament Bags',
    slug: 'monofilament-bags',
    tag: 'Mesh',
    desc: 'Breathable mesh bags for onion, garlic, and vegetable packaging.',
    icon: <MonofilamentBagSVG />,
    gradient: 'from-teal-600 to-cyan-800',
    iconBg: 'bg-teal-50 text-teal-700',
    borderHover: 'hover:border-teal-500',
  },
  {
    name: 'Leno Bags',
    slug: 'leno-bags',
    tag: 'Produce',
    desc: 'Tubular leno bags for potato and produce packing with ventilation.',
    icon: <LenoBagSVG />,
    gradient: 'from-green-600 to-emerald-800',
    iconBg: 'bg-green-50 text-green-700',
    borderHover: 'hover:border-green-500',
  },
  {
    name: 'PP Granules',
    slug: 'pp-granules',
    tag: 'Recycled',
    desc: 'Reprocessed polypropylene granules for plastic manufacturing.',
    icon: <PPGranulesSVG />,
    gradient: 'from-sky-600 to-blue-800',
    iconBg: 'bg-sky-50 text-sky-700',
    borderHover: 'hover:border-sky-500',
  },
  {
    name: 'Used Worn Sarees',
    slug: 'used-worn-sarees',
    tag: 'Repurposed',
    desc: 'Sorted used sarees repurposed for vegetable and produce packing.',
    icon: <SareesSVG />,
    gradient: 'from-rose-600 to-pink-800',
    iconBg: 'bg-rose-50 text-rose-700',
    borderHover: 'hover:border-rose-500',
  },
  {
    name: 'FIBC Jumbo Bags',
    slug: 'jumbo-bags',
    tag: 'Bulk',
    desc: 'Heavy-duty 1-ton jumbo bags with 4 lifting straps for industrial bulk shipping.',
    icon: <FIBCJumboBagSVG />,
    gradient: 'from-slate-600 to-slate-800',
    iconBg: 'bg-slate-100 text-slate-700',
    borderHover: 'hover:border-slate-500',
  },
];

/* ------------------------------------------------------------------ */
/*  Tag color helper                                                   */
/* ------------------------------------------------------------------ */

function tagColor(tag: string): string {
  const map: Record<string, string> = {
    Bestseller: 'bg-blue-100 text-blue-800',
    Premium: 'bg-violet-100 text-violet-800',
    'Eco-Friendly': 'bg-amber-100 text-amber-800',
    Mesh: 'bg-teal-100 text-teal-800',
    Produce: 'bg-green-100 text-green-800',
    Recycled: 'bg-sky-100 text-sky-800',
    Repurposed: 'bg-rose-100 text-rose-800',
    Bulk: 'bg-slate-200 text-slate-800',
  };
  return map[tag] ?? 'bg-gray-100 text-gray-700';
}

/* ------------------------------------------------------------------ */
/*  Featured Card (2-column span)                                      */
/* ------------------------------------------------------------------ */

function FeaturedCard({ cat }: { cat: Category }) {
  return (
    <Link
      href={`/products?category=${cat.slug}`}
      className={`group relative sm:col-span-2 flex flex-col md:flex-row overflow-hidden rounded-2xl bg-white border border-slate-200 ${cat.borderHover} shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
    >
      {/* Icon area */}
      <div className={`relative flex-shrink-0 w-full md:w-56 lg:w-64 flex items-center justify-center bg-gradient-to-br ${cat.gradient} p-8 md:p-10 overflow-hidden`}>
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-white/10" />
        <div className="text-white group-hover:scale-110 transition-transform duration-300 relative z-10">
          {cat.icon}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center p-6 lg:p-8 flex-1">
        <div className="flex items-center gap-3 mb-3">
          <span className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${tagColor(cat.tag)}`}>
            {cat.tag}
          </span>
        </div>
        <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
          {cat.name}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed mb-5 max-w-md">{cat.desc}</p>

        {cat.subcategories && (
          <div className="flex flex-wrap gap-2 mb-5">
            {cat.subcategories.map((sub) => (
              <span
                key={sub.slug}
                className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200"
              >
                {sub.name}
              </span>
            ))}
          </div>
        )}

        <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 group-hover:gap-3 transition-all">
          Explore Category <FiArrowRight className="transition-transform group-hover:translate-x-1" size={16} />
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Standard Card                                                      */
/* ------------------------------------------------------------------ */

function CategoryCard({ cat }: { cat: Category }) {
  return (
    <Link
      href={`/products?category=${cat.slug}`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-200 ${cat.borderHover} shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
    >
      {/* Icon area */}
      <div className={`relative flex items-center justify-center bg-gradient-to-br ${cat.gradient} p-6 overflow-hidden`}>
        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 -left-4 w-14 h-14 rounded-full bg-white/10" />
        <div className="text-white group-hover:scale-110 transition-transform duration-300 relative z-10">
          {cat.icon}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md ${tagColor(cat.tag)}`}>
            {cat.tag}
          </span>
        </div>
        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-1">
          {cat.name}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 flex-1">{cat.desc}</p>

        <div className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-blue-700 group-hover:gap-2.5 transition-all">
          View Products <FiArrowRight className="transition-transform group-hover:translate-x-1" size={13} />
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function CategoryGrid() {
  const featured = categories[0];
  const rest = categories.slice(1);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-20 -left-32 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 -right-32 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 text-orange-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              <FiPackage size={14} /> What We Deal In
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              Product{' '}
              <span className="text-blue-700">Categories</span>
              <span className="inline-block w-2 h-2 rounded-full bg-orange-500 ml-2 align-baseline" />
            </h2>
            <p className="text-slate-500 mt-3 text-base leading-relaxed">
              From PP woven bags to FIBC jumbo bags -- discover our complete range of industrial packaging and trading materials.
            </p>
          </div>
          <Link
            href="/categories"
            className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white hover:bg-blue-700 font-semibold rounded-full text-sm transition-colors group"
          >
            View All Categories
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={15} />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <FeaturedCard cat={featured} />
          {rest.map((cat) => (
            <CategoryCard key={cat.slug} cat={cat} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="text-center mt-10 md:hidden">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-semibold rounded-full text-sm"
          >
            View All Categories <FiArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
