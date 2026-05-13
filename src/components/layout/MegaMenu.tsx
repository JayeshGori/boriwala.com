'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { FiChevronDown, FiChevronRight, FiArrowRight, FiPackage, FiGrid } from 'react-icons/fi';

type Subcategory = {
  _id: string;
  name: string;
  slug: string;
  image?: string;
};

export type MegaCategory = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  subcategories?: Subcategory[];
};

// Fallback categories used when API is empty / DB not seeded yet.
const FALLBACK_CATEGORIES: MegaCategory[] = [
  { _id: 'f1', name: 'PP Bags / Fabric', slug: 'pp-bags-fabric', description: 'Woven PP bags, patta fabric',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcITV7hy05B9EERn2hqeD8frjgL-Px8aZ9pw&s',
    subcategories: [
      { _id: 's1', name: 'Cement Bags', slug: 'cement-bags' },
      { _id: 's2', name: 'Food Grain Bags', slug: 'food-grain-bags' },
      { _id: 's3', name: 'Industrial Used PP Bags', slug: 'industrial-used-pp-bags' },
      { _id: 's4', name: 'Patta Fabric', slug: 'patta-fabric' },
    ],
  },
  { _id: 'f2', name: 'BOPP Bags', slug: 'bopp-bags', description: 'Glossy laminated bags',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2Tv-UIEsSLcLDLxZd18n5333GlqHmV763UA&s' },
  { _id: 'f3', name: 'Jute Bags', slug: 'jute-bags', description: 'Eco-friendly jute sacks',
    image: 'https://5.imimg.com/data5/SELLER/Default/2023/9/345402631/OA/UB/CM/149005756/jute-sack-bags-250x250.jpg' },
  { _id: 'f4', name: 'Monofilament Bags', slug: 'monofilament-bags', description: 'Mesh produce bags',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpJ3FMBstLlzhML6SXBnuxNwlfHNDylH7L-Q&s' },
  { _id: 'f5', name: 'Leno Bags', slug: 'leno-bags', description: 'Tubular leno for produce',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNkixLS9_5XmWgtnmt9cEwEQ0cQzcZqg4IfA&s' },
  { _id: 'f6', name: 'PP Granules', slug: 'pp-granules', description: 'Reprocessed granules',
    image: 'https://qualityplast.in/wp-content/uploads/2024/05/Untitled-design-86.jpeg' },
  { _id: 'f7', name: 'Used Worn Sarees', slug: 'used-worn-sarees', description: 'Sorted sarees for packing',
    image: 'https://5.imimg.com/data5/SELLER/Default/2023/12/372859847/BW/EV/NQ/10324145/multicolor-old-saree.jpg' },
  { _id: 'f8', name: 'FIBC Jumbo Bags', slug: 'jumbo-bags', description: 'Heavy-duty 1-ton bags',
    image: 'https://5.imimg.com/data5/SELLER/Default/2021/6/PM/GF/RH/72368631/fibc-jumbo-bag-500x500.jpg' },
];

let cache: { ts: number; data: MegaCategory[] } | null = null;
const CACHE_MS = 60_000;

async function fetchCategories(): Promise<MegaCategory[]> {
  if (cache && Date.now() - cache.ts < CACHE_MS) return cache.data;
  try {
    const res = await fetch('/api/categories?parentOnly=true', { cache: 'no-store' });
    const json = await res.json();
    if (json?.success && Array.isArray(json.data) && json.data.length > 0) {
      cache = { ts: Date.now(), data: json.data };
      return json.data;
    }
  } catch {}
  cache = { ts: Date.now(), data: FALLBACK_CATEGORIES };
  return FALLBACK_CATEGORIES;
}

/* ------------------------- DESKTOP MEGA MENU ------------------------- */
export function DesktopMegaMenu() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<MegaCategory[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  const handleEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const handleLeave = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  const active = categories[activeIdx];
  const featured = categories[0];

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
          open ? 'text-amber-600 bg-amber-50' : 'text-slate-600 hover:text-amber-600 hover:bg-amber-50'
        }`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        Categories
        <FiChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50"
            // Align mega panel to viewport via fixed-width below
          >
            <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden w-[min(95vw,980px)]">
              <div className="grid grid-cols-12">
                {/* Left rail: category list */}
                <div className="col-span-4 bg-slate-50 border-r border-slate-200 py-3 max-h-[480px] overflow-y-auto">
                  {categories.map((cat, i) => (
                    <button
                      key={cat._id}
                      onMouseEnter={() => setActiveIdx(i)}
                      onClick={() => setActiveIdx(i)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                        i === activeIdx
                          ? 'bg-amber-50 text-amber-700 border-l-4 border-amber-500'
                          : 'text-slate-700 hover:bg-white border-l-4 border-transparent'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                        {cat.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                        ) : (
                          <FiPackage className="text-slate-400" />
                        )}
                      </div>
                      <span className="font-medium truncate">{cat.name}</span>
                      <FiChevronRight size={14} className="ml-auto text-slate-400" />
                    </button>
                  ))}
                </div>

                {/* Right panel: subcategories + featured */}
                <div className="col-span-8 p-6">
                  {active && (
                    <motion.div
                      key={active._id}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">{active.name}</h3>
                          {active.description && (
                            <p className="text-sm text-slate-500 mt-0.5">{active.description}</p>
                          )}
                        </div>
                        <Link
                          href={`/products?category=${active.slug}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          View All <FiArrowRight size={12} />
                        </Link>
                      </div>

                      {active.subcategories && active.subcategories.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {active.subcategories.map((sub) => (
                            <Link
                              key={sub._id}
                              href={`/products?category=${active.slug}&subcategory=${sub.slug}`}
                              className="group flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-amber-50 transition-colors"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-amber-500 transition-colors" />
                              <span className="text-sm text-slate-700 group-hover:text-amber-700 font-medium truncate">
                                {sub.name}
                              </span>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <Link
                          href={`/products?category=${active.slug}`}
                          className="block group rounded-xl overflow-hidden bg-slate-100 relative h-44"
                        >
                          {active.image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={active.image} alt={active.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
                          <span className="absolute bottom-3 left-4 text-white text-sm font-semibold">
                            Browse {active.name} →
                          </span>
                        </Link>
                      )}

                      {/* Featured banner inside panel */}
                      {featured && active._id !== featured._id && (
                        <Link
                          href={`/products?category=${featured.slug}`}
                          className="mt-5 flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl hover:shadow-md transition-shadow group"
                        >
                          {featured.image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={featured.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Featured</p>
                            <p className="text-sm font-semibold text-slate-800 truncate">{featured.name}</p>
                          </div>
                          <FiArrowRight className="text-amber-600 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Footer bar */}
              <div className="flex items-center justify-between px-6 py-3 bg-slate-50 border-t border-slate-200 text-xs">
                <span className="text-slate-500">
                  {categories.length} categories · Quality assured · Pan India delivery
                </span>
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-1 font-semibold text-slate-800 hover:text-amber-600 transition-colors"
                >
                  <FiGrid size={12} /> View All Categories <FiArrowRight size={12} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------- MOBILE ACCORDION ------------------------- */
export function MobileCategoryAccordion({ onNavigate }: { onNavigate?: () => void }) {
  const [categories, setCategories] = useState<MegaCategory[]>([]);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  return (
    <div className="border-t border-slate-100 mt-1 pt-1">
      <div className="px-4 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
        Browse Categories
      </div>
      {categories.map((cat, i) => {
        const isOpen = openIdx === i;
        const hasSubs = cat.subcategories && cat.subcategories.length > 0;
        return (
          <div key={cat._id} className="border-b border-slate-100 last:border-0">
            <div className="flex items-center">
              <Link
                href={`/products?category=${cat.slug}`}
                onClick={onNavigate}
                className="flex-1 flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                  {cat.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cat.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <FiPackage size={14} className="text-slate-400" />
                  )}
                </div>
                <span className="truncate">{cat.name}</span>
              </Link>
              {hasSubs && (
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="p-3 text-slate-500 hover:text-amber-600"
                  aria-label="Toggle subcategories"
                  aria-expanded={isOpen}
                >
                  <FiChevronDown
                    size={18}
                    className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
              )}
            </div>
            <AnimatePresence initial={false}>
              {isOpen && hasSubs && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="overflow-hidden bg-slate-50"
                >
                  {cat.subcategories!.map((sub) => (
                    <Link
                      key={sub._id}
                      href={`/products?category=${cat.slug}&subcategory=${sub.slug}`}
                      onClick={onNavigate}
                      className="flex items-center gap-2 pl-14 pr-4 py-2.5 text-sm text-slate-600 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                    >
                      <span className="w-1 h-1 rounded-full bg-slate-400" />
                      {sub.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
      <Link
        href="/categories"
        onClick={onNavigate}
        className="flex items-center justify-center gap-2 mx-4 mt-3 mb-1 px-4 py-2.5 border-2 border-slate-800 text-slate-800 text-sm font-semibold rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
      >
        <FiGrid size={14} /> View All Categories
      </Link>
    </div>
  );
}
