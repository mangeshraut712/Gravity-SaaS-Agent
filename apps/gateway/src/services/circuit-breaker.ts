/**
 * Circuit Breaker Pattern Implementation
 * Protects external API calls from cascading failures
 */

import { logger } from './logger.js';

export interface CircuitBreakerConfig {
    name: string;
    failureThreshold: number; // Number of failures before opening
    successThreshold: number; // Number of successes before closing
    timeout: number; // Time to wait before trying again (ms)
    monitoringWindow: number; // Time window for failure counting (ms)
}

export interface CircuitBreakerState {
    status: 'closed' | 'open' | 'half-open';
    failureCount: number;
    successCount: number;
    lastFailure: Date | null;
    lastSuccess: Date | null;
    nextAttempt: Date | null;
}

export type CircuitBreakerEventType = 'success' | 'failure' | 'timeout' | 'reject' | 'reset';

export interface CircuitBreakerEvent {
    type: CircuitBreakerEventType;
    timestamp: Date;
    duration?: number;
    error?: Error;
}

export type CircuitBreakerEventHandler = (event: CircuitBreakerEvent) => void;

export class CircuitBreaker {
    private config: CircuitBreakerConfig;
    private state: CircuitBreakerState;
    private eventHistory: CircuitBreakerEvent[] = [];
    private eventHandlers: Map<CircuitBreakerEventType, CircuitBreakerEventHandler[]> = new Map();
    private timeoutId: NodeJS.Timeout | null = null;

    constructor(config: CircuitBreakerConfig) {
        this.config = config;
        this.state = {
            status: 'closed',
            failureCount: 0,
            successCount: 0,
            lastFailure: null,
            lastSuccess: null,
            nextAttempt: null,
        };
        this.startMonitoring();
    }

    private startMonitoring(): void {
        // Clean up old events periodically
        setInterval(() => {
            this.cleanupOldEvents();
        }, this.config.monitoringWindow);
    }

    private cleanupOldEvents(): void {
        const cutoff = Date.now() - this.config.monitoringWindow;
        this.eventHistory = this.eventHistory.filter(e => e.timestamp.getTime() > cutoff);

        // Reset counts if window has passed
        if (this.state.status === 'closed') {
            this.state.failureCount = 0;
            this.state.successCount = 0;
        }
    }

    getState(): CircuitBreakerState {
        return { ...this.state };
    }

    getConfig(): CircuitBreakerConfig {
        return { ...this.config };
    }

    on(event: CircuitBreakerEventType, handler: CircuitBreakerEventHandler): void {
        const handlers = this.eventHandlers.get(event) || [];
        handlers.push(handler);
        this.eventHandlers.set(event, handlers);
    }

    off(event: CircuitBreakerEventType, handler: CircuitBreakerEventHandler): void {
        const handlers = this.eventHandlers.get(event) || [];
        const index = handlers.indexOf(handler);
        if (index > -1) {
            handlers.splice(index, 1);
            this.eventHandlers.set(event, handlers);
        }
    }

    private emit(event: CircuitBreakerEvent): void {
        this.eventHistory.push(event);

        const handlers = this.eventHandlers.get(event.type) || [];
        for (const handler of handlers) {
            try {
                handler(event);
            } catch (error) {
                logger.error('Circuit breaker event handler error', { error });
            }
        }
    }

    async execute<T>(fn: () => Promise<T>): Promise<T> {
        // Check if we should reject immediately
        if (this.state.status === 'open') {
            const now = new Date();
            if (this.state.nextAttempt && now >= this.state.nextAttempt) {
                // Transition to half-open
                this.state.status = 'half-open';
                this.state.successCount = 0;
                this.state.failureCount = 0;
                this.emit({ type: 'reset', timestamp: now });
                logger.info(`Circuit breaker ${this.config.name} entering half-open state`);
            } else {
                // Still open, reject immediately
                this.emit({ type: 'reject', timestamp: new Date() });
                throw new CircuitBreakerError('Circuit breaker is open', this.config.name, this.state);
            }
        }

        // Execute the function with timeout
        const startTime = Date.now();
        try {
            const timeoutPromise = new Promise<never>((_, reject) => {
                const timeoutId = setTimeout(() => {
                    reject(new CircuitBreakerError('Function timeout', this.config.name, this.state));
                }, this.config.timeout);
            });

            const result = await Promise.race([fn(), timeoutPromise]);

            const duration = Date.now() - startTime;
            this.handleSuccess(duration);
            return result;
        } catch (error) {
            const duration = Date.now() - startTime;
            this.handleError(error as Error, duration);
            throw error;
        }
    }

    private handleSuccess(duration: number): void {
        const now = new Date();

        if (this.state.status === 'half-open') {
            this.state.successCount++;

            if (this.state.successCount >= this.config.successThreshold) {
                // Close the circuit
                this.state.status = 'closed';
                this.state.failureCount = 0;
                this.state.successCount = 0;
                this.state.lastSuccess = now;
                this.state.nextAttempt = null;
                this.emit({ type: 'success', timestamp: now, duration });
                logger.info(`Circuit breaker ${this.config.name} closed after ${this.state.successCount} successes`);
            } else {
                this.state.lastSuccess = now;
                this.emit({ type: 'success', timestamp: now, duration });
            }
        } else if (this.state.status === 'closed') {
            this.state.successCount++;
            this.state.lastSuccess = now;
            this.emit({ type: 'success', timestamp: now, duration });
        }
    }

    private handleError(error: Error, duration: number): void {
        const now = new Date();

        this.state.failureCount++;
        this.state.lastFailure = now;
        this.emit({ type: 'failure', timestamp: now, duration, error });

        if (this.state.status === 'half-open') {
            // Any failure in half-open opens the circuit again
            this.state.status = 'open';
            this.state.nextAttempt = new Date(Date.now() + this.config.timeout);
            logger.warn(`Circuit breaker ${this.config.name} opened after half-open failure`);
        } else if (this.state.status === 'closed') {
            // Check if we've reached the failure threshold
            if (this.state.failureCount >= this.config.failureThreshold) {
                this.state.status = 'open';
                this.state.nextAttempt = new Date(Date.now() + this.config.timeout);
                logger.warn(`Circuit breaker ${this.config.name} opened after ${this.state.failureCount} failures`);
            }
        }
    }

    reset(): void {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        this.state = {
            status: 'closed',
            failureCount: 0,
            successCount: 0,
            lastFailure: null,
            lastSuccess: null,
            nextAttempt: null,
        };
        this.eventHistory = [];
        this.emit({ type: 'reset', timestamp: new Date() });
        logger.info(`Circuit breaker ${this.config.name} reset`);
    }

    forceOpen(): void {
        this.state.status = 'open';
        this.state.nextAttempt = new Date(Date.now() + this.config.timeout);
        logger.info(`Circuit breaker ${this.config.name} force opened`);
    }

    forceClose(): void {
        this.state.status = 'closed';
        this.state.failureCount = 0;
        this.state.successCount = 0;
        this.state.nextAttempt = null;
        logger.info(`Circuit breaker ${this.config.name} force closed`);
    }

    getStats(): CircuitBreakerStats {
        const recentFailures = this.eventHistory.filter(
            e => e.type === 'failure' && e.timestamp.getTime() > Date.now() - this.config.monitoringWindow
        ).length;

        const recentSuccesses = this.eventHistory.filter(
            e => e.type === 'success' && e.timestamp.getTime() > Date.now() - this.config.monitoringWindow
        ).length;

        return {
            name: this.config.name,
            status: this.state.status,
            failureCount: this.state.failureCount,
            successCount: this.state.successCount,
            recentFailures,
            recentSuccesses,
            failureRate: recentFailures + recentSuccesses > 0
                ? recentFailures / (recentFailures + recentSuccesses)
                : 0,
            lastFailure: this.state.lastFailure,
            lastSuccess: this.state.lastSuccess,
            nextAttempt: this.state.nextAttempt,
        };
    }
}

export interface CircuitBreakerStats {
    name: string;
    status: 'closed' | 'open' | 'half-open';
    failureCount: number;
    successCount: number;
    recentFailures: number;
    recentSuccesses: number;
    failureRate: number;
    lastFailure: Date | null;
    lastSuccess: Date | null;
    nextAttempt: Date | null;
}

export class CircuitBreakerError extends Error {
    circuitName: string;
    state: CircuitBreakerState;

    constructor(message: string, circuitName: string, state: CircuitBreakerState) {
        super(message);
        this.name = 'CircuitBreakerError';
        this.circuitName = circuitName;
        this.state = state;
    }
}

// Circuit Breaker Manager - manages multiple circuit breakers
export class CircuitBreakerManager {
    private breakers: Map<string, CircuitBreaker> = new Map();

    create(name: string, config: Omit<CircuitBreakerConfig, 'name'>): CircuitBreaker {
        const breaker = new CircuitBreaker({ ...config, name });
        this.breakers.set(name, breaker);
        logger.info(`Circuit breaker created: ${name}`);
        return breaker;
    }

    get(name: string): CircuitBreaker | undefined {
        return this.breakers.get(name);
    }

    remove(name: string): boolean {
        const breaker = this.breakers.get(name);
        if (breaker) {
            breaker.reset();
            return this.breakers.delete(name);
        }
        return false;
    }

    getAllStats(): CircuitBreakerStats[] {
        return Array.from(this.breakers.values()).map(b => b.getStats());
    }

    resetAll(): void {
        for (const breaker of this.breakers.values()) {
            breaker.reset();
        }
    }
}

// Export singleton instances
export const circuitBreakerManager = new CircuitBreakerManager();

// Pre-configured circuit breakers for common services
export const openRouterBreaker = circuitBreakerManager.create('openrouter', {
    failureThreshold: 5,
    successThreshold: 3,
    timeout: 30000, // 30 seconds
    monitoringWindow: 60000, // 1 minute window
});

export const databaseBreaker = circuitBreakerManager.create('database', {
    failureThreshold: 3,
    successThreshold: 2,
    timeout: 10000, // 10 seconds
    monitoringWindow: 30000, // 30 second window
});

export default CircuitBreaker;
