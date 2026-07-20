const testimonials = [
  {
    name: 'Rajesh Kumar',
    company: 'Kumar Agro Industries',
    text: 'Excellent quality PP bags at very competitive prices. Boriwala has been our trusted supplier for over 5 years. Highly recommended for bulk packaging needs.',
    rating: 5,
    initials: 'RK',
    color: 'bg-[#1a73e8]',
  },
  {
    name: 'Priya Sharma',
    company: 'Sharma Exports Pvt. Ltd.',
    text: 'Their jute bags are top-notch and perfect for our export packaging. Timely delivery and great customer support. A reliable B2B partner.',
    rating: 5,
    initials: 'PS',
    color: 'bg-[#f46f25]',
  },
  {
    name: 'Amit Patel',
    company: 'Patel Construction Co.',
    text: 'We source all our cement bags and packaging materials from Boriwala. Consistent quality and they handle bulk orders with ease.',
    rating: 5,
    initials: 'AP',
    color: 'bg-amber-500',
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-[#1a73e8] font-semibold text-sm uppercase tracking-wider">
            Client Reviews
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2">
            What Our Clients Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white p-8 rounded-2xl border border-slate-100
                shadow-sm hover:shadow-lg hover:-translate-y-1
                transition-all duration-300"
            >
              {/* Quote mark */}
              <span className="block text-5xl font-serif leading-none text-[#1a73e8]/20 select-none">
                &ldquo;
              </span>

              {/* Review text */}
              <p className="text-slate-600 text-sm leading-relaxed mt-2 mb-5">
                {t.text}
              </p>

              {/* Star rating */}
              <div className="flex gap-1 mb-5">
                {[...Array(t.rating)].map((_, i) => (
                  <span key={i} className="text-amber-400 text-lg">
                    &#9733;
                  </span>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100 pt-5">
                <div className="flex items-center gap-3">
                  {/* Avatar with initials */}
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full text-white text-sm font-bold ${t.color}`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.company}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
