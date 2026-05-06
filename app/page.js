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
import AreasList from '@/components/AreasList';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import Testimonials from '@/components/Testimonials';
import Faq from '@/components/Faq';
import CtaBanner from '@/components/CtaBanner';

export default function HomePage() {
  const serviceList = Object.values(services);
  const suburbList = Object.values(suburbs);

  return (
    <>
      <PageHero
        title="High-End Carpentry & Renovations on the Northern Gold Coast"
        subtitle="Custom Joinery. Luxury Renovations. Done Right."
        image="/images/hero.webp"
        ctaText="Grab a Free Quote Today"
        ctaHref="#contact"
      />

      {/* Services Intro */}
      <section className="section service-section" id="services">
        <div className="container">
          <div className="grid-2col">
            <div className="col-demo reveal-up">
              <img src="/images/working.webp" alt="Carpentry work" />
            </div>
            <div className="col-copy reveal-up delay-1">
              <h2 style={{ fontSize: 'var(--t-h1)' }}>Our Services</h2>
              <span className="tagline">Expert Carpentry and Renovation Solutions on the Northern Gold Coast</span>
              <p>From luxury home transformations to custom joinery and outdoor living, we deliver high-quality, tailored carpentry services designed to elevate your lifestyle and add long-term value to your property.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Showcases */}
      {serviceList.map((service, index) => (
        <ServiceShowcase key={service.slug} service={service} flip={index % 2 === 1} />
      ))}

      {/* Process */}
      <section className="section" id="process">
        <div className="container">
          <h2 className="section-title reveal-up">Our Process</h2>
          <p className="section-subtitle reveal-up">How We Work - With You, Not Just For You</p>
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

      {/* Areas */}
      <section className="section" id="areas">
        <div className="container">
          <AreasList areas={suburbList} />
        </div>
      </section>

      {/* Before/After */}
      <section className="section gallery" id="gallery">
        <div className="container">
          <h2 className="section-title reveal-up">Our Work</h2>
          <p className="section-subtitle reveal-up">Drag the slider to see the transformation</p>
          <div className="ba-slider-grid reveal-up">
            {beforeAfter.map((item, i) => (
              <BeforeAfterSlider key={i} title={item.title} before={`/images/${item.before}`} after={`/images/${item.after}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials">
        <div className="container">
          <h2 className="section-title reveal-up">Client Testimonials</h2>
          <p className="section-subtitle reveal-up">What Our Clients Say — Swipe to see more</p>
          <Testimonials testimonials={testimonials} />
        </div>
      </section>

      {/* FAQ */}
      <section className="section faq" id="faq">
        <div className="container">
          <h2 className="section-title reveal-up">FAQ</h2>
          <Faq items={faq} />
        </div>
      </section>

      {/* CTA */}
      <CtaBanner
        heading="Ready to transform your home?"
        text="Get a free, no-obligation quote from our expert team today."
        ctaText="Get Your Free Quote"
      />
    </>
  );
}
