export interface TextImageContent {
  eyebrow: string;
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  /** Any valid CSS length (e.g. "100vh", "600px", "auto"). */
  height: string;
}

/**
 * Editable copy and layout defaults for `src/components/media/TextImage.astro`.
 * Update the strings below to customize this section without touching any
 * component markup or logic.
 */
export const textImageContent: TextImageContent = {
  eyebrow: 'Featured',
  title: 'A closer look at what we do',
  description:
    'Pair a strong visual with a short message. Use this section anywhere you need to highlight a project, a feature or a moment of your story.',
  ctaText: 'Learn more',
  ctaHref: '/about',
  height: '100vh',
};
