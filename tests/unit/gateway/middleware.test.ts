import { describe, expect, it, vi } from 'vitest';
import {
    MiddlewareFactory,
    RateLimitPresets,
    ResponseHelper,
    ValidationSchemas,
} from '../../../apps/gateway/src/middleware/index.js';
import { mockResponse } from '../../helpers/http.js';

function request(partial: Record<string, unknown> = {}) {
    return {
        headers: {},
        method: 'GET',
        path: '/api/chat',
        url: '/api/chat',
        ip: '127.0.0.1',
        body: {},
        get: () => 'vitest',
        ...partial,
    };
}

async function invoke(middleware: Function, req = request(), res = mockResponse()) {
    await new Promise<void>((resolve, reject) => {
        const maybe = middleware(req, res, (error?: unknown) => (error ? reject(error) : resolve()));
        if (maybe && typeof maybe.then === 'function') {
            maybe.then(() => resolve()).catch(reject);
        }
    });
    return res;
}

describe('MiddlewareFactory', () => {
    it('assigns a request id and security, compression, and cache headers', async () => {
        const res = mockResponse();
        await invoke(MiddlewareFactory.requestId(), request(), res);
        expect(res.headers['X-Request-ID']).toMatch(/^req-/);

        await invoke(MiddlewareFactory.security(), request(), mockResponse());
        await invoke(MiddlewareFactory.compressionMiddleware(), request({ headers: { 'x-no-compression': '1' } }), mockResponse());
        await invoke(MiddlewareFactory.logging(), request({ path: '/health' }), mockResponse());
        await invoke(MiddlewareFactory.logging(), request({ path: '/api/chat' }), mockResponse());

        const cached = await invoke(MiddlewareFactory.cacheControl(60), request(), mockResponse());
        expect(cached.headers['Cache-Control']).toBe('public, max-age=60');
    });

    it('authenticates mock tokens and enforces permissions', async () => {
        const missing = mockResponse();
        await invoke(MiddlewareFactory.authenticate(), request(), missing);
        expect(missing.statusCode).toBe(401);

        const invalid = mockResponse();
        await invoke(MiddlewareFactory.authenticate(), request({ headers: { authorization: 'Bearer nope' } }), invalid);
        expect(invalid.statusCode).toBe(401);

        for (const [token, tier] of [
            ['mock-admin-token', 'ENTERPRISE'],
            ['mock-user-token', 'PRO'],
            ['mock-free-token', 'FREE'],
        ] as const) {
            const req = request({ headers: { authorization: `Bearer ${token}` } });
            await invoke(MiddlewareFactory.authenticate(), req, mockResponse());
            expect((req as { user?: { tier: string } }).user?.tier).toBe(tier);
        }

        const anon = mockResponse();
        MiddlewareFactory.authorize(['read'])(request() as never, anon as never, vi.fn());
        expect(anon.statusCode).toBe(401);

        const denied = mockResponse();
        const deniedNext = vi.fn();
        MiddlewareFactory.authorize(['admin'])(
            request({ user: { id: 'free', tier: 'FREE', permissions: ['read'] } }) as never,
            denied as never,
            deniedNext,
        );
        expect(denied.statusCode).toBe(403);
        expect(deniedNext).not.toHaveBeenCalled();

        const allowedNext = vi.fn();
        MiddlewareFactory.authorize(['write'])(
            request({ user: { id: 'admin', tier: 'ENTERPRISE', permissions: ['admin'] } }) as never,
            mockResponse() as never,
            allowedNext,
        );
        expect(allowedNext).toHaveBeenCalledOnce();
    });

    it('applies cors and tier based limits', async () => {
        const preflight = mockResponse();
        const next = vi.fn();
        MiddlewareFactory.cors(['https://app.example'])(
            request({ method: 'OPTIONS', headers: { origin: 'https://app.example' } }) as never,
            preflight as never,
            next,
        );
        expect(preflight.statusCode).toBe(200);
        expect(preflight.headers['Access-Control-Allow-Origin']).toBe('https://app.example');
        expect(next).not.toHaveBeenCalled();

        const pass = vi.fn();
        MiddlewareFactory.cors(['*'])(
            request({ headers: { origin: 'https://other.example' } }) as never,
            mockResponse() as never,
            pass,
        );
        expect(pass).toHaveBeenCalledOnce();

        const limited = mockResponse();
        await invoke(
            MiddlewareFactory.tierBasedRateLimit(),
            request({ user: { id: 'pro-user', tier: 'PRO', permissions: ['read'] } }),
            limited,
        );
        expect(limited.statusCode).toBe(200);

        await invoke(MiddlewareFactory.tierBasedRateLimit(), request(), mockResponse());
    });

    it('validates request bodies and renders helper responses', () => {
        const invalid = mockResponse();
        MiddlewareFactory.validateRequest({
            validate: () => ({ error: { details: [{ message: 'email required' }] } }),
        })(request() as never, invalid as never, vi.fn());
        expect(invalid.statusCode).toBe(400);

        const broken = mockResponse();
        MiddlewareFactory.validateRequest({
            validate: () => {
                throw new Error('schema down');
            },
        })(request() as never, broken as never, vi.fn());
        expect(broken.statusCode).toBe(500);

        const req = request({ body: { userId: 'u' } });
        const next = vi.fn();
        MiddlewareFactory.validateRequest({
            validate: (body: unknown) => ({ value: { ...(body as object), trimmed: true } }),
        })(req as never, mockResponse() as never, next);
        expect(next).toHaveBeenCalledOnce();
        expect(req.body).toMatchObject({ trimmed: true });

        const ok = mockResponse();
        ResponseHelper.success(ok as never, { id: 1 }, 'created', 201);
        expect(ok.statusCode).toBe(201);
        expect(ok.body).toMatchObject({ success: true, message: 'created' });

        const err = mockResponse();
        ResponseHelper.error(err as never, 'nope', 422, { field: 'name' });
        expect(err.statusCode).toBe(422);

        const page = mockResponse();
        ResponseHelper.paginated(page as never, [1, 2], 2, 2, 5);
        expect(page.body).toMatchObject({
            pagination: { totalPages: 3, hasNext: true, hasPrev: true },
        });

        const health = mockResponse();
        MiddlewareFactory.healthCheck()(request() as never, health as never);
        expect(health.statusCode).toBe(200);

        const missing = mockResponse();
        MiddlewareFactory.notFoundHandler()(request({ path: '/nope', method: 'PUT' }) as never, missing as never);
        expect(missing.statusCode).toBe(404);

        const previous = process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';
        const failure = mockResponse();
        MiddlewareFactory.errorHandler()(new Error('boom'), request({ requestId: 'req-2' }) as never, failure as never, vi.fn());
        expect(failure.body).toMatchObject({ error: 'boom', requestId: 'req-2' });
        process.env.NODE_ENV = 'production';
        const hidden = mockResponse();
        MiddlewareFactory.errorHandler()(new Error('boom'), request() as never, hidden as never, vi.fn());
        expect(hidden.body).toMatchObject({ error: 'Internal server error' });
        process.env.NODE_ENV = previous;

        expect(RateLimitPresets.strict.maxRequests).toBe(10);
        expect(ValidationSchemas.message.userId.required).toBe(true);
    });

    it('rate limits repeated calls from the same key', async () => {
        const limiter = MiddlewareFactory.createRateLimit({ windowMs: 60_000, maxRequests: 1 });
        const req = request({ ip: `10.0.0.${Date.now() % 200}`, user: undefined });
        await invoke(limiter, req, mockResponse());
        const blocked = mockResponse();
        await invoke(limiter, req, blocked);
        expect(blocked.statusCode).toBe(429);
    });
});
