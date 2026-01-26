export type UserTier = 'FREE' | 'PRO' | 'ENTERPRISE';
export interface User {
    id: string;
    email: string;
    tier: UserTier;
    tokenLimit: number;
    tokensUsed: number;
    lastActive: Date;
}
export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp?: Date;
    metadata?: Record<string, any>;
}
export interface Session {
    userId: string;
    messages: Message[];
    createdAt: Date;
    lastActive: Date;
}
export interface ToolExecution {
    name: string;
    args: Record<string, any>;
    result?: any;
    error?: string;
    timestamp: Date;
}
export interface SecurityAuditResult {
    passed: boolean;
    vulnerabilities: string[];
    recommendations: string[];
    score: number;
}
export interface SystemStats {
    status: 'online' | 'offline' | 'degraded';
    uptime: number;
    activeSessions: number;
    mcpTools: number;
    memoryUsage: Record<string, number>;
    userTier: UserTier;
    usagePercent: number;
    errorRate?: number;
    responseTime?: number;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    timestamp: Date;
}
export interface SubscriptionConfig {
    allowProactiveHeartbeat: boolean;
    mcpCap: number;
    priority: number;
    rateLimitPerMinute: number;
    features: string[];
}
export interface HeartbeatConfig {
    intervalMs: number;
    enabled: boolean;
    proactiveChecks: string[];
}
export interface MCPTool {
    name: string;
    description: string;
    input_schema: Record<string, any>;
    category: string;
    dangerous: boolean;
}
export interface GatewayConfig {
    port: number;
    cors: {
        origins: string[];
        methods: string[];
        allowedHeaders: string[];
    };
    rateLimit: {
        windowMs: number;
        maxRequests: number;
    };
    security: {
        sandboxMode: boolean;
        tokenScope: string;
        model: string;
    };
}
export * from './channels.js';
export * from './skills.js';
