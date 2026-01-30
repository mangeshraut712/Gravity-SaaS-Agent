# Deployment Guide

This guide covers various deployment options for the Gravity AI Agent Platform.

## Table of Contents

- [Quick Deploy Options](#quick-deploy-options)
- [Environment Setup](#environment-setup)
- [Deploy to Vercel](#deploy-to-vercel)
- [Deploy to Railway](#deploy-to-railway)
- [Deploy with Docker](#deploy-with-docker)
- [Deploy to AWS](#deploy-to-aws)
- [Database Setup](#database-setup)
- [Post-Deployment](#post-deployment)

## Quick Deploy Options

### Vercel (Recommended for Dashboard)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/Gravity-SaaS-Agent)

### Railway (Recommended for Gateway)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=YOUR_TEMPLATE_ID)

## Environment Setup

### Required Environment Variables

```bash
# Database
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Provider
ANTHROPIC_API_KEY=

# Authentication
JWT_SECRET=

# Billing
POLAR_PRO_PRODUCT_ID=
POLAR_BUSINESS_PRODUCT_ID=

# Application URLs
APP_URL=https://your-domain.com
GATEWAY_URL=https://api.your-domain.com
```

See `.env.example` for all available options.

## Deploy to Vercel

### Dashboard Deployment

1. **Connect GitHub Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Import Project"
   - Select your GitHub repository

2. **Configure Build Settings**
   ```bash
   Framework Preset: Next.js
   Root Directory: apps/dashboard
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all required variables from `.env.example`

4. **Deploy**
   - Click "Deploy"
   - Your dashboard will be live at `https://your-project.vercel.app`

### Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Enable HTTPS (automatic)

## Deploy to Railway

### Gateway Deployment

1. **Create New Project**
   - Go to [Railway](https://railway.app)
   - Click "New Project"
   - Choose "Deploy from GitHub repo"

2. **Configure Service**
   ```bash
   Root Directory: apps/gateway
   Build Command: npm run build -w @gravity/gateway
   Start Command: npm run start -w @gravity/gateway
   ```

3. **Add Environment Variables**
   - Click on service → Variables
   - Add all required variables

4. **Add Redis (Optional)**
   - Click "New" → "Database" → "Redis"
   - Copy the Redis URL to your environment variables

5. **Deploy**
   - Railway will automatically deploy on push to main

## Deploy with Docker

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+

### Single Server Deployment

1. **Clone and Configure**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Gravity-SaaS-Agent.git
   cd Gravity-SaaS-Agent
   cp .env.example .env
   # Edit .env with your values
   ```

2. **Build and Run**
   ```bash
   docker-compose up -d
   ```

3. **Access Services**
   - Dashboard: `http://localhost:3000`
   - Gateway: `http://localhost:3003`

### Production Docker Setup

1. **Use Production Compose File**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

2. **Enable SSL**
   - Use nginx-proxy or Traefik
   - Configure Let's Encrypt for automatic SSL

3. **Monitoring**
   ```bash
   docker-compose logs -f
   docker stats
   ```

## Deploy to AWS

### Architecture

```
┌─────────────────────────────────────────┐
│  CloudFront (CDN)                       │
└───────────┬─────────────────────────────┘
            │
┌───────────▼─────────────────────────────┐
│  S3 (Static Assets)                     │
└─────────────────────────────────────────┘
            
┌─────────────────────────────────────────┐
│  ECS Fargate (Dashboard)                │
└───────────┬─────────────────────────────┘
            │
┌───────────▼─────────────────────────────┐
│  Application Load Balancer              │
└───────────┬─────────────────────────────┘
            │
┌───────────▼─────────────────────────────┐
│  ECS Fargate (Gateway)                  │
└───────────┬─────────────────────────────┘
            │
┌───────────▼─────────────────────────────┐
│  ElastiCache Redis                      │
└─────────────────────────────────────────┘
```

### Steps

1. **Create ECR Repositories**
   ```bash
   aws ecr create-repository --repository-name gravity-dashboard
   aws ecr create-repository --repository-name gravity-gateway
   ```

2. **Build and Push Images**
   ```bash
   # Login to ECR
   aws ecr get-login-password --region us-east-1 | \
     docker login --username AWS --password-stdin YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com

   # Build and push dashboard
   docker build -t gravity-dashboard apps/dashboard
   docker tag gravity-dashboard:latest YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/gravity-dashboard:latest
   docker push YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/gravity-dashboard:latest

   # Build and push gateway
   docker build -t gravity-gateway apps/gateway
   docker tag gravity-gateway:latest YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/gravity-gateway:latest
   docker push YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/gravity-gateway:latest
   ```

3. **Create ECS Cluster**
   ```bash
   aws ecs create-cluster --cluster-name gravity-cluster
   ```

4. **Create Task Definitions**
   - Use the provided `task-definition.json` templates
   - Update with your ECR image URIs
   - Add environment variables

5. **Create Services**
   ```bash
   aws ecs create-service \
     --cluster gravity-cluster \
     --service-name dashboard \
     --task-definition gravity-dashboard \
     --desired-count 2 \
     --launch-type FARGATE
   ```

6. **Configure Load Balancer**
   - Create Application Load Balancer
   - Add target groups for dashboard and gateway
   - Configure health checks

## Database Setup

### Supabase Setup

1. **Create Project**
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Click "New Project"
   - Choose your organization and region

2. **Run Schema**
   - Go to SQL Editor
   - Copy contents of `supabase/schema.sql`
   - Execute the script

3. **Enable RLS**
   - Go to Authentication → Policies
   - Enable Row Level Security on all tables
   - Policies are included in schema.sql

4. **Get Credentials**
   - Go to Project Settings → API
   - Copy `URL` and `anon/public` key
   - Copy `service_role` key (keep secret!)

### Backup Strategy

```bash
# Automated daily backups (Supabase Pro)
# Or use pg_dump for custom backup schedule
```

## Post-Deployment

### Verify Deployment

1. **Health Checks**
   ```bash
   curl https://your-domain.com/health
   curl https://api.your-domain.com/health
   ```

2. **Test Authentication**
   - Visit your dashboard
   - Sign up for a new account
   - Verify email delivery

3. **Test Agent Creation**
   - Create a test agent
   - Send test messages
   - Check analytics

### Configure DNS

```bash
# A Records
your-domain.com         → Vercel IP or ALB
api.your-domain.com     → Railway IP or ALB

# CNAME Records
www.your-domain.com     → your-domain.com
```

### SSL/TLS

- Vercel: Automatic SSL
- Railway: Automatic SSL
- AWS: Use ACM certificates
- Docker: Use Let's Encrypt

### Monitoring

1. **Application Monitoring**
   - Set up Sentry for error tracking
   - Configure Plausible for analytics

2. **Infrastructure Monitoring**
   - CloudWatch (AWS)
   - Vercel Analytics
   - Railway Metrics

3. **Alerts**
   - Set up alerts for:
     - High error rates
     - Slow response times
     - High resource usage
     - Failed deployments

### Performance Optimization

1. **CDN Configuration**
   - Enable CloudFront for static assets
   - Configure cache headers
   - Enable compression

2. **Database Optimization**
   - Enable connection pooling
   - Add indexes for frequent queries
   - Monitor slow queries

3. **Caching Strategy**
   - Redis for session storage
   - Application-level caching
   - CDN caching for static content

### Security Checklist

- [ ] Enable HTTPS everywhere
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Rotate secrets regularly
- [ ] Set up firewall rules
- [ ] Enable DDoS protection
- [ ] Configure backup strategy

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and rebuild
   npm run clean
   npm install
   npm run build
   ```

2. **Database Connection**
   - Verify Supabase credentials
   - Check network connectivity
   - Ensure RLS policies are correct

3. **Environment Variables**
   - Verify all required vars are set
   - Check for typos
   - Ensure no trailing spaces

### Getting Help

- GitHub Issues: [github.com/YOUR_USERNAME/Gravity-SaaS-Agent/issues](https://github.com/YOUR_USERNAME/Gravity-SaaS-Agent/issues)
- Discord Community: [your-discord-link]
- Email Support: support@gravity.ai

---

Need help with deployment? [Open an issue](https://github.com/YOUR_USERNAME/Gravity-SaaS-Agent/issues/new) or reach out to our team!
