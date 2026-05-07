'use client';

import { useState, useEffect } from 'react';
import { site } from '@/data/site';

export default function ContactModal() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const handler = () => setOpen(true);
    document.addEventListener('openContact', handler);
    return () => document.removeEventListener('openContact', handler);
  }, []);
  if (!open) return null;
  return (
    <div className="modal-overlay active" onClick={() => setOpen(false)}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Quick Message</h3>
          <button className="modal-close" onClick={() => setOpen(false)}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <form onSubmit={e => { e.preventDefault(); alert('Thanks! We will be in touch shortly.'); setOpen(false); }}>
          <div className="form-group"><label>Name</label><input type="text" placeholder="Your name" required /></div>
          <div className="form-group"><label>Number</label><input type="tel" placeholder="0400 000 000" required /></div>
          <div className="form-group"><label>Email</label><input type="email" placeholder="you@email.com" /></div>
          <div className="form-group"><label>Message</label><textarea placeholder="How can we help?"></textarea></div>
          <div className="form-row">
            <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>Close</button>
            <button type="submit" className="btn btn-primary">Send</button>
          </div>
        </form>
      </div>
    </div>
  );
}
