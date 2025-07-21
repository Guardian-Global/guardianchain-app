# 🔐 EXACT WALLET FUNDING REQUIREMENTS FOR GTT MAINNET LAUNCH

## 📍 WHERE THE MONEY NEEDS TO BE

### The Deployer Wallet Address
Your deployer wallet is configured in your environment variables as `PRIVATE_KEY`. 

**To find your deployer address:**
```bash
# Run this command to see your deployer address
npx hardhat console --network polygon
> const [deployer] = await ethers.getSigners()
> console.log("Deployer address:", deployer.address)
```

---

## 💰 WHAT TOKENS/COINS YOU NEED

### Option 1: POLYGON MAINNET (RECOMMENDED - CHEAPER)
**Token Needed**: MATIC (Polygon's native token)
**Amount Required**: 50+ MATIC (~$30-50 USD)
**Network**: Polygon Mainnet (Chain ID: 137)

**Where to buy MATIC:**
- Binance, Coinbase, KuCoin, Gate.io
- Uniswap (swap ETH → MATIC)
- Polygon Bridge (bridge ETH to MATIC)

### Option 2: ETHEREUM MAINNET (PREMIUM OPTION)
**Token Needed**: ETH (Ethereum)
**Amount Required**: 0.1+ ETH (~$200-400 USD)
**Network**: Ethereum Mainnet (Chain ID: 1)

**Where to buy ETH:**
- Any major exchange (Binance, Coinbase, etc.)

---

## 🔧 HOW TO SET UP YOUR DEPLOYER WALLET

### Step 1: Create/Import Wallet in MetaMask
1. Open MetaMask
2. Either create new wallet OR import existing wallet using seed phrase
3. **COPY THE PRIVATE KEY** (Account Details → Export Private Key)

### Step 2: Add Private Key to Environment
1. Open your `.env` file in this project
2. Add: `PRIVATE_KEY=your_private_key_here`
3. Save the file

### Step 3: Fund the Wallet
**For Polygon (Recommended):**
1. Switch MetaMask to Polygon Mainnet
2. Send 50+ MATIC to your wallet address
3. Verify the balance shows in MetaMask

**For Ethereum:**
1. Ensure MetaMask is on Ethereum Mainnet
2. Send 0.1+ ETH to your wallet address
3. Verify the balance shows in MetaMask

---

## 🎯 EXACT FUNDING BREAKDOWN

### Polygon Mainnet Costs:
- **GTT Token Contract**: ~2 MATIC
- **Truth Vault Contract**: ~3 MATIC  
- **Guardian Pass NFT**: ~2 MATIC
- **Capsule Factory**: ~1.5 MATIC
- **Truth DAO**: ~1 MATIC
- **Fee Manager**: ~1 MATIC
- **Configuration Transactions**: ~2 MATIC
- **Safety Buffer**: ~40 MATIC
- **TOTAL**: 50+ MATIC

### Ethereum Mainnet Costs:
- **All Contracts**: ~0.05 ETH
- **Safety Buffer**: ~0.05 ETH
- **TOTAL**: 0.1+ ETH

---

## ✅ VERIFICATION CHECKLIST

Before launching, verify:

### 1. Check Your Deployer Address
```bash
npx hardhat console --network polygon
> const [deployer] = await ethers.getSigners()
> console.log("Address:", deployer.address)
> console.log("Balance:", await ethers.provider.getBalance(deployer.address))
```

### 2. Verify Network Configuration
```bash
# Check your hardhat config shows the right networks
cat hardhat.config.cjs | grep -A 5 polygon
```

### 3. Test Connection
```bash
# Test connection to Polygon
npx hardhat run --network polygon scripts/check-connection.js
```

---

## 🚀 LAUNCH COMMANDS (Once Funded)

```bash
# 1. Deploy all contracts (5-10 minutes)
npx hardhat run scripts/deploy-mainnet.js --network polygon

# 2. Verify deployment successful
ls deployments/mainnet-polygon-*.json

# 3. Add initial liquidity (10-15 minutes)
node scripts/addLiquidity.js

# 4. Submit launchpad applications (5 minutes)
node scripts/applyLaunchpad.js

# 5. Apply to exchanges (5 minutes)
node scripts/applyCEX.js
```

---

## 🔒 SECURITY NOTES

### Keep Your Private Key Safe:
- Never share your private key
- Store backup in secure location
- Consider using hardware wallet for large amounts

### After Launch:
- Transfer admin rights to multi-sig wallet
- Set up proper access controls
- Monitor all contract interactions

---

## 🆘 TROUBLESHOOTING

### "Insufficient Balance" Error:
- Check you're on the right network (Polygon vs Ethereum)
- Verify MATIC/ETH actually arrived in your wallet
- Wait 5-10 minutes for blockchain confirmation

### "Invalid Private Key" Error:
- Ensure private key starts with "0x"
- Remove any extra spaces or characters
- Verify you copied the full private key

### Network Connection Issues:
- Check your internet connection
- Verify RPC endpoints in hardhat config
- Try different RPC provider if needed

---

## 📞 IMMEDIATE SUPPORT

If you need help:
1. Share your deployer address (NOT private key)
2. Share which network you're using
3. Share your current balance
4. Share any error messages

**Ready to fund and launch? The deployer wallet address is what you need to send MATIC/ETH to.**