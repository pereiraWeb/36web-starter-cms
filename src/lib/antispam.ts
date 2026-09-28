/**
 * Name of the invisible honeypot field rendered by `ContactForm`. Real users
 * never see or fill it (visually hidden, `tabindex="-1"`, `autocomplete="off"`);
 * bots that blindly fill every field usually do, which flags the submission as spam.
 */
export const HONEYPOT_FIELD_NAME = 'company';

/** True when the hidden honeypot field was filled in, indicating an automated submission. */
export function isHoneypotTriggered(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}
