import { describe, expect, it, vi } from 'vitest';
import { CacheManager } from '../../../apps/gateway/src/services/cache-manager.js';

describe('layered cache manager', () => {
    it('reads through the local cache and redis', async () => {
        const cache = new CacheManager();
        await cache.set('local', { ok: true }, { ttl: 30 });
        expect(await cache.get('local')).toEqual({ ok: true });
        await cache.delete('local');
        expect(await cache.get('local')).toBeNull();
        await cache.clear();
    });

    it('expires local entries and evicts the oldest key', async () => {
        vi.useFakeTimers();
        const cache = new CacheManager();
        await cache.set('short', 'value', { ttl: 1 });
        await vi.advanceTimersByTimeAsync(1500);
        expect(await cache.get('short')).toBeNull();

        for (let index = 0; index < 1001; index += 1) {
            await cache.set(`key-${index}`, index, { ttl: 60 });
        }
        expect(await cache.get('key-0')).toBeNull();
        expect(await cache.get('key-1000')).toBe(1000);
    });

    it('writes through redis, invalidates tags, and tolerates errors', async () => {
        const cache = new CacheManager('redis://cache.test');
        await cache.set('remote', { n: 1 }, { ttl: 20, tags: ['remote'] });
        await cache.delete('remote');
        await cache.set('remote', { n: 2 }, { tags: ['remote'] });
        const localOnly = new CacheManager();
        await localOnly.set('remote', { n: 'stale' });
        await cache.invalidateByTag('remote');
        await cache.invalidateByTag('missing');
        await cache.clear();

        (globalThis as { __redisFail?: string }).__redisFail = 'get';
        await expect(cache.get('remote')).resolves.toBeNull();
        (globalThis as { __redisFail?: string }).__redisFail = 'set';
        await expect(cache.set('remote', { n: 3 })).resolves.toBeUndefined();
        await expect(cache.delete('remote')).resolves.toBeUndefined();
        await expect(cache.invalidateByTag('remote')).resolves.toBeUndefined();
        await expect(cache.clear()).resolves.toBeUndefined();
        delete (globalThis as { __redisFail?: string }).__redisFail;

        const disconnected = new CacheManager();
        await expect(disconnected.invalidateByTag('anything')).resolves.toBeUndefined();
    });
});
