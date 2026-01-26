import { Request, Response } from 'express';
import winston from 'winston';
import { AuthenticatedRequest } from '../middleware/index.js';

// Enhanced Logger Configuration
export class Logger {
    private static instance: winston.Logger;
    private static logLevel: string = process.env.LOG_LEVEL || 'info';

    static getInstance(): winston.Logger {
        if (!Logger.instance) {
            Logger.instance = winston.createLogger({
                level: Logger.logLevel,
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.errors({ stack: true }),
                    winston.format.json(),
                    winston.format.printf(({ timestamp, level, message, requestId, userId, ...meta }) => {
                        return JSON.stringify({
                            timestamp,
                            level: level.toUpperCase(),
                            message,
                            requestId,
                            userId,
                            ...meta
                        });
                    })
                ),
                defaultMeta: {
                    service: 'gravityos-gateway',
                    version: process.env.npm_package_version || '1.0.0',
                    environment: process.env.NODE_ENV || 'development'
                },
                transports: [
                    // Console transport for development
                    new winston.transports.Console({
                        format: winston.format.combine(
                            winston.format.colorize(),
                            winston.format.simple(),
                            winston.format.printf(({ timestamp, level, message, requestId, userId }) => {
                                const requestIdStr = requestId ? ` [${requestId}]` : '';
                                const userIdStr = userId ? ` [${userId}]` : '';
                                return `${timestamp} ${level}${requestIdStr}${userIdStr}: ${message}`;
                            })
                        )
                    }),
                    
                    // File transport for production
                    ...(process.env.NODE_ENV === 'production' ? [
                        new winston.transports.File({
                            filename: 'logs/error.log',
                            level: 'error',
                            maxsize: 5242880, // 5MB
                            maxFiles: 5
                        }),
                        new winston.transports.File({
                            filename: 'logs/combined.log',
                            maxsize: 5242880, // 5MB
                            maxFiles: 5
                        })
                    ] : [])
                ]
            });
        }
        return Logger.instance;
    }

    static info(message: string, meta?: any) {
        Logger.getInstance().info(message, meta);
    }

    static warn(message: string, meta?: any) {
        Logger.getInstance().warn(message, meta);
    }

    static error(message: string, error?: Error | any, meta?: any) {
        const errorMeta = error instanceof Error ? {
            name: error.name,
            message: error.message,
            stack: error.stack
        } : error;
        
        Logger.getInstance().error(message, { ...errorMeta, ...meta });
    }

    static debug(message: string, meta?: any) {
        Logger.getInstance().debug(message, meta);
    }

    static http(message: string, meta?: any) {
        Logger.getInstance().http(message, meta);
    }
}

// Request Logger Middleware
export class RequestLogger {
    static middleware() {
        return (req: AuthenticatedRequest, res: Response, next: Function) => {
            const start = Date.now();
            const { method, url, ip, headers } = req;
            const userAgent = headers['user-agent'];
            const requestId = req.requestId;
            const userId = req.user?.id;

            // Log request start
            Logger.http('Request started', {
                method,
                url,
                ip,
                userAgent,
                requestId,
                userId,
                contentLength: req.headers['content-length']
            });

            // Capture response
            const originalSend = res.send;
            res.send = function(body: any) {
                const duration = Date.now() - start;
                const statusCode = res.statusCode;

                // Log request completion
                if (statusCode >= 400) {
                    Logger.warn('Request completed with error', {
                        method,
                        url,
                        statusCode,
                        duration,
                        requestId,
                        userId,
                        responseSize: body ? Buffer.byteLength(JSON.stringify(body)) : 0
                    });
                } else {
                    Logger.http('Request completed', {
                        method,
                        url,
                        statusCode,
                        duration,
                        requestId,
                        userId,
                        responseSize: body ? Buffer.byteLength(JSON.stringify(body)) : 0
                    });
                }

                return originalSend.call(this, body);
            };

            next();
        };
    }
}

// Error Logger
export class ErrorLogger {
    static log(error: Error, req?: AuthenticatedRequest, context?: any) {
        const errorInfo = {
            name: error.name,
            message: error.message,
            stack: error.stack,
            timestamp: new Date(),
            requestId: req?.requestId,
            userId: req?.user?.id,
            method: req?.method,
            url: req?.url,
            ip: req?.ip,
            userAgent: req?.headers?.['user-agent'],
            ...context
        };

        Logger.error('Application error', error, errorInfo);
    }

    static logFatal(error: Error, req?: AuthenticatedRequest, context?: any) {
        const errorInfo = {
            name: error.name,
            message: error.message,
            stack: error.stack,
            timestamp: new Date(),
            requestId: req?.requestId,
            userId: req?.user?.id,
            method: req?.method,
            url: req?.url,
            ip: req?.ip,
            userAgent: req?.headers?.['user-agent'],
            fatal: true,
            ...context
        };

        Logger.error('FATAL error', error, errorInfo);
        
        // In production, you might want to send this to an error tracking service
        if (process.env.NODE_ENV === 'production') {
            // Send to Sentry, Rollbar, etc.
            console.error('FATAL ERROR - Would send to error tracking service:', errorInfo);
        }
    }
}

// Performance Logger
export class PerformanceLogger {
    static logSlowQuery(query: string, duration: number, threshold: number = 1000) {
        if (duration > threshold) {
            Logger.warn('Slow query detected', {
                query: query.substring(0, 200), // Limit query length
                duration,
                threshold,
                type: 'slow_query'
            });
        }
    }

    static logApiCall(endpoint: string, duration: number, statusCode: number, threshold: number = 5000) {
        if (duration > threshold) {
            Logger.warn('Slow API call', {
                endpoint,
                duration,
                statusCode,
                threshold,
                type: 'slow_api'
            });
        }
    }

    static logMemoryUsage() {
        const usage = process.memoryUsage();
        Logger.info('Memory usage', {
            rss: usage.rss,
            heapUsed: usage.heapUsed,
            heapTotal: usage.heapTotal,
            external: usage.external,
            arrayBuffers: usage.arrayBuffers,
            type: 'memory_usage'
        });
    }

    static logSystemMetrics() {
        const metrics = {
            uptime: process.uptime(),
            cpuUsage: process.cpuUsage(),
            memoryUsage: process.memoryUsage(),
            platform: process.platform,
            arch: process.arch,
            nodeVersion: process.version,
            type: 'system_metrics'
        };

        Logger.info('System metrics', metrics);
    }
}

// Security Logger
export class SecurityLogger {
    static logSecurityEvent(event: string, details: any, req?: AuthenticatedRequest) {
        const securityInfo = {
            event,
            timestamp: new Date(),
            requestId: req?.requestId,
            userId: req?.user?.id,
            ip: req?.ip,
            userAgent: req?.headers?.['user-agent'],
            ...details,
            type: 'security_event'
        };

        Logger.warn(`Security event: ${event}`, securityInfo);
    }

    static logAuthenticationAttempt(success: boolean, userId?: string, ip?: string, reason?: string) {
        SecurityLogger.logSecurityEvent('authentication_attempt', {
            success,
            userId,
            ip,
            reason
        });
    }

    static logAuthorizationFailure(userId: string, resource: string, requiredPermissions: string[], userPermissions: string[], req?: AuthenticatedRequest) {
        SecurityLogger.logSecurityEvent('authorization_failure', {
            userId,
            resource,
            requiredPermissions,
            userPermissions,
            reason: 'Insufficient permissions'
        }, req);
    }

    static logRateLimitExceeded(userId: string, ip: string, limit: number, windowMs: number, req?: AuthenticatedRequest) {
        SecurityLogger.logSecurityEvent('rate_limit_exceeded', {
            userId,
            ip,
            limit,
            windowMs,
            reason: 'Too many requests'
        }, req);
    }

    static logSuspiciousActivity(activity: string, details: any, severity: 'low' | 'medium' | 'high' = 'medium', req?: AuthenticatedRequest) {
        SecurityLogger.logSecurityEvent(`suspicious_activity_${severity}`, {
            activity,
            severity,
            ...details
        }, req);
    }
}

// Business Logic Logger
export class BusinessLogger {
    static logUserAction(userId: string, action: string, details?: any) {
        Logger.info(`User action: ${action}`, {
            userId,
            action,
            details,
            type: 'user_action'
        });
    }

    static logSkillExecution(skillId: string, userId: string, status: 'started' | 'completed' | 'failed', duration?: number, error?: string) {
        Logger.info(`Skill execution: ${skillId}`, {
            skillId,
            userId,
            status,
            duration,
            error,
            type: 'skill_execution'
        });
    }

    static logChannelActivity(channelType: string, channelId: string, action: string, details?: any) {
        Logger.info(`Channel activity: ${channelType}`, {
            channelType,
            channelId,
            action,
            details,
            type: 'channel_activity'
        });
    }

    static logBillingEvent(userId: string, event: string, amount?: number, details?: any) {
        Logger.info(`Billing event: ${event}`, {
            userId,
            event,
            amount,
            details,
            type: 'billing_event'
        });
    }
}

// Health Check Logger
export class HealthLogger {
    static logHealthCheck(service: string, status: 'healthy' | 'unhealthy', details?: any) {
        const level = status === 'healthy' ? 'info' : 'error';
        Logger[level](`Health check: ${service}`, {
            service,
            status,
            details,
            type: 'health_check'
        });
    }

    static logDependencyHealth(dependency: string, status: 'up' | 'down', responseTime?: number, error?: string) {
        const level = status === 'up' ? 'info' : 'error';
        Logger[level](`Dependency health: ${dependency}`, {
            dependency,
            status,
            responseTime,
            error,
            type: 'dependency_health'
        });
    }
}

// Audit Logger
export class AuditLogger {
    static logDataAccess(userId: string, resource: string, action: 'read' | 'write' | 'delete', details?: any) {
        Logger.info(`Data access: ${action}`, {
            userId,
            resource,
            action,
            details,
            type: 'data_access',
            compliance: true
        });
    }

    static logConfigurationChange(service: string, setting: string, oldValue: any, newValue: any, userId?: string) {
        Logger.info(`Configuration change: ${service}`, {
            service,
            setting,
            oldValue,
            newValue,
            userId,
            type: 'configuration_change',
            compliance: true
        });
    }

    static logSystemEvent(event: string, details: any, severity: 'info' | 'warning' | 'error' = 'info') {
        if (severity === 'warning') {
            Logger.warn(`System event: ${event}`, {
                event,
                details,
                type: 'system_event',
                compliance: true
            });
        } else {
            Logger[severity](`System event: ${event}`, {
                event,
                details,
                type: 'system_event',
                compliance: true
            });
        }
    }
}

// Initialize periodic logging
if (process.env.NODE_ENV !== 'test') {
    // Log system metrics every 5 minutes
    setInterval(() => {
        PerformanceLogger.logSystemMetrics();
    }, 5 * 60 * 1000);

    // Log memory usage every minute
    setInterval(() => {
        PerformanceLogger.logMemoryUsage();
    }, 60 * 1000);
}

export default Logger;
