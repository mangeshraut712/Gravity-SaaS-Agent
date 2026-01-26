import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3003;

// Basic types for this demo
interface ChatCompletionRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
  provider?: 'anthropic' | 'openrouter';
}

interface ChatCompletionResponse {
  content: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  provider: string;
}

// Simple OpenRouter provider implementation
class SimpleOpenRouterProvider {
  private apiKey: string;
  private baseUrl: string;
  private defaultModel: string;

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || '';
    this.baseUrl = 'https://openrouter.ai/api/v1';
    this.defaultModel = process.env.OPENROUTER_MODEL || 'openrouter/anthropic/claude-sonnet-4-5';
  }

  async chatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const startTime = Date.now();
    
    try {
      const model = request.model || this.defaultModel;
      const payload = {
        model,
        messages: request.messages,
        max_tokens: request.maxTokens || 4000,
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

      const data = await response.json() as any;
      const latency = Date.now() - startTime;

      console.log(`[OpenRouter] Request completed in ${latency}ms`);

      return {
        content: data.choices[0]?.message?.content || '',
        model: data.model,
        usage: {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens
        },
        provider: 'openrouter'
      };
    } catch (error: any) {
      const latency = Date.now() - startTime;
      console.error(`[OpenRouter] Request failed after ${latency}ms:`, error);
      throw error;
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
      return data.data.map(model => model.id);
    } catch (error) {
      console.error('[OpenRouter] Failed to list models:', error);
      return [
        'openrouter/anthropic/claude-sonnet-4-5',
        'openrouter/anthropic/claude-3.5-sonnet',
        'openrouter/openai/gpt-4',
        'openrouter/openai/gpt-4-turbo'
      ]; // Fallback models
    }
  }
}

// Initialize provider
const openRouterProvider = new SimpleOpenRouterProvider();

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Request ID middleware
app.use((req: any, res, next) => {
  req.requestId = uuidv4();
  res.setHeader('X-Request-ID', req.requestId);
  next();
});

// Logging middleware
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    error: 'Too many requests',
    retryAfter: '15 minutes'
  }
});
app.use('/api', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    services: {
      gateway: 'running',
      openrouter: 'configured' // Simple status since we can't await here
    }
  });
});

// Model Provider Routes
app.get('/api/models', async (req: any, res) => {
  try {
    const models = await openRouterProvider.listModels();
    
    res.json({
      success: true,
      data: {
        models,
        providers: ['openrouter'],
        defaultProvider: 'openrouter'
      }
    });
  } catch (error: any) {
    console.error('Failed to list models:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/chat/completions', async (req: any, res) => {
  try {
    const request: ChatCompletionRequest = req.body;
    
    // Validate request
    if (!request.messages || !Array.isArray(request.messages) || request.messages.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Messages array is required and must not be empty'
      });
    }

    // Check if OpenRouter API key is configured
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'OpenRouter API key not configured. Please set OPENROUTER_API_KEY environment variable.'
      });
    }
    
    // Process with OpenRouter
    const response: ChatCompletionResponse = await openRouterProvider.chatCompletion(request);
    
    // Log usage
    console.log('Chat completion completed', {
      requestId: req.requestId,
      model: response.model,
      provider: response.provider,
      tokensUsed: response.usage.totalTokens
    });

    res.json({
      success: true,
      data: response
    });
  } catch (error: any) {
    console.error('Chat completion failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      requestId: req.requestId
    });
  }
});

// Provider Management Routes
app.get('/api/providers', async (req: any, res) => {
  try {
    const isValid = await openRouterProvider.validateApiKey();
    
    res.json({
      success: true,
      data: {
        providers: ['openrouter'],
        validation: {
          openrouter: isValid
        },
        defaultProvider: 'openrouter'
      }
    });
  } catch (error: any) {
    console.error('Failed to get provider info:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/providers/openrouter/validate', async (req: any, res) => {
  try {
    const isValid = await openRouterProvider.validateApiKey();
    
    res.json({
      success: true,
      data: {
        provider: 'openrouter',
        valid: isValid,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error('Provider validation failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// System Stats Route
app.get('/api/stats', async (req: any, res) => {
  try {
    const stats = {
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        platform: process.platform,
        nodeVersion: process.version
      },
      openrouter: {
        configured: !!process.env.OPENROUTER_API_KEY,
        defaultModel: process.env.OPENROUTER_MODEL || 'openrouter/anthropic/claude-sonnet-4-5'
      },
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    console.error('Failed to get system stats:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Security Audit Route
app.get('/api/security/audit', async (req: any, res) => {
  try {
    const vulnerabilities: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Check OpenRouter API key
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterKey || !openRouterKey.startsWith('sk-or-')) {
      vulnerabilities.push('WARN: Invalid or missing OpenRouter API key.');
      recommendations.push('Set a valid OPENROUTER_API_KEY in your environment');
      score -= 15;
    }

    // Check rate limiting configuration
    const rateLimitEnabled = process.env.RATE_LIMIT_MAX_REQUESTS && parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) > 0;
    if (!rateLimitEnabled) {
      vulnerabilities.push('WARN: Rate limiting is not configured.');
      recommendations.push('Configure RATE_LIMIT_MAX_REQUESTS to prevent abuse');
      score -= 10;
    }

    res.json({
      success: true,
      data: {
        passed: vulnerabilities.length === 0,
        vulnerabilities,
        recommendations,
        score: Math.max(0, score)
      }
    });
  } catch (error: any) {
    console.error('Security audit failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// WebSocket info
app.get('/api/websocket/info', (req, res) => {
  res.json({
    success: true,
    data: {
      url: `ws://localhost:${PORT}/ws`,
      protocols: ['gravityos-v1'],
      features: ['chat', 'real-time', 'broadcast', 'subscriptions']
    }
  });
});

// Error handling middleware
app.use((error: any, req: any, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error, { requestId: req.requestId });
  
  res.status(error.status || 500).json({
    success: false,
    error: error.message || 'Internal server error',
    requestId: req.requestId
  });
});

// 404 handler
app.use('*', (req: any, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl,
    requestId: req.requestId
  });
});

// Start server
const server = app.listen(PORT, async () => {
  console.log(`🚀 GravityOS OpenRouter Gateway started on port ${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
  console.log(`🔌 Models: http://localhost:${PORT}/api/models`);
  console.log(`💬 Chat: http://localhost:${PORT}/api/chat/completions`);
  console.log(`📈 Stats: http://localhost:${PORT}/api/stats`);
  
  // Validate OpenRouter on startup
  const isValid = await openRouterProvider.validateApiKey();
  console.log(`🤖 OpenRouter API Key: ${isValid ? '✅ Valid' : '❌ Invalid or missing'}`);
  
  if (!isValid) {
    console.warn('⚠️  Please set OPENROUTER_API_KEY environment variable to enable OpenRouter functionality');
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;
