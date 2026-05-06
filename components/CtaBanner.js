'use client';

export default function CtaBanner({ heading, text, ctaText }) {
  return (
    <section className="cta-section">
      <div className="container">
        {heading ? <h2>{heading}</h2> : null}
        {text ? <p>{text}</p> : null}
        <button 
          type="button" 
          className="btn btn-accent btn-lg" 
          onClick={() => document.dispatchEvent(new CustomEvent('openContact', { bubbles: true, cancelable: true }))}
        >
          {ctaText || 'Get a Quote'}
        </button>
      </div>
    </section>
  );
}