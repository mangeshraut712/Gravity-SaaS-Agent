# 🚀 AgentFlow – AI Agent SaaS Platform

A production-ready, multi-tenant AI agent SaaS platform for deploying branded AI agents across web chat, WhatsApp, and API channels.

## ✨ Features

- 🤖 **AI Agent Builder** – Create custom agents with templates (Customer Support, Sales, FAQ, Lead Capture)
- 💬 **Multi-Channel Deployment** – Web chat, WhatsApp, Telegram, API endpoints
- 💳 **Billing & Subscriptions** – Polar.sh integration with tiered plans (Free, Pro, Business)
- 📊 **Analytics Dashboard** – Real-time metrics, usage tracking, revenue monitoring
- 🔐 **Enterprise Security** – JWT auth, RBAC, rate limiting, input validation
- ⚡ **Performance Optimized** – Redis caching, bundle optimization, image optimization

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Dashboard (Next.js 15)                   │
│  ├─ Landing Page & Auth                                     │
│  ├─ Agent Builder & Templates                               │
│  ├─ Analytics & Billing                                     │
│  └─ Real-time Chat Widget                                   │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Gateway API (Express)                    │
│  ├─ Multi-Channel Manager (WhatsApp, Telegram, etc.)        │
│  ├─ Skills Platform (Web Search, File Management)           │
│  ├─ Advanced Caching (Redis + LRU)                          │
│  ├─ Security (Helmet, JWT, Rate Limiting)                   │
│  └─ Health Monitoring & Logging                             │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│              Supabase (PostgreSQL + Auth)                   │
│  ├─ Users, Agents, Conversations, Messages                  │
│  ├─ Analytics Events & Billing Events                       │
│  └─ Row Level Security (RLS)                                │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- Anthropic API key
- Polar.sh account (for billing)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Gravity-SaaS-Agent

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials
```

### Environment Setup

Create `.env` in the root:

```bash
# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# AI
ANTHROPIC_API_KEY=your_anthropic_key

# Billing
POLAR_PRO_PRODUCT_ID=your_pro_product_id
POLAR_BUSINESS_PRODUCT_ID=your_business_product_id

# Security
JWT_SECRET=your_jwt_secret

# Redis (optional, for caching)
REDIS_URL=redis://localhost:6379
```

### Database Setup

Run the schema in Supabase SQL Editor:

```bash
supabase/schema.sql
```

### Development

```bash
# Start all services - no Docker required!
npm run dev

# Or start individually
npm run dev --workspace=@gravity/dashboard  # Port 3000
npm run dev --workspace=@gravity/gateway     # Port 3001
```

The gateway automatically falls back to in-memory caching when Redis is unavailable, so you can develop without any external dependencies.

### Production Build

```bash
npm run build
npm start
```

### Docker Deployment

Docker is optional - use only for production or full-stack deployments with Redis:

```bash
# Start all services with Docker Compose
docker-compose up -d

# Services:
# - Dashboard: http://localhost:3000
# - Gateway: http://localhost:3001
# - PostgreSQL: localhost:5432 (if not using Supabase)
# - Redis: localhost:6379 (optional)
```

**For local development**, simply run `npm run dev` - no Docker needed!

## 📁 Project Structure

```
Gravity-SaaS-Agent/
├── apps/
│   ├── dashboard/          # Next.js 15 app
│   │   ├── src/
│   │   │   ├── app/       # App Router pages
│   │   │   ├── components/# React components
│   │   │   ├── lib/       # Utilities & clients
│   │   │   └── hooks/     # Custom React hooks
│   │   └── next.config.js # Optimized build config
│   └── gateway/           # Express API server
│       ├── src/
│       │   ├── services/  # Business logic
│       │   ├── middleware/# Express middleware
│       │   └── adapters/  # Channel adapters
│       └── Dockerfile
├── packages/              # Shared packages
│   ├── types/            # TypeScript definitions
│   ├── db/               # Database utilities
│   ├── memory/           # Memory management
│   └── mcp-client/       # MCP client
├── supabase/
│   └── schema.sql        # Database schema
├── docker-compose.yml    # Container orchestration
└── package.json          # Workspace configuration
```

## 🔑 Key Features

### Multi-Channel Support
Deploy agents to multiple channels:
- Web Chat (embedded widget)
- WhatsApp Business API
- Telegram Bot
- Slack
- Custom API endpoints

### Agent Templates
Pre-built templates for common use cases:
- Customer Service Bot
- Sales Qualifier
- Appointment Scheduler
- FAQ Assistant
- Lead Capture Bot

### Subscription Plans

| Feature | Free | Pro ($49/mo) | Business ($199/mo) |
|---------|------|--------------|-------------------|
| Agents | 1 | 5 | Unlimited |
| Messages/mo | 100 | 5,000 | 50,000 |
| Channels | Web | All | All |
| Branding | Powered by | White-label | White-label |
| Support | Community | Priority | Dedicated |

### Security Features
- JWT-based authentication
- Role-based access control (RBAC)
- Rate limiting per user tier
- Input validation & sanitization
- Security headers (Helmet, CSP, HSTS)
- Row Level Security (RLS) in Supabase

### Performance Optimizations
- **Bundle Splitting**: Webpack vendor chunks (340 kB)
- **Image Optimization**: WebP/AVIF formats
- **Caching**: Two-tier (LRU + Redis)
- **Static Generation**: 15 pages prerendered
- **Compression**: Gzip enabled

## 🛠️ API Endpoints

### Chat
```bash
POST /api/chat/:agentId
Content-Type: application/json

{
  "message": "Hello!",
  "conversationId": "optional-id"
}
```

### Agents
```bash
GET    /api/agents          # List agents
POST   /api/agents          # Create agent
GET    /api/agents/:id      # Get agent
PUT    /api/agents/:id      # Update agent
DELETE /api/agents/:id      # Delete agent
```

### Analytics
```bash
GET /api/analytics/dashboard  # Dashboard stats
```

### Webhooks
```bash
POST /api/webhooks/polar      # Polar.sh billing events
```

## 📊 Monitoring

### Health Checks
- Dashboard: `GET /api/health`
- Gateway: `GET /health`

### System Stats
```bash
GET /api/stats
```

Response:
```json
{
  "status": "online",
  "uptime": 3600,
  "activeSessions": 42,
  "memoryUsage": {
    "rss": 128,
    "heapUsed": 64
  }
}
```

## 🚢 Deployment

### Environment Variables
Required for production:
- All database credentials
- API keys (Anthropic, Polar)
- JWT secret (strong, random)
- Redis URL (optional but recommended)

### Docker Production
```bash
# Production with optimized images
docker-compose -f docker-compose.yml up -d
```

### Build Optimization
The Next.js configuration includes:
- Vendor bundle splitting
- Image optimization
- Static asset caching (1 year)
- DNS prefetch hints

## 🔧 Troubleshooting

### Build Issues
```bash
# Clean and rebuild
npm run clean
npm install
npm run build
```

### Database Connection
- Verify Supabase credentials
- Check RLS policies are enabled
- Ensure schema is applied

### Redis Cache
- **Optional**: Falls back to in-memory LRU if Redis unavailable
- No Docker required for local development - cache works out of the box
- Redis only needed for production multi-instance deployments
- Check REDIS_URL environment variable if using Redis

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

Built with ❤️ using Next.js, Express, Supabase, and Anthropic Claude
