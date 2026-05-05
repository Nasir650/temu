'use client';

import Link from 'next/link';
import { useState } from 'react';

const navLinks = [
  { label: 'Shop', href: '/products' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'FAQ', href: '/faq' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-forest-900">
      <nav className="flex justify-between items-center px-6 lg:px-10 h-16 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(l => (
              <Link key={l.label} href={l.href} className="text-[13px] font-medium text-cream-200 hover:text-white transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>
        <Link href="/" className="font-script text-3xl italic text-white tracking-wide">Spy Web Cams</Link>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center bg-forest-800/60 rounded-full px-4 py-2 border border-forest-700/50">
            <span className="material-symbols-outlined text-cream-300 text-[18px]">search</span>
            <form action="/products" method="GET"><input name="search" className="bg-transparent border-none text-sm text-white placeholder:text-cream-400 ml-2 w-44 outline-none" placeholder="Search deals..." /></form>
          </div>
          <Link href="/products" className="text-cream-200 hover:text-white"><span className="material-symbols-outlined text-[22px]">shopping_bag</span></Link>
          <button
            className="md:hidden text-cream-200 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">{isOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}
        style={{ background: 'rgba(26, 60, 42, 0.98)' }}
      >
        <div className="px-6 py-4 space-y-1">
          {navLinks.map(l => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setIsOpen(false)}
              className="block py-3 px-4 text-cream-200 hover:text-white hover:bg-forest-800/50 rounded-xl text-sm font-medium transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-3 mt-3 border-t border-forest-700/50">
            <form action="/products" method="GET" className="flex items-center bg-forest-800/60 rounded-xl px-4 py-2.5 border border-forest-700/50">
              <span className="material-symbols-outlined text-cream-300 text-[18px]">search</span>
              <input name="search" className="bg-transparent border-none text-sm text-white placeholder:text-cream-400 ml-2 flex-1 outline-none" placeholder="Search deals..." />
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
