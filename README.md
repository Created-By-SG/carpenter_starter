# Starter Carpenter - Astro Site

This project uses the painter starter architecture with the visual direction from the original `carpenter_premium` static HTML.

## Architecture

- `src/data/business.json` is the shared business config.
- `src/data/services.json` drives service listing and dynamic service pages.
- `src/data/suburbs.json` drives suburb/location pages.
- Build and QA mobile first. Navigation, cards, CTAs, footer links, and effect modules should be designed for phone screens before desktop refinements.
- `src/components/effects/` keeps the stable effect slot/module system from painter.
- Shared toolbox files live outside website projects at `C:\Users\sam_g\Desktop\Codex\1_tools`.
- Do not keep a `toolbox/` folder in client website projects. Copy chosen toolbox code into the matching slot file under `src/components/effects/`.
- `legacy-static/` stores the original static carpenter HTML reference.

## Visual Source

The carpenter look is preserved through:

- `public/css/carpenter.css`
- `public/js/carpenter.js`
- `public/images/` copied from the original carpenter design
- carpenter-specific components in `src/components/carpenter/`

## Production TODO

- Replace lightweight service/suburb seed copy with full client content.
- Replace demo reviews with real TrustIndex/Google review data.
- Replace demo phone, email, address, GMB URL and schema fields.
- Connect the quote form to the real client lead destination.
- Move admin lockout/session state to Vercel KV or Upstash before using admin in production.
- Set `ADMIN_PIN`, `ADMIN_SESSION_SECRET`, `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`, and `GITHUB_BRANCH` in Vercel if using the admin dashboard.
- Keep `node_modules/`, `.tools/`, `.vercel/`, `.astro/`, `dist/`, logs, and `.env*` out of Git.

## Commands

```bash
npm run dev
npm run build
npm run preview
```
