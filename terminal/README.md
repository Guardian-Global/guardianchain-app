# GuardianChain Terminal

Command-line interface for GuardianChain capsule operations.

## Setup

1. Install dependencies:
```bash
npm install readline dotenv node-fetch @types/node
```

2. Configure environment variables:
```bash
# .env
GUARDIAN_API_KEY=your_api_key_here
API_BASE_URL=http://localhost:5000/api
```

3. Run the terminal:
```bash
npx tsx terminal/guardian-terminal.ts
```

## Features

### Mint Capsule
- Create new truth capsules with content verification
- Set recipient wallet addresses
- Automatic IPFS storage and blockchain minting
- GTT reward calculation

### Send Capsule
- Transfer existing capsules between wallets
- Gas-optimized transactions on Base Network
- Real-time transaction tracking

## Usage Examples

```bash
# Start terminal
npx tsx terminal/guardian-terminal.ts

# Choose action: mint
# Enter content: "This is a truth capsule containing important evidence"
# Enter recipient: 0x742d35Cc64C32C8c2D3E9D6b8F4f8e8b8F8d8F8e

# Choose action: send
# Enter Capsule ID: cap_1234567890
# Enter recipient: 0x123...abc
```

## API Integration

The terminal integrates with the main GuardianChain API:
- `/api/capsules/mint` - Create new capsules
- `/api/capsules/{id}/send` - Transfer capsules
- `/api/capsules/{id}` - Get capsule status
- `/api/capsules/user/{address}` - List user capsules

## Security

- Uses Bearer token authentication
- All transactions are signed and verified
- Content is encrypted before IPFS storage
- Supports hardware wallet integration

## Development

The terminal is built with:
- TypeScript for type safety
- node-fetch for API calls
- readline for interactive CLI
- dotenv for environment management