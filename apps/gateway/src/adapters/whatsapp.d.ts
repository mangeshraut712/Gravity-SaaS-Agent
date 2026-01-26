import { MessageAdapter } from '../interfaces.js';
/**
 * WhatsApp Adapter (Simulation)
 * In production, this would use 'whatsapp-web.js' or the Meta Graph API.
 */
export declare class WhatsAppAdapter implements MessageAdapter {
    name: string;
    private messageHandler;
    initialize(): Promise<void>;
    sendMessage(to: string, text: string): Promise<void>;
    onMessage(handler: (from: string, text: string) => Promise<void>): void;
    simulateIncomingMessage(from: string, text: string): void;
}
