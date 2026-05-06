'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

export default function Testimonials({ testimonials }) {
  const scrollRef = useRef(null);
  const trackRef = useRef(null);
  const [dots, setDots] = useState([]);
  const [activeDot, setActiveDot] = useState(0);

  const getCardWidth = useCallback(() => {
    const card = trackRef.current?.querySelector('.testimonial-card');
    return card ? card.offsetWidth + 20 : 340;
  }, []);

  const getMaxScroll = useCallback(() => {
    if (!trackRef.current || !scrollRef.current) return 0;
    return trackRef.current.scrollWidth - scrollRef.current.clientWidth;
  }, []);

  const updateDots = useCallback(() => {
    const step = getCardWidth();
    const max = getMaxScroll();
    if (!step || max <= 0) return;
    const page = Math.round(scrollRef.current.scrollLeft / step);
    const maxPage = Math.round(max / step);
    const num = maxPage + 1;
    if (dots.length !== num) {
      setDots(Array.from({ length: num }, (_, i) => i));
    }
    setActiveDot(Math.max(0, Math.min(page, maxPage)));
  }, [getCardWidth, getMaxScroll, dots.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateDots, { passive: true });
    window.addEventListener('resize', updateDots);
    updateDots();
    return () => {
      el.removeEventListener('scroll', updateDots);
      window.removeEventListener('resize', updateDots);
    };
  }, [updateDots]);

  const scrollDir = (dir) => {
    const step = getCardWidth();
    const max = getMaxScroll();
    if (!step) return;
    let target = scrollRef.current.scrollLeft + (dir * step);
    target = Math.max(0, Math.min(target, max));
    scrollRef.current.scrollTo({ left: target, behavior: 'smooth' });
  };

  return (
    <div className="testimonials-wrap">
      <button className="testimonial-nav prev" onClick={() => scrollDir(-1)} aria-label="Previous">
        <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <div className="testimonials-scroll reveal-up" ref={scrollRef}>
        <div className="testimonials-track" ref={trackRef}>
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <p className="testimonial-text">{t.text}</p>
              <div className="testimonial-author">{t.author}</div>
              <div className="testimonial-location">{t.location}</div>
            </div>
          ))}
        </div>
      </div>
      <button className="testimonial-nav next" onClick={() => scrollDir(1)} aria-label="Next">
        <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
      </button>
      <div className="testimonials-dots">
        {dots.map(i => (
          <span key={i} className={`dot ${i === activeDot ? 'active' : ''}`} />
        ))}
      </div>
    </div>
  );
}
