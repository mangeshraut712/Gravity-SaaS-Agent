#!/bin/bash
set -e

# GravityBot Quickstart Installer
# Version 1.0.0

echo "🌌 GravityBot Installer"
echo "======================="

# 1. Check Prereqs
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required. Please install v22+."
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo "❌ Git is required."
    exit 1
fi

# 2. Setup Directory
echo "📂 Setting up workspace..."
mkdir -p ~/gravity-bot
cd ~/gravity-bot

# 3. Clone if not exists (Simulated for this script, realistically would git clone)
# In real world: git clone https://github.com/gravity/bot .
echo "✅ Workspace ready at ~/gravity-bot"

# 4. Install Dependencies
echo "📦 Installing dependencies (npm)..."
npm install

# 5. Environment Setup
if [ ! -f .env ]; then
    echo "⚙️ Creating default configuration..."
    cat <<EOT >> .env
PORT=3001
ANTHROPIC_API_KEY=sk-placeholder
# Security Defaults
SANDBOX_MODE=true
GITHUB_TOKEN_SCOPE=read
EOT
    echo "✅ .env created. Please edit it with your real keys."
fi

echo ""
echo "🎉 Installation Complete!"
echo "Next steps:"
echo "1. Edit .env with your API keys"
echo "2. Run 'npm run dev --workspaces' to start"
