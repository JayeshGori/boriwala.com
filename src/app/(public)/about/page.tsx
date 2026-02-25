import { Metadata } from 'next';
import { FiShield, FiTruck, FiDollarSign, FiUsers, FiPackage, FiClock, FiAward, FiGlobe } from 'react-icons/fi';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Boriwala Trading Co. - 15+ years of experience in B2B trading of PP Bags, Jute Bags, Plastic Products & Industrial Packaging Materials.',
};

const strengths = [
  { icon: FiAward, title: 'Quality Assured', desc: 'Strict quality checks on every product before delivery' },
  { icon: FiDollarSign, title: 'Best Prices', desc: 'Competitive market pricing for all products' },
  { icon: FiTruck, title: 'Pan India Delivery', desc: 'Logistics network covering all major cities' },
  { icon: FiUsers, title: 'Bulk Specialists', desc: 'Expertise in handling large-volume orders' },
  { icon: FiPackage, title: '100+ Products', desc: 'Wide range across 15+ categories' },
  { icon: FiClock, title: 'Timely Delivery', desc: 'On-time delivery track record' },
  { icon: FiShield, title: 'Trusted Partner', desc: '500+ satisfied business clients' },
  { icon: FiGlobe, title: '15+ Years', desc: 'Industry experience and expertise' },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <div className="bg-slate-800 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white">About Us</h1>
          <p className="text-slate-300 mt-2 max-w-2xl">Discover our story, values, and commitment to quality B2B trading</p>
        </div>
      </div>

      {/* Company profile */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">Who We Are</span>
              <h2 className="text-3xl font-bold text-slate-800 mt-2 mb-6">Boriwala Trading Co.</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  Boriwala Trading Co. is a leading B2B trading company with over <strong>15 years of experience</strong> in the packaging industry. We specialize in PP Bags, Jute Bags, Plastic Products, Industrial Packaging Materials, and Scrap Materials.
                </p>
                <p>
                  Our commitment to quality, competitive pricing, and reliable service has made us a trusted partner for businesses across India. We deal in both new and used products, providing cost-effective solutions for every business need.
                </p>
                <p>
                  With a diverse product range spanning <strong>100+ products across 15+ categories</strong>, we cater to industries including agriculture, construction, food processing, chemicals, and manufacturing.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">At a Glance</h3>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: '15+', label: 'Years Experience' },
                  { value: '100+', label: 'Products' },
                  { value: '500+', label: 'Happy Clients' },
                  { value: '15+', label: 'Categories' },
                  { value: 'Pan India', label: 'Delivery Network' },
                  { value: '50,000+', label: 'Sq. Ft. Warehouse' },
                ].map((stat) => (
                  <div key={stat.label} className="border-l-2 border-amber-500 pl-4">
                    <div className="text-2xl font-bold text-amber-400">{stat.value}</div>
                    <div className="text-sm text-slate-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strengths */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">What Sets Us Apart</span>
            <h2 className="text-3xl font-bold text-slate-800 mt-2">Our Business Strengths</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {strengths.map((item) => (
              <div key={item.title} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-amber-200 hover:shadow-md transition-all text-center">
                <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon size={28} />
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">Our Facilities</span>
            <h2 className="text-3xl font-bold text-slate-800 mt-2 mb-6">Infrastructure</h2>
            <p className="text-slate-600 leading-relaxed">
              Our state-of-the-art warehouse and distribution center spans over <strong>50,000 sq. ft.</strong>, equipped with modern storage facilities and efficient logistics systems. This enables us to handle large-volume orders with ease and ensure timely delivery across India.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {[
              { title: 'Warehouse', desc: '50,000+ sq. ft. of organized storage space with proper inventory management' },
              { title: 'Quality Lab', desc: 'In-house quality testing to ensure all products meet industry standards' },
              { title: 'Logistics Hub', desc: 'Efficient dispatch center with tie-ups with major logistics partners' },
            ].map((item) => (
              <div key={item.title} className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="font-semibold text-slate-800 text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-amber-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Want to Partner With Us?</h2>
          <p className="text-amber-100 text-lg mb-8">
            We are always looking for new business partnerships. Contact us to discuss your requirements.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-amber-600 hover:bg-slate-100 font-semibold rounded-xl transition-colors"
          >
            Get In Touch
          </a>
        </div>
      </section>
    </>
  );
}
