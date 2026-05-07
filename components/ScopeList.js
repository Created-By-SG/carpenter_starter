/**
 * Bulleted "what's included" list. Visual: .scope-list-wrap + .scope-list in globals.css.
 */
export default function ScopeList({ items }) {
  return (
    <div className="scope-list-wrap">
      <ul className="scope-list">
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  );
}
