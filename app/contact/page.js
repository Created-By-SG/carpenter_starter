import { site } from '@/data/site';
import ContactButton from '@/components/ContactButton';

export const metadata = {
  title: `Contact ${site.name}`,
  description: `Get in touch with ${site.name} for a quote or enquiry.`,
};

export default function ContactPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="prose">
          <h1>Contact {site.name}</h1>
          <p>Call <a href={`tel:${site.phone}`} className="contact-link">{site.phone}</a></p>
          <p>Email <a href={`mailto:${site.email}`} className="contact-link">{site.email}</a></p>
          <p>Service areas: {site.areas.join(', ')}.</p>
          <ContactButton />
        </div>
      </div>
    </section>
  );
}
