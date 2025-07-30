#!/bin/bash

echo "🚀 GUARDIANCHAIN GTT TOKEN DEPLOYMENT TO POLYGON MAINNET"
echo "=================================================="

# Check if hardhat is available
if ! command -v npx &> /dev/null; then
    echo "❌ ERROR: npm/npx not found. Please install Node.js"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "hardhat.config.cjs" ]; then
    echo "❌ ERROR: hardhat.config.cjs not found. Run from project root."
    exit 1
fi

# Check if deployment script exists
if [ ! -f "scripts/deploy-gtt-optimized.js" ]; then
    echo "❌ ERROR: Deployment script not found at scripts/deploy-gtt-optimized.js"
    exit 1
fi

# Check if GTT contract exists
if [ ! -f "contracts/GTTTokenOptimized.sol" ]; then
    echo "❌ ERROR: GTT contract not found at contracts/GTTTokenOptimized.sol"
    exit 1
fi

echo "✅ Pre-flight checks passed"
echo ""

# Compile contracts
echo "🔨 Compiling contracts..."
npx hardhat compile

if [ $? -ne 0 ]; then
    echo "❌ ERROR: Contract compilation failed"
    exit 1
fi

echo "✅ Contracts compiled successfully"
echo ""

# Deploy to Polygon mainnet
echo "🚀 Deploying GTT Token to Polygon Mainnet..."
echo "⚠️  WARNING: This will use real MATIC for gas fees"
echo "⚠️  WARNING: Make sure you have sufficient MATIC balance"
echo ""

npx hardhat run scripts/deploy-gtt-optimized.js --network polygon

if [ $? -ne 0 ]; then
    echo "❌ ERROR: Deployment failed"
    exit 1
fi

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Copy contract address from above output"
echo "2. Add liquidity on Uniswap: https://app.uniswap.org/#/pools"
echo "3. Submit to CoinGecko: https://coingecko.com/en/coins/new"
echo "4. Submit to CoinMarketCap: https://coinmarketcap.com/request-crypto"
echo "5. Announce on social media"
echo ""
echo "✅ GTT TOKEN IS NOW LIVE ON POLYGON MAINNET! 🚀"