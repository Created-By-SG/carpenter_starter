export default function ScopeList({ items, config }) {
  const listStyle = config.style || 'bulleted';
  return (
    <section className="scope-section">
      <h2 style={{ textAlign: 'center', marginBottom: '32px', fontSize: 'var(--t-h2)', color: 'var(--navy)' }}>What's Included</h2>
      <ul className={`scope-list style-${listStyle}`} style={{ maxWidth: '600px', margin: '0 auto', listStyle: 'none', padding: 0 }}>
        {items.map((item, i) => (
          <li key={i} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <span style={{ color: 'var(--orange)', fontWeight: '700', flexShrink: 0 }}>•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
