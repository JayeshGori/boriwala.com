import Link from 'next/link';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { FaWhatsapp, FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';

const productLinks = [
  { href: '/products?category=pp-bags', label: 'PP Bags' },
  { href: '/products?category=jute-bags', label: 'Jute Bags' },
  { href: '/products?category=plastic-products', label: 'Plastic Products' },
  { href: '/products?category=packaging-materials', label: 'Packaging Materials' },
  { href: '/products?category=scrap-materials', label: 'Scrap Materials' },
];

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'All Products' },
  { href: '/categories', label: 'Categories' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact Us' },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                B
              </div>
              <div>
                <span className="text-lg font-bold text-white">Boriwala</span>
                <span className="block text-[10px] text-slate-400 -mt-1 tracking-wider uppercase">Trading Co.</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Leading B2B trading company dealing in PP Bags, Jute Bags, Plastic Products &amp; Industrial Packaging Materials since 2009.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 bg-slate-800 hover:bg-amber-500 rounded-full flex items-center justify-center transition-colors">
                <FaFacebookF size={14} />
              </a>
              <a href="#" className="w-8 h-8 bg-slate-800 hover:bg-amber-500 rounded-full flex items-center justify-center transition-colors">
                <FaInstagram size={14} />
              </a>
              <a href="#" className="w-8 h-8 bg-slate-800 hover:bg-amber-500 rounded-full flex items-center justify-center transition-colors">
                <FaLinkedinIn size={14} />
              </a>
              <a href="#" className="w-8 h-8 bg-slate-800 hover:bg-amber-500 rounded-full flex items-center justify-center transition-colors">
                <FaYoutube size={14} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-amber-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold mb-4">Our Products</h3>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-amber-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <a href="tel:+919999999999" className="flex items-start gap-2 text-sm text-slate-400 hover:text-amber-400 transition-colors">
                <FiPhone size={16} className="mt-0.5 shrink-0" />
                +91 99999 99999
              </a>
              <a href="mailto:info@boriwala.com" className="flex items-start gap-2 text-sm text-slate-400 hover:text-amber-400 transition-colors">
                <FiMail size={16} className="mt-0.5 shrink-0" />
                info@boriwala.com
              </a>
              <div className="flex items-start gap-2 text-sm text-slate-400">
                <FiMapPin size={16} className="mt-0.5 shrink-0" />
                Mumbai, Maharashtra, India
              </div>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
              >
                <FaWhatsapp size={16} />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Boriwala Trading Co. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">
            B2B Trading &amp; Industrial Packaging Solutions
          </p>
        </div>
      </div>
    </footer>
  );
}
