'use client';

export default function CtaBanner({ heading, text, ctaText }) {
  return (
    <section className="cta-section">
      <div className="container">
        <h2>{heading}</h2>
        <p>{text}</p>
        <button className="btn btn-accent btn-lg" onClick={() => document.dispatchEvent(new Event('openContact'))}>
          {ctaText}
        </button>
      </div>
    </section>
  );
}
