import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';

export default function CTASection() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-r from-amber-500 to-amber-600">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Place an Order?</h2>
        <p className="text-amber-100 text-lg mb-8 max-w-2xl mx-auto">
          Get in touch with us for the best prices on bulk orders. We provide customized packaging solutions for your business.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-amber-600 hover:bg-slate-100 font-semibold rounded-xl transition-colors"
          >
            Send Enquiry
          </Link>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"
          >
            <FaWhatsapp size={20} />
            WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  );
}
