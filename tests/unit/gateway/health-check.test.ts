import os from 'node:os';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HealthCheckService } from '../../../apps/gateway/src/services/health-check.js';

describe('HealthCheckService', () => {
    const services: HealthCheckService[] = [];
    const originalFetch = globalThis.fetch;

    afterEach(() => {
        for (const service of services) service.destroy();
        services.length = 0;
        globalThis.fetch = originalFetch;
        vi.restoreAllMocks();
    });

    function create() {
        const service = new HealthCheckService();
        services.push(service);
        return service;
    }

    it('aggregates pass, warn, and fail checks', async () => {
        const service = create();
        service.register({
            name: 'ok',
            check: async () => ({ status: 'pass', responseTime: 0, lastChecked: '' }),
        });
        let health = await service.getHealthStatus();
        expect(health.status).toBe('healthy');
        expect(health.checks.ok.responseTime).toBeGreaterThanOrEqual(0);

        service.register({
            name: 'slow',
            check: async () => ({ status: 'warn', responseTime: 0, lastChecked: '' }),
        });
        health = await service.getHealthStatus();
        expect(health.status).toBe('degraded');

        service.register({
            name: 'down',
            timeout: 20,
            check: () => new Promise(() => undefined),
        });
        health = await service.getHealthStatus();
        expect(health.status).toBe('unhealthy');
        expect(health.checks.down.message).toMatch(/timeout/i);

        service.register({
            name: 'boom',
            check: async () => {
                throw new Error('db down');
            },
        });
        health = await service.getHealthStatus();
        expect(health.checks.boom.message).toBe('db down');

        service.unregister('down');
        expect((await service.getHealthStatus()).checks.down).toBeUndefined();
    });

    it('reports system metrics and built-in checks', async () => {
        const service = create();
        (service as unknown as { lastEventLoopLag: number }).lastEventLoopLag = 120;
        let metrics = service.getSystemMetrics();
        expect(metrics.eventLoop.status).toBe('blocked');
        expect(metrics.cpu.count).toBeGreaterThan(0);

        (service as unknown as { lastEventLoopLag: number }).lastEventLoopLag = 60;
        expect(service.getSystemMetrics().eventLoop.status).toBe('degraded');

        vi.spyOn(process, 'memoryUsage').mockReturnValue({
            rss: 10,
            heapTotal: 100,
            heapUsed: 10,
            external: 1,
            arrayBuffers: 0,
        } as NodeJS.MemoryUsage);
        expect(service.getSystemMetrics().gc.type).toBe('scavenge');
        vi.spyOn(process, 'memoryUsage').mockReturnValue({
            rss: 90,
            heapTotal: 100,
            heapUsed: 80,
            external: 1,
            arrayBuffers: 0,
        } as NodeJS.MemoryUsage);
        expect(service.getSystemMetrics().gc.type).toBe('mark-sweep');

        const stats = service.getSystemStats();
        expect(stats.status).toBe('online');
        expect(stats.userTier).toBe('PRO');

        const rss = process.memoryUsage().rss;
        vi.spyOn(os, 'totalmem').mockReturnValue(Math.round(rss / 0.95));
        const critical = await HealthCheckService.createMemoryCheck(90).check();
        expect(critical.status).toBe('fail');

        vi.spyOn(os, 'totalmem').mockReturnValue(Math.round(rss / 0.85));
        const warning = await HealthCheckService.createMemoryCheck(90).check();
        expect(warning.status).toBe('warn');

        vi.spyOn(os, 'totalmem').mockReturnValue(rss * 100);
        const normal = await HealthCheckService.createMemoryCheck().check();
        expect(normal.status).toBe('pass');

        expect((await HealthCheckService.createDiskSpaceCheck().check()).status).toBe('pass');
        expect((await HealthCheckService.createDatabaseCheck().check()).message).toContain('healthy');
    });

    it('checks the OpenRouter models endpoint', async () => {
        globalThis.fetch = vi.fn(async () => new Response('{}', { status: 200 })) as typeof fetch;
        const ok = await HealthCheckService.createOpenRouterCheck('https://models.test').check();
        expect(ok.status).toBe('pass');

        globalThis.fetch = vi.fn(async () => new Response('no', { status: 503 })) as typeof fetch;
        const failed = await HealthCheckService.createOpenRouterCheck('https://models.test').check();
        expect(failed.status).toBe('fail');
        expect(failed.message).toContain('503');

        globalThis.fetch = vi.fn(async () => {
            throw new Error('network');
        }) as typeof fetch;
        const thrown = await HealthCheckService.createOpenRouterCheck('https://models.test').check();
        expect(thrown.message).toBe('network');
    });
});
