export default function ScopeList({ items, config }) {
  const listStyle = config.style || 'bulleted';
  return (
    <section className="scope-section">
      <h2 className="section-title">What's Included</h2>
      <ul className={`scope-list style-${listStyle}`}>
        {items.map((item, i) => (
          <li key={i}>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}