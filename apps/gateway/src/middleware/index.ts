import express, { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ApiResponse, SystemStats } from '@gravity/types';

// Re-export new middleware
export * from './error-handler.js';
export * from './validation.js';

// Enhanced middleware types
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        tier: 'FREE' | 'PRO' | 'ENTERPRISE';
        permissions: string[];
    };
    requestId?: string;
}

interface RateLimitInfo {
    limit: number;
    current: number;
    remaining: number;
    resetTime: Date;
}

// Advanced Middleware Factory
export class MiddlewareFactory {
    private static requestIdCounter = 0;

    // Request ID Middleware
    static requestId() {
        return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            req.requestId = `req-${Date.now()}-${++MiddlewareFactory.requestIdCounter}`;
            res.setHeader('X-Request-ID', req.requestId);
            next();
        };
    }

    // Enhanced Security Headers
    static security() {
        return helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    scriptSrc: ["'self'"],
                    imgSrc: ["'self'", "data:", "https:"],
                    connectSrc: ["'self'", "ws:", "wss:"],
                },
            },
            hsts: {
                maxAge: 31536000,
                includeSubDomains: true,
                preload: true
            }
        });
    }

    // Request Logging
    static logging() {
        return morgan('combined', {
            stream: {
                write: (message: string) => {
                    console.log(`[HTTP] ${message.trim()}`);
                }
            },
            skip: (req: Request) => {
                // Skip health checks and static assets
                return req.path === '/health' || req.path.startsWith('/static');
            }
        });
    }

    // Compression
    static compressionMiddleware() {
        return compression({
            filter: (req: Request, res: Response) => {
                if (req.headers['x-no-compression']) {
                    return false;
                }
                return compression.filter(req, res);
            },
            threshold: 1024,
            level: 6
        });
    }

    // Enhanced Rate Limiting
    static createRateLimit(options: {
        windowMs: number;
        maxRequests: number;
        skipSuccessfulRequests?: boolean;
        skipFailedRequests?: boolean;
    }) {
        return rateLimit({
            windowMs: options.windowMs,
            max: options.maxRequests,
            message: {
                success: false,
                error: 'Too many requests',
                retryAfter: Math.ceil(options.windowMs / 1000),
                timestamp: new Date()
            } as ApiResponse,
            standardHeaders: true,
            legacyHeaders: false,
            skipSuccessfulRequests: options.skipSuccessfulRequests || false,
            skipFailedRequests: options.skipFailedRequests || false,
            keyGenerator: (req: Request) => {
                const user = (req as AuthenticatedRequest).user;
                return user ? `user-${user.id}` : req.ip || 'unknown';
            }
        });
    }

    // Authentication Middleware
    static authenticate() {
        return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            try {
                const authHeader = req.headers.authorization;
                if (!authHeader || !authHeader.startsWith('Bearer ')) {
                    return res.status(401).json({
                        success: false,
                        error: 'Missing or invalid authorization header',
                        timestamp: new Date()
                    } as ApiResponse);
                }

                const token = authHeader.substring(7);

                // Mock JWT verification (in production, use proper JWT library)
                if (token === 'mock-admin-token') {
                    req.user = {
                        id: 'admin',
                        tier: 'ENTERPRISE',
                        permissions: ['read', 'write', 'admin', 'channels', 'skills', 'users']
                    };
                } else if (token === 'mock-user-token') {
                    req.user = {
                        id: 'user-123',
                        tier: 'PRO',
                        permissions: ['read', 'write', 'channels', 'skills']
                    };
                } else if (token === 'mock-free-token') {
                    req.user = {
                        id: 'free-user',
                        tier: 'FREE',
                        permissions: ['read']
                    };
                } else {
                    return res.status(401).json({
                        success: false,
                        error: 'Invalid token',
                        timestamp: new Date()
                    } as ApiResponse);
                }

                next();
            } catch (error) {
                console.error('Authentication error:', error);
                res.status(500).json({
                    success: false,
                    error: 'Authentication error',
                    timestamp: new Date()
                } as ApiResponse);
            }
        };
    }

    // Permission-based Authorization
    static authorize(requiredPermissions: string[]) {
        return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: 'Authentication required',
                    timestamp: new Date()
                } as ApiResponse);
            }

            const hasPermission = requiredPermissions.every(permission =>
                req.user!.permissions.includes(permission) || req.user!.permissions.includes('admin')
            );

            if (!hasPermission) {
                return res.status(403).json({
                    success: false,
                    error: 'Insufficient permissions',
                    required: requiredPermissions,
                    timestamp: new Date()
                } as ApiResponse);
            }

            next();
        };
    }

    // Tier-based Rate Limiting
    static tierBasedRateLimit() {
        return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            const user = req.user;
            if (!user) {
                return MiddlewareFactory.createRateLimit({
                    windowMs: 15 * 60 * 1000, // 15 minutes
                    maxRequests: 30 // Free tier limit
                })(req, res, next);
            }

            const limits = {
                FREE: { windowMs: 15 * 60 * 1000, maxRequests: 30 },
                PRO: { windowMs: 15 * 60 * 1000, maxRequests: 100 },
                ENTERPRISE: { windowMs: 15 * 60 * 1000, maxRequests: 500 }
            };

            const limit = limits[user.tier];
            return MiddlewareFactory.createRateLimit(limit)(req, res, next);
        };
    }

    // Request Validation
    static validateRequest(schema: any) {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                const { error, value } = schema.validate(req.body);
                if (error) {
                    return res.status(400).json({
                        success: false,
                        error: 'Validation error',
                        details: error.details.map((d: any) => d.message),
                        timestamp: new Date()
                    } as ApiResponse);
                }
                req.body = value;
                next();
            } catch (err) {
                res.status(500).json({
                    success: false,
                    error: 'Validation error',
                    timestamp: new Date()
                } as ApiResponse);
            }
        };
    }

    // Cache Control
    static cacheControl(maxAge: number = 300) {
        return (req: Request, res: Response, next: NextFunction) => {
            res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
            next();
        };
    }

    // CORS Configuration
    static cors(allowedOrigins: string[] = []) {
        return (req: Request, res: Response, next: NextFunction) => {
            const origin = req.headers.origin;

            if (allowedOrigins.includes('*') || allowedOrigins.includes(origin || '')) {
                res.setHeader('Access-Control-Allow-Origin', origin || '*');
            }

            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Request-ID');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

            if (req.method === 'OPTIONS') {
                return res.status(200).end();
            }

            next();
        };
    }

    // Health Check
    static healthCheck() {
        return (req: Request, res: Response) => {
            const health = {
                status: 'healthy',
                timestamp: new Date(),
                uptime: process.uptime(),
                version: process.env.npm_package_version || '1.0.0',
                environment: process.env.NODE_ENV || 'development',
                memory: process.memoryUsage(),
                lastCheck: new Date()
            };

            res.status(200).json(health);
        };
    }

    // Error Handling Middleware
    static errorHandler() {
        return (err: Error, req: Request, res: Response, next: NextFunction) => {
            const requestId = (req as AuthenticatedRequest).requestId;

            console.error(`[Error ${requestId}]`, {
                error: err.message,
                stack: err.stack,
                url: req.url,
                method: req.method,
                ip: req.ip,
                userAgent: req.headers['user-agent']
            });

            // Don't leak error details in production
            const isDevelopment = process.env.NODE_ENV === 'development';

            res.status(500).json({
                success: false,
                error: isDevelopment ? err.message : 'Internal server error',
                requestId,
                timestamp: new Date(),
                ...(isDevelopment && { stack: err.stack })
            } as ApiResponse);
        };
    }

    // 404 Handler
    static notFoundHandler() {
        return (req: Request, res: Response) => {
            res.status(404).json({
                success: false,
                error: 'Endpoint not found',
                path: req.path,
                method: req.method,
                timestamp: new Date()
            } as ApiResponse);
        };
    }
}

// API Response Helpers
export class ResponseHelper {
    static success<T>(res: Response, data: T, message?: string, statusCode: number = 200) {
        return res.status(statusCode).json({
            success: true,
            data,
            message,
            timestamp: new Date()
        } as ApiResponse<T>);
    }

    static error(res: Response, error: string, statusCode: number = 500, details?: any) {
        return res.status(statusCode).json({
            success: false,
            error,
            details,
            timestamp: new Date()
        } as ApiResponse);
    }

    static paginated<T>(res: Response, data: T[], page: number, limit: number, total: number) {
        const totalPages = Math.ceil(total / limit);
        return res.status(200).json({
            success: true,
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            },
            timestamp: new Date()
        } as ApiResponse);
    }
}

// Request Validation Schemas
export const ValidationSchemas = {
    message: {
        userId: { type: 'string', required: true },
        text: { type: 'string', required: true, minLength: 1, maxLength: 10000 },
        channelId: { type: 'string', optional: true },
        metadata: { type: 'object', optional: true }
    },

    channelSend: {
        channelId: { type: 'string', required: true },
        content: { type: 'string', required: true, minLength: 1, maxLength: 5000 },
        options: { type: 'object', optional: true }
    },

    skillExecution: {
        skillId: { type: 'string', required: true },
        userId: { type: 'string', required: true },
        workspaceId: { type: 'string', optional: true },
        input: { type: 'string', required: true, minLength: 1, maxLength: 10000 }
    }
};

// Rate Limiting Presets
export const RateLimitPresets = {
    strict: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 10
    },
    moderate: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 100
    },
    lenient: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 1000
    },
    upload: {
        windowMs: 60 * 60 * 1000, // 1 hour
        maxRequests: 50
    }
};
