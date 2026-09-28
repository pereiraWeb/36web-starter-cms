import { cookieConsentContent } from '../config/cookieConsentContent';

/** The two toggleable categories. `necessary` is always granted and is never stored explicitly. */
export type ConsentCategory = 'analytics' | 'marketing';

export interface ConsentCategoryState {
  analytics: boolean;
  marketing: boolean;
}

export interface StoredConsent {
  /** Matched against `cookieConsentContent.version`; a mismatch is treated as "no choice made yet". */
  version: string;
  /** ISO timestamp of when this choice was saved. */
  timestamp: string;
  categories: ConsentCategoryState;
}

const STORAGE_KEY = 'cookie-consent';
const CONSENT_UPDATED_EVENT = 'consent:updated';
const OPEN_PREFERENCES_EVENT = 'consent:open-preferences';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function readStorage(): StoredConsent | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredConsent> | null;
    if (!parsed || parsed.version !== cookieConsentContent.version || !parsed.categories) {
      return null;
    }
    return {
      version: parsed.version,
      timestamp: parsed.timestamp ?? new Date().toISOString(),
      categories: {
        analytics: Boolean(parsed.categories.analytics),
        marketing: Boolean(parsed.categories.marketing),
      },
    };
  } catch {
    return null;
  }
}

function writeStorage(categories: ConsentCategoryState): StoredConsent {
  const stored: StoredConsent = {
    version: cookieConsentContent.version,
    timestamp: new Date().toISOString(),
    categories,
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    /* localStorage unavailable (e.g. private browsing) — consent still applies for this page load via the dispatched event below. */
  }
  window.dispatchEvent(new CustomEvent<StoredConsent>(CONSENT_UPDATED_EVENT, { detail: stored }));
  return stored;
}

/** The visitor's current stored choice, or `null` if they haven't decided yet (or the stored version is stale). */
export function getConsent(): StoredConsent | null {
  return readStorage();
}

/** Whether a given toggleable category is currently granted. `necessary` is always implicitly granted. */
export function hasConsent(category: ConsentCategory): boolean {
  return readStorage()?.categories[category] ?? false;
}

/** Whether the visitor has made (and stored) any choice at all for the current consent version. */
export function hasStoredChoice(): boolean {
  return readStorage() !== null;
}

/** Saves an explicit choice for both toggleable categories and notifies every listener (banner, gates, analytics). */
export function setConsent(categories: ConsentCategoryState): StoredConsent {
  return writeStorage(categories);
}

export function acceptAll(): StoredConsent {
  return writeStorage({ analytics: true, marketing: true });
}

export function rejectAll(): StoredConsent {
  return writeStorage({ analytics: false, marketing: false });
}

/** Subscribes to consent changes (banner choice, preferences save, or an inline `ConsentGate` accept). Returns an unsubscribe function. */
export function onConsentChange(callback: (state: StoredConsent) => void): () => void {
  if (!isBrowser()) return () => {};
  const handler = (event: Event) => callback((event as CustomEvent<StoredConsent>).detail);
  window.addEventListener(CONSENT_UPDATED_EVENT, handler);
  return () => window.removeEventListener(CONSENT_UPDATED_EVENT, handler);
}

/** Requests the preferences panel to open — used by the permanent "manage cookies" link (see `navigation.ts`'s `cookiePreferencesHref`). */
export function openConsentPreferences(): void {
  if (!isBrowser()) return;
  window.dispatchEvent(new CustomEvent(OPEN_PREFERENCES_EVENT));
}

/** `CookieConsent.astro` listens for this to open its preferences panel on demand. Returns an unsubscribe function. */
export function onOpenConsentPreferences(callback: () => void): () => void {
  if (!isBrowser()) return () => {};
  window.addEventListener(OPEN_PREFERENCES_EVENT, callback);
  return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, callback);
}
