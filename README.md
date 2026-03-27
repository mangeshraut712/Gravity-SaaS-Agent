<div align="center">

# ⚡ Gravity AI Agent Platform

### Multi-tenant SaaS for deploying branded AI agents across web chat, messaging channels, and custom APIs

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_+_Auth-3ECF8E)](https://supabase.com/)
[![CI/CD](https://github.com/mangeshraut712/Gravity-SaaS-Agent/actions/workflows/ci.yml/badge.svg)](https://github.com/mangeshraut712/Gravity-SaaS-Agent/actions)

[Features](#-features) • [Stack](#-stack) • [Quick Start](#-quick-start) • [Structure](#-project-structure) • [Scripts](#-scripts) • [License](#-license) • [Contact](#-contact)

</div>

---

## Table of Contents

- [About](#-about)
- [Features](#-features)
- [Stack](#-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Scripts](#-scripts)
- [License](#-license)
- [Contact](#-contact)

## About

Gravity is a production-ready agent platform with a Next.js dashboard, an Express gateway, and shared packages for types, memory, database access, and MCP integration. It is built for teams that want to ship AI agent products with multi-channel delivery, billing, analytics, and security controls.

## Features

- Agent templates, custom prompts, and skill-based workflows
- Web chat, WhatsApp, Telegram, Slack, and REST API delivery paths
- Subscription billing and usage tracking with Polar.sh support
- Real-time analytics, dashboards, and conversation monitoring
- Authentication, rate limiting, caching, and security headers
- Shared packages for typed contracts, memory, database helpers, and MCP client code

## Stack

| Area | Technologies |
| --- | --- |
| Dashboard | Next.js 15.5, React 18, TypeScript, Tailwind CSS |
| Gateway | Express, TypeScript, WebSocket, Winston, Redis |
| Data | Supabase, PostgreSQL, RLS |
| Shared Packages | `@gravity/types`, `@gravity/db`, `@gravity/memory`, `@gravity/mcp-client` |
| Tooling | npm workspaces, Docker Compose, GitHub Actions |

## Quick Start

```bash
git clone https://github.com/mangeshraut712/Gravity-SaaS-Agent.git
cd Gravity-SaaS-Agent
npm install
cp .env.example .env
npm run dev
```

Start the apps individually if needed:

```bash
npm run dev:dashboard
npm run dev:gateway
```

Open the dashboard at `http://localhost:3000` and the gateway health endpoint at `http://localhost:3003/health`.

## Project Structure

```text
Gravity-SaaS-Agent/
├── apps/dashboard/     # Next.js admin and product UI
├── apps/gateway/       # Express API, adapters, and services
├── packages/           # Shared types, memory, DB, and MCP client packages
├── supabase/           # Database schema and RLS policies
├── docs/               # Deployment and improvement notes
├── tests/               # Unit tests and setup helpers
└── docker-compose.yml  # Local orchestration
```

## Scripts

```bash
npm run dev
npm run dev:dashboard
npm run dev:gateway
npm run build
npm run test
npm run lint
npm run typecheck
npm run format
npm run docker:up
npm run docker:down
```

## License

MIT. See [LICENSE](LICENSE) for details.

## Contact

- Repository: [mangeshraut712/Gravity-SaaS-Agent](https://github.com/mangeshraut712/Gravity-SaaS-Agent)
- Docs: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- Issues: open a GitHub issue in this repository
