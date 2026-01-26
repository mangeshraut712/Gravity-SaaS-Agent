import { 
  IModelProvider,
  ModelProvider,
  OpenRouterConfig, 
  ModelRequest, 
  ModelResponse, 
  ChatCompletionRequest, 
  ChatCompletionResponse 
} from '@gravity/types';

export class OpenRouterProvider implements IModelProvider {
  name = 'openrouter';
  apiKey: string;
  baseUrl: string;
  models: string[];
  defaultModel: string;

  constructor(config: OpenRouterConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://openrouter.ai/api/v1';
    this.models = config.models;
    this.defaultModel = config.defaultModel;
  }

  async chatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const startTime = Date.now();
    
    try {
      const model = request.model || this.defaultModel;
      const payload: ModelRequest = {
        model,
        messages: request.messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content
        })),
        maxTokens: request.maxTokens || 4000,
        temperature: request.temperature || 0.7,
        stream: request.stream || false
      };

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://gravityos.ai',
          'X-Title': 'GravityOS AI Agent'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
      }

      const data: ModelResponse = await response.json() as ModelResponse;
      const latency = Date.now() - startTime;

      return {
        content: data.choices[0]?.message?.content || '',
        model: data.model,
        usage: {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens
        },
        provider: this.name
      };
    } catch (error) {
      const latency = Date.now() - startTime;
      console.error(`[OpenRouter] Request failed after ${latency}ms:`, error);
      throw error;
    }
  }

  async listModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to list models: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as { data: Array<{ id: string }> };
      return data.data.map((model: any) => model.id);
    } catch (error) {
      console.error('[OpenRouter] Failed to list models:', error);
      return this.models; // Fallback to configured models
    }
  }

  async validateApiKey(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.ok;
    } catch (error) {
      console.error('[OpenRouter] API key validation failed:', error);
      return false;
    }
  }

  getModelInfo(modelId: string): { name: string; provider: string; capabilities: string[] } {
    const [provider, ...modelParts] = modelId.split('/');
    const modelName = modelParts.join('/');
    
    return {
      name: modelName,
      provider: provider || 'openrouter',
      capabilities: ['chat', 'completion', 'streaming']
    };
  }

  async estimateTokens(text: string): Promise<number> {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  async getUsageStats(): Promise<{
    totalRequests: number;
    totalTokens: number;
    averageLatency: number;
    errorRate: number;
  }> {
    // This would typically fetch from a metrics store
    // For now, return placeholder data
    return {
      totalRequests: 0,
      totalTokens: 0,
      averageLatency: 0,
      errorRate: 0
    };
  }
}

export class ModelProviderManager {
  private providers: Map<string, IModelProvider> = new Map();
  private defaultProvider: string = 'openrouter';

  constructor() {
    this.initializeProviders();
  }

  private async initializeProviders() {
    // Initialize OpenRouter if API key is available
    if (process.env.OPENROUTER_API_KEY) {
      const openRouter = new OpenRouterProvider({
        apiKey: process.env.OPENROUTER_API_KEY,
        models: [
          'openrouter/anthropic/claude-sonnet-4-5',
          'openrouter/anthropic/claude-3.5-sonnet',
          'openrouter/openai/gpt-4',
          'openrouter/openai/gpt-4-turbo',
          'openrouter/meta-llama/llama-3.1-70b-instruct',
          'openrouter/google/gemini-pro'
        ],
        defaultModel: process.env.OPENROUTER_MODEL || 'openrouter/anthropic/claude-sonnet-4-5'
      });
      
      this.providers.set('openrouter', openRouter);
      
      // Validate API key
      const isValid = await openRouter.validateApiKey();
      if (isValid) {
        console.log('[ModelProvider] OpenRouter provider initialized successfully');
      } else {
        console.warn('[ModelProvider] OpenRouter API key validation failed');
      }
    }
  }

  getProvider(name?: string): IModelProvider | undefined {
    return this.providers.get(name || this.defaultProvider);
  }

  async chatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const provider = this.getProvider(request.provider);
    
    if (!provider) {
      throw new Error(`Provider not found: ${request.provider || this.defaultProvider}`);
    }

    return provider.chatCompletion(request);
  }

  async listModels(provider?: string): Promise<string[]> {
    const modelProvider = this.getProvider(provider);
    
    if (!modelProvider) {
      throw new Error(`Provider not found: ${provider || this.defaultProvider}`);
    }

    return modelProvider.listModels();
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  setDefaultProvider(provider: string): void {
    if (this.providers.has(provider)) {
      this.defaultProvider = provider;
      console.log(`[ModelProvider] Default provider set to: ${provider}`);
    } else {
      throw new Error(`Provider not found: ${provider}`);
    }
  }

  async validateAllProviders(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    
    for (const [name, provider] of this.providers) {
      if ('validateApiKey' in provider && typeof provider.validateApiKey === 'function') {
        results[name] = await provider.validateApiKey();
      } else {
        results[name] = true; // Assume valid if no validation method
      }
    }
    
    return results;
  }

  async getProviderStats(): Promise<Record<string, any>> {
    const stats: Record<string, any> = {};
    
    for (const [name, provider] of this.providers) {
      if ('getUsageStats' in provider && typeof provider.getUsageStats === 'function') {
        stats[name] = await provider.getUsageStats();
      } else {
        stats[name] = { status: 'available' };
      }
    }
    
    return stats;
  }
}

// Singleton instance
export const modelProviderManager = new ModelProviderManager();

export default OpenRouterProvider;
