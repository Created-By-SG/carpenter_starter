'use client';

import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.body.scrollHeight - window.innerHeight;
      if (h > 0) setWidth((window.scrollY / h) * 100);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <div className="scroll-bar" style={{ transform: `scaleX(${width / 100})` }} />;
}
