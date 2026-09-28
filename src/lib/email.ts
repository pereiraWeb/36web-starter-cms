import { Resend } from 'resend';
import { business } from '../config/business';
import type { ContactData } from './forms';

export interface SendContactEmailResult {
  success: boolean;
  error?: string;
}

/**
 * Only used in development, when `RESEND_API_KEY` isn't set, so a submission
 * from `CONTACT_FROM_EMAIL` can still be simulated end-to-end. Never used in
 * production — see the `import.meta.env.PROD` checks below.
 */
const DEV_ONLY_FROM_FALLBACK = 'Pruebas (solo desarrollo) <onboarding@resend.dev>';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sends a contact form submission by email using Resend (https://resend.com).
 *
 * Env vars (see `.env.example`):
 * - `RESEND_API_KEY`: required in production. If missing in production, the
 *   send fails outright (never a fake success). In development it's optional —
 *   without it, the submission is only logged (no personal data) and treated
 *   as a successful "simulated" send so the starter works end-to-end locally.
 * - `CONTACT_TO_EMAIL`: inbox that receives submissions. Defaults to `business.email`.
 * - `CONTACT_FROM_EMAIL`: the full sender, e.g. `Mi Empresa <formularios@empresa.es>`,
 *   using an address verified in your Resend domain. Used exactly as provided —
 *   never wrapped with another name. Required in production (no
 *   `onboarding@resend.dev` fallback outside development).
 *
 * The visitor's own email is only ever used as `replyTo`, never as `from`.
 */
export async function sendContactEmail(data: ContactData): Promise<SendContactEmailResult> {
  // Read secrets from `process.env` (populated by the hosting platform at
  // request time, e.g. Vercel's dashboard env vars) rather than
  // `import.meta.env`. The latter gets statically inlined by Vite at build
  // time for server code too, so a key added/rotated in Vercel afterwards
  // would silently have no effect until the next rebuild — `process.env` is
  // read fresh on every invocation, which is what secrets need. `PROD` is the
  // one exception: it's a legitimate build-mode flag (`astro build` vs
  // `astro dev`), safe and correct to read via `import.meta.env`.
  const apiKey = process.env.RESEND_API_KEY;
  const isProduction = import.meta.env.PROD;

  if (!apiKey) {
    if (isProduction) {
      console.error('[sendContactEmail] RESEND_API_KEY is required in production. Message was not sent.');
      return { success: false, error: 'Email service is not configured.' };
    }
    // Development-only simulation. No form data is logged, only a generic notice.
    console.info('[sendContactEmail] Dev mode: RESEND_API_KEY is not set, simulating a successful send.');
    return { success: true };
  }

  const to = process.env.CONTACT_TO_EMAIL || business.email;
  if (!to) {
    console.error('[sendContactEmail] No destination email configured (business.email / CONTACT_TO_EMAIL).');
    return { success: false, error: 'Missing destination email address.' };
  }

  const from = process.env.CONTACT_FROM_EMAIL || (isProduction ? undefined : DEV_ONLY_FROM_FALLBACK);
  if (!from) {
    console.error('[sendContactEmail] CONTACT_FROM_EMAIL is required in production. Message was not sent.');
    return { success: false, error: 'Email sender is not configured.' };
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `Nuevo mensaje de ${data.name} a través de la web de ${business.name}`,
      text: `Nombre: ${data.name}\nEmail: ${data.email}\nTeléfono: ${data.phone}\n\nMensaje:\n${data.message}`,
      html: `
        <p><strong>Nombre:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Teléfono:</strong> ${escapeHtml(data.phone)}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${escapeHtml(data.message).replace(/\n/g, '<br />')}</p>
      `.trim(),
    });

    if (error) {
      // `error` comes from Resend's API (e.g. invalid key, unverified domain) and
      // never echoes the submitted data, but only its message is logged, just in case.
      console.error('[sendContactEmail] Resend rejected the message:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('[sendContactEmail] Unexpected error while sending the message.');
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
