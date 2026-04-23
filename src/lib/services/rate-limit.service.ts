/**
 * Server-side rate limiting service.
 * Uses a sliding-window counter backed by PostgreSQL.
 * Config is read from the SystemConfig table (admin-configurable).
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export type RateLimitInfo = {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: Date;
  windowMin: number;
};

/**
 * Check whether a user is within the rate limit for a given endpoint.
 * Throws a 429 NextResponse if the limit is exceeded.
 * Returns the rate limit info if allowed.
 */
export async function checkRateLimit(
  userId: string,
  endpoint: string,
): Promise<RateLimitInfo> {
  // Load config (cached per request in serverless, fast in practice)
  const config = await prisma.systemConfig.findUnique({
    where: { id: 'default' },
    select: {
      rateLimitEnabled: true,
      rateLimitMaxRequests: true,
      rateLimitWindowMin: true,
    },
  });

  // If rate limiting is disabled or no config, allow
  if (!config || !config.rateLimitEnabled) {
    return {
      allowed: true,
      remaining: Infinity,
      limit: Infinity,
      resetAt: new Date(),
      windowMin: 0,
    };
  }

  const { rateLimitMaxRequests: maxRequests, rateLimitWindowMin: windowMin } = config;
  const windowStart = new Date(Date.now() - windowMin * 60 * 1000);

  // Count requests in the current window
  const count = await prisma.rateLimitEntry.count({
    where: {
      userId,
      endpoint,
      createdAt: { gte: windowStart },
    },
  });

  const remaining = Math.max(0, maxRequests - count);
  const resetAt = new Date(Date.now() + windowMin * 60 * 1000);

  if (count >= maxRequests) {
    // Find the oldest entry in the window to calculate accurate reset time
    const oldestEntry = await prisma.rateLimitEntry.findFirst({
      where: {
        userId,
        endpoint,
        createdAt: { gte: windowStart },
      },
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true },
    });

    const accurateResetAt = oldestEntry
      ? new Date(oldestEntry.createdAt.getTime() + windowMin * 60 * 1000)
      : resetAt;

    const retryAfterSec = Math.ceil((accurateResetAt.getTime() - Date.now()) / 1000);

    throw NextResponse.json(
      {
        error: `Rate limit exceeded. You can make ${maxRequests} AI requests per ${windowMin} minute${windowMin !== 1 ? 's' : ''}. Please try again later.`,
        retryAfter: retryAfterSec,
        remaining: 0,
        limit: maxRequests,
        resetAt: accurateResetAt.toISOString(),
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfterSec),
          'X-RateLimit-Limit': String(maxRequests),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': accurateResetAt.toISOString(),
        },
      },
    );
  }

  return { allowed: true, remaining, limit: maxRequests, resetAt, windowMin };
}

/**
 * Record a successful request for rate limiting purposes.
 * Call this AFTER the request has been validated but BEFORE heavy processing.
 */
export async function recordRequest(userId: string, endpoint: string): Promise<void> {
  await prisma.rateLimitEntry.create({
    data: { userId, endpoint },
  });

  // Probabilistic cleanup: ~5% of requests trigger cleanup of old entries
  if (Math.random() < 0.05) {
    cleanupOldEntries().catch(console.error);
  }
}

/**
 * Delete rate limit entries older than 24 hours.
 * Called probabilistically to avoid accumulation without a cron job.
 */
async function cleanupOldEntries(): Promise<void> {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  await prisma.rateLimitEntry.deleteMany({
    where: { createdAt: { lt: cutoff } },
  });
}
