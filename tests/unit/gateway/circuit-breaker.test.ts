import { afterEach, describe, expect, it, vi } from 'vitest';
import { CircuitBreaker, CircuitBreakerError, CircuitBreakerManager } from '../../../apps/gateway/src/services/circuit-breaker.js';

const config = {
    name: 'test-cb',
    failureThreshold: 2,
    successThreshold: 2,
    timeout: 1000,
    monitoringWindow: 5000,
};

describe('CircuitBreaker', () => {
    const created: CircuitBreaker[] = [];

    afterEach(() => {
        for (const breaker of created) breaker.destroy();
        created.length = 0;
    });

    function create(overrides: Partial<typeof config> = {}) {
        const breaker = new CircuitBreaker({ ...config, ...overrides });
        created.push(breaker);
        return breaker;
    }

    it('starts closed and reports a copy of its state', () => {
        const breaker = create();
        const state = breaker.getState();
        state.failureCount = 9;
        expect(breaker.getState()).toMatchObject({ status: 'closed', failureCount: 0 });
        expect(breaker.getConfig().name).toBe('test-cb');
    });

    it('opens after the failure threshold and rejects calls', async () => {
        const breaker = create();
        const failing = () => Promise.reject(new Error('fail'));

        await expect(breaker.execute(failing)).rejects.toThrow('fail');
        expect(breaker.getState().status).toBe('closed');
        await expect(breaker.execute(failing)).rejects.toThrow('fail');
        expect(breaker.getState().status).toBe('open');

        const spy = vi.fn().mockResolvedValue('ok');
        await expect(breaker.execute(spy)).rejects.toBeInstanceOf(CircuitBreakerError);
        expect(spy).not.toHaveBeenCalled();
    });

    it('moves through half-open and closes after enough successes', async () => {
        vi.useFakeTimers();
        const breaker = create({ failureThreshold: 1, successThreshold: 2, timeout: 500 });
        await expect(breaker.execute(() => Promise.reject(new Error('fail')))).rejects.toThrow('fail');

        await vi.advanceTimersByTimeAsync(500);
        await expect(breaker.execute(() => Promise.resolve('ok'))).resolves.toBe('ok');
        expect(breaker.getState().status).toBe('half-open');
        await expect(breaker.execute(() => Promise.resolve('done'))).resolves.toBe('done');
        expect(breaker.getState().status).toBe('closed');
    });

    it('reopens when a half-open call fails', async () => {
        vi.useFakeTimers();
        const breaker = create({ failureThreshold: 1, timeout: 200 });
        await expect(breaker.execute(() => Promise.reject(new Error('fail')))).rejects.toThrow('fail');
        await vi.advanceTimersByTimeAsync(200);
        await expect(breaker.execute(() => Promise.reject(new Error('again')))).rejects.toThrow('again');
        expect(breaker.getState().status).toBe('open');
    });

    it('times out slow calls', async () => {
        vi.useFakeTimers();
        const breaker = create({ timeout: 250, failureThreshold: 5 });
        const pending = breaker.execute(() => new Promise(() => undefined));
        const assertion = expect(pending).rejects.toThrow(/timeout/i);
        await vi.advanceTimersByTimeAsync(250);
        await assertion;
        expect(breaker.getState().failureCount).toBe(1);
    });

    it('emits events and isolates handler failures', async () => {
        const breaker = create({ failureThreshold: 5 });
        const success = vi.fn();
        const broken = vi.fn(() => {
            throw new Error('handler blew up');
        });
        breaker.on('success', success);
        breaker.on('success', broken);
        await breaker.execute(() => Promise.resolve('ok'));
        expect(success).toHaveBeenCalledOnce();
        expect(broken).toHaveBeenCalledOnce();

        breaker.off('success', broken);
        await breaker.execute(() => Promise.resolve('ok'));
        expect(broken).toHaveBeenCalledOnce();
        breaker.off('failure', broken);
    });

    it('resets counts when the monitoring window elapses', async () => {
        vi.useFakeTimers();
        const breaker = create({ failureThreshold: 5, monitoringWindow: 1000 });
        await expect(breaker.execute(() => Promise.reject(new Error('fail')))).rejects.toThrow('fail');
        expect(breaker.getState().failureCount).toBe(1);
        await vi.advanceTimersByTimeAsync(1000);
        expect(breaker.getState().failureCount).toBe(0);
    });

    it('supports manual open, close, reset, and stats', async () => {
        const breaker = create();
        await breaker.execute(() => Promise.resolve('ok'));
        breaker.forceOpen();
        expect(breaker.getState().status).toBe('open');
        breaker.forceClose();
        expect(breaker.getState().status).toBe('closed');

        await expect(breaker.execute(() => Promise.reject(new Error('fail')))).rejects.toThrow('fail');
        const stats = breaker.getStats();
        expect(stats.recentFailures).toBe(1);
        expect(stats.failureRate).toBeGreaterThan(0);

        breaker.reset();
        expect(breaker.getState()).toMatchObject({ status: 'closed', failureCount: 0 });
        expect(breaker.getStats().failureRate).toBe(0);
    });
});

describe('CircuitBreakerManager', () => {
    it('creates, reads, resets, and removes breakers', () => {
        const manager = new CircuitBreakerManager();
        const breaker = manager.create('billing', {
            failureThreshold: 1,
            successThreshold: 1,
            timeout: 1000,
            monitoringWindow: 1000,
        });
        expect(manager.get('billing')).toBe(breaker);
        expect(manager.getAllStats()).toHaveLength(1);
        manager.resetAll();
        expect(manager.remove('billing')).toBe(true);
        expect(manager.remove('billing')).toBe(false);
        breaker.destroy();
    });
});
