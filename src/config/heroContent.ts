export interface HeroStat {
  value: string;
  label: string;
}

export interface HeroCenteredContent {
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaHref: string;
  height: string;
}

export interface HeroSplitContent {
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaHref: string;
  height: string;
}

export interface HeroBackgroundContent {
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaHref: string;
  height: string;
}

export interface HeroMinimalContent {
  tag: string;
  ctaText: string;
  ctaHref: string;
  highlights: string[];
  height: string;
}

export interface HeroFeaturesContent {
  ctaText: string;
  ctaHref: string;
  stats: HeroStat[];
  height: string;
}

export interface HeroContentConfig {
  centered: HeroCenteredContent;
  split: HeroSplitContent;
  background: HeroBackgroundContent;
  minimal: HeroMinimalContent;
  features: HeroFeaturesContent;
}

/**
 * Editable copy and layout defaults for every component in `src/components/hero/`.
 * Update the strings below to customize CTAs, labels, highlights and stats
 * without touching any component markup or logic. `height` accepts any valid
 * CSS length (e.g. "auto", "480px", "70vh").
 */
export const heroContent: HeroContentConfig = {
  centered: {
    primaryCtaText: 'Get in touch',
    primaryCtaHref: '/contact',
    secondaryCtaHref: '#',
    height: 'auto',
  },
  split: {
    primaryCtaText: 'Get started',
    primaryCtaHref: '/contact',
    secondaryCtaHref: '#',
    height: 'auto',
  },
  background: {
    primaryCtaText: 'Get in touch',
    primaryCtaHref: '/contact',
    secondaryCtaHref: '#',
    height: 'min(70vh, 640px)',
  },
  minimal: {
    tag: 'New',
    ctaText: 'Learn more',
    ctaHref: '/about',
    highlights: ['Fast setup', 'No commitment', 'Cancel anytime'],
    height: 'auto',
  },
  features: {
    ctaText: 'Get in touch',
    ctaHref: '/contact',
    stats: [
      { value: '10+', label: 'Years of experience' },
      { value: '250+', label: 'Projects delivered' },
      { value: '98%', label: 'Client satisfaction' },
    ],
    height: 'auto',
  },
};
