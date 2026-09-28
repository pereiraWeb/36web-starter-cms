/**
 * Single source of truth for the fallback images used across the site,
 * shown whenever a config entry (a team member, a testimonial, a service...)
 * doesn't provide its own picture. Previously this same string was
 * hand-duplicated as a local `FALLBACK_IMAGE` constant in ~8 different
 * components — centralized here so there's one place to swap the bundled
 * placeholder for your own, and so `ResponsiveImage`'s runtime `onerror`
 * fallback (see `src/lib/imageFallback.ts`) always resolves to the same file.
 */
export const imageFallbacks = {
	/**
	 * Generic content photo — used by cards, team, testimonials, hero
	 * split/text-image whenever no real photo is configured. Replace
	 * `public/img/fallback.webp` with your own placeholder/stock photo.
	 */
	photo: '/img/fallback.webp',
	/**
	 * Used only as a last-resort *runtime* fallback if a configured
	 * `business.logo`/`business.logoDark` file 404s or fails to decode — not
	 * shown when no logo is configured at all (see `BrandMark.astro`, which
	 * renders the business name as text in that case instead). A crisp SVG,
	 * not a raster image, so it never looks pixelated at any header/footer
	 * size and never becomes the "huge PNG in the header" problem itself.
	 */
	logo: '/logos/logo-fallback.svg',
} as const;
