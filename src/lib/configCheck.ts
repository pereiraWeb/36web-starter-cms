import { business } from '../config/business';

export interface ConfigIssue {
  field: string;
  message: string;
}

/**
 * Starter placeholder values that must never reach a real production
 * deploy. Each check compares against the exact default shipped in
 * `src/config/business.ts` — if you've genuinely changed a field to
 * something else (even another placeholder-looking value), it won't match
 * and won't block the build.
 */
const PLACEHOLDER_CHECKS: Array<{ field: string; isPlaceholder: () => boolean; message: string }> = [
  {
    field: 'business.siteUrl',
    isPlaceholder: () => business.siteUrl === 'https://example.com',
    message: 'still the "https://example.com" placeholder — set your real domain (used by the sitemap, robots.txt, canonical URLs and structured data).',
  },
  {
    field: 'business.name',
    isPlaceholder: () => business.name === 'Business Name',
    message: 'still the "Business Name" placeholder — set your real business name.',
  },
  {
    field: 'business.legalName',
    isPlaceholder: () => business.legalName === 'Business Name S.L.',
    message: 'still the placeholder legal name — set your real registered company name.',
  },
  {
    field: 'business.email',
    isPlaceholder: () => business.email === 'info@example.com',
    message: 'still the "info@example.com" placeholder — set your real contact email.',
  },
  {
    field: 'business.address',
    isPlaceholder: () => business.address.street === 'Main Street 123' && business.address.city === 'City',
    message:
      'still the placeholder street/city — set your real business address, or remove `LocalBusinessSchema` from `src/pages/index.astro` if this business has no physical location.',
  },
];

/** Returns every unresolved starter placeholder found in `business.ts`. Empty array means the config looks production-ready. */
export function getConfigIssues(): ConfigIssue[] {
  return PLACEHOLDER_CHECKS.filter((check) => check.isPlaceholder()).map(({ field, message }) => ({ field, message }));
}
