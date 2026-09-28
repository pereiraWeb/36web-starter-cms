interface RateLimitEntry {
  count: number;
  resetAt: number;
}

/**
 * In-memory, per-process request buckets keyed by an arbitrary identifier
 * (typically the client IP). This is intentionally simple and dependency-free —
 * a basic speed bump, not a guaranteed protection.
 *
 * IMPORTANT — this is NOT persistent in serverless environments like Vercel:
 * each invocation can run in a fresh, isolated function instance with its own
 * memory (no shared state across instances or regions), and the map is wiped
 * on every cold start/redeploy. A determined abuser can bypass it simply by
 * hitting a different instance. Combined with the honeypot, length limits and
 * server-side validation this still meaningfully slows down basic abuse, but
 * do NOT present it as a hard guarantee. For real protection at scale, replace
 * this with a shared store such as Redis/Upstash/Vercel KV.
 */
const buckets = new Map<string, RateLimitEntry>();

const MAX_TRACKED_KEYS = 1000;

export interface RateLimitOptions {
  /** Max requests allowed within the window. */
  limit: number;
  /** Window size in milliseconds. */
  windowMs: number;
}

export interface RateLimitResult {
  limited: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

function pruneExpired(now: number): void {
  if (buckets.size <= MAX_TRACKED_KEYS) return;
  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now) buckets.delete(key);
  }
}

/** Records a request for `key` and reports whether it should be rejected. */
export function checkRateLimit(key: string, { limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  pruneExpired(now);

  const entry = buckets.get(key);

  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  if (entry.count >= limit) {
    return { limited: true, remaining: 0, retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)) };
  }

  entry.count += 1;
  return { limited: false, remaining: limit - entry.count, retryAfterSeconds: 0 };
}
