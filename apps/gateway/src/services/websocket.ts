import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { EventEmitter } from 'events';
import { AuthenticatedRequest } from '../middleware/index.js';

export interface WebSocketMessage {
    type: 'subscribe' | 'unsubscribe' | 'ping' | 'data' | 'error';
    channel?: string;
    data?: any;
    timestamp: Date;
    requestId?: string;
}

export interface WebSocketClient {
    id: string;
    ws: WebSocket;
    userId?: string;
    userTier?: 'FREE' | 'PRO' | 'ENTERPRISE';
    subscriptions: Set<string>;
    lastPing: Date;
    ipAddress: string;
    userAgent?: string;
}

export class WebSocketManager extends EventEmitter {
    private wss: WebSocketServer;
    private clients: Map<string, WebSocketClient> = new Map();
    private channels: Map<string, Set<string>> = new Map();
    private heartbeatInterval: NodeJS.Timeout | null = null;
    private maxClients: number;
    private messageQueue: Map<string, any[]> = new Map();

    constructor(server: Server, options: { maxClients?: number } = {}) {
        super();
        this.maxClients = options.maxClients || 1000;
        
        this.wss = new WebSocketServer({
            server,
            path: '/ws',
            verifyClient: this.verifyClient.bind(this)
        });

        this.setupWebSocketServer();
        this.startHeartbeat();
    }

    private verifyClient(info: { origin: string; secure: boolean; req: any }, callback: (result: boolean, code?: number, message?: string) => void) {
        // Basic verification - in production, implement proper authentication
        const origin = info.origin;
        const allowedOrigins = process.env.WS_ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
        
        if (!allowedOrigins.includes('*') && !allowedOrigins.includes(origin)) {
            return callback(false, 403, 'Origin not allowed');
        }

        // Check client limit
        if (this.clients.size >= this.maxClients) {
            return callback(false, 429, 'Too many WebSocket connections');
        }

        callback(true);
    }

    private setupWebSocketServer() {
        this.wss.on('connection', (ws: WebSocket, req: any) => {
            this.handleConnection(ws, req);
        });

        this.wss.on('error', (error) => {
            console.error('[WebSocket] Server error:', error);
            this.emit('error', error);
        });
    }

    private handleConnection(ws: WebSocket, req: any) {
        const clientId = this.generateClientId();
        const client: WebSocketClient = {
            id: clientId,
            ws,
            subscriptions: new Set(),
            lastPing: new Date(),
            ipAddress: req.socket.remoteAddress || 'unknown',
            userAgent: req.headers['user-agent']
        };

        this.clients.set(clientId, client);
        console.log(`[WebSocket] Client connected: ${clientId} from ${client.ipAddress}`);

        // Send welcome message
        this.sendToClient(clientId, {
            type: 'data',
            data: {
                message: 'Connected to GravityOS WebSocket',
                clientId,
                timestamp: new Date()
            },
            timestamp: new Date()
        });

        ws.on('message', (data: WebSocket.Data) => {
            try {
                const message: WebSocketMessage = JSON.parse(data.toString());
                this.handleMessage(clientId, message);
            } catch (error: any) {
                console.error(`[WebSocket] Invalid message from ${clientId}:`, error);
                this.sendToClient(clientId, {
                    type: 'error',
                    data: { error: 'Invalid message format' },
                    timestamp: new Date()
                });
            }
        });

        ws.on('close', (code: number, reason: string) => {
            this.handleDisconnection(clientId, code, reason);
        });

        ws.on('error', (error: Error) => {
            console.error(`[WebSocket] Client error ${clientId}:`, error);
            this.handleDisconnection(clientId, 1006, 'WebSocket error');
        });

        ws.on('pong', () => {
            const client = this.clients.get(clientId);
            if (client) {
                client.lastPing = new Date();
            }
        });

        this.emit('clientConnected', client);
    }

    private handleMessage(clientId: string, message: WebSocketMessage) {
        const client = this.clients.get(clientId);
        if (!client) return;

        switch (message.type) {
            case 'subscribe':
                this.handleSubscription(clientId, message.channel);
                break;
            case 'unsubscribe':
                this.handleUnsubscription(clientId, message.channel);
                break;
            case 'ping':
                this.sendToClient(clientId, {
                    type: 'data',
                    data: { pong: true },
                    timestamp: new Date()
                });
                break;
            default:
                console.warn(`[WebSocket] Unknown message type: ${message.type}`);
        }
    }

    private handleSubscription(clientId: string, channel?: string) {
        if (!channel) {
            this.sendToClient(clientId, {
                type: 'error',
                data: { error: 'Channel is required for subscription' },
                timestamp: new Date()
            });
            return;
        }

        const client = this.clients.get(clientId);
        if (!client) return;

        // Check permissions based on user tier and channel
        if (!this.canSubscribeToChannel(client, channel)) {
            this.sendToClient(clientId, {
                type: 'error',
                data: { error: 'Insufficient permissions for channel' },
                timestamp: new Date()
            });
            return;
        }

        client.subscriptions.add(channel);
        
        if (!this.channels.has(channel)) {
            this.channels.set(channel, new Set());
        }
        this.channels.get(channel)!.add(clientId);

        // Send queued messages for this channel
        const queuedMessages = this.messageQueue.get(channel) || [];
        if (queuedMessages.length > 0) {
            queuedMessages.forEach(message => {
                this.sendToClient(clientId, {
                    type: 'data',
                    channel,
                    data: message,
                    timestamp: new Date()
                });
            });
            this.messageQueue.set(channel, []);
        }

        this.sendToClient(clientId, {
            type: 'data',
            data: { subscribed: channel },
            timestamp: new Date()
        });

        console.log(`[WebSocket] Client ${clientId} subscribed to ${channel}`);
        this.emit('subscription', { clientId, channel, action: 'subscribe' });
    }

    private handleUnsubscription(clientId: string, channel?: string) {
        if (!channel) return;

        const client = this.clients.get(clientId);
        if (!client) return;

        client.subscriptions.delete(channel);
        
        const channelClients = this.channels.get(channel);
        if (channelClients) {
            channelClients.delete(clientId);
            if (channelClients.size === 0) {
                this.channels.delete(channel);
            }
        }

        this.sendToClient(clientId, {
            type: 'data',
            data: { unsubscribed: channel },
            timestamp: new Date()
        });

        console.log(`[WebSocket] Client ${clientId} unsubscribed from ${channel}`);
        this.emit('subscription', { clientId, channel, action: 'unsubscribe' });
    }

    private handleDisconnection(clientId: string, code: number, reason: string) {
        const client = this.clients.get(clientId);
        if (!client) return;

        // Clean up subscriptions
        client.subscriptions.forEach(channel => {
            const channelClients = this.channels.get(channel);
            if (channelClients) {
                channelClients.delete(clientId);
                if (channelClients.size === 0) {
                    this.channels.delete(channel);
                }
            }
        });

        this.clients.delete(clientId);
        console.log(`[WebSocket] Client disconnected: ${clientId} (${code}: ${reason})`);
        this.emit('clientDisconnected', { clientId, code, reason });
    }

    private canSubscribeToChannel(client: WebSocketClient, channel: string): boolean {
        // Implement channel-based permission logic
        const restrictedChannels = ['admin', 'system'];
        const isRestricted = restrictedChannels.includes(channel);
        
        if (isRestricted && client.userTier !== 'ENTERPRISE') {
            return false;
        }

        // Free tier has limited channel access
        if (client.userTier === 'FREE' && client.subscriptions.size >= 3) {
            return false;
        }

        return true;
    }

    private startHeartbeat() {
        this.heartbeatInterval = setInterval(() => {
            const now = new Date();
            const deadClients: string[] = [];

            this.clients.forEach((client, clientId) => {
                const timeSinceLastPing = now.getTime() - client.lastPing.getTime();
                
                if (timeSinceLastPing > 60000) { // 60 seconds timeout
                    deadClients.push(clientId);
                } else {
                    // Send ping
                    try {
                        client.ws.ping();
                    } catch (error) {
                        deadClients.push(clientId);
                    }
                }
            });

            // Remove dead clients
            deadClients.forEach(clientId => {
                this.handleDisconnection(clientId, 1006, 'Heartbeat timeout');
            });
        }, 30000); // Check every 30 seconds
    }

    private sendToClient(clientId: string, message: WebSocketMessage) {
        const client = this.clients.get(clientId);
        if (!client || client.ws.readyState !== WebSocket.OPEN) {
            return;
        }

        try {
            client.ws.send(JSON.stringify(message));
        } catch (error) {
            console.error(`[WebSocket] Failed to send to ${clientId}:`, error);
            this.handleDisconnection(clientId, 1006, 'Send error');
        }
    }

    // Public API methods
    public broadcast(channel: string, data: any, excludeClientId?: string) {
        const clients = this.channels.get(channel);
        if (!clients) return;

        const message: WebSocketMessage = {
            type: 'data',
            channel,
            data,
            timestamp: new Date()
        };

        clients.forEach(clientId => {
            if (clientId !== excludeClientId) {
                this.sendToClient(clientId, message);
            }
        });

        console.log(`[WebSocket] Broadcast to ${clients.size} clients on channel ${channel}`);
        this.emit('broadcast', { channel, data, clientCount: clients.size });
    }

    public sendToUser(userId: string, data: any) {
        let sent = false;
        this.clients.forEach((client, clientId) => {
            if (client.userId === userId) {
                this.sendToClient(clientId, {
                    type: 'data',
                    data,
                    timestamp: new Date()
                });
                sent = true;
            }
        });

        if (!sent) {
            // Queue message for when user connects
            const queueKey = `user-${userId}`;
            if (!this.messageQueue.has(queueKey)) {
                this.messageQueue.set(queueKey, []);
            }
            this.messageQueue.get(queueKey)!.push(data);
        }
    }

    public getStats() {
        return {
            totalClients: this.clients.size,
            totalChannels: this.channels.size,
            clientsByTier: this.getClientStatsByTier(),
            channelStats: this.getChannelStats(),
            uptime: process.uptime()
        };
    }

    private getClientStatsByTier() {
        const stats: Record<string, number> = {};
        this.clients.forEach(client => {
            const tier = client.userTier || 'unknown';
            stats[tier] = (stats[tier] || 0) + 1;
        });
        return stats;
    }

    private getChannelStats() {
        const stats: Record<string, number> = {};
        this.channels.forEach((clients, channel) => {
            stats[channel] = clients.size;
        });
        return stats;
    }

    public authenticateClient(clientId: string, userId: string, userTier: 'FREE' | 'PRO' | 'ENTERPRISE') {
        const client = this.clients.get(clientId);
        if (client) {
            client.userId = userId;
            client.userTier = userTier;
            console.log(`[WebSocket] Client ${clientId} authenticated as ${userId} (${userTier})`);
        }
    }

    private generateClientId(): string {
        return `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    public shutdown() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }

        this.clients.forEach((client, clientId) => {
            try {
                client.ws.close(1001, 'Server shutdown');
            } catch (error) {
                console.error(`[WebSocket] Error closing client ${clientId}:`, error);
            }
        });

        this.wss.close();
        console.log('[WebSocket] Server shutdown complete');
    }
}
