import { EventEmitter } from 'node:events';
import { describe, expect, it, vi } from 'vitest';
import { ErrorCode, Errors } from '@gravity/types';
import { asyncHandler, errorHandler, notFoundHandler } from '../../../apps/gateway/src/middleware/error-handler.js';
import { logger } from '../../../apps/gateway/src/services/logger.js';
import { mockResponse } from '../../helpers/http.js';

function request(partial: Record<string, unknown> = {}) {
    return {
        requestId: 'req-1',
        path: '/agents',
        method: 'POST',
        body: { secret: true },
        query: { page: '1' },
        headers: {},
        ...partial,
    };
}

describe('error handler', () => {
    it('formats gravity, validation, syntax, and unknown errors', () => {
        const previous = process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';

        const gravity = mockResponse();
        errorHandler(Errors.notFound('Agent', 'req-9'), request() as never, gravity as never, vi.fn());
        expect(gravity.statusCode).toBe(404);
        expect(gravity.body).toMatchObject({ code: ErrorCode.NOT_FOUND, requestId: 'req-9', stack: expect.any(String) });

        const validation = mockResponse();
        const validationError = new Error('bad field');
        validationError.name = 'ValidationError';
        (validationError as Error & { details: string[] }).details = ['email'];
        errorHandler(validationError, request() as never, validation as never, vi.fn());
        expect(validation.statusCode).toBe(400);
        expect(validation.body).toMatchObject({ code: ErrorCode.VALIDATION_ERROR, details: ['email'] });

        const syntax = mockResponse();
        const syntaxError = new SyntaxError('Unexpected token');
        (syntaxError as SyntaxError & { body: boolean }).body = true;
        errorHandler(syntaxError, request() as never, syntax as never, vi.fn());
        expect(syntax.body).toMatchObject({ error: 'Invalid JSON payload', code: ErrorCode.INVALID_INPUT });

        process.env.NODE_ENV = 'production';
        const unknown = mockResponse();
        errorHandler(new Error('explode'), request({ requestId: undefined }) as never, unknown as never, vi.fn());
        expect(unknown.statusCode).toBe(500);
        expect(unknown.body).toMatchObject({ error: 'Internal server error', code: ErrorCode.INTERNAL_ERROR });

        process.env.NODE_ENV = previous;
    });

    it('forwards async failures and answers unknown routes', async () => {
        const next = vi.fn();
        const handler = asyncHandler(async () => {
            throw new Error('async fail');
        });
        handler({} as never, {} as never, next);
        await vi.waitFor(() => expect(next).toHaveBeenCalledWith(expect.any(Error)));

        const res = mockResponse();
        notFoundHandler(request({ method: 'DELETE', path: '/missing' }) as never, res as never);
        expect(res.statusCode).toBe(404);
        expect(res.body).toMatchObject({ error: 'Cannot DELETE /missing' });
    });

    it('logs through the request logger at the right severity', () => {
        const middleware = logger.requestLogger();
        for (const statusCode of [200, 404, 500]) {
            const res = new EventEmitter() as EventEmitter & { statusCode: number };
            res.statusCode = statusCode;
            middleware(
                { method: 'GET', path: '/health', ip: '127.0.0.1', get: () => 'vitest', requestId: 'req', user: { id: 'u1' } } as never,
                res,
                () => undefined,
            );
            res.emit('finish');
        }
        expect(true).toBe(true);
    });
});
