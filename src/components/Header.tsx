"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

const Header = () => {
  const [open, setOpen] = useState(false);

  // Close the mobile menu when viewport becomes md and above (resize handling)
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 768 && open) setOpen(false);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [open]);

  const commonLinkClasses =
    'text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors';
  const mobileLinkClasses =
    'block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors';

  const closeOnNavigate = () => setOpen(false);

  return (
    <header className="bg-white shadow-sm border-b relative z-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700" onClick={closeOnNavigate}>
              Rongjie Xu (Max)
            </Link>
          </div>
          {/* Desktop nav */}
          <nav className="hidden md:flex space-x-8" aria-label="Main navigation">
            <Link href="/" className={commonLinkClasses}>
              Home
            </Link>
            <Link href="/blog" className={commonLinkClasses}>
              Blog
            </Link>
            <Link href="/about" className={commonLinkClasses}>
              About
            </Link>
            <Link href="/contact" className={commonLinkClasses}>
              Contact
            </Link>
          </nav>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              aria-controls="mobile-menu"
              aria-expanded={open}
              onClick={() => setOpen(o => !o)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <span className="sr-only">Toggle navigation menu</span>
              {open ? (
                // Close (X) icon
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger icon
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile dropdown panel */}
      <div
        id="mobile-menu"
        className={`${open ? 'opacity-100 scale-100' : 'pointer-events-none opacity-0 scale-95'} md:hidden origin-top transition-all duration-150 ease-out`}
      >
        <nav aria-label="Mobile navigation" className="border-t border-gray-200 bg-white shadow-sm">
          <div className="px-2 py-3 space-y-1">
            <Link href="/" onClick={closeOnNavigate} className={mobileLinkClasses}>
              Home
            </Link>
            <Link href="/blog" onClick={closeOnNavigate} className={mobileLinkClasses}>
              Blog
            </Link>
            <Link href="/about" onClick={closeOnNavigate} className={mobileLinkClasses}>
              About
            </Link>
            <Link href="/contact" onClick={closeOnNavigate} className={mobileLinkClasses}>
              Contact
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;