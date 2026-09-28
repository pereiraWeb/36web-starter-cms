export interface Service {
  /** URL-friendly identifier used for the individual service page (`/services/{slug}`). */
  slug: string;
  title: string;
  description: string;
  icon?: string;
  image?: string;
  /** Longer copy shown on the individual service page. */
  content?: string;
  /** Bullet points shown on the individual service page. */
  features?: string[];
}

export const services: Service[] = [
  {
    slug: 'service-one',
    title: 'Service One',
    description: 'Short description of the first service offered.',
    icon: '1',
    image: '/img/fallback.webp',
    content:
      'A more detailed explanation of what this service includes, who it is for, and the outcomes a client can expect from working with us on it.',
    features: [
      'Tailored to your needs',
      'Clear timelines and pricing',
      'Dedicated support throughout',
    ],
  },
  {
    slug: 'service-two',
    title: 'Service Two',
    description: 'Short description of the second service offered.',
    icon: '2',
    image: '/img/fallback.webp',
    content:
      'A more detailed explanation of what this service includes, who it is for, and the outcomes a client can expect from working with us on it.',
    features: [
      'Tailored to your needs',
      'Clear timelines and pricing',
      'Dedicated support throughout',
    ],
  },
  {
    slug: 'service-three',
    title: 'Service Three',
    description: 'Short description of the third service offered.',
    icon: '3',
    image: '/img/fallback.webp',
    content:
      'A more detailed explanation of what this service includes, who it is for, and the outcomes a client can expect from working with us on it.',
    features: [
      'Tailored to your needs',
      'Clear timelines and pricing',
      'Dedicated support throughout',
    ],
  },
  {
    slug: 'service-four',
    title: 'Service Four',
    description: 'Short description of the third service offered.',
    icon: '4',
    image: '/img/fallback.webp',
    content:
      'A more detailed explanation of what this service includes, who it is for, and the outcomes a client can expect from working with us on it.',
    features: [
      'Tailored to your needs',
      'Clear timelines and pricing',
      'Dedicated support throughout',
    ],
  },
  {
    slug: 'service-five',
    title: 'Service Five',
    description: 'Short description of the third service offered.',
    icon: '5',
    image: '/img/fallback.webp',
    content:
      'A more detailed explanation of what this service includes, who it is for, and the outcomes a client can expect from working with us on it.',
    features: [
      'Tailored to your needs',
      'Clear timelines and pricing',
      'Dedicated support throughout',
    ],
  },
  {
    slug: 'service-six',
    title: 'Service Six',
    description: 'Short description of the third service offered.',
    icon: '6',
    image: '/img/fallback.webp',
    content:
      'A more detailed explanation of what this service includes, who it is for, and the outcomes a client can expect from working with us on it.',
    features: [
      'Tailored to your needs',
      'Clear timelines and pricing',
      'Dedicated support throughout',
    ],
  },
];

/** Builds the URL for a service's individual page. */
export function getServiceHref(service: Pick<Service, 'slug'>): string {
  return `/services/${service.slug}`;
}

export interface ServicesContentConfig {
  grid: { eyebrow?: string; title: string; description?: string };
  icon: { eyebrow?: string; title: string; description?: string };
  split: {
    eyebrow?: string;
    title: string;
    description: string;
    ctaText: string;
    ctaHref: string;
  };
  showcase: {
    eyebrow?: string;
    title: string;
    description?: string;
    ctaText: string;
    ctaHref: string;
  };
  list: { eyebrow?: string; title: string; description?: string };
  /** Copy shared by every individual service page (`/services/[slug]`). */
  single: { backText: string; ctaText: string; ctaHref: string };
}

/**
 * Editable copy for every component in `src/components/services/`.
 * The `services` list above is shared across all variants.
 */
export const servicesContent: ServicesContentConfig = {
  grid: {
    title: 'Our Services',
  },
  icon: {
    eyebrow: 'What we do',
    title: 'Services built around your goals',
  },
  split: {
    eyebrow: 'Our Services',
    title: 'Everything you need, in one place',
    description:
      'A quick overview of what we can help you with. Get in touch to discuss which service fits your needs best.',
    ctaText: 'Discuss your project',
    ctaHref: '/contact',
  },
  showcase: {
    eyebrow: 'Services',
    title: 'A closer look at what we offer',
    ctaText: 'Learn more',
    ctaHref: '/contact',
  },
  list: {
    title: 'Our Services',
  },
  single: {
    backText: 'All services',
    ctaText: 'Get in touch',
    ctaHref: '/contact',
  },
};
