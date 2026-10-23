import { describe, expect, it, vi } from 'vitest';
import { commonSchemas, sanitizeInput, validate } from '../../../apps/gateway/src/middleware/validation.js';
import { mockResponse } from '../../helpers/http.js';

function runValidate(schema: Parameters<typeof validate>[0], req: Record<string, unknown>) {
    const res = mockResponse();
    const next = vi.fn();
    validate(schema)(req as never, res as never, next);
    return { res, next };
}

describe('request validation', () => {
    it('accepts a payload that matches the schema', () => {
        const { res, next } = runValidate(
            {
                body: {
                    email: commonSchemas.email,
                    password: commonSchemas.password,
                    age: { type: 'number', minimum: 1, maximum: 120 },
                    role: { type: 'string', enum: ['user', 'admin'] },
                    tags: { type: 'array', minLength: 1, maxLength: 3, items: { type: 'string' } },
                    profile: {
                        type: 'object',
                        properties: { city: { type: 'string', required: true } },
                    },
                    website: { type: 'url' },
                    id: commonSchemas.uuid,
                    nickname: { type: 'string', pattern: '^[a-z]+$', patternError: 'letters only' },
                    code: { type: 'string', validate: (value: string) => value === 'ok' || 'bad code' },
                },
                query: { page: { type: 'number' } },
                params: { id: commonSchemas.uuid },
                headers: { 'x-request-id': { type: 'string', required: true } },
            },
            {
                body: {
                    email: 'dev@gravity.ai',
                    password: 'long-enough',
                    age: 30,
                    role: 'user',
                    tags: ['a'],
                    profile: { city: 'Philly' },
                    website: 'https://gravity.ai',
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    nickname: 'dev',
                    code: 'ok',
                },
                query: { page: 1 },
                params: { id: '123e4567-e89b-12d3-a456-426614174000' },
                headers: { 'x-request-id': 'req-1' },
                requestId: 'req-1',
            },
        );

        expect(next).toHaveBeenCalledOnce();
        expect(res.statusCode).toBe(200);
    });

    it('rejects missing, mistyped, and out of range values', () => {
        const cases = [
            { body: { name: { type: 'string', required: true } }, req: { body: {} }, message: 'name is required' },
            { body: { name: { type: 'string' } }, req: { body: { name: 1 } }, message: 'must be of type string' },
            { body: { name: { type: 'string', minLength: 3 } }, req: { body: { name: 'ab' } }, message: 'at least 3' },
            { body: { name: { type: 'string', maxLength: 2 } }, req: { body: { name: 'abcd' } }, message: 'at most 2' },
            { body: { count: { type: 'number', minimum: 2 } }, req: { body: { count: 1 } }, message: 'at least 2' },
            { body: { count: { type: 'number', maximum: 2 } }, req: { body: { count: 3 } }, message: 'at most 2' },
            { body: { name: { type: 'string', pattern: '^[a-z]+$' } }, req: { body: { name: 'A1' } }, message: 'format is invalid' },
            { body: { role: { type: 'string', enum: ['user'] } }, req: { body: { role: 'admin' } }, message: 'must be one of' },
            { body: { profile: { type: 'object', properties: { city: { type: 'string', required: true } } } }, req: { body: { profile: {} } }, message: 'profile.city is required' },
            { body: { tags: { type: 'array', items: { type: 'number' } } }, req: { body: { tags: ['nope'] } }, message: 'tags[0]' },
            { body: { code: { type: 'string', validate: () => 'nope' } }, req: { body: { code: 'x' } }, message: 'nope' },
            { body: { code: { type: 'string', validate: () => false } }, req: { body: { code: 'x' } }, message: 'code is invalid' },
            { body: { email: { type: 'email', required: true } }, req: { body: { email: 'bad' } }, message: 'type email' },
            { body: { flag: { type: 'boolean', required: true } }, req: { body: { flag: 'yes' } }, message: 'type boolean' },
        ];

        for (const entry of cases) {
            const { res, next } = runValidate({ body: entry.body }, { ...entry.req, query: {}, params: {}, headers: {} });
            expect(next).not.toHaveBeenCalled();
            expect(res.statusCode).toBe(400);
            expect(JSON.stringify(res.body)).toContain(entry.message);
        }
    });

    it('skips optional empty values and escapes input', () => {
        const { next } = runValidate(
            { body: { nickname: { type: 'string' } }, query: commonSchemas.pagination },
            { body: { nickname: undefined }, query: {}, params: {}, headers: {} },
        );
        expect(next).toHaveBeenCalledOnce();

        const req = {
            body: { note: '<script>"alert"</script>', nested: { ok: true }, items: ["a'b"] },
            query: { q: '<b>' },
        };
        const res = mockResponse();
        const sanitizeNext = vi.fn();
        sanitizeInput(req as never, res as never, sanitizeNext);
        expect(sanitizeNext).toHaveBeenCalledOnce();
        expect(req.body.note).toBe('&lt;script&gt;&quot;alert&quot;&lt;/script&gt;');
        expect(req.body.items[0]).toBe('a&#39;b');
        expect(req.query.q).toBe('&lt;b&gt;');
        expect(req.body.nested).toEqual({ ok: true });
    });
});
