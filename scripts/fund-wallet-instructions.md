# GTT Token Deployment - Wallet Funding Instructions

## URGENT: DEPLOYMENT READY - NEEDS 0.02 MATIC

**Deployer Wallet**: `0x8c7C0A644Cc4C72EBD55b24b43c1290e90fF0a73`  
**Required Amount**: 0.02 MATIC (~$0.02 USD)  
**Current Balance**: 0.0 MATIC  

## FASTEST FUNDING OPTIONS

### Option 1: Direct MATIC Transfer (RECOMMENDED)
1. **From Another Wallet**: Send 0.1 MATIC directly to deployer wallet
2. **Time**: 1-2 minutes
3. **Cost**: ~$0.10 USD (includes buffer for multiple deployments)

### Option 2: Polygon Bridge
1. **Go to**: https://wallet.polygon.technology/bridge
2. **Bridge**: ETH/USDC from Ethereum to Polygon
3. **Swap**: Convert to MATIC on Polygon
4. **Time**: 10-20 minutes

### Option 3: CEX Purchase & Withdrawal
1. **Buy MATIC** on Coinbase/Binance/KuCoin
2. **Withdraw** to deployer wallet address
3. **Time**: 5-30 minutes (depends on exchange)

## DEPLOYMENT EXECUTION

Once wallet is funded, deployment takes 2 minutes:

```bash
# 1. Verify funding
npx hardhat run scripts/check-deployment-wallet.cjs --network polygon

# 2. Deploy GTT token
npx hardhat run scripts/deploy-simple.cjs --network polygon

# 3. Update frontend (automatic address detection)
# Frontend will automatically detect new contract address
```

## POST-DEPLOYMENT TASKS

1. **Contract Verification**: Submit to PolygonScan
2. **Liquidity Pool**: Create initial DEX liquidity  
3. **Token Listings**: Submit to CoinGecko/CoinMarketCap
4. **Marketing Launch**: Announce mainnet deployment

## WALLET SECURITY

- **Private Key**: Already configured in environment
- **Network**: Polygon Mainnet (Chain ID: 137)
- **RPC**: https://polygon-rpc.com (tested and working)
- **Gas Price**: 25 gwei (optimized for speed)

## CONTACT INFO

Need help with funding? The deployer wallet address is the only requirement:

**Address**: `0x8c7C0A644Cc4C72EBD55b24b43c1290e90fF0a73`

---

**Status**: Platform 100% ready for GTT mainnet launch upon wallet funding