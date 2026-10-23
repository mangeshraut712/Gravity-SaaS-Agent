import { describe, expect, it, vi } from 'vitest';
import CacheManager, { CacheHelpers } from '../../../apps/gateway/src/services/cache.js';
import { mockResponse } from '../../helpers/http.js';

describe('CacheManager', () => {
    it('stores, reads, expires, and deletes values', async () => {
        vi.useFakeTimers();
        const cache = new CacheManager('redis://cache.test');
        await cache.set('agent', { id: 'a1' }, { ttl: 1, tags: ['agents'] });
        expect(await cache.get('agent')).toEqual({ id: 'a1' });

        await vi.advanceTimersByTimeAsync(1500);
        expect(await cache.get('agent')).toBeNull();

        await cache.set('agent', { id: 'a1' }, { ttl: 30, tags: ['agents'], compress: true });
        expect(await cache.get('agent')).toEqual({ id: 'a1' });
        await cache.del('agent');
        expect(await cache.get('missing')).toBeNull();
        await cache.del('missing');
    });

    it('invalidates tags and clears the keyspace', async () => {
        const cache = new CacheManager('redis://cache.test');
        await cache.set('one', { n: 1 }, { tags: ['group'] });
        await cache.set('two', { n: 2 }, { tags: ['group'] });
        await cache.invalidateTags(['group', 'empty']);
        expect(await cache.get('one')).toBeNull();

        await cache.set('three', { n: 3 });
        await cache.clear();
        expect(await cache.get('three')).toBeNull();
        await cache.clear();
    });

    it('reports redis stats and swallows backend failures', async () => {
        const cache = new CacheManager('redis://cache.test');
        await expect(cache.getStats()).resolves.toMatchObject({
            connected: true,
            memoryUsage: '1.00M',
        });

        (globalThis as { __redisFail?: string }).__redisFail = 'info';
        await expect(cache.getStats()).resolves.toMatchObject({ connected: false, lastError: 'redis info failed' });

        (globalThis as { __redisFail?: string }).__redisFail = 'get';
        await expect(cache.get('agent')).resolves.toBeNull();
        (globalThis as { __redisFail?: string }).__redisFail = 'set';
        await expect(cache.set('agent', { id: 'a1' })).resolves.toBeUndefined();
        delete (globalThis as { __redisFail?: string }).__redisFail;
    });

    it('serves cached responses from both middleware helpers', async () => {
        const hit = mockResponse();
        const cache = new CacheManager('redis://cache.test');
        await cache.set('req:GET:/agents:{}', { success: true, data: [1] }, { ttl: 30 });

        const middleware = CacheManager.cacheMiddleware({ ttl: 30 });
        const req = { method: 'GET', originalUrl: '/agents', query: {} };
        await middleware(req as never, hit as never, vi.fn());
        expect(hit.headers['X-Cache']).toBe('HIT');
        expect(hit.body).toMatchObject({ success: true });

        const miss = mockResponse();
        const next = vi.fn();
        await middleware({ method: 'POST', originalUrl: '/agents', query: { q: '1' } } as never, miss as never, next);
        expect(next).toHaveBeenCalledOnce();
        miss.json({ success: true, data: { id: 'new' } });
        expect(miss.headers['X-Cache']).toBe('MISS');

        const failed = mockResponse();
        let continued = false;
        CacheHelpers.cacheApiResponse(
            { method: 'GET', originalUrl: '/skip', query: {} } as never,
            failed as never,
            () => {
                continued = true;
            },
        );
        await vi.waitFor(() => {
            if (!continued) throw new Error('cache middleware has not continued');
        });
        failed.json({ success: false });
        expect(failed.headers['X-Cache']).toBe('MISS');

        await cache.set('api:GET:/cached:{}', { success: true, data: 'hit' }, { ttl: 30 });
        const apiHit = mockResponse();
        const apiNext = vi.fn();
        CacheHelpers.cacheApiResponse(
            { method: 'GET', originalUrl: '/cached', query: {} } as never,
            apiHit as never,
            apiNext,
        );
        await vi.waitFor(() => {
            if (apiHit.headers['X-Cache'] !== 'HIT') throw new Error('waiting for api cache hit');
        });
        expect(apiNext).not.toHaveBeenCalled();

        const cached = await CacheHelpers.cacheDatabaseQuery('db:users', async () => ['u1'], { ttl: 10 });
        expect(cached).toEqual(['u1']);
        expect(await CacheHelpers.cacheDatabaseQuery('db:users', async () => ['other'])).toEqual(['u1']);

        await CacheHelpers.invalidatePattern('db:');
        await CacheHelpers.invalidatePattern('none');
    });

    it('decorates a method with cache lookups', async () => {
        const calls = vi.fn(async (id: string) => ({ id }));

        class Agents {
            load(id: string) {
                return calls(id);
            }
        }

        const descriptor = Object.getOwnPropertyDescriptor(Agents.prototype, 'load');
        if (!descriptor) throw new Error('missing load descriptor');
        CacheManager.cache({ ttl: 15 })(Agents.prototype, 'load', descriptor);
        Object.defineProperty(Agents.prototype, 'load', descriptor);

        const agents = new Agents();
        expect(await agents.load('a1')).toEqual({ id: 'a1' });
        expect(await agents.load('a1')).toEqual({ id: 'a1' });
        expect(calls).toHaveBeenCalledOnce();
    });
});
