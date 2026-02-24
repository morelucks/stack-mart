#!/bin/bash
# Pre-deployment checklist script

echo "🔍 StackMart Pre-Deployment Checklist"
echo "======================================"

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found"
    exit 1
fi
echo "✅ .env file exists"

# Check if private key is set
if ! grep -q "PRIVATE_KEY=" .env; then
    echo "❌ PRIVATE_KEY not set in .env"
    exit 1
fi
echo "✅ PRIVATE_KEY configured"

# Check if network is set
if ! grep -q "STACKS_NETWORK=" .env; then
    echo "❌ STACKS_NETWORK not set in .env"
    exit 1
fi
echo "✅ STACKS_NETWORK configured"

# Verify contract syntax
echo "🔍 Checking contract syntax..."
if ! clarinet check > /dev/null 2>&1; then
    echo "❌ Contract has syntax errors"
    clarinet check
    exit 1
fi
echo "✅ Contract syntax valid"

# Check if dependencies are installed
if [ ! -d node_modules/@stacks/transactions ]; then
    echo "❌ Dependencies not installed"
    exit 1
fi
echo "✅ Dependencies installed"

# Verify .env is gitignored
if git check-ignore .env > /dev/null 2>&1; then
    echo "✅ .env is properly gitignored"
else
    echo "⚠️  WARNING: .env is not gitignored!"
fi

echo ""
echo "✅ All checks passed! Ready to deploy."
echo ""
echo "Run: node deploy.js"
