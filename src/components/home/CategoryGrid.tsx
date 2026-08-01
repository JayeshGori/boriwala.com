'use client';

import Link from 'next/link';
import { FiArrowRight, FiPackage } from 'react-icons/fi';
import { ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/*  SVG Illustrations                                                  */
/* ------------------------------------------------------------------ */

function PPBagSVG() {
  return (
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
  );
}

function BOPPBagSVG() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" fill="none">
      <rect x="40" y="30" width="120" height="150" rx="8" fill="white" opacity="0.12" stroke="white" strokeWidth="3" />
      <path d="M55 40 L55 165" stroke="white" strokeWidth="5" opacity="0.1" strokeLinecap="round" />
      <path d="M65 50 L65 160" stroke="white" strokeWidth="2.5" opacity="0.07" strokeLinecap="round" />
      <path d="M128 55 L135 45 L142 55 L135 65 Z" fill="white" opacity="0.5" />
      <path d="M120 38 L124 30 L128 38 L124 46 Z" fill="white" opacity="0.35" />
      <path d="M145 72 L149 64 L153 72 L149 80 Z" fill="white" opacity="0.3" />
      <rect x="65" y="80" width="70" height="45" rx="4" stroke="white" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.3" />
      <line x1="75" y1="96" x2="125" y2="96" stroke="white" strokeWidth="3" opacity="0.2" strokeLinecap="round" />
      <line x1="75" y1="108" x2="115" y2="108" stroke="white" strokeWidth="3" opacity="0.2" strokeLinecap="round" />
      <line x1="40" y1="38" x2="160" y2="38" stroke="white" strokeWidth="4" opacity="0.35" />
    </svg>
  );
}

function JuteBagSVG() {
  return (
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
  );
}

function MonofilamentBagSVG() {
  return (
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
  );
}

function LenoBagSVG() {
  return (
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
  );
}

function PPGranulesSVG() {
  return (
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
      <path d="M82 65 L100 50 L118 65" stroke="white" strokeWidth="3" opacity="0.3" fill="none" strokeLinecap="round" />
      <path d="M118 65 L118 82 L100 82" stroke="white" strokeWidth="3" opacity="0.3" fill="none" strokeLinecap="round" />
      <path d="M82 65 L82 82 L100 82" stroke="white" strokeWidth="3" opacity="0.3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function SareesSVG() {
  return (
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
  );
}

function FIBCJumboBagSVG() {
  return (
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
  );
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

type Category = {
  name: string;
  slug: string;
  tag: string;
  tagline: string;
  desc: string;
  icon: ReactNode;
  gradient: string;
  accentColor: string;
  accentLight: string;
  usps: string[];
  subcategories?: { name: string; slug: string }[];
};

const categories: Category[] = [
  {
    name: 'PP Bags / Fabric',
    slug: 'pp-bags-fabric',
    tag: 'Bestseller',
    tagline: 'Industrial Strength Woven Packaging',
    desc: 'Heavy-duty polypropylene woven bags & patta fabric for cement, food grain, fertilizer & industrial packaging needs.',
    icon: <PPBagSVG />,
    gradient: 'linear-gradient(135deg, #0a1628 0%, #0d2847 40%, #1a3a6b 100%)',
    accentColor: '#3b82f6',
    accentLight: '#60a5fa',
    usps: ['Heavy Duty', 'UV Resistant', 'Custom Print', 'Bulk Supply'],
    subcategories: [
      { name: 'Cement Bags', slug: 'cement-bags' },
      { name: 'Food Grain Bags', slug: 'food-grain-bags' },
      { name: 'Industrial Used', slug: 'industrial-used-pp-bags' },
      { name: 'Patta Fabric', slug: 'patta-fabric' },
    ],
  },
  {
    name: 'BOPP Bags',
    slug: 'bopp-bags',
    tag: 'Premium',
    tagline: 'Premium Laminated Packaging',
    desc: 'High-gloss BOPP laminated bags with superior print quality for brand-conscious packaging solutions.',
    icon: <BOPPBagSVG />,
    gradient: 'linear-gradient(135deg, #1a0a2e 0%, #2d1854 40%, #4c1d95 100%)',
    accentColor: '#a78bfa',
    accentLight: '#c4b5fd',
    usps: ['High Gloss', 'Brand Print', 'Moisture Proof', 'Premium Finish'],
  },
  {
    name: 'Jute Bags',
    slug: 'jute-bags',
    tag: 'Eco-Friendly',
    tagline: 'Eco-Friendly Natural Packaging',
    desc: 'Biodegradable jute sacks & bags for sustainable packaging. Government-approved for food grain storage.',
    icon: <JuteBagSVG />,
    gradient: 'linear-gradient(135deg, #1a0f00 0%, #3d2200 40%, #78450a 100%)',
    accentColor: '#f59e0b',
    accentLight: '#fbbf24',
    usps: ['Biodegradable', 'Eco Friendly', 'Govt Approved', 'Durable'],
  },
  {
    name: 'Monofilament Bags',
    slug: 'monofilament-bags',
    tag: 'Mesh',
    tagline: 'Breathable Mesh Packaging',
    desc: 'High-strength mesh bags for onion, garlic, potato & vegetable packaging with superior air circulation.',
    icon: <MonofilamentBagSVG />,
    gradient: 'linear-gradient(135deg, #042f2e 0%, #0d4f4c 40%, #0f766e 100%)',
    accentColor: '#2dd4bf',
    accentLight: '#5eead4',
    usps: ['Breathable', 'Transparent', 'Strong Mesh', 'Custom Colors'],
  },
  {
    name: 'Leno Bags',
    slug: 'leno-bags',
    tag: 'Produce',
    tagline: 'Ventilated Produce Packaging',
    desc: 'Tubular leno woven bags with excellent ventilation for potatoes, onions, firewood & agricultural produce.',
    icon: <LenoBagSVG />,
    gradient: 'linear-gradient(135deg, #052e16 0%, #14532d 40%, #166534 100%)',
    accentColor: '#4ade80',
    accentLight: '#86efac',
    usps: ['Air Circulation', 'Strong Weave', 'Food Grade', 'Reusable'],
  },
  {
    name: 'PP Granules',
    slug: 'pp-granules',
    tag: 'Recycled',
    tagline: 'Recycled Raw Material Supply',
    desc: 'High-quality reprocessed polypropylene granules for plastic manufacturing. Consistent MFI & clean material.',
    icon: <PPGranulesSVG />,
    gradient: 'linear-gradient(135deg, #0c1929 0%, #0c4a6e 40%, #0369a1 100%)',
    accentColor: '#38bdf8',
    accentLight: '#7dd3fc',
    usps: ['MFI Tested', 'Clean Material', 'Consistent', 'Bulk Supply'],
  },
  {
    name: 'Used Worn Sarees',
    slug: 'used-worn-sarees',
    tag: 'Repurposed',
    tagline: 'Repurposed Textile Packaging',
    desc: 'Sorted used sarees repurposed for vegetable & produce packing. Cost-effective & eco-friendly packaging solution.',
    icon: <SareesSVG />,
    gradient: 'linear-gradient(135deg, #1a0a1a 0%, #4a1942 40%, #831843 100%)',
    accentColor: '#f472b6',
    accentLight: '#f9a8d4',
    usps: ['Eco-Friendly', 'Cost Effective', 'Sorted', 'Bulk Available'],
  },
  {
    name: 'FIBC Jumbo Bags',
    slug: 'jumbo-bags',
    tag: 'Bulk',
    tagline: 'Heavy-Duty Bulk Containers',
    desc: '1-2 ton capacity FIBC bags with 4 lifting loops for industrial bulk shipping. SWL certified & UV protected.',
    icon: <FIBCJumboBagSVG />,
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #334155 100%)',
    accentColor: '#94a3b8',
    accentLight: '#cbd5e1',
    usps: ['4 Lift Loops', 'UV Protected', 'SWL Certified', 'Custom Sizes'],
  },
];

/* ------------------------------------------------------------------ */
/*  Featured Banner Card (2-col span, PP Bags)                         */
/* ------------------------------------------------------------------ */

function FeaturedBannerCard({ cat }: { cat: Category }) {
  return (
    <Link
      href={`/products?category=${cat.slug}`}
      className="group relative sm:col-span-2 lg:col-span-2 overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
      style={{ background: cat.gradient }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage:
          'repeating-linear-gradient(45deg, transparent, transparent 30px, white 30px, white 30.5px),' +
          'repeating-linear-gradient(-45deg, transparent, transparent 30px, white 30px, white 30.5px)',
      }} />
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10"
        style={{ background: `radial-gradient(circle, ${cat.accentColor}, transparent 70%)` }} />

      <div className="relative flex flex-col md:flex-row p-6 lg:p-8 min-h-[320px]">
        {/* Text content */}
        <div className="flex-1 flex flex-col justify-center pr-4">
          <span
            className="self-start px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] mb-4"
            style={{ background: `${cat.accentColor}20`, color: cat.accentLight, border: `1px solid ${cat.accentColor}30` }}
          >
            {cat.tag}
          </span>
          <h3 className="text-2xl lg:text-3xl font-extrabold text-white mb-2 leading-tight group-hover:translate-x-1 transition-transform">
            {cat.name}
          </h3>
          <p className="text-sm font-semibold mb-3" style={{ color: cat.accentLight }}>
            {cat.tagline}
          </p>
          <p className="text-white/50 text-sm leading-relaxed mb-5 max-w-sm">
            {cat.desc}
          </p>

          {/* Subcategory pills */}
          {cat.subcategories && (
            <div className="flex flex-wrap gap-2 mb-5">
              {cat.subcategories.map((sub) => (
                <span
                  key={sub.slug}
                  className="text-[11px] font-medium text-white/60 bg-white/8 px-3 py-1.5 rounded-full border border-white/10"
                >
                  {sub.name}
                </span>
              ))}
            </div>
          )}

          {/* USP badges */}
          <div className="flex flex-wrap gap-2 mb-5">
            {cat.usps.map((usp) => (
              <div
                key={usp}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={cat.accentColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-white/70 text-[11px] font-semibold">{usp}</span>
              </div>
            ))}
          </div>

          <div className="inline-flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all" style={{ color: cat.accentLight }}>
            Explore Products <FiArrowRight className="transition-transform group-hover:translate-x-1" size={16} />
          </div>
        </div>

        {/* SVG illustration */}
        <div className="flex items-center justify-center mt-6 md:mt-0 md:w-[280px] lg:w-[320px] flex-shrink-0">
          <div
            className="w-48 h-48 lg:w-56 lg:h-56 rounded-3xl flex items-center justify-center relative group-hover:scale-105 transition-transform duration-300"
            style={{ background: `${cat.accentColor}10`, border: `2px solid ${cat.accentColor}20` }}
          >
            <div className="absolute inset-3 rounded-2xl" style={{ border: `1px solid ${cat.accentColor}10` }} />
            <div className="w-24 h-24 lg:w-28 lg:h-28">
              {cat.icon}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Standard Banner Card                                               */
/* ------------------------------------------------------------------ */

function BannerCard({ cat }: { cat: Category }) {
  return (
    <Link
      href={`/products?category=${cat.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
      style={{ background: cat.gradient }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage:
          'repeating-linear-gradient(45deg, transparent, transparent 20px, white 20px, white 20.5px),' +
          'repeating-linear-gradient(-45deg, transparent, transparent 20px, white 20px, white 20.5px)',
      }} />
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10"
        style={{ background: `radial-gradient(circle, ${cat.accentColor}, transparent 70%)` }} />

      {/* SVG illustration area */}
      <div className="relative flex items-center justify-center pt-8 pb-4 px-6">
        <div
          className="w-28 h-28 rounded-2xl flex items-center justify-center relative group-hover:scale-110 transition-transform duration-300"
          style={{ background: `${cat.accentColor}10`, border: `1.5px solid ${cat.accentColor}20` }}
        >
          <div className="absolute inset-2 rounded-xl" style={{ border: `1px solid ${cat.accentColor}10` }} />
          <div className="w-16 h-16">
            {cat.icon}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative p-5 pt-2 flex flex-col flex-1">
        <span
          className="self-start px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-[0.15em] mb-3"
          style={{ background: `${cat.accentColor}20`, color: cat.accentLight, border: `1px solid ${cat.accentColor}30` }}
        >
          {cat.tag}
        </span>
        <h3 className="text-lg font-bold text-white mb-1 leading-snug group-hover:translate-x-0.5 transition-transform">
          {cat.name}
        </h3>
        <p className="text-[11px] font-semibold mb-2" style={{ color: cat.accentLight }}>
          {cat.tagline}
        </p>
        <p className="text-white/45 text-xs leading-relaxed line-clamp-2 flex-1">
          {cat.desc}
        </p>

        {/* USP row - 2x2 compact */}
        <div className="grid grid-cols-2 gap-1.5 mt-4 mb-4">
          {cat.usps.map((usp) => (
            <div
              key={usp}
              className="flex items-center gap-1 px-2 py-1.5 rounded-md"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={cat.accentColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-white/60 text-[10px] font-medium">{usp}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold group-hover:gap-2.5 transition-all" style={{ color: cat.accentLight }}>
            View Products <FiArrowRight className="transition-transform group-hover:translate-x-1" size={13} />
          </span>
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: `${cat.accentColor}15` }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={cat.accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
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
          <FeaturedBannerCard cat={featured} />
          {rest.map((cat) => (
            <BannerCard key={cat.slug} cat={cat} />
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
