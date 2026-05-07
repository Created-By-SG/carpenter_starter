import Link from 'next/link';
import { services } from '@/data/services';

/**
 * Grid of cards linking to each service. Used on suburb pages.
 * Visual style: .card-grid + .card.card-bordered.card-hover in globals.css.
 */
export default function ServiceLinks({ config }) {
  const cols = config?.columns || 3;
  return (
    <div className={`service-links card-grid cols-${cols}`}>
      {Object.values(services).map((service) => (
        <Link
          key={service.slug}
          href={`/services/${service.slug}/`}
          className="card card-bordered card-hover card-link"
        >
          <h3>{service.title}</h3>
          <p>{service.excerpt}</p>
          <span className="btn btn-outline btn-sm">Learn more</span>
        </Link>
      ))}
    </div>
  );
}
