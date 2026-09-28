export interface CtaContentConfig {
  centered: {
    eyebrow?: string;
    title: string;
    description?: string;
    ctaText: string;
    ctaHref: string;
    secondaryCtaText?: string;
    secondaryCtaHref?: string;
    /** Any valid CSS length (e.g. "auto", "320px", "50vh"). */
    height: string;
  };
  split: {
    eyebrow?: string;
    title: string;
    description?: string;
    ctaText: string;
    ctaHref: string;
    /** Any valid CSS length (e.g. "auto", "320px", "50vh"). */
    height: string;
  };
  boxed: {
    eyebrow?: string;
    title: string;
    description?: string;
    ctaText: string;
    ctaHref: string;
    secondaryCtaText?: string;
    secondaryCtaHref?: string;
    /** Any valid CSS length (e.g. "auto", "320px", "50vh"). */
    height: string;
  };
}

/** Editable copy for every component in `src/components/cta/`. */
export const ctaContent: CtaContentConfig = {
  centered: {
    eyebrow: 'Get started',
    title: 'Ready to grow your business?',
    description: "Let's talk about how we can help you reach your goals.",
    ctaText: 'Get in touch',
    ctaHref: '/contact',
    secondaryCtaText: 'View services',
    secondaryCtaHref: '/services',
    height: 'auto',
  },
  split: {
    eyebrow: 'Have a project in mind?',
    title: "Let's build something great together",
    description: 'Tell us about your project and we will get back to you within one business day.',
    ctaText: 'Contact us',
    ctaHref: '/contact',
    height: 'auto',
  },
  boxed: {
    eyebrow: "Let's work together",
    title: 'Start your project today',
    description: 'Reach out and get a free, no-obligation consultation with our team.',
    ctaText: 'Request a quote',
    ctaHref: '/contact',
    secondaryCtaText: 'Learn more',
    secondaryCtaHref: '/about',
    height: 'auto',
  },
};
