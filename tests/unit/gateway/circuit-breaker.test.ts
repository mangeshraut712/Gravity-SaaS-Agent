import { describe, it, expect, vi } from 'vitest';
import { CircuitBreaker } from './circuit-breaker.js';

describe('CircuitBreaker', () => {
    const defaultConfig = {
        name: 'test-cb',
        failureThreshold: 2,
        successThreshold: 2,
        timeout: 1000,
        monitoringWindow: 5000,
    };

    it('should start in closed state', () => {
        const cb = new CircuitBreaker(defaultConfig);
        expect(cb.getState().status).toBe('closed');
    });

    it('should transition to open after reaching failure threshold', async () => {
        const cb = new CircuitBreaker(defaultConfig);
        const failingFn = () => Promise.reject(new Error('fail'));

        // First failure
        await expect(cb.execute(failingFn)).rejects.toThrow('fail');
        expect(cb.getState().status).toBe('closed');
        expect(cb.getState().failureCount).toBe(1);

        // Second failure
        await expect(cb.execute(failingFn)).rejects.toThrow('fail');
        expect(cb.getState().status).toBe('open');
        expect(cb.getState().failureCount).toBe(2);
    });

    it('should prevent execution when open', async () => {
        const cb = new CircuitBreaker({ ...defaultConfig, failureThreshold: 1 });
        const failingFn = () => Promise.reject(new Error('fail'));

        await expect(cb.execute(failingFn)).rejects.toThrow('fail');
        expect(cb.getState().status).toBe('open');

        // Should reject immediately without calling the function
        const spy = vi.fn().mockResolvedValue('ok');
        await expect(cb.execute(spy)).rejects.toThrow(/circuit breaker is open/i);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should transition to half-open after timeout', async () => {
        vi.useFakeTimers();
        const cb = new CircuitBreaker({ ...defaultConfig, failureThreshold: 1, timeout: 500 });
        const failingFn = () => Promise.reject(new Error('fail'));

        await expect(cb.execute(failingFn)).rejects.toThrow('fail');
        expect(cb.getState().status).toBe('open');

        // Advance time
        vi.advanceTimersByTime(5000); // the timeout is usually the reset timeout which is set in config

        // We need to call execute to trigger the state transition if it happens lazily
        // Actually, the transition happens at the beginning of execute()
        // So we can try to call it and see if it enters half-open

        const successFn = () => Promise.resolve('ok');
        await expect(cb.execute(successFn)).resolves.toBe('ok');

        // After one success in half-open, it might still be half-open if successThreshold > 1
        // Default successThreshold is 2
        expect(cb.getState().status).toBe('half-open');

        vi.useRealTimers();
    });
});
