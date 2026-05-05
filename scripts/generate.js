//============================================================
// ENGINE-CLEAN COMPILER
// Reads brief/ + config/ → writes data/ + app/globals.css
// Heavily commented for cold-agent readability
//============================================================

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BRIEF_DIR = path.join(process.cwd(), 'brief');
const CONFIG_DIR = path.join(process.cwd(), 'config');
const DATA_DIR = path.join(process.cwd(), 'data');
const APP_DIR = path.join(process.cwd(), 'app');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// STEP 1: READ INPUTS
let business, contentRaw, theme, layoutConfig, animConfig;
try { business = JSON.parse(fs.readFileSync(path.join(BRIEF_DIR, '01-business.json'), 'utf8')); }
catch (e) { throw new Error('Failed to read brief/01-business.json: ' + e.message); }
try { contentRaw = fs.readFileSync(path.join(BRIEF_DIR, '02-content.md'), 'utf8'); }
catch (e) { throw new Error('Failed to read brief/02-content.md: ' + e.message); }
try { theme = JSON.parse(fs.readFileSync(path.join(BRIEF_DIR, '03-theme.json'), 'utf8')); }
catch (e) { throw new Error('Failed to read brief/03-theme.json: ' + e.message); }
try { layoutConfig = JSON.parse(fs.readFileSync(path.join(CONFIG_DIR, 'layout.json'), 'utf8')); }
catch (e) { throw new Error('Failed to read config/layout.json: ' + e.message); }
try { animConfig = JSON.parse(fs.readFileSync(path.join(CONFIG_DIR, 'animations.json'), 'utf8')); }
catch (e) { throw new Error('Failed to read config/animations.json: ' + e.message); }

// STEP 2: VALIDATE SLUGS
const serviceSlugs = business.services.map(s => s.slug);
const territorySlugs = business.territories.map(t => t.slug);
const contentAnchors = contentRaw.match(/^##(service|suburb|global):[a-z0-9-]+/gm) || [];
const contentServiceSlugs = contentAnchors.filter(a => a.startsWith('##service:')).map(a => a.replace('##service:', ''));
const contentTerritorySlugs = contentAnchors.filter(a => a.startsWith('##suburb:')).map(a => a.replace('##suburb:', ''));

for (const slug of serviceSlugs) {
  if (!contentServiceSlugs.includes(slug)) throw new Error(`Missing content section for service:${slug} in 02-content.md`);
}
for (const slug of territorySlugs) {
  if (!contentTerritorySlugs.includes(slug)) throw new Error(`Missing content section for suburb:${slug} in 02-content.md`);
}

// STEP 3: PARSE CONTENT
function parseContent(md) {
  const lines = md.split('\n');
  const result = { services: {}, suburbs: {}, global: {} };
  let currentSection = null;
  let currentSubSection = null;
  let buffer = [];

  function flush() {
    if (!currentSection || !currentSubSection) return;
    const text = buffer.join('\n').trim();
    if (currentSection.type === 'service') {
      if (!result.services[currentSection.slug]) result.services[currentSection.slug] = {};
      result.services[currentSection.slug][currentSubSection] = text;
    } else if (currentSection.type === 'suburb') {
      if (!result.suburbs[currentSection.slug]) result.suburbs[currentSection.slug] = {};
      result.suburbs[currentSection.slug][currentSubSection] = text;
    } else if (currentSection.type === 'global') {
      if (!result.global[currentSection.slug]) result.global[currentSection.slug] = [];
      if (text) result.global[currentSection.slug].push(text);
    }
    buffer = [];
  }

  for (const line of lines) {
    const sectionMatch = line.match(/^##(service|suburb|global):([a-z0-9-]+)/);
    const subMatch = line.match(/^###([a-z_]+)/);
    if (sectionMatch) { flush(); currentSection = { type: sectionMatch[1], slug: sectionMatch[2] }; currentSubSection = null; buffer = []; }
    else if (subMatch && currentSection) { flush(); currentSubSection = subMatch[1]; buffer = []; }
    else { buffer.push(line); }
  }
  flush();

  // Parse testimonials: > "text" | author | location
  if (result.global.testimonials) {
    const raw = result.global.testimonials.join('\n');
    result.global.testimonials = raw.split('\n').filter(l => l.trim().startsWith('>')).map(l => {
      const cleaned = l.trim().replace(/^>\s*/, '');
      const parts = cleaned.split(' | ').map(p => p.trim());
      return { text: parts[0] || cleaned, author: parts[1] || '', location: parts[2] || '' };
    });
  }

  // Parse FAQ: **Question**\nAnswer
  if (result.global.faq) {
    const raw = result.global.faq.join('\n').trim();
    const items = [];
    const blocks = raw.split(/\n(?=\*\*)/).filter(Boolean);
    for (const block of blocks) {
      const lines = block.split('\n').filter(Boolean);
      const question = lines[0].replace(/\*\*/g, '').trim();
      const answer = lines.slice(1).join(' ').trim();
      if (question && answer) items.push({ question, answer });
    }
    result.global.faq = items;
  }

  // Parse process: Step N: Title | Description
  if (result.global.process) {
    const raw = result.global.process.join('\n');
    result.global.process = raw.split('\n').filter(Boolean).map(line => {
      const match = line.match(/^Step (\d+):\s*(.+?)\s*\|\s*(.+)$/);
      if (match) return { num: match[1].padStart(2, '0'), title: match[2].trim(), text: match[3].trim() };
      return null;
    }).filter(Boolean);
  }

  // Parse features: Title | Description
  if (result.global.features) {
    const raw = result.global.features.join('\n');
    result.global.features = raw.split('\n').filter(Boolean).map(line => {
      const parts = line.split(' | ').map(p => p.trim());
      return { title: parts[0] || '', text: parts[1] || '' };
    }).filter(f => f.title);
  }

  // Parse before/after: Title | before.webp | after.webp
  if (result.global.before_after) {
    const raw = result.global.before_after.join('\n');
    result.global.before_after = raw.split('\n').filter(Boolean).map(line => {
      const parts = line.split(' | ').map(p => p.trim());
      return { title: parts[0] || '', before: parts[1] || '', after: parts[2] || '' };
    }).filter(b => b.before && b.after);
  }

  if (result.global.trades) result.global.trades = result.global.trades.join(' ').trim();
  return result;
}

const parsed = parseContent(contentRaw);

// STEP 4: PARSE SERVICES
function parseService(raw, biz) {
  const obj = {};
  if (raw.opening) obj.opening = raw.opening.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  if (raw.tagline) obj.tagline = raw.tagline.trim();
  if (raw.paragraphs) obj.paragraphs = raw.paragraphs.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  if (raw.locations) obj.locations = raw.locations.trim();
  if (raw.cta_text) obj.ctaText = raw.cta_text.trim();
  if (raw.authority_heading) {
    obj.authority = { heading: raw.authority_heading.trim(), points: [], closing: '' };
    if (raw.authority_points) {
      const matches = raw.authority_points.match(/^-\s*\*\*([^*]+)\*\*:\s*(.+)$/gm);
      if (matches) obj.authority.points = matches.map(m => {
        const match = m.match(/^-\s*\*\*([^*]+)\*\*:\s*(.+)$/);
        return { title: match[1].trim(), text: match[2].trim() };
      });
    }
  }
  if (raw.scope) obj.scope = raw.scope.split('\n').map(l => l.trim()).filter(l => l.startsWith('-')).map(l => l.replace(/^-\s*/, ''));
  if (raw.why_choose) {
    obj.whyChoose = [];
    const matches = raw.why_choose.match(/^-\s*\*\*([^*]+)\*\*:\s*(.+)$/gm);
    if (matches) obj.whyChoose = matches.map(m => {
      const match = m.match(/^-\s*\*\*([^*]+)\*\*:\s*(.+)$/);
      return { title: match[1].trim(), text: match[2].trim() };
    });
  }
  if (raw.closing_cta_heading) obj.closingCta = { heading: raw.closing_cta_heading.trim(), text: raw.closing_cta_text ? raw.closing_cta_text.trim() : '' };
  if (obj.opening && obj.opening[0]) {
    const first = obj.opening[0];
    obj.excerpt = first.split(/[.!?]/)[0] + (first.includes('.') ? '.' : '');
  }
  return obj;
}

const servicesData = {};
for (const slug of serviceSlugs) {
  const raw = parsed.services[slug] || {};
  const structured = parseService(raw, business.services.find(s => s.slug === slug));
  const biz = business.services.find(s => s.slug === slug);
  servicesData[slug] = {
    slug, title: biz.title,
    anchorSuburb: business.territories.find(t => t.slug === biz.anchor_suburb)?.name || biz.anchor_suburb,
    heroImage: `/images/${biz.hero_image}`,
    showcaseImage: `/images/${biz.showcase_image}`,
    ...structured
  };
}

// STEP 5: PARSE SUBURBS
const suburbsData = {};
for (const slug of territorySlugs) {
  const raw = parsed.suburbs[slug] || {};
  const biz = business.territories.find(t => t.slug === slug);
  let localSuppliers = raw.local_suppliers ? raw.local_suppliers.trim() : '';
  if (!localSuppliers) localSuppliers = `We source materials from local suppliers and work with trusted ${business.business.trade} trades based in and around ${biz.name}.`;
  suburbsData[slug] = {
    slug, name: biz.name, region: biz.region,
    heroImage: `/images/${biz.hero_image}`,
    intro: raw.intro ? raw.intro.trim() : '',
    character: raw.character_close ? raw.character_close.trim() : '',
    localSuppliers, services: serviceSlugs
  };
}

// STEP 6: WRITE DATA FILES
const siteJs = `export const site = ${JSON.stringify({
  name: business.business.name, trade: business.business.trade,
  tradePlural: business.business.trade_plural, phone: business.business.phone,
  email: business.business.email, areas: business.business.areas,
  standards: business.business.standards, year: business.business.year,
  disclaimer: business.business.disclaimer || '',
  social: business.business.social || {}, tagline: business.business.tagline || '',
  seo: business.seo
}, null, 2)};`;
fs.writeFileSync(path.join(DATA_DIR, 'site.js'), siteJs);

fs.writeFileSync(path.join(DATA_DIR, 'services.js'), `export const services = ${JSON.stringify(servicesData, null, 2)};`);
fs.writeFileSync(path.join(DATA_DIR, 'suburbs.js'), `export const suburbs = ${JSON.stringify(suburbsData, null, 2)};`);
fs.writeFileSync(path.join(DATA_DIR, 'testimonials.js'), `export const testimonials = ${JSON.stringify(parsed.global.testimonials || [], null, 2)};`);
fs.writeFileSync(path.join(DATA_DIR, 'faq.js'), `export const faq = ${JSON.stringify(parsed.global.faq || [], null, 2)};`);
fs.writeFileSync(path.join(DATA_DIR, 'trades.js'), `export const trades = ${JSON.stringify(parsed.global.trades || '', null, 2)};`);
fs.writeFileSync(path.join(DATA_DIR, 'process.js'), `export const processSteps = ${JSON.stringify(parsed.global.process || [], null, 2)};`);
fs.writeFileSync(path.join(DATA_DIR, 'features.js'), `export const features = ${JSON.stringify(parsed.global.features || [], null, 2)};`);
fs.writeFileSync(path.join(DATA_DIR, 'beforeAfter.js'), `export const beforeAfter = ${JSON.stringify(parsed.global.before_after || [], null, 2)};`);

console.log('✓ /data/ files written');

// STEP 7: WRITE globals.css
function generateCSS() {
  const c = theme.colors;
  const r = theme.radii;
  const s = theme.shadows;
  const bg = theme.background_style;
  const ref = new Set(Object.values(animConfig.behaviours || {}));

  let kf = '';
  if (animConfig.enabled) {
    if (ref.has('fade_up')) kf += `@keyframes fade_up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }\n`;
    if (ref.has('slide_up')) kf += `@keyframes slide_up { from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); } }\n`;
    if (ref.has('subtle_scale')) kf += `@keyframes subtle_scale { from { transform: scale(1); } to { transform: scale(1.02); } }\n`;
    if (ref.has('fade_scale')) kf += `@keyframes fade_scale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }\n`;
    if (ref.has('slide_right')) kf += `@keyframes slide_right { from { transform: translateX(-100%); } to { transform: translateX(0); } }\n`;
  }

  let ac = '';
  if (animConfig.enabled) {
    for (const [b, p] of Object.entries(animConfig.behaviours || {})) {
      ac += `.anim-${b} { animation: ${p} ${animConfig.global?.duration || '0.85s'} ${animConfig.global?.easing || 'cubic-bezier(0.16,1,0.3,1)'} both; }\n`;
    }
  }

  const css = `/* GENERATED globals.css — DO NOT EDIT MANUALLY */
:root {
  --navy: ${c.primary}; --navy-light: ${c.primary_light}; --orange: ${c.accent}; --orange-light: ${c.accent_light};
  --white: #ffffff; --off-white: ${c.off_white || c.background}; --gray: ${c.gray || c.muted}; --light-gray: ${c.light_gray || c.border};
  --text: ${c.text}; --muted: ${c.muted}; --border: ${c.border}; --surface: ${c.surface};
  --shadow: ${s.card}; --shadow-lg: ${s.elevated};
  --radius-card: ${r.card}; --radius-button: ${r.button}; --radius-image: ${r.image}; --radius-icon: ${r.icon || '8px'};
  --font-heading: ${theme.fonts.heading}; --font-body: ${theme.fonts.body};
  --container-w: 100%; --container-pad: 16px;
  --t-display: clamp(40px, 11vw, 76px); --t-h1: clamp(34px, 8vw, 50px); --t-h2: clamp(24px, 6vw, 32px);
  --t-h3: clamp(20px, 5vw, 24px); --t-body: 16px; --t-meta: 16px; --t-small: 13px;
  --nav-h: 56px; --sec-pad: 40px; --gap: 16px;
  --transition-fast: 0.25s ease; --transition-base: 0.3s ease;
  --transition-slow: ${animConfig.enabled ? (animConfig.global?.duration || '0.85s') : '0s'} ${animConfig.enabled ? (animConfig.global?.easing || 'cubic-bezier(0.16,1,0.3,1)') : 'ease'};
}
html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; }
body {
  font-family: var(--font-body), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: var(--t-body); color: var(--text); line-height: 1.6;
  background: ${bg.type === 'gradient' ? bg.value : bg.value};
  background-attachment: fixed; background-size: 100% 250vh; background-repeat: no-repeat;
  overflow-x: clip; width: 100%; padding-bottom: 80px;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
a { text-decoration: none; color: inherit; }
button { font-family: inherit; cursor: pointer; border: none; background: none; }
img { max-width: 100%; display: block; }
h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading), system-ui, sans-serif; font-weight: 600; line-height: 1.2; color: var(--navy); }

.container {
  width: var(--container-w); max-width: 100%; margin-left: auto; margin-right: auto;
  padding-left: var(--container-pad); padding-right: var(--container-pad); box-sizing: border-box;
}

/* Scroll progress */
.scroll-bar {
  position: fixed; top: 0; left: 0; right: 0; height: 3px; z-index: 9998;
  transform-origin: left; transform: scaleX(0); background: var(--orange);
}

/* Nav */
.nav-outer {
  position: sticky; top: 0; left: 0; right: 0; z-index: 1000;
  height: calc(var(--nav-h) + env(safe-area-inset-top));
  padding-top: env(safe-area-inset-top);
  background: rgba(255,255,255,0.92); -webkit-backdrop-filter: blur(20px); backdrop-filter: blur(20px);
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
}
.nav-inner { height: var(--nav-h); display: flex; align-items: center; justify-content: space-between; }
.nav-links { display: none; align-items: center; gap: 32px; font-weight: 600; font-size: 0.95rem; color: var(--navy); }
.nav-links a { transition: color 0.3s; }
.nav-links a:hover { color: var(--orange); }
@media (min-width: 1024px) { .nav-links { display: flex; } }

/* Reveal animations */
.reveal-up, .reveal-left, .reveal-right, .reveal-scale {
  opacity: 0; transition: opacity 0.85s cubic-bezier(0.16,1,0.3,1), transform 0.85s cubic-bezier(0.16,1,0.3,1); will-change: transform, opacity;
}
.reveal-up { transform: translateY(30px); }
.reveal-left { transform: translateY(30px); }
.reveal-right { transform: translateY(30px); }
.reveal-scale { transform: scale(0.96); }
.reveal-up.in, .reveal-left.in, .reveal-right.in, .reveal-scale.in { opacity: 1; transform: translateY(0) scale(1); }
.delay-1 { transition-delay: 0.15s !important; }
.delay-2 { transition-delay: 0.35s !important; }
.delay-3 { transition-delay: 0.55s !important; }

/* Grid */
.grid-2col { display: grid; gap: var(--gap); }
@media (min-width: 1024px) {
  .grid-2col { grid-template-columns: 1fr 1fr; align-items: center; }
  .grid-2col.zigzag-flip > .col-demo { order: 2; }
  .grid-2col.zigzag-flip > .col-copy { order: 1; }
}
@media (min-width: 1440px) { .grid-2col { gap: 64px; } }
@media (min-width: 1920px) { .grid-2col { gap: 80px; } }

/* Mobile/desktop */
.mobile-only { display: block; }
.desktop-only { display: none; }
@media (min-width: 1024px) { .mobile-only { display: none; } .desktop-only { display: block; } }

/* Section spacing */
.section { padding: var(--sec-pad) 0; }
.section + .section { border-top: 1px solid rgba(26,39,68,0.06); }
.section-title {
  font-size: clamp(1.8rem, 5vw, 2.8rem); font-weight: 800; color: var(--navy);
  text-align: center; margin-bottom: 12px; line-height: 1.2;
}
.section-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.2rem); color: var(--gray);
  text-align: center; max-width: 600px; margin: 0 auto 40px;
}

/* Buttons */
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  gap: 8px; padding: 14px 28px; border-radius: var(--radius-button);
  font-weight: 600; font-size: 1rem; border: none;
  transition: all 0.25s ease; text-align: center;
  box-shadow: ${s.button};
}
.btn-primary { background: var(--navy); color: var(--white); }
.btn-primary:hover { background: var(--navy-light); transform: translateY(-2px); box-shadow: ${s.button_hover}; }
.btn-accent { background: var(--orange); color: var(--white); }
.btn-accent:hover { background: var(--orange-light); transform: translateY(-2px); box-shadow: ${s.accent_hover}; }
.btn-secondary { background: var(--light-gray); color: var(--navy); box-shadow: 0 2px 6px rgba(0,0,0,0.06); }
.btn-secondary:hover { background: #dee2e6; transform: translateY(-1px); box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
.btn-full { width: 100%; }
.btn-lg { padding: 16px 32px; font-size: 1.1rem; }

/* Top bar */
.top-bar { background: var(--navy); padding: 10px 0; display: none; }
.top-bar-inner { display: flex; justify-content: space-between; align-items: center; }
.top-bar-social { display: flex; gap: 16px; }
.top-bar-social a { color: var(--white); opacity: 0.8; }
.top-bar-social a:hover { opacity: 1; }

/* Logo */
.logo { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 1.25rem; color: var(--navy); }
.logo-icon {
  width: 38px; height: 38px; background: var(--navy);
  border-radius: var(--radius-icon); display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 700; font-size: 1rem;
}
.nav-actions { display: flex; align-items: center; gap: 10px; }
.nav-btn {
  padding: 10px 16px; border-radius: var(--radius-icon); font-weight: 600;
  font-size: 0.9rem; display: inline-flex; align-items: center; gap: 6px; transition: all 0.3s;
}
.nav-btn-text { background: var(--navy); color: var(--white); }
.nav-btn-text:hover { background: var(--navy-light); transform: translateY(-1px); }
.nav-btn-call { background: var(--orange); color: var(--white); }
.nav-btn-call:hover { background: var(--orange-light); transform: translateY(-1px); }

/* Hero */
.hero {
  position: relative; min-height: 70vh;
  display: flex; align-items: center; justify-content: center;
  text-align: center; overflow: hidden; background: var(--off-white);
}
.hero-bg { position: absolute; inset: 0; z-index: 0; }
.hero-bg img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.2; }
.hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.4) 100%); z-index: 1; }
.hero-content { position: relative; z-index: 2; max-width: 800px; padding: 0 20px; }
.hero h1 { font-size: clamp(2.2rem, 6vw, 3.8rem); font-weight: 800; color: var(--navy); line-height: 1.1; margin-bottom: 20px; }
.hero p { font-size: clamp(1.1rem, 3vw, 1.4rem); color: var(--gray); margin-bottom: 32px; font-weight: 400; }
.hero-btns { display: flex; flex-direction: column; gap: 12px; align-items: center; }

/* Service showcase */
.col-demo img { width: 100%; height: 100%; min-height: 280px; object-fit: cover; border-radius: var(--radius-image); display: block; }
.col-copy h2 { font-size: var(--t-h2); font-weight: 800; color: var(--navy); margin-bottom: 12px; line-height: 1.2; }
.col-copy .tagline { font-size: var(--t-body); font-style: italic; color: var(--navy); opacity: 0.85; margin-bottom: 16px; display: block; }
.col-copy p { font-size: var(--t-body); color: var(--text); line-height: 1.7; margin-bottom: 16px; }
.col-copy .locations { font-size: var(--t-body); color: var(--text); margin-bottom: 24px; display: block; }

/* Process */
.process-grid { display: grid; grid-template-columns: 1fr; gap: var(--gap); margin-top: 40px; }
@media (min-width: 744px) { .process-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .process-grid { grid-template-columns: repeat(5, 1fr); } }
.process-card { text-align: left; background: var(--white); border-radius: var(--radius-card); padding: 20px; box-shadow: var(--shadow); }
.process-icon { width: 100%; aspect-ratio: 4/3; background: var(--off-white); border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
.process-icon svg { width: 64px; height: 64px; color: var(--navy); }
.process-card h3 { font-size: var(--t-h3); font-weight: 700; color: var(--navy); margin-bottom: 8px; line-height: 1.3; }
.process-card p { font-size: var(--t-small); color: var(--gray); line-height: 1.6; }

/* Features */
.features-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; max-width: 600px; margin: 0 auto; }
@media (min-width: 744px) { .features-grid { grid-template-columns: repeat(4, 1fr); max-width: none; } }
.feature-box { background: var(--white); border-radius: var(--radius-card); padding: 28px 16px; text-align: center; box-shadow: var(--shadow); transition: transform 0.3s, box-shadow 0.3s; }
.feature-box:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
.feature-icon { width: 60px; height: 60px; background: var(--off-white); border-radius: 14px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: var(--navy); }
.feature-icon svg { width: 28px; height: 28px; stroke-width: 1.8; }
.feature-box h4 { font-size: 0.95rem; font-weight: 700; color: var(--navy); line-height: 1.3; }

/* Areas */
.areas-content { max-width: 700px; margin: 0 auto; text-align: center; }
.areas-content > p { font-size: 1.05rem; color: var(--text); margin-bottom: 32px; line-height: 1.7; }
.areas-list { display: grid; grid-template-columns: 1fr; gap: 10px; text-align: left; max-width: 400px; margin: 0 auto; }
@media (min-width: 744px) { .areas-list { grid-template-columns: repeat(2, 1fr); max-width: 600px; } }
.area-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: var(--off-white); border-radius: 10px; font-weight: 500; color: var(--navy); transition: all 0.3s; }
.area-item:hover { background: var(--navy); color: var(--white); transform: translateX(4px); }
.area-item svg { width: 18px; height: 18px; color: var(--orange); flex-shrink: 0; }

/* Before/After */
.ba-slider-grid { display: grid; grid-template-columns: 1fr; gap: 32px; }
@media (min-width: 744px) { .ba-slider-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .ba-slider-grid { grid-template-columns: repeat(3, 1fr); } }
.ba-slider-wrap { position: relative; width: 100%; border-radius: var(--radius-image); overflow: hidden; box-shadow: var(--shadow); background: var(--light-gray); user-select: none; touch-action: pan-y; }
.ba-slider-wrap img, .ba-slider-wrap .ba-img-fill { display: block; width: 100%; height: auto; pointer-events: none; }
.ba-after { position: absolute; top: 0; left: 0; right: 0; bottom: 0; overflow: hidden; clip-path: inset(0 50% 0 0); }
.ba-after img, .ba-after .ba-img-fill { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
.ba-before .ba-img-fill { width: 100%; height: auto; display: block; }
.ba-handle { position: absolute; top: 0; bottom: 0; left: 50%; width: 44px; transform: translateX(-50%); cursor: ew-resize; z-index: 10; display: flex; align-items: center; justify-content: center; }
.ba-handle-line { position: absolute; top: 0; bottom: 0; left: 50%; width: 3px; background: var(--white); transform: translateX(-50%); box-shadow: 0 0 8px rgba(0,0,0,0.3); }
.ba-handle-knob { position: relative; width: 44px; height: 44px; background: var(--white); border-radius: 50%; box-shadow: 0 2px 12px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; z-index: 2; }
.ba-handle-knob svg { width: 18px; height: 18px; color: var(--navy); }
.ba-label { position: absolute; top: 16px; padding: 6px 14px; border-radius: 6px; font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; z-index: 5; pointer-events: none; }
.ba-label-before { left: 16px; background: rgba(26,39,68,0.85); color: var(--white); }
.ba-label-after { right: 16px; background: var(--orange); color: var(--white); }
.ba-img-fill { min-height: 280px; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 1rem; }
.ba-img-fill.before-fill { background: linear-gradient(135deg, #adb5bd 0%, #868e96 100%); color: var(--white); }
.ba-img-fill.after-fill { background: linear-gradient(135deg, #e67e22 0%, #f39c12 100%); color: var(--white); }

/* Testimonials */
.testimonials-wrap { position: relative; }
.testimonials-scroll { overflow-x: auto; overflow-y: hidden; -webkit-overflow-scrolling: touch; scrollbar-width: none; -ms-overflow-style: none; margin: 0 -20px; padding: 10px 20px 20px; scroll-snap-type: x mandatory; }
.testimonials-scroll::-webkit-scrollbar { display: none; }
.testimonials-track { display: flex; gap: 20px; width: max-content; }
.testimonial-card { flex: 0 0 85vw; max-width: 360px; background: var(--off-white); border-radius: var(--radius-card); padding: 32px 24px; text-align: center; scroll-snap-align: center; box-shadow: var(--shadow); }
@media (min-width: 744px) { .testimonials-scroll { margin: 0; padding: 10px 0 20px; } .testimonial-card { flex: 0 0 320px; max-width: 320px; } }
.testimonial-text { font-size: clamp(1rem, 2.8vw, 1.15rem); font-style: italic; color: var(--navy); line-height: 1.7; margin-bottom: 24px; position: relative; }
.testimonial-text::before { content: '"'; font-size: 3.5rem; color: var(--orange); opacity: 0.3; position: absolute; top: -18px; left: -6px; font-family: Georgia, serif; line-height: 1; }
.testimonial-author { font-weight: 700; color: var(--navy); font-size: 1.05rem; }
.testimonial-location { color: var(--gray); font-size: 0.9rem; margin-top: 4px; }
.testimonials-dots { display: flex; justify-content: center; gap: 8px; margin-top: 8px; }
.testimonials-dots .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--light-gray); transition: background 0.3s, transform 0.3s; }
.testimonials-dots .dot.active { background: var(--orange); transform: scale(1.2); }
.testimonial-nav { display: none; }
@media (min-width: 1024px) {
  .testimonial-nav { display: flex; position: absolute; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; background: var(--white); border-radius: 50%; align-items: center; justify-content: center; box-shadow: var(--shadow); z-index: 10; cursor: pointer; transition: background 0.3s, transform 0.3s; color: var(--navy); }
  .testimonial-nav:hover { background: var(--off-white); transform: translateY(-50%) scale(1.1); }
  .testimonial-nav svg { width: 20px; height: 20px; }
  .testimonial-nav.prev { left: -22px; }
  .testimonial-nav.next { right: -22px; }
}

/* FAQ */
.faq-list { max-width: 800px; margin: 0 auto; }
.faq-item { background: var(--white); border-radius: 12px; margin-bottom: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.faq-question { width: 100%; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; background: none; border: none; font-family: inherit; font-size: 1.05rem; font-weight: 600; color: var(--navy); text-align: left; cursor: pointer; transition: background 0.3s; }
.faq-question:hover { background: rgba(26,39,68,0.02); }
.faq-question svg { width: 22px; height: 22px; color: var(--navy); flex-shrink: 0; margin-left: 12px; transition: transform 0.3s; }
.faq-item.active .faq-question svg { transform: rotate(180deg); }
.faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.4s ease, padding 0.4s ease; }
.faq-item.active .faq-answer { max-height: 300px; }
.faq-answer-inner { padding: 0 24px 20px; color: var(--text); line-height: 1.7; font-size: 0.95rem; }

/* CTA */
.cta-section { background: var(--navy); color: var(--white); text-align: center; padding: 60px 20px; }
.cta-section h2 { font-size: clamp(1.6rem, 4vw, 2.2rem); font-weight: 700; margin-bottom: 12px; }
.cta-section p { opacity: 0.85; margin-bottom: 28px; font-size: 1.05rem; }

/* Footer */
.footer { background: var(--navy); color: var(--white); padding: 40px 0 100px; text-align: center; }
.footer-logo { font-weight: 800; font-size: 1.3rem; margin-bottom: 12px; }
.footer p { opacity: 0.7; font-size: 0.9rem; }
.footer-copy { margin-top: 16px; font-size: 0.8rem; opacity: 0.5; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(17,26,46,0.6); backdrop-filter: blur(4px); z-index: 2000; display: none; justify-content: center; opacity: 0; transition: opacity 0.3s; padding-top: 80px; }
.modal-overlay.active { display: flex; opacity: 1; }
.modal { background: var(--white); width: 100%; max-width: 420px; max-height: calc(100vh - 100px); overflow-y: auto; border-radius: 0 0 16px 16px; padding: 20px 22px 24px; transform: translateY(-30px); opacity: 0; transition: transform 0.35s cubic-bezier(0.32,0.72,0,1), opacity 0.3s ease; box-shadow: var(--shadow-lg); }
.modal-overlay.active .modal { transform: translateY(0); opacity: 1; }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.modal-header h3 { font-size: 1.4rem; font-weight: 700; color: var(--navy); }
.modal-close { background: var(--off-white); border: none; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--navy); transition: background 0.3s; }
.modal-close:hover { background: var(--light-gray); }
.form-group { margin-bottom: 12px; }
.form-group label { display: block; font-size: 0.85rem; font-weight: 600; color: var(--navy); margin-bottom: 5px; }
.form-group input, .form-group textarea { width: 100%; padding: 10px 12px; border: 2px solid var(--light-gray); border-radius: var(--radius-input); font-family: inherit; font-size: 1rem; color: var(--text); transition: border-color 0.3s; background: var(--white); -webkit-appearance: none; }
.form-group input:focus, .form-group textarea:focus { outline: none; border-color: var(--navy); }
.form-group textarea { min-height: 80px; resize: vertical; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 8px; }

/* Mobile bottom bar */
.mobile-bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; z-index: 1500; background: var(--white); box-shadow: 0 -4px 20px rgba(0,0,0,0.1); padding: 12px 16px calc(12px + env(safe-area-inset-bottom)); display: block; }
.mobile-menu-toggle { width: 100%; background: var(--navy); color: var(--white); border: none; padding: 14px; border-radius: 10px; font-family: inherit; font-size: 1rem; font-weight: 600; display: flex; align-items: center; justify-content: center; transition: background 0.3s; }
.mobile-menu-toggle:hover { background: var(--navy-light); }
.mobile-dropdown-wrapper { position: absolute; bottom: calc(100% + 10px); left: 16px; right: 16px; pointer-events: none; opacity: 0; transform: translateY(10px); transition: opacity 0.25s ease, transform 0.25s ease; }
.mobile-dropdown-wrapper.active { pointer-events: auto; opacity: 1; transform: translateY(0); }
.mobile-dropdown { background: var(--white); border-radius: 16px; box-shadow: var(--shadow-lg); overflow: hidden; }
.mobile-dropdown a { display: flex; align-items: center; gap: 14px; padding: 16px 20px; font-weight: 600; color: var(--navy); border-bottom: 1px solid var(--light-gray); transition: background 0.2s; font-size: 1rem; }
.mobile-dropdown a:last-child { border-bottom: none; }
.mobile-dropdown a:hover { background: var(--off-white); }
.mobile-dropdown a svg { width: 20px; height: 20px; color: var(--orange); flex-shrink: 0; }

${kf}
${ac}
${animConfig.enabled ? '' : '* { animation: none !important; transition: none !important; }'}

@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }

@media (min-width: 744px) {
  :root { --container-w: 90%; --container-pad: 0; --t-display: 72px; --t-h1: 48px; --t-h2: 30px; --t-h3: 24px; --t-body: 17px; --t-meta: 18px; --t-small: 13px; --nav-h: 64px; --sec-pad: 48px; --gap: 20px; }
  body { padding-bottom: 0; }
  .hero-btns { flex-direction: row; justify-content: center; }
  .top-bar { display: block; }
  .modal { max-width: 640px; padding: 24px 32px 32px; }
  .form-group textarea { min-height: 160px; }
  .mobile-bottom-bar { display: none; }
  .footer { padding-bottom: 40px; }
}

@media (min-width: 1024px) {
  :root { --container-w: 960px; --t-display: 92px; --t-h1: 56px; --t-h2: 34px; --t-h3: 26px; --t-body: 18px; --t-meta: 20px; --t-small: 14px; --nav-h: 72px; --sec-pad: 64px; --gap: 24px; }
  .hero { min-height: 80vh; }
  .modal { max-width: 840px; padding: 32px 40px 40px; }
  .form-group textarea { min-height: 240px; }
}

@media (min-width: 1440px) {
  :root { --container-w: 1100px; --t-display: 112px; --t-h1: 64px; --t-h2: 38px; --t-h3: 28px; --t-body: 19px; --t-meta: 22px; --t-small: 14px; --nav-h: 80px; --sec-pad: 72px; --gap: 28px; }
}

@media (min-width: 1920px) {
  :root { --container-w: 1280px; --t-display: 128px; --t-h1: 72px; --t-h2: 42px; --t-h3: 30px; --t-body: 20px; --t-meta: 24px; --t-small: 15px; --nav-h: 80px; --sec-pad: 80px; --gap: 32px; }
}
`;

  fs.writeFileSync(path.join(APP_DIR, 'globals.css'), css);
  console.log('✓ app/globals.css written');
}

generateCSS();

// STEP 8: INJECT FONT
const layoutPath = path.join(APP_DIR, 'layout.js');
let layoutContent = fs.readFileSync(layoutPath, 'utf8');
const fontUrl = theme.fonts.url || '';
if (fontUrl && !fontUrl.startsWith('/')) {
  if (layoutContent.includes('FONT_URL_PLACEHOLDER')) {
    layoutContent = layoutContent.replace('FONT_URL_PLACEHOLDER', `<link rel="stylesheet" href="${fontUrl}" />`);
  } else {
    layoutContent = layoutContent.replace('<head>', `<head>\n      <link rel="stylesheet" href="${fontUrl}" />`);
  }
  fs.writeFileSync(layoutPath, layoutContent);
  console.log('✓ Font injected');
}

// STEP 9: ZIP CLIENT OUTPUT
const zipName = business.business.name.toLowerCase().replace(/\s+/g, '-') + '-website.zip';
const zipPath = path.join(process.cwd(), zipName);
if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
const include = ['app', 'components', 'lib', 'data', 'public', 'next.config.js', 'package.json', 'README.md'];
const cmd = `zip -r "${zipPath}" ${include.join(' ')}`;
try { execSync(cmd, { stdio: 'inherit' }); console.log(`✓ Zip: ${zipName}`); }
catch (e) { console.warn('Zip command failed. Files remain in place.'); }

console.log('\n=== GENERATE COMPLETE ===');
console.log(`Services: ${Object.keys(servicesData).length}`);
console.log(`Suburbs: ${Object.keys(suburbsData).length}`);
console.log(`Testimonials: ${(parsed.global.testimonials || []).length}`);
console.log(`FAQ: ${(parsed.global.faq || []).length}`);
console.log(`Process steps: ${(parsed.global.process || []).length}`);
console.log(`Features: ${(parsed.global.features || []).length}`);
console.log(`Before/After: ${(parsed.global.before_after || []).length}`);
