import { site } from '@/data/site';
import ContactButton from '@/components/ContactButton';

export const metadata = {
  title: `Contact | ${site.name}`,
};

export default function ContactPage() {
  return (
    <section className="section" style={{ paddingTop: 'var(--nav-h)' }}>
      <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: 'var(--t-h1)', color: 'var(--navy)', marginBottom: '24px' }}>Contact {site.name}</h1>
        <p style={{ marginBottom: '16px' }}>Phone: <a href={`tel:${site.phone}`} style={{ color: 'var(--orange)', fontWeight: 600 }}>{site.phone}</a></p>
        <p style={{ marginBottom: '16px' }}>Email: <a href={`mailto:${site.email}`} style={{ color: 'var(--orange)', fontWeight: 600 }}>{site.email}</a></p>
        <p style={{ marginBottom: '32px' }}>Serving: {site.areas.join(', ')}</p>
        <ContactButton />
      </div>
    </section>
  );
}
