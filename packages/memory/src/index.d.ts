/**
 * Gravity Memory Engine
 * Implements Intelligent Summarization and Prompt Caching strategies
 */
export declare class GravityMemory {
    private anthropic;
    private readonly CACHE_STALE_THRESHOLD;
    constructor(apiKey: string);
    /**
     * Processes a conversation and returns a compressed context
     * Uses Prompt Caching for the system prompt and history prefix
     */
    getEffectiveContext(history: any[], systemPrompt: string): Promise<{
        system: {
            type: string;
            text: string;
            cache_control: {
                type: string;
            };
        }[];
        messages: any[];
    }>;
    private summarize;
    private estimateTokens;
}
