import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';
import { FiMessageSquare, FiArrowRight } from 'react-icons/fi';
import { whatsappLink } from '@/lib/contact';

export default function CTASection() {
  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-br from-[#1a73e8] to-[#0d47a1] overflow-hidden">
      {/* Floating geometric shapes */}
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full border border-white/10" />
      <div className="absolute bottom-16 left-1/4 w-20 h-20 rounded-lg bg-white/5 rotate-12" />
      <div className="absolute top-1/3 right-10 w-24 h-24 rounded-full bg-white/5" />
      <div className="absolute bottom-8 right-1/3 w-16 h-16 rounded-lg border border-white/10 -rotate-6" />
      <div className="absolute top-6 left-1/2 w-10 h-10 rounded-full bg-white/5" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left side - Text */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Ready to Source Your Packaging?
            </h2>
            <p className="text-blue-100 text-lg mt-4 max-w-lg mx-auto lg:mx-0">
              Get competitive bulk pricing on high-quality PP woven bags, jute bags, and
              customized packaging solutions tailored to your business needs.
            </p>
          </div>

          {/* Right side - CTA cards */}
          <div className="flex flex-col gap-4 w-full sm:w-auto">
            <Link
              href="/contact"
              className="group flex items-center gap-4 px-8 py-5 bg-white rounded-2xl
                shadow-lg hover:shadow-xl transition-all duration-300
                hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#1a73e8]/10 text-[#1a73e8]">
                <FiMessageSquare className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="block font-bold text-slate-800 text-lg">Send Enquiry</span>
                <span className="block text-sm text-slate-500">Get a quote within 24 hours</span>
              </div>
              <FiArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#1a73e8] group-hover:translate-x-1 transition-all" />
            </Link>

            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 px-8 py-5 bg-green-500 hover:bg-green-600
                rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300
                hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 text-white">
                <FaWhatsapp className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="block font-bold text-white text-lg">WhatsApp Us</span>
                <span className="block text-sm text-green-100">Chat with us instantly</span>
              </div>
              <FiArrowRight className="w-5 h-5 text-green-200 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
