import { describe, it, expect, beforeEach } from 'vitest';
import { RateLimiter } from './rate-limiter';

describe('RateLimiter', () => {
    it('should allow requests within limit', () => {
        const limiter = new RateLimiter({
            windowMs: 1000,
            maxRequests: 2
        });

        expect(limiter.isRateLimited('user1')).toBe(false);
        expect(limiter.isRateLimited('user1')).toBe(false);
    });

    it('should block requests exceeding limit', () => {
        const limiter = new RateLimiter({
            windowMs: 1000,
            maxRequests: 2
        });

        limiter.isRateLimited('user1');
        limiter.isRateLimited('user1');
        expect(limiter.isRateLimited('user1')).toBe(true);
    });

    it('should reset after window expires', async () => {
        const limiter = new RateLimiter({
            windowMs: 100,
            maxRequests: 1
        });

        limiter.isRateLimited('user1');
        expect(limiter.isRateLimited('user1')).toBe(true);

        await new Promise(resolve => setTimeout(resolve, 150));

        expect(limiter.isRateLimited('user1')).toBe(false);
    });
});
