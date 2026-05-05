import { site } from '@/data/site';
import { suburbs } from '@/data/suburbs';
import PageHero from './PageHero';
import AuthoritySection from './AuthoritySection';
import ScopeList from './ScopeList';
import WhyChooseGrid from './WhyChooseGrid';
import CtaBanner from './CtaBanner';
import Link from 'next/link';
import layoutConfig from '@/config/layout.json';

export default function ServicePageTemplate({ service }) {
  const config = layoutConfig.service_page;
  const suburbList = Object.values(suburbs);

  return (
    <>
      <PageHero
        title={service.title}
        subtitle={service.opening?.[0] || ''}
        image={service.heroImage}
        ctaText="Get a Quote"
      />

      {site.disclaimer && (
        <div className="disclaimer-banner" style={{ background: 'var(--orange)', color: 'white', textAlign: 'center', padding: '12px', fontSize: '0.9rem' }}>
          <p>{site.disclaimer}</p>
        </div>
      )}

      <section className="section">
        <div className="container">
          <div className="service-opening" style={{ maxWidth: '800px', margin: '0 auto' }}>
            {service.opening?.map((p, i) => <p key={i} style={{ marginBottom: '16px', lineHeight: 1.7 }}>{p}</p>)}
          </div>
        </div>
      </section>

      <CtaBanner heading="Like What You See?" text={`Call ${site.phone} for a fixed quote`} />

      {service.authority && (
        <section className="section">
          <div className="container">
            <AuthoritySection data={service.authority} config={config.authority_section} />
          </div>
        </section>
      )}

      {service.scope && (
        <section className="section">
          <div className="container">
            <ScopeList items={service.scope} config={config.scope_section} />
          </div>
        </section>
      )}

      {service.whyChoose && (
        <section className="section">
          <div className="container">
            <WhyChooseGrid items={service.whyChoose} config={config.why_choose_section} />
          </div>
        </section>
      )}

      {service.closingCta && (
        <CtaBanner heading={service.closingCta.heading} text={service.closingCta.text} />
      )}

      <section className="section">
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '32px', fontSize: 'var(--t-h2)', color: 'var(--navy)' }}>Areas We Serve</h2>
          <div className="areas-list" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {suburbList.map(suburb => (
              <Link key={suburb.slug} href={`/location/${suburb.region}/${suburb.slug}/`} className="area-item">
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                {suburb.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
