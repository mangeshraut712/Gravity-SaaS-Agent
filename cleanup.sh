#!/bin/bash

# Gravity AI Agent Platform - Cleanup Script
# This script performs safe cleanup of build artifacts and optimizations

echo "🧹 Starting Gravity Project Cleanup..."
echo "======================================"

# Phase 1: Build Artifacts Cleanup
echo ""
echo "📦 Phase 1: Cleaning build artifacts..."

# Clear Next.js cache
if [ -d "apps/dashboard/.next/cache" ]; then
    echo "  ✓ Removing Next.js cache..."
    rm -rf apps/dashboard/.next/cache
fi

# Remove old webpack pack files
echo "  ✓ Removing old webpack files..."
find . -name "*.pack.gz.old" -delete 2>/dev/null || true

# Remove TypeScript build info
echo "  ✓ Removing TypeScript build info..."
find . -name "*.tsbuildinfo" -delete 2>/dev/null || true

# Phase 2: Dependency Cleanup
echo ""
echo "📚 Phase 2: Cleaning dependencies..."

# Remove extraneous packages
if npm ls @emnapi/runtime &> /dev/null; then
    echo "  ✓ Removing @emnapi/runtime..."
    npm uninstall @emnapi/runtime --legacy-peer-deps 2>/dev/null || true
fi

# Clean npm cache
echo "  ✓ Cleaning npm cache..."
npm cache clean --force 2>/dev/null || true

# Phase 3: Empty Directory Cleanup
echo ""
echo "📁 Phase 3: Removing empty directories..."

# Remove empty API docs folder if it exists
if [ -d "docs/api" ] && [ -z "$(ls -A docs/api)" ]; then
    echo "  ✓ Removing empty docs/api..."
    rm -rf docs/api
fi

# Phase 4: Reorganize Tests
echo ""
echo "🧪 Phase 4: Reorganizing test files..."

# Create tests directory structure
mkdir -p tests/unit/gateway
mkdir -p tests/unit/dashboard
mkdir -p tests/integration

# Move test files
if [ -f "test/setup.ts" ]; then
    echo "  ✓ Moving test/setup.ts to tests/setup.ts..."
    mv test/setup.ts tests/setup.ts 2>/dev/null || true
    rmdir test 2>/dev/null || true
fi

if [ -f "apps/gateway/src/services/rate-limiter.test.ts" ]; then
    echo "  ✓ Moving gateway tests..."
    mv apps/gateway/src/services/*.test.ts tests/unit/gateway/ 2>/dev/null || true
fi

# Phase 5: Update .gitignore
echo ""
echo "🔒 Phase 5: Updating .gitignore..."

# Backup current .gitignore
cp .gitignore .gitignore.backup

# Size Report
echo ""
echo "📊 Size Report:"
echo "======================================"

if command -v du &> /dev/null; then
    echo "  Dashboard .next: $(du -sh apps/dashboard/.next 2>/dev/null | cut -f1 || echo 'N/A')"
    echo "  Node modules:    $(du -sh node_modules 2>/dev/null | cut -f1 || echo 'N/A')"
fi

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "Next steps:"
echo "  1. Review changes with: git status"
echo "  2. Test the application: npm run dev"
echo "  3. If everything works, commit changes"
echo ""
