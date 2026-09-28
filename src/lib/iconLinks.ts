import type { IconLinkItem } from '../components/ui/IconLinks.astro';
import { business } from '../config/business';
import { getWhatsappUrl } from './whatsapp';

/** One icon link per configured entry in `business.social` (Facebook, Instagram, etc.). */
export function getSocialIconLinks(): IconLinkItem[] {
  return Object.entries(business.social)
    .filter((entry): entry is [string, string] => Boolean(entry[1]))
    .map(([key, href]) => ({
      icon: key as IconLinkItem['icon'],
      href,
      label: key.charAt(0).toUpperCase() + key.slice(1),
    }));
}

/** Icon links for email, phone and WhatsApp, built from `business.ts`. */
export function getContactIconLinks(): IconLinkItem[] {
  const links: IconLinkItem[] = [];

  if (business.email) {
    links.push({ icon: 'mail', href: `mailto:${business.email}`, label: 'Email' });
  }
  if (business.phone) {
    links.push({ icon: 'phone', href: `tel:${business.phone.replace(/[^\d+]/g, '')}`, label: 'Call us' });
    links.push({ icon: 'whatsapp', href: getWhatsappUrl(business.phone), label: 'WhatsApp' });
  }

  return links;
}

/** Default icon links for header components: WhatsApp, email, Instagram and Facebook, in that order. */
export function getHeaderIconLinks(): IconLinkItem[] {
  const links: IconLinkItem[] = [];

  if (business.phone) {
    links.push({ icon: 'whatsapp', href: getWhatsappUrl(business.phone), label: 'WhatsApp' });
  }
  if (business.email) {
    links.push({ icon: 'mail', href: `mailto:${business.email}`, label: 'Email' });
  }
  if (business.social.instagram) {
    links.push({ icon: 'instagram', href: business.social.instagram, label: 'Instagram' });
  }
  if (business.social.facebook) {
    links.push({ icon: 'facebook', href: business.social.facebook, label: 'Facebook' });
  }

  return links;
}
