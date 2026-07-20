'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiPackage, FiGrid } from 'react-icons/fi';
import ProductCard from '@/components/products/ProductCard';
import { IProduct } from '@/types';

type FilterTab = 'all' | 'new' | 'old' | 'rejected';

const TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New' },
  { key: 'old', label: 'Used' },
  { key: 'rejected', label: 'On Demand' },
];

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="relative aspect-[4/3] bg-slate-200 overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>
      <div className="p-4 space-y-3">
        <div className="relative h-3 bg-slate-200 rounded w-1/3 overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
        <div className="relative h-5 bg-slate-200 rounded w-3/4 overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
        <div className="relative h-3 bg-slate-200 rounded w-1/2 overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
        <div className="relative h-8 bg-slate-200 rounded w-full overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  useEffect(() => {
    fetch('/api/products?featured=true&limit=8')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProducts(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts =
    activeTab === 'all'
      ? products
      : products.filter((p) => p.condition === activeTab);

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden">
      {/* Subtle background dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #1a73e8 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative max-w-7xl mx-auto px-4"
      >
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1a73e8]/10 text-[#1a73e8] text-xs font-semibold uppercase tracking-wider mb-3">
            <FiGrid className="w-3.5 h-3.5" />
            Top Picks
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
            Featured Products
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Discover our most popular industrial packaging products trusted by
            businesses across India
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-100 border border-slate-200">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === tab.key
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-5">
              <FiPackage className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              No products found
            </h3>
            <p className="text-slate-500 mb-6 max-w-sm">
              There are no products matching this filter right now. Browse our
              full catalog to find what you need.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-[#1a73e8] hover:bg-[#1565c0] rounded-lg transition-colors"
            >
              Browse All Products
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-full transition-colors shadow-md shadow-amber-500/20"
          >
            View All Products
            <FiArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold rounded-full transition-colors bg-white"
          >
            Request Bulk Quote
          </Link>
        </div>
      </motion.div>

      {/* Shimmer keyframes */}
      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </section>
  );
}
