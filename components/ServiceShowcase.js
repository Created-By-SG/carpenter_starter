'use client';

import Link from 'next/link';

/**
 * Image+text row for a single service on the homepage.
 * Visual style: .service-showcase + .split-2 in globals.css.
 * Set flip=true on alternating rows to mirror image/text order.
 */
export default function ServiceShowcase({ service, flip }) {
  return (
    <section className={`service-showcase ${flip ? '' : 'section-alt'}`}>
      <div className="container">
        <div className={`split-2 ${flip ? 'flip' : ''}`}>
          <div className="reveal-up">
            <img src={service.showcaseImage} alt={service.title} />
          </div>
          <div className="reveal-up delay-1">
            <h2>{service.title}</h2>
            {service.tagline && <span className="tagline">{service.tagline}</span>}
            {service.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
            <Link href={`/services/${service.slug}/`} className="btn btn-primary">
              {service.ctaText || 'Learn more'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
