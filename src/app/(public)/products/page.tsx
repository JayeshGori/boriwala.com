'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/products/ProductCard';
import { IProduct, ICategory } from '@/types';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <>
        <div className="bg-slate-800 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Our Products</h1>
            <p className="text-slate-300 mt-2">Browse our complete range of industrial products</p>
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

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    subcategory: searchParams.get('subcategory') || '',
    condition: searchParams.get('condition') || '',
    search: searchParams.get('search') || '',
    material: searchParams.get('material') || '',
    productType: searchParams.get('productType') || '',
  });

  const [searchInput, setSearchInput] = useState(filters.search);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', '12');
    if (filters.category) params.set('category', filters.category);
    if (filters.subcategory) params.set('subcategory', filters.subcategory);
    if (filters.condition) params.set('condition', filters.condition);
    if (filters.search) params.set('search', filters.search);
    if (filters.material) params.set('material', filters.material);
    if (filters.productType) params.set('productType', filters.productType);

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
  }, [page, filters]);

  useEffect(() => {
    fetch('/api/categories?parentOnly=true')
      .then((r) => r.json())
      .then((d) => { if (d.success) setCategories(d.data); })
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const applyFilter = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    if (key === 'category') newFilters.subcategory = '';
    setFilters(newFilters);
    setPage(1);
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => { if (v) params.set(k, v); });
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    setFilters({ category: '', subcategory: '', condition: '', search: '', material: '', productType: '' });
    setSearchInput('');
    setPage(1);
    router.push('/products', { scroll: false });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilter('search', searchInput);
  };

  const activeCategory = categories.find((c) => c.slug === filters.category || c._id === filters.category);
  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <>
      {/* Page header */}
      <div className="bg-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Our Products</h1>
          <p className="text-slate-300 mt-2">Browse our complete range of industrial products</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search + filter toggle */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
              />
            </div>
            <button type="submit" className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors">
              Search
            </button>
          </form>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors lg:hidden"
          >
            <FiFilter size={16} />
            Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside className={`${showFilters ? 'fixed inset-0 z-40 bg-white p-6 overflow-y-auto' : 'hidden'} lg:block lg:static lg:w-64 lg:shrink-0`}>
            <div className="flex justify-between items-center mb-4 lg:hidden">
              <h3 className="font-semibold text-lg">Filters</h3>
              <button onClick={() => setShowFilters(false)}><FiX size={24} /></button>
            </div>

            {hasActiveFilters && (
              <button onClick={clearFilters} className="w-full mb-4 px-4 py-2 text-sm text-amber-600 border border-amber-300 rounded-lg hover:bg-amber-50 transition-colors">
                Clear All Filters
              </button>
            )}

            {/* Category filter */}
            <div className="mb-6">
              <h3 className="font-semibold text-sm text-slate-800 mb-3 uppercase tracking-wide">Categories</h3>
              <div className="space-y-1">
                <button
                  onClick={() => applyFilter('category', '')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!filters.category ? 'bg-amber-100 text-amber-700 font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <div key={cat._id}>
                    <button
                      onClick={() => applyFilter('category', cat._id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${filters.category === cat._id || filters.category === cat.slug ? 'bg-amber-100 text-amber-700 font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                      {cat.name}
                    </button>
                    {activeCategory?._id === cat._id && cat.subcategories && cat.subcategories.length > 0 && (
                      <div className="ml-4 space-y-1 mt-1">
                        {cat.subcategories.map((sub) => (
                          <button
                            key={sub._id}
                            onClick={() => applyFilter('subcategory', sub._id)}
                            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors ${filters.subcategory === sub._id ? 'bg-amber-100 text-amber-700 font-medium' : 'text-slate-500 hover:bg-slate-50'}`}
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
            <div className="mb-6">
              <h3 className="font-semibold text-sm text-slate-800 mb-3 uppercase tracking-wide">Condition</h3>
              <div className="space-y-1">
                {[
                  { value: '', label: 'All' },
                  { value: 'new', label: 'New' },
                  { value: 'old', label: 'Used / Old' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => applyFilter('condition', opt.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${filters.condition === opt.value ? 'bg-amber-100 text-amber-700 font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {showFilters && (
              <button
                onClick={() => setShowFilters(false)}
                className="w-full mt-4 px-4 py-2.5 bg-amber-500 text-white rounded-lg font-medium lg:hidden"
              >
                Apply Filters
              </button>
            )}
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-slate-500">{total} product{total !== 1 ? 's' : ''} found</p>
            </div>

            {loading ? (
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
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
                {/* Pagination */}
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
