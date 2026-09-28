export interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
  rating?: number;
  featured?: boolean;
}

export const testimonials: Testimonial[] = [
  {
    quote: 'A great experience working with this team. They understood exactly what we needed.',
    author: 'Client A',
    role: 'CEO, Company A',
    rating: 5,
    featured: true,
  },
  { quote: 'Professional and reliable service from start to finish.', author: 'Client B', role: 'Founder, Company B', rating: 5 },
  { quote: 'Clear communication and great results, would recommend.', author: 'Client C', role: 'Manager, Company C', rating: 4 },
];

export interface TestimonialsContentConfig {
  grid: { eyebrow?: string; title: string; description?: string };
  centered: { eyebrow?: string; title?: string };
  split: { eyebrow?: string; title: string; description: string; statValue: string; statLabel: string };
  wall: { eyebrow?: string; title: string; description?: string };
  minimal: { title: string; description?: string };
}

/**
 * Editable copy for every component in `src/components/testimonials/`.
 * The `testimonials` list above is shared across all variants; set
 * `featured: true` on one entry to highlight it in `TestimonialsCentered`.
 */
export const testimonialsContent: TestimonialsContentConfig = {
  grid: {
    title: 'What Our Clients Say',
  },
  centered: {
    eyebrow: 'Testimonials',
  },
  split: {
    eyebrow: 'Testimonials',
    title: 'Trusted by people like you',
    description: 'We measure success by the results our clients get and the relationships we build along the way.',
    statValue: '4.9/5',
    statLabel: 'Average client rating',
  },
  wall: {
    eyebrow: 'Testimonials',
    title: 'Loved by our clients',
  },
  minimal: {
    title: 'What Our Clients Say',
  },
};
