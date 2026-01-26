import { Anthropic } from '@anthropic-ai/sdk';

/**
 * Gravity Memory Engine
 * Implements Intelligent Summarization and Prompt Caching strategies
 */
export class GravityMemory {
    private anthropic: Anthropic;
    private readonly CACHE_STALE_THRESHOLD = 1024 * 4; // 4k tokens

    constructor(apiKey: string) {
        this.anthropic = new Anthropic({ apiKey });
    }

    /**
     * Processes a conversation and returns a compressed context
     * Uses Prompt Caching for the system prompt and history prefix
     */
    async getEffectiveContext(history: any[], systemPrompt: string) {
        // 1. Mark system prompt for caching
        const system = [
            {
                type: 'text',
                text: systemPrompt,
                cache_control: { type: 'ephemeral' } // Cache the base system prompt
            }
        ];

        // 2. Determine if history needs compaction
        const tokenCount = this.estimateTokens(history);

        if (tokenCount > 20000) {
            console.log('Context limit approaching. Triggering intelligent summarization...');
            const summary = await this.summarize(history.slice(0, -10));
            const recentMessages = history.slice(-10);

            return {
                system,
                messages: [
                    { role: 'user', content: `[COMPACTED HISTORY SUMMARY]: ${summary}` },
                    ...recentMessages
                ]
            };
        }

        // 3. Mark the oldest parts of history for caching if they haven't changed
        const messages = history.map((m, i) => {
            if (i === history.length - 1) return m; // Don't cache the very last user message
            if (i < history.length - 5) {
                return { ...m, cache_control: { type: 'ephemeral' } };
            }
            return m;
        });

        return { system, messages };
    }

    private async summarize(history: any[]): Promise<string> {
        // Logic to summarize conversation focusing on "entities" and "pending tasks"
        // Using a fast model like Haiku for cheap summarization
        const response = await this.anthropic.messages.create({
            model: 'claude-3-haiku-20240307',
            max_tokens: 1000,
            messages: [
                {
                    role: 'user',
                    content: `Summarize this conversation history concisely. 
                    Focus on: 1. User preferences 2. Pending tasks 3. Key facts.
                    History: ${JSON.stringify(history)}`
                }
            ]
        });
        const block = response.content[0];
        if (block.type === 'text') {
            return block.text;
        }
        return '';
    }

    private estimateTokens(history: any[]): number {
        return JSON.stringify(history).length / 4; // Rough estimate
    }
}
