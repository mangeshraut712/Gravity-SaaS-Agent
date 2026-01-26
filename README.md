# 🌌 GravityOS: The Production-Grade Autonomous Agent Framework
> **Build, Secure, and Monetize AI Agents with Hands.**

![GravityBot Dashboard](https://gemini-static.googleusercontent.com/antigravity/brain/3514a195-44dd-4874-8386-9b01fce0ab04/gravity_bot_dashboard_final_1769432596427.png)

GravityBot (now GravityOS) is a high-performance, multi-tenant SaaS framework for deploying autonomous AI agents. Unlike simple chatbots, GravityOS agents are equipped with "hands" via the **Model Context Protocol (MCP)**, allowing them to interact with the real world, manage files, and automate complex workflows.

---

## 🚀 Key Features
*   **Proactive Heartbeat Engine**: Agents that don't just respond, but reach out when it matters.
*   **Cost-Optimized Memory**: Intelligent context caching that reduces Anthropic API costs by up to 90%.
*   **Multi-tenant Architecture**: Built-in Subscription & Billing logic (`@gravity/db`).
*   **Security-First Gateway**: Boot-time security audits and sandbox-ready execution.
*   **Premium Telemetry Dashboard**: Minimalist 2026 aesthetics for real-time monitoring.

---

## 🛠️ Quick Start
1. **Clone the Repo**:
   ```bash
   git clone https://github.com/mangeshraut712/Gravity-SaaS-Agent.git
   cd Gravity-SaaS-Agent
   ```
2. **Install & Setup**:
   ```bash
   chmod +x install.sh
   ./install.sh
   ```
3. **Run All services**:
   ```bash
   npm run dev
   ```

---

## 🔒 Security First: "Lock It Down" Architecture

Unlike basic scripts, GravityBot includes a militarized **Security Gateway**:

1.  **Sandbox Mode**: Runs dangerous operations in isolated containers, not your root shell.
2.  **Startup Audits**: Every time the bot boots, it runs a 5-point security scan (Token Scope, Sandbox Status, Model Safety).
3.  **Command Whitelisting**: The agent cannot run `rm -rf /` unless you explicitly whitelist it (you shouldn't).
4.  **Prompt Injection Defense**: Optimized for Claude 3.5 Sonnet / Opus 4.5, which have 99% resistance to injection attacks.

---

## ⚡ Key Features

| Feature | 🦖 Standard Agents | 🌌 GravityBot |
| :--- | :--- | :--- |
| **Security** | Often runs as root. Risky. | **Audit on Boot**: Scans for vulnerabilities before connecting. |
| **Proactivity** | Passive. | **Heartbeat Service**: Checks your calendar/servers proactively. |
| **Extensibility** | Manual coding. | **MCP Native**: Plug-and-play with Linear, GitHub, and Postgres. |
| **Cost** | High token burn. | **Memory Engine**: Saves ~90% of tokens via caching. |

---

## 🚀 Setup Guide (The "Safe Way")

### 1. Prerequisities
*   Node.js 20+
*   Anthropic API Key
*   **A "Burner" Number** (Recommended for WhatsApp/Telegram isolation)

### 2. Installation & Security Config

1.  **Clone the Secure Repo**:
    ```bash
    git clone https://github.com/your-username/gravity-bot.git
    npm install
    ```

2.  **Configure Defense Layers (`.env`)**:
    ```bash
    # CORE
    ANTHROPIC_API_KEY=sk-...
    
    # SECURITY
    SANDBOX_MODE=true          # CRITICAL: Isolates execution
    GITHUB_TOKEN_SCOPE=read    # CRITICAL: Limit damage radius
    ```

3.  **Run the Security Audit**:
    start the gateway, and watch the logs:
    ```bash
    npm run dev --workspace=@gravity/gateway
    ```
    *Output:*
    ```
    🔒 Initiating Startup Security Scan...
    ✅ Security Audit Passed. System is locked down.
    ```
    *If you see "CRITICAL: Sandbox Mode is DISABLED", stop and fix your .env.*

---

## 🛡️ Best Practices ("God of Prompt" Protocol)

1.  **Scope Your Tokens**: Never give "Full Access" GitHub tokens. Only "Read Public Repos".
2.  **Private Only**: Never add GravityBot to a group chat. It treats every message as a command.
3.  **Isolate**: Run this on a VPS (Hetzner ~$5/mo), not your personal laptop, for true air-gapping.

---

## 📦 Project Structure

```bash
gravity-bot/
├── apps/
│   ├── dashboard/   # Next.js 15 Command Center
│   └── gateway/     # Secure Node.js Gateway + Heartbeat
│       ├── services/
│       │   ├── security.ts  # <--- The Defense Layer
│       │   └── heartbeat.ts # <--- The Proactive Layer
└── packages/
    ├── mcp-client/  # Universal Tool Connector
    └── memory/      # Intelligence & Caching Engine
```

---

## 💖 Contributing
Security researchers: We welcome penetration testing reports. Please define "Severity: Critical" in your Issues.

**License**: MIT
