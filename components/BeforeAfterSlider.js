'use client';

import { useRef, useCallback } from 'react';

export default function BeforeAfterSlider({ title, before, after }) {
  const sliderRef = useRef(null);
  const afterRef = useRef(null);
  const handleRef = useRef(null);

  const update = useCallback((clientX) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    let x = clientX - rect.left;
    let pct = (x / rect.width) * 100;
    pct = Math.max(2, Math.min(98, pct));
    afterRef.current.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    handleRef.current.style.left = pct + '%';
  }, []);

  const startDrag = useCallback((e) => {
    e.preventDefault();
    const move = (ev) => {
      const clientX = ev.touches ? ev.touches[0].clientX : ev.clientX;
      update(clientX);
    };
    const end = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', end);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', end);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', end);
  }, [update]);

  const clickJump = useCallback((e) => {
    if (e.target.closest('.ba-handle')) return;
    update(e.clientX);
  }, [update]);

  return (
    <div className="ba-slider-wrap" ref={sliderRef} onClick={clickJump}>
      <div className="ba-before">
        <img src={before} alt={`${title} before`} className="ba-img-fill" />
      </div>
      <div className="ba-after" ref={afterRef} style={{ clipPath: 'inset(0 50% 0 0)' }}>
        <img src={after} alt={`${title} after`} className="ba-img-fill" />
      </div>
      <div className="ba-handle" ref={handleRef} style={{ left: '50%' }} onMouseDown={startDrag} onTouchStart={startDrag}>
        <div className="ba-handle-line"></div>
        <div className="ba-handle-knob">
          <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
        </div>
      </div>
      <span className="ba-label ba-label-before">Before</span>
      <span className="ba-label ba-label-after">After</span>
    </div>
  );
}
