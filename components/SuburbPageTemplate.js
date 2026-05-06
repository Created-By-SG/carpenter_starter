import { site } from '@/data/site';
import PageHero from './PageHero';
import ServiceLinks from './ServiceLinks';
import CtaBlocks from './CtaBlocks';
import layoutConfig from '@/data/layout';

export default function SuburbPageTemplate({ suburb }) {
  const config = layoutConfig.suburb_page;

  return (
    <>
      <PageHero
        title={`${site.trade.charAt(0).toUpperCase() + site.trade.slice(1)} in ${suburb.name}`}
        subtitle={suburb.intro}
        image={suburb.heroImage}
        ctaText="Get a Quote"
      />

      <section className="section">
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ marginBottom: '24px', lineHeight: 1.7 }}>{suburb.intro}</p>
          <p style={{ marginBottom: '24px', lineHeight: 1.7, color: 'var(--gray)' }}>
            {suburb.name} sits within the {suburb.region} region, part of the broader Gold Coast area we cover from {site.areas.join(' through ')}.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '32px', fontSize: 'var(--t-h2)', color: 'var(--navy)' }}>Services in {suburb.name}</h2>
          <ServiceLinks config={config.service_links} />
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ lineHeight: 1.7 }}>{suburb.localSuppliers}</p>
        </div>
      </section>

      <CtaBlocks />

      <section className="section">
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ lineHeight: 1.7 }}>{suburb.character}</p>
        </div>
      </section>
    </>
  );
}
