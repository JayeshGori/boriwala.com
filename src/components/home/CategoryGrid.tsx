'use client';

import Link from 'next/link';
import { FiPackage, FiTag, FiWind, FiZap, FiBox, FiGrid, FiCpu, FiLayers, FiMaximize, FiShield, FiLink, FiActivity, FiRefreshCw, FiLayers as FiFabric, FiUser } from 'react-icons/fi';

const categories = [
  { name: 'PP Bags', slug: 'pp-bags', icon: FiPackage, desc: 'New & used polypropylene bags', gradient: 'from-blue-500 to-blue-600', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop' },
  { name: 'BOPP Bags', slug: 'bopp-bags', icon: FiTag, desc: 'Premium BOPP laminated bags', gradient: 'from-purple-500 to-purple-600', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop' },
  { name: 'Jute Bags', slug: 'jute-bags', icon: FiWind, desc: 'Eco-friendly jute packaging', gradient: 'from-green-500 to-green-600', image: 'https://images.unsplash.com/photo-1615486342407-cf8fd79d8d59?w=400&h=300&fit=crop' },
  { name: 'Cement Bags', slug: 'cement-bags', icon: FiZap, desc: 'Heavy-duty cement bags', gradient: 'from-slate-500 to-slate-600', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop' },
  { name: 'Food Grain Bags', slug: 'food-grain-bags', icon: FiBox, desc: 'Food-grade storage bags', gradient: 'from-amber-500 to-amber-600', image: 'https://images.unsplash.com/photo-1595845927420-3f45b3662672?w=400&h=300&fit=crop' },
  { name: 'Monofilament Bags', slug: 'monofilament-bags', icon: FiGrid, desc: 'Mesh bags for vegetables', gradient: 'from-emerald-500 to-emerald-600', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=300&fit=crop' },
  { name: 'PP Granules', slug: 'pp-granules', icon: FiCpu, desc: 'Reprocessed PP granules', gradient: 'from-indigo-500 to-indigo-600', image: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?w=400&h=300&fit=crop' },
  { name: 'Leno Bags', slug: 'leno-bags', icon: FiLayers, desc: 'Leno bags for produce packing', gradient: 'from-teal-500 to-teal-600', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop' },
  { name: 'Jumbo Bags', slug: 'jumbo-bags', icon: FiMaximize, desc: 'FIBC jumbo bags for bulk', gradient: 'from-orange-500 to-orange-600', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop' },
  { name: 'Anti Slip Bags', slug: 'anti-slip-bags', icon: FiShield, desc: 'HAL & FCI anti-slip bags', gradient: 'from-red-500 to-red-600', image: 'https://images.unsplash.com/photo-1563769902815-1f8d0f3c5b2d?w=400&h=300&fit=crop' },
  { name: 'Lacha Sutli', slug: 'lacha-sutli', icon: FiLink, desc: 'Virgin & semi-virgin sutli', gradient: 'from-yellow-500 to-yellow-600', image: 'https://images.unsplash.com/photo-1628102441627-77857e9b8939?w=400&h=300&fit=crop' },
  { name: 'Belar Twine', slug: 'belar-twine', icon: FiActivity, desc: 'Industrial belar twine', gradient: 'from-pink-500 to-pink-600', image: 'https://images.unsplash.com/photo-1526667485656-749c3118f5d0?w=400&h=300&fit=crop' },
  { name: 'Industrial Used PP Bags', slug: 'industrial-used-pp-bags', icon: FiRefreshCw, desc: 'Bulk used PP bags', gradient: 'from-cyan-500 to-cyan-600', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop' },
  { name: 'Patta Fabric', slug: 'patta-fabric', icon: FiFabric, desc: 'PP woven fabric / chalakha', gradient: 'from-violet-500 to-violet-600', image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=300&fit=crop' },
  { name: 'Used Worn Sarees', slug: 'used-worn-sarees', icon: FiUser, desc: 'Sarees for veg packing', gradient: 'from-rose-500 to-rose-600', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=300&fit=crop' },
];

export default function CategoryGrid() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">What We Deal In</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2">Product Categories</h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">Explore our wide range of industrial packaging products and trading materials</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group p-6 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl transition-all hover:shadow-md"
            >
              <span className="text-4xl block mb-3"><cat.icon /></span>
              <h3 className="font-semibold text-slate-800 group-hover:text-amber-700 transition-colors">{cat.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{cat.desc}</p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white font-semibold rounded-lg transition-all text-sm"
          >
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  );
}
