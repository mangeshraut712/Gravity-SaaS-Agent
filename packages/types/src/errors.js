/**
 * Gravity Error Types
 * Standardized error handling across all services
 */
export var ErrorCode;
(function (ErrorCode) {
    // Authentication errors (1xxx)
    ErrorCode["UNAUTHORIZED"] = "1001";
    ErrorCode["FORBIDDEN"] = "1002";
    ErrorCode["TOKEN_EXPIRED"] = "1003";
    ErrorCode["INVALID_CREDENTIALS"] = "1004";
    // Validation errors (2xxx)
    ErrorCode["VALIDATION_ERROR"] = "2001";
    ErrorCode["INVALID_INPUT"] = "2002";
    ErrorCode["MISSING_REQUIRED_FIELD"] = "2003";
    // Resource errors (3xxx)
    ErrorCode["NOT_FOUND"] = "3001";
    ErrorCode["ALREADY_EXISTS"] = "3002";
    ErrorCode["RESOURCE_CONFLICT"] = "3003";
    // Rate limiting (4xxx)
    ErrorCode["RATE_LIMIT_EXCEEDED"] = "4001";
    ErrorCode["QUOTA_EXCEEDED"] = "4002";
    // Service errors (5xxx)
    ErrorCode["INTERNAL_ERROR"] = "5001";
    ErrorCode["SERVICE_UNAVAILABLE"] = "5002";
    ErrorCode["EXTERNAL_API_ERROR"] = "5003";
    ErrorCode["DATABASE_ERROR"] = "5004";
    // Business logic errors (6xxx)
    ErrorCode["INSUFFICIENT_FUNDS"] = "6001";
    ErrorCode["SUBSCRIPTION_EXPIRED"] = "6002";
    ErrorCode["FEATURE_NOT_AVAILABLE"] = "6003";
})(ErrorCode || (ErrorCode = {}));
export class GravityError extends Error {
    code;
    statusCode;
    details;
    requestId;
    timestamp;
    constructor(message, code, statusCode, details, requestId) {
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
    unauthorized: (message = 'Unauthorized', requestId) => new GravityError(message, ErrorCode.UNAUTHORIZED, 401, undefined, requestId),
    forbidden: (message = 'Forbidden', requestId) => new GravityError(message, ErrorCode.FORBIDDEN, 403, undefined, requestId),
    notFound: (resource, requestId) => new GravityError(`${resource} not found`, ErrorCode.NOT_FOUND, 404, undefined, requestId),
    validation: (details, requestId) => new GravityError('Validation failed', ErrorCode.VALIDATION_ERROR, 400, details, requestId),
    rateLimit: (retryAfter, requestId) => new GravityError('Rate limit exceeded', ErrorCode.RATE_LIMIT_EXCEEDED, 429, retryAfter ? [{ message: `Retry after ${retryAfter} seconds` }] : undefined, requestId),
    quotaExceeded: (message = 'Monthly quota exceeded', requestId) => new GravityError(message, ErrorCode.QUOTA_EXCEEDED, 429, undefined, requestId),
    internal: (message = 'Internal server error', requestId) => new GravityError(message, ErrorCode.INTERNAL_ERROR, 500, undefined, requestId),
    serviceUnavailable: (message = 'Service temporarily unavailable', requestId) => new GravityError(message, ErrorCode.SERVICE_UNAVAILABLE, 503, undefined, requestId),
    externalApi: (service, message, requestId) => new GravityError(`${service} API error: ${message}`, ErrorCode.EXTERNAL_API_ERROR, 502, undefined, requestId),
    database: (message = 'Database error', requestId) => new GravityError(message, ErrorCode.DATABASE_ERROR, 500, undefined, requestId),
};
