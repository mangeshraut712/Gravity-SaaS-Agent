import { ChannelAdapter, ChannelMessage, ChannelType } from '@gravity/types';

/**
 * Shared lifecycle for the simulated channel adapters.
 * Each adapter keeps its own connect, send, and inbound message shape.
 */
export abstract class SimulatedChannelAdapter implements ChannelAdapter {
  abstract type: ChannelType;
  abstract name: string;
  abstract initialize(): Promise<void>;
  abstract sendMessage(channelId: string, content: string, options?: unknown): Promise<void>;

  protected messageHandler: ((message: ChannelMessage) => Promise<void>) | null = null;
  protected status: 'connected' | 'disconnected' | 'error' = 'disconnected';
  protected config: Record<string, unknown> | null = null;

  onMessage(handler: (message: ChannelMessage) => Promise<void>): void {
    this.messageHandler = handler;
  }

  getStatus(): 'connected' | 'disconnected' | 'error' {
    return this.status;
  }

  async cleanup(): Promise<void> {
    console.log(this.cleanupLog());
    this.status = 'disconnected';
    this.messageHandler = null;
  }

  protected abstract cleanupLog(): string;

  protected async pause(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  protected assertConnected(): void {
    if (this.status !== 'connected') {
      throw new Error(`${this.name} adapter not connected`);
    }
  }

  protected emit(message: ChannelMessage, logLine: string): void {
    if (!this.messageHandler) return;
    console.log(logLine);
    void this.messageHandler(message);
  }
}

/**
 * Enhanced WhatsApp Adapter with multi-channel support
 */
export class WhatsAppAdapter extends SimulatedChannelAdapter {
  type: ChannelType = 'whatsapp';
  name = 'WhatsApp';

  protected cleanupLog(): string {
    return '[WhatsApp] Cleaning up connection...';
  }

  async initialize(config?: any): Promise<void> {
    this.config = config || {};
    console.log('[WhatsApp] Initializing enhanced connection...');

    try {
      await this.pause(1000);

      this.status = 'connected';
      console.log('[WhatsApp] ✅ Enhanced connection established');

      setTimeout(() => {
        this.simulateIncomingMessage('1234567890', 'Hello GravityBot! Can you help me with automation?');
      }, 5000);

      setTimeout(() => {
        this.simulateGroupMessage('whatsapp-group-123', '9876543210', '@GravityBot summarize our project progress');
      }, 8000);

    } catch (error) {
      this.status = 'error';
      console.error('[WhatsApp] ❌ Connection failed:', error);
      throw error;
    }
  }

  async sendMessage(channelId: string, content: string, _options?: any): Promise<void> {
    this.assertConnected();

    console.log(`[WhatsApp] 📤 Sending to ${channelId}: "${content}"`);
    await this.pause(500);
  }

  private simulateIncomingMessage(from: string, text: string): void {
    const message: ChannelMessage = {
      id: `msg-${Date.now()}`,
      channelId: from,
      userId: from,
      content: text,
      timestamp: new Date(),
      metadata: {
        isGroup: false
      }
    };

    this.emit(message, `[WhatsApp] 📥 Received from ${from}: "${text}"`);
  }

  private simulateGroupMessage(groupId: string, from: string, text: string): void {
    const message: ChannelMessage = {
      id: `msg-${Date.now()}`,
      channelId: groupId,
      userId: from,
      content: text,
      timestamp: new Date(),
      metadata: {
        isGroup: true,
        groupId,
        mentions: text.includes('@GravityBot') ? ['GravityBot'] : []
      }
    };

    this.emit(message, `[WhatsApp] 📥 Group message from ${from} in ${groupId}: "${text}"`);
  }
}

/**
 * Telegram Adapter Implementation
 */
export class TelegramAdapter extends SimulatedChannelAdapter {
  type: ChannelType = 'telegram';
  name = 'Telegram';

  protected cleanupLog(): string {
    return '[Telegram] Cleaning up bot connection...';
  }

  async initialize(config?: any): Promise<void> {
    this.config = config || { botToken: 'simulated-token' };
    console.log('[Telegram] Initializing bot connection...');

    try {
      await this.pause(800);
      this.status = 'connected';
      console.log('[Telegram] ✅ Bot connection established');

      setTimeout(() => {
        this.simulateIncomingMessage('telegram-user-123', '/start - Show me what you can do');
      }, 6000);

    } catch (error) {
      this.status = 'error';
      console.error('[Telegram] ❌ Bot connection failed:', error);
      throw error;
    }
  }

  async sendMessage(channelId: string, content: string, options?: any): Promise<void> {
    this.assertConnected();

    console.log(`[Telegram] 📤 Sending to ${channelId}: "${content}"`);

    const formattedContent = options?.parseMode === 'markdown'
      ? `*GravityBot*: ${content}`
      : content;
    void formattedContent;

    await this.pause(300);
  }

  private simulateIncomingMessage(from: string, text: string): void {
    const message: ChannelMessage = {
      id: `tg-msg-${Date.now()}`,
      channelId: from,
      userId: from,
      content: text,
      timestamp: new Date(),
      metadata: {
        isGroup: false
      }
    };

    this.emit(message, `[Telegram] 📥 Received from ${from}: "${text}"`);
  }
}

/**
 * Slack Adapter Implementation
 */
export class SlackAdapter extends SimulatedChannelAdapter {
  type: ChannelType = 'slack';
  name = 'Slack';

  protected cleanupLog(): string {
    return '[Slack] Cleaning up workspace connection...';
  }

  async initialize(config?: any): Promise<void> {
    this.config = config || { botToken: 'xoxb-simulated-token' };
    console.log('[Slack] Initializing workspace connection...');

    try {
      await this.pause(1200);
      this.status = 'connected';
      console.log('[Slack] ✅ Workspace connection established');

      setTimeout(() => {
        this.simulateIncomingMessage('slack-channel-general', 'U123456789', '<@U987654321> help me set up automation');
      }, 7000);

    } catch (error) {
      this.status = 'error';
      console.error('[Slack] ❌ Workspace connection failed:', error);
      throw error;
    }
  }

  async sendMessage(channelId: string, content: string, options?: any): Promise<void> {
    this.assertConnected();

    console.log(`[Slack] 📤 Sending to ${channelId}: "${content}"`);

    const slackMessage = options?.blocks
      ? JSON.stringify(options.blocks)
      : content;
    void slackMessage;

    await this.pause(400);
  }

  private simulateIncomingMessage(channelId: string, userId: string, text: string): void {
    const message: ChannelMessage = {
      id: `slack-msg-${Date.now()}`,
      channelId,
      userId,
      content: text,
      timestamp: new Date(),
      metadata: {
        isGroup: true,
        groupId: channelId,
        mentions: text.includes('<@U987654321>') ? ['U987654321'] : []
      }
    };

    this.emit(message, `[Slack] 📥 Received from ${userId} in ${channelId}: "${text}"`);
  }
}
