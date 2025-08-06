# GuardianChain Mainnet Deployment Guide

## 🚀 Complete Token & DAO Infrastructure Deployment

This guide covers the deployment of GTT and TruthVault tokens, along with the complete VeritasDAO governance system to Polygon and Base mainnets.

## 📋 Smart Contracts Overview

| Contract | Purpose | Network Support |
|----------|---------|----------------|
| `GTTToken.sol` | Main utility token (2.5B supply) | Polygon + Base |
| `TruthVault.sol` | Staking & rewards vault | Polygon + Base |
| `VeritasDAO.sol` | Governance & voting system | Polygon + Base |
| `VeritasRegistryDAO.sol` | GTT-gated attestation registry | Polygon + Base |
| `CapsuleFactory.sol` | NFT minting with Veritas integration | Polygon + Base |

## 🛠️ Pre-Deployment Setup

### 1. Environment Configuration

Create a `.env` file with your deployment credentials:

```bash
# Required: Deployer wallet private key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Required: RPC endpoints
POLYGON_RPC_URL=https://polygon-rpc.com
BASE_RPC_URL=https://mainnet.base.org

# Optional: For contract verification
POLYGONSCAN_API_KEY=your_polygonscan_api_key
BASESCAN_API_KEY=your_basescan_api_key
```

### 2. Funding Requirements

**Polygon Mainnet:**
- Minimum: 0.1 MATIC (~$0.08)
- Recommended: 0.2 MATIC for safety

**Base Mainnet:**
- Minimum: 0.01 ETH (~$33)
- Recommended: 0.02 ETH for safety

### 3. Pre-Deployment Checklist

- [ ] Deployer wallet has sufficient native tokens
- [ ] Private key is correct and secure
- [ ] RPC endpoints are working
- [ ] All contracts compile successfully

## 🚀 Deployment Commands

### Deploy to Polygon Mainnet

```bash
npx hardhat run scripts/deploy-complete-mainnet.js --network polygon
```

### Deploy to Base Mainnet

```bash
npx hardhat run scripts/deploy-complete-mainnet.js --network base
```

## 📊 What Gets Deployed

Each deployment creates:

1. **GTTToken** - ERC20 token with 2.5B total supply
2. **TruthVault** - Staking contract with 1% daily rewards
3. **VeritasDAO** - Governance system with 7-day voting periods
4. **VeritasRegistryDAO** - GTT-gated attestation system
5. **CapsuleFactory** - NFT factory with Veritas integration

## ⚙️ Post-Deployment Configuration

The deployment script automatically:

- ✅ Transfers 10M GTT to TruthVault for rewards
- ✅ Adds CapsuleFactory as GTT minter
- ✅ Sets minimum attestation requirements (1000 GTT)
- ✅ Sets attestation fee (100 GTT)
- ✅ Saves deployment addresses to JSON files

## 📄 Deployment Outputs

After successful deployment, you'll get:

### 1. Contract Addresses File
```
deployments/polygon-mainnet-deployment.json
deployments/base-mainnet-deployment.json
```

### 2. Environment Variables File
```
deployments/polygon-env-vars.txt
deployments/base-env-vars.txt
```

### 3. Console Output
- Contract addresses for verification
- Transaction hashes for tracking
- Explorer links for immediate viewing

## 🔧 Frontend Integration

Add the generated environment variables to your `.env`:

```bash
# Polygon Mainnet
NEXT_PUBLIC_GTT_ADDRESS_POLYGON=0x...
NEXT_PUBLIC_TRUTH_VAULT_ADDRESS_POLYGON=0x...
NEXT_PUBLIC_VERITAS_DAO_ADDRESS_POLYGON=0x...
NEXT_PUBLIC_VERITAS_REGISTRY_ADDRESS_POLYGON=0x...
NEXT_PUBLIC_CAPSULE_FACTORY_ADDRESS_POLYGON=0x...

# Base Mainnet
NEXT_PUBLIC_GTT_ADDRESS_BASE=0x...
NEXT_PUBLIC_TRUTH_VAULT_ADDRESS_BASE=0x...
NEXT_PUBLIC_VERITAS_DAO_ADDRESS_BASE=0x...
NEXT_PUBLIC_VERITAS_REGISTRY_ADDRESS_BASE=0x...
NEXT_PUBLIC_CAPSULE_FACTORY_ADDRESS_BASE=0x...
```

## 🔍 Contract Verification

The deployment outputs include verification links for:

**Polygon:** https://polygonscan.com/address/[CONTRACT_ADDRESS]
**Base:** https://basescan.org/address/[CONTRACT_ADDRESS]

To verify programmatically:

```bash
# Polygon
npx hardhat verify --network polygon [CONTRACT_ADDRESS] [CONSTRUCTOR_ARGS]

# Base
npx hardhat verify --network base [CONTRACT_ADDRESS] [CONSTRUCTOR_ARGS]
```

## 🏛️ DAO Governance Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| Voting Period | 7 days | Time for proposal voting |
| Execution Delay | 1 day | Delay before execution |
| Proposal Threshold | 100K GTT | Minimum to create proposal |
| Quorum Threshold | 1M GTT | Minimum votes for validity |
| Attestation Fee | 100 GTT | Cost to attest Veritas hash |
| Min Attestation GTT | 1000 GTT | Minimum balance to attest |

## 🛡️ Security Features

- **Ownable Contracts:** All admin functions protected
- **ReentrancyGuard:** Protection against reentrancy attacks
- **GTT Balance Checks:** All actions require appropriate GTT holdings
- **Time Locks:** Governance includes execution delays
- **Immutable Token Address:** DAO contracts reference GTT permanently

## 🔄 Frontend Features Ready

After deployment, these features are immediately available:

- ✅ `/veritas/vote` - DAO governance interface
- ✅ `/mint/[id]` - NFT minting with Veritas hashing
- ✅ `/admin` - Admin panel with attestation tools
- ✅ Staking interface for TruthVault
- ✅ Real-time voting power display
- ✅ Proposal creation and voting

## 🚨 Important Notes

1. **Private Keys:** Never commit private keys to version control
2. **Gas Estimation:** Actual costs may vary with network congestion
3. **Contract Upgrades:** Deployed contracts are immutable by design
4. **Testing:** Consider deploying to testnets first for validation
5. **Backup:** Save all deployment artifacts safely

## 📞 Support

For deployment issues:
1. Check the console output for specific error messages
2. Verify wallet balance and network connectivity
3. Ensure RPC endpoints are responding correctly
4. Confirm contract compilation succeeds locally

## 🎉 Post-Launch Checklist

- [ ] All contracts deployed successfully
- [ ] Environment variables updated
- [ ] Frontend displays correct contract addresses
- [ ] Test basic functionality (voting, staking, attestation)
- [ ] Verify contracts on block explorers
- [ ] Update documentation with live addresses
- [ ] Announce deployment to community

---

**Ready for Production:** This deployment creates a complete, production-ready Web3 infrastructure for GuardianChain's decentralized governance and attestation systems.