'use client';

export default function ContactButton({ label = 'Send a Message' }) {
  return (
    <button
      className="btn btn-primary btn-lg"
      onClick={() => document.dispatchEvent(new Event('openContact'))}
    >
      {label}
    </button>
  );
}
