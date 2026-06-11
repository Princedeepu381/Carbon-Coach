// src/lib/rateLimit.ts
// Simple in-memory rate limiter for API routes

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime?: number;
}

/**
 * Rate limit requests based on identifier (usually IP address)
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param limit - Maximum number of requests allowed in the window
 * @param windowMs - Time window in milliseconds (default: 60000 = 1 minute)
 * @returns RateLimitResult with success status and remaining requests
 */
export function rateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000
): RateLimitResult {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  // No record or window expired - create new record
  if (!record || now > record.resetTime) {
    const resetTime = now + windowMs;
    rateLimitMap.set(identifier, { count: 1, resetTime });
    return { success: true, remaining: limit - 1, resetTime };
  }

  // Limit exceeded
  if (record.count >= limit) {
    return { success: false, remaining: 0, resetTime: record.resetTime };
  }

  // Increment count
  record.count++;
  return { success: true, remaining: limit - record.count, resetTime: record.resetTime };
}

/**
 * Get rate limit status without incrementing
 */
export function getRateLimitStatus(identifier: string, limit: number = 10): RateLimitResult {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    return { success: true, remaining: limit };
  }

  return {
    success: record.count < limit,
    remaining: Math.max(0, limit - record.count),
    resetTime: record.resetTime,
  };
}

/**
 * Reset rate limit for an identifier
 */
export function resetRateLimit(identifier: string): void {
  rateLimitMap.delete(identifier);
}

// Made with Bob
