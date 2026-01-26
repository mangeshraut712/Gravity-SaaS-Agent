import express from 'express';
import dotenv from 'dotenv';
import { GravityMemory } from '@gravity/memory';
import { GravityMCPClient } from '@gravity/mcp-client';
import { WhatsAppAdapter } from './adapters/whatsapp.js';
import { HeartbeatService } from './services/heartbeat.js';
import { SecurityService } from './services/security.js';
dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
app.use(express.json());
const apiKey = process.env.ANTHROPIC_API_KEY || '';
const memory = new GravityMemory(apiKey);
const mcp = new GravityMCPClient();
const whatsapp = new WhatsAppAdapter();
const heartbeat = new HeartbeatService(30000); // Check every 30s for demo
const security = new SecurityService();
// In-memory session store (In production, use Redis via BullMQ)
const sessions = new Map();
// Core Logic Handler
async function processMessage(userId, text) {
    const history = sessions.get(userId) || [];
    // 1. Get cost-optimized context
    const { system, messages } = await memory.getEffectiveContext([...history, { role: 'user', content: text }], "You are GravityBot, a personal AI assistant built for the future.");
    // 2. Fetch MCP tools
    const tools = await mcp.getTools();
    // 3. Logic to call Claude would go here
    const reply = `Processed: "${text}". Memory optimized. ${tools.length} Tools active.`;
    // 4. Update session
    const updatedHistory = [...messages, { role: 'assistant', content: reply }];
    sessions.set(userId, updatedHistory);
    return reply;
}
// REST API
app.post('/message', async (req, res) => {
    const { userId, text } = req.body;
    if (!userId || !text)
        return res.status(400).json({ error: 'Missing userId or text' });
    try {
        const reply = await processMessage(userId, text);
        res.json({ reply });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Initialize Adapters
import cors from 'cors';
app.use(cors()); // Allow Dashboard to connect
// Stats Endpoint for Dashboard
app.get('/stats', async (req, res) => {
    res.json({
        status: 'online',
        uptime: process.uptime(),
        activeSessions: sessions.size,
        mcpTools: (await mcp.getTools()).length,
        memoryUsage: process.memoryUsage()
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
    }
    else {
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
