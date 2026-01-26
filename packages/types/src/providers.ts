export interface ModelProvider {
  name: string;
  apiKey: string;
  baseUrl?: string;
  models: string[];
  defaultModel?: string;
}

export interface OpenRouterConfig {
  apiKey: string;
  baseUrl?: string;
  models: string[];
  defaultModel: string;
}

export interface ModelRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

export interface ModelResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ModelProviderConfig {
  anthropic?: {
    apiKey: string;
    model: string;
  };
  openrouter?: {
    apiKey: string;
    model: string;
    baseUrl?: string;
  };
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface ChatCompletionRequest {
  messages: Message[];
  model?: string;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
  provider?: 'anthropic' | 'openrouter';
}

export interface ChatCompletionResponse {
  content: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  provider: string;
}

export interface ModelMetrics {
  provider: string;
  model: string;
  requestCount: number;
  totalTokens: number;
  averageLatency: number;
  errorRate: number;
  lastUsed: Date;
}
