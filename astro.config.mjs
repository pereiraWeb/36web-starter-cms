// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { business } from './src/config/business.ts';
import { getConfigIssues } from './src/lib/configCheck.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const demosDir = path.join(__dirname, 'src/pages/demos');
const hiddenDemosDir = path.join(__dirname, 'src/pages/_demos');

/**
 * Fails `astro build` (production builds, including on Vercel) if
 * `src/config/business.ts` still has starter placeholder values — e.g. the
 * default "Business Name" or "https://example.com". This never runs during
 * `astro dev`/`astro preview` (the `astro:build:start` hook only fires for
 * `astro build`), so it can't get in the way of local development.
 *
 * Set `SKIP_CONFIG_GUARD=true` to bypass intentionally, e.g. for a
 * staging/demo deploy that's meant to still show placeholder data.
 */
function productionConfigGuard() {
  return {
    name: 'production-config-guard',
    hooks: {
      'astro:build:start': () => {
        if (process.env.SKIP_CONFIG_GUARD === 'true') return;

        const issues = getConfigIssues();
        if (issues.length === 0) return;

        const details = issues.map((issue) => `  - ${issue.field}: ${issue.message}`).join('\n');
        throw new Error(
          `\nProduction build blocked: src/config/business.ts still has starter placeholder values:\n${details}\n\n` +
            'Fix these before publishing, or set SKIP_CONFIG_GUARD=true to bypass on purpose (e.g. a staging/demo build).\n',
        );
      },
    },
  };
}

/**
 * Keeps `src/pages/demos/` out of production builds by renaming the folder
 * to `_demos` (Astro ignores underscore-prefixed paths) before routes are
 * discovered, then restoring it afterwards. That way unused gallery-only
 * component variants never enter the production bundle — their CSS/JS is
 * only pulled in by pages that import them, and without the demo pages
 * those imports simply aren't in the graph.
 *
 * Always available during `astro dev`. Set `INCLUDE_DEMOS=true` to also
 * keep them in a build (e.g. a staging deploy that still needs the gallery).
 * Restores on `astro:build:done` and on process exit so an interrupted
 * build can't leave the folder permanently renamed.
 */
function excludeDemosInProduction() {
  let renamed = false;

  const restore = () => {
    if (!renamed) return;
    if (fs.existsSync(hiddenDemosDir) && !fs.existsSync(demosDir)) {
      fs.renameSync(hiddenDemosDir, demosDir);
    }
    renamed = false;
  };

  return {
    name: 'exclude-demos-in-production',
    hooks: {
      /** @param {{ command: 'dev' | 'build' | 'preview' | 'sync'; logger: { info: (msg: string) => void; warn: (msg: string) => void } }} opts */
      'astro:config:setup': ({ command, logger }) => {
        // Recover from a previous interrupted build that left the folder renamed.
        if (fs.existsSync(hiddenDemosDir) && !fs.existsSync(demosDir)) {
          fs.renameSync(hiddenDemosDir, demosDir);
          logger.info('Restored src/pages/demos/ left behind by an interrupted build.');
        }

        if (command !== 'build') return;
        if (process.env.INCLUDE_DEMOS === 'true') {
          logger.info('INCLUDE_DEMOS=true — keeping src/pages/demos/ in this build.');
          return;
        }
        if (!fs.existsSync(demosDir)) return;
        if (fs.existsSync(hiddenDemosDir)) {
          logger.warn('src/pages/_demos/ already exists — leaving demos as-is.');
          return;
        }
        fs.renameSync(demosDir, hiddenDemosDir);
        renamed = true;
        process.once('exit', restore);
        logger.info(
          'Excluded src/pages/demos/ from this production build (set INCLUDE_DEMOS=true to keep them).',
        );
      },
      'astro:build:done': () => {
        restore();
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  // Single source of truth for the production domain — reused for the
  // canonical URLs built in `src/lib/seo.ts`, the sitemap below, and
  // absolute URLs in JSON-LD (`Breadcrumbs.astro`, `*Schema.astro`). Change
  // it in `src/config/business.ts` (`siteUrl`), never here.
  site: business.siteUrl,

  // The site stays fully static except for on-demand routes that opt out of
  // prerendering (e.g. `src/pages/api/contact.ts`), which the Vercel adapter
  // renders on request as a serverless function.
  output: 'static',
  adapter: vercel(),

  // Canonical URLs never have a trailing slash (see `getSeoMeta` in
  // `src/lib/seo.ts`) — enforce the same policy at the routing level so
  // every internal link, redirect and generated page agrees with them.
  trailingSlash: 'never',

  build: {
    // Astro's default ("auto") only inlines a page's CSS into the HTML when
    // it's under ~4kb, and externalizes it (a separate render-blocking
    // `<link>` request) above that. This site's *entire* combined CSS is
    // still just a few dozen KB, so "always" inlining it removes that extra
    // request/round-trip on every page — measurably faster First Contentful
    // Paint (verified with Lighthouse; see README section 16). The
    // trade-off is that pages can no longer share one cached external
    // stylesheet across navigations — a bad trade for a large app with
    // many repeat page views per session, but a good one here: a small
    // marketing site where most sessions only ever view a handful of pages.
    inlineStylesheets: 'always',
  },

  // Add entries here whenever a page's slug changes after going live, so old
  // links/bookmarks/search results 301 to the new URL instead of 404ing —
  // e.g. `'/services/old-slug': '/services/new-slug'`. Astro turns these
  // into real redirects at build time.
  redirects: {},

  integrations: [
    sitemap({
      // Keep internal/dev-only routes out of the sitemap even if someone
      // forgets to delete `src/pages/demos/` before launching, and out of
      // the conversion-tracking `/thank-you` page (it's not content to rank).
      filter: (page) => !page.includes('/demos') && !page.includes('/thank-you'),
    }),
    excludeDemosInProduction(),
    productionConfigGuard(),
  ],
});
