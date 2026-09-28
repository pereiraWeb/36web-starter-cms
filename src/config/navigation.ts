import { includeDemos } from './site';

export interface NavItem {
  label: string;
  href: string;
  /** Optional dropdown items rendered as a submenu under this item. */
  children?: NavItem[];
}

export const demoNavigation: NavItem[] = [
  { label: 'Centered Hero', href: '/demos/centered-hero' },
  { label: 'Split Hero', href: '/demos/split-hero' },
  { label: 'Background Hero', href: '/demos/background-hero' },
  { label: 'Minimal Hero', href: '/demos/minimal-hero' },
  { label: 'Stats Hero', href: '/demos/features-hero' },
  { label: 'Team Spotlight', href: '/demos/team-spotlight' },
  { label: 'Testimonials Wall', href: '/demos/testimonials-wall' },
  { label: 'FAQ Focus', href: '/demos/faq-focused' },
  { label: 'Contact Cards', href: '/demos/contact-cards' },
  { label: 'Component Gallery', href: '/demos/component-gallery' },
];

/**
 * Main nav used by every header variant. The "Demos" dropdown is only
 * included when `includeDemos` is true (local `astro dev`, or a build with
 * `INCLUDE_DEMOS=true`) — so a production deploy never links to gallery
 * pages that aren't even built. See README section 16.
 */
export const mainNavigation: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
  ...(includeDemos ? [{ label: 'Demos', href: '/demos', children: demoNavigation }] : []),
];

/** Canonical legal routes, reused wherever a legal page is linked (e.g. `ConsentCheckbox`'s privacy policy link). */
export const legalRoutes = {
  legalNotice: '/legal/legal-notice',
  privacy: '/legal/privacy',
  cookies: '/legal/cookies',
} as const;

/**
 * Not a real page — every footer variant renders this as a plain link, and
 * `CookieConsent.astro` listens (via event delegation) for clicks on
 * `a[href="#cookie-preferences"]` anywhere on the page and opens its
 * preferences panel instead of navigating. This is the "permanent link to
 * change or withdraw consent" required by GDPR/ePrivacy — always reachable,
 * regardless of which footer variant a page uses.
 */
export const cookiePreferencesHref = '#cookie-preferences';

export const legalNavigation: NavItem[] = [
  { label: 'Aviso legal', href: legalRoutes.legalNotice },
  { label: 'Política de privacidad', href: legalRoutes.privacy },
  { label: 'Política de cookies', href: legalRoutes.cookies },
  { label: 'Gestionar cookies', href: cookiePreferencesHref },
];
