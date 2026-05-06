import { getLayoutClasses } from '@/lib/layout';

export default function AuthoritySection({ data, config }) {
  const layoutClass = getLayoutClasses('authority_section', config);
  return (
    <section className={`authority-section ${layoutClass}`}>
      <h2 className="section-title">{data.heading}</h2>
      <div className={`authority-grid ${config.columns ? `cols-${config.columns}` : 'cols-3'}`}>
        {data.points.map((point, i) => (
          <div key={i} className={`authority-card ${config.card_style ? `card-${config.card_style}` : ''}`}>
            <h3>{point.title}</h3>
            <p>{point.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}