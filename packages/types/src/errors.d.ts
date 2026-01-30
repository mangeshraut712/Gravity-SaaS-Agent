/**
 * Gravity Error Types
 * Standardized error handling across all services
 */
export declare enum ErrorCode {
    UNAUTHORIZED = "1001",
    FORBIDDEN = "1002",
    TOKEN_EXPIRED = "1003",
    INVALID_CREDENTIALS = "1004",
    VALIDATION_ERROR = "2001",
    INVALID_INPUT = "2002",
    MISSING_REQUIRED_FIELD = "2003",
    NOT_FOUND = "3001",
    ALREADY_EXISTS = "3002",
    RESOURCE_CONFLICT = "3003",
    RATE_LIMIT_EXCEEDED = "4001",
    QUOTA_EXCEEDED = "4002",
    INTERNAL_ERROR = "5001",
    SERVICE_UNAVAILABLE = "5002",
    EXTERNAL_API_ERROR = "5003",
    DATABASE_ERROR = "5004",
    INSUFFICIENT_FUNDS = "6001",
    SUBSCRIPTION_EXPIRED = "6002",
    FEATURE_NOT_AVAILABLE = "6003"
}
export interface ErrorDetails {
    field?: string;
    message: string;
    code?: string;
}
export declare class GravityError extends Error {
    readonly code: ErrorCode;
    readonly statusCode: number;
    readonly details?: ErrorDetails[];
    readonly requestId?: string;
    readonly timestamp: Date;
    constructor(message: string, code: ErrorCode, statusCode: number, details?: ErrorDetails[], requestId?: string);
    toJSON(): {
        success: boolean;
        error: string;
        code: ErrorCode;
        statusCode: number;
        details: ErrorDetails[] | undefined;
        requestId: string | undefined;
        timestamp: string;
    };
}
export declare const Errors: {
    unauthorized: (message?: string, requestId?: string) => GravityError;
    forbidden: (message?: string, requestId?: string) => GravityError;
    notFound: (resource: string, requestId?: string) => GravityError;
    validation: (details: ErrorDetails[], requestId?: string) => GravityError;
    rateLimit: (retryAfter?: number, requestId?: string) => GravityError;
    quotaExceeded: (message?: string, requestId?: string) => GravityError;
    internal: (message?: string, requestId?: string) => GravityError;
    serviceUnavailable: (message?: string, requestId?: string) => GravityError;
    externalApi: (service: string, message: string, requestId?: string) => GravityError;
    database: (message?: string, requestId?: string) => GravityError;
};
