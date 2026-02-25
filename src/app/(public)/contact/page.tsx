import { Metadata } from 'next';
import { FiPhone, FiMail, FiMapPin, FiClock } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import EnquiryForm from '@/components/forms/EnquiryForm';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Boriwala Trading Co. for bulk orders, product enquiries, and business partnerships. Call, email, or WhatsApp us.',
};

const contactInfo = [
  { icon: FiPhone, label: 'Phone', values: ['+91 99999 99999', '+91 88888 88888'], type: 'tel' },
  { icon: FiMail, label: 'Email', values: ['info@boriwala.com', 'sales@boriwala.com'], type: 'email' },
  { icon: FiMapPin, label: 'Address', values: ['123, Industrial Area, Dharavi', 'Mumbai - 400017, Maharashtra, India'], type: 'text' },
  { icon: FiClock, label: 'Business Hours', values: ['Mon - Sat: 9:00 AM - 7:00 PM', 'Sunday: Closed'], type: 'text' },
];

export default function ContactPage() {
  return (
    <>
      <div className="bg-slate-800 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Contact Us</h1>
          <p className="text-slate-300 mt-2">Get in touch for enquiries, bulk orders, or business partnerships</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact info */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-2xl p-6 text-white mb-6">
              <h2 className="text-xl font-bold mb-6">Get In Touch</h2>
              <div className="space-y-5">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center shrink-0">
                      <item.icon size={18} className="text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-300">{item.label}</p>
                      {item.values.map((val, idx) => (
                        <p key={idx} className="text-sm text-white">
                          {item.type === 'tel' ? (
                            <a href={`tel:${val.replace(/\s/g, '')}`} className="hover:text-amber-400 transition-colors">{val}</a>
                          ) : item.type === 'email' ? (
                            <a href={`mailto:${val}`} className="hover:text-amber-400 transition-colors">{val}</a>
                          ) : (
                            val
                          )}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 mt-6 w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"
              >
                <FaWhatsapp size={20} />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Enquiry form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-800 mb-2">Send Us an Enquiry</h2>
              <p className="text-sm text-slate-500 mb-6">Fill out the form below and we will get back to you within 24 hours.</p>
              <EnquiryForm />
            </div>
          </div>
        </div>

        {/* Google Map */}
        <div className="mt-12 rounded-2xl overflow-hidden border border-slate-200">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.5!2d72.85!3d19.04!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDAyJzI0LjAiTiA3MsKwNTEnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Boriwala Trading Co. Location"
          />
        </div>
      </div>
    </>
  );
}
