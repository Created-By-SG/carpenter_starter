'use client';

import { useEffect } from 'react';
import { site } from '@/data/site';

export default function PageHero({ title, subtitle, image, ctaText = 'Get a Quote', ctaHref }) {
  useEffect(() => {
    // IntersectionObserver for reveal animations
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="hero">
      <div className="hero-bg">
        <img src={image} alt={title} />
      </div>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        <div className="hero-btns">
          <button className="btn btn-primary btn-lg" onClick={() => document.dispatchEvent(new Event('openContact'))}>{ctaText}</button>
          <a href={`tel:${site.phone}`} className="btn btn-accent btn-lg">Call Now</a>
        </div>
      </div>
    </section>
  );
}
