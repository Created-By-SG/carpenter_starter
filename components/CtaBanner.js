'use client';

/**
 * Dark navy mid-page CTA banner. Visual style: .cta-banner in globals.css.
 */
export default function CtaBanner({ heading, text, ctaText }) {
  const handleClick = () => {
    document.dispatchEvent(new CustomEvent('openContact', { bubbles: true, cancelable: true }));
  };
  return (
    <section className="cta-banner">
      <div className="container">
        {heading ? <h2>{heading}</h2> : null}
        {text ? <p>{text}</p> : null}
        <button type="button" className="btn btn-accent btn-lg" onClick={handleClick}>
          {ctaText || 'Get a Quote'}
        </button>
      </div>
    </section>
  );
}
