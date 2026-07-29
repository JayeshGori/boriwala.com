'use client';

import { useRef } from 'react';

/* ------------------------------------------------------------------ */
/*  Product data                                                       */
/* ------------------------------------------------------------------ */

interface ProductBanner {
  name: string;
  tagline: string;
  description: string;
  gradient: string;
  accentColor: string;
  accentLight: string;
  usps: string[];
  variants: string[];
  svgIcon: React.ReactNode;
}

const products: ProductBanner[] = [
  {
    name: 'PP BAGS / FABRIC',
    tagline: 'Industrial Strength Woven Packaging',
    description: 'Heavy-duty polypropylene woven bags & patta fabric for cement, food grain, fertilizer & industrial packaging needs.',
    gradient: 'linear-gradient(135deg, #0a1628 0%, #0d2847 40%, #1a3a6b 100%)',
    accentColor: '#3b82f6',
    accentLight: '#60a5fa',
    usps: ['Heavy Duty', 'UV Resistant', 'Custom Print', 'Bulk Supply'],
    variants: ['Cement Bags', 'Food Grain Bags', 'Industrial Used', 'Patta Fabric'],
    svgIcon: (
      <svg viewBox="0 0 200 200" width="200" height="200" fill="none">
        <rect x="35" y="45" width="130" height="135" rx="6" fill="white" opacity="0.12" stroke="white" strokeWidth="3" />
        <line x1="55" y1="45" x2="55" y2="180" stroke="white" strokeWidth="1.2" opacity="0.25" />
        <line x1="75" y1="45" x2="75" y2="180" stroke="white" strokeWidth="1.2" opacity="0.25" />
        <line x1="95" y1="45" x2="95" y2="180" stroke="white" strokeWidth="1.2" opacity="0.25" />
        <line x1="115" y1="45" x2="115" y2="180" stroke="white" strokeWidth="1.2" opacity="0.25" />
        <line x1="135" y1="45" x2="135" y2="180" stroke="white" strokeWidth="1.2" opacity="0.25" />
        <line x1="155" y1="45" x2="155" y2="180" stroke="white" strokeWidth="1.2" opacity="0.25" />
        <line x1="35" y1="65" x2="165" y2="65" stroke="white" strokeWidth="1.2" opacity="0.25" />
        <line x1="35" y1="85" x2="165" y2="85" stroke="white" strokeWidth="1.2" opacity="0.25" />
        <line x1="35" y1="105" x2="165" y2="105" stroke="white" strokeWidth="1.2" opacity="0.25" />
        <line x1="35" y1="125" x2="165" y2="125" stroke="white" strokeWidth="1.2" opacity="0.25" />
        <line x1="35" y1="145" x2="165" y2="145" stroke="white" strokeWidth="1.2" opacity="0.25" />
        <line x1="35" y1="165" x2="165" y2="165" stroke="white" strokeWidth="1.2" opacity="0.25" />
        <path d="M35 45 L55 25 L145 25 L165 45" stroke="white" strokeWidth="3" fill="white" opacity="0.06" />
        <line x1="40" y1="50" x2="160" y2="50" stroke="white" strokeWidth="2" strokeDasharray="5 3" opacity="0.4" />
      </svg>
    ),
  },
  {
    name: 'BOPP BAGS',
    tagline: 'Premium Laminated Packaging',
    description: 'High-gloss BOPP laminated bags with superior print quality for brand-conscious packaging solutions.',
    gradient: 'linear-gradient(135deg, #1a0a2e 0%, #2d1854 40%, #4c1d95 100%)',
    accentColor: '#a78bfa',
    accentLight: '#c4b5fd',
    usps: ['High Gloss', 'Brand Print', 'Moisture Proof', 'Premium Finish'],
    variants: ['Printed BOPP', 'Unprinted BOPP', 'Matte Finish', 'Custom Design'],
    svgIcon: (
      <svg viewBox="0 0 200 200" width="200" height="200" fill="none">
        <rect x="40" y="30" width="120" height="150" rx="8" fill="white" opacity="0.12" stroke="white" strokeWidth="3" />
        <path d="M55 40 L55 165" stroke="white" strokeWidth="5" opacity="0.1" strokeLinecap="round" />
        <path d="M65 50 L65 160" stroke="white" strokeWidth="2.5" opacity="0.07" strokeLinecap="round" />
        <path d="M128 55 L135 45 L142 55 L135 65 Z" fill="white" opacity="0.5" />
        <path d="M120 38 L124 30 L128 38 L124 46 Z" fill="white" opacity="0.35" />
        <path d="M145 72 L149 64 L153 72 L149 80 Z" fill="white" opacity="0.3" />
        <path d="M118 42 L148 42 L148 46 L118 46" fill="white" opacity="0.15" />
        <rect x="65" y="80" width="70" height="45" rx="4" stroke="white" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.3" />
        <line x1="75" y1="96" x2="125" y2="96" stroke="white" strokeWidth="3" opacity="0.2" strokeLinecap="round" />
        <line x1="75" y1="108" x2="115" y2="108" stroke="white" strokeWidth="3" opacity="0.2" strokeLinecap="round" />
        <line x1="40" y1="38" x2="160" y2="38" stroke="white" strokeWidth="4" opacity="0.35" />
      </svg>
    ),
  },
  {
    name: 'JUTE BAGS',
    tagline: 'Eco-Friendly Natural Packaging',
    description: 'Biodegradable jute sacks & bags for sustainable packaging. Government-approved for food grain storage.',
    gradient: 'linear-gradient(135deg, #1a0f00 0%, #3d2200 40%, #78450a 100%)',
    accentColor: '#f59e0b',
    accentLight: '#fbbf24',
    usps: ['Biodegradable', 'Eco Friendly', 'Govt Approved', 'Strong & Durable'],
    variants: ['Hessian Bags', 'Sacking Bags', 'Gunny Bags', 'Food Grade'],
    svgIcon: (
      <svg viewBox="0 0 200 200" width="200" height="200" fill="none">
        <path d="M45 55 Q40 105 43 180 L157 180 Q160 105 155 55 Z" fill="white" opacity="0.12" stroke="white" strokeWidth="3" />
        <path d="M45 55 Q65 40 100 40 Q135 40 155 55" stroke="white" strokeWidth="3" fill="none" />
        <ellipse cx="100" cy="47" rx="25" ry="8" stroke="white" strokeWidth="3" fill="none" opacity="0.5" />
        <circle cx="100" cy="30" r="6" fill="white" opacity="0.35" />
        <path d="M94 30 Q88 15 93 10 M106 30 Q112 15 107 10" stroke="white" strokeWidth="2.5" fill="none" opacity="0.35" />
        <line x1="58" y1="65" x2="67" y2="170" stroke="white" strokeWidth="1" opacity="0.2" />
        <line x1="78" y1="60" x2="82" y2="170" stroke="white" strokeWidth="1" opacity="0.2" />
        <line x1="100" y1="58" x2="100" y2="170" stroke="white" strokeWidth="1" opacity="0.2" />
        <line x1="122" y1="60" x2="118" y2="170" stroke="white" strokeWidth="1" opacity="0.2" />
        <line x1="142" y1="65" x2="133" y2="170" stroke="white" strokeWidth="1" opacity="0.2" />
        <line x1="45" y1="85" x2="155" y2="85" stroke="white" strokeWidth="1" opacity="0.15" />
        <line x1="43" y1="115" x2="157" y2="115" stroke="white" strokeWidth="1" opacity="0.15" />
        <line x1="43" y1="145" x2="157" y2="145" stroke="white" strokeWidth="1" opacity="0.15" />
      </svg>
    ),
  },
  {
    name: 'MONOFILAMENT BAGS',
    tagline: 'Breathable Mesh Packaging',
    description: 'High-strength mesh bags for onion, garlic, potato & vegetable packaging with superior air circulation.',
    gradient: 'linear-gradient(135deg, #042f2e 0%, #0d4f4c 40%, #0f766e 100%)',
    accentColor: '#2dd4bf',
    accentLight: '#5eead4',
    usps: ['Breathable', 'Transparent', 'Strong Mesh', 'Custom Colors'],
    variants: ['Onion Net Bags', 'Potato Bags', 'Garlic Bags', 'Vegetable Bags'],
    svgIcon: (
      <svg viewBox="0 0 200 200" width="200" height="200" fill="none">
        <path d="M45 35 L45 180 L155 180 L155 35 Z" stroke="white" strokeWidth="3" fill="white" opacity="0.04" />
        {[55, 70, 85, 100, 115, 130, 145].map((x) => (
          <line key={`v${x}`} x1={x} y1="35" x2={x} y2="180" stroke="white" strokeWidth="1.5" opacity="0.2" />
        ))}
        {[50, 65, 80, 95, 110, 125, 140, 155, 170].map((y) => (
          <line key={`h${y}`} x1="45" y1={y} x2="155" y2={y} stroke="white" strokeWidth="1.5" opacity="0.2" />
        ))}
        <circle cx="82" cy="108" r="14" fill="white" opacity="0.12" />
        <circle cx="118" cy="95" r="12" fill="white" opacity="0.1" />
        <circle cx="100" cy="138" r="14" fill="white" opacity="0.12" />
        <circle cx="75" cy="145" r="10" fill="white" opacity="0.08" />
        <circle cx="125" cy="130" r="11" fill="white" opacity="0.1" />
        <circle cx="90" cy="72" r="10" fill="white" opacity="0.08" />
        <path d="M45 35 L65 22 L135 22 L155 35" stroke="white" strokeWidth="3" fill="none" />
      </svg>
    ),
  },
  {
    name: 'LENO BAGS',
    tagline: 'Ventilated Produce Packaging',
    description: 'Tubular leno woven bags with excellent ventilation for potatoes, onions, firewood & agricultural produce.',
    gradient: 'linear-gradient(135deg, #052e16 0%, #14532d 40%, #166534 100%)',
    accentColor: '#4ade80',
    accentLight: '#86efac',
    usps: ['Air Circulation', 'Strong Weave', 'Food Grade', 'Reusable'],
    variants: ['Potato Bags', 'Onion Bags', 'Firewood Bags', 'Custom Leno'],
    svgIcon: (
      <svg viewBox="0 0 200 200" width="200" height="200" fill="none">
        <path d="M55 30 Q48 100 52 175 Q70 185 100 185 Q130 185 148 175 Q152 100 145 30" stroke="white" strokeWidth="3" fill="white" opacity="0.06" />
        <path d="M68 38 Q72 70 66 100 Q62 130 68 170" stroke="white" strokeWidth="1.5" opacity="0.25" />
        <path d="M84 35 Q88 70 82 100 Q78 130 84 170" stroke="white" strokeWidth="1.5" opacity="0.25" />
        <path d="M100 33 Q100 80 100 120 Q100 155 100 180" stroke="white" strokeWidth="1.5" opacity="0.25" />
        <path d="M116 35 Q112 70 118 100 Q122 130 116 170" stroke="white" strokeWidth="1.5" opacity="0.25" />
        <path d="M132 38 Q128 70 134 100 Q138 130 132 170" stroke="white" strokeWidth="1.5" opacity="0.25" />
        <path d="M55 55 Q100 50 145 55" stroke="white" strokeWidth="1.2" opacity="0.15" />
        <path d="M52 80 Q100 75 148 80" stroke="white" strokeWidth="1.2" opacity="0.15" />
        <path d="M52 105 Q100 100 148 105" stroke="white" strokeWidth="1.2" opacity="0.15" />
        <path d="M52 130 Q100 125 148 130" stroke="white" strokeWidth="1.2" opacity="0.15" />
        <path d="M53 155 Q100 150 147 155" stroke="white" strokeWidth="1.2" opacity="0.15" />
        <line x1="55" y1="30" x2="145" y2="30" stroke="white" strokeWidth="4" opacity="0.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'PP GRANULES',
    tagline: 'Recycled Raw Material Supply',
    description: 'High-quality reprocessed polypropylene granules for plastic manufacturing. Consistent MFI & clean material.',
    gradient: 'linear-gradient(135deg, #0c1929 0%, #0c4a6e 40%, #0369a1 100%)',
    accentColor: '#38bdf8',
    accentLight: '#7dd3fc',
    usps: ['MFI Tested', 'Clean Material', 'Consistent Quality', 'Bulk Supply'],
    variants: ['Natural PP', 'Off-White', 'Colored', 'Mixed Grade'],
    svgIcon: (
      <svg viewBox="0 0 200 200" width="200" height="200" fill="none">
        <ellipse cx="68" cy="158" rx="12" ry="10" fill="white" opacity="0.25" />
        <ellipse cx="92" cy="162" rx="12" ry="10" fill="white" opacity="0.2" />
        <ellipse cx="116" cy="160" rx="12" ry="10" fill="white" opacity="0.25" />
        <ellipse cx="138" cy="158" rx="12" ry="10" fill="white" opacity="0.2" />
        <ellipse cx="52" cy="154" rx="10" ry="8.5" fill="white" opacity="0.15" />
        <ellipse cx="152" cy="155" rx="10" ry="8.5" fill="white" opacity="0.15" />
        <ellipse cx="80" cy="138" rx="12" ry="10" fill="white" opacity="0.3" />
        <ellipse cx="104" cy="142" rx="12" ry="10" fill="white" opacity="0.25" />
        <ellipse cx="128" cy="140" rx="12" ry="10" fill="white" opacity="0.3" />
        <ellipse cx="64" cy="140" rx="9" ry="7.5" fill="white" opacity="0.2" />
        <ellipse cx="144" cy="142" rx="9" ry="7.5" fill="white" opacity="0.2" />
        <ellipse cx="88" cy="120" rx="12" ry="10" fill="white" opacity="0.35" />
        <ellipse cx="114" cy="122" rx="12" ry="10" fill="white" opacity="0.3" />
        <ellipse cx="100" cy="102" rx="11" ry="9" fill="white" opacity="0.4" />
        <ellipse cx="38" cy="168" rx="8" ry="6.5" fill="white" opacity="0.12" />
        <ellipse cx="166" cy="170" rx="7" ry="5.5" fill="white" opacity="0.1" />
        <path d="M82 65 L100 50 L118 65" stroke="white" strokeWidth="3" opacity="0.3" fill="none" strokeLinecap="round" />
        <path d="M118 65 L118 82 L100 82" stroke="white" strokeWidth="3" opacity="0.3" fill="none" strokeLinecap="round" />
        <path d="M82 65 L82 82 L100 82" stroke="white" strokeWidth="3" opacity="0.3" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'USED WORN SAREES',
    tagline: 'Repurposed Textile Packaging',
    description: 'Sorted used sarees repurposed for vegetable & produce packing. Cost-effective & eco-friendly packaging solution.',
    gradient: 'linear-gradient(135deg, #1a0a1a 0%, #4a1942 40%, #831843 100%)',
    accentColor: '#f472b6',
    accentLight: '#f9a8d4',
    usps: ['Eco-Friendly', 'Cost Effective', 'Sorted & Graded', 'Bulk Available'],
    variants: ['Color Sorted', 'Mixed Lot', 'Cotton Sarees', 'Synthetic Mix'],
    svgIcon: (
      <svg viewBox="0 0 200 200" width="200" height="200" fill="none">
        <rect x="40" y="140" width="120" height="22" rx="4" fill="white" opacity="0.12" stroke="white" strokeWidth="2" />
        <line x1="45" y1="151" x2="155" y2="151" stroke="white" strokeWidth="0.8" opacity="0.15" />
        <rect x="45" y="115" width="110" height="22" rx="4" fill="white" opacity="0.17" stroke="white" strokeWidth="2" />
        <line x1="50" y1="126" x2="150" y2="126" stroke="white" strokeWidth="0.8" opacity="0.2" />
        <circle cx="70" cy="126" r="2" fill="white" opacity="0.25" />
        <circle cx="90" cy="126" r="2" fill="white" opacity="0.25" />
        <circle cx="110" cy="126" r="2" fill="white" opacity="0.25" />
        <circle cx="130" cy="126" r="2" fill="white" opacity="0.25" />
        <rect x="50" y="90" width="100" height="22" rx="4" fill="white" opacity="0.22" stroke="white" strokeWidth="2" />
        <line x1="58" y1="90" x2="58" y2="112" stroke="white" strokeWidth="1" opacity="0.15" />
        <line x1="74" y1="90" x2="74" y2="112" stroke="white" strokeWidth="1" opacity="0.15" />
        <line x1="90" y1="90" x2="90" y2="112" stroke="white" strokeWidth="1" opacity="0.15" />
        <line x1="106" y1="90" x2="106" y2="112" stroke="white" strokeWidth="1" opacity="0.15" />
        <line x1="122" y1="90" x2="122" y2="112" stroke="white" strokeWidth="1" opacity="0.15" />
        <line x1="138" y1="90" x2="138" y2="112" stroke="white" strokeWidth="1" opacity="0.15" />
        <rect x="55" y="65" width="90" height="22" rx="4" fill="white" opacity="0.27" stroke="white" strokeWidth="2" />
        <line x1="60" y1="72" x2="140" y2="72" stroke="white" strokeWidth="1.5" opacity="0.3" strokeDasharray="3 2.5" />
        <line x1="60" y1="80" x2="140" y2="80" stroke="white" strokeWidth="1.5" opacity="0.3" strokeDasharray="3 2.5" />
      </svg>
    ),
  },
  {
    name: 'FIBC JUMBO BAGS',
    tagline: 'Heavy-Duty Bulk Containers',
    description: '1-2 ton capacity FIBC bags with 4 lifting loops for industrial bulk shipping. SWL certified & UV protected.',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #334155 100%)',
    accentColor: '#94a3b8',
    accentLight: '#cbd5e1',
    usps: ['4 Lift Loops', 'UV Protected', 'SWL Certified', 'Custom Sizes'],
    variants: ['1 Ton Standard', '1.5 Ton Heavy', 'Baffle FIBC', 'Circular FIBC'],
    svgIcon: (
      <svg viewBox="0 0 200 200" width="200" height="200" fill="none">
        <path d="M58 55 L40 15 L52 15 L66 50" stroke="white" strokeWidth="3" opacity="0.35" fill="none" strokeLinecap="round" />
        <path d="M142 55 L160 15 L148 15 L134 50" stroke="white" strokeWidth="3" opacity="0.35" fill="none" strokeLinecap="round" />
        <path d="M75 50 L68 15 L80 15 L84 50" stroke="white" strokeWidth="3" opacity="0.35" fill="none" strokeLinecap="round" />
        <path d="M125 50 L132 15 L120 15 L116 50" stroke="white" strokeWidth="3" opacity="0.35" fill="none" strokeLinecap="round" />
        <rect x="44" y="50" width="112" height="130" rx="6" fill="white" opacity="0.12" stroke="white" strokeWidth="3" />
        <line x1="44" y1="65" x2="58" y2="65" stroke="white" strokeWidth="1.5" opacity="0.25" />
        <line x1="58" y1="50" x2="58" y2="180" stroke="white" strokeWidth="1" opacity="0.1" />
        <line x1="142" y1="50" x2="142" y2="180" stroke="white" strokeWidth="1" opacity="0.1" />
        <line x1="142" y1="65" x2="156" y2="65" stroke="white" strokeWidth="1.5" opacity="0.25" />
        <rect x="82" y="38" width="36" height="16" rx="4" stroke="white" strokeWidth="2" fill="white" opacity="0.08" />
        <rect x="70" y="100" width="60" height="30" rx="4" stroke="white" strokeWidth="1.5" opacity="0.2" fill="none" />
        <line x1="78" y1="112" x2="122" y2="112" stroke="white" strokeWidth="2.5" opacity="0.15" strokeLinecap="round" />
        <line x1="82" y1="122" x2="115" y2="122" stroke="white" strokeWidth="2.5" opacity="0.15" strokeLinecap="round" />
      </svg>
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  Banner Component                                                   */
/* ------------------------------------------------------------------ */

function ProductBannerCard({ product, index }: { product: ProductBanner; index: number }) {
  return (
    <div
      className="relative overflow-hidden flex-shrink-0"
      style={{
        width: 1080,
        height: 1350,
        background: product.gradient,
      }}
    >
      {/* Background decorative elements */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent, transparent 40px, white 40px, white 41px),' +
            'repeating-linear-gradient(-45deg, transparent, transparent 40px, white 40px, white 41px)',
        }}
      />
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10"
        style={{ background: `radial-gradient(circle, ${product.accentColor}, transparent 70%)` }}
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, ${product.accentColor}, transparent 70%)` }}
      />

      {/* Top bar with branding */}
      <div className="relative px-16 pt-14 flex items-center justify-between">
        <div>
          <div className="text-white text-[42px] font-extrabold tracking-tight leading-none" style={{ fontFamily: 'var(--font-poppins)' }}>
            BORIWALA
          </div>
          <div className="text-white/60 text-[16px] font-semibold tracking-[0.3em] uppercase mt-1">
            Trading Company
          </div>
        </div>
        <div
          className="px-6 py-3 rounded-2xl border-2 text-[14px] font-bold uppercase tracking-wider"
          style={{ borderColor: product.accentColor, color: product.accentColor }}
        >
          Since 2009
        </div>
      </div>

      {/* Divider line */}
      <div className="mx-16 mt-8 h-[2px] rounded-full" style={{ background: `linear-gradient(90deg, ${product.accentColor}, transparent)` }} />

      {/* Main content area */}
      <div className="relative px-16 mt-12 flex gap-10">
        {/* Left side - Text content (60%) */}
        <div className="flex-1" style={{ maxWidth: '55%' }}>
          {/* Category badge */}
          <div
            className="inline-block px-5 py-2 rounded-full text-[13px] font-bold uppercase tracking-[0.2em] mb-8"
            style={{ background: `${product.accentColor}25`, color: product.accentLight, border: `1px solid ${product.accentColor}40` }}
          >
            Wholesale Supplier
          </div>

          {/* Product name */}
          <h1
            className="text-white text-[64px] font-extrabold leading-[1.05] mb-5"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            {product.name}
          </h1>

          {/* Tagline */}
          <p
            className="text-[26px] font-bold mb-6"
            style={{ color: product.accentLight }}
          >
            {product.tagline}
          </p>

          {/* Description */}
          <p className="text-white/60 text-[18px] leading-relaxed max-w-[440px]">
            {product.description}
          </p>
        </div>

        {/* Right side - Product illustration (40%) */}
        <div className="flex items-center justify-center" style={{ width: '40%' }}>
          <div
            className="relative w-[380px] h-[380px] rounded-[40px] flex items-center justify-center"
            style={{ background: `${product.accentColor}12`, border: `2px solid ${product.accentColor}25` }}
          >
            {/* Decorative ring */}
            <div
              className="absolute inset-4 rounded-[32px]"
              style={{ border: `1px solid ${product.accentColor}15` }}
            />
            <div className="scale-[1.8]">
              {product.svgIcon}
            </div>
          </div>
        </div>
      </div>

      {/* USP Badges */}
      <div className="px-16 mt-14">
        <div className="flex gap-5">
          {product.usps.map((usp) => (
            <div
              key={usp}
              className="flex items-center gap-3 px-6 py-4 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${product.accentColor}20` }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={product.accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="text-white/80 text-[15px] font-semibold">{usp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-16 mt-12 h-[1px] bg-white/10" />

      {/* Product Variants */}
      <div className="px-16 mt-10">
        <p className="text-white/40 text-[14px] font-semibold uppercase tracking-[0.25em] mb-5">
          Available Variants
        </p>
        <div className="flex gap-4">
          {product.variants.map((variant) => (
            <div
              key={variant}
              className="flex-1 text-center py-5 rounded-2xl text-white/70 text-[16px] font-semibold"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {variant}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar - Contact */}
      <div className="absolute bottom-0 left-0 right-0 px-16 py-10 flex items-center justify-between" style={{ background: 'rgba(0,0,0,0.3)' }}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#22c55e">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 01-4.243-1.216l-.257-.154-2.868.852.852-2.868-.154-.257A8 8 0 1112 20z" />
              </svg>
            </div>
            <div>
              <div className="text-white/40 text-[12px] font-semibold uppercase tracking-wider">WhatsApp</div>
              <div className="text-white text-[20px] font-bold">+91 74053 37635</div>
            </div>
          </div>
          <div className="w-[1px] h-10 bg-white/10" />
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <div>
              <div className="text-white/40 text-[12px] font-semibold uppercase tracking-wider">Website</div>
              <div className="text-white text-[20px] font-bold">boriwala.com</div>
            </div>
          </div>
        </div>

        {/* Quality badge */}
        <div
          className="flex items-center gap-3 px-6 py-3 rounded-2xl"
          style={{ border: `2px solid ${product.accentColor}50`, background: `${product.accentColor}10` }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={product.accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: product.accentColor }}>Premium</div>
            <div className="text-white text-[16px] font-bold">Quality Assured</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function ProductBannersPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4">
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Product Banners</h1>
        <p className="text-slate-400">
          Right-click on any banner and select &quot;Save image as&quot; or take a screenshot.
          Each banner is 1080x1350px (Instagram Portrait format).
        </p>
        <p className="text-slate-500 text-sm mt-2">
          Tip: For best quality, zoom browser to 100% and use a screenshot tool to capture each banner individually.
        </p>
      </div>

      <div ref={containerRef} className="flex flex-col items-center gap-16">
        {products.map((product, index) => (
          <div key={product.name} className="relative">
            {/* Label */}
            <div className="mb-3 flex items-center justify-between">
              <span className="text-white/60 text-sm font-medium">
                Banner {index + 1} of {products.length} &mdash; {product.name}
              </span>
              <span className="text-slate-500 text-xs">1080 x 1350px</span>
            </div>
            {/* Banner */}
            <div className="shadow-2xl shadow-black/50 rounded-lg overflow-hidden" style={{ width: 1080 }}>
              <ProductBannerCard product={product} index={index} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
