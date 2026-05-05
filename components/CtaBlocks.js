import ProcessSteps from './ProcessSteps';
import Testimonials from './Testimonials';
import Faq from './Faq';
import CtaBanner from './CtaBanner';
import { trades } from '@/data/trades';
import { processSteps } from '@/data/process';
import { testimonials } from '@/data/testimonials';
import { faq } from '@/data/faq';

export default function CtaBlocks() {
  return (
    <>
      <section className="section" style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <ProcessSteps steps={processSteps} />
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'var(--t-h2)', color: 'var(--navy)', marginBottom: '16px' }}>Your Renovation Team</h2>
          <p style={{ lineHeight: 1.7 }}>{trades}</p>
        </div>
      </section>

      <section className="section testimonials">
        <div className="container">
          <h2 className="section-title">What Clients Say</h2>
          <Testimonials testimonials={testimonials} />
        </div>
      </section>

      <section className="section faq">
        <div className="container">
          <h2 className="section-title">Common Questions</h2>
          <Faq items={faq} />
        </div>
      </section>

      <CtaBanner heading="Ready to Transform Your Home?" text="Call or message us for a fixed quote and clear timeline." ctaText="Get a Quote" />
    </>
  );
}
