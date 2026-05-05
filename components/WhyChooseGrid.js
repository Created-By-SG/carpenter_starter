import { getLayoutClasses } from '@/lib/layout';

export default function WhyChooseGrid({ items, config }) {
  const layoutClass = getLayoutClasses('why_choose_section', config);
  return (
    <section className={`why-choose ${layoutClass}`}>
      <h2 style={{ textAlign: 'center', marginBottom: '32px', fontSize: 'var(--t-h2)', color: 'var(--navy)' }}>Why Choose Us</h2>
      <div className={`why-grid ${config.columns ? `cols-${config.columns}` : 'cols-2'}`} style={{ display: 'grid', gap: 'var(--gap)' }}>
        {items.map((item, i) => (
          <div key={i} className={`why-card ${config.card_style ? `card-${config.card_style}` : ''}`} style={{ padding: '24px', borderRadius: 'var(--radius-card)', background: 'var(--white)', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontSize: 'var(--t-h3)', color: 'var(--navy)', marginBottom: '8px' }}>{item.title}</h3>
            <p style={{ lineHeight: 1.6, color: 'var(--text)' }}>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
