import type { APIRoute } from 'astro';
import { business } from '../config/business';

export const prerender = true;

/**
 * Web app manifest, generated from `business.ts` so the name/description
 * always match the rest of the site. Only ships an SVG icon out of the box
 * (`public/favicon.svg`) — for full home-screen/PWA support, generate real
 * PNG icons (192×192 and 512×512 at minimum) from your logo, drop them in
 * `public/icons/`, and add them to the `icons` array below.
 */
export const GET: APIRoute = () => {
	const manifest = {
		name: business.name,
		short_name: business.name,
		description: business.description,
		start_url: '/',
		display: 'standalone',
		background_color: '#ffffff',
		// Keep in sync with `--color-primary` in `src/styles/tokens.css`.
		theme_color: '#0d9488',
		icons: [
			{
				src: '/favicon.svg',
				sizes: 'any',
				type: 'image/svg+xml',
				purpose: 'any',
			},
		],
	};

	return new Response(JSON.stringify(manifest, null, 2), {
		headers: { 'Content-Type': 'application/manifest+json' },
	});
};
