import type { APIRoute } from 'astro';
import business from '../data/business.json';
import services from '../data/services.json';
import suburbs from '../data/suburbs.json';

const staticRoutes = ['/', '/services/', '/suburbs/', '/contact/', '/legal/'];

export const GET: APIRoute = () => {
  const urls = [
    ...staticRoutes,
    ...Object.keys(services).map((slug) => `/services/${slug}/`),
    ...Object.keys(suburbs).map((slug) => `/suburbs/${slug}/`),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((path) => `  <url><loc>${business.domain}${path}</loc></url>`).join('\n')}\n</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
