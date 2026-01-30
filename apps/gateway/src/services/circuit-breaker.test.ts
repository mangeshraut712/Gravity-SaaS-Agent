import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CircuitBreaker, CircuitBreakerState } from './circuit-breaker';

describe('CircuitBreaker', () => {
    it('should start in CLOSED state', () => {
        const cb = new CircuitBreaker('test-cb');
        expect(cb.getState()).toBe(CircuitBreakerState.CLOSED);
    });

    it('should transition to OPEN after reaching threshold', async () => {
        const cb = new CircuitBreaker('test-cb', {
            failureThreshold: 2,
            resetTimeout: 1000,
        });

        const failingFn = () => Promise.reject(new Error('fail'));

        await expect(cb.execute(failingFn)).rejects.toThrow('fail');
        expect(cb.getState()).toBe(CircuitBreakerState.CLOSED);

        await expect(cb.execute(failingFn)).rejects.toThrow('fail');
        expect(cb.getState()).toBe(CircuitBreakerState.OPEN);
    });

    it('should prevent execution when OPEN', async () => {
        const cb = new CircuitBreaker('test-cb', {
            failureThreshold: 1,
            resetTimeout: 1000,
        });

        await expect(cb.execute(() => Promise.reject('fail'))).rejects.toBeDefined();
        expect(cb.getState()).toBe(CircuitBreakerState.OPEN);

        await expect(cb.execute(() => Promise.resolve('ok'))).rejects.toThrow('Circuit breaker is OPEN');
    });

    it('should transition to HALF_OPEN after timeout', async () => {
        vi.useFakeTimers();
        const cb = new CircuitBreaker('test-cb', {
            failureThreshold: 1,
            resetTimeout: 1000,
        });

        await expect(cb.execute(() => Promise.reject('fail'))).rejects.toBeDefined();
        expect(cb.getState()).toBe(CircuitBreakerState.OPEN);

        vi.advanceTimersByTime(1001);

        // The state transition happens on the next execution attempt or via a timer if implemented
        // In our implementation, it usually happens on execute()
        await expect(cb.execute(() => Promise.resolve('ok'))).resolves.toBe('ok');
        expect(cb.getState()).toBe(CircuitBreakerState.CLOSED);
        vi.useRealTimers();
    });
});
