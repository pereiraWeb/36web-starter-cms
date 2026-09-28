import { legalRoutes } from './navigation';

export interface ConsentCheckboxContent {
  label: string;
  policyText: string;
  policyHref: string;
  errorText: string;
}

/** Editable copy for `src/components/forms/ConsentCheckbox.astro`. */
export const consentCheckboxContent: ConsentCheckboxContent = {
  label: 'Acepto la',
  policyText: 'política de privacidad',
  policyHref: legalRoutes.privacy,
  errorText: 'Debes aceptar la política de privacidad para continuar.',
};

export interface FormStatusMessages {
  success: string;
  error: string;
}

/** Editable copy for `src/components/forms/FormStatus.astro`. */
export const formStatusMessages: FormStatusMessages = {
  success: 'Gracias, tu mensaje se ha enviado correctamente. Te responderemos lo antes posible.',
  error: 'Ha ocurrido un error al enviar tu mensaje. Inténtalo de nuevo o contáctanos directamente.',
};

export interface ContactFormText {
  /** Default submit button label; each `Contact*` variant may override it via `contactContent`. */
  submitText: string;
  /** Submit button label shown while the request is in flight. */
  submittingText: string;
  /** Visually-hidden label for the honeypot field (real visitors never see it). */
  honeypotLabel: string;
  /** Shown inside `<noscript>`; `ContactForm` appends `business.email` right after it. */
  noscriptText: string;
}

/** Editable copy for `src/components/forms/ContactForm.astro`. */
export const contactFormText: ContactFormText = {
  submitText: 'Enviar mensaje',
  submittingText: 'Enviando…',
  honeypotLabel: 'Empresa',
  noscriptText: 'Este formulario necesita JavaScript para enviar tu mensaje. También puedes escribirnos directamente a',
};

interface LengthValidationMessages {
  required: string;
  min: (min: number) => string;
  max: (max: number) => string;
}

export interface ContactValidationMessages {
  name: LengthValidationMessages;
  email: { required: string; max: (max: number) => string; invalid: string };
  phone: LengthValidationMessages & { invalid: string };
  message: LengthValidationMessages;
}

/**
 * Copy used by `validateContactForm` (`src/lib/forms.ts`), shared between the
 * client-side (UX helper) and server-side (source of truth) validation paths.
 * Keeping these strings here — instead of inline in the validation logic —
 * means the validator never hardcodes user-facing text.
 */
export const contactValidationMessages: ContactValidationMessages = {
  name: {
    required: 'El nombre es obligatorio.',
    min: (min) => `El nombre debe tener al menos ${min} caracteres.`,
    max: (max) => `El nombre debe tener como máximo ${max} caracteres.`,
  },
  email: {
    required: 'El correo electrónico es obligatorio.',
    max: (max) => `El correo electrónico debe tener como máximo ${max} caracteres.`,
    invalid: 'El correo electrónico no es válido.',
  },
  phone: {
    required: 'El teléfono es obligatorio.',
    min: (min) => `El teléfono debe tener al menos ${min} caracteres.`,
    max: (max) => `El teléfono debe tener como máximo ${max} caracteres.`,
    invalid: 'El teléfono no es válido.',
  },
  message: {
    required: 'El mensaje es obligatorio.',
    min: (min) => `El mensaje debe tener al menos ${min} caracteres.`,
    max: (max) => `El mensaje debe tener como máximo ${max} caracteres.`,
  },
};

export interface ContactApiMessages {
  success: string;
  invalidBody: string;
  unsupportedContentType: string;
  tooLarge: string;
  unexpectedFields: string;
  rateLimited: string;
  invalidData: string;
  emailFailed: string;
}

/** Generic (non field-specific) copy returned by `src/pages/api/contact.ts`. */
export const contactApiMessages: ContactApiMessages = {
  success: 'Mensaje enviado correctamente.',
  invalidBody: 'La solicitud no es válida.',
  unsupportedContentType: 'Tipo de contenido no soportado.',
  tooLarge: 'La solicitud es demasiado grande.',
  unexpectedFields: 'La solicitud contiene campos no permitidos.',
  rateLimited: 'Demasiados envíos. Inténtalo de nuevo más tarde.',
  invalidData: 'Revisa los campos marcados e inténtalo de nuevo.',
  emailFailed: 'No se pudo enviar tu mensaje. Inténtalo de nuevo más tarde.',
};

export interface ThankYouContent {
  title: string;
  description: string;
  backText: string;
  backHref: string;
}

/** Editable copy for `src/pages/thank-you.astro`, the measurable "thank you" destination `ContactForm` redirects to after a successful submission. */
export const thankYouContent: ThankYouContent = {
  title: '¡Gracias por contactarnos!',
  description: 'Hemos recibido tu mensaje y te responderemos en el plazo de un día laborable.',
  backText: 'Volver al inicio',
  backHref: '/',
};
