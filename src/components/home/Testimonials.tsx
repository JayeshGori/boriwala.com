const testimonials = [
  {
    name: 'Rajesh Kumar',
    company: 'Kumar Agro Industries',
    text: 'Excellent quality PP bags at very competitive prices. Boriwala has been our trusted supplier for over 5 years. Highly recommended for bulk packaging needs.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    company: 'Sharma Exports Pvt. Ltd.',
    text: 'Their jute bags are top-notch and perfect for our export packaging. Timely delivery and great customer support. A reliable B2B partner.',
    rating: 5,
  },
  {
    name: 'Amit Patel',
    company: 'Patel Construction Co.',
    text: 'We source all our cement bags and packaging materials from Boriwala. Consistent quality and they handle bulk orders with ease.',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 md:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">Client Reviews</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2">What Our Clients Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex gap-1 mb-3">
                {[...Array(t.rating)].map((_, i) => (
                  <span key={i} className="text-amber-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
              <div className="border-t border-slate-100 pt-4">
                <p className="font-semibold text-slate-800 text-sm">{t.name}</p>
                <p className="text-xs text-slate-500">{t.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
