export interface FooterContentConfig {
  columns: { companyHeading: string; linksHeading: string; contactHeading: string };
  cta: { title: string; description?: string; ctaText: string; ctaHref: string };
}

/** Editable copy for every component in `src/components/footer/`. */
export const footerContent: FooterContentConfig = {
  columns: {
    companyHeading: 'Company',
    linksHeading: 'Links',
    contactHeading: 'Contact',
  },
  cta: {
    title: 'Ready to get started?',
    description: "Let's talk about how we can help your business grow.",
    ctaText: 'Get in touch',
    ctaHref: '/contact',
  },
};
