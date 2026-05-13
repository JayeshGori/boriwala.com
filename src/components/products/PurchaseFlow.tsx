'use client';

import { FiSearch, FiUserCheck, FiPhoneCall, FiPackage, FiCheckCircle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { WHATSAPP_NUMBER, PHONE_NUMBER, PHONE_DISPLAY } from '@/lib/contact';
import { getWhatsAppLink } from '@/lib/utils';

interface Props {
  productName?: string;
}

const steps = [
  {
    icon: FiSearch,
    title: 'Browse & Select',
    description: 'Explore our catalogue and shortlist products that match your requirement.',
  },
  {
    icon: FiUserCheck,
    title: 'Register / Login',
    description: 'Create a free B2B account to unlock wholesale pricing and order history.',
  },
  {
    icon: FiPhoneCall,
    title: 'Contact Our Team',
    description: 'Reach us on WhatsApp or call directly to discuss your enquiry.',
  },
  {
    icon: FiPackage,
    title: 'Discuss Order Details',
    description: 'We finalise quantity, customisation, transport, payment terms & timeline together.',
  },
  {
    icon: FiCheckCircle,
    title: 'Dispatch & Delivery',
    description: 'Confirmed orders are dispatched promptly with transparent tracking.',
  },
];

export default function PurchaseFlow({ productName }: Props) {
  const waMsg = productName
    ? `Hi Boriwala team,\n\nI'm interested in *${productName}*. Please share pricing, MOQ and dispatch details.\n\nThank you.`
    : `Hi Boriwala team, I'm interested in placing a bulk enquiry. Please assist.`;

  return (
    <section className="mt-12 sm:mt-16">
      <div className="bg-gradient-to-br from-slate-50 via-white to-amber-50/40 border border-slate-200 rounded-2xl p-5 sm:p-8 lg:p-10">
        <div className="text-center mb-8 sm:mb-10">
          <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-[11px] font-bold uppercase tracking-widest rounded-full mb-3">
            How It Works
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Simple B2B Enquiry &amp; Order Process</h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl mx-auto">
            Boriwala operates on a transparent <strong>enquiry-first model</strong> — every order is personally handled
            with discussion on quantity, customisation, transport and pricing.
          </p>
        </div>

        {/* Timeline — desktop horizontal, mobile vertical */}
        <div className="relative">
          {/* Desktop horizontal connector line */}
          <div className="hidden lg:block absolute top-7 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 lg:gap-3 relative">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="relative flex lg:flex-col items-start lg:items-center gap-4 lg:gap-3">
                  {/* Vertical connector line for mobile */}
                  {idx < steps.length - 1 && (
                    <div className="lg:hidden absolute left-7 top-14 w-0.5 h-[calc(100%+1.25rem)] bg-amber-200" aria-hidden />
                  )}

                  {/* Icon circle */}
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-full bg-white border-2 border-amber-400 shadow-md flex items-center justify-center text-amber-600">
                      <Icon size={22} />
                    </div>
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow">
                      {idx + 1}
                    </span>
                  </div>

                  <div className="lg:text-center lg:px-1 flex-1">
                    <h4 className="font-semibold text-slate-900 text-sm sm:text-base leading-tight">{step.title}</h4>
                    <p className="text-xs sm:text-[13px] text-slate-600 mt-1 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA buttons */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={getWhatsAppLink(WHATSAPP_NUMBER, waMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors text-sm sm:text-base shadow-md shadow-green-900/10"
          >
            <FaWhatsapp size={20} /> Enquire on WhatsApp
          </a>
          <a
            href={`tel:${PHONE_NUMBER}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors text-sm sm:text-base"
          >
            <FiPhoneCall size={18} /> Call {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </section>
  );
}
