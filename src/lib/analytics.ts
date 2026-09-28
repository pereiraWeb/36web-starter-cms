import { getConsent, onConsentChange, type StoredConsent } from './consent';
import { integrations } from '../config/integrations';

/**
 * Standard events used across the site. Keep this list as the single source
 * of truth for event names — add new ones here rather than inventing
 * ad-hoc strings at the call site.
 */
export type AnalyticsEventName = 'form_submit' | 'whatsapp_click' | 'phone_click' | 'email_click' | 'cta_click';

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  /**
   * Extra context for the event. NEVER put personal data here (names,
   * emails, phone numbers, message content, addresses...) — this is sent to
   * third-party analytics/ads platforms. `sanitizeParams` below also strips
   * obvious email-like or long-digit values as a defensive last resort, but
   * it is not a substitute for not sending PII in the first place.
   */
  params?: Record<string, string | number | boolean>;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & {
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[];
      loaded?: boolean;
      version?: string;
      push?: unknown;
    };
    _fbq?: Window['fbq'];
  }
}

/**
 * IDs come from `src/config/integrations.ts`, which reads them from
 * `import.meta.env` — never hardcoded here. Leave any of them unset (in
 * `.env`) to simply not load that integration.
 */
const GA_MEASUREMENT_ID = integrations.analytics.gaMeasurementId;
const GOOGLE_ADS_ID = integrations.analytics.googleAdsId;
const META_PIXEL_ID = integrations.analytics.metaPixelId;

/**
 * Analytics/ads scripts never load in `astro dev` or `astro preview` by
 * default, so local work never pollutes real production data. Set
 * `PUBLIC_ANALYTICS_DEBUG=true` in `.env` to force-enable them for local
 * testing of the integrations themselves.
 */
const ANALYTICS_ENABLED = import.meta.env.PROD || integrations.analytics.debugEnabled;

let gtagScriptRequested = false;
let ga4Initialized = false;
let googleAdsInitialized = false;
let metaPixelInitialized = false;
let autoTrackingAttached = false;

function ensureGtagJs(id: string): void {
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
  }
  window.gtag('js', new Date());
  if (gtagScriptRequested) return;
  gtagScriptRequested = true;
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);
}

/** Loaded only once analytics consent is granted — never before. */
function loadGoogleAnalytics(): void {
  if (ga4Initialized || !GA_MEASUREMENT_ID) return;
  ensureGtagJs(GA_MEASUREMENT_ID);
  window.gtag?.('config', GA_MEASUREMENT_ID, { anonymize_ip: true });
  ga4Initialized = true;
}

/** Loaded only once marketing consent is granted — never before. */
function loadGoogleAds(): void {
  if (googleAdsInitialized || !GOOGLE_ADS_ID) return;
  ensureGtagJs(GOOGLE_ADS_ID);
  window.gtag?.('config', GOOGLE_ADS_ID);
  googleAdsInitialized = true;
}

/** Loaded only once marketing consent is granted — never before. Standard Meta Pixel bootstrap snippet. */
function loadMetaPixel(): void {
  if (metaPixelInitialized || !META_PIXEL_ID) return;
  metaPixelInitialized = true;

  const fbq: NonNullable<Window['fbq']> = function (...args: unknown[]) {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
    } else {
      fbq.queue?.push(args);
    }
  };
  if (!window._fbq) window._fbq = fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  window.fbq = fbq;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);

  window.fbq('init', META_PIXEL_ID);
  window.fbq('track', 'PageView');
}

function applyConsentState(state: StoredConsent | null): void {
  if (!ANALYTICS_ENABLED || !state) return;
  if (state.categories.analytics) loadGoogleAnalytics();
  if (state.categories.marketing) {
    loadGoogleAds();
    loadMetaPixel();
  }
}

/**
 * Auto-tracks the most common outbound interactions site-wide, without
 * requiring every component to import `trackEvent` itself: `tel:` links →
 * `phone_click`, `mailto:` links → `email_click`, WhatsApp deep links
 * (`wa.me`, used by `WhatsappButton` and the header/footer icon links) →
 * `whatsapp_click`. Any element with `data-track-event="..."` (optionally
 * `data-track-label="..."`) fires that named event instead — see the
 * `track`/`trackLabel` props on `Button.astro`.
 */
function attachAutoTracking(): void {
  if (autoTrackingAttached) return;
  autoTrackingAttached = true;

  document.addEventListener('click', (event) => {
    const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(
      'a[href^="tel:"], a[href^="mailto:"], a[href*="wa.me"], [data-track-event]',
    );
    if (!target) return;

    const trackName = target.dataset.trackEvent as AnalyticsEventName | undefined;
    if (trackName) {
      trackEvent({
        name: trackName,
        params: target.dataset.trackLabel ? { label: target.dataset.trackLabel } : undefined,
      });
      return;
    }

    const href = target.getAttribute('href') ?? '';
    if (href.startsWith('tel:')) trackEvent({ name: 'phone_click' });
    else if (href.startsWith('mailto:')) trackEvent({ name: 'email_click' });
    else if (href.includes('wa.me')) trackEvent({ name: 'whatsapp_click' });
  });
}

/**
 * Call once, client-side, to wire everything up: consent-gated
 * GA4/Google Ads/Meta Pixel loading (immediately if consent already exists,
 * and reactively whenever it changes later) plus the auto-tracked link
 * clicks above. Already called from `BusinessLayout.astro` — no need to call
 * it again from individual pages.
 */
export function initAnalytics(): void {
  if (typeof window === 'undefined') return;
  attachAutoTracking();
  applyConsentState(getConsent());
  onConsentChange(applyConsentState);
}

function sanitizeParams(params?: AnalyticsEvent['params']): Record<string, string | number | boolean> | undefined {
  if (!params) return undefined;
  const emailLike = /[^\s@]+@[^\s@]+\.[^\s@]+/;
  const longDigits = /\d{6,}/;
  const clean: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'string' && (emailLike.test(value) || longDigits.test(value))) continue;
    clean[key] = value;
  }
  return clean;
}

/**
 * Single entry point the whole site uses to report an interaction —
 * `form_submit`, `whatsapp_click`, `phone_click`, `email_click`, `cta_click`.
 * Never fires anything (not even in dev) until the visitor has granted
 * analytics consent; the Meta Pixel additionally requires marketing consent.
 * See `src/lib/consent.ts`.
 */
export function trackEvent(event: AnalyticsEvent): void {
  const state = getConsent();
  const params = sanitizeParams(event.params);
  const analyticsAllowed = ANALYTICS_ENABLED && Boolean(state?.categories.analytics);

  if (import.meta.env.DEV) {
    console.log('[analytics]', analyticsAllowed ? event.name : `${event.name} (blocked: no analytics consent)`, params ?? {});
  }

  if (!analyticsAllowed || !state) return;

  if (ga4Initialized) window.gtag?.('event', event.name, params);
  if (state.categories.marketing && metaPixelInitialized) window.fbq?.('trackCustom', event.name, params);
}
