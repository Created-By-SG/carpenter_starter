'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { site } from '@/data/site';
import { services } from '@/data/services';

export default function Nav() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const leaveTimer = useRef(null);
  const initials = site.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const serviceList = Object.values(services);

  const handleMouseEnter = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setServicesOpen(true);
  };
  const handleMouseLeave = () => {
    leaveTimer.current = setTimeout(() => setServicesOpen(false), 200);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container">
          <div className="top-bar-inner">
            <div className="top-bar-social">
              {site.social?.instagram && (
                <a href={site.social.instagram} aria-label="Instagram">
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
                </a>
              )}
              {site.social?.facebook && (
                <a href={site.social.facebook} aria-label="Facebook">
                  <svg fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              )}
            </div>
            <div className="top-bar-tagline">{site.tagline}</div>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="nav-outer">
        <div className="nav-inner container">
          <Link href="/" className="logo">
            <div className="logo-icon">{initials}</div>
            <span>{site.name}</span>
          </Link>

          <nav className="nav-links">
            <Link href="/">Home</Link>
            <div
              className="nav-dropdown"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className="nav-dropdown-trigger"
                aria-haspopup="true"
                aria-expanded={servicesOpen}
                onClick={() => setServicesOpen(v => !v)}
              >
                Services
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 4.5l3 3 3-3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div
                className={`nav-dropdown-menu ${servicesOpen ? 'is-open' : ''}`}
                role="menu"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {serviceList.map(s => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}/`}
                    role="menuitem"
                    onClick={() => setServicesOpen(false)}
                  >
                    {s.title}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/#about">About</Link>
            <Link href="/contact/">Contact</Link>
          </nav>

          <div className="nav-actions">
            <button className="nav-btn nav-btn-text" onClick={() => document.dispatchEvent(new CustomEvent('openContact', { bubbles: true, cancelable: true }))}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Text
            </button>
            <a href={`tel:${site.phone}`} className="nav-btn nav-btn-call">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Call
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
