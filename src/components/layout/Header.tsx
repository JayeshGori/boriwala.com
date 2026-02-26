'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FiMenu, FiX, FiPhone, FiMail, FiUser, FiLogIn, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useBuyerAuth } from '@/context/BuyerAuthContext';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/categories', label: 'Categories' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { buyer, loading, isApproved, logout } = useBuyerAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top bar */}
      <div className="bg-slate-800 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="tel:+919999999999" className="flex items-center gap-1 hover:text-amber-400 transition-colors">
              <FiPhone size={13} />
              <span className="hidden sm:inline">+91 99999 99999</span>
            </a>
            <a href="mailto:info@boriwala.com" className="flex items-center gap-1 hover:text-amber-400 transition-colors">
              <FiMail size={13} />
              <span className="hidden sm:inline">info@boriwala.com</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-green-400 transition-colors"
            >
              <FaWhatsapp size={14} />
              <span className="hidden sm:inline">WhatsApp Us</span>
            </a>
            {!loading && !buyer && (
              <div className="hidden sm:flex items-center gap-2 ml-2 border-l border-slate-600 pl-4">
                <Link href="/login" className="hover:text-amber-400 transition-colors text-xs">Login</Link>
                <span className="text-slate-500">|</span>
                <Link href="/signup" className="hover:text-amber-400 transition-colors text-xs">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              B
            </div>
            <div>
              <span className="text-xl font-bold text-slate-800 tracking-tight">Boriwala</span>
              <span className="hidden sm:block text-[10px] text-slate-500 -mt-1 tracking-wider uppercase">Trading Co.</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
              >
                {link.label}
              </Link>
            ))}

            {!loading && buyer ? (
              <div className="relative ml-2" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                >
                  <div className="w-7 h-7 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-xs font-bold">
                    {buyer.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{buyer.name.split(' ')[0]}</span>
                  <FiChevronDown size={14} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-medium text-slate-800 truncate">{buyer.name}</p>
                      <p className="text-xs text-slate-500 truncate">{buyer.email}</p>
                      {isApproved ? (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full">Approved</span>
                      ) : (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">Pending Approval</span>
                      )}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <FiLogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : !loading ? (
              <Link
                href="/login"
                className="ml-2 flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
              >
                <FiLogIn size={15} /> Login
              </Link>
            ) : null}

            <Link
              href="/sell-to-us"
              className="ml-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Sell to Us
            </Link>
            <Link
              href="/contact"
              className="ml-1 px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Get Quote
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-800"
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile nav */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-slate-100">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
              >
                {link.label}
              </Link>
            ))}

            {!loading && buyer ? (
              <div className="mx-4 mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-sm font-bold">
                    {buyer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{buyer.name}</p>
                    <p className="text-xs text-slate-500">{isApproved ? 'Approved' : 'Pending Approval'}</p>
                  </div>
                </div>
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="w-full text-center px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : !loading ? (
              <div className="flex gap-2 mx-4 mt-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <FiUser size={14} /> Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            ) : null}

            <Link
              href="/sell-to-us"
              onClick={() => setIsOpen(false)}
              className="block mx-4 mt-2 px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg text-center transition-colors"
            >
              Sell to Us
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="block mx-4 mt-2 px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg text-center transition-colors"
            >
              Get Quote
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
