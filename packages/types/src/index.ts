export type UserTier = 'FREE' | 'PRO' | 'ENTERPRISE';

export interface User {
  id: string;
  email: string;
  tier: UserTier;
  tokenLimit: number;
  tokensUsed: number;
  lastActive: Date;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
  metadata?: Record<string, any>;
}

export interface Session {
  userId: string;
  messages: Message[];
  createdAt: Date;
  lastActive: Date;
}

export interface ToolExecution {
  name: string;
  args: Record<string, any>;
  result?: any;
  error?: string;
  timestamp: Date;
}

export interface SecurityAuditResult {
  passed: boolean;
  vulnerabilities: string[];
  recommendations: string[];
  score: number;
}

export interface SystemStats {
  uptime: number;
  memoryUsage: NodeJS.MemoryUsage;
  activeConnections: number;
  totalRequests: number;
  errorRate: number;
  lastUpdated: Date;
}

export interface ChannelStatus {
  type: string;
  status: 'connected' | 'disconnected' | 'error';
  lastActivity?: Date;
  messageCount?: number;
  errorCount?: number;
  config?: Record<string, any>;
}

export interface SkillStats {
  id: string;
  name: string;
  category: string;
  executionCount: number;
  successRate: number;
  averageLatency: number;
  lastUsed?: Date;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
  requestId?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
  requestId?: string;
}

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: Date;
  userId?: string;
  requestId?: string;
}

export interface CacheOptions {
  ttl?: number;
  tags?: string[];
  compress?: boolean;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: Date;
  ttl: number;
  tags?: string[];
  compressed?: boolean;
}

// Model Provider Types
export interface IModelProvider {
  name: string;
  apiKey: string;
  baseUrl?: string;
  models: string[];
  defaultModel?: string;
  chatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse>;
  listModels(): Promise<string[]>;
  validateApiKey(): Promise<boolean>;
}

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

export interface MCPTool {
  name: string;
  description: string;
  input_schema: Record<string, any>;
  category: string;
  dangerous: boolean;
}

export interface GatewayConfig {
  port: number;
  cors: {
    origins: string[];
    methods: string[];
    allowedHeaders: string[];
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  security: {
    sandboxMode: boolean;
    tokenScope: string;
    model: string;
  };
}

// Re-export channel and skill types
export * from './channels.js';
export * from './skills.js';
