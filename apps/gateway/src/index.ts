import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
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
import { ApiResponse, SystemStats, Session, Message, ChannelMessage } from '@gravity/types';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

app.use(express.json({ limit: '10mb' }));

// Initialize CORS before routes
import cors from 'cors';
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: { error: 'Too many requests from this IP' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

const apiKey = process.env.ANTHROPIC_API_KEY || '';
const memory = new GravityMemory(apiKey);
const mcp = new GravityMCPClient();
const whatsapp = new WhatsAppAdapter();
const heartbeat = new HeartbeatService(30000); // Check every 30s for demo
const security = new SecurityService();

const db = new GravityDB();
const subscription = new SubscriptionService(db);

// Initialize enhanced multi-channel system
const channelManager = new ChannelManager();
const skillsPlatform = new SkillsPlatform(memory, mcp);

// Register enhanced channel adapters
channelManager.registerAdapter(new EnhancedWhatsApp());
channelManager.registerAdapter(new TelegramAdapter());
channelManager.registerAdapter(new SlackAdapter());

// Set up channel message handling
channelManager.onMessage(async (message: ChannelMessage) => {
    await processChannelMessage(message);
});

// Enhanced session store with TTL and cleanup
const sessions = new Map<string, Session>();
const SESSION_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Session cleanup interval
setInterval(() => {
    const now = Date.now();
    for (const [userId, session] of sessions.entries()) {
        if (now - session.lastActive.getTime() > SESSION_TTL) {
            sessions.delete(userId);
            console.log(`[Session] Cleaned up expired session for ${userId}`);
        }
    }
}, 60 * 60 * 1000); // Cleanup every hour

// Enhanced error handling and logging
const logger = {
    info: (message: string, meta?: any) => console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta || ''),
    warn: (message: string, meta?: any) => console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta || ''),
    error: (message: string, error?: any) => console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error || '')
};

// Enhanced message processing for multi-channel support
async function processChannelMessage(channelMessage: ChannelMessage): Promise<void> {
    try {
        logger.info(`Processing ${channelMessage.metadata?.isGroup ? 'group' : 'direct'} message from ${channelMessage.userId}`, {
            channel: channelMessage.channelId,
            contentLength: channelMessage.content.length
        });
        
        // Check for mentions in group messages
        if (channelMessage.metadata?.isGroup && channelMessage.metadata.mentions?.length === 0) {
            logger.info('Skipping group message without mentions');
            return;
        }
        
        // 1. Validate SaaS Access
        const access = await subscription.validateAccess(channelMessage.userId);
        if (!access.allowed) {
            await channelManager.sendMessage(
                'whatsapp' as any, // Extract channel type from channelId
                channelMessage.channelId,
                `🚫 Access Denied: ${access.reason}. Upgrade at gravitybot.ai/pricing`
            );
            return;
        }

        // 2. Get or create user workspace
        let workspace = skillsPlatform.getWorkspace(channelMessage.userId);
        if (!workspace) {
            workspace = await skillsPlatform.createWorkspace(
                channelMessage.userId,
                `Workspace-${channelMessage.userId}`,
                ['web-search', 'file-manager']
            );
        }

        // 3. Process message through skills platform
        const execution = await skillsPlatform.executeSkill(
            'web-search', // Default skill for demo
            workspace.id,
            channelMessage.userId,
            channelMessage.content
        );

        // 4. Send response back through the same channel
        if (execution.output) {
            await channelManager.sendMessage(
                'whatsapp' as any, // Extract channel type from channelId
                channelMessage.channelId,
                execution.output
            );
        }

        logger.info(`Channel message processed successfully for ${channelMessage.userId}`);
        
    } catch (error) {
        logger.error(`Error processing channel message for ${channelMessage.userId}`, error);
        
        // Send error response
        try {
            await channelManager.sendMessage(
                'whatsapp' as any,
                channelMessage.channelId,
                '❌ Sorry, I encountered an error processing your message.'
            );
        } catch (sendError) {
            logger.error('Failed to send error response', sendError);
        }
    }
}

// Core Logic Handler with enhanced error handling
async function processMessage(userId: string, text: string): Promise<string> {
    try {
        logger.info(`Processing message from ${userId}`, { textLength: text.length });
        
        // 1. Validate SaaS Access
        const access = await subscription.validateAccess(userId);
        if (!access.allowed) {
            logger.warn(`Access denied for ${userId}`, { reason: access.reason });
            return `🚫 Access Denied: ${access.reason}. Upgrade at gravitybot.ai/pricing`;
        }

        // Get or create session
        let session = sessions.get(userId);
        if (!session) {
            session = {
                userId,
                messages: [],
                createdAt: new Date(),
                lastActive: new Date()
            };
            sessions.set(userId, session);
        }

        // 2. Manage Usage
        const tokens = Math.floor(text.length / 4) + 500;
        await db.incrementUsage(userId, tokens);

        // 3. Get cost-optimized context
        const { system, messages } = await memory.getEffectiveContext(
            [...session.messages.map(m => ({ role: m.role, content: m.content })), { role: 'user', content: text }],
            "You are GravityBot, a personal AI assistant built for the future."
        );

        // 4. Fetch MCP tools
        const tools = await mcp.getTools();

        // 5. Enhanced logic for tool execution
        let reply = '';
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('search')) {
            const query = text.replace(/search/i, '').trim();
            try {
                const toolResult = await mcp.callTool('web_search', { query });
                reply = `🔍 I searched for "${query}".\n${toolResult.result}`;
            } catch (error) {
                logger.error('Search tool failed', error);
                reply = `❌ Sorry, I encountered an error while searching for "${query}".`;
            }
        } else if (lowerText.includes('file') && lowerText.includes('read')) {
            reply = `📁 File reading capability detected. Please specify the file path.`;
        } else {
            reply = `✅ Processed: "${text}". Memory optimized. ${tools.length} Tools active.`;
        }

        // 6. Update session
        const userMessage: Message = { role: 'user', content: text, timestamp: new Date() };
        const assistantMessage: Message = { role: 'assistant', content: reply, timestamp: new Date() };
        
        session.messages.push(userMessage, assistantMessage);
        session.lastActive = new Date();
        
        // Keep only last 50 messages to prevent memory bloat
        if (session.messages.length > 50) {
            session.messages = session.messages.slice(-50);
        }

        logger.info(`Message processed successfully for ${userId}`);
        return reply;
        
    } catch (error) {
        logger.error(`Error processing message for ${userId}`, error);
        return '❌ Sorry, I encountered an unexpected error. Please try again.';
    }
}

// Enhanced REST API with proper error handling and response format
app.post('/api/message', async (req: Request, res: Response) => {
    const { userId, text } = req.body;
    if (!userId || !text) {
        return res.status(400).json({
            success: false,
            error: 'Missing userId or text',
            timestamp: new Date()
        } as ApiResponse);
    }

    try {
        const reply = await processMessage(userId, text);
        res.json({
            success: true,
            data: { reply },
            timestamp: new Date()
        } as ApiResponse);
    } catch (error) {
        logger.error('Message processing failed', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            timestamp: new Date()
        } as ApiResponse);
    }
});

// Enhanced REST API with multi-channel support
app.post('/api/channels/:type/send', async (req: Request, res: Response) => {
    const { type } = req.params;
    const { channelId, content, options } = req.body;
    
    if (!channelId || !content) {
        return res.status(400).json({
            success: false,
            error: 'Missing channelId or content',
            timestamp: new Date()
        } as ApiResponse);
    }

    try {
        await channelManager.sendMessage(type as any, channelId, content, options);
        res.json({
            success: true,
            data: { message: 'Sent successfully' },
            timestamp: new Date()
        } as ApiResponse);
    } catch (error) {
        logger.error('Channel send failed', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send message',
            timestamp: new Date()
        } as ApiResponse);
    }
});

app.get('/api/channels/status', async (req: Request, res: Response) => {
    try {
        const statuses = channelManager.getChannelStatuses();
        const stats = channelManager.getStats();
        
        res.json({
            success: true,
            data: { statuses, stats },
            timestamp: new Date()
        } as ApiResponse);
    } catch (error) {
        logger.error('Channel status fetch failed', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch channel status',
            timestamp: new Date()
        } as ApiResponse);
    }
});

app.get('/api/skills', async (req: Request, res: Response) => {
    try {
        const skills = skillsPlatform.getAvailableSkills();
        const stats = skillsPlatform.getStats();
        
        res.json({
            success: true,
            data: { skills, stats },
            timestamp: new Date()
        } as ApiResponse);
    } catch (error) {
        logger.error('Skills fetch failed', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch skills',
            timestamp: new Date()
        } as ApiResponse);
    }
});

app.post('/api/skills/:skillId/execute', async (req: Request, res: Response) => {
    const { skillId } = req.params;
    const { userId, workspaceId, input } = req.body;
    
    if (!userId || !input) {
        return res.status(400).json({
            success: false,
            error: 'Missing userId or input',
            timestamp: new Date()
        } as ApiResponse);
    }

    try {
        const execution = await skillsPlatform.executeSkill(
            skillId,
            workspaceId || 'default',
            userId,
            input
        );
        
        res.json({
            success: true,
            data: execution,
            timestamp: new Date()
        } as ApiResponse);
    } catch (error) {
        logger.error('Skill execution failed', error);
        res.status(500).json({
            success: false,
            error: 'Failed to execute skill',
            timestamp: new Date()
        } as ApiResponse);
    }
});

// Legacy endpoint for backward compatibility
app.post('/message', async (req: Request, res: Response) => {
    const { userId, text } = req.body;
    if (!userId || !text) return res.status(400).json({ error: 'Missing userId or text' });

    try {
        const reply = await processMessage(userId, text);
        res.json({ reply });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Initialize Adapters

// SaaS Management Routes
app.post('/signup', async (req: Request, res: Response) => {
    const { userId, email, tier } = req.body;
    const user = await db.createUser(userId, email, tier);
    res.json({ success: true, user });
});

app.get('/user/:id', async (req: Request, res: Response) => {
    const user = await db.getUser(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
});

// Enhanced Stats Endpoint with comprehensive metrics
app.get('/api/stats', async (req: Request, res: Response) => {
    try {
        const userId = (req.query.userId as string) || 'demo-user';
        const user = await db.getUser(userId);
        const tools = await mcp.getTools();
        
        const stats: SystemStats = {
            status: 'online',
            uptime: process.uptime(),
            activeSessions: sessions.size,
            mcpTools: tools.length,
            memoryUsage: {
                rss: process.memoryUsage().rss,
                heapUsed: process.memoryUsage().heapUsed,
                heapTotal: process.memoryUsage().heapTotal,
                external: process.memoryUsage().external,
                arrayBuffers: process.memoryUsage().arrayBuffers
            },
            userTier: user?.tier || 'FREE',
            usagePercent: user ? (user.tokensUsed / user.tokenLimit) * 100 : 0,
            errorRate: 0, // TODO: Implement error tracking
            responseTime: 0 // TODO: Implement response time tracking
        };

        res.json({
            success: true,
            data: stats,
            timestamp: new Date()
        } as ApiResponse<SystemStats>);
        
    } catch (error) {
        logger.error('Stats endpoint failed', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch stats',
            timestamp: new Date()
        } as ApiResponse);
    }
});

// Security audit endpoint
app.get('/api/security/audit', async (req: Request, res: Response) => {
    try {
        const audit = await security.audit();
        res.json({
            success: true,
            data: audit,
            timestamp: new Date()
        } as ApiResponse);
    } catch (error) {
        logger.error('Security audit failed', error);
        res.status(500).json({
            success: false,
            error: 'Failed to perform security audit',
            timestamp: new Date()
        } as ApiResponse);
    }
});

// Legacy stats endpoint for backward compatibility
app.get('/stats', async (req: Request, res: Response) => {
    const userId = (req.query.userId as string) || 'demo-user';
    const user = await db.getUser(userId);

    res.json({
        status: 'online',
        uptime: process.uptime(),
        activeSessions: sessions.size,
        mcpTools: (await mcp.getTools()).length,
        memoryUsage: {
            rss: process.memoryUsage().rss,
            heapUsed: process.memoryUsage().heapUsed,
            heapTotal: process.memoryUsage().heapTotal,
            external: process.memoryUsage().external,
            arrayBuffers: process.memoryUsage().arrayBuffers
        },
        userTier: user?.tier || 'FREE',
        usagePercent: user ? (user.tokensUsed / user.tokenLimit) * 100 : 0
    });
});

async function bootstrap() {
    // 1. Run Security Audit
    console.log(' Initiating Startup Security Scan...');
    const audit = await security.audit();
    if (!audit.passed) {
        console.warn('⚠️ SECURITY WARNINGS DETECTED:');
        audit.vulnerabilities.forEach(v => console.warn(`  - ${v}`));
        console.warn('Proceeding with caution... (In production, this would halt startup)');
    } else {
        console.log('✅ Security Audit Passed. System is locked down.');
    }

    // 2. Initialize multi-channel system
    console.log('🌐 Initializing multi-channel system...');
    const channelConfigs = [
        { type: 'whatsapp' as const, enabled: true, config: {} },
        { type: 'telegram' as const, enabled: true, config: {} },
        { type: 'slack' as const, enabled: true, config: {} }
    ];
    
    await channelManager.initializeChannels(channelConfigs);
    console.log('✅ Multi-channel system initialized');

    // 3. Initialize legacy WhatsApp adapter
    await whatsapp.initialize();

    // 4. Wire up legacy messaging
    whatsapp.onMessage(async (from, text) => {
        const reply = await processMessage(from, text);
        await whatsapp.sendMessage(from, reply);
    });

    // 5. Wire up Heartbeat (Proactive AI)
    heartbeat.onPulse(async () => {
        if (Math.random() > 0.7) {
            const userId = '1234567890'; // Demo user
            console.log(`[Heartbeat] 💓 Proactive check triggered for ${userId}`);
            const proactiveMsg = "⚠️ Proactive Alert: I noticed high latency in your primary server cluster. (Simulation)";
            await whatsapp.sendMessage(userId, proactiveMsg);
        }
    });
    heartbeat.start();

    app.listen(port, () => {
        console.log(`🌌 GravityBot Gateway running at http://localhost:${port}`);
        console.log(`📊 Multi-channel stats: ${JSON.stringify(channelManager.getStats())}`);
        console.log(`🛠️ Skills platform stats: ${JSON.stringify(skillsPlatform.getStats())}`);
    });
}

bootstrap();
