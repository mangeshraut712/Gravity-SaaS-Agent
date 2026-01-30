/**
 * Request Validation Middleware
 * Validates incoming requests using JSON Schema
 */

import { Request, Response, NextFunction } from 'express';
import { ErrorCode, Errors } from '@gravity/types';

export interface ValidationSchema {
    body?: Record<string, any>;
    query?: Record<string, any>;
    params?: Record<string, any>;
    headers?: Record<string, any>;
}

// Simple type validators
const validators: Record<string, (value: any) => boolean> = {
    string: (v) => typeof v === 'string',
    number: (v) => typeof v === 'number' && !isNaN(v),
    boolean: (v) => typeof v === 'boolean',
    array: (v) => Array.isArray(v),
    object: (v) => typeof v === 'object' && !Array.isArray(v) && v !== null,
    email: (v) => typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    url: (v) => typeof v === 'string' && /^https?:\/\/.+/.test(v),
    uuid: (v) => typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v),
};

interface ValidationError {
    field: string;
    message: string;
    received?: any;
}

function validateValue(
    value: any,
    schema: any,
    path: string
): ValidationError | null {
    // Required check
    if (schema.required && (value === undefined || value === null)) {
        return { field: path, message: `${path} is required` };
    }

    // Skip validation if not required and value is missing
    if (!schema.required && (value === undefined || value === null)) {
        return null;
    }

    // Type validation
    if (schema.type && !validators[schema.type]?.(value)) {
        return {
            field: path,
            message: `${path} must be of type ${schema.type}`,
            received: value,
        };
    }

    // Min/Max length for strings and arrays
    if (schema.minLength !== undefined) {
        if ((typeof value === 'string' || Array.isArray(value)) && value.length < schema.minLength) {
            return {
                field: path,
                message: `${path} must have at least ${schema.minLength} characters/items`,
            };
        }
    }

    if (schema.maxLength !== undefined) {
        if ((typeof value === 'string' || Array.isArray(value)) && value.length > schema.maxLength) {
            return {
                field: path,
                message: `${path} must have at most ${schema.maxLength} characters/items`,
            };
        }
    }

    // Min/Max for numbers
    if (schema.minimum !== undefined && value < schema.minimum) {
        return {
            field: path,
            message: `${path} must be at least ${schema.minimum}`,
        };
    }

    if (schema.maximum !== undefined && value > schema.maximum) {
        return {
            field: path,
            message: `${path} must be at most ${schema.maximum}`,
        };
    }

    // Pattern validation
    if (schema.pattern && typeof value === 'string') {
        const regex = new RegExp(schema.pattern);
        if (!regex.test(value)) {
            return {
                field: path,
                message: schema.patternError || `${path} format is invalid`,
            };
        }
    }

    // Enum validation
    if (schema.enum && !schema.enum.includes(value)) {
        return {
            field: path,
            message: `${path} must be one of: ${schema.enum.join(', ')}`,
        };
    }

    // Nested object validation
    if (schema.properties && typeof value === 'object') {
        for (const [key, propSchema] of Object.entries(schema.properties)) {
            const error = validateValue(value[key], propSchema, `${path}.${key}`);
            if (error) return error;
        }
    }

    // Array items validation
    if (schema.items && Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
            const error = validateValue(value[i], schema.items, `${path}[${i}]`);
            if (error) return error;
        }
    }

    // Custom validator
    if (schema.validate && typeof schema.validate === 'function') {
        const result = schema.validate(value);
        if (result !== true) {
            return {
                field: path,
                message: typeof result === 'string' ? result : `${path} is invalid`,
            };
        }
    }

    return null;
}

export function validate(schema: ValidationSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        const errors: ValidationError[] = [];
        const requestId = (req as any).requestId;

        // Validate body
        if (schema.body) {
            for (const [key, fieldSchema] of Object.entries(schema.body)) {
                const error = validateValue(req.body[key], fieldSchema, key);
                if (error) errors.push(error);
            }
        }

        // Validate query
        if (schema.query) {
            for (const [key, fieldSchema] of Object.entries(schema.query)) {
                const error = validateValue(req.query[key], fieldSchema, key);
                if (error) errors.push(error);
            }
        }

        // Validate params
        if (schema.params) {
            for (const [key, fieldSchema] of Object.entries(schema.params)) {
                const error = validateValue(req.params[key], fieldSchema, key);
                if (error) errors.push(error);
            }
        }

        // Validate headers
        if (schema.headers) {
            for (const [key, fieldSchema] of Object.entries(schema.headers)) {
                const error = validateValue(req.headers[key.toLowerCase()], fieldSchema, key);
                if (error) errors.push(error);
            }
        }

        if (errors.length > 0) {
            const gravityError = Errors.validation(
                errors.map(e => ({ field: e.field, message: e.message })),
                requestId
            );
            res.status(400).json(gravityError.toJSON());
            return;
        }

        next();
    };
}

// Common validation schemas
export const commonSchemas = {
    uuid: { type: 'uuid', required: true },
    email: { type: 'email', required: true },
    password: { type: 'string', required: true, minLength: 8, maxLength: 128 },
    pagination: {
        page: { type: 'number', minimum: 1 },
        limit: { type: 'number', minimum: 1, maximum: 100 },
    },
    message: {
        content: { type: 'string', required: true, minLength: 1, maxLength: 10000 },
        role: { type: 'string', enum: ['user', 'assistant', 'system'] },
    },
};

// Sanitize middleware - removes dangerous characters
export function sanitizeInput(req: Request, _res: Response, next: NextFunction) {
    const sanitize = (obj: any): any => {
        if (typeof obj === 'string') {
            // Remove potential XSS payloads
            return obj
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+\s*=/gi, '');
        }
        if (Array.isArray(obj)) {
            return obj.map(sanitize);
        }
        if (typeof obj === 'object' && obj !== null) {
            const sanitized: any = {};
            for (const [key, value] of Object.entries(obj)) {
                sanitized[key] = sanitize(value);
            }
            return sanitized;
        }
        return obj;
    };

    if (req.body) req.body = sanitize(req.body);
    if (req.query) req.query = sanitize(req.query);

    next();
}
