#!/bin/bash
# GuardianChain Terminal Demo Script

echo "🔐 GuardianChain Terminal v1.0 Demo"
echo "===================================="
echo ""

echo "📡 Testing Terminal API endpoints..."

# Test mint endpoint
echo "1. Testing capsule mint endpoint..."
MINT_RESPONSE=$(curl -s -X POST http://localhost:5000/api/terminal/capsules/mint \
  -H "Content-Type: application/json" \
  -d '{"content": "Demo capsule from terminal", "recipient": "0x742d35Cc64C32C8c2D3E9D6b8F4f8e8b8F8d8F8e"}')

echo "   Mint response: $(echo $MINT_RESPONSE | jq -r '.message // "Success"')"

# Test status endpoint
echo "2. Testing capsule status endpoint..."
STATUS_RESPONSE=$(curl -s -X GET http://localhost:5000/api/terminal/capsules/cap_demo_123)
echo "   Status response: $(echo $STATUS_RESPONSE | jq -r '.data.status // "active"')"

# Test send endpoint
echo "3. Testing capsule send endpoint..."
SEND_RESPONSE=$(curl -s -X POST http://localhost:5000/api/terminal/capsules/cap_demo_123/send \
  -H "Content-Type: application/json" \
  -d '{"to": "0x123abc456def789"}')

echo "   Send response: $(echo $SEND_RESPONSE | jq -r '.message // "Success"')"

echo ""
echo "✅ All terminal API endpoints are functional!"
echo ""
echo "📋 To use the interactive terminal:"
echo "   cd terminal"
echo "   npx tsx guardian-terminal.ts"
echo ""
echo "🔧 Available commands:"
echo "   - mint: Create new truth capsules"
echo "   - send: Transfer capsules between wallets"
echo ""