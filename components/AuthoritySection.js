import { getLayoutClasses } from '@/lib/layout';

export default function AuthoritySection({ data, config }) {
  const layoutClass = getLayoutClasses('authority_section', config);
  return (
    <section className={`authority-section ${layoutClass}`}>
      <h2 style={{ textAlign: 'center', marginBottom: '32px', fontSize: 'var(--t-h2)', color: 'var(--navy)' }}>{data.heading}</h2>
      <div className={`authority-grid ${config.columns ? `cols-${config.columns}` : 'cols-3'}`} style={{ display: 'grid', gap: 'var(--gap)' }}>
        {data.points.map((point, i) => (
          <div key={i} className={`authority-card ${config.card_style ? `card-${config.card_style}` : ''}`} style={{ padding: '24px', borderRadius: 'var(--radius-card)' }}>
            <h3 style={{ fontSize: 'var(--t-h3)', color: 'var(--navy)', marginBottom: '8px' }}>{point.title}</h3>
            <p style={{ lineHeight: 1.6, color: 'var(--text)' }}>{point.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
