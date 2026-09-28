import { contactValidationMessages } from '../config/formContent';

/** Payload shape shared by the client script, `/api/contact` and `sendContactEmail`. */
export interface ContactData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

/**
 * Field-level error messages, shared between client-side validation and the
 * `/api/contact` server response so `ContactForm` can render either one with
 * the same code path. `company` is reserved for forms built on top of
 * `FormField`/`ContactData` that collect that field in the future.
 */
export interface ContactErrors {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  consent?: string;
}

/** JSON shape returned by `/api/contact`, consumed by `ContactForm`'s submit handler. */
export interface ContactResponse {
  success: boolean;
  message: string;
  errors?: ContactErrors;
}

export interface FormValidationResult {
  valid: boolean;
  errors: ContactErrors;
}

/**
 * Shared length limits, used both for the `maxlength` attribute on the client
 * (UX hint only) and for the authoritative server-side check in
 * `validateContactForm` / `src/pages/api/contact.ts`.
 */
export const contactFieldLimits = {
  name: { min: 2, max: 100 },
  email: { max: 200 },
  phone: { min: 6, max: 20 },
  message: { min: 10, max: 5000 },
} as const;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Allows digits plus common separators (spaces, `+`, `-`, parentheses); requires at least 6 digits so e.g. "------" doesn't pass. */
const phonePattern = /^[0-9+\-\s()]+$/;
const phoneDigitsPattern = /\d/g;

/** Trims and strips control characters. HTML-escaping happens later, only when rendering into HTML (see `lib/email.ts`). */
export function sanitizeText(value: string): string {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim();
}

/**
 * Validates (and implicitly sanitizes for length purposes) a contact form
 * payload. This is intentionally framework-agnostic so it can run both in the
 * browser (as a client-side UX helper) and on the server (as the source of
 * truth — never trust client-side validation alone). All user-facing copy
 * comes from `contactValidationMessages` in `src/config/formContent.ts`, never
 * written directly in this function.
 */
export function validateContactForm(data: ContactData): FormValidationResult {
  const errors: ContactErrors = {};
  const messages = contactValidationMessages;

  const name = sanitizeText(data.name);
  if (!name) {
    errors.name = messages.name.required;
  } else if (name.length < contactFieldLimits.name.min) {
    errors.name = messages.name.min(contactFieldLimits.name.min);
  } else if (name.length > contactFieldLimits.name.max) {
    errors.name = messages.name.max(contactFieldLimits.name.max);
  }

  const email = sanitizeText(data.email);
  if (!email) {
    errors.email = messages.email.required;
  } else if (email.length > contactFieldLimits.email.max) {
    errors.email = messages.email.max(contactFieldLimits.email.max);
  } else if (!emailPattern.test(email)) {
    errors.email = messages.email.invalid;
  }

  const phone = sanitizeText(data.phone);
  const phoneDigitCount = (phone.match(phoneDigitsPattern) ?? []).length;
  if (!phone) {
    errors.phone = messages.phone.required;
  } else if (phone.length < contactFieldLimits.phone.min) {
    errors.phone = messages.phone.min(contactFieldLimits.phone.min);
  } else if (phone.length > contactFieldLimits.phone.max) {
    errors.phone = messages.phone.max(contactFieldLimits.phone.max);
  } else if (!phonePattern.test(phone) || phoneDigitCount < 6) {
    errors.phone = messages.phone.invalid;
  }

  const message = sanitizeText(data.message);
  if (!message) {
    errors.message = messages.message.required;
  } else if (message.length < contactFieldLimits.message.min) {
    errors.message = messages.message.min(contactFieldLimits.message.min);
  } else if (message.length > contactFieldLimits.message.max) {
    errors.message = messages.message.max(contactFieldLimits.message.max);
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
