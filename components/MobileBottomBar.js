'use client';

import { useState, useEffect } from 'react';
import { site } from '@/data/site';
import Link from 'next/link';

export default function MobileBottomBar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest('.mobile-bottom-bar')) setDropdownOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  return (
    <div className="mobile-bottom-bar">
      <div className={`mobile-dropdown-wrapper ${dropdownOpen ? 'active' : ''}`}>
        <div className="mobile-dropdown">
          <Link href="/#services" onClick={() => setDropdownOpen(false)}>
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
            Services
          </Link>
          <Link href="/#areas" onClick={() => setDropdownOpen(false)}>
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Areas Covered
          </Link>
          <a href="#" onClick={(e) => { e.preventDefault(); document.dispatchEvent(new Event('openContact')); setDropdownOpen(false); }}>
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Contact Us
          </a>
          <a href={`tel:${site.phone}`}>
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            Call Now
          </a>
        </div>
      </div>
      <button className="mobile-menu-toggle" onClick={() => setDropdownOpen(!dropdownOpen)} aria-label="Menu">
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
      </button>
    </div>
  );
}
