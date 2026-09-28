export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  { question: 'What services do you offer?', answer: 'See the Services section above for an overview of everything we can help you with.' },
  { question: 'How can I contact you?', answer: 'Use the contact form or the details on the Contact page and we will get back to you shortly.' },
  { question: 'How long does a typical project take?', answer: 'It depends on scope, but most projects are delivered within a few weeks of kickoff.' },
  { question: 'Do you offer ongoing support?', answer: 'Yes, we offer maintenance and support plans after your project goes live.' },
];

export interface FaqContentConfig {
  accordion: { eyebrow?: string; title: string; description?: string };
  twoColumn: { eyebrow?: string; title: string; description?: string };
  cards: { eyebrow?: string; title: string; description?: string };
  split: { eyebrow?: string; title: string; description: string; ctaText: string; ctaHref: string };
  minimal: { title: string; description?: string };
}

/**
 * Editable copy for every component in `src/components/faq/`.
 * The `faqs` list above is shared across all variants.
 */
export const faqContent: FaqContentConfig = {
  accordion: {
    title: 'Frequently Asked Questions',
  },
  twoColumn: {
    eyebrow: 'FAQ',
    title: 'Common questions',
  },
  cards: {
    eyebrow: 'FAQ',
    title: 'Answers to common questions',
  },
  split: {
    eyebrow: 'FAQ',
    title: 'Still have questions?',
    description: "We're happy to walk you through anything that isn't covered here.",
    ctaText: 'Contact us',
    ctaHref: '/contact',
  },
  minimal: {
    title: 'Frequently Asked Questions',
  },
};
