import { site } from '@/data/site';
import { services } from '@/data/services';
import { suburbs } from '@/data/suburbs';
import { processSteps } from '@/data/process';
import { features } from '@/data/features';
import { testimonials } from '@/data/testimonials';
import { faq } from '@/data/faq';
import { beforeAfter } from '@/data/beforeAfter';
import PageHero from '@/components/PageHero';
import ServiceShowcase from '@/components/ServiceShowcase';
import ProcessSteps from '@/components/ProcessSteps';
import FeatureGrid from '@/components/FeatureGrid';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import Testimonials from '@/components/Testimonials';
import Faq from '@/components/Faq';
import CtaBanner from '@/components/CtaBanner';

export default function HomePage() {
  const serviceList = Object.values(services);

  return (
    <>
      <PageHero
        title="High-End Carpentry & Renovations on the Northern Gold Coast"
        subtitle="Custom joinery, luxury renovations, fixed quotes, qualified trades."
        image="/images/hero.webp"
        ctaText="Get a Quote"
      />

      {/* Service Showcases — alternating image/text rows */}
      <section id="services">
        {serviceList.map((service, index) => (
          <ServiceShowcase key={service.slug} service={service} flip={index % 2 === 1} />
        ))}
      </section>

      {/* Process */}
      <section className="section section-alt" id="process">
        <div className="container">
          <h2 className="section-title reveal-up">Our Process</h2>
          <p className="section-subtitle reveal-up">From first call to final walkthrough</p>
          <ProcessSteps steps={processSteps} />
        </div>
      </section>

      {/* Features */}
      <section className="section" id="about">
        <div className="container">
          <h2 className="section-title reveal-up">Why Work With Us</h2>
          <FeatureGrid features={features} />
        </div>
      </section>

      {/* Before/After Gallery */}
      <section className="section section-tinted" id="gallery">
        <div className="container">
          <h2 className="section-title reveal-up">Our Work</h2>
          <p className="section-subtitle reveal-up">Drag the slider to see the transformation</p>
          <div className="ba-grid reveal-up">
            {beforeAfter.map((item, i) => (
              <BeforeAfterSlider key={i} title={item.title} before={`/images/${item.before}`} after={`/images/${item.after}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="container">
          <h2 className="section-title reveal-up">Client Testimonials</h2>
          <p className="section-subtitle reveal-up">What homeowners across the coast say</p>
          <Testimonials testimonials={testimonials} />
        </div>
      </section>

      {/* FAQ */}
      <section className="section section-alt" id="faq">
        <div className="container">
          <h2 className="section-title reveal-up">Common Questions</h2>
          <Faq items={faq} />
        </div>
      </section>

      <CtaBanner
        heading="Ready to talk about your project?"
        text="Call or message for a free, fixed quote and a clear timeline."
        ctaText="Get a Quote"
      />
    </>
  );
}
