import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GravityMemory } from '@gravity/memory';
import { GravityMCPClient } from '@gravity/mcp-client';
import { WhatsAppAdapter } from './adapters/whatsapp.js';
import { HeartbeatService } from './services/heartbeat.js';
import { SecurityService } from './services/security.js';
import { GravityDB } from '@gravity/db';
import { SubscriptionService } from './services/billing/subscription.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Initialize CORS before routes
import cors from 'cors';
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const apiKey = process.env.ANTHROPIC_API_KEY || '';
const memory = new GravityMemory(apiKey);
const mcp = new GravityMCPClient();
const whatsapp = new WhatsAppAdapter();
const heartbeat = new HeartbeatService(30000); // Check every 30s for demo
const security = new SecurityService();

const db = new GravityDB();
const subscription = new SubscriptionService(db);

// In-memory session store (In production, use Redis via BullMQ)
const sessions = new Map<string, any[]>();

// Core Logic Handler
async function processMessage(userId: string, text: string) {
    // 1. Validate SaaS Access
    const access = await subscription.validateAccess(userId);
    if (!access.allowed) {
        return `🚫 Access Denied: ${access.reason}. Upgrade at gravitybot.ai/pricing`;
    }

    const history = sessions.get(userId) || [];

    // 2. Manage Usage
    // Estimate tokens (simulated)
    const tokens = Math.floor(text.length / 4) + 500;
    await db.incrementUsage(userId, tokens);

    // 1. Get cost-optimized context
    const { system, messages } = await memory.getEffectiveContext(
        [...history, { role: 'user', content: text }],
        "You are GravityBot, a personal AI assistant built for the future."
    );

    // 2. Fetch MCP tools
    const tools = await mcp.getTools();

    // 3. Logic to call Claude/Tools
    let reply = '';

    // Simple heuristic for demonstration: "search" triggers web_search
    if (text.toLowerCase().includes('search')) {
        const query = text.replace('search', '').trim();
        const toolResult = await mcp.callTool('web_search', { query });
        reply = `🔍 I searched for "${query}".\n${toolResult.result}`;
    } else {
        reply = `Processed: "${text}". Memory optimized. ${tools.length} Tools active.`;
    }

    // 4. Update session
    const updatedHistory = [...messages, { role: 'assistant', content: reply }];
    sessions.set(userId, updatedHistory);

    return reply;
}

// REST API
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

// Stats Endpoint for Dashboard
app.get('/stats', async (req: Request, res: Response) => {
    const userId = (req.query.userId as string) || 'demo-user';
    const user = await db.getUser(userId);

    res.json({
        status: 'online',
        uptime: process.uptime(),
        activeSessions: sessions.size,
        mcpTools: (await mcp.getTools()).length,
        memoryUsage: process.memoryUsage(),
        userTier: user?.tier || 'FREE',
        usagePercent: user ? (user.tokensUsed / user.tokenLimit) * 100 : 0
    });
});

async function bootstrap() {
    // 1. Run Security Audit
    console.log('🔒 Initiating Startup Security Scan...');
    const audit = await security.audit();
    if (!audit.passed) {
        console.warn('⚠️ SECURITY WARNINGS DETECTED:');
        audit.vulnerability.forEach(v => console.warn(`  - ${v}`));
        console.warn('Proceeding with caution... (In production, this would halt startup)');
    } else {
        console.log('✅ Security Audit Passed. System is locked down.');
    }

    await whatsapp.initialize();

    // Wire up Messaging
    whatsapp.onMessage(async (from, text) => {
        const reply = await processMessage(from, text);
        await whatsapp.sendMessage(from, reply);
    });

    // Wire up Heartbeat (Proactive AI)
    heartbeat.onPulse(async () => {
        // In a real app, this would check calendar, trading APIs, or email
        // For demo, we randomly decide to "find" something important
        if (Math.random() > 0.7) {
            const userId = '1234567890'; // Demo user
            console.log(`[Heartbeat] 💓 Proactive check triggered for ${userId}`);

            // Allow the bot to "think" about what to say based on recent context
            // const proactiveMsg = await processMessage(userId, "System: Check for urgent updates.");
            const proactiveMsg = "⚠️ Proactive Alert: I noticed high latency in your primary server cluster. (Simulation)";

            await whatsapp.sendMessage(userId, proactiveMsg);
        }
    });
    heartbeat.start();

    app.listen(port, () => {
        console.log(`🌌 GravityBot Gateway running at http://localhost:${port}`);
    });
}

bootstrap();
