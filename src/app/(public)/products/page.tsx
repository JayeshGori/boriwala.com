'use client';

import { Suspense, useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';
import { IProduct, ICategory } from '@/types';
import { FiSearch, FiFilter, FiX, FiChevronRight, FiRotateCcw } from 'react-icons/fi';
import { getFiltersForCategory, FilterDefinition } from '@/lib/filter-definitions';

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <>
        <div className="bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="h-4 bg-slate-200 rounded w-48 animate-pulse" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-slate-200" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-slate-200 rounded w-1/3" />
                  <div className="h-5 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    }>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    subcategory: searchParams.get('subcategory') || '',
    condition: searchParams.get('condition') || '',
    search: searchParams.get('search') || '',
  });

  // Dynamic filter attributes (fa_quality, fa_gram, etc.)
  const [faFilters, setFaFilters] = useState<Record<string, string>>(() => {
    const fa: Record<string, string> = {};
    searchParams.forEach((val, key) => {
      if (key.startsWith('fa_')) fa[key.slice(3)] = val;
    });
    return fa;
  });

  const [searchInput, setSearchInput] = useState(filters.search);

  // Determine active category and subcategory objects
  const activeCategory = useMemo(
    () => categories.find((c) => c.slug === filters.category || c._id === filters.category),
    [categories, filters.category]
  );
  const activeSubcategory = useMemo(
    () => activeCategory?.subcategories?.find((s) => s.slug === filters.subcategory || s._id === filters.subcategory),
    [activeCategory, filters.subcategory]
  );

  // Get dynamic filters based on active category/subcategory
  const dynamicFilters: FilterDefinition[] = useMemo(() => {
    const catSlug = activeCategory?.slug || '';
    const subSlug = activeSubcategory?.slug || '';
    return getFiltersForCategory(catSlug, subSlug);
  }, [activeCategory, activeSubcategory]);

  const buildUrlParams = useCallback((f: typeof filters, fa: Record<string, string>, s: string) => {
    const params = new URLSearchParams();
    if (f.category) params.set('category', f.category);
    if (f.subcategory) params.set('subcategory', f.subcategory);
    if (f.condition) params.set('condition', f.condition);
    if (f.search) params.set('search', f.search);
    if (s && s !== 'newest') params.set('sort', s);
    Object.entries(fa).forEach(([k, v]) => { if (v) params.set(`fa_${k}`, v); });
    return params;
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = buildUrlParams(filters, faFilters, sort);
    params.set('page', page.toString());
    params.set('limit', '12');

    try {
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, [page, filters, faFilters, sort, buildUrlParams]);

  useEffect(() => {
    fetch('/api/categories?parentOnly=true')
      .then((r) => r.json())
      .then((d) => { if (d.success) setCategories(d.data); })
      .catch(console.error);
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const pushUrl = useCallback((f: typeof filters, fa: Record<string, string>, s: string) => {
    const params = buildUrlParams(f, fa, s);
    router.push(`/products?${params.toString()}`, { scroll: false });
  }, [router, buildUrlParams]);

  const applyFilter = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    let newFa = faFilters;
    if (key === 'category') {
      newFilters.subcategory = '';
      newFa = {};
      setFaFilters({});
    }
    if (key === 'subcategory') {
      newFa = {};
      setFaFilters({});
    }
    setFilters(newFilters);
    setPage(1);
    pushUrl(newFilters, newFa, sort);
  };

  const applyFaFilter = (key: string, value: string) => {
    const newFa = { ...faFilters };
    if (newFa[key] === value) {
      delete newFa[key];
    } else {
      newFa[key] = value;
    }
    setFaFilters(newFa);
    setPage(1);
    pushUrl(filters, newFa, sort);
  };

  const clearFilters = () => {
    setFilters({ category: '', subcategory: '', condition: '', search: '' });
    setFaFilters({});
    setSearchInput('');
    setSort('newest');
    setPage(1);
    router.push('/products', { scroll: false });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilter('search', searchInput);
  };

  const handleSort = (val: string) => {
    setSort(val);
    setPage(1);
    pushUrl(filters, faFilters, val);
  };

  const hasActiveFilters = Object.values(filters).some(Boolean) || Object.keys(faFilters).length > 0;

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
            <Link href="/" className="hover:text-amber-600">Home</Link>
            <FiChevronRight size={14} />
            <Link href="/products" className={`hover:text-amber-600 ${!activeCategory ? 'text-slate-800 font-medium' : ''}`}>Products</Link>
            {activeCategory && (
              <>
                <FiChevronRight size={14} />
                <button
                  onClick={() => applyFilter('subcategory', '')}
                  className={`hover:text-amber-600 ${!activeSubcategory ? 'text-slate-800 font-medium' : ''}`}
                >
                  {activeCategory.name}
                </button>
              </>
            )}
            {activeSubcategory && (
              <>
                <FiChevronRight size={14} />
                <span className="text-slate-800 font-medium">{activeSubcategory.name}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Page header */}
      <div className="bg-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {activeSubcategory?.name || activeCategory?.name || 'All Products'}
          </h1>
          <p className="text-slate-300 mt-1 text-sm">
            {activeCategory?.description || 'Browse our complete range of industrial packaging products'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Top bar: search + sort + mobile filter toggle */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products, categories, specifications..."
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
              />
            </div>
            <button type="submit" className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors">
              Search
            </button>
          </form>
          <div className="flex gap-2">
            <select
              value={sort}
              onChange={(e) => handleSort(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name_asc">Name A-Z</option>
              <option value="name_desc">Name Z-A</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors lg:hidden"
            >
              <FiFilter size={14} />
              Filters
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* LEFT SIDEBAR */}
          <aside className={`${showFilters ? 'fixed inset-0 z-40 bg-white p-6 overflow-y-auto' : 'hidden'} lg:block lg:static lg:w-64 lg:shrink-0`}>
            <div className="flex justify-between items-center mb-4 lg:hidden">
              <h3 className="font-semibold text-lg">Filters</h3>
              <button onClick={() => setShowFilters(false)}><FiX size={24} /></button>
            </div>

            {hasActiveFilters && (
              <button onClick={clearFilters} className="w-full mb-4 px-3 py-2 text-sm text-amber-600 border border-amber-300 rounded-lg hover:bg-amber-50 transition-colors flex items-center justify-center gap-2">
                <FiRotateCcw size={14} /> Reset All Filters
              </button>
            )}

            {/* Category tree */}
            <div className="mb-5">
              <h3 className="font-semibold text-xs text-slate-800 mb-2 uppercase tracking-wider">Categories</h3>
              <div className="space-y-0.5 max-h-[340px] overflow-y-auto pr-1">
                <button
                  onClick={() => { applyFilter('category', ''); }}
                  className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${!filters.category ? 'bg-amber-100 text-amber-700 font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <div key={cat._id}>
                    <button
                      onClick={() => applyFilter('category', cat.slug || cat._id)}
                      className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${(filters.category === cat._id || filters.category === cat.slug) ? 'bg-amber-100 text-amber-700 font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                      <span className="mr-1.5">{cat.icon || '📦'}</span>{cat.name}
                    </button>
                    {activeCategory?._id === cat._id && cat.subcategories && cat.subcategories.length > 0 && (
                      <div className="ml-6 space-y-0.5 mt-0.5">
                        {cat.subcategories.map((sub) => (
                          <button
                            key={sub._id}
                            onClick={() => applyFilter('subcategory', sub.slug || sub._id)}
                            className={`w-full text-left px-3 py-1 rounded text-xs transition-colors ${(filters.subcategory === sub._id || filters.subcategory === sub.slug) ? 'bg-amber-100 text-amber-700 font-medium' : 'text-slate-500 hover:bg-slate-50'}`}
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Condition filter */}
            <div className="mb-5">
              <h3 className="font-semibold text-xs text-slate-800 mb-2 uppercase tracking-wider">Condition</h3>
              <div className="space-y-1">
                {[
                  { value: '', label: 'All' },
                  { value: 'new', label: 'New' },
                  { value: 'old', label: 'Used' },
                  { value: 'rejected', label: 'Rejected' },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 px-3 py-1 text-sm text-slate-600 hover:bg-slate-50 rounded cursor-pointer">
                    <input
                      type="radio"
                      name="condition"
                      checked={filters.condition === opt.value}
                      onChange={() => applyFilter('condition', opt.value)}
                      className="accent-amber-500"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Dynamic filters per category */}
            {activeCategory && dynamicFilters.map((fd) => {
              if (fd.key === 'condition') return null;
              return (
                <div key={fd.key} className="mb-5">
                  <h3 className="font-semibold text-xs text-slate-800 mb-2 uppercase tracking-wider">{fd.label}</h3>
                  <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                    {fd.options.map((opt) => (
                      <label key={opt.value} className="flex items-center gap-2 px-3 py-1 text-sm text-slate-600 hover:bg-slate-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={faFilters[fd.key] === opt.value}
                          onChange={() => applyFaFilter(fd.key, opt.value)}
                          className="accent-amber-500 rounded"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}

            {showFilters && (
              <button
                onClick={() => setShowFilters(false)}
                className="w-full mt-4 px-4 py-2.5 bg-amber-500 text-white rounded-lg font-medium lg:hidden"
              >
                Apply Filters
              </button>
            )}
          </aside>

          {/* MAIN PRODUCT GRID */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-slate-500">{total} product{total !== 1 ? 's' : ''} found</p>
              {/* Active filter tags */}
              {Object.keys(faFilters).length > 0 && (
                <div className="hidden sm:flex flex-wrap gap-1.5">
                  {Object.entries(faFilters).map(([k, v]) => (
                    <span key={k} className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-full border border-amber-200">
                      {v}
                      <button onClick={() => applyFaFilter(k, v)} className="hover:text-red-500"><FiX size={12} /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] bg-slate-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-3 bg-slate-200 rounded w-1/3" />
                      <div className="h-5 bg-slate-200 rounded w-3/4" />
                      <div className="h-3 bg-slate-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className="px-4 py-2 border border-slate-300 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-50 transition-colors"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                      .map((p, idx, arr) => (
                        <span key={p}>
                          {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-2 py-2 text-slate-400">...</span>}
                          <button
                            onClick={() => setPage(p)}
                            className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-amber-500 text-white' : 'border border-slate-300 hover:bg-slate-50'}`}
                          >
                            {p}
                          </button>
                        </span>
                      ))}
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                      className="px-4 py-2 border border-slate-300 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-50 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">📦</div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">No products found</h3>
                <p className="text-slate-500 text-sm">Try adjusting your filters or search terms</p>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="mt-4 px-6 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium">
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
