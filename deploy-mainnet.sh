#!/bin/bash

# StackMart Mainnet Deployment Script

set -e

echo "🚀 StackMart Mainnet Deployment"
echo "================================"

# Check if mnemonic is configured
if grep -q "<YOUR_MAINNET_MNEMONIC_HERE>" settings/Mainnet.toml; then
    echo "❌ Error: Please configure your mainnet mnemonic in settings/Mainnet.toml"
    exit 1
fi

# Verify contracts
echo "✓ Checking contracts..."
clarinet check

# Generate deployment plan
echo "✓ Generating deployment plan..."
clarinet deployments generate --mainnet

# Show deployment plan
echo ""
echo "📋 Deployment Plan:"
cat deployments/default.mainnet-plan.yaml

echo ""
read -p "Deploy to mainnet? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Deployment cancelled"
    exit 0
fi

# Deploy
echo "🚀 Deploying to mainnet..."
clarinet deployments apply -p deployments/default.mainnet-plan.yaml --mainnet

echo ""
echo "✅ Deployment complete!"
echo "Check transactions at: https://explorer.hiro.so/"
