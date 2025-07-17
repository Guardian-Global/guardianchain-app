# GuardianChain Smart Contract Deployment Guide

## Overview

GuardianChain uses three main smart contracts:
1. **GTTToken** - ERC-20 token for governance and rewards
2. **TruthVault** - Permanent capsule sealing system
3. **CapsuleFactory** - On-chain capsule creation

## Prerequisites

### 1. Get Testnet Funds
- **Sepolia Testnet**: Get ETH from [Sepolia Faucet](https://sepoliafaucet.com/)
- **Polygon Amoy**: Get MATIC from [Polygon Faucet](https://faucet.polygon.technology/)

### 2. Set Environment Variables
```bash
# Your wallet private key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# RPC endpoint (use your own Alchemy/Infura key)
POLYGON_RPC_URL=https://polygon-amoy.g.alchemy.com/v2/your-key
```

## Deployment Steps

### 1. Compile Contracts
```bash
npx hardhat compile
```

### 2. Deploy to Testnet
```bash
# Deploy to Sepolia
npx hardhat run scripts/deploy.cjs --network sepolia

# Or deploy to Polygon Amoy
npx hardhat run scripts/deploy.cjs --network polygonAmoy
```

### 3. Update Contract Addresses
After successful deployment, update `client/src/lib/contracts.ts` with the new addresses:

```typescript
// Example deployment output:
// GTTToken deployed to: 0x1234...
// TruthVault deployed to: 0x5678...
// CapsuleFactory deployed to: 0x9ABC...

export const CONTRACTS: Record<string, ContractAddresses> = {
  sepolia: {
    chainId: 11155111,
    gtt: "0x1234...",      // Replace with actual address
    vault: "0x5678...",    // Replace with actual address
    factory: "0x9ABC..."   // Replace with actual address
  }
};
```

## Verification (Optional)

### 1. Verify on Etherscan/Polygonscan
```bash
# For Sepolia
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>

# For Polygon Amoy
npx hardhat verify --network polygonAmoy <CONTRACT_ADDRESS>
```

## Testing Contract Integration

1. Navigate to `/contract-demo` in the app
2. Connect your wallet to the correct network
3. Test the following functions:
   - **GTT Token**: Mint tokens to wallet addresses
   - **Truth Vault**: Seal capsules with metadata hashes
   - **Factory**: Create new capsules (coming soon)

## Network Configurations

### Sepolia Testnet
- **Chain ID**: 11155111
- **RPC**: https://eth-sepolia.g.alchemy.com/v2/your-key
- **Explorer**: https://sepolia.etherscan.io
- **Faucet**: https://sepoliafaucet.com/

### Polygon Amoy Testnet
- **Chain ID**: 80002
- **RPC**: https://rpc-amoy.polygon.technology
- **Explorer**: https://amoy.polygonscan.com
- **Faucet**: https://faucet.polygon.technology/

## Troubleshooting

### Insufficient Funds Error
- Ensure your wallet has enough testnet ETH/MATIC
- Gas costs are typically 0.001-0.01 ETH per deployment

### Network Not Supported
- Check that your wallet is connected to the correct network
- Verify `chainId` matches the network configuration

### Contract Already Deployed
- Update the contract addresses in `contracts.ts`
- Clear browser cache and reload the app

## Production Deployment

**⚠️ Warning**: Current contracts are for testing only. For production:

1. Add proper access controls
2. Implement upgrade patterns
3. Add comprehensive tests
4. Conduct security audits
5. Use multi-signature wallets

## Smart Contract Architecture

### GTTToken.sol
- Standard ERC-20 token with owner-controlled minting
- Used for governance voting and reward distribution
- Owner can mint tokens to any address

### TruthVault.sol
- Permanent sealing system for capsules
- Stores metadata hashes on-chain
- Emits events for tracking

### CapsuleFactory.sol
- On-chain capsule creation and management
- Tracks creator addresses and content hashes
- Sealing functionality integrated

## Integration with Frontend

The `/contract-demo` page provides:
- Real-time contract interaction
- Transaction status monitoring
- Network and wallet status
- Direct Web3 integration testing

All contract interactions use wagmi hooks for type-safe Web3 operations.