/**
 * Gravity Configuration Types
 * Type-safe configuration management
 */
export type Environment = 'development' | 'staging' | 'production' | 'test';
export interface DatabaseConfig {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
    ssl?: boolean;
    poolSize?: number;
    connectionTimeout?: number;
    acquireTimeout?: number;
}
export interface RedisConfig {
    host: string;
    port: number;
    password?: string;
    db?: number;
    keyPrefix?: string;
}
export interface SecurityConfig {
    jwtSecret: string;
    jwtExpiresIn: string;
    bcryptRounds: number;
    corsOrigins: string[];
    allowedHosts: string[];
    rateLimitWindowMs: number;
    rateLimitMaxRequests: number;
}
export interface LLMConfig {
    anthropicApiKey: string;
    anthropicModel: string;
    openRouterApiKey?: string;
    openRouterDefaultModel?: string;
    maxTokens: number;
    temperature: number;
    topP?: number;
}
export interface BillingConfig {
    polarSecretKey: string;
    polarWebhookSecret: string;
    proProductId: string;
    businessProductId: string;
}
export interface MonitoringConfig {
    sentryDsn?: string;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    enableMetrics: boolean;
    metricsPort?: number;
}
export interface GatewayConfig {
    port: number;
    host: string;
    env: Environment;
    database: DatabaseConfig;
    redis: RedisConfig;
    security: SecurityConfig;
    llm: LLMConfig;
    billing: BillingConfig;
    monitoring: MonitoringConfig;
}
export interface DashboardConfig {
    port: number;
    host: string;
    env: Environment;
    apiUrl: string;
    supabaseUrl: string;
    supabaseAnonKey: string;
    supabaseServiceKey: string;
    security: Pick<SecurityConfig, 'corsOrigins'>;
}
export declare const configValidators: {
    isValidEnvironment: (env: string) => env is Environment;
    isValidPort: (port: number) => boolean;
    isValidUrl: (url: string) => boolean;
    isValidEmail: (email: string) => boolean;
};
export declare function loadGatewayConfig(env?: NodeJS.ProcessEnv): GatewayConfig;
export declare function loadDashboardConfig(env?: NodeJS.ProcessEnv): DashboardConfig;
export declare function validateConfig<T extends Record<string, any>>(config: T, validators: Record<keyof T, (value: any) => boolean>): {
    valid: boolean;
    errors: string[];
};
