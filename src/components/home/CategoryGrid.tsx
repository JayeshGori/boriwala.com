import Link from 'next/link';
import { FiPackage, FiTag, FiWind, FiZap, FiBox, FiGrid, FiCpu, FiLayers, FiMaximize, FiShield, FiLink, FiActivity, FiRefreshCw, FiLayers as FiFabric, FiUser } from 'react-icons/fi';

const categories = [
  { name: 'PP Bags', slug: 'pp-bags', icon: FiPackage, desc: 'New & used polypropylene bags', gradient: 'from-blue-500 to-blue-600' },
  { name: 'BOPP Bags', slug: 'bopp-bags', icon: FiTag, desc: 'Premium BOPP laminated bags', gradient: 'from-purple-500 to-purple-600' },
  { name: 'Jute Bags', slug: 'jute-bags', icon: FiWind, desc: 'Eco-friendly jute packaging', gradient: 'from-green-500 to-green-600' },
  { name: 'Cement Bags', slug: 'cement-bags', icon: FiZap, desc: 'Heavy-duty cement bags', gradient: 'from-slate-500 to-slate-600' },
  { name: 'Food Grain Bags', slug: 'food-grain-bags', icon: FiBox, desc: 'Food-grade storage bags', gradient: 'from-amber-500 to-amber-600' },
  { name: 'Monofilament Bags', slug: 'monofilament-bags', icon: FiGrid, desc: 'Mesh bags for vegetables', gradient: 'from-emerald-500 to-emerald-600' },
  { name: 'PP Granules', slug: 'pp-granules', icon: FiCpu, desc: 'Reprocessed PP granules', gradient: 'from-indigo-500 to-indigo-600' },
  { name: 'Leno Bags', slug: 'leno-bags', icon: FiLayers, desc: 'Leno bags for produce packing', gradient: 'from-teal-500 to-teal-600' },
  { name: 'Jumbo Bags', slug: 'jumbo-bags', icon: FiMaximize, desc: 'FIBC jumbo bags for bulk', gradient: 'from-orange-500 to-orange-600' },
  { name: 'Anti Slip Bags', slug: 'anti-slip-bags', icon: FiShield, desc: 'HAL & FCI anti-slip bags', gradient: 'from-red-500 to-red-600' },
  { name: 'Lacha Sutli', slug: 'lacha-sutli', icon: FiLink, desc: 'Virgin & semi-virgin sutli', gradient: 'from-yellow-500 to-yellow-600' },
  { name: 'Belar Twine', slug: 'belar-twine', icon: FiActivity, desc: 'Industrial belar twine', gradient: 'from-pink-500 to-pink-600' },
  { name: 'Industrial Used PP Bags', slug: 'industrial-used-pp-bags', icon: FiRefreshCw, desc: 'Bulk used PP bags', gradient: 'from-cyan-500 to-cyan-600' },
  { name: 'Patta Fabric', slug: 'patta-fabric', icon: FiFabric, desc: 'PP woven fabric / chalakha', gradient: 'from-violet-500 to-violet-600' },
  { name: 'Used Worn Sarees', slug: 'used-worn-sarees', icon: FiUser, desc: 'Sarees for veg packing', gradient: 'from-rose-500 to-rose-600' },
];

export default function CategoryGrid() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-96 h-96 bg-amber-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold uppercase tracking-wider mb-4">
            <FiPackage size={14} /> What We Deal In
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-4">
            Product Categories
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Explore our wide range of industrial packaging products and trading materials
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {categories.map((cat, index) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-200/50"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              {/* Icon container */}
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${cat.gradient} opacity-10 rounded-bl-3xl group-hover:opacity-20 transition-opacity duration-300`} />
              
              <div className="relative p-6">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${cat.gradient} text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <cat.icon size={24} />
                </div>
                
                {/* Content */}
                <h3 className="font-bold text-lg text-slate-800 group-hover:text-slate-900 mb-2">
                  {cat.name}
                </h3>
                <p className="text-sm text-slate-500 group-hover:text-slate-600 leading-relaxed">
                  {cat.desc}
                </p>
                
                {/* Arrow indicator */}
                <div className={`mt-4 flex items-center gap-2 text-xs font-semibold bg-gradient-to-r ${cat.gradient} bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-all duration-300`}>
                  Explore
                  <FiPackage size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              
              {/* Bottom accent line */}
              <div className={`h-1 w-0 bg-gradient-to-r ${cat.gradient} group-hover:w-full transition-all duration-300`} />
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/categories"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            <FiPackage size={18} />
            View All Categories
            <FiPackage size={18} className="rotate-45" />
          </Link>
        </div>
      </div>
    </section>
  );
}
