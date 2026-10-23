import { describe, expect, it, vi } from 'vitest';
import { LogLevel, createLogger, getRequestContext, logger } from '../../../apps/gateway/src/services/logger.js';
import { HeartbeatService } from '../../../apps/gateway/src/services/heartbeat.js';
import { SubscriptionService } from '../../../apps/gateway/src/services/billing/subscription.js';
import { GravityDB } from '@gravity/db';
import { EventEmitter } from 'node:events';

describe('logger', () => {
    it('logs each level, skips debug by default, and builds request context', () => {
        const debug = vi.spyOn(console, 'debug').mockImplementation(() => undefined);
        const info = vi.spyOn(console, 'log').mockImplementation(() => undefined);
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
        const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);

        logger.debug('hidden');
        expect(debug).not.toHaveBeenCalled();

        const config = (logger as unknown as { config: { minLevel: LogLevel; jsonFormat: boolean; enableFile: boolean } }).config;
        const previous = { minLevel: config.minLevel, jsonFormat: config.jsonFormat, enableFile: config.enableFile };
        config.minLevel = LogLevel.DEBUG;
        config.jsonFormat = true;
        config.enableFile = true;

        try {
            logger.debug('debug', { requestId: '1' }, { extra: true });
            logger.info('info');
            logger.warn('warn', undefined, new Error('careful'));
            logger.error('error');
            logger.fatal('fatal', { userId: 'u' }, new Error('down'));
            expect(debug).toHaveBeenCalled();
            expect(info).toHaveBeenCalled();
            expect(warn).toHaveBeenCalled();
            expect(error).toHaveBeenCalled();
            expect(String(error.mock.calls.at(-1)?.[0])).toContain('"level":"FATAL"');

            const child = logger.child({ service: 'child' });
            child.info('from child', { requestId: 'child-req' });
            expect(String(info.mock.calls.at(-1)?.[0])).toContain('child-req');
        } finally {
            config.minLevel = previous.minLevel;
            config.jsonFormat = previous.jsonFormat;
            config.enableFile = previous.enableFile;
        }

        expect(createLogger({ service: 'other' })).toBe(logger);
        expect(getRequestContext({ requestId: 'req', user: { id: 'user-1' } } as never)).toMatchObject({
            requestId: 'req',
            userId: 'user-1',
        });
    });

    it('records request completion from the express middleware', () => {
        const info = vi.spyOn(console, 'log').mockImplementation(() => undefined);
        const res = new EventEmitter() as EventEmitter & { statusCode: number };
        res.statusCode = 201;
        logger.requestLogger()(
            { method: 'POST', path: '/chat', ip: '127.0.0.1', get: () => undefined } as never,
            res,
            () => undefined,
        );
        res.emit('finish');
        expect(info).toHaveBeenCalled();
    });
});

describe('HeartbeatService', () => {
    it('runs callbacks and keeps going when one throws', async () => {
        vi.useFakeTimers();
        const heartbeat = new HeartbeatService(1000);
        const ok = vi.fn(async () => undefined);
        const bad = vi.fn(async () => {
            throw new Error('pulse failed');
        });
        heartbeat.onPulse(ok);
        heartbeat.onPulse(bad);
        heartbeat.start();
        await vi.advanceTimersByTimeAsync(1000);
        expect(ok).toHaveBeenCalledOnce();
        expect(bad).toHaveBeenCalledOnce();
        heartbeat.stop();
        await vi.advanceTimersByTimeAsync(1000);
        expect(ok).toHaveBeenCalledOnce();
        heartbeat.stop();
    });
});

describe('SubscriptionService', () => {
    it('allows users under their quota and describes tier limits', async () => {
        const db = new GravityDB();
        const billing = new SubscriptionService(db);
        expect(await billing.validateAccess('missing')).toEqual({ allowed: false, reason: 'USER_NOT_FOUND' });
        expect(await billing.validateAccess('demo-user')).toEqual({ allowed: true });

        await db.createUser('spent', 'spent@example.com', 'FREE');
        await db.incrementUsage('spent', 50_000);
        expect(await billing.validateAccess('spent')).toEqual({ allowed: false, reason: 'USAGE_LIMIT_EXCEEDED' });

        expect(billing.getTierConfig('FREE')).toEqual({ allowProactiveHeartbeat: false, mcpCap: 2, priority: 0 });
        expect(billing.getTierConfig('PRO').allowProactiveHeartbeat).toBe(true);
        expect(billing.getTierConfig('ENTERPRISE')).toMatchObject({ mcpCap: 50, priority: 1 });
    });
});
