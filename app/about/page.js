import { site } from '@/data/site';

export const metadata = {
  title: `About ${site.name}`,
  description: `About ${site.name} — ${site.trade} services across the Gold Coast.`,
};

export default function AboutPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="prose">
          <h1>About {site.name}</h1>
          <p>Licensed {site.tradePlural} working across {site.areas.join(', ')}.</p>
          <p>We quote fixed prices, work to {site.standards}, and do not subcontract without telling you first.</p>
          <p>Every project starts with a site visit and a clear scope. No surprises, no subcontracting roulette.</p>
        </div>
      </div>
    </section>
  );
}
