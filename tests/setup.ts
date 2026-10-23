import { beforeEach, afterEach, vi } from 'vitest';

const { redisStore } = vi.hoisted(() => {
    const redisStore = new Map<string, string | Set<string>>();
    return { redisStore };
});

vi.mock('ioredis', () => {
    class Redis {
        status = 'ready';
        constructor(_url?: string) {}
        on() {
            return this;
        }
        async get(key: string) {
            if ((globalThis as { __redisFail?: string }).__redisFail === 'get') {
                throw new Error('redis get failed');
            }
            const value = redisStore.get(key);
            return typeof value === 'string' ? value : null;
        }
        async setex(key: string, _ttl: number, value: string) {
            if ((globalThis as { __redisFail?: string }).__redisFail === 'set') {
                throw new Error('redis set failed');
            }
            redisStore.set(key, value);
        }
        async del(...keys: string[]) {
            const flat = keys.flat() as string[];
            for (const key of flat) redisStore.delete(key);
            return flat.length;
        }
        async sadd(key: string, member: string) {
            const existing = redisStore.get(key);
            const set = existing instanceof Set ? existing : new Set<string>();
            set.add(member);
            redisStore.set(key, set);
            return 1;
        }
        async smembers(key: string) {
            const value = redisStore.get(key);
            return value instanceof Set ? [...value] : [];
        }
        async keys(pattern: string) {
            const regex = new RegExp('^' + pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$');
            return [...redisStore.keys()].filter((key) => regex.test(key));
        }
        async dbsize() {
            return [...redisStore.values()].filter((value) => typeof value === 'string').length;
        }
        async info() {
            if ((globalThis as { __redisFail?: string }).__redisFail === 'info') {
                throw new Error('redis info failed');
            }
            return 'used_memory_human:1.00M\r\n';
        }
        async quit() {
            return 'OK';
        }
        async flushdb() {
            redisStore.clear();
        }
    }

    return { Redis };
});

beforeEach(() => {
    redisStore.clear();
    delete (globalThis as { __redisFail?: string }).__redisFail;
    vi.clearAllMocks();
});

afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
});
