'use client';

export default function ServiceShowcase({ service, flip }) {
  return (
    <section className="section section-pad">
      <div className="container">
        <div className={`grid-2col ${flip ? 'zigzag-flip' : ''}`}>
          <div className="col-demo reveal-up">
            <img src={service.showcaseImage} alt={service.title} />
          </div>
          <div className="col-copy reveal-up delay-1">
            <h2>{service.title}</h2>
            {service.tagline && <span className="tagline">{service.tagline}</span>}
            {service.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
            {service.locations && <span className="locations">{service.locations}</span>}
            <button className="btn btn-primary" onClick={() => document.dispatchEvent(new Event('openContact'))}>
              {service.ctaText || 'Learn more'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
