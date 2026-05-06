import { getLayoutClasses } from '@/lib/layout';

export default function WhyChooseGrid({ items, config }) {
  const layoutClass = getLayoutClasses('why_choose_section', config);
  return (
    <section className={`why-choose ${layoutClass}`}>
      <h2 className="section-title">Why Choose Us</h2>
      <div className={`why-grid ${config.columns ? `cols-${config.columns}` : 'cols-2'}`}>
        {items.map((item, i) => (
          <div key={i} className={`why-card ${config.card_style ? `card-${config.card_style}` : ''}`}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}