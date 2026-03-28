/**
 * In-memory rate limiter for Node.js runtime (server actions, API routes).
 *
 * For production with multiple server instances or serverless/edge deployments,
 * replace this with a distributed solution such as Upstash Redis:
 *   https://upstash.com/docs/redis/sdks/ratelimit-ts/overview
 *
 * Usage:
 *   const result = rateLimit(`login:${ip}`, { maxRequests: 5, windowMs: 60_000 });
 *   if (!result.success) throw new Error("Too many requests");
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// Module-level store — persists for the lifetime of the Node.js process.
const store = new Map<string, RateLimitEntry>();

// Periodically clean up expired entries to prevent memory leaks.
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key);
  }
}, CLEANUP_INTERVAL_MS).unref?.(); // .unref() so it doesn't keep process alive

export interface RateLimitOptions {
  /** Maximum number of requests allowed within the window. */
  maxRequests: number;
  /** Time window in milliseconds. */
  windowMs: number;
}

export interface RateLimitResult {
  /** Whether the request is allowed. */
  success: boolean;
  /** Number of remaining requests in the current window. */
  remaining: number;
  /** Timestamp (ms) when the current window resets. */
  resetAt: number;
}

/**
 * Check and increment the rate limit counter for a given key.
 * The key should encode the action and identifier, e.g. `"login:192.168.1.1"`.
 */
export function rateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    const newEntry: RateLimitEntry = { count: 1, resetAt: now + options.windowMs };
    store.set(key, newEntry);
    return { success: true, remaining: options.maxRequests - 1, resetAt: newEntry.resetAt };
  }

  if (entry.count >= options.maxRequests) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return {
    success: true,
    remaining: options.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

// ---------------------------------------------------------------------------
// Pre-configured limiters for common auth operations
// ---------------------------------------------------------------------------

/** 5 login attempts per minute per IP. */
export const loginRateLimit = (ip: string) =>
  rateLimit(`login:${ip}`, { maxRequests: 5, windowMs: 60_000 });

/** 3 registration attempts per hour per IP. */
export const registerRateLimit = (ip: string) =>
  rateLimit(`register:${ip}`, { maxRequests: 3, windowMs: 60 * 60_000 });

/** 3 magic-link / OTP requests per 10 minutes per email. */
export const otpRateLimit = (email: string) =>
  rateLimit(`otp:${email}`, { maxRequests: 3, windowMs: 10 * 60_000 });
