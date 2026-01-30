/**
 * Gravity Configuration Types
 * Type-safe configuration management
 */
// Configuration validators
export const configValidators = {
    isValidEnvironment: (env) => {
        return ['development', 'staging', 'production', 'test'].includes(env);
    },
    isValidPort: (port) => {
        return Number.isInteger(port) && port > 0 && port < 65536;
    },
    isValidUrl: (url) => {
        try {
            new URL(url);
            return true;
        }
        catch {
            return false;
        }
    },
    isValidEmail: (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
};
// Configuration loaders with defaults
export function loadGatewayConfig(env = process.env) {
    const environment = env.NODE_ENV || 'development';
    return {
        port: parseInt(env.PORT || '3001', 10),
        host: env.HOST || '0.0.0.0',
        env: environment,
        database: {
            host: env.DB_HOST || 'localhost',
            port: parseInt(env.DB_PORT || '5432', 10),
            name: env.DB_NAME || 'gravity',
            user: env.DB_USER || 'gravity',
            password: env.DB_PASSWORD || '',
            ssl: env.DB_SSL === 'true',
            poolSize: parseInt(env.DB_POOL_SIZE || '10', 10),
            connectionTimeout: parseInt(env.DB_CONNECTION_TIMEOUT || '30000', 10),
            acquireTimeout: parseInt(env.DB_ACQUIRE_TIMEOUT || '60000', 10),
        },
        redis: {
            host: env.REDIS_HOST || 'localhost',
            port: parseInt(env.REDIS_PORT || '6379', 10),
            password: env.REDIS_PASSWORD,
            db: parseInt(env.REDIS_DB || '0', 10),
            keyPrefix: env.REDIS_KEY_PREFIX || 'gravity:',
        },
        security: {
            jwtSecret: env.JWT_SECRET || 'development-secret-change-in-production',
            jwtExpiresIn: env.JWT_EXPIRES_IN || '24h',
            bcryptRounds: parseInt(env.BCRYPT_ROUNDS || '12', 10),
            corsOrigins: (env.CORS_ORIGINS || 'http://localhost:3000').split(','),
            allowedHosts: (env.ALLOWED_HOSTS || 'localhost').split(','),
            rateLimitWindowMs: parseInt(env.RATE_LIMIT_WINDOW_MS || '900000', 10),
            rateLimitMaxRequests: parseInt(env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
        },
        llm: {
            anthropicApiKey: env.ANTHROPIC_API_KEY || '',
            anthropicModel: env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
            openRouterApiKey: env.OPENROUTER_API_KEY,
            openRouterDefaultModel: env.OPENROUTER_DEFAULT_MODEL || 'anthropic/claude-3.5-sonnet',
            maxTokens: parseInt(env.LLM_MAX_TOKENS || '4000', 10),
            temperature: parseFloat(env.LLM_TEMPERATURE || '0.7'),
            topP: env.LLM_TOP_P ? parseFloat(env.LLM_TOP_P) : undefined,
        },
        billing: {
            polarSecretKey: env.POLAR_SECRET_KEY || '',
            polarWebhookSecret: env.POLAR_WEBHOOK_SECRET || '',
            proProductId: env.POLAR_PRO_PRODUCT_ID || '',
            businessProductId: env.POLAR_BUSINESS_PRODUCT_ID || '',
        },
        monitoring: {
            sentryDsn: env.SENTRY_DSN,
            logLevel: env.LOG_LEVEL || 'info',
            enableMetrics: env.ENABLE_METRICS === 'true',
            metricsPort: env.METRICS_PORT ? parseInt(env.METRICS_PORT, 10) : undefined,
        },
    };
}
export function loadDashboardConfig(env = process.env) {
    const environment = env.NODE_ENV || 'development';
    return {
        port: parseInt(env.PORT || '3000', 10),
        host: env.HOST || '0.0.0.0',
        env: environment,
        apiUrl: env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
        supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
        supabaseAnonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        supabaseServiceKey: env.SUPABASE_SERVICE_ROLE_KEY || '',
        security: {
            corsOrigins: (env.CORS_ORIGINS || 'http://localhost:3000').split(','),
        },
    };
}
// Configuration validation
export function validateConfig(config, validators) {
    const errors = [];
    for (const [key, validator] of Object.entries(validators)) {
        const value = config[key];
        if (!validator(value)) {
            errors.push(`Invalid configuration for ${key}: ${value}`);
        }
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
