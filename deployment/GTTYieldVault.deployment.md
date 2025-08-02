# GTT Yield Vault Smart Contract Deployment Guide

## Contract Overview
The GTTYieldVault.sol contract provides production-ready infrastructure for automated GTT token distribution based on grief tiers in the GuardianChain ecosystem.

## Contract Features
- **Admin-controlled yield distribution**: Only authorized administrators can distribute GTT tokens
- **Grief tier validation**: Supports tiers 1-5 with 10 GTT per tier distribution
- **ERC-20 integration**: Compatible with standard GTT token contracts
- **Event emissions**: Tracks all yield distributions with YieldDistributed events
- **Gas optimization**: Efficient contract design for cost-effective transactions

## Deployment Steps

### 1. Deploy GTT Token Contract
```solidity
// Deploy your ERC-20 GTT token contract first
// Example: GTTToken.sol with standard ERC-20 implementation
```

### 2. Deploy GTT Yield Vault
```solidity
// Constructor parameters:
// _GTTToken: Address of the deployed GTT token contract
constructor(address _GTTToken)
```

### 3. Configure Environment Variables
```bash
# Add to .env file
GTT_YIELD_VAULT_ADDRESS=0x... # Address of deployed yield vault
GTT_TOKEN_ADDRESS=0x...       # Address of deployed GTT token
ETH_PRIVATE_KEY=0x...         # Private key of admin wallet
POLYGON_RPC_URL=https://polygon-rpc.com
```

### 4. Fund the Vault
Transfer GTT tokens to the vault contract address to enable yield distribution.

## Contract Functions

### distributeYield(address author, uint256 griefTier)
- **Access**: Admin only
- **Parameters**:
  - `author`: Recipient wallet address
  - `griefTier`: Grief tier (1-5)
- **Yield Amount**: griefTier * 10 GTT
- **Events**: Emits YieldDistributed event

### updateAdmin(address newAdmin)
- **Access**: Current admin only
- **Purpose**: Transfer admin privileges to new address

## Integration with GuardianChain

### API Endpoints
- `POST /api/gtt/vault/distribute`: Distribute yield via smart contract
- `GET /api/gtt/vault/info`: Get contract information and status
- `POST /api/gtt/vault/update-admin`: Update contract administrator

### Usage Example
```javascript
// Distribute 30 GTT to author for grief tier 3
const response = await fetch('/api/gtt/vault/distribute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    authorAddress: '0x1234567890123456789012345678901234567890',
    griefTier: 3
  })
});
```

## Security Considerations
- Admin private key must be securely stored
- Vault contract must have sufficient GTT token balance
- Regular monitoring of distribution events recommended
- Consider multi-sig admin setup for production

## Development vs Production
- **Development**: Contract simulation with mock transaction hashes
- **Production**: Real blockchain transactions with actual GTT transfers

## Monitoring
Monitor YieldDistributed events for:
- Distribution amounts and recipients
- Gas usage optimization
- Admin activity tracking
- Vault balance management