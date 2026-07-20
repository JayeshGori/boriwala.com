'use client';

import { useEffect, useState, useCallback, useRef, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiShield,
  FiDollarSign,
  FiPackage,
  FiTruck,
} from 'react-icons/fi';
import { whatsappLink } from '@/lib/contact';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface DynamicBanner {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  mobileImage?: string;
  ctaText?: string;
  ctaUrl?: string;
  textPosition: 'left' | 'center' | 'right';
  overlay: boolean;
  badge?: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const AUTO_SLIDE_MS = 5500;

const CATEGORIES = [
  { label: 'PP Bags', slug: 'pp-bags-fabric' },
  { label: 'BOPP Bags', slug: 'bopp-bags' },
  { label: 'Jute Bags', slug: 'jute-bags' },
  { label: 'PP Granules', slug: 'pp-granules' },
  { label: 'FIBC Jumbo Bags', slug: 'jumbo-bags' },
  { label: 'Leno Bags', slug: 'leno-bags' },
];

const STATS: { value: number; suffix: string; label: string }[] = [
  { value: 15, suffix: '+', label: 'Years Experience' },
  { value: 500, suffix: '+', label: 'Trusted Clients' },
  { value: 100, suffix: '+', label: 'Products' },
  { value: 28, suffix: '+', label: 'States Served' },
];

const TRUST_BADGES = [
  { icon: FiShield, text: 'Quality Assured' },
  { icon: FiDollarSign, text: 'Competitive Pricing' },
  { icon: FiPackage, text: 'Bulk Orders' },
  { icon: FiTruck, text: 'Pan India Delivery' },
];

/* ------------------------------------------------------------------ */
/*  Animated counter                                                   */
/* ------------------------------------------------------------------ */

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(motionVal, target, {
      duration: 1.8,
      ease: 'easeOut',
    });
    return controls.stop;
  }, [isInView, motionVal, target]);

  useEffect(() => {
    const unsub = rounded.on('change', (v) => setDisplay(v));
    return unsub;
  }, [rounded]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

/* ================================================================== */
/*  Main export                                                        */
/* ================================================================== */

export default function HeroBanner() {
  const [banners, setBanners] = useState<DynamicBanner[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch('/api/banners')
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        if (d?.success && Array.isArray(d.data)) setBanners(d.data);
      })
      .catch(() => {})
      .finally(() => alive && setLoaded(true));
    return () => {
      alive = false;
    };
  }, []);

  const next = useCallback(() => {
    if (banners.length === 0) return;
    setIdx((i) => (i + 1) % banners.length);
  }, [banners.length]);

  const prev = useCallback(() => {
    if (banners.length === 0) return;
    setIdx((i) => (i - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (paused || banners.length < 2) return;
    const t = setInterval(next, AUTO_SLIDE_MS);
    return () => clearInterval(t);
  }, [paused, banners.length, next]);

  /* Show static hero while loading OR when no banners exist */
  if (!loaded || banners.length === 0) return <StaticHero />;

  const current = banners[idx];
  const align =
    current.textPosition === 'center'
      ? 'items-center text-center mx-auto'
      : current.textPosition === 'right'
      ? 'items-end text-right ml-auto'
      : 'items-start text-left';

  return (
    <section
      className="relative bg-slate-900 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative w-full aspect-[16/7] sm:aspect-[16/6] md:aspect-[16/5] lg:aspect-[21/7] max-h-[640px] min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current._id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.mobileImage || current.image}
              alt={current.title}
              className="w-full h-full object-cover sm:hidden"
              loading="eager"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.image}
              alt={current.title}
              className="w-full h-full object-cover hidden sm:block"
              loading="eager"
            />
            {current.overlay && (
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/60 to-slate-900/25" />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Text content */}
        <div className="absolute inset-0 flex">
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 flex">
            <motion.div
              key={current._id + '-text'}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15 }}
              className={`flex flex-col justify-center max-w-2xl ${align}`}
            >
              {current.badge && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/15 border border-amber-400/30 rounded-full text-amber-300 text-[11px] font-bold uppercase tracking-widest mb-4 self-start backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                  {current.badge}
                </span>
              )}
              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
                style={{
                  fontFamily: 'var(--font-poppins)',
                  textShadow: '0 2px 16px rgba(0,0,0,0.5)',
                }}
              >
                {current.title}
              </h1>
              {current.subtitle && (
                <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-slate-100 leading-relaxed max-w-xl drop-shadow-lg">
                  {current.subtitle}
                </p>
              )}
              {current.ctaText && current.ctaUrl && (
                <Link
                  href={current.ctaUrl}
                  className="mt-5 sm:mt-7 inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors text-sm sm:text-base shadow-lg shadow-amber-900/30 self-start"
                >
                  {current.ctaText} <FiArrowRight />
                </Link>
              )}
            </motion.div>
          </div>
        </div>

        {/* Arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous banner"
              className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-md transition-colors"
            >
              <FiChevronLeft size={22} />
            </button>
            <button
              onClick={next}
              aria-label="Next banner"
              className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-md transition-colors"
            >
              <FiChevronRight size={22} />
            </button>
          </>
        )}

        {/* Dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {banners.map((b, i) => (
              <button
                key={b._id}
                onClick={() => setIdx(i)}
                aria-label={`Go to banner ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === idx ? 'w-8 bg-amber-400' : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ================================================================== */
/*  Static hero fallback                                               */
/* ================================================================== */

function StaticHero() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/products?search=${encodeURIComponent(q)}`);
  }

  return (
    <section className="relative overflow-hidden bg-slate-900">
      {/* ---------- Background layers ---------- */}

      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0f2847] to-slate-900" />

      {/* Geometric industrial pattern (CSS diagonal lines) */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent, transparent 30px, #ffffff 30px, #ffffff 31px),' +
            'repeating-linear-gradient(-45deg, transparent, transparent 30px, #ffffff 30px, #ffffff 31px)',
        }}
      />

      {/* Accent glow blobs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-[#1a73e8]/20 rounded-full blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-[#f46f25]/15 rounded-full blur-[120px]" />

      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* ---------- Content ---------- */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-10 sm:pt-20 sm:pb-14 md:pt-28 md:pb-16 lg:pt-32 lg:pb-20">
        {/* Top section */}
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#1a73e8]/15 border border-[#1a73e8]/30 rounded-full text-[#5ea3ff] text-xs sm:text-sm font-semibold tracking-wide mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-[#1a73e8] rounded-full animate-pulse" />
              Trusted B2B Industrial Packaging Partner
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-[1.15] mb-5 sm:mb-6"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Industrial Packaging{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-[#f46f25]">
              Solutions
            </span>{' '}
            for Every Business Need
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed mb-8 sm:mb-10 max-w-2xl"
          >
            From PP &amp; BOPP bags to FIBC Jumbo Bags and granules -- quality packaging materials at competitive wholesale prices, delivered across India.
          </motion.p>
        </div>

        {/* Search bar */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex max-w-xl mb-6"
        >
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products... e.g. PP Woven Bags"
              className="w-full pl-11 pr-4 py-3 sm:py-3.5 rounded-l-xl bg-white/10 border border-white/15 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/60 focus:border-transparent backdrop-blur-sm text-sm sm:text-base"
            />
          </div>
          <button
            type="submit"
            className="px-5 sm:px-7 py-3 sm:py-3.5 bg-[#1a73e8] hover:bg-[#1557b8] text-white font-semibold rounded-r-xl transition-colors text-sm sm:text-base"
          >
            Search
          </button>
        </motion.form>

        {/* Category pills */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap gap-2 sm:gap-2.5 mb-10 sm:mb-14"
        >
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-white/8 border border-white/10 text-slate-300 hover:bg-[#1a73e8]/20 hover:border-[#1a73e8]/40 hover:text-white transition-all"
            >
              {cat.label}
            </Link>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-12 sm:mb-16"
        >
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-3 sm:py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors text-sm sm:text-base shadow-lg shadow-amber-500/20"
          >
            Explore Products
            <FiArrowRight />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-3 sm:py-3.5 bg-transparent border-2 border-white/30 hover:border-white/60 text-white font-semibold rounded-xl transition-colors text-sm sm:text-base"
          >
            Get Best Price
            <FiArrowRight />
          </Link>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-3 sm:py-3.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors text-sm sm:text-base sm:ml-auto"
          >
            <FaWhatsapp size={20} />
            WhatsApp Us
          </a>
        </motion.div>

        {/* ---------- Stats counter ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 py-8 sm:py-10 border-t border-b border-white/10"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <div
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-[#f46f25]"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* ---------- Trust badges ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-10"
        >
          {TRUST_BADGES.map((badge) => (
            <div
              key={badge.text}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/8"
            >
              <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-[#1a73e8]/15 text-[#5ea3ff]">
                <badge.icon size={18} />
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-300">{badge.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
