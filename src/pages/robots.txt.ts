import type { APIRoute } from 'astro';
import { business } from '../config/business';

export const prerender = true;

/**
 * Generated from `business.siteUrl` so the sitemap URL is always correct
 * without hand-editing a static file. Disallows the internal API route and
 * the demo pages (which should be deleted before launch anyway, but are
 * blocked here as a safety net) and the `/thank-you` conversion page (not
 * content worth ranking).
 */
export const GET: APIRoute = () => {
	const body = `User-agent: *
Disallow: /api/
Disallow: /demos
Disallow: /thank-you

Sitemap: ${new URL('/sitemap-index.xml', business.siteUrl).toString()}
`;

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
