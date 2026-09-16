# AGENTS.md — Gravity SaaS Agent

Guidance for coding agents working in this monorepo.

## Layout (npm workspaces)

- `apps/gateway` — Express API gateway: channel adapters (web, WhatsApp, Telegram, API), rate limiter,
  circuit breaker, skills engine, MCP client, caching.
- `apps/dashboard` — Next.js 15.5 operator dashboard.
- `packages/db`, `packages/mcp-client`, `packages/memory`, `packages/types` — shared libraries.
- `supabase/` — schema and Row Level Security policies.

## Setup and verification

```bash
npm install
npm run dev                # gateway + dashboard concurrently
npm run validate           # typecheck + lint + test (also runs on pre-push)
npm run test:ci            # coverage
npm run docker:up          # full stack via docker-compose
```

## Hard rules

1. **Tenant isolation is enforced in the database.** Every new table needs an RLS policy in
   `supabase/`; never rely on application-level filtering alone.
2. **Keep the guardrails on the model path:** tier-based rate limits (Free 10 / Pro 100 / Business
   1000 req/min), the circuit breaker, and the OpenRouter multi-model fallback. A feature that bypasses
   them is a bug.
3. **Treat `billing_events` and analytics events as append-only** (they are event logs); add new rows
   rather than mutating history, and add a policy in `supabase/schema.sql` if you need to enforce it.
4. Secrets come from environment variables only. No keys in code, fixtures, or docs.
5. Run `npm run validate` before proposing a change; workspaces must typecheck independently.

## Where to look first

- `README.md` → Architecture section for the request path (channel adapter → gateway → skills/MCP → model).
- `SECURITY.md` for disclosure and hardening notes.
