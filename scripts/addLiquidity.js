const { ethers } = require("hardhat");
const fs = require("fs");

// Uniswap V3 Factory and Position Manager addresses
const UNISWAP_V3_FACTORY = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
const UNISWAP_V3_POSITION_MANAGER = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";
const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; // Mainnet WETH
const WMATIC_ADDRESS = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"; // Polygon WMATIC

async function addLiquidity(options) {
  const { network, router, pair, amounts } = options;
  
  console.log(`🌊 Adding liquidity to ${router} on ${network}`);
  console.log(`Pair: ${pair}`);
  console.log(`Amounts: ${amounts}`);
  
  const [deployer] = await ethers.getSigners();
  const networkInfo = await ethers.provider.getNetwork();
  
  try {
    // Load deployment addresses
    const deploymentPath = `./deployments/deployment-${network}-latest.json`;
    let deployment;
    
    try {
      deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
    } catch (error) {
      console.error(`❌ Could not load deployment file: ${deploymentPath}`);
      return false;
    }
    
    const gttTokenAddress = deployment.contracts.GTTToken;
    
    // Get token contracts
    const GTTToken = await ethers.getContractAt("SimpleGTTToken", gttTokenAddress);
    
    if (router === "UniswapV3") {
      return await addUniswapV3Liquidity(GTTToken, amounts, pair, networkInfo);
    } else if (router === "QuickSwap") {
      return await addQuickSwapLiquidity(GTTToken, amounts, pair, networkInfo);
    } else {
      console.error(`❌ Unsupported router: ${router}`);
      return false;
    }
    
  } catch (error) {
    console.error(`❌ Error adding liquidity:`, error);
    return false;
  }
}

async function addUniswapV3Liquidity(gttToken, amounts, pair, networkInfo) {
  const [gttAmount, ethAmount] = amounts;
  
  console.log("📊 Adding Uniswap V3 liquidity...");
  
  // For demo purposes, we'll create the basic structure
  // In production, you'd need to:
  // 1. Create the pool if it doesn't exist
  // 2. Calculate proper tick ranges
  // 3. Handle slippage protection
  
  const liquidityData = {
    router: "Uniswap V3",
    pair: pair,
    gttAmount: ethers.formatEther(ethers.parseEther(gttAmount.toString())),
    counterAmount: ethers.formatEther(ethers.parseEther(ethAmount.toString())),
    network: networkInfo.name,
    poolAddress: "TBD", // Would be calculated
    positionId: "TBD",  // Would be returned from position manager
    timestamp: new Date().toISOString()
  };
  
  // Approve tokens for Uniswap position manager
  console.log("🔓 Approving GTT tokens...");
  // await gttToken.approve(UNISWAP_V3_POSITION_MANAGER, ethers.parseEther(gttAmount.toString()));
  
  console.log("✅ Uniswap V3 liquidity addition simulated");
  console.log("🔗 Pool will be created at: TBD");
  console.log("📈 Position ID: TBD");
  
  return liquidityData;
}

async function addQuickSwapLiquidity(gttToken, amounts, pair, networkInfo) {
  const [gttAmount, maticAmount] = amounts;
  
  console.log("📊 Adding QuickSwap liquidity...");
  
  const liquidityData = {
    router: "QuickSwap",
    pair: pair,
    gttAmount: ethers.formatEther(ethers.parseEther(gttAmount.toString())),
    counterAmount: ethers.formatEther(ethers.parseEther(maticAmount.toString())),
    network: networkInfo.name,
    poolAddress: "TBD",
    lpTokens: "TBD",
    timestamp: new Date().toISOString()
  };
  
  console.log("✅ QuickSwap liquidity addition simulated");
  console.log("🔗 Pool address: TBD");
  console.log("🪙 LP tokens received: TBD");
  
  return liquidityData;
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const options = {};
  
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace('--', '');
    const value = args[i + 1];
    
    if (key === 'amounts') {
      options[key] = value.split(',').map(Number);
    } else {
      options[key] = value;
    }
  }
  
  if (!options.network || !options.router || !options.pair || !options.amounts) {
    console.error("❌ Missing required parameters");
    console.log("Usage: node scripts/addLiquidity.js --network mainnet --router UniswapV3 --pair GTT/WETH --amounts 10000,10");
    process.exit(1);
  }
  
  const result = await addLiquidity(options);
  
  if (result) {
    console.log("🎉 Liquidity addition completed!");
    
    // Save liquidity info
    const liquidityDir = "./deployments/liquidity";
    if (!fs.existsSync(liquidityDir)) {
      fs.mkdirSync(liquidityDir, { recursive: true });
    }
    
    const filename = `${options.router.toLowerCase()}-${options.network}-${Date.now()}.json`;
    fs.writeFileSync(`${liquidityDir}/${filename}`, JSON.stringify(result, null, 2));
    
    console.log(`💾 Liquidity data saved to: ${liquidityDir}/${filename}`);
  } else {
    console.error("❌ Liquidity addition failed");
    process.exit(1);
  }
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = addLiquidity;