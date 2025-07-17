# GuardianChain Smart Contract Deployment Guide

## Prerequisites

1. **Wallet Setup**
   - Install MetaMask browser extension
   - Create or import a wallet
   - Save your private key securely

2. **Testnet Tokens**
   - Get free MATIC tokens from [Polygon Faucet](https://faucet.polygon.technology/)
   - Switch to Polygon Mumbai or Amoy testnet in MetaMask

3. **RPC Provider**
   - Create free account at [Alchemy](https://alchemy.com) or [Infura](https://infura.io)
   - Get Polygon testnet RPC URL

## Environment Setup

Add these secrets to your Replit project:

```bash
POLYGON_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your_wallet_private_key_here
```

## Deployment Steps

### 1. Deploy to Mumbai Testnet

```bash
# Compile contracts
npx hardhat compile

# Deploy to Mumbai testnet
npx hardhat run scripts/deploy-mumbai.cjs --network mumbai
```

### 2. Verify Deployment

After successful deployment, you'll see:
- GTT Token contract address
- TruthVault contract address  
- Updated `constants.ts` with new addresses
- Block explorer links for verification

### 3. Test on Frontend

1. Switch MetaMask to Mumbai testnet
2. Visit `/web3-demo` or `/smart-contract-demo`
3. Connect your wallet
4. Test contract functions:
   - Register capsule
   - Update yield
   - Claim GTT tokens
   - Verify capsule

## Contract Functions

### GTTToken.sol
- `mint(address to, uint256 amount)` - Mint tokens (vault only)
- `burn(uint256 amount)` - Burn tokens
- `setVault(address vault)` - Set minting vault
- `pause()` / `unpause()` - Emergency controls

### TruthVault.sol
- `registerCapsule(uint256 id, address creator, string ipfsHash)` - Register new capsule
- `verifyCapsule(uint256 id, bool verified, bool sealed)` - Verify capsule
- `updateTruthYield(uint256 id, uint256 yield)` - Update yield amount
- `claimYield(uint256 id, uint256 amount)` - Claim GTT tokens
- `calculateGTTAmount(uint256 yield)` - Calculate GTT conversion

## Network Configuration

### Mumbai Testnet (Chain ID: 80001)
- RPC URL: `https://rpc-mumbai.maticvigil.com`
- Explorer: https://mumbai.polygonscan.com
- Faucet: https://faucet.polygon.technology

### Polygon Amoy (Chain ID: 80002) 
- RPC URL: `https://rpc-amoy.polygon.technology`
- Explorer: https://amoy.polygonscan.com
- Faucet: https://faucet.polygon.technology

## Troubleshooting

### Common Issues

1. **"insufficient funds"**
   - Get testnet MATIC from faucet
   - Check wallet balance

2. **"network mismatch"**
   - Verify RPC URL in hardhat.config.cjs
   - Check MetaMask network settings

3. **"transaction failed"**
   - Increase gas limit in hardhat config
   - Check contract permissions

### Gas Optimization

```javascript
// Recommended gas settings for Mumbai
mumbai: {
  gasPrice: 8000000000, // 8 gwei
  gas: 2100000,
  timeout: 60000
}
```

## Security Notes

- Never commit private keys to git
- Use environment variables for sensitive data
- Test thoroughly on testnet before mainnet
- Implement proper access controls
- Consider using multisig wallets for admin functions

## Next Steps

After successful testnet deployment:
1. Test all contract functions
2. Verify contracts on block explorer
3. Document any issues or improvements
4. Prepare for mainnet deployment
5. Set up monitoring and alerts

## Support

For deployment issues:
- Check contract events in block explorer
- Review transaction logs
- Test with minimal gas amounts first
- Verify contract ABI matches deployed version