# Style Guide

This is the lookup table for every CSS class in `app/globals.css`. When
something visual needs changing on the live site, you (or an AI agent)
should be able to fix it with **just** these two files:

- `app/globals.css` (the design system)
- This file (what each class controls)

If a fix needs anything beyond editing `globals.css`, the bug is
structural and belongs in a component, not the stylesheet.

---

## How to fix common issues

| Issue                                   | Edit in `globals.css`             |
|-----------------------------------------|-----------------------------------|
| All buttons too plain                   | `.btn-primary`, `.btn-accent`     |
| Brand colours wrong                     | `:root` `--navy`, `--orange`      |
| Page background flat                    | `:root` `--bg-gradient`           |
| Cards look identical and boring         | `.card`, `.card-shadowed`         |
| Hover effects too subtle                | `.card-hover:hover`               |
| Text on dark sections unreadable        | `.section-dark`, `.cta-banner`    |
| Sections too cramped vertically         | `:root` `--sec-pad`               |
| Headings too small                      | `:root` `--t-h1`, `--t-h2`        |
| Body text too tight                     | `:root` `--leading-relaxed`       |
| Hero photo too washed out               | `.hero-bg img` opacity            |
| Hero photo too dark                     | `.hero-overlay` background        |
| Nav too tall                            | `.nav-inner` padding              |
| Footer too plain                        | `.footer`, `.footer-logo`         |
| Mobile bottom bar in the way            | `body` `padding-bottom` (mobile)  |
| Service grid wrong number of columns    | brief change, not CSS — see below |
| FAQ doesn't expand                      | structural, not CSS — see notes   |

For "service grid wrong columns": that's controlled by
`config/layout.json` → `service_links.columns`. Re-run `npm run generate`.

---

## The Token System (`:root`)

These are the values everything else references. Change one and the
whole site updates.

### Brand colours

```
--navy             primary brand, dark sections, headings, primary buttons
--navy-light       hover state of navy elements
--navy-dark        topbar background, hero text-on-dark
--orange           accent colour, CTAs, links on hover, highlights
--orange-light     softer accent variant
--orange-dark      hover state of orange elements
```

These are the **only** colours the site should use for brand. If you
need a new accent, add it here, don't sprinkle hex codes in components.

### Neutrals

```
--white            cards, modals, nav background
--off-white        page background base
--cream            warm gradient stop
--gray-50          subtle section backgrounds
--gray-100         card borders
--gray-200         stronger borders
--gray-500         muted body text, captions
--gray-700         secondary headings
--gray-900         body text
```

### Semantic aliases

These point at neutrals. Edit these to swap the meaning without renaming
everything.

```
--bg, --surface, --surface-alt, --text, --text-muted,
--text-on-dark, --text-on-dark-muted, --border, --border-strong
```

### Type

```
--font-body, --font-heading      typeface families
--t-h1, --t-h2, --t-h3            responsive heading sizes (clamp)
--t-body, --t-small, --t-tiny     body sizes
--leading-tight | snug | normal | relaxed   line-heights
```

### Spacing

`--sp-1` through `--sp-9` — 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 px.

`--sec-pad` — vertical padding inside every `.section` (clamp).
`--gap`, `--gap-sm`, `--gap-lg` — grid gap presets.

### Layout

`--container-max` 1280, `--container-narrow` 800, `--container-wide` 1440.

### Borders, shadows, motion

```
--radius-sm, --radius, --radius-card, --radius-lg, --radius-pill
--shadow-xs, --shadow-sm, --shadow, --shadow-lg, --shadow-xl
--ease, --ease-out, --dur-fast (0.15s), --dur (0.3s), --dur-slow (0.5s)
```

---

## Layout Classes

| Class                | What it does |
|----------------------|--------------|
| `.container`         | Max-width 1280, centered, with horizontal padding. Use as the inner wrapper of a `.section`. |
| `.container-narrow`  | Same as container but capped at 800px. Use for body-copy paragraphs. |
| `.container-wide`    | Capped at 1440 for very wide layouts. |
| `.section`           | Vertical band with `--sec-pad` top/bottom. Every page section uses this. |
| `.section-alt`       | Section with `--surface-alt` (gray-50) background. |
| `.section-tinted`    | Section with very faint navy tint background. |
| `.section-cream`     | Section with warm cream background. |
| `.section-dark`      | Section with navy background and white text. Headings + paragraphs auto-invert. |
| `.section-accent`    | Section with orange background and white text. |
| `.section-title`     | Centered h2-sized heading inside a section. |
| `.section-subtitle`  | Centered grey lead paragraph below a `.section-title`. |
| `.card-grid`         | Display: grid + gap. Pair with `.cols-N`. |
| `.cols-1` / `.cols-2` / `.cols-3` / `.cols-4` | Grid column count. Auto-collapses to 1 on mobile, 2 on tablet (for cols-3/4). |
| `.split-2`           | Two equal columns side-by-side, used for image+text rows. |
| `.split-2.flip`      | Reverses the order (image right, text left). |
| `.prose`             | Centered narrow text column for body paragraphs. Includes default `p` margins. |
| `.prose .muted`      | Greyer paragraph text inside `.prose`. |

---

## Primitives

### Buttons

Always use `.btn` + a variant. Add `.btn-lg` or `.btn-sm` to resize.

| Class             | Look                                            | When to use |
|-------------------|-------------------------------------------------|-------------|
| `.btn-primary`    | Solid navy, white text                          | Primary action on light bg |
| `.btn-accent`     | Solid orange, white text                        | High-conversion CTAs |
| `.btn-outline`    | Transparent with navy outline                   | Secondary action |
| `.btn-ghost`      | Transparent, hover-tint                         | Tertiary, in-text actions |

On `.section-dark` and `.cta-banner` backgrounds, `.btn-primary` automatically
inverts to white-with-navy-text so it stays visible. You don't have to think
about it.

### Cards

Always use `.card` + a style variant. Add `.card-hover` if it's clickable.

| Class               | Look                                       |
|---------------------|--------------------------------------------|
| `.card`             | Base: white bg, padding, rounded.          |
| `.card-bordered`    | + 1px border                               |
| `.card-shadowed`    | + drop shadow                              |
| `.card-flat`        | Flat grey-tinted bg, no border             |
| `.card-minimal`     | Transparent, just bottom border (list-style) |
| `.card-hover`       | Lift + orange border on hover              |
| `.card-link`        | Display block, color inherits (for `<a>` cards) |

Inside a `.card`, `<h3>` and `<p>` get sensible defaults — don't restyle.

---

## Component Sections

### Nav (`.top-bar`, `.nav-outer`, `.nav-dropdown-menu`, etc.)

Top-bar (dark navy strip with social + tagline) sits above the main nav.
Main nav is sticky, white background. Services dropdown opens on hover (desktop)
or click (mobile). Edit `.nav-dropdown-menu` to change dropdown card style.

### Hero (`.hero`, `.hero-bg`, `.hero-overlay`, `.hero-content`)

Background image at 55% opacity, white gradient overlay so text stays
readable. To darken the photo: bump `.hero-bg img` opacity higher and
`.hero-overlay` background lower opacity.

### CTA Banner (`.cta-banner`)

Dark navy mid-page band. White heading, muted-white paragraph, accent
button. **All text colours are explicitly set so no parent stylesheet
can override them and produce dark-on-dark text.** Don't remove these
explicit `color: var(--text-on-dark)` rules.

### Disclaimer Banner (`.disclaimer-banner`)

Orange strip at the top of service pages. Only renders when
`site.disclaimer` is non-empty in `01-business.json`.

### Footer (`.footer`)

Dark navy band, centered text, business name + standard footer copy.

### Mobile Bottom Bar (`.mobile-bottom-bar`)

Sticky at bottom of viewport on mobile only (hidden ≥768px). Edit the
icons + labels in `components/MobileBottomBar.js`, restyle here.

---

## Patterns (high-level reusable section content)

| Pattern               | Class root             | Used on |
|-----------------------|------------------------|---------|
| Authority cards       | `.authority-section`   | service pages |
| Why-choose cards      | `.why-choose-section`  | service pages |
| Scope list (✓ items)  | `.scope-list-wrap` + `.scope-list` | service pages |
| Areas list (suburbs)  | `.areas-list` + `.area-item` | service pages, future areas page |
| Service link cards    | `.service-links` (uses .card-grid + .card) | suburb pages |
| Service showcase row  | `.service-showcase` + `.split-2` | homepage |
| Process steps         | `.process-grid` + `.process-card` | homepage, suburb pages |
| Features grid         | `.feature-grid` + `.feature-box` | homepage |
| Testimonials carousel | `.testimonials-wrap` + `.testimonial-card` | homepage, suburb pages |
| FAQ                   | `.faq-list` + `.faq-item` + `.faq-question` + `.faq-answer` | homepage, suburb pages |
| Before/after slider   | `.ba-slider-wrap` + `.ba-slider` | homepage |

Authority + why-choose + service-links + features all use the **same
`.card` primitive**, so changing `.card-bordered` instantly updates all
four sections everywhere they appear. This is intentional — visual
cohesion across pages.

---

## Animations (`.reveal-up`, `.delay-N`)

Add `.reveal-up` to anything that should fade in on scroll. Add
`.delay-1` through `.delay-4` to stagger them. The IntersectionObserver
in `PageHero.js` handles triggering — you don't need to do anything in JS.

To disable animations site-wide, set `:root { --dur: 0s; --dur-fast: 0s; }`
or remove the `.reveal-up` classes from components.

---

## Responsive Breakpoints

| Range           | What changes |
|-----------------|--------------|
| ≤ 768px         | All multi-col grids → 1 column. Hero shorter. Buttons full-width. Mobile bottom bar visible. |
| 769–1023px      | `.cols-3` and `.cols-4` → 2 columns. Desktop nav appears. |
| ≥ 1024px        | Full desktop layout. Hero buttons inline. |

To change a breakpoint, edit the `@media` queries near the bottom of
`globals.css`. Three breakpoints is enough — don't add more without a
real reason.

---

## What NOT to do

- **Don't add inline `style={{...}}` to components** for visual choices.
  All visual concerns belong in `globals.css`. Only keep inline styles
  for runtime-dynamic values (drag positions, scroll progress, etc.).
- **Don't introduce new colour hex codes in components.** Add a token to
  `:root` and reference it.
- **Don't create one-off classes for one-off problems.** If a card should
  look different on the homepage vs a service page, the answer is usually
  "they should look the same" — visual cohesion across pages is the goal.
- **Don't change `.card` padding to fix a spacing issue on one page.**
  That ripples everywhere. Use the `.section` wrapper or grid `gap` instead.

---

## When the agent gets stuck

If a CSS-only fix isn't producing the right result, the issue is
probably one of:

1. **The class isn't actually on the element.** Open the relevant
   component in `components/` and add it.
2. **A parent class is overriding via specificity.** Add the change at
   the same specificity level (e.g. `.section-dark .your-class` instead
   of just `.your-class`).
3. **A token is being read from the wrong place.** Check the `:root`
   block — the variable might be aliased to something unexpected.
4. **The change works locally but Vercel hasn't redeployed.** Check the
   build log on Vercel.

If none of those apply, the fix needs structural changes in a component
or template — that's beyond what this guide covers, escalate to a
developer or the engine operator.
