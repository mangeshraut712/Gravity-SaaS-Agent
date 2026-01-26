import { ChannelAdapter, ChannelMessage, ChannelType } from '@gravity/types';

/**
 * Multi-Channel Manager - Clawdbot-inspired unified channel system
 */
export class ChannelManager {
  private adapters: Map<ChannelType, ChannelAdapter> = new Map();
  private messageHandlers: Array<(message: ChannelMessage) => Promise<void>> = [];
  private channelStatuses: Map<string, 'connected' | 'disconnected' | 'error'> = new Map();

  constructor() {
    console.log('[ChannelManager] Initializing multi-channel system...');
  }

  /**
   * Register a new channel adapter
   */
  registerAdapter(adapter: ChannelAdapter): void {
    this.adapters.set(adapter.type, adapter);
    console.log(`[ChannelManager] Registered adapter: ${adapter.name} (${adapter.type})`);
    
    // Set up message handling
    adapter.onMessage(async (message: ChannelMessage) => {
      await this.handleMessage(message);
    });
  }

  /**
   * Initialize all enabled channels
   */
  async initializeChannels(channelConfigs: Array<{ type: ChannelType; enabled: boolean; config: any }>): Promise<void> {
    const initPromises = channelConfigs
      .filter(config => config.enabled)
      .map(async (config) => {
        const adapter = this.adapters.get(config.type);
        if (adapter) {
          try {
            await adapter.initialize();
            this.channelStatuses.set(config.type, 'connected');
            console.log(`[ChannelManager] ✅ ${config.type} channel initialized`);
          } catch (error) {
            this.channelStatuses.set(config.type, 'error');
            console.error(`[ChannelManager] ❌ Failed to initialize ${config.type}:`, error);
          }
        }
      });

    await Promise.allSettled(initPromises);
  }

  /**
   * Send message through a specific channel
   */
  async sendMessage(
    channelType: ChannelType, 
    channelId: string, 
    content: string, 
    options?: any
  ): Promise<void> {
    const adapter = this.adapters.get(channelType);
    if (!adapter) {
      throw new Error(`No adapter found for channel type: ${channelType}`);
    }

    if (adapter.getStatus() !== 'connected') {
      throw new Error(`Channel ${channelType} is not connected`);
    }

    await adapter.sendMessage(channelId, content, options);
    console.log(`[ChannelManager] Sent message via ${channelType} to ${channelId}`);
  }

  /**
   * Broadcast message to all connected channels
   */
  async broadcastMessage(content: string, excludeChannel?: ChannelType): Promise<void> {
    const promises = Array.from(this.adapters.entries())
      .filter(([type]) => type !== excludeChannel)
      .map(async ([type, adapter]) => {
        if (adapter.getStatus() === 'connected') {
          try {
            // This would need to be implemented per adapter for broadcast
            console.log(`[ChannelManager] Broadcasting to ${type}`);
          } catch (error) {
            console.error(`[ChannelManager] Broadcast failed for ${type}:`, error);
          }
        }
      });

    await Promise.allSettled(promises);
  }

  /**
   * Register a global message handler
   */
  onMessage(handler: (message: ChannelMessage) => Promise<void>): void {
    this.messageHandlers.push(handler);
  }

  /**
   * Handle incoming message from any channel
   */
  private async handleMessage(message: ChannelMessage): Promise<void> {
    console.log(`[ChannelManager] Received message from ${message.channelId}:`, {
      userId: message.userId,
      content: message.content.substring(0, 100) + (message.content.length > 100 ? '...' : ''),
      isGroup: message.metadata?.isGroup
    });

    // Process through all registered handlers
    const promises = this.messageHandlers.map(handler => 
      handler(message).catch(error => 
        console.error('[ChannelManager] Message handler error:', error)
      )
    );

    await Promise.allSettled(promises);
  }

  /**
   * Get status of all channels
   */
  getChannelStatuses(): Record<string, string> {
    const statuses: Record<string, string> = {};
    
    this.adapters.forEach((adapter, type) => {
      statuses[type] = adapter.getStatus();
    });

    return statuses;
  }

  /**
   * Get statistics
   */
  getStats(): {
    totalChannels: number;
    connectedChannels: number;
    channelTypes: string[];
  } {
    const totalChannels = this.adapters.size;
    const connectedChannels = Array.from(this.adapters.values())
      .filter(adapter => adapter.getStatus() === 'connected').length;
    const channelTypes = Array.from(this.adapters.keys());

    return {
      totalChannels,
      connectedChannels,
      channelTypes
    };
  }

  /**
   * Cleanup all channels
   */
  async cleanup(): Promise<void> {
    console.log('[ChannelManager] Cleaning up all channels...');
    
    const cleanupPromises = Array.from(this.adapters.values()).map(adapter => 
      adapter.cleanup().catch(error => 
        console.error('[ChannelManager] Cleanup error for adapter:', error)
      )
    );

    await Promise.allSettled(cleanupPromises);
    this.adapters.clear();
    this.channelStatuses.clear();
    this.messageHandlers = [];
  }
}
