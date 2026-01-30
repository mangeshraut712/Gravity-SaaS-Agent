import { describe, it, expect } from 'vitest';
import { TieredRateLimiter } from './rate-limiter.js';

describe('TieredRateLimiter', () => {
    const config = {
        FREE: { windowMs: 1000, maxRequests: 2 },
        PRO: { windowMs: 1000, maxRequests: 5 },
        BUSINESS: { windowMs: 1000, maxRequests: 10 },
        ENTERPRISE: { windowMs: 1000, maxRequests: 20 },
    };

    it('should allow requests within limit', () => {
        const limiter = new TieredRateLimiter(config);
        const info1 = limiter.consume('user1', 'FREE');
        expect(info1.allowed).toBe(true);
        expect(info1.remaining).toBe(1);

        const info2 = limiter.consume('user1', 'FREE');
        expect(info2.allowed).toBe(true);
        expect(info2.remaining).toBe(0);
    });

    it('should block requests exceeding limit', () => {
        const limiter = new TieredRateLimiter(config);
        limiter.consume('user1', 'FREE');
        limiter.consume('user1', 'FREE');

        const info3 = limiter.consume('user1', 'FREE');
        expect(info3.allowed).toBe(false);
        expect(info3.remaining).toBe(0);
    });

    it('should support different tiers', () => {
        const limiter = new TieredRateLimiter(config);

        // PRO user gets more requests
        for (let i = 0; i < 5; i++) {
            expect(limiter.consume('user_pro', 'PRO').allowed).toBe(true);
        }
        expect(limiter.consume('user_pro', 'PRO').allowed).toBe(false);
    });
});
