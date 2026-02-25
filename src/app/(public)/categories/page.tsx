'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ICategory } from '@/types';
import { FiChevronRight } from 'react-icons/fi';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories?parentOnly=true')
      .then((r) => r.json())
      .then((d) => { if (d.success) setCategories(d.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="bg-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Product Categories</h1>
          <p className="text-slate-300 mt-2">Browse all our product categories and subcategories</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl border border-slate-200 p-6">
                <div className="w-16 h-16 bg-slate-200 rounded-xl mb-4" />
                <div className="h-5 bg-slate-200 rounded w-2/3 mb-2" />
                <div className="h-3 bg-slate-200 rounded w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div key={cat._id} className="bg-white rounded-xl border border-slate-200 hover:border-amber-300 hover:shadow-lg transition-all overflow-hidden">
                <Link href={`/products?category=${cat._id}`} className="block p-6">
                  <div className="flex items-start gap-4">
                    {cat.image ? (
                      <div className="relative w-16 h-16 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                        <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="64px" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-amber-50 rounded-xl flex items-center justify-center text-3xl shrink-0">
                        {cat.icon || '📦'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-semibold text-slate-800 hover:text-amber-600 transition-colors">{cat.name}</h2>
                      {cat.description && (
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{cat.description}</p>
                      )}
                    </div>
                  </div>
                </Link>

                {cat.subcategories && cat.subcategories.length > 0 && (
                  <div className="border-t border-slate-100 px-6 py-3">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Subcategories</p>
                    <div className="flex flex-wrap gap-2">
                      {cat.subcategories.map((sub) => (
                        <Link
                          key={sub._id}
                          href={`/products?category=${cat._id}&subcategory=${sub._id}`}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-700 text-xs font-medium rounded-full border border-slate-200 hover:border-amber-200 transition-all"
                        >
                          {sub.name}
                          <FiChevronRight size={12} />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && categories.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📂</div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No categories yet</h3>
            <p className="text-slate-500 text-sm">Categories will appear here once added by the admin.</p>
          </div>
        )}
      </div>
    </>
  );
}
