'use client';

import Link from 'next/link';

const categories = [
  { 
    name: 'PP Bags/Fabric', 
    slug: 'pp-bags-fabric', 
    icon: '📦', 
    desc: 'PP bags and woven fabric',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop',
    subcategories: [
      { name: 'Cement Bags', slug: 'cement-bags', icon: '🏗️' },
      { name: 'Food Grain Bags', slug: 'food-grain-bags', icon: '🌾' },
      { name: 'Industrial Used PP Bags', slug: 'industrial-used-pp-bags', icon: '♻️' },
      { name: 'Patta Fabric', slug: 'patta-fabric', icon: '🧶' },
    ]
  },
  { name: 'BOPP Bags', slug: 'bopp-bags', icon: '🏷️', desc: 'Premium BOPP laminated bags', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop' },
  { name: 'Jute Bags', slug: 'jute-bags', icon: '🌿', desc: 'Eco-friendly jute packaging', image: 'https://images.unsplash.com/photo-1615486342407-cf8fd79d8d59?w=400&h=300&fit=crop' },
  { name: 'Monofilament Bags', slug: 'monofilament-bags', icon: '🧅', desc: 'Mesh bags for vegetables', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=300&fit=crop' },
  { name: 'Leno Bags', slug: 'leno-bags', icon: '🥔', desc: 'Leno bags for produce packing', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop' },
  { name: 'PP Granules', slug: 'pp-granules', icon: '⚙️', desc: 'Reprocessed PP granules', image: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?w=400&h=300&fit=crop' },
  { name: 'Used Worn Sarees', slug: 'used-worn-sarees', icon: '👗', desc: 'Sarees for veg packing', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=300&fit=crop' },
  { name: 'FIBC Jumbo Bags', slug: 'jumbo-bags', icon: '📐', desc: 'FIBC jumbo bags for bulk', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop' },
];

export default function CategoryGrid() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold uppercase tracking-wider mb-4">
            📦 What We Deal In
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-4">Product Categories</h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">Explore our wide range of industrial packaging products and trading materials</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 h-64"
            >
              {/* Background image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent" />
              
              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-6">
                <div className="mb-2">
                  <span className="text-5xl block mb-2 drop-shadow-lg">{cat.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">{cat.name}</h3>
                <p className="text-sm text-slate-200 drop-shadow-sm">{cat.desc}</p>
                
                {cat.subcategories && (
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <div className="flex flex-wrap gap-1">
                      {cat.subcategories.map((sub) => (
                        <span key={sub.slug} className="text-xs text-white bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded">
                          {sub.icon} {sub.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/10 transition-colors duration-300" />
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            View All Categories →
          </Link>
        </div>
      </div>
    </section>
  );
}
