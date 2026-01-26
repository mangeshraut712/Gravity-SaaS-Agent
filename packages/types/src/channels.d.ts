export type ChannelType = 'whatsapp' | 'telegram' | 'slack' | 'discord' | 'signal' | 'imessage' | 'teams' | 'webchat' | 'email' | 'voice';
export interface ChannelConfig {
    type: ChannelType;
    enabled: boolean;
    config: Record<string, any>;
    rateLimit?: {
        windowMs: number;
        maxRequests: number;
    };
    sandbox?: {
        enabled: boolean;
        mode: 'main' | 'non-main';
    };
}
export interface ChannelMessage {
    id: string;
    channelId: string;
    userId: string;
    content: string;
    timestamp: Date;
    metadata?: {
        isGroup: boolean;
        groupId?: string;
        mentions?: string[];
        attachments?: Array<{
            type: 'image' | 'audio' | 'video' | 'document';
            url: string;
            size: number;
        }>;
    };
}
export interface ChannelAdapter {
    type: ChannelType;
    name: string;
    initialize(): Promise<void>;
    sendMessage(channelId: string, content: string, options?: any): Promise<void>;
    onMessage(handler: (message: ChannelMessage) => Promise<void>): void;
    getStatus(): 'connected' | 'disconnected' | 'error';
    cleanup(): Promise<void>;
}
