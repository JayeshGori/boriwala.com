import Link from 'next/link';
import { FiShield, FiTruck, FiDollarSign, FiUsers, FiPackage, FiClock } from 'react-icons/fi';

const features = [
  {
    icon: FiShield,
    title: 'Quality Assured',
    desc: 'Every product passes rigorous quality checks before dispatch',
    color: '#1a73e8',
  },
  {
    icon: FiDollarSign,
    title: 'Best Market Rates',
    desc: 'Transparent, competitive pricing with no hidden costs',
    color: '#f46f25',
  },
  {
    icon: FiTruck,
    title: 'Pan India Logistics',
    desc: 'Reliable delivery network covering all major industrial hubs',
    color: '#1a73e8',
  },
  {
    icon: FiUsers,
    title: 'Bulk Order Specialists',
    desc: 'Purpose-built for high-volume B2B procurement',
    color: '#f46f25',
  },
  {
    icon: FiPackage,
    title: '100+ Product Range',
    desc: 'Complete packaging solutions across 15+ categories',
    color: '#1a73e8',
  },
  {
    icon: FiClock,
    title: '15+ Years Track Record',
    desc: 'Proven reliability with 500+ satisfied business clients',
    color: '#f46f25',
  },
];

export default function WhyChooseUs() {
  return (
    <section
      className="relative py-16 md:py-24 bg-white overflow-hidden"
      style={{
        backgroundImage:
          'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          {/* Left Column */}
          <div className="w-full lg:w-[40%] lg:sticky lg:top-28">
            <span className="inline-block text-sm font-semibold uppercase tracking-wider text-[#1a73e8] mb-3">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-slate-900 leading-tight">
              Why Leading Businesses Choose{' '}
              <span className="text-[#f46f25]">Boriwala</span>
            </h2>
            <p className="mt-5 text-lg text-slate-600 leading-relaxed max-w-md">
              With over 15 years of experience in industrial packaging, we
              deliver quality, reliability, and value that businesses across
              India trust every day.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center mt-8 px-8 py-3.5 bg-[#1a73e8] hover:bg-[#1558b0] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              Get Started
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="w-full lg:w-[60%] grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((item) => (
              <div
                key={item.title}
                className="group bg-white rounded-xl p-6 shadow-sm border border-slate-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                style={{
                  borderLeftWidth: '4px',
                  borderLeftColor: item.color,
                }}
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-110"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <item.icon size={20} style={{ color: item.color }} />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
