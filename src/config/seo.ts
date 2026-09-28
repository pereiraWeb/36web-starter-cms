/**
 * Technical SEO defaults — separate from `business.ts` (company identity)
 * on purpose: this file holds presentation/format defaults for search
 * engines and social networks, not facts about the business itself. Used by
 * `src/lib/seo.ts`, which does the actual per-page computation.
 */
export interface SeoDefaultsConfig {
  /** Separator between a page's own title and the business name, e.g. `"Services | Business Name"`. */
  titleSeparator: string;
  /** Open Graph type used when a page doesn't specify its own. */
  defaultOgType: 'website' | 'article' | 'profile';
  /** Twitter/X card type — `"summary_large_image"` shows a big image preview, `"summary"` a small square one. */
  twitterCard: 'summary' | 'summary_large_image';
  /**
   * Share image used when a page doesn't provide its own `image` prop.
   * Replace `public/social-images/social-default.webp` with a real brand
   * image — ideally at this same 1200×630 size, the standard Open Graph
   * dimensions — rather than changing the path here.
   */
  defaultImage: {
    src: string;
    width: number;
    height: number;
  };
}

export const seoDefaults: SeoDefaultsConfig = {
  titleSeparator: '|',
  defaultOgType: 'website',
  twitterCard: 'summary_large_image',
  defaultImage: {
    src: '/social-images/social-default.webp',
    width: 1200,
    height: 630,
  },
};
