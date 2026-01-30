/**
 * Enhanced Gateway Index
 * Production-ready gateway with all enhancements
 */

import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import {
    MiddlewareFactory,
    errorHandler,
    notFoundHandler,
    asyncHandler,
    validate,
} from './middleware/index.js';
import { WebSocketManager } from './services/websocket.js';
import { CacheManager } from './services/cache.js';
import { logger, LogLevel } from './services/logger.js';
import { healthCheckService, registerDefaultHealthChecks } from './services/health-check.js';
import { GravityMemory } from '@gravity/memory';
import { GravityMCPClient } from '@gravity/mcp-client';
import { WhatsAppAdapter } from './adapters/whatsapp.js';
import { WhatsAppAdapter as EnhancedWhatsApp, TelegramAdapter, SlackAdapter } from './adapters/enhanced-channels.js';
import { HeartbeatService } from './services/heartbeat.js';
import { SecurityService } from './services/security.js';
import { GravityDB } from '@gravity/db';
import { SubscriptionService } from './services/billing/subscription.js';
import { ChannelManager } from './services/channel-manager.js';
import { SkillsPlatform } from './services/skills-platform.js';
import { ApiResponse, SystemStats, Session, ChannelMessage, ChatCompletionRequest } from '@gravity/types';
import { modelProviderManager } from './services/model-provider.js';

dotenv.config();

const app = express();
const server = createServer(app);
const port = process.env.PORT || 3003;

// Initialize core services
const apiKey = process.env.ANTHROPIC_API_KEY || '';
const memory = new GravityMemory(apiKey);
const mcp = new GravityMCPClient();
const whatsapp = new WhatsAppAdapter();
const heartbeat = new HeartbeatService(30000);
const security = new SecurityService();
const db = new GravityDB();
const subscription = new SubscriptionService(db);

// Initialize enhanced services
const channelManager = new ChannelManager();
const skillsPlatform = new SkillsPlatform(memory, mcp);
const cacheManager = new CacheManager();
const wsManager = new WebSocketManager(server, { maxClients: 1000 });

// Initialize model provider manager (OpenRouter)
await modelProviderManager.init();
logger.info('Model provider manager initialized', { providers: modelProviderManager.getAvailableProviders() });

// Register default health checks
registerDefaultHealthChecks();

// Enhanced session store with TTL and cleanup
const sessions = new Map<string, Session>();
const SESSION_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Session cleanup interval
setInterval(() => {
    const now = Date.now();
    for (const [userId, session] of sessions.entries()) {
        if (now - session.lastActive.getTime() > SESSION_TTL) {
            sessions.delete(userId);
            logger.info(`Session expired for user: ${userId}`);
        }
    }
}, 60 * 60 * 1000); // Cleanup every hour

// Enhanced middleware setup
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

// Rate limiting
app.use('/api/', MiddlewareFactory.createRateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
}));

// Health check endpoint
app.get('/health', asyncHandler(async (_req: Request, res: Response) => {
    const health = await healthCheckService.getHealthStatus();
    const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503;
    res.status(statusCode).json(health);
}));

// System stats endpoint
app.get('/stats', asyncHandler(async (req: Request, res: Response) => {
    const cacheKey = 'system:stats';

    // Try to get from cache
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

    // Cache for 30 seconds
    await cacheManager.set(cacheKey, stats, { ttl: 30 });

    res.json({ success: true, data: stats });
}));

// API Routes
const apiRouter = express.Router();

// Skills management
apiRouter.get('/skills', asyncHandler(async (_req: Request, res: Response) => {
    const skills = await skillsPlatform.getAvailableSkills();
    res.json({ success: true, data: skills });
}));

apiRouter.post('/skills/:skillId/execute', asyncHandler(async (req: Request, res: Response) => {
    const { skillId } = req.params;
    // Execute skill through MCP
    const result = await mcp.callTool(skillId, req.body);
    res.json({ success: true, data: result });
}));

// Channel management
apiRouter.get('/channels', asyncHandler(async (_req: Request, res: Response) => {
    // Get channel statuses from the manager
    const statuses = (channelManager as any)['channelStatuses'] as Map<string, string>;
    const channels = Array.from(statuses.entries()).map(([type, status]) => ({
        type,
        status,
    }));
    res.json({ success: true, data: channels });
}));

apiRouter.post('/channels/:channelType/send', asyncHandler(async (req: Request, res: Response) => {
    const { channelType } = req.params;
    const { channelId, message } = req.body;
    await channelManager.sendMessage(channelType as any, channelId, message);
    res.json({ success: true, message: 'Message sent' });
}));

// Chat endpoint with OpenRouter integration
apiRouter.post('/chat', asyncHandler(async (req: Request, res: Response) => {
    const { message, userId = 'demo-user', conversationId, model, temperature, maxTokens } = req.body;

    logger.info('Processing chat message via OpenRouter', { userId, conversationId, model });

    // Get or create session
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

    // Add user message
    session.messages.push({
        role: 'user',
        content: message,
        timestamp: new Date(),
    });

    // Prepare messages for OpenRouter
    const messagesForModel = [
        { role: 'system', content: 'You are a helpful AI assistant.' },
        ...session.messages.map(msg => ({
            role: msg.role as 'user' | 'assistant' | 'system',
            content: msg.content
        }))
    ];

    let response: string;
    let usage: any = null;
    let usedModel = model || 'openrouter/anthropic/claude-3.5-sonnet';

    // Check if OpenRouter provider is available
    const provider = modelProviderManager.getProvider('openrouter');
    if (provider) {
        try {
            logger.info('Calling OpenRouter API', { model: usedModel, messageCount: messagesForModel.length });

            const completionRequest: ChatCompletionRequest = {
                messages: session.messages,
                model: usedModel,
                temperature: temperature || 0.7,
                maxTokens: maxTokens || 4000
            };

            const completion = await modelProviderManager.chatCompletion(completionRequest);
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
        // Fallback if no provider available
        logger.warn('No OpenRouter provider available, using echo fallback');
        response = `Echo: ${message} (OpenRouter not configured - set OPENROUTER_API_KEY in environment)`;
    }

    // Add assistant response
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

// List available models from OpenRouter
apiRouter.get('/models', asyncHandler(async (_req: Request, res: Response) => {
    logger.info('Fetching available models from OpenRouter');

    const provider = modelProviderManager.getProvider('openrouter');
    if (!provider) {
        return res.json({
            success: false,
            error: 'OpenRouter provider not configured',
            data: {
                providers: modelProviderManager.getAvailableProviders(),
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

// Get provider status and usage stats
apiRouter.get('/providers/status', asyncHandler(async (_req: Request, res: Response) => {
    const providers = modelProviderManager.getAvailableProviders();
    const stats = await modelProviderManager.getProviderStats();

    res.json({
        success: true,
        data: {
            providers,
            stats,
            configured: providers.length > 0
        }
    });
}));

// Circuit breaker status
apiRouter.get('/circuit-breakers', asyncHandler(async (_req: Request, res: Response) => {
    const { circuitBreakerManager } = await import('./services/circuit-breaker.js');
    const stats = circuitBreakerManager.getAllStats();

    res.json({
        success: true,
        data: {
            circuitBreakers: stats,
            count: stats.length
        }
    });
}));

// Rate limiter status
apiRouter.get('/rate-limit', asyncHandler(async (_req: Request, res: Response) => {
    const { rateLimiter } = await import('./services/rate-limiter.js');
    const stats = rateLimiter.getStats();

    res.json({
        success: true,
        data: stats
    });
}));

// API documentation endpoint (serves OpenAPI spec)
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

// Mount API router
app.use('/api/v1', apiRouter);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Channel message handling
channelManager.onMessage(async (message: ChannelMessage) => {
    logger.info('Received channel message', { channelId: message.channelId, userId: message.userId });
    // Process channel message
});

// Start server
server.listen(port, () => {
    logger.info(`🚀 Enhanced Gravity Gateway running on port ${port}`, {
        port,
        env: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0',
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
        logger.info('Server closed');
        healthCheckService.destroy();
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    server.close(() => {
        logger.info('Server closed');
        healthCheckService.destroy();
        process.exit(0);
    });
});
