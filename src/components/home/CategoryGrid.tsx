import Link from 'next/link';

const categories = [
  { name: 'PP Bags', slug: 'pp-bags', icon: '📦', desc: 'New & used polypropylene bags' },
  { name: 'Jute Bags', slug: 'jute-bags', icon: '🌿', desc: 'Eco-friendly jute packaging' },
  { name: 'Plastic Products', slug: 'plastic-products', icon: '🏭', desc: 'Industrial plastic products' },
  { name: 'Packaging Materials', slug: 'packaging-materials', icon: '📋', desc: 'Complete packaging solutions' },
  { name: 'Scrap Materials', slug: 'scrap-materials', icon: '♻️', desc: 'Recyclable scrap materials' },
  { name: 'HDPE Bags', slug: 'hdpe-bags', icon: '🛍️', desc: 'High-density PE bags' },
  { name: 'Cement Bags', slug: 'cement-bags', icon: '🏗️', desc: 'Heavy-duty cement bags' },
  { name: 'Food Grain Bags', slug: 'food-grain-bags', icon: '🌾', desc: 'Food-grade storage bags' },
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
              <span className="text-4xl block mb-3">{cat.icon}</span>
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
