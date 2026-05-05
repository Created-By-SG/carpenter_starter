'use client';

import { useState } from 'react';

export default function Faq({ items }) {
  const [active, setActive] = useState(null);
  const toggle = (i) => setActive(active === i ? null : i);

  return (
    <div className="faq-list reveal-up">
      {items.map((item, i) => (
        <div key={i} className={`faq-item ${active === i ? 'active' : ''}`}>
          <button className="faq-question" onClick={() => toggle(i)}>
            {item.question}
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div className="faq-answer">
            <div className="faq-answer-inner">{item.answer}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
