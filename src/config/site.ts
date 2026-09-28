/**
 * Whether the `/demos` gallery pages (and the "Demos" nav item) should be
 * available. Always on during `astro dev`. During `astro build` they're off
 * by default so unused variant components/scripts never ship in the
 * production bundle — set `INCLUDE_DEMOS=true` to keep them (e.g. a staging
 * deploy that still needs the gallery). See README section 16.
 *
 * Server-side only (`process.env`) on purpose: this flag is read by
 * `astro.config.mjs` at build time *and* by `navigation.ts` at page-render
 * time. A `PUBLIC_*` var would also work for the nav, but would expose the
 * flag to the browser for no benefit.
 */
export const includeDemos =
  import.meta.env.DEV || process.env.INCLUDE_DEMOS === 'true';
