import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WebSocket } from 'ws';
import { WebSocketManager } from '../../../apps/gateway/src/services/websocket.js';

async function listen(server: Server): Promise<number> {
    await new Promise<void>((resolve) => server.listen(0, resolve));
    return (server.address() as AddressInfo).port;
}

describe('WebSocketManager', () => {
    const cleanups: Array<() => Promise<void> | void> = [];
    const previousOrigin = process.env.WS_ALLOWED_ORIGINS;

    afterEach(async () => {
        for (const cleanup of cleanups.splice(0)) await cleanup();
        if (previousOrigin === undefined) delete process.env.WS_ALLOWED_ORIGINS;
        else process.env.WS_ALLOWED_ORIGINS = previousOrigin;
    });

    it('rejects origins and clients past the connection cap', async () => {
        const server = createServer();
        const manager = new WebSocketManager(server, { maxClients: 1 });
        const port = await listen(server);
        cleanups.push(async () => {
            manager.shutdown();
            if (server.listening) {
                await new Promise<void>((resolve) => server.close(() => resolve()));
            }
        });

        const rejected = new WebSocket(`ws://127.0.0.1:${port}/ws`, {
            headers: { origin: 'https://evil.example' },
        });
        await new Promise<void>((resolve) => {
            rejected.once('unexpected-response', () => resolve());
            rejected.once('error', () => resolve());
        });

        process.env.WS_ALLOWED_ORIGINS = '*';
        const first = new WebSocket(`ws://127.0.0.1:${port}/ws`, {
            headers: { origin: 'https://app.example' },
        });
        await new Promise<void>((resolve, reject) => {
            first.once('open', () => resolve());
            first.once('error', reject);
        });

        const second = new WebSocket(`ws://127.0.0.1:${port}/ws`, {
            headers: { origin: 'https://app.example' },
        });
        await new Promise<void>((resolve) => {
            second.once('unexpected-response', () => resolve());
            second.once('error', () => resolve());
        });
        first.close();
    });

    it('subscribes, broadcasts, and authenticates clients', async () => {
        process.env.WS_ALLOWED_ORIGINS = 'http://localhost:3000';
        const server = createServer();
        const manager = new WebSocketManager(server, { maxClients: 5 });
        const port = await listen(server);
        const messages: Array<Record<string, unknown>> = [];
        const ws = new WebSocket(`ws://127.0.0.1:${port}/ws`, {
            headers: { origin: 'http://localhost:3000' },
        });
        ws.on('message', (data) => messages.push(JSON.parse(data.toString())));
        cleanups.push(async () => {
            manager.shutdown();
            if (server.listening) await new Promise<void>((resolve) => server.close(() => resolve()));
        });

        await vi.waitFor(() => {
            if (!messages.some((message) => (message.data as { clientId?: string })?.clientId)) {
                throw new Error('waiting for welcome');
            }
        });
        const clientId = (messages[0].data as { clientId: string }).clientId;

        ws.send('not-json');
        ws.send(JSON.stringify({ type: 'subscribe', timestamp: new Date() }));
        ws.send(JSON.stringify({ type: 'ping', timestamp: new Date() }));
        ws.send(JSON.stringify({ type: 'subscribe', channel: 'admin', timestamp: new Date() }));
        ws.send(JSON.stringify({ type: 'subscribe', channel: 'general', timestamp: new Date() }));
        await vi.waitFor(() => {
            if (!messages.some((message) => (message.data as { subscribed?: string })?.subscribed === 'general')) {
                throw new Error('waiting for subscription');
            }
        });

        manager.broadcast('general', { hello: 'world' });
        await vi.waitFor(() => {
            if (!messages.some((message) => (message.data as { hello?: string })?.hello === 'world')) {
                throw new Error('waiting for broadcast');
            }
        });

        manager.authenticateClient(clientId, 'user-1', 'ENTERPRISE');
        manager.authenticateClient('missing', 'nobody', 'FREE');
        ws.send(JSON.stringify({ type: 'subscribe', channel: 'admin', timestamp: new Date() }));
        await vi.waitFor(() => {
            if (!messages.some((message) => (message.data as { subscribed?: string })?.subscribed === 'admin')) {
                throw new Error('waiting for admin subscription');
            }
        });

        manager.sendToUser('user-1', { direct: true });
        manager.sendToUser('offline-user', { queued: true });
        await vi.waitFor(() => {
            if (!messages.some((message) => (message.data as { direct?: boolean })?.direct)) {
                throw new Error('waiting for direct message');
            }
        });

        ws.send(JSON.stringify({ type: 'unsubscribe', timestamp: new Date() }));
        ws.send(JSON.stringify({ type: 'unsubscribe', channel: 'general', timestamp: new Date() }));
        ws.send(JSON.stringify({ type: 'data', timestamp: new Date() }));
        await vi.waitFor(() => {
            if (!messages.some((message) => (message.data as { unsubscribed?: string })?.unsubscribed === 'general')) {
                throw new Error('waiting for unsubscribe');
            }
        });

        const stats = manager.getStats();
        expect(stats.totalClients).toBe(1);
        expect(stats.clientsByTier.ENTERPRISE).toBe(1);
        expect(stats.channelStats.admin).toBe(1);

        const limited = new WebSocket(`ws://127.0.0.1:${port}/ws`, {
            headers: { origin: 'http://localhost:3000' },
        });
        const limitedMessages: Array<Record<string, unknown>> = [];
        limited.on('message', (data) => limitedMessages.push(JSON.parse(data.toString())));
        await vi.waitFor(() => {
            if (limitedMessages.length === 0) throw new Error('waiting for second client');
        });
        const freeId = (limitedMessages[0].data as { clientId: string }).clientId;
        manager.authenticateClient(freeId, 'free-user', 'FREE');
        for (const channel of ['one', 'two', 'three', 'four']) {
            limited.send(JSON.stringify({ type: 'subscribe', channel, timestamp: new Date() }));
        }
        await vi.waitFor(() => {
            const subscribed = limitedMessages.filter((message) => (message.data as { subscribed?: string })?.subscribed).length;
            const denied = limitedMessages.some((message) => (message.data as { error?: string })?.error === 'Insufficient permissions for channel');
            if (subscribed < 3 || !denied) throw new Error('waiting for free tier limit');
        });

        ws.close();
        await vi.waitFor(() => {
            if (manager.getStats().totalClients !== 1) throw new Error('waiting for disconnect');
        });
    });
});
