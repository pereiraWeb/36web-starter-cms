import { business } from '../config/business';
import { seoDefaults } from '../config/seo';

/** `og:locale` uses the underscore form (e.g. `es_ES`); `<html lang>` and `hreflang` use the hyphen form (e.g. `es-ES`). Derived from the single `business.language` so they can never drift apart. */
export const OG_LOCALE = business.language.replace('-', '_');

export interface SeoImage {
  /** Root-relative or absolute URL. Root-relative is resolved against `business.siteUrl`. */
  src: string;
  width?: number;
  height?: number;
  alt?: string;
}

/** Default share image used whenever a page doesn't provide its own — see `src/config/seo.ts` to change it. */
export const DEFAULT_OG_IMAGE: Required<SeoImage> = {
  ...seoDefaults.defaultImage,
  alt: business.name,
};

export interface SeoProps {
  title: string;
  description?: string;
  /**
   * Overrides the auto-computed canonical URL. Rarely needed — by default
   * every page's canonical is derived from its own real URL (see
   * `getSeoMeta`), which is correct for the vast majority of pages. Only set
   * this for genuine exceptions, e.g. a page that's a duplicate/alternate
   * view of another and should canonicalize to it instead of itself.
   */
  canonical?: string;
  /** Keeps this page out of search results (e.g. `/thank-you`, `/demos/*`). Defaults to `false`. */
  noindex?: boolean;
  /** Rarely needed on its own — usually only combined with `noindex`. Defaults to `false`. */
  nofollow?: boolean;
  /** Open Graph/Twitter share image. Defaults to `DEFAULT_OG_IMAGE`. */
  image?: SeoImage;
  /** Open Graph type. Defaults to `seoDefaults.defaultOgType`. */
  type?: 'website' | 'article' | 'profile';
}

export interface SeoMeta {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  image: Required<SeoImage> & { mimeType: string };
  type: string;
  locale: string;
  siteName: string;
  language: string;
}

/** Strips the query string/hash and any trailing slash (except the root `/`) so the same page never produces two different canonical URLs. */
function normalizePathname(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname || '/';
}

function toAbsoluteUrl(pathOrUrl: string): string {
  return new URL(pathOrUrl, business.siteUrl).toString();
}

function guessImageMimeType(src: string): string {
  const extension = src.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'gif':
      return 'image/gif';
    case 'svg':
      return 'image/svg+xml';
    case 'webp':
    default:
      return 'image/webp';
  }
}

/**
 * Builds every piece of per-page SEO metadata `SeoHead.astro` needs.
 * `pageUrl` should be Astro's own `Astro.url` — the canonical is derived
 * from its real `pathname`, never hardcoded to the homepage, and never
 * carries over query params or a trailing slash.
 */
export function getSeoMeta(pageUrl: URL, props: SeoProps): SeoMeta {
  const { title, description, canonical, noindex = false, nofollow = false, image, type = seoDefaults.defaultOgType } = props;

  const canonicalPath = canonical ? new URL(canonical, business.siteUrl).pathname : normalizePathname(pageUrl.pathname);
  const canonicalUrl = toAbsoluteUrl(normalizePathname(canonicalPath));

  const resolvedImage: SeoImage = {
    src: image?.src ?? DEFAULT_OG_IMAGE.src,
    width: image?.width ?? DEFAULT_OG_IMAGE.width,
    height: image?.height ?? DEFAULT_OG_IMAGE.height,
    alt: image?.alt ?? DEFAULT_OG_IMAGE.alt,
  };

  return {
    title: `${title} ${seoDefaults.titleSeparator} ${business.name}`,
    description: description ?? business.description,
    canonical: canonicalUrl,
    robots: [noindex ? 'noindex' : 'index', nofollow ? 'nofollow' : 'follow'].join(', '),
    image: {
      src: toAbsoluteUrl(resolvedImage.src),
      width: resolvedImage.width ?? DEFAULT_OG_IMAGE.width,
      height: resolvedImage.height ?? DEFAULT_OG_IMAGE.height,
      alt: resolvedImage.alt ?? DEFAULT_OG_IMAGE.alt,
      mimeType: guessImageMimeType(resolvedImage.src),
    },
    type,
    locale: OG_LOCALE,
    siteName: business.name,
    language: business.language,
  };
}
