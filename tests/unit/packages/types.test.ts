import { describe, expect, it } from 'vitest';
import {
    ErrorCode,
    Errors,
    GravityError,
    configValidators,
    isPlainEmail,
    loadDashboardConfig,
    loadGatewayConfig,
    validateConfig,
} from '@gravity/types';

describe('Gravity errors', () => {
    it('serializes a gravity error', () => {
        const error = new GravityError('nope', ErrorCode.FORBIDDEN, 403, [{ message: 'no' }], 'req-1');
        const json = error.toJSON();
        expect(error.name).toBe('GravityError');
        expect(json).toMatchObject({
            success: false,
            error: 'nope',
            code: ErrorCode.FORBIDDEN,
            statusCode: 403,
            requestId: 'req-1',
        });
        expect(json.timestamp).toEqual(expect.any(String));
    });

    it('builds the standard error factories', () => {
        expect(Errors.unauthorized().statusCode).toBe(401);
        expect(Errors.forbidden('no').code).toBe(ErrorCode.FORBIDDEN);
        expect(Errors.notFound('Agent').message).toBe('Agent not found');
        expect(Errors.validation([{ message: 'bad' }]).details).toEqual([{ message: 'bad' }]);
        expect(Errors.rateLimit(5).details?.[0].message).toContain('5');
        expect(Errors.rateLimit().details).toBeUndefined();
        expect(Errors.quotaExceeded().code).toBe(ErrorCode.QUOTA_EXCEEDED);
        expect(Errors.internal().statusCode).toBe(500);
        expect(Errors.serviceUnavailable().statusCode).toBe(503);
        expect(Errors.externalApi('OpenRouter', 'down').message).toContain('OpenRouter');
        expect(Errors.database().code).toBe(ErrorCode.DATABASE_ERROR);
    });
});

describe('configuration', () => {
    it('accepts plain email addresses', () => {
        expect(isPlainEmail('dev@gravity.ai')).toBe(true);
        expect(isPlainEmail('a@b.c')).toBe(true);
        expect(isPlainEmail('not-an-email')).toBe(false);
        expect(isPlainEmail('a@@gravity.ai')).toBe(false);
        expect(isPlainEmail('@gravity.ai')).toBe(false);
        expect(isPlainEmail('dev@gravity')).toBe(false);
        expect(isPlainEmail('dev@gravity.')).toBe(false);
        expect(isPlainEmail('de v@gravity.ai')).toBe(false);
        expect(isPlainEmail(`${'a'.repeat(250)}@gravity.ai`)).toBe(false);
    });

    it('validates environment, ports, and urls', () => {
        expect(configValidators.isValidEnvironment('test')).toBe(true);
        expect(configValidators.isValidEnvironment('nope')).toBe(false);
        expect(configValidators.isValidPort(3000)).toBe(true);
        expect(configValidators.isValidPort(0)).toBe(false);
        expect(configValidators.isValidPort(70000)).toBe(false);
        expect(configValidators.isValidUrl('https://gravity.ai/docs')).toBe(true);
        expect(configValidators.isValidUrl('not a url')).toBe(false);
        expect(configValidators.isValidEmail('dev@gravity.ai')).toBe(true);
    });

    it('loads gateway defaults and overrides', () => {
        const defaults = loadGatewayConfig({});
        expect(defaults.port).toBe(3001);
        expect(defaults.database.name).toBe('gravity');
        expect(defaults.redis.keyPrefix).toBe('gravity:');
        expect(defaults.llm.temperature).toBeCloseTo(0.7);
        expect(defaults.monitoring.logLevel).toBe('info');

        const custom = loadGatewayConfig({
            NODE_ENV: 'production',
            PORT: '4100',
            HOST: '10.0.0.1',
            DB_HOST: 'db.internal',
            DB_PORT: '5433',
            DB_NAME: 'agents',
            DB_USER: 'app',
            DB_PASSWORD: 'secret',
            DB_SSL: 'true',
            DB_POOL_SIZE: '4',
            DB_CONNECTION_TIMEOUT: '1000',
            DB_ACQUIRE_TIMEOUT: '2000',
            REDIS_HOST: 'redis.internal',
            REDIS_PORT: '6380',
            REDIS_PASSWORD: 'redis-secret',
            REDIS_DB: '2',
            REDIS_KEY_PREFIX: 'g:',
            JWT_SECRET: 'jwt',
            JWT_EXPIRES_IN: '1h',
            BCRYPT_ROUNDS: '8',
            CORS_ORIGINS: 'https://a.example,https://b.example',
            ALLOWED_HOSTS: 'a.example,b.example',
            RATE_LIMIT_WINDOW_MS: '1000',
            RATE_LIMIT_MAX_REQUESTS: '5',
            ANTHROPIC_API_KEY: 'sk-ant-test',
            ANTHROPIC_MODEL: 'claude',
            OPENROUTER_API_KEY: 'sk-or-test',
            OPENROUTER_DEFAULT_MODEL: 'openai/gpt-4',
            LLM_MAX_TOKENS: '100',
            LLM_TEMPERATURE: '0.2',
            LLM_TOP_P: '0.9',
            POLAR_SECRET_KEY: 'polar',
            POLAR_WEBHOOK_SECRET: 'hook',
            POLAR_PRO_PRODUCT_ID: 'pro',
            POLAR_BUSINESS_PRODUCT_ID: 'biz',
            SENTRY_DSN: 'https://sentry.example',
            LOG_LEVEL: 'debug',
            ENABLE_METRICS: 'true',
            METRICS_PORT: '9090',
        });

        expect(custom.env).toBe('production');
        expect(custom.port).toBe(4100);
        expect(custom.database.ssl).toBe(true);
        expect(custom.security.corsOrigins).toEqual(['https://a.example', 'https://b.example']);
        expect(custom.llm.topP).toBeCloseTo(0.9);
        expect(custom.monitoring.enableMetrics).toBe(true);
        expect(custom.monitoring.metricsPort).toBe(9090);
    });

    it('loads dashboard defaults and overrides', () => {
        const defaults = loadDashboardConfig({});
        expect(defaults.port).toBe(3000);
        expect(defaults.apiUrl).toBe('http://localhost:3001');

        const custom = loadDashboardConfig({
            NODE_ENV: 'staging',
            PORT: '3010',
            HOST: '127.0.0.1',
            NEXT_PUBLIC_API_URL: 'https://api.example',
            NEXT_PUBLIC_SUPABASE_URL: 'https://db.example',
            NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon',
            SUPABASE_SERVICE_ROLE_KEY: 'service',
            CORS_ORIGINS: 'https://app.example',
        });
        expect(custom.env).toBe('staging');
        expect(custom.supabaseServiceKey).toBe('service');
        expect(custom.security.corsOrigins).toEqual(['https://app.example']);
    });

    it('reports invalid configuration keys', () => {
        const result = validateConfig(
            { port: 0, name: 'ok' },
            {
                port: (value) => configValidators.isValidPort(value),
                name: (value) => value === 'ok',
            },
        );
        expect(result.valid).toBe(false);
        expect(result.errors[0]).toContain('port');

        const ok = validateConfig({ port: 3000 }, { port: (value) => configValidators.isValidPort(value) });
        expect(ok).toEqual({ valid: true, errors: [] });
    });
});
