/**
 * Rate Limiting Utility
 * Prevents abuse by limiting requests per IP/user
 */

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitStore>();

interface RateLimitOptions {
  interval: number; // Time window in milliseconds
  maxRequests: number; // Max requests per interval
}

/**
 * Rate limit checker
 * @param identifier - IP address or user ID
 * @param options - Rate limit configuration
 * @returns true if rate limit exceeded, false otherwise
 */
export function isRateLimited(
  identifier: string,
  options: RateLimitOptions = { interval: 60000, maxRequests: 10 }
): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  // No record or expired record
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + options.interval,
    });
    return false;
  }

  // Increment count
  record.count += 1;

  // Check if limit exceeded
  if (record.count > options.maxRequests) {
    return true;
  }

  return false;
}

/**
 * Clean up expired rate limit records (run periodically)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

// Clean up every 5 minutes
if (typeof window === 'undefined') {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  // Submission endpoints
  BEAST_SUBMIT: { interval: 3600000, maxRequests: 1 }, // 1 per hour
  MOMENT_CREATE: { interval: 300000, maxRequests: 5 }, // 5 per 5 min

  // Voting endpoints
  BEAST_VOTE: { interval: 3600000, maxRequests: 1 }, // 1 per hour
  POLL_VOTE: { interval: 60000, maxRequests: 10 }, // 10 per minute

  // Reaction endpoints
  REALMOJI_REACT: { interval: 60000, maxRequests: 20 }, // 20 per minute

  // Auth endpoints
  AUTH_SIGNIN: { interval: 300000, maxRequests: 5 }, // 5 per 5 min
  AUTH_SIGNUP: { interval: 3600000, maxRequests: 3 }, // 3 per hour

  // Default
  DEFAULT: { interval: 60000, maxRequests: 30 }, // 30 per minute
} as const;
