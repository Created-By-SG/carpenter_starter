import ProcessSteps from './ProcessSteps';
import Testimonials from './Testimonials';
import Faq from './Faq';
import CtaBanner from './CtaBanner';
import { trades } from '@/data/trades';
import { processSteps } from '@/data/process';
import { testimonials } from '@/data/testimonials';
import { faq } from '@/data/faq';

/**
 * Reusable bottom-of-page block group: process + team + testimonials + faq + final CTA.
 * Used on suburb pages. All visual styling is in globals.css — no inline styles.
 */
export default function CtaBlocks() {
  return (
    <>
      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <ProcessSteps steps={processSteps} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Your Renovation Team</h2>
          <div className="prose">
            <p>{trades}</p>
          </div>
        </div>
      </section>

      <section className="section section-tinted">
        <div className="container">
          <h2 className="section-title">What Clients Say</h2>
          <Testimonials testimonials={testimonials} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Common Questions</h2>
          <Faq items={faq} />
        </div>
      </section>

      <CtaBanner
        heading="Ready to Transform Your Home?"
        text="Call or message us for a fixed quote and clear timeline."
        ctaText="Get a Quote"
      />
    </>
  );
}
