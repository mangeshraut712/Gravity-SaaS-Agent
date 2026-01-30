import { Request, Response } from 'express';
import { Redis } from 'ioredis';
import { ApiResponse } from '@gravity/types';

export interface CacheOptions {
    ttl?: number; // Time to live in seconds
    tags?: string[]; // Cache tags for invalidation
    compress?: boolean; // Compress cached data
}

export interface CacheEntry<T> {
    data: T;
    timestamp: Date;
    ttl: number;
    tags?: string[];
    compressed?: boolean;
}

export class CacheManager {
    private redis: Redis;
    private defaultTTL: number = 300; // 5 minutes
    private keyPrefix: string = 'gravityos:';

    constructor(redisUrl?: string) {
        this.redis = new Redis(redisUrl || process.env.REDIS_URL || 'redis://localhost:6379');

        this.redis.on('error', (error: any) => {
            console.error('[Cache] Redis error:', error);
        });

        this.redis.on('connect', () => {
            console.log('[Cache] Connected to Redis');
        });
    }

    private getKey(key: string): string {
        return `${this.keyPrefix}${key}`;
    }

    private serialize<T>(data: T, compress: boolean = false): string {
        const serialized = JSON.stringify({
            data,
            timestamp: new Date(),
            compressed: compress
        });

        if (compress) {
            // In production, use proper compression
            return Buffer.from(serialized).toString('base64');
        }

        return serialized;
    }

    private deserialize<T>(serialized: string): T | null {
        try {
            const parsed = JSON.parse(serialized);
            return parsed.data;
        } catch (error: any) {
            console.error('[Cache] Deserialization error:', error);
            return null;
        }
    }

    async get<T>(key: string, options?: CacheOptions): Promise<T | null> {
        try {
            const fullKey = this.getKey(key);
            const serialized = await this.redis.get(fullKey);

            if (!serialized) {
                return null;
            }

            const entry: CacheEntry<T> = JSON.parse(serialized);

            // Check if expired
            const now = new Date();
            const expiryTime = new Date(entry.timestamp.getTime() + entry.ttl * 1000);

            if (now > expiryTime) {
                await this.redis.del(fullKey);
                return null;
            }

            console.log(`[Cache] Cache hit: ${key}`);
            return entry.data;
        } catch (error: any) {
            console.error(`[Cache] Get error for ${key}:`, error);
            return null;
        }
    }

    async set<T>(key: string, data: T, options: CacheOptions = {}): Promise<void> {
        try {
            const fullKey = this.getKey(key);
            const ttl = options.ttl || this.defaultTTL;

            const entry: CacheEntry<T> = {
                data,
                timestamp: new Date(),
                ttl,
                tags: options.tags,
                compressed: options.compress || false
            };

            const serialized = JSON.stringify(entry);

            if (options.tags && options.tags.length > 0) {
                // Store tag mappings for invalidation
                await Promise.all(
                    options.tags.map(tag =>
                        this.redis.sadd(`${this.keyPrefix}tag:${tag}`, fullKey)
                    )
                );
            }

            await this.redis.setex(fullKey, ttl, serialized);
            console.log(`[Cache] Cache set: ${key} (TTL: ${ttl}s)`);
        } catch (error: any) {
            console.error(`[Cache] Set error for ${key}:`, error);
        }
    }

    async del(key: string): Promise<void> {
        try {
            const fullKey = this.getKey(key);
            await this.redis.del(fullKey);
            console.log(`[Cache] Cache deleted: ${key}`);
        } catch (error: any) {
            console.error(`[Cache] Delete error for ${key}:`, error);
        }
    }

    async invalidateTag(tag: string): Promise<void> {
        try {
            const tagKey = `${this.keyPrefix}tag:${tag}`;
            const keys = await this.redis.smembers(tagKey);

            if (keys.length > 0) {
                await this.redis.del(...keys);
                console.log(`[Cache] Invalidated tag ${tag}: ${keys.length} keys`);
            }

            await this.redis.del(tagKey);
        } catch (error: any) {
            console.error(`[Cache] Tag invalidation error for ${tag}:`, error);
        }
    }

    async invalidateTags(tags: string[]): Promise<void> {
        await Promise.all(tags.map(tag => this.invalidateTag(tag)));
    }

    async clear(): Promise<void> {
        try {
            const pattern = `${this.keyPrefix}*`;
            const keys = await this.redis.keys(pattern);

            if (keys.length > 0) {
                await this.redis.del(...keys);
                console.log(`[Cache] Cleared ${keys.length} keys`);
            }
        } catch (error: any) {
            console.error('[Cache] Clear error:', error);
        }
    }

    async getStats(): Promise<{
        totalKeys: number;
        memoryUsage: string;
        connected: boolean;
        lastError?: string;
    }> {
        try {
            const info = await this.redis.info('memory');
            const memoryUsage = info.split('\r\n')
                .find((line: any) => line.startsWith('used_memory_human:'))
                ?.split(':')[1] || 'N/A';

            const keys = await this.redis.dbsize();

            return {
                totalKeys: keys,
                memoryUsage,
                connected: this.redis.status === 'ready'
            };
        } catch (error: any) {
            return {
                totalKeys: 0,
                memoryUsage: 'N/A',
                connected: false,
                lastError: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    // Cache middleware factory
    static cacheMiddleware(options: CacheOptions = {}) {
        return async (req: Request, res: Response, next: Function) => {
            const cacheKey = `req:${req.method}:${req.originalUrl}:${JSON.stringify(req.query)}`;

            // Try to get from cache first
            const cacheManager = new CacheManager();
            const cached = await cacheManager.get<ApiResponse>(cacheKey, options);

            if (cached) {
                res.set('X-Cache', 'HIT');
                return res.json(cached);
            }

            // Intercept response to cache it
            const originalJson = res.json;
            res.json = function (data: any) {
                // Only cache successful responses
                if (data && data.success !== false) {
                    cacheManager.set(cacheKey, data, options).catch((error: any) => {
                        console.error('[Cache] Failed to cache response:', error);
                    });
                }
                res.set('X-Cache', 'MISS');
                return originalJson.call(this, data);
            };

            next();
        };
    }

    // Cache decorator for methods
    static cache(options: CacheOptions = {}) {
        return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
            const method = descriptor.value;

            descriptor.value = async function (...args: any[]) {
                const cacheKey = `${target.constructor.name}:${propertyName}:${JSON.stringify(args)}`;
                const cacheManager = new CacheManager();

                // Try to get from cache
                const cached = await cacheManager.get(cacheKey, options);
                if (cached !== null) {
                    return cached;
                }

                // Execute method and cache result
                const result = await method.apply(this, args);
                await cacheManager.set(cacheKey, result, options);

                return result;
            };
        };
    }
}

// Cache helper functions
export const CacheHelpers = {
    // Cache API responses
    cacheApiResponse: (req: Request, res: Response, next: Function) => {
        const cacheManager = new CacheManager();
        const cacheKey = `api:${req.method}:${req.originalUrl}:${JSON.stringify(req.query)}`;

        cacheManager.get(cacheKey).then(cached => {
            if (cached) {
                res.set('X-Cache', 'HIT');
                return res.json(cached);
            }

            const originalJson = res.json;
            res.json = function (data: any) {
                if (data && data.success !== false) {
                    cacheManager.set(cacheKey, data, { ttl: 300 }).catch((error: any) => {
                        console.error('[Cache] Failed to cache API response:', error);
                    });
                }
                res.set('X-Cache', 'MISS');
                return originalJson.call(this, data);
            };

            next();
        }).catch((error: any) => {
            console.error('[Cache] Error in middleware:', error);
            next();
        });
    },

    // Cache database queries
    cacheDatabaseQuery: async <T>(
        key: string,
        query: () => Promise<T>,
        options: CacheOptions = {}
    ): Promise<T> => {
        const cacheManager = new CacheManager();

        // Try to get from cache
        const cached = await cacheManager.get<T>(key, options);
        if (cached !== null) {
            return cached;
        }

        // Execute query and cache result
        const result = await query();
        await cacheManager.set(key, result, options);

        return result;
    },

    // Invalidate cache by pattern
    invalidatePattern: async (pattern: string): Promise<void> => {
        const cacheManager = new CacheManager();
        const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

        try {
            const keys = await redis.keys(`gravityos:${pattern}*`);
            if (keys.length > 0) {
                await redis.del(...keys);
                console.log(`[Cache] Invalidated pattern ${pattern}: ${keys.length} keys`);
            }
        } catch (error: any) {
            console.error(`[Cache] Pattern invalidation error:`, error);
        } finally {
            await redis.quit();
        }
    }
};

export default CacheManager;
