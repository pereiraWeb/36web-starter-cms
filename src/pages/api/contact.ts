import type { APIContext, APIRoute } from 'astro';
import { validateContactForm, sanitizeText, type ContactData, type ContactResponse } from '../../lib/forms';
import { sendContactEmail } from '../../lib/email';
import { checkRateLimit } from '../../lib/rateLimit';
import { HONEYPOT_FIELD_NAME, isHoneypotTriggered } from '../../lib/antispam';
import { contactApiMessages, consentCheckboxContent } from '../../config/formContent';

// This endpoint must be rendered on demand (not prerendered) so it can read
// each request's body and call the email service at runtime. The rest of the
// site stays fully static; only this route needs the Vercel adapter's
// on-demand rendering (configured in `astro.config.mjs`).
export const prerender = false;

/** Only these keys are accepted; anything else makes the payload "unexpected" and gets rejected outright. */
const ALLOWED_KEYS = new Set(['name', 'email', 'phone', 'message', 'consent', HONEYPOT_FIELD_NAME]);

/** Defensive upper bound on the raw request body, well above what a legitimate form ever needs. */
const MAX_BODY_BYTES = 20_000;

// Basic, best-effort speed bump only — see the detailed caveats in
// `src/lib/rateLimit.ts` about why this is NOT a guaranteed protection on
// serverless platforms like Vercel (no shared/persistent state across
// function instances). Combined with the honeypot and strict validation
// below, it still meaningfully raises the bar for casual abuse.
const RATE_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 }; // 5 submissions per IP per 10 minutes

function jsonResponse(body: ContactResponse, status: number, headers?: HeadersInit): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

/**
 * Best-effort client IP for rate limiting only — NEVER use this for
 * security-critical decisions. `x-forwarded-for` is a client-supplied header
 * that can be freely spoofed unless the platform in front of this function
 * guarantees it's overwritten (Vercel does this for its own edge network, but
 * this code makes no such assumption). Only the first address in the
 * (possibly comma-separated) list is used, with a safe "unknown" fallback.
 */
function getClientIp(context: APIContext): string {
  try {
    // Available on platforms whose Astro adapter populates it (e.g. Vercel).
    if (context.clientAddress) return context.clientAddress;
  } catch {
    // Accessing `clientAddress` throws when the current adapter doesn't support it.
  }
  const forwarded = context.request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || 'unknown';
}

type RawPayload = Record<string, unknown>;

function isPlainObject(value: unknown): value is RawPayload {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Only `application/json` is accepted — a traditional multipart/urlencoded HTML submit is not supported (see `ContactForm`'s `<noscript>` message). */
async function parseJsonBody(request: Request): Promise<RawPayload> {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    throw new Error('unsupported-content-type');
  }

  const json = await request.json();
  if (!isPlainObject(json)) {
    throw new Error('invalid-shape');
  }
  return json;
}

export const POST: APIRoute = async (context) => {
  const { request } = context;

  // 1. Reject oversized requests outright, before doing any real work.
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return jsonResponse({ success: false, message: contactApiMessages.tooLarge }, 413);
  }

  // 2. Rate limit per (best-effort) IP to slow down abusive/scripted submissions.
  const ip = getClientIp(context);
  const rateLimit = checkRateLimit(`contact:${ip}`, RATE_LIMIT);
  if (rateLimit.limited) {
    return jsonResponse({ success: false, message: contactApiMessages.rateLimited }, 429, {
      'Retry-After': String(rateLimit.retryAfterSeconds),
    });
  }

  // 3. Parse and shape-check the body. Reject non-JSON content types and unexpected fields.
  let raw: RawPayload;
  try {
    raw = await parseJsonBody(request);
  } catch (err) {
    if (err instanceof Error && err.message === 'unsupported-content-type') {
      return jsonResponse({ success: false, message: contactApiMessages.unsupportedContentType }, 415);
    }
    return jsonResponse({ success: false, message: contactApiMessages.invalidBody }, 400);
  }

  const unexpectedKeys = Object.keys(raw).filter((key) => !ALLOWED_KEYS.has(key));
  if (unexpectedKeys.length > 0) {
    return jsonResponse({ success: false, message: contactApiMessages.unexpectedFields }, 400);
  }

  // 4. Honeypot: real visitors never fill this hidden field in. Pretend success
  //    so bots don't learn their submission was discarded, but never send an email.
  if (isHoneypotTriggered(raw[HONEYPOT_FIELD_NAME])) {
    console.warn('[api/contact] Honeypot triggered, discarding a submission.');
    return jsonResponse({ success: true, message: contactApiMessages.success }, 200);
  }

  // (Optional) CAPTCHA checkpoint: if honeypot + rate limiting aren't enough to
  // stop abuse in production, verify a token here (e.g. Cloudflare Turnstile,
  // hCaptcha, reCAPTCHA) before continuing, using a server-side secret from
  // an env var. Not enabled by default to avoid requiring a third-party
  // account for a starter template.

  const data: ContactData = {
    name: sanitizeText(String(raw.name ?? '')),
    email: sanitizeText(String(raw.email ?? '')),
    phone: sanitizeText(String(raw.phone ?? '')),
    message: sanitizeText(String(raw.message ?? '')),
  };

  // 5. Authoritative validation. The client validates too, but only as a UX
  //    helper — this server-side check is the one that actually matters.
  const validation = validateContactForm(data);
  if (!validation.valid) {
    return jsonResponse(
      { success: false, message: contactApiMessages.invalidData, errors: validation.errors },
      422,
    );
  }

  // 6. Consent is always mandatory, regardless of whether the field was sent
  //    at all: missing, `false`, or any value other than the boolean `true`
  //    is rejected. `ContactForm` always renders `ConsentCheckbox` by default
  //    and sends a real boolean, so this only rejects tampered/incomplete requests.
  const consentGiven = raw.consent === true;
  if (!consentGiven) {
    return jsonResponse(
      {
        success: false,
        message: contactApiMessages.invalidData,
        errors: { consent: consentCheckboxContent.errorText },
      },
      422,
    );
  }

  // 7. Only report success once the email has actually been sent — dev-mode
  //    simulation (no RESEND_API_KEY) counts as a deliberate exception, see
  //    `sendContactEmail`'s own doc comment. In production, a missing/failed
  //    send always surfaces as an error here, never a fake success.
  const result = await sendContactEmail(data);
  if (!result.success) {
    return jsonResponse({ success: false, message: contactApiMessages.emailFailed }, 502);
  }

  return jsonResponse({ success: true, message: contactApiMessages.success }, 200);
};
