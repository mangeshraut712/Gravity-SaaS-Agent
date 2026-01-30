/**
 * Advanced Cache Manager
 * Multi-layer caching with Redis and in-memory LRU
 */

import { Redis } from 'ioredis';
import { logger } from './logger.js';

export interface CacheConfig {
    ttl?: number;
    tags?: string[];
    compression?: boolean;
}

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number;
    tags?: string[];
}

// Simple LRU Cache implementation for in-memory caching
class LRUCache<T> {
    private cache: Map<string, CacheEntry<T>>;
    private maxSize: number;

    constructor(maxSize: number = 1000) {
        this.cache = new Map();
        this.maxSize = maxSize;
    }

    get(key: string): CacheEntry<T> | undefined {
        const entry = this.cache.get(key);
        if (!entry) return undefined;

        // Check if expired
        if (Date.now() - entry.timestamp > entry.ttl * 1000) {
            this.cache.delete(key);
            return undefined;
        }

        // Move to end (most recently used)
        this.cache.delete(key);
        this.cache.set(key, entry);
        return entry;
    }

    set(key: string, entry: CacheEntry<T>): void {
        if (this.cache.size >= this.maxSize) {
            // Remove oldest entry
            const firstKey = this.cache.keys().next().value;
            if (firstKey) {
                this.cache.delete(firstKey);
            }
        }
        this.cache.set(key, entry);
    }

    delete(key: string): void {
        this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }
}

export class CacheManager {
    private redis: Redis | null = null;
    private localCache: LRUCache<any>;
    private keyPrefix: string = 'gravity:';
    private defaultTTL: number = 300; // 5 minutes

    constructor(redisUrl?: string) {
        this.localCache = new LRUCache(1000);

        const redisConnectionUrl = redisUrl || process.env.REDIS_URL;
        if (redisConnectionUrl) {
            try {
                this.redis = new Redis(redisConnectionUrl);
                this.redis.on('error', (err) => {
                    logger.error('Redis error', undefined, err);
                    this.redis = null;
                });
                logger.info('Redis cache initialized');
            } catch (error) {
                logger.error('Failed to initialize Redis', undefined, error as Error);
            }
        }
    }

    private getKey(key: string): string {
        return `${this.keyPrefix}${key}`;
    }

    async get<T>(key: string): Promise<T | null> {
        const fullKey = this.getKey(key);

        // Try local cache first
        const localEntry = this.localCache.get(fullKey);
        if (localEntry) {
            logger.debug(`Cache hit (local): ${key}`);
            return localEntry.data;
        }

        // Try Redis if available
        if (this.redis) {
            try {
                const data = await this.redis.get(fullKey);
                if (data) {
                    const parsed = JSON.parse(data);
                    this.localCache.set(fullKey, {
                        data: parsed,
                        timestamp: Date.now(),
                        ttl: this.defaultTTL,
                    });
                    logger.debug(`Cache hit (redis): ${key}`);
                    return parsed;
                }
            } catch (error) {
                logger.error('Redis get error', undefined, error as Error);
            }
        }

        return null;
    }

    async set<T>(key: string, value: T, config?: CacheConfig): Promise<void> {
        const fullKey = this.getKey(key);
        const ttl = config?.ttl || this.defaultTTL;

        // Set in local cache
        this.localCache.set(fullKey, {
            data: value,
            timestamp: Date.now(),
            ttl,
        });

        // Set in Redis if available
        if (this.redis) {
            try {
                const serialized = JSON.stringify(value);
                await this.redis.setex(fullKey, ttl, serialized);

                if (config?.tags) {
                    for (const tag of config.tags) {
                        await this.redis.sadd(`tag:${tag}`, fullKey);
                    }
                }
            } catch (error) {
                logger.error('Redis set error', undefined, error as Error);
            }
        }
    }

    async delete(key: string): Promise<void> {
        const fullKey = this.getKey(key);
        this.localCache.delete(fullKey);

        if (this.redis) {
            try {
                await this.redis.del(fullKey);
            } catch (error) {
                logger.error('Redis delete error', undefined, error as Error);
            }
        }
    }

    async invalidateByTag(tag: string): Promise<void> {
        if (!this.redis) return;

        try {
            const keys = await this.redis.smembers(`tag:${tag}`);
            if (keys.length > 0) {
                await this.redis.del(...keys);
                for (const key of keys) {
                    this.localCache.delete(key);
                }
                await this.redis.del(`tag:${tag}`);
                logger.info(`Invalidated ${keys.length} cache entries for tag: ${tag}`);
            }
        } catch (error) {
            logger.error('Cache invalidation error', undefined, error as Error);
        }
    }

    async clear(): Promise<void> {
        this.localCache.clear();

        if (this.redis) {
            try {
                await this.redis.flushdb();
                logger.info('Cache cleared');
            } catch (error) {
                logger.error('Redis clear error', undefined, error as Error);
            }
        }
    }
}

export const cacheManager = new CacheManager();
