'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { whatsappLink } from '@/lib/contact';

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

const AUTO_SLIDE_MS = 5500;

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
    return () => { alive = false; };
  }, []);

  const next = useCallback(() => {
    if (banners.length === 0) return;
    setIdx((i) => (i + 1) % banners.length);
  }, [banners.length]);

  const prev = useCallback(() => {
    if (banners.length === 0) return;
    setIdx((i) => (i - 1 + banners.length) % banners.length);
  }, [banners.length]);

  // Auto-slide
  useEffect(() => {
    if (paused || banners.length < 2) return;
    const t = setInterval(next, AUTO_SLIDE_MS);
    return () => clearInterval(t);
  }, [paused, banners.length, next]);

  // Until banners load OR if no banners exist, render the original static fallback hero
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
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/55 to-slate-900/20" />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Text content */}
        <div className="absolute inset-0 flex">
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 flex">
            <motion.div
              key={current._id + '-text'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15 }}
              className={`flex flex-col justify-center max-w-2xl ${align}`}
            >
              {current.badge && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/15 border border-amber-400/30 rounded-full text-amber-300 text-[11px] font-bold uppercase tracking-widest mb-4 self-start">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                  {current.badge}
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow">
                {current.title}
              </h1>
              {current.subtitle && (
                <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed max-w-xl drop-shadow">
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

/* ---------- Static fallback (used when no banners in DB) ---------- */
function StaticHero() {
  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-600 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-20 md:py-28 lg:py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            15+ Years of Trusted Trading
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5 sm:mb-6">
            Your Trusted{' '}
            <span className="text-amber-400">B2B Trading</span>{' '}
            Partner
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-7 sm:mb-8 leading-relaxed max-w-2xl">
            Dealing in PP Bags, Jute Bags, Plastic Products, Industrial Packaging Materials, Scrap Materials &amp; More — Serving Industries Across India
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-3 sm:py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors text-sm sm:text-base"
            >
              Explore Products
              <FiArrowRight />
            </Link>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-3 sm:py-3.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors text-sm sm:text-base"
            >
              <FaWhatsapp size={20} />
              WhatsApp Us
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-10 sm:mt-12 pt-10 sm:pt-12 border-t border-slate-700/50">
            {[
              { value: '15+', label: 'Years Experience' },
              { value: '100+', label: 'Products' },
              { value: '500+', label: 'Happy Clients' },
              { value: 'Pan India', label: 'Delivery' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-400">{stat.value}</div>
                <div className="text-xs sm:text-sm text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
