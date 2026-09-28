export interface HeaderContentConfig {
  cta: { ctaText: string; ctaHref: string };
  minimal: { linkText: string; linkHref: string };
  topBar: { message: string };
}

/** Editable copy for every component in `src/components/header/`. */
export const headerContent: HeaderContentConfig = {
  cta: {
    ctaText: 'Get in touch',
    ctaHref: '/contact',
  },
  minimal: {
    linkText: 'Contact',
    linkHref: '/contact',
  },
  topBar: {
    message: 'Available for new projects',
  },
};
