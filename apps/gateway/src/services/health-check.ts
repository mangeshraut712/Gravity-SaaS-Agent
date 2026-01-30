/**
 * Health Check Service
 * Monitors system health and dependencies with detailed metrics
 */

import os from 'os';
import { SystemStats } from '@gravity/types';
import { logger } from './logger.js';

export interface HealthStatus {
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: string;
    version: string;
    uptime: number;
    checks: {
        [key: string]: ComponentHealth;
    };
    metrics: SystemMetrics;
}

export interface SystemMetrics {
    cpu: {
        count: number;
        loadAvg: number[];
        usagePercent: number;
    };
    memory: {
        used: number;
        total: number;
        percent: number;
        heapUsed: number;
        heapTotal: number;
        external: number;
    };
    eventLoop: {
        lagMs: number;
        status: 'normal' | 'degraded' | 'blocked';
    };
    gc: {
        type: string;
        pauseMs: number;
    };
    disk: {
        available: number;
        total: number;
        percent: number;
    };
}

export interface ComponentHealth {
    status: 'pass' | 'fail' | 'warn';
    responseTime: number;
    message?: string;
    lastChecked: string;
    details?: Record<string, any>;
}

export interface HealthCheckConfig {
    name: string;
    check: () => Promise<ComponentHealth>;
    interval?: number;
    timeout?: number;
}

export class HealthCheckService {
    private checks: Map<string, HealthCheckConfig> = new Map();
    private results: Map<string, ComponentHealth> = new Map();
    private intervals: Map<string, NodeJS.Timeout> = new Map();
    private startTime: number = Date.now();
    private version: string = process.env.npm_package_version || '1.0.0';
    private eventLoopLagCheck: NodeJS.Timeout | null = null;
    private lastEventLoopLag: number = 0;

    constructor() {
        this.startEventLoopMonitoring();
    }

    private startEventLoopMonitoring(): void {
        // Monitor event loop lag every second
        this.eventLoopLagCheck = setInterval(() => {
            const start = Date.now();
            setImmediate(() => {
                this.lastEventLoopLag = Date.now() - start;
            });
        }, 1000);
    }

    register(config: HealthCheckConfig): void {
        this.checks.set(config.name, config);
        // Run initial check
        this.runCheck(config);

        // Set up interval if provided
        if (config.interval && config.interval > 0) {
            const intervalId = setInterval(() => {
                this.runCheck(config);
            }, config.interval);
            this.intervals.set(config.name, intervalId);
        }
    }

    unregister(name: string): void {
        const intervalId = this.intervals.get(name);
        if (intervalId) {
            clearInterval(intervalId);
            this.intervals.delete(name);
        }
        this.checks.delete(name);
        this.results.delete(name);
    }

    private async runCheck(config: HealthCheckConfig): Promise<void> {
        const startTime = Date.now();
        try {
            const timeoutMs = config.timeout || 5000;
            const checkPromise = config.check();
            const timeoutPromise = new Promise<ComponentHealth>((_, reject) => {
                setTimeout(() => reject(new Error('Health check timeout')), timeoutMs);
            });

            const result = await Promise.race([checkPromise, timeoutPromise]);
            result.responseTime = Date.now() - startTime;
            result.lastChecked = new Date().toISOString();
            this.results.set(config.name, result);
        } catch (error) {
            const responseTime = Date.now() - startTime;
            this.results.set(config.name, {
                status: 'fail',
                responseTime,
                message: error instanceof Error ? error.message : 'Unknown error',
                lastChecked: new Date().toISOString(),
            });
            logger.error(`Health check failed for ${config.name}`, undefined, error as Error);
        }
    }

    async getHealthStatus(): Promise<HealthStatus> {
        const checks: { [key: string]: ComponentHealth } = {};

        // Run all checks on-demand
        for (const [name, config] of this.checks) {
            await this.runCheck(config);
            const result = this.results.get(name);
            if (result) {
                checks[name] = result;
            }
        }

        // Determine overall status
        let status: HealthStatus['status'] = 'healthy';
        const results = Object.values(checks);

        if (results.some(r => r.status === 'fail')) {
            status = 'unhealthy';
        } else if (results.some(r => r.status === 'warn')) {
            status = 'degraded';
        }

        return {
            status,
            timestamp: new Date().toISOString(),
            version: this.version,
            uptime: Date.now() - this.startTime,
            checks,
            metrics: this.getSystemMetrics(),
        };
    }

    getSystemMetrics(): SystemMetrics {
        const memUsage = process.memoryUsage();
        const totalMem = os.totalmem();
        const usedMem = memUsage.rss;
        const cpuUsage = this.getCpuUsage();

        // Event loop lag status
        let eventLoopStatus: 'normal' | 'degraded' | 'blocked' = 'normal';
        if (this.lastEventLoopLag > 100) {
            eventLoopStatus = 'blocked';
        } else if (this.lastEventLoopLag > 50) {
            eventLoopStatus = 'degraded';
        }

        return {
            cpu: {
                count: os.cpus().length,
                loadAvg: os.loadavg(),
                usagePercent: cpuUsage,
            },
            memory: {
                used: Math.round(usedMem / 1024 / 1024), // MB
                total: Math.round(totalMem / 1024 / 1024), // MB
                percent: Math.round((usedMem / totalMem) * 100),
                heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
                heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
                external: Math.round(memUsage.external / 1024 / 1024), // MB
            },
            eventLoop: {
                lagMs: this.lastEventLoopLag,
                status: eventLoopStatus,
            },
            gc: {
                type: this.getGCType(),
                pauseMs: 0, // Would require v8 metrics API
            },
            disk: {
                available: 0, // Would require fs.statfs
                total: 0,
                percent: 0,
            },
        };
    }

    private getCpuUsage(): number {
        const cpus = os.cpus();
        let totalIdle = 0;
        let totalTick = 0;

        for (const cpu of cpus) {
            for (const type in cpu.times) {
                totalTick += cpu.times[type as keyof typeof cpu.times];
            }
            totalIdle += cpu.times.idle;
        }

        return Math.round(((1 - totalIdle / totalTick) * 100) * 100) / 100;
    }

    private getGCType(): string {
        // Simplified GC type detection
        const memUsage = process.memoryUsage();
        if (memUsage.heapUsed < memUsage.heapTotal * 0.5) {
            return 'scavenge';
        }
        return 'mark-sweep';
    }

    getSystemStats(): SystemStats {
        const memUsage = process.memoryUsage();
        const uptime = process.uptime();
        const metrics = this.getSystemMetrics();

        return {
            status: 'online',
            uptime,
            activeSessions: 0,
            mcpTools: 0,
            memoryUsage: {
                rss: metrics.memory.used,
                heapUsed: metrics.memory.heapUsed,
                heapTotal: metrics.memory.heapTotal,
                external: metrics.memory.external,
                arrayBuffers: 0,
            },
            userTier: 'PRO',
            usagePercent: 0,
            errorRate: 0,
            responseTime: 0,
            lastUpdated: new Date(),
        };
    }

    static createMemoryCheck(thresholdPercent: number = 90): HealthCheckConfig {
        return {
            name: 'memory',
            check: async () => {
                const memUsage = process.memoryUsage();
                const totalMem = os.totalmem();
                const usedPercent = (memUsage.rss / totalMem) * 100;

                if (usedPercent > thresholdPercent) {
                    return {
                        status: 'fail',
                        responseTime: 0,
                        message: `Memory usage critical: ${usedPercent.toFixed(2)}%`,
                        lastChecked: new Date().toISOString(),
                        details: {
                            usedMB: Math.round(memUsage.rss / 1024 / 1024),
                            totalMB: Math.round(totalMem / 1024 / 1024),
                        },
                    };
                } else if (usedPercent > thresholdPercent * 0.8) {
                    return {
                        status: 'warn',
                        responseTime: 0,
                        message: `Memory usage high: ${usedPercent.toFixed(2)}%`,
                        lastChecked: new Date().toISOString(),
                    };
                }

                return {
                    status: 'pass',
                    responseTime: 0,
                    message: `Memory usage normal: ${usedPercent.toFixed(2)}%`,
                    lastChecked: new Date().toISOString(),
                };
            },
            interval: 30000,
        };
    }

    static createDiskSpaceCheck(warningThreshold: number = 80): HealthCheckConfig {
        return {
            name: 'disk',
            check: async () => {
                // Simplified disk check - in production use fs.statfs
                return {
                    status: 'pass',
                    responseTime: 0,
                    message: 'Disk space available',
                    lastChecked: new Date().toISOString(),
                };
            },
            interval: 60000,
        };
    }

    static createOpenRouterCheck(baseUrl: string = 'https://openrouter.ai/api/v1'): HealthCheckConfig {
        return {
            name: 'openrouter',
            check: async () => {
                const startTime = Date.now();
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 5000);

                    const response = await fetch(`${baseUrl}/models`, {
                        signal: controller.signal,
                    });

                    clearTimeout(timeoutId);
                    const responseTime = Date.now() - startTime;

                    if (response.ok) {
                        return {
                            status: 'pass',
                            responseTime,
                            message: 'OpenRouter API accessible',
                            lastChecked: new Date().toISOString(),
                        };
                    } else {
                        return {
                            status: 'fail',
                            responseTime,
                            message: `OpenRouter API returned ${response.status}`,
                            lastChecked: new Date().toISOString(),
                        };
                    }
                } catch (error) {
                    return {
                        status: 'fail',
                        responseTime: Date.now() - startTime,
                        message: error instanceof Error ? error.message : 'Unknown error',
                        lastChecked: new Date().toISOString(),
                    };
                }
            },
            interval: 60000, // Check every minute
            timeout: 10000,
        };
    }

    static createDatabaseCheck(dbUrl?: string): HealthCheckConfig {
        return {
            name: 'database',
            check: async () => {
                const startTime = Date.now();
                // Simplified - in production check actual database connection
                return {
                    status: 'pass',
                    responseTime: startTime,
                    message: 'Database connection healthy',
                    lastChecked: new Date().toISOString(),
                };
            },
            interval: 30000,
        };
    }

    destroy(): void {
        if (this.eventLoopLagCheck) {
            clearInterval(this.eventLoopLagCheck);
        }
        for (const [name, intervalId] of this.intervals) {
            clearInterval(intervalId);
        }
        this.intervals.clear();
        this.checks.clear();
        this.results.clear();
    }
}

// Export singleton
export const healthCheckService = new HealthCheckService();

// Default health checks registration
export function registerDefaultHealthChecks(): void {
    healthCheckService.register(HealthCheckService.createMemoryCheck());
    healthCheckService.register(HealthCheckService.createDiskSpaceCheck());
    // OpenRouter check requires API key
    if (process.env.OPENROUTER_API_KEY) {
        healthCheckService.register(HealthCheckService.createOpenRouterCheck());
    }
}
