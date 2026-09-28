export interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  image?: string;
  featured?: boolean;
}

export const team: TeamMember[] = [
  {
    name: 'Jane Doe',
    role: 'Founder',
    bio: 'Leads the company vision and long-term strategy.',
    featured: true,
  },
  { name: 'John Smith', role: 'Operations Lead', bio: 'Keeps every project running smoothly end to end.' },
  { name: 'Alex Johnson', role: 'Lead Designer', bio: 'Shapes the visual identity behind every product.' },
];

export interface TeamContentConfig {
  grid: { eyebrow?: string; title: string; description?: string };
  compact: { eyebrow?: string; title: string; description?: string };
  split: { eyebrow?: string; title: string; description: string };
  spotlight: { eyebrow?: string; title: string; description?: string };
  minimal: { eyebrow?: string; title: string; description?: string };
}

/**
 * Editable copy for every component in `src/components/team/`.
 * The `team` list above is shared across all variants; set `featured: true`
 * on one member to highlight them in `TeamSpotlight`.
 */
export const teamContent: TeamContentConfig = {
  grid: {
    title: 'Our Team',
  },
  compact: {
    eyebrow: 'Meet the team',
    title: 'The people behind the work',
  },
  split: {
    eyebrow: 'Our Team',
    title: 'A team you can count on',
    description: 'Small, focused and hands-on: everyone you work with is directly involved in delivering your project.',
  },
  spotlight: {
    eyebrow: 'Leadership',
    title: 'Meet our team',
  },
  minimal: {
    title: 'Our Team',
  },
};
