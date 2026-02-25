import { FiShield, FiTruck, FiDollarSign, FiUsers, FiPackage, FiClock } from 'react-icons/fi';

const reasons = [
  { icon: FiShield, title: 'Quality Assured', desc: 'All products go through strict quality checks before delivery' },
  { icon: FiDollarSign, title: 'Competitive Pricing', desc: 'Best market rates with transparent pricing for all products' },
  { icon: FiTruck, title: 'Pan India Delivery', desc: 'Reliable logistics network covering all major cities' },
  { icon: FiUsers, title: 'Bulk Order Experts', desc: 'Specialized in handling large-volume B2B orders' },
  { icon: FiPackage, title: 'Wide Product Range', desc: '100+ products across 15+ categories available' },
  { icon: FiClock, title: 'Timely Service', desc: '15+ years of reliable and on-time delivery track record' },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">Our Strengths</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2">Why Choose Us</h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">What makes Boriwala Trading Co. the preferred choice for businesses</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((item) => (
            <div
              key={item.title}
              className="group p-6 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 rounded-xl transition-all"
            >
              <div className="w-12 h-12 bg-amber-100 group-hover:bg-amber-200 text-amber-600 rounded-xl flex items-center justify-center transition-colors mb-4">
                <item.icon size={24} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
