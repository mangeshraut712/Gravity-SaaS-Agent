/**
 * Gravity Error Types
 * Standardized error handling across all services
 */

export enum ErrorCode {
    // Authentication errors (1xxx)
    UNAUTHORIZED = '1001',
    FORBIDDEN = '1002',
    TOKEN_EXPIRED = '1003',
    INVALID_CREDENTIALS = '1004',

    // Validation errors (2xxx)
    VALIDATION_ERROR = '2001',
    INVALID_INPUT = '2002',
    MISSING_REQUIRED_FIELD = '2003',

    // Resource errors (3xxx)
    NOT_FOUND = '3001',
    ALREADY_EXISTS = '3002',
    RESOURCE_CONFLICT = '3003',

    // Rate limiting (4xxx)
    RATE_LIMIT_EXCEEDED = '4001',
    QUOTA_EXCEEDED = '4002',

    // Service errors (5xxx)
    INTERNAL_ERROR = '5001',
    SERVICE_UNAVAILABLE = '5002',
    EXTERNAL_API_ERROR = '5003',
    DATABASE_ERROR = '5004',

    // Business logic errors (6xxx)
    INSUFFICIENT_FUNDS = '6001',
    SUBSCRIPTION_EXPIRED = '6002',
    FEATURE_NOT_AVAILABLE = '6003',
}

export interface ErrorDetails {
    field?: string;
    message: string;
    code?: string;
}

export class GravityError extends Error {
    public readonly code: ErrorCode;
    public readonly statusCode: number;
    public readonly details?: ErrorDetails[];
    public readonly requestId?: string;
    public readonly timestamp: Date;

    constructor(
        message: string,
        code: ErrorCode,
        statusCode: number,
        details?: ErrorDetails[],
        requestId?: string
    ) {
        super(message);
        this.name = 'GravityError';
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
        this.requestId = requestId;
        this.timestamp = new Date();

        // Maintains proper stack trace for where our error was thrown
        Error.captureStackTrace(this, this.constructor);
    }

    toJSON() {
        return {
            success: false,
            error: this.message,
            code: this.code,
            statusCode: this.statusCode,
            details: this.details,
            requestId: this.requestId,
            timestamp: this.timestamp.toISOString(),
        };
    }
}

// Predefined error factories
export const Errors = {
    unauthorized: (message = 'Unauthorized', requestId?: string) =>
        new GravityError(message, ErrorCode.UNAUTHORIZED, 401, undefined, requestId),

    forbidden: (message = 'Forbidden', requestId?: string) =>
        new GravityError(message, ErrorCode.FORBIDDEN, 403, undefined, requestId),

    notFound: (resource: string, requestId?: string) =>
        new GravityError(`${resource} not found`, ErrorCode.NOT_FOUND, 404, undefined, requestId),

    validation: (details: ErrorDetails[], requestId?: string) =>
        new GravityError('Validation failed', ErrorCode.VALIDATION_ERROR, 400, details, requestId),

    rateLimit: (retryAfter?: number, requestId?: string) =>
        new GravityError(
            'Rate limit exceeded',
            ErrorCode.RATE_LIMIT_EXCEEDED,
            429,
            retryAfter ? [{ message: `Retry after ${retryAfter} seconds` }] : undefined,
            requestId
        ),

    quotaExceeded: (message = 'Monthly quota exceeded', requestId?: string) =>
        new GravityError(message, ErrorCode.QUOTA_EXCEEDED, 429, undefined, requestId),

    internal: (message = 'Internal server error', requestId?: string) =>
        new GravityError(message, ErrorCode.INTERNAL_ERROR, 500, undefined, requestId),

    serviceUnavailable: (message = 'Service temporarily unavailable', requestId?: string) =>
        new GravityError(message, ErrorCode.SERVICE_UNAVAILABLE, 503, undefined, requestId),

    externalApi: (service: string, message: string, requestId?: string) =>
        new GravityError(
            `${service} API error: ${message}`,
            ErrorCode.EXTERNAL_API_ERROR,
            502,
            undefined,
            requestId
        ),

    database: (message = 'Database error', requestId?: string) =>
        new GravityError(message, ErrorCode.DATABASE_ERROR, 500, undefined, requestId),
};
