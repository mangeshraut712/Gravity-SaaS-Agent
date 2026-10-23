/**
 * Gateway HTTP application.
 * Route registration lives here so tests can boot the app without listening.
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import {
    MiddlewareFactory,
    errorHandler,
    notFoundHandler,
    asyncHandler,
} from './middleware/index.js';
import { CacheManager } from './services/cache.js';
import { logger } from './services/logger.js';
import { healthCheckService } from './services/health-check.js';
import { GravityMemory } from '@gravity/memory';
import { GravityMCPClient } from '@gravity/mcp-client';
import { GravityDB } from '@gravity/db';
import { ChannelManager } from './services/channel-manager.js';
import { SkillsPlatform } from './services/skills-platform.js';
import { SystemStats, Session, ChatCompletionRequest, ChannelType } from '@gravity/types';
import { modelProviderManager } from './services/model-provider.js';
import { circuitBreakerManager } from './services/circuit-breaker.js';
import { rateLimiter } from './services/rate-limiter.js';

const SESSION_TTL = 24 * 60 * 60 * 1000;

export interface GatewayModelProvider {
    getAvailableProviders(): string[];
    getProvider(name?: string): { listModels(): Promise<string[]> } | undefined;
    chatCompletion(request: ChatCompletionRequest): Promise<{
        content: string;
        model: string;
        usage?: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        };
    }>;
    getProviderStats(): Promise<Record<string, unknown>>;
}

export interface GatewayCache {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, options?: { ttl?: number }): Promise<void>;
}

export interface GatewayHealth {
    getHealthStatus(): Promise<{ status: string }>;
}

export interface GatewayDependencies {
    memory?: GravityMemory;
    mcp?: GravityMCPClient;
    db?: GravityDB;
    cacheManager?: GatewayCache;
    channelManager?: ChannelManager;
    skillsPlatform?: SkillsPlatform;
    sessions?: Map<string, Session>;
    modelProvider?: GatewayModelProvider;
    healthCheck?: GatewayHealth;
}

export interface GatewayRuntime {
    app: express.Express;
    sessions: Map<string, Session>;
    channelManager: ChannelManager;
    db: GravityDB;
    mcp: GravityMCPClient;
    cacheManager: GatewayCache;
    skillsPlatform: SkillsPlatform;
}

export function startSessionCleanup(
    sessions: Map<string, Session>,
    intervalMs = 60 * 60 * 1000,
    ttlMs = SESSION_TTL,
): () => void {
    const timer = setInterval(() => {
        const now = Date.now();
        for (const [userId, session] of sessions.entries()) {
            if (now - session.lastActive.getTime() > ttlMs) {
                sessions.delete(userId);
                logger.info(`Session expired for user: ${userId}`);
            }
        }
    }, intervalMs);
    timer.unref?.();
    return () => clearInterval(timer);
}

export function createGatewayApp(deps: GatewayDependencies = {}): GatewayRuntime {
    const db = deps.db ?? new GravityDB();
    const memory = deps.memory ?? new GravityMemory(process.env.ANTHROPIC_API_KEY || '');
    const mcp = deps.mcp ?? new GravityMCPClient();
    const cacheManager = deps.cacheManager ?? new CacheManager();
    const channelManager = deps.channelManager ?? new ChannelManager();
    const skillsPlatform = deps.skillsPlatform ?? new SkillsPlatform(memory, mcp);
    const sessions = deps.sessions ?? new Map<string, Session>();
    const modelProvider = deps.modelProvider ?? modelProviderManager;
    const healthCheck = deps.healthCheck ?? healthCheckService;

    const app = express();

    app.use(MiddlewareFactory.security());
    app.use(MiddlewareFactory.compressionMiddleware());
    app.use(MiddlewareFactory.requestId());
    app.use(express.json({ limit: '10mb' }));
    app.use(cors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }));
    app.use(logger.requestLogger());

    app.use('/api/', MiddlewareFactory.createRateLimit({
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
    }));

    app.get('/health', asyncHandler(async (_req: Request, res: Response) => {
        const health = await healthCheck.getHealthStatus();
        const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503;
        res.status(statusCode).json(health);
    }));

    app.get('/stats', asyncHandler(async (req: Request, res: Response) => {
        const cacheKey = 'system:stats';

        const cached = await cacheManager.get<SystemStats>(cacheKey);
        if (cached) {
            return res.json({ success: true, data: cached, cached: true });
        }

        const userId = (req.query.userId as string) || 'demo-user';
        const user = await db.getUser(userId);
        const tools = await mcp.getTools();
        const memUsage = process.memoryUsage();

        const stats: SystemStats = {
            status: 'online',
            uptime: process.uptime(),
            activeSessions: sessions.size,
            mcpTools: tools.length,
            memoryUsage: {
                rss: Math.round(memUsage.rss / 1024 / 1024),
                heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
                heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
                external: Math.round(memUsage.external / 1024 / 1024),
                arrayBuffers: Math.round((memUsage.arrayBuffers || 0) / 1024 / 1024),
            },
            userTier: user?.tier || 'FREE',
            usagePercent: user ? (user.tokensUsed / user.tokenLimit) * 100 : 0,
            errorRate: 0,
            responseTime: 0,
            lastUpdated: new Date(),
        };

        await cacheManager.set(cacheKey, stats, { ttl: 30 });

        res.json({ success: true, data: stats });
    }));

    const apiRouter = express.Router();

    apiRouter.get('/skills', asyncHandler(async (_req: Request, res: Response) => {
        const skills = await skillsPlatform.getAvailableSkills();
        res.json({ success: true, data: skills });
    }));

    apiRouter.post('/skills/:skillId/execute', asyncHandler(async (req: Request, res: Response) => {
        const { skillId } = req.params;
        const result = await mcp.callTool(skillId, req.body);
        res.json({ success: true, data: result });
    }));

    apiRouter.get('/channels', asyncHandler(async (_req: Request, res: Response) => {
        const channels = channelManager.getConfiguredStatuses();
        res.json({ success: true, data: channels });
    }));

    apiRouter.post('/channels/:channelType/send', asyncHandler(async (req: Request, res: Response) => {
        const { channelType } = req.params;
        const { channelId, message } = req.body;
        await channelManager.sendMessage(channelType as ChannelType, channelId, message);
        res.json({ success: true, message: 'Message sent' });
    }));

    apiRouter.post('/chat', asyncHandler(async (req: Request, res: Response) => {
        const { message, userId = 'demo-user', conversationId, model, temperature, maxTokens } = req.body;

        logger.info('Processing chat message via OpenRouter', { userId, conversationId, model });

        let session = sessions.get(userId);
        if (!session) {
            session = {
                userId,
                messages: [],
                createdAt: new Date(),
                lastActive: new Date(),
            };
            sessions.set(userId, session);
        }

        session.messages.push({
            role: 'user',
            content: message,
            timestamp: new Date(),
        });

        let response: string;
        let usage: { promptTokens: number; completionTokens: number; totalTokens: number } | undefined;
        let usedModel = model || 'openrouter/anthropic/claude-3.5-sonnet';

        const provider = modelProvider.getProvider('openrouter');
        if (provider) {
            try {
                logger.info('Calling OpenRouter API', { model: usedModel, messageCount: session.messages.length });

                const completionRequest: ChatCompletionRequest = {
                    messages: session.messages,
                    model: usedModel,
                    temperature: temperature || 0.7,
                    maxTokens: maxTokens || 4000
                };

                const completion = await modelProvider.chatCompletion(completionRequest);
                response = completion.content;
                usage = completion.usage;
                usedModel = completion.model;

                logger.info('OpenRouter response received', {
                    model: usedModel,
                    tokens: usage ? `${usage.promptTokens}+${usage.completionTokens}` : 'unknown'
                });
            } catch (error) {
                logger.error('OpenRouter API error, falling back to echo', { error: String(error) });
                response = `I apologize, but I encountered an issue processing your request. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
            }
        } else {
            logger.warn('No OpenRouter provider available, using echo fallback');
            response = `Echo: ${message} (OpenRouter not configured - set OPENROUTER_API_KEY in environment)`;
        }

        session.messages.push({
            role: 'assistant',
            content: response,
            timestamp: new Date(),
        });

        session.lastActive = new Date();

        res.json({
            success: true,
            data: {
                response,
                conversationId: conversationId || userId,
                model: usedModel,
                usage
            }
        });
    }));

    apiRouter.get('/models', asyncHandler(async (_req: Request, res: Response) => {
        logger.info('Fetching available models from OpenRouter');

        const provider = modelProvider.getProvider('openrouter');
        if (!provider) {
            return res.json({
                success: false,
                error: 'OpenRouter provider not configured',
                data: {
                    providers: modelProvider.getAvailableProviders(),
                    defaultModel: 'openrouter/anthropic/claude-3.5-sonnet'
                }
            });
        }

        try {
            const models = await provider.listModels();
            res.json({
                success: true,
                data: {
                    provider: 'openrouter',
                    models,
                    defaultModel: 'openrouter/anthropic/claude-3.5-sonnet'
                }
            });
        } catch (error) {
            logger.error('Failed to fetch models', { error: String(error) });
            res.json({
                success: false,
                error: 'Failed to fetch models',
                data: {
                    fallbackModels: [
                        'openrouter/anthropic/claude-sonnet-4-5',
                        'openrouter/anthropic/claude-3.5-sonnet',
                        'openrouter/openai/gpt-4',
                        'openrouter/openai/gpt-4-turbo',
                        'openrouter/meta-llama/llama-3.1-70b-instruct',
                        'openrouter/google/gemini-pro'
                    ]
                }
            });
        }
    }));

    apiRouter.get('/providers/status', asyncHandler(async (_req: Request, res: Response) => {
        const providers = modelProvider.getAvailableProviders();
        const stats = await modelProvider.getProviderStats();

        res.json({
            success: true,
            data: {
                providers,
                stats,
                configured: providers.length > 0
            }
        });
    }));

    apiRouter.get('/circuit-breakers', asyncHandler(async (_req: Request, res: Response) => {
        const stats = circuitBreakerManager.getAllStats();

        res.json({
            success: true,
            data: {
                circuitBreakers: stats,
                count: stats.length
            }
        });
    }));

    apiRouter.get('/rate-limit', asyncHandler(async (_req: Request, res: Response) => {
        const stats = rateLimiter.getStats();

        res.json({
            success: true,
            data: stats
        });
    }));

    apiRouter.get('/docs', asyncHandler(async (_req: Request, res: Response) => {
        res.json({
            openapi: '3.0.3',
            info: {
                title: 'AgentFlow API',
                description: 'Multi-tenant AI Agent SaaS Platform API',
                version: '1.0.0'
            },
            servers: [
                { url: 'http://localhost:3001', description: 'Development' },
                { url: 'https://api.agentflow.ai', description: 'Production' }
            ],
            paths: {
                '/health': {
                    get: {
                        summary: 'Health check',
                        responses: { '200': { description: 'Gateway is healthy' } }
                    }
                },
                '/api/v1/chat': {
                    post: {
                        summary: 'Send chat message',
                        requestBody: {
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            message: { type: 'string' },
                                            userId: { type: 'string' },
                                            conversationId: { type: 'string' },
                                            model: { type: 'string' }
                                        }
                                    }
                                }
                            }
                        },
                        responses: { '200': { description: 'AI response' } }
                    }
                },
                '/api/v1/models': {
                    get: {
                        summary: 'List available models',
                        responses: { '200': { description: 'List of models' } }
                    }
                }
            }
        });
    }));

    app.use('/api/v1', apiRouter);
    app.use(notFoundHandler);
    app.use(errorHandler);

    return {
        app,
        sessions,
        channelManager,
        db,
        mcp,
        cacheManager,
        skillsPlatform,
    };
}
