/**
 * Centralized Error Handling Middleware
 * Catches and formats all errors consistently
 */

import { Request, Response, NextFunction } from 'express';
import { GravityError, ErrorCode, Errors } from '@gravity/types';
import { logger, getRequestContext } from '../services/logger.js';

export interface ErrorResponse {
    success: false;
    error: string;
    code: ErrorCode;
    statusCode: number;
    details?: any;
    requestId?: string;
    timestamp: string;
    stack?: string;
}

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
): void {
    const requestId = (req as any).requestId;
    const context = getRequestContext(req);

    // Log the error
    logger.error('Request error', context, err, {
        path: req.path,
        method: req.method,
        body: req.body,
        query: req.query,
    });

    // Handle known Gravity errors
    if (err instanceof GravityError) {
        const response: ErrorResponse = {
            success: false,
            error: err.message,
            code: err.code,
            statusCode: err.statusCode,
            details: err.details,
            requestId: err.requestId || requestId,
            timestamp: err.timestamp.toISOString(),
        };

        // Include stack trace in development
        if (process.env.NODE_ENV === 'development') {
            response.stack = err.stack;
        }

        res.status(err.statusCode).json(response);
        return;
    }

    // Handle validation errors (e.g., from Joi, Yup, Zod)
    if (err.name === 'ValidationError') {
        const response: ErrorResponse = {
            success: false,
            error: 'Validation failed',
            code: ErrorCode.VALIDATION_ERROR,
            statusCode: 400,
            details: (err as any).details || err.message,
            requestId,
            timestamp: new Date().toISOString(),
        };

        if (process.env.NODE_ENV === 'development') {
            response.stack = err.stack;
        }

        res.status(400).json(response);
        return;
    }

    // Handle syntax errors (malformed JSON)
    if (err instanceof SyntaxError && 'body' in err) {
        const response: ErrorResponse = {
            success: false,
            error: 'Invalid JSON payload',
            code: ErrorCode.INVALID_INPUT,
            statusCode: 400,
            requestId,
            timestamp: new Date().toISOString(),
        };

        res.status(400).json(response);
        return;
    }

    // Default unknown error handling
    const isDev = process.env.NODE_ENV === 'development';
    const response: ErrorResponse = {
        success: false,
        error: isDev ? err.message : 'Internal server error',
        code: ErrorCode.INTERNAL_ERROR,
        statusCode: 500,
        requestId,
        timestamp: new Date().toISOString(),
    };

    if (isDev) {
        response.stack = err.stack;
        response.details = { originalError: err.name };
    }

    res.status(500).json(response);
}

// Async handler wrapper to catch errors in async route handlers
export function asyncHandler(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

// Not found handler
export function notFoundHandler(req: Request, res: Response): void {
    const requestId = (req as any).requestId;

    logger.warn('Resource not found', getRequestContext(req), undefined, {
        path: req.path,
        method: req.method,
    });

    const response: ErrorResponse = {
        success: false,
        error: `Cannot ${req.method} ${req.path}`,
        code: ErrorCode.NOT_FOUND,
        statusCode: 404,
        requestId,
        timestamp: new Date().toISOString(),
    };

    res.status(404).json(response);
}
