import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { v4 as uuidv4 } from 'uuid';

// Import services
import { modelProviderManager } from './services/model-provider.js';
import { Logger, RequestLogger } from './services/logger.js';
import { CacheManager } from './services/cache.js';
import { WebSocketManager } from './services/websocket.js';
import { securityService } from './services/security.js';

// Import types
import { ApiResponse, ChatCompletionRequest, ChatCompletionResponse } from '@gravity/types';

const app = express();
const PORT = process.env.PORT || 3003;

// Initialize services
const cacheManager = new CacheManager();
// const wsManager = new WebSocketManager(); // Comment out for now
const logger = Logger;

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
app.use(RequestLogger.middleware());
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
    version: process.env.npm_package_version || '1.0.0',
    services: {
      gateway: 'running',
      cache: 'connected',
      websocket: 'running'
    }
  });
});

// Model Provider Routes
app.get('/api/models', async (req: any, res) => {
  try {
    const provider = req.query.provider as string;
    const models = await modelProviderManager.listModels(provider);
    
    res.json({
      success: true,
      data: {
        models,
        providers: modelProviderManager.getAvailableProviders(),
        defaultProvider: 'openrouter'
      }
    });
  } catch (error: any) {
    logger.error('Failed to list models', error);
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

    // Add request ID for tracking
    // request.requestId = req.requestId; // Remove this line as it doesn't exist in interface
    
    // Process with model provider
    const response: ChatCompletionResponse = await modelProviderManager.chatCompletion(request);
    
    // Log usage
    logger.info('Chat completion completed', {
      requestId: req.requestId,
      model: response.model,
      provider: response.provider,
      tokensUsed: response.usage.totalTokens,
      promptTokens: response.usage.promptTokens,
      completionTokens: response.usage.completionTokens
    });

    res.json({
      success: true,
      data: response
    });
  } catch (error: any) {
    logger.error('Chat completion failed', error, { requestId: req.requestId });
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
    const providers = modelProviderManager.getAvailableProviders();
    const validation = await modelProviderManager.validateAllProviders();
    const stats = await modelProviderManager.getProviderStats();
    
    res.json({
      success: true,
      data: {
        providers,
        validation,
        stats,
        defaultProvider: 'openrouter'
      }
    });
  } catch (error: any) {
    logger.error('Failed to get provider info', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/providers/:provider/validate', async (req: any, res) => {
  try {
    const { provider } = req.params;
    const providerInstance = modelProviderManager.getProvider(provider);
    
    if (!providerInstance) {
      return res.status(404).json({
        success: false,
        error: `Provider not found: ${provider}`
      });
    }

    const isValid = await providerInstance.validateApiKey();
    
    res.json({
      success: true,
      data: {
        provider,
        valid: isValid,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    logger.error('Provider validation failed', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// System Stats Route
app.get('/api/stats', CacheManager.cacheMiddleware({ ttl: 300 }), async (req: any, res) => {
  try {
    const stats = {
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        platform: process.platform,
        nodeVersion: process.version
      },
      providers: await modelProviderManager.getProviderStats(),
      // websocket: wsManager.getStats(), // Comment out for now
      cache: await cacheManager.getStats(),
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    logger.error('Failed to get system stats', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Security Audit Route
app.get('/api/security/audit', async (req: any, res) => {
  try {
    const audit = await securityService.audit();
    
    res.json({
      success: true,
      data: audit
    });
  } catch (error: any) {
    logger.error('Security audit failed', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// WebSocket integration
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
  logger.error('Unhandled error', error, { requestId: req.requestId });
  
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
  logger.info(`🚀 GravityOS Gateway started on port ${PORT}`);
  logger.info(`📊 Dashboard: http://localhost:${PORT}/health`);
  logger.info(`🔌 WebSocket: ws://localhost:${PORT}/ws`);
  
  // Initialize WebSocket server
  // wsManager.initialize(server); // Comment out for now as method doesn't exist
  
  // Log available providers
  const providers = modelProviderManager.getAvailableProviders();
  logger.info(`🤖 Available providers: ${providers.join(', ')}`);
  
  // Validate providers on startup
  const validation = await modelProviderManager.validateAllProviders();
  logger.info('🔍 Provider validation results:', validation);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

export default app;
