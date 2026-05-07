import { site } from '@/data/site';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-logo">{site.name}</div>
        <p>High-end {site.trade} & renovations across the Northern Gold Coast.<br />Licensed & insured. Quality guaranteed.</p>
        <p className="footer-copy">&copy; {site.year} {site.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
