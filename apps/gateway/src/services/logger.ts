/**
 * Enhanced Gravity Logger Service
 * Structured logging with correlation IDs, log levels, and multiple transports
 */

import { Request } from 'express';

export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    FATAL = 4,
}

export interface LogContext {
    requestId?: string;
    userId?: string;
    service?: string;
    [key: string]: any;
}

export interface LogEntry {
    timestamp: string;
    level: string;
    message: string;
    context?: LogContext;
    error?: {
        name: string;
        message: string;
        stack?: string;
        code?: string;
    };
    metadata?: Record<string, any>;
}

interface LoggerConfig {
    minLevel: LogLevel;
    service: string;
    enableConsole: boolean;
    enableFile: boolean;
    jsonFormat: boolean;
}

class GravityLogger {
    private config: LoggerConfig;
    private static instance: GravityLogger;

    private constructor(config: Partial<LoggerConfig> = {}) {
        this.config = {
            minLevel: config.minLevel ?? LogLevel.INFO,
            service: config.service ?? 'gateway',
            enableConsole: config.enableConsole ?? true,
            enableFile: config.enableFile ?? false,
            jsonFormat: config.jsonFormat ?? process.env.NODE_ENV === 'production',
        };
    }

    static getInstance(config?: Partial<LoggerConfig>): GravityLogger {
        if (!GravityLogger.instance) {
            GravityLogger.instance = new GravityLogger(config);
        }
        return GravityLogger.instance;
    }

    private shouldLog(level: LogLevel): boolean {
        return level >= this.config.minLevel;
    }

    private formatMessage(
        level: LogLevel,
        message: string,
        context?: LogContext,
        error?: Error,
        metadata?: Record<string, any>
    ): string {
        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            level: LogLevel[level],
            message,
            context: {
                service: this.config.service,
                ...context,
            },
            metadata,
        };

        if (error) {
            entry.error = {
                name: error.name,
                message: error.message,
                stack: error.stack,
                code: (error as any).code,
            };
        }

        if (this.config.jsonFormat) {
            return JSON.stringify(entry);
        }

        const color = this.getColor(level);
        const reset = '\x1b[0m';
        const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
        const errorStr = error ? `\n${error.stack}` : '';

        return `${color}[${entry.timestamp}] [${entry.level}] [${this.config.service}]${reset} ${message}${contextStr}${errorStr}`;
    }

    private getColor(level: LogLevel): string {
        switch (level) {
            case LogLevel.DEBUG:
                return '\x1b[36m'; // Cyan
            case LogLevel.INFO:
                return '\x1b[32m'; // Green
            case LogLevel.WARN:
                return '\x1b[33m'; // Yellow
            case LogLevel.ERROR:
                return '\x1b[31m'; // Red
            case LogLevel.FATAL:
                return '\x1b[35m'; // Magenta
            default:
                return '\x1b[0m';
        }
    }

    private log(
        level: LogLevel,
        message: string,
        context?: LogContext,
        error?: Error,
        metadata?: Record<string, any>
    ): void {
        if (!this.shouldLog(level)) return;

        const formattedMessage = this.formatMessage(level, message, context, error, metadata);

        if (this.config.enableConsole) {
            const consoleMethod = level >= LogLevel.ERROR ? console.error :
                level >= LogLevel.WARN ? console.warn :
                    level === LogLevel.DEBUG ? console.debug : console.log;
            consoleMethod(formattedMessage);
        }

        // File logging could be implemented here
        if (this.config.enableFile) {
            // Implement file transport if needed
        }
    }

    debug(message: string, context?: LogContext, metadata?: Record<string, any>): void {
        this.log(LogLevel.DEBUG, message, context, undefined, metadata);
    }

    info(message: string, context?: LogContext, metadata?: Record<string, any>): void {
        this.log(LogLevel.INFO, message, context, undefined, metadata);
    }

    warn(message: string, context?: LogContext, error?: Error, metadata?: Record<string, any>): void {
        this.log(LogLevel.WARN, message, context, error, metadata);
    }

    error(message: string, context?: LogContext, error?: Error, metadata?: Record<string, any>): void {
        this.log(LogLevel.ERROR, message, context, error, metadata);
    }

    fatal(message: string, context?: LogContext, error?: Error, metadata?: Record<string, any>): void {
        this.log(LogLevel.FATAL, message, context, error, metadata);
    }

    // Express middleware for request logging
    requestLogger() {
        return (req: Request, res: any, next: any) => {
            const startTime = Date.now();
            const requestId = (req as any).requestId || `req-${Date.now()}`;
            const userId = (req as any).user?.id;

            res.on('finish', () => {
                const duration = Date.now() - startTime;
                const context: LogContext = {
                    requestId,
                    userId,
                    method: req.method,
                    path: req.path,
                    statusCode: res.statusCode,
                    duration: `${duration}ms`,
                    userAgent: req.get('user-agent'),
                    ip: req.ip,
                };

                const level = res.statusCode >= 500 ? LogLevel.ERROR :
                    res.statusCode >= 400 ? LogLevel.WARN : LogLevel.INFO;

                this.log(level, `${req.method} ${req.path} ${res.statusCode}`, context);
            });

            next();
        };
    }

    // Create child logger with additional context
    child(additionalContext: LogContext): GravityLogger {
        const childLogger = Object.create(this);
        childLogger.log = (
            level: LogLevel,
            message: string,
            context?: LogContext,
            error?: Error,
            metadata?: Record<string, any>
        ) => {
            this.log(level, message, { ...additionalContext, ...context }, error, metadata);
        };
        return childLogger;
    }
}

// Export singleton instance
export const logger = GravityLogger.getInstance();

// Factory function for creating configured loggers
export function createLogger(config: Partial<LoggerConfig>): GravityLogger {
    return GravityLogger.getInstance(config);
}

// Express request context helper
export function getRequestContext(req: Request): LogContext {
    return {
        requestId: (req as any).requestId,
        userId: (req as any).user?.id,
        service: 'gateway',
    };
}
