/**
 * Standard interface for messaging adapters
 */
export interface MessageAdapter {
    name: string;
    initialize(): Promise<void>;
    sendMessage(to: string, text: string): Promise<void>;
    onMessage(handler: (from: string, text: string) => Promise<void>): void;
}
