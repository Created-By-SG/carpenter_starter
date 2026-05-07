/**
 * Authority cards (e.g. "Why X needs a professional"). Used on service pages.
 * Visual style: .card-grid + .card from globals.css.
 * Config keys: columns (1-4), card_style (bordered|shadowed|flat|minimal).
 */
export default function AuthoritySection({ data, config }) {
  const cols = config?.columns || 3;
  const cardStyle = config?.card_style || 'bordered';
  return (
    <div className="authority-section">
      <h2 className="section-title">{data.heading}</h2>
      <div className={`card-grid cols-${cols}`}>
        {data.points.map((point, i) => (
          <div key={i} className={`card card-${cardStyle}`}>
            <h3>{point.title}</h3>
            <p>{point.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
