/**
 * Rate Limiter with User Tier Support
 * Implements token bucket algorithm with tiered limits
 */

import { logger } from './logger.js';

export type UserTier = 'FREE' | 'PRO' | 'BUSINESS' | 'ENTERPRISE';

export interface RateLimitConfig {
    windowMs: number; // Time window in milliseconds
    maxRequests: number; // Max requests per window
}

export interface RateLimitInfo {
    allowed: boolean;
    remaining: number;
    resetTime: Date;
    limit: number;
    windowMs: number;
}

export interface TieredRateLimitConfig {
    FREE: RateLimitConfig;
    PRO: RateLimitConfig;
    BUSINESS: RateLimitConfig;
    ENTERPRISE: RateLimitConfig;
}

export const DEFAULT_TIER_CONFIGS: TieredRateLimitConfig = {
    FREE: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 10,
    },
    PRO: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 60,
    },
    BUSINESS: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 300,
    },
    ENTERPRISE: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 1000,
    },
};

export interface TokenBucket {
    tokens: number;
    lastRefill: number;
}

export class TieredRateLimiter {
    private configs: TieredRateLimitConfig;
    private buckets: Map<string, TokenBucket> = new Map();
    private cleanupInterval: NodeJS.Timeout;

    constructor(configs: TieredRateLimitConfig = DEFAULT_TIER_CONFIGS) {
        this.configs = configs;

        // Clean up expired buckets periodically
        this.cleanupInterval = setInterval(() => {
            this.cleanup();
        }, 5 * 60 * 1000); // Every 5 minutes
    }

    private getBucketKey(userId: string, tier: UserTier): string {
        return `${tier}:${userId}`;
    }

    private getBucket(userId: string, tier: UserTier): TokenBucket {
        const key = this.getBucketKey(userId, tier);
        let bucket = this.buckets.get(key);

        if (!bucket) {
            bucket = {
                tokens: this.configs[tier].maxRequests,
                lastRefill: Date.now(),
            };
            this.buckets.set(key, bucket);
        }

        return bucket;
    }

    private refillBucket(bucket: TokenBucket, config: RateLimitConfig): void {
        const now = Date.now();
        const timePassed = now - bucket.lastRefill;
        const tokensToAdd = (timePassed / config.windowMs) * config.maxRequests;

        bucket.tokens = Math.min(
            config.maxRequests,
            bucket.tokens + tokensToAdd
        );
        bucket.lastRefill = now;
    }

    checkRateLimit(userId: string, tier: UserTier = 'FREE'): RateLimitInfo {
        const config = this.configs[tier];
        const bucket = this.getBucket(userId, tier);

        this.refillBucket(bucket, config);

        const allowed = bucket.tokens >= 1;
        const remaining = Math.floor(Math.max(0, bucket.tokens));

        // Calculate reset time based on time until tokens are fully restored
        const tokensNeeded = config.maxRequests - remaining;
        const resetTime = new Date(
            Date.now() + (tokensNeeded / config.maxRequests) * config.windowMs
        );

        return {
            allowed,
            remaining,
            resetTime,
            limit: config.maxRequests,
            windowMs: config.windowMs,
        };
    }

    consume(userId: string, tier: UserTier = 'FREE', tokens: number = 1): RateLimitInfo {
        const config = this.configs[tier];
        const bucket = this.getBucket(userId, tier);

        this.refillBucket(bucket, config);

        const allowed = bucket.tokens >= tokens;

        if (allowed) {
            bucket.tokens -= tokens;
        }

        const remaining = Math.floor(Math.max(0, bucket.tokens));
        const tokensNeeded = config.maxRequests - remaining;
        const resetTime = new Date(
            Date.now() + (tokensNeeded / config.maxRequests) * config.windowMs
        );

        if (!allowed) {
            logger.warn('Rate limit exceeded', { userId, tier, remaining });
        }

        return {
            allowed,
            remaining,
            resetTime,
            limit: config.maxRequests,
            windowMs: config.windowMs,
        };
    }

    getRemainingRequests(userId: string, tier: UserTier = 'FREE'): number {
        const config = this.configs[tier];
        const bucket = this.getBucket(userId, tier);
        this.refillBucket(bucket, config);
        return Math.floor(Math.max(0, bucket.tokens));
    }

    reset(userId: string, tier: UserTier): void {
        const key = this.getBucketKey(userId, tier);
        this.buckets.delete(key);
    }

    resetAll(): void {
        this.buckets.clear();
    }

    private cleanup(): void {
        const now = Date.now();
        const windowMs = Math.max(...Object.values(this.configs).map(c => c.windowMs));

        for (const [key, bucket] of this.buckets) {
            if (now - bucket.lastRefill > windowMs * 2) {
                this.buckets.delete(key);
            }
        }
    }

    destroy(): void {
        clearInterval(this.cleanupInterval);
        this.buckets.clear();
    }

    getStats(): RateLimiterStats {
        const totalBuckets = this.buckets.size;
        let totalTokens = 0;

        for (const bucket of this.buckets.values()) {
            totalTokens += bucket.tokens;
        }

        return {
            totalBuckets,
            averageTokens: totalBuckets > 0 ? totalTokens / totalBuckets : 0,
            tierConfigs: this.configs,
        };
    }
}

export interface RateLimiterStats {
    totalBuckets: number;
    averageTokens: number;
    tierConfigs: TieredRateLimitConfig;
}

// Global rate limiter instance
export const rateLimiter = new TieredRateLimiter();

// Helper function to create Express middleware with tier-based rate limiting
export function createTieredRateLimitMiddleware(
    getUserTier: (userId: string) => UserTier,
    getUserId: (req: any) => string | undefined
) {
    return (req: any, res: any, next: any) => {
        const userId = getUserId(req) || 'anonymous';
        const tier = getUserTier(userId);

        const info = rateLimiter.consume(userId, tier);

        // Set rate limit headers
        res.setHeader('X-RateLimit-Limit', info.limit);
        res.setHeader('X-RateLimit-Remaining', info.remaining);
        res.setHeader('X-RateLimit-Reset', info.resetTime.toISOString());

        if (!info.allowed) {
            return res.status(429).json({
                success: false,
                error: 'Rate limit exceeded. Please try again later.',
                retryAfter: Math.ceil((info.resetTime.getTime() - Date.now()) / 1000),
                limit: info.limit,
                windowMs: info.windowMs,
            });
        }

        next();
    };
}

// Default implementations
export function getUserTierFromRequest(req: any): UserTier {
    // Extract tier from JWT token or user object
    if (req.user?.tier) {
        return req.user.tier as UserTier;
    }
    // Default to FREE if no tier found
    return 'FREE';
}

export function getUserIdFromRequest(req: any): string | undefined {
    // Extract user ID from JWT token or session
    if (req.user?.id) {
        return req.user.id;
    }
    // Try to get from authorization header
    const authHeader = req.headers.authorization;
    if (authHeader) {
        // Simple extraction - in production use proper JWT parsing
        return authHeader.split(' ')[1];
    }
    return undefined;
}

export default TieredRateLimiter;
