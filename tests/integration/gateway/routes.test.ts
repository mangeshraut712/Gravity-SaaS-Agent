import type { AddressInfo } from 'node:net';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createGatewayApp, startSessionCleanup } from '../../../apps/gateway/src/app.js';
import { startServer } from '../../../apps/gateway/src/index.js';
import { healthCheckService } from '../../../apps/gateway/src/services/health-check.js';
import { ChannelManager } from '../../../apps/gateway/src/services/channel-manager.js';
import { GravityDB } from '@gravity/db';
import { GravityMCPClient } from '@gravity/mcp-client';
import type { ChannelAdapter, ChannelType, Session } from '@gravity/types';
import { withServer } from '../../helpers/http.js';

function memoryCache() {
    const store = new Map<string, unknown>();
    return {
        async get<T>(key: string): Promise<T | null> {
            return (store.has(key) ? store.get(key) : null) as T | null;
        },
        async set<T>(key: string, value: T): Promise<void> {
            store.set(key, value);
        },
    };
}

function adapter(type: ChannelType, status: 'connected' | 'disconnected' | 'error' = 'connected'): ChannelAdapter & {
    sendMessage: ReturnType<typeof vi.fn>;
} {
    return {
        type,
        name: type,
        initialize: vi.fn(async () => undefined),
        sendMessage: vi.fn(async () => undefined),
        onMessage: vi.fn(),
        getStatus: () => status,
        cleanup: vi.fn(async () => undefined),
    };
}

describe('gateway routes', () => {
    const running: Array<{ close: () => Promise<void> }> = [];

    afterEach(async () => {
        for (const server of running.splice(0)) await server.close();
    });

    function buildApp(options?: { provider?: boolean; health?: 'healthy' | 'degraded' | 'unhealthy' }) {
        const calls: unknown[] = [];
        const channelManager = new ChannelManager();
        const telegram = adapter('telegram');
        channelManager.registerAdapter(telegram);
        const db = new GravityDB();
        const mcp = new GravityMCPClient();
        const sessions = new Map<string, Session>();
        const modelProvider = {
            getAvailableProviders: () => (options?.provider === false ? [] : ['openrouter']),
            getProvider: (name?: string) => {
                if (options?.provider === false || name === 'missing') return undefined;
                return {
                    async listModels() {
                        if (options?.health === 'unhealthy') throw new Error('models down');
                        return ['openrouter/anthropic/claude-3.5-sonnet'];
                    },
                };
            },
            async chatCompletion(request: unknown) {
                calls.push(request);
                if (options?.health === 'degraded') throw new Error('upstream down');
                return {
                    content: 'A helpful reply',
                    model: 'openrouter/anthropic/claude-3.5-sonnet',
                    usage: { promptTokens: 2, completionTokens: 3, totalTokens: 5 },
                };
            },
            async getProviderStats() {
                return { openrouter: { totalRequests: calls.length } };
            },
        };

        const runtime = createGatewayApp({
            db,
            mcp,
            sessions,
            channelManager,
            cacheManager: memoryCache(),
            modelProvider,
            healthCheck: {
                async getHealthStatus() {
                    return { status: options?.health ?? 'healthy', checks: {} };
                },
            },
        });

        return { ...runtime, calls, telegram };
    }

    it('serves health, stats, skills, chat, models, and docs', async () => {
        const runtime = buildApp();
        await runtime.channelManager.initializeChannels([{ type: 'telegram', enabled: true, config: {} }]);

        await withServer(runtime.app, async (baseUrl) => {
            const health = await fetch(`${baseUrl}/health`);
            expect(health.status).toBe(200);
            expect(await health.json()).toMatchObject({ status: 'healthy' });

            const stats = await fetch(`${baseUrl}/stats`);
            expect(stats.status).toBe(200);
            const firstStats = await stats.json();
            expect(firstStats.data.userTier).toBe('PRO');
            expect(firstStats.cached).toBeUndefined();
            const cached = await fetch(`${baseUrl}/stats`);
            expect(await cached.json()).toMatchObject({ cached: true, data: { userTier: 'PRO' } });

            const skills = await fetch(`${baseUrl}/api/v1/skills`);
            expect((await skills.json()).data.map((skill: { id: string }) => skill.id)).toContain('web-search');

            const executed = await fetch(`${baseUrl}/api/v1/skills/web_search/execute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: 'gravity' }),
            });
            expect(await executed.json()).toMatchObject({ success: true, data: { success: true } });

            const channels = await fetch(`${baseUrl}/api/v1/channels`);
            expect(await channels.json()).toMatchObject({
                data: [{ type: 'telegram', status: 'connected' }],
            });

            const sent = await fetch(`${baseUrl}/api/v1/channels/telegram/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ channelId: 'chat-1', message: 'hi' }),
            });
            expect(sent.status).toBe(200);
            expect(runtime.telegram.sendMessage).toHaveBeenCalledWith('chat-1', 'hi', undefined);

            const chat = await fetch(`${baseUrl}/api/v1/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Hello', userId: 'demo-user', conversationId: 'c1' }),
            });
            expect(await chat.json()).toMatchObject({
                data: { response: 'A helpful reply', conversationId: 'c1', usage: { totalTokens: 5 } },
            });
            const followUp = await fetch(`${baseUrl}/api/v1/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Again', userId: 'demo-user' }),
            });
            expect((await followUp.json()).data.conversationId).toBe('demo-user');
            expect(runtime.calls).toHaveLength(2);

            const models = await fetch(`${baseUrl}/api/v1/models`);
            expect(await models.json()).toMatchObject({ success: true, data: { provider: 'openrouter' } });

            const providers = await fetch(`${baseUrl}/api/v1/providers/status`);
            expect(await providers.json()).toMatchObject({ data: { configured: true } });

            const breakers = await fetch(`${baseUrl}/api/v1/circuit-breakers`);
            expect((await breakers.json()).data.count).toBeGreaterThan(0);

            const limits = await fetch(`${baseUrl}/api/v1/rate-limit`);
            expect((await limits.json()).data.totalBuckets).toEqual(expect.any(Number));

            const docs = await fetch(`${baseUrl}/api/v1/docs`);
            expect(await docs.json()).toMatchObject({ openapi: '3.0.3' });

            const missing = await fetch(`${baseUrl}/nope`);
            expect(missing.status).toBe(404);

            const badJson = await fetch(`${baseUrl}/api/v1/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: '{',
            });
            expect(badJson.status).toBe(400);
        });
    });

    it('reports degraded health, model failures, and the echo fallback', async () => {
        const degraded = buildApp({ health: 'degraded' });
        await withServer(degraded.app, async (baseUrl) => {
            expect((await fetch(`${baseUrl}/health`)).status).toBe(200);
            const chat = await fetch(`${baseUrl}/api/v1/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Hello' }),
            });
            expect((await chat.json()).data.response).toContain('upstream down');

            const models = await fetch(`${baseUrl}/api/v1/models`);
            expect(models.status).toBe(200);
        });

        const down = buildApp({ health: 'unhealthy' });
        await withServer(down.app, async (baseUrl) => {
            expect((await fetch(`${baseUrl}/health`)).status).toBe(503);
            const models = await fetch(`${baseUrl}/api/v1/models`);
            expect(await models.json()).toMatchObject({ success: false, error: 'Failed to fetch models' });
        });

        const unconfigured = buildApp({ provider: false });
        await withServer(unconfigured.app, async (baseUrl) => {
            const chat = await fetch(`${baseUrl}/api/v1/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Hello' }),
            });
            expect((await chat.json()).data.response).toContain('Echo: Hello');
            const models = await fetch(`${baseUrl}/api/v1/models`);
            expect(await models.json()).toMatchObject({ success: false, error: 'OpenRouter provider not configured' });
            const providers = await fetch(`${baseUrl}/api/v1/providers/status`);
            expect((await providers.json()).data.configured).toBe(false);
        });

        const missingUser = buildApp();
        await withServer(missingUser.app, async (baseUrl) => {
            const unknownUser = await fetch(`${baseUrl}/stats?userId=missing`);
            expect((await unknownUser.json()).data.userTier).toBe('FREE');
        });

        const broken = buildApp();
        await withServer(broken.app, async (baseUrl) => {
            const missingTool = await fetch(`${baseUrl}/api/v1/skills/not-a-tool/execute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
            });
            expect(missingTool.status).toBe(500);
            const missingChannel = await fetch(`${baseUrl}/api/v1/channels/signal/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ channelId: 'c', message: 'hi' }),
            });
            expect(missingChannel.status).toBe(500);
        });
    });

    it('sends the agent system prompt with each completion without storing it in history', async () => {
        const runtime = buildApp();
        await withServer(runtime.app, async (baseUrl) => {
            const post = (body: Record<string, unknown>) => fetch(`${baseUrl}/api/v1/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            await post({ message: 'Hello', userId: 'owner-1', systemPrompt: 'You are a calm support agent.' });
            await post({ message: 'Again', userId: 'owner-1', systemPrompt: '   ' });

            const first = runtime.calls[0] as { messages: Array<{ role: string; content: string }> };
            expect(first.messages[0]).toMatchObject({ role: 'system', content: 'You are a calm support agent.' });
            expect(first.messages[1]).toMatchObject({ role: 'user', content: 'Hello' });

            const second = runtime.calls[1] as { messages: Array<{ role: string }> };
            // Without a prompt the completion gets the live session array, so it already
            // includes the reply appended after the call.
            expect(second.messages.map((m) => m.role)).toEqual(['user', 'assistant', 'user', 'assistant']);
            // Since per-conversation histories, the key is a JSON [userId, conversationId]
            // tuple; with no conversationId sent it falls back to the userId.
            const key = JSON.stringify(['owner-1', 'owner-1']);
            expect(runtime.sessions.get(key)?.messages.some((m) => m.role === 'system')).toBe(false);
        });
    });

    it('keeps a separate history per conversation for the same owner', async () => {
        const runtime = buildApp();
        await withServer(runtime.app, async (baseUrl) => {
            const post = (body: Record<string, unknown>) => fetch(`${baseUrl}/api/v1/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            await post({ message: 'I am visitor A', userId: 'owner-1', conversationId: 'agent-1:visitor-a' });
            await post({ message: 'I am visitor B', userId: 'owner-1', conversationId: 'agent-1:visitor-b' });
            await post({ message: 'A again', userId: 'owner-1', conversationId: 'agent-1:visitor-a' });

            const contents = (i: number) =>
                (runtime.calls[i] as { messages: Array<{ content: string }> }).messages.map((m) => m.content);
            // Each recorded request holds its live session array (replies included).
            expect(contents(1)).toEqual(['I am visitor B', 'A helpful reply']);
            expect(contents(2)).toEqual(['I am visitor A', 'A helpful reply', 'A again', 'A helpful reply']);
            expect(runtime.sessions.size).toBe(2);
        });
    });

    it('continues an ID-less conversation when the returned conversationId is sent back', async () => {
        const runtime = buildApp();
        await withServer(runtime.app, async (baseUrl) => {
            const post = (body: Record<string, unknown>) => fetch(`${baseUrl}/api/v1/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const first = await (await post({ message: 'first', userId: 'u1' })).json();
            expect(first.data.conversationId).toBe('u1');
            await post({ message: 'second', userId: 'u1', conversationId: first.data.conversationId });
            const contents = (runtime.calls[1] as { messages: Array<{ content: string }> }).messages.map((m) => m.content);
            expect(contents).toEqual(['first', 'A helpful reply', 'second', 'A helpful reply']);
            expect(runtime.sessions.size).toBe(1);
        });
    });

    it('does not let colon-joined user and conversation IDs collide', async () => {
        const runtime = buildApp();
        await withServer(runtime.app, async (baseUrl) => {
            const post = (body: Record<string, unknown>) => fetch(`${baseUrl}/api/v1/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            await post({ message: 'from a:b', userId: 'a:b', conversationId: 'c' });
            await post({ message: 'from a', userId: 'a', conversationId: 'b:c' });
            const contents = (runtime.calls[1] as { messages: Array<{ content: string }> }).messages.map((m) => m.content);
            expect(contents).toEqual(['from a', 'A helpful reply']);
            expect(runtime.sessions.size).toBe(2);
        });
    });

    it('expires idle sessions', async () => {
        vi.useFakeTimers();
        const sessions = new Map<string, Session>();
        sessions.set('old', {
            userId: 'old',
            messages: [],
            createdAt: new Date(),
            lastActive: new Date(Date.now() - 10_000),
        });
        sessions.set('new', {
            userId: 'new',
            messages: [],
            createdAt: new Date(),
            lastActive: new Date(),
        });
        const stop = startSessionCleanup(sessions, 1000, 5000);
        await vi.advanceTimersByTimeAsync(1000);
        expect(sessions.has('old')).toBe(false);
        expect(sessions.has('new')).toBe(true);
        stop();
    });

    it('boots the listening server and shuts the handle down', async () => {
        const previousPort = process.env.PORT;
        const previousKey = process.env.OPENROUTER_API_KEY;
        process.env.PORT = '0';
        delete process.env.OPENROUTER_API_KEY;
        const runningServer = await startServer();
        running.push({
            close: async () => {
                runningServer.detachSignals();
                runningServer.stopSessionCleanup();
                runningServer.wsManager.shutdown();
                healthCheckService.unregister('memory');
                healthCheckService.unregister('disk');
                healthCheckService.unregister('openrouter');
                if (runningServer.server.listening) {
                    await new Promise<void>((resolve) => runningServer.server.close(() => resolve()));
                }
            },
        });

        const port = (runningServer.server.address() as AddressInfo).port;
        const response = await fetch(`http://127.0.0.1:${port}/health`);
        expect(response.status).toBe(200);

        if (previousPort === undefined) delete process.env.PORT;
        else process.env.PORT = previousPort;
        if (previousKey === undefined) delete process.env.OPENROUTER_API_KEY;
        else process.env.OPENROUTER_API_KEY = previousKey;
    });
});
