/**
 * Builds a `https://wa.me/...` deep link from a phone number and an optional
 * pre-filled message. Numbers formatted for display (e.g. "+1 234 567 890")
 * are sanitized automatically, since wa.me only accepts digits.
 */
export function getWhatsappUrl(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, '');
  const query = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${digits}${query}`;
}
