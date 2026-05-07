'use client';

import Link from 'next/link';

export default function AreasList({ areas }) {
  return (
    <div className="areas-content reveal-up">
      <h2 className="section-title">Carpentry & Renovation Services Across The Gold Coast</h2>
      <p>We proudly serve homeowners across the Northern Gold Coast. Our team knows the local architecture, council regulations, and what it takes to deliver projects that blend luxury and functionality.</p>
      <div className="areas-list">
        {areas.map((area) => (
          <Link key={area.slug} href={`/location/${area.region}/${area.slug}/`} className="area-item">
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            {area.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
