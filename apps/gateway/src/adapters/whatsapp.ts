import { MessageAdapter } from '../interfaces.js';

/**
 * WhatsApp Adapter (Simulation)
 * In production, this would use 'whatsapp-web.js' or the Meta Graph API.
 */
export class WhatsAppAdapter implements MessageAdapter {
    name = 'WhatsApp';
    private messageHandler: ((from: string, text: string) => Promise<void>) | null = null;

    async initialize() {
        console.log('[WhatsApp] Initializing connection...');
        // Simulate connection delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('[WhatsApp] Connected! (Simulation Mode)');

        // Simulate receiving a message after startup
        setTimeout(() => {
            this.simulateIncomingMessage('1234567890', 'Hello GravityBot, what is the weather?');
        }, 5000);
    }

    async sendMessage(to: string, text: string) {
        console.log(`[WhatsApp] 📤 Sending to ${to}: "${text}"`);
        // Implementation would go here
    }

    onMessage(handler: (from: string, text: string) => Promise<void>) {
        this.messageHandler = handler;
    }

    // Helper to simulate incoming events
    simulateIncomingMessage(from: string, text: string) {
        if (this.messageHandler) {
            console.log(`[WhatsApp] 📥 Received from ${from}: "${text}"`);
            this.messageHandler(from, text);
        }
    }
}
