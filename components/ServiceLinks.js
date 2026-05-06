import Link from 'next/link';
import { services } from '@/data/services';

export default function ServiceLinks({ config }) {
  const cols = config?.columns || 3;
  return (
    <section className="service-links" style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 'var(--gap)' }}>
      {Object.values(services).map((service) => (
        <Link key={service.slug} href={`/services/${service.slug}/`} className="service-card" style={{ display: 'block', padding: '24px', borderRadius: 'var(--radius-card)', border: '1px solid var(--border)', background: 'var(--white)', transition: 'all 0.3s', textDecoration: 'none' }}>
          <h3 style={{ fontSize: 'var(--t-h3)', color: 'var(--navy)', marginBottom: '8px' }}>{service.title}</h3>
          <p style={{ fontSize: 'var(--t-small)', color: 'var(--gray)', marginBottom: '16px', lineHeight: 1.5 }}>{service.excerpt}</p>
          <span className="btn-secondary" style={{ display: 'inline-flex', padding: '8px 16px', fontSize: '0.9rem' }}>Learn more</span>
        </Link>
      ))}
    </section>
  );
}
