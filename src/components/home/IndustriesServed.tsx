const industries = [
  { name: 'Agriculture', icon: '🌾' },
  { name: 'Construction', icon: '🏗️' },
  { name: 'Food & Grain', icon: '🍚' },
  { name: 'Chemicals', icon: '🧪' },
  { name: 'Fertilizers', icon: '🌱' },
  { name: 'Cement', icon: '🧱' },
  { name: 'Textiles', icon: '🧵' },
  { name: 'Logistics', icon: '🚛' },
  { name: 'Manufacturing', icon: '⚙️' },
  { name: 'Retail', icon: '🏪' },
];

export default function IndustriesServed() {
  return (
    <section className="py-16 md:py-20 bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Our Reach</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">Industries We Serve</h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto">Providing packaging solutions across diverse industries</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {industries.map((ind) => (
            <div
              key={ind.name}
              className="flex items-center gap-2 px-5 py-3 bg-slate-700/50 hover:bg-amber-500/20 border border-slate-600 hover:border-amber-500/50 rounded-full transition-all"
            >
              <span className="text-xl">{ind.icon}</span>
              <span className="text-sm font-medium">{ind.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
