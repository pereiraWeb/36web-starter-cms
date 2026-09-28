/**
 * Central place for third-party integration IDs read from `import.meta.env`
 * at build time — analytics, ads, maps, etc. Keeping them here instead of
 * scattered `import.meta.env.PUBLIC_...` reads across `src/lib/` means
 * there's a single file to check when wiring a new provider, or auditing
 * which external services a given build actually includes.
 *
 * All of these are optional: leave a field unset (don't add the matching
 * `PUBLIC_...` variable to `.env`) to simply not load that integration —
 * see `.env.example` for the full list and `README.md` section 6 for how to
 * obtain each ID.
 *
 * Server-only secrets (e.g. `RESEND_API_KEY`) are intentionally NOT here —
 * they must be read from `process.env` at request time, not
 * `import.meta.env` at build time (see the comment in `src/lib/email.ts`),
 * so they stay in that file instead.
 */
export interface IntegrationsConfig {
  analytics: {
    /** Google Analytics 4 measurement ID, e.g. `"G-XXXXXXXXXX"`. */
    gaMeasurementId?: string;
    /** Google Ads conversion ID, e.g. `"AW-XXXXXXXXX"`. */
    googleAdsId?: string;
    /** Meta (Facebook/Instagram) Pixel ID. */
    metaPixelId?: string;
    /** Force-enable analytics in `astro dev`/`astro preview`, for testing only — see `src/lib/analytics.ts`. */
    debugEnabled: boolean;
  };
  maps: {
    /**
     * Used by `src/components/media/MapEmbed.astro` to call the official
     * Google Maps Embed API instead of the free, keyless `google.com/maps`
     * embed. Optional — without it, `MapEmbed` still works via the keyless
     * embed, just without an officially supported API behind it.
     */
    googleMapsApiKey?: string;
  };
}

export const integrations: IntegrationsConfig = {
  analytics: {
    gaMeasurementId: import.meta.env.PUBLIC_GA_MEASUREMENT_ID,
    googleAdsId: import.meta.env.PUBLIC_GOOGLE_ADS_ID,
    metaPixelId: import.meta.env.PUBLIC_META_PIXEL_ID,
    debugEnabled: import.meta.env.PUBLIC_ANALYTICS_DEBUG === 'true',
  },
  maps: {
    googleMapsApiKey: import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY,
  },
};
