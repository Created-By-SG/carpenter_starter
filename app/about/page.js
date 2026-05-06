import { site } from '@/data/site';

export const metadata = {
  title: `About Us | ${site.name}`,
};

export default function AboutPage() {
  return (
    <section className="section" style={{ paddingTop: 'var(--nav-h)' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: 'var(--t-h1)', color: 'var(--navy)', marginBottom: '24px' }}>About {site.name}</h1>
        <p style={{ marginBottom: '16px', lineHeight: 1.7 }}>Licensed {site.tradePlural} working across {site.areas.join(', ')}.</p>
        <p style={{ marginBottom: '16px', lineHeight: 1.7 }}>We quote fixed prices, work to {site.standards}, and do not subcontract without telling you first.</p>
        <p style={{ lineHeight: 1.7 }}>Every project starts with a site visit and a clear scope. No surprises, no subcontracting roulette.</p>
      </div>
    </section>
  );
}
