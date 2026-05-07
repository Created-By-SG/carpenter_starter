import { site } from '@/data/site';
import PageHero from './PageHero';
import ServiceLinks from './ServiceLinks';
import CtaBlocks from './CtaBlocks';
import layoutConfig from '@/data/layout';

export default function SuburbPageTemplate({ suburb }) {
  const config = layoutConfig.suburb_page;
  const tradeTitle = site.trade.charAt(0).toUpperCase() + site.trade.slice(1);

  return (
    <>
      <PageHero
        title={`${tradeTitle} in ${suburb.name}`}
        subtitle={suburb.intro}
        image={suburb.heroImage}
        ctaText="Get a Quote"
      />

      <section className="section">
        <div className="container">
          <div className="prose">
            <p>{suburb.intro}</p>
            <p className="muted">
              {suburb.name} sits within the {suburb.region} region, part of the broader Gold Coast area we cover from {site.areas.join(' through ')}.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">Services in {suburb.name}</h2>
          <ServiceLinks config={config.service_links} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="prose">
            <p>{suburb.localSuppliers}</p>
          </div>
        </div>
      </section>

      <CtaBlocks />

      <section className="section">
        <div className="container">
          <div className="prose">
            <p>{suburb.character}</p>
          </div>
        </div>
      </section>
    </>
  );
}
