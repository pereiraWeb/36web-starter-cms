import type { APIRoute } from 'astro';
import { business } from '../config/business';

export const prerender = true;

/**
 * Generated from `business.siteUrl` so the sitemap URL is always correct
 * without hand-editing a static file. Disallows the contact API, the Tina
 * editor (`/admin`), the visual-editing refresh route, the demo pages and
 * the `/thank-you` conversion page.
 */
export const GET: APIRoute = () => {
	const body = `User-agent: *
Disallow: /api/
Disallow: /admin
Disallow: /tina-island
Disallow: /demos
Disallow: /thank-you

Sitemap: ${new URL('/sitemap-index.xml', business.siteUrl).toString()}
`;

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
