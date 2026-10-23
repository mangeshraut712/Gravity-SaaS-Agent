import { describe, expect, it, vi } from 'vitest';
import { WhatsAppAdapter } from '../../../apps/gateway/src/adapters/whatsapp.js';
import { SlackAdapter, TelegramAdapter, WhatsAppAdapter as EnhancedWhatsApp } from '../../../apps/gateway/src/adapters/enhanced-channels.js';
import { ChannelManager } from '../../../apps/gateway/src/services/channel-manager.js';
import type { ChannelAdapter, ChannelMessage, ChannelType } from '@gravity/types';

function fakeAdapter(type: ChannelType, status: ChannelAdapter['getStatus'] extends () => infer S ? S : never = 'connected'): ChannelAdapter & {
    sendMessage: ReturnType<typeof vi.fn>;
    initialize: ReturnType<typeof vi.fn>;
    cleanup: ReturnType<typeof vi.fn>;
    handler?: (message: ChannelMessage) => Promise<void>;
} {
    const adapter = {
        type,
        name: type,
        status,
        handler: undefined as ((message: ChannelMessage) => Promise<void>) | undefined,
        initialize: vi.fn(async () => undefined),
        sendMessage: vi.fn(async () => undefined),
        onMessage(handler: (message: ChannelMessage) => Promise<void>) {
            adapter.handler = handler;
        },
        getStatus() {
            return adapter.status;
        },
        cleanup: vi.fn(async () => undefined),
    };
    return adapter;
}

describe('channel adapters', () => {
    it('simulates the legacy whatsapp adapter', async () => {
        vi.useFakeTimers();
        const whatsapp = new WhatsAppAdapter();
        const received = vi.fn();
        whatsapp.onMessage(received);
        const ready = whatsapp.initialize();
        await vi.advanceTimersByTimeAsync(1000);
        await ready;
        whatsapp.simulateIncomingMessage('15550001', 'hello');
        expect(received).toHaveBeenCalledWith('15550001', 'hello');
        await whatsapp.sendMessage('15550001', 'pong');
        whatsapp.simulateIncomingMessage('15550001', 'again');
    });

    it('connects the enhanced adapters and delivers inbound messages', async () => {
        vi.useFakeTimers();
        const whatsapp = new EnhancedWhatsApp();
        const telegram = new TelegramAdapter();
        const slack = new SlackAdapter();
        const received: ChannelMessage[] = [];

        for (const adapter of [whatsapp, telegram, slack]) {
            expect(adapter.getStatus()).toBe('disconnected');
            adapter.onMessage(async (message) => {
                received.push(message);
            });
            await expect(adapter.sendMessage('channel', 'early')).rejects.toThrow(/not connected/);
        }

        const pending = Promise.all([
            whatsapp.initialize({ token: 'wa' }),
            telegram.initialize(),
            slack.initialize({ botToken: 'xoxb' }),
        ]);
        await vi.advanceTimersByTimeAsync(1200);
        await pending;
        expect(whatsapp.getStatus()).toBe('connected');

        const deliveries = Promise.all([
            whatsapp.sendMessage('1555', 'hi'),
            telegram.sendMessage('tg', 'hi', { parseMode: 'markdown' }),
            telegram.sendMessage('tg', 'plain'),
            slack.sendMessage('general', 'hi', { blocks: [{ type: 'section' }] }),
            slack.sendMessage('general', 'plain'),
        ]);
        await vi.advanceTimersByTimeAsync(500);
        await deliveries;

        await vi.advanceTimersByTimeAsync(8000);
        expect(received.map((message) => message.metadata?.isGroup)).toEqual(
            expect.arrayContaining([false, true]),
        );
        expect(received.some((message) => message.metadata?.mentions?.length)).toBe(true);

        await whatsapp.cleanup();
        await telegram.cleanup();
        await slack.cleanup();
        expect(slack.getStatus()).toBe('disconnected');
        whatsapp['simulateIncomingMessage']('1555', 'after cleanup');
        expect(received.some((message) => message.content === 'after cleanup')).toBe(false);
    });
});

describe('ChannelManager', () => {
    it('initializes, sends, broadcasts, and cleans up adapters', async () => {
        const manager = new ChannelManager();
        const telegram = fakeAdapter('telegram');
        const slack = fakeAdapter('slack', 'disconnected');
        const broken = fakeAdapter('discord');
        broken.initialize.mockRejectedValue(new Error('no token'));

        manager.registerAdapter(telegram);
        manager.registerAdapter(slack);
        manager.registerAdapter(broken);

        await manager.initializeChannels([
            { type: 'telegram', enabled: true, config: {} },
            { type: 'slack', enabled: false, config: {} },
            { type: 'discord', enabled: true, config: {} },
            { type: 'email', enabled: true, config: {} },
        ]);

        expect(manager.getConfiguredStatuses()).toEqual([
            { type: 'telegram', status: 'connected' },
            { type: 'discord', status: 'error' },
        ]);
        expect(manager.getStats()).toMatchObject({ totalChannels: 3, connectedChannels: 2 });
        expect(manager.getChannelStatuses().telegram).toBe('connected');

        await manager.sendMessage('telegram', 'chat-1', 'hello', { parseMode: 'markdown' });
        expect(telegram.sendMessage).toHaveBeenCalledWith('chat-1', 'hello', { parseMode: 'markdown' });
        await expect(manager.sendMessage('signal', 'chat-1', 'hello')).rejects.toThrow(/No adapter/);
        slack.status = 'disconnected';
        await expect(manager.sendMessage('slack', 'chat-1', 'hello')).rejects.toThrow(/not connected/);

        const handled = vi.fn(async () => undefined);
        const failing = vi.fn(async () => {
            throw new Error('handler failed');
        });
        manager.onMessage(handled);
        manager.onMessage(failing);
        await telegram.handler?.({
            id: 'm1',
            channelId: 'chat-1',
            userId: 'u1',
            content: 'x'.repeat(120),
            timestamp: new Date(),
            metadata: { isGroup: true },
        });
        expect(handled).toHaveBeenCalledOnce();
        expect(failing).toHaveBeenCalledOnce();

        await manager.broadcastMessage('maintenance', 'telegram');
        await manager.cleanup();
        expect(telegram.cleanup).toHaveBeenCalled();
        expect(manager.getStats().totalChannels).toBe(0);
    });
});
