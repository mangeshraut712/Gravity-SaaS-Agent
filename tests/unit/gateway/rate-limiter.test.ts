import { afterEach, describe, expect, it, vi } from 'vitest';
import {
    TieredRateLimiter,
    createTieredRateLimitMiddleware,
    getUserIdFromRequest,
    getUserTierFromRequest,
} from '../../../apps/gateway/src/services/rate-limiter.js';
import { mockResponse } from '../../helpers/http.js';

const config = {
    FREE: { windowMs: 1000, maxRequests: 2 },
    PRO: { windowMs: 1000, maxRequests: 5 },
    BUSINESS: { windowMs: 1000, maxRequests: 10 },
    ENTERPRISE: { windowMs: 1000, maxRequests: 20 },
};

describe('TieredRateLimiter', () => {
    const limiters: TieredRateLimiter[] = [];

    afterEach(() => {
        for (const limiter of limiters) limiter.destroy();
        limiters.length = 0;
    });

    function create() {
        const limiter = new TieredRateLimiter(config);
        limiters.push(limiter);
        return limiter;
    }

    it('allows requests inside the tier and blocks the next one', () => {
        const limiter = create();
        expect(limiter.consume('user1', 'FREE')).toMatchObject({ allowed: true, remaining: 1 });
        expect(limiter.consume('user1', 'FREE').remaining).toBe(0);
        expect(limiter.consume('user1', 'FREE')).toMatchObject({ allowed: false, remaining: 0 });
    });

    it('keeps tiers and users independent and refills over time', () => {
        vi.useFakeTimers();
        const limiter = create();
        for (let i = 0; i < 5; i += 1) {
            expect(limiter.consume('pro-user', 'PRO').allowed).toBe(true);
        }
        expect(limiter.consume('pro-user', 'PRO').allowed).toBe(false);
        expect(limiter.consume('other', 'FREE').allowed).toBe(true);

        vi.advanceTimersByTime(1000);
        expect(limiter.checkRateLimit('pro-user', 'PRO').allowed).toBe(true);
        expect(limiter.getRemainingRequests('pro-user', 'PRO')).toBe(5);
    });

    it('resets one bucket or every bucket and reports stats', () => {
        const limiter = create();
        limiter.consume('user1', 'FREE');
        limiter.reset('user1', 'FREE');
        expect(limiter.getRemainingRequests('user1', 'FREE')).toBe(2);
        limiter.consume('user1', 'BUSINESS', 3);
        limiter.resetAll();
        expect(limiter.getStats()).toMatchObject({ totalBuckets: 0, averageTokens: 0 });
    });

    it('drops idle buckets during cleanup', () => {
        vi.useFakeTimers();
        const limiter = create();
        limiter.consume('stale', 'ENTERPRISE');
        vi.advanceTimersByTime(5 * 60 * 1000);
        expect(limiter.getStats().totalBuckets).toBe(0);
    });

    it('exposes express middleware and request helpers', () => {
        const middleware = createTieredRateLimitMiddleware(
            () => 'FREE',
            (req) => req.userId as string | undefined,
        );
        const res = mockResponse();
        const next = vi.fn();
        middleware({ userId: `anon-${Date.now()}`, headers: {} }, res, next);
        expect(next).toHaveBeenCalledOnce();
        expect(res.headers['X-RateLimit-Limit']).toBe('10');

        const blocked = mockResponse();
        const blockedNext = vi.fn();
        const userId = `blocked-${Date.now()}`;
        for (let i = 0; i < 10; i += 1) {
            middleware({ userId, headers: {} }, mockResponse(), vi.fn());
        }
        middleware({ userId, headers: {} }, blocked, blockedNext);
        expect(blocked.statusCode).toBe(429);
        expect(blockedNext).not.toHaveBeenCalled();

        expect(getUserTierFromRequest({ user: { tier: 'PRO' } })).toBe('PRO');
        expect(getUserTierFromRequest({})).toBe('FREE');
        expect(getUserIdFromRequest({ user: { id: 'user-7' } })).toBe('user-7');
        expect(getUserIdFromRequest({ headers: { authorization: 'Bearer token-1' } })).toBe('token-1');
        expect(getUserIdFromRequest({ headers: {} })).toBeUndefined();
    });
});
