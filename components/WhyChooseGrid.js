/**
 * Why-choose-us grid. Visual twin of AuthoritySection so service pages
 * feel cohesive. Visual style: .card-grid + .card in globals.css.
 * Config: columns (1-4), card_style (bordered|shadowed|flat|minimal).
 */
export default function WhyChooseGrid({ items, config }) {
  const cols = config?.columns || 2;
  const cardStyle = config?.card_style || 'bordered';
  return (
    <div className="why-choose-section">
      <h2 className="section-title">Why Choose Us</h2>
      <div className={`card-grid cols-${cols}`}>
        {items.map((item, i) => (
          <div key={i} className={`card card-${cardStyle}`}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
