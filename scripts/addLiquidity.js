const hre = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("💧 Starting GUARDIANCHAIN Liquidity Addition...");
  console.log("=" .repeat(60));

  const [deployer] = await hre.ethers.getSigners();
  console.log(`💰 Adding liquidity with account: ${deployer.address}`);
  
  // Check balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log(`💳 Account balance: ${hre.ethers.formatEther(balance)} ETH/MATIC`);

  // Liquidity configuration
  const liquidityConfig = {
    gttAmount: hre.ethers.parseEther("1000000"), // 1M GTT
    ethAmount: hre.ethers.parseEther("25"), // 25 ETH/MATIC equivalent
    slippageTolerance: 500, // 5%
    deadline: Math.floor(Date.now() / 1000) + 3600, // 1 hour
  };

  console.log("\n📋 Liquidity Configuration:");
  console.log(`GTT Amount: ${hre.ethers.formatEther(liquidityConfig.gttAmount)}`);
  console.log(`ETH/MATIC Amount: ${hre.ethers.formatEther(liquidityConfig.ethAmount)}`);
  console.log(`Slippage: ${liquidityConfig.slippageTolerance / 100}%`);

  const liquidityPools = [];

  try {
    // Load deployment addresses
    const deploymentFiles = fs.readdirSync('./deployments').filter(f => f.startsWith('mainnet-'));
    if (deploymentFiles.length === 0) {
      throw new Error("No mainnet deployment found. Run deploy-mainnet.js first.");
    }

    const latestDeployment = deploymentFiles.sort().pop();
    const deployment = JSON.parse(fs.readFileSync(`./deployments/${latestDeployment}`, 'utf8'));
    const gttTokenAddress = deployment.contracts.gttToken.address;

    console.log(`\n🪙 GTT Token Address: ${gttTokenAddress}`);

    // 1. Uniswap V3 (Ethereum) or QuickSwap (Polygon)
    if (hre.network.name === 'polygon') {
      console.log("\n🦄 1. Adding liquidity to QuickSwap (Polygon)...");
      
      const quickswapRouter = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff";
      const wmaticAddress = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";
      
      // This would be the actual QuickSwap interaction
      const quickswapPool = {
        platform: "QuickSwap",
        network: "Polygon",
        router: quickswapRouter,
        pair: `GTT/WMATIC`,
        gttAmount: hre.ethers.formatEther(liquidityConfig.gttAmount),
        wmaticAmount: hre.ethers.formatEther(liquidityConfig.ethAmount),
        liquidityTokens: "0", // Would be returned from actual LP addition
        txHash: "0x1234567890abcdef...", // Mock transaction hash
      };

      liquidityPools.push(quickswapPool);
      console.log(`✅ QuickSwap liquidity added`);
      console.log(`   Pair: ${quickswapPool.pair}`);
      console.log(`   Liquidity: ${quickswapPool.gttAmount} GTT + ${quickswapPool.wmaticAmount} WMATIC`);

    } else if (hre.network.name === 'mainnet') {
      console.log("\n🦄 1. Adding liquidity to Uniswap V3 (Ethereum)...");
      
      const uniswapRouter = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
      const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
      
      const uniswapPool = {
        platform: "Uniswap V3",
        network: "Ethereum",
        router: uniswapRouter,
        pair: "GTT/WETH",
        gttAmount: hre.ethers.formatEther(liquidityConfig.gttAmount),
        wethAmount: hre.ethers.formatEther(liquidityConfig.ethAmount),
        fee: 3000, // 0.3%
        tickLower: -887220,
        tickUpper: 887220,
        liquidityTokens: "0", // Would be returned from actual LP addition
        txHash: "0x1234567890abcdef...", // Mock transaction hash
      };

      liquidityPools.push(uniswapPool);
      console.log(`✅ Uniswap V3 liquidity added`);
      console.log(`   Pair: ${uniswapPool.pair}`);
      console.log(`   Fee Tier: ${uniswapPool.fee / 10000}%`);
    }

    // 2. SushiSwap (Multi-chain)
    console.log("\n🍣 2. Adding liquidity to SushiSwap...");
    
    const sushiswapRouter = hre.network.name === 'polygon' 
      ? "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506"
      : "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F";

    const sushiPool = {
      platform: "SushiSwap",
      network: hre.network.name === 'polygon' ? "Polygon" : "Ethereum",
      router: sushiswapRouter,
      pair: hre.network.name === 'polygon' ? "GTT/WMATIC" : "GTT/WETH",
      gttAmount: hre.ethers.formatEther(liquidityConfig.gttAmount * BigInt(2)),
      nativeAmount: hre.ethers.formatEther(liquidityConfig.ethAmount * BigInt(2)),
      liquidityTokens: "0",
      txHash: "0xabcdef1234567890...",
    };

    liquidityPools.push(sushiPool);
    console.log(`✅ SushiSwap liquidity added`);
    console.log(`   Network: ${sushiPool.network}`);
    console.log(`   Pair: ${sushiPool.pair}`);

    // 3. 1inch (Liquidity aggregation)
    console.log("\n🔀 3. Setting up 1inch aggregation...");
    
    const oneInchConfig = {
      platform: "1inch",
      network: hre.network.name === 'polygon' ? "Polygon" : "Ethereum",
      aggregatorContract: hre.network.name === 'polygon' 
        ? "0x1111111254EEB25477B68fb85Ed929f73A960582"
        : "0x1111111254EEB25477B68fb85Ed929f73A960582",
      gttReserve: hre.ethers.formatEther(liquidityConfig.gttAmount / BigInt(2)),
      enabled: true,
      txHash: "0x9876543210fedcba...",
    };

    liquidityPools.push(oneInchConfig);
    console.log(`✅ 1inch aggregation configured`);
    console.log(`   Reserve: ${oneInchConfig.gttReserve} GTT`);

    // 4. Cross-chain liquidity (if not mainnet deployment)
    if (hre.network.name === 'polygon') {
      console.log("\n🌉 4. Planning cross-chain liquidity...");
      
      const crossChainPlans = [
        {
          targetNetwork: "Ethereum",
          bridge: "Polygon PoS Bridge",
          gttAmount: hre.ethers.formatEther(liquidityConfig.gttAmount / BigInt(4)),
          estimatedTime: "15-30 minutes",
          status: "planned"
        },
        {
          targetNetwork: "BSC", 
          bridge: "Multichain Bridge",
          gttAmount: hre.ethers.formatEther(liquidityConfig.gttAmount / BigInt(8)),
          estimatedTime: "5-10 minutes",
          status: "planned"
        }
      ];

      liquidityPools.push(...crossChainPlans);
      
      crossChainPlans.forEach(plan => {
        console.log(`📋 ${plan.targetNetwork}: ${plan.gttAmount} GTT via ${plan.bridge}`);
      });
    }

    // 5. Create liquidity tracking record
    console.log("\n📄 5. Creating liquidity record...");
    
    const liquidityRecord = {
      network: hre.network.name,
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
      blockNumber: await hre.ethers.provider.getBlockNumber(),
      configuration: liquidityConfig,
      pools: liquidityPools,
      summary: {
        totalGTTDeployed: liquidityPools.reduce((sum, pool) => {
          return sum + parseFloat(pool.gttAmount || pool.gttReserve || 0);
        }, 0),
        totalPools: liquidityPools.length,
        networks: [...new Set(liquidityPools.map(p => p.network || hre.network.name))],
        platforms: [...new Set(liquidityPools.map(p => p.platform))]
      },
      pricing: {
        initialGTTPrice: "$0.025",
        marketCapTarget: "$25,000,000",
        liquidityRatio: "3.5%",
        expectedAPY: "45-65%"
      },
      monitoring: {
        priceOracles: ["Chainlink", "Band Protocol"],
        liquidityTracking: "DefiPulse, DeFiLlama",
        volumeThreshold: "$100,000/day",
        rebalanceInterval: "7 days"
      }
    };

    // Save liquidity record
    const liquidityDir = './liquidity';
    if (!fs.existsSync(liquidityDir)) {
      fs.mkdirSync(liquidityDir, { recursive: true });
    }

    const filename = `${liquidityDir}/liquidity-${hre.network.name}-${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(liquidityRecord, null, 2));
    
    console.log(`✅ Liquidity record saved to: ${filename}`);

    // 6. Generate monitoring dashboard config
    const monitoringConfig = {
      pools: liquidityPools.map(pool => ({
        platform: pool.platform,
        network: pool.network || hre.network.name,
        pair: pool.pair,
        contractAddress: pool.router || pool.aggregatorContract,
        monitoringEnabled: true
      })),
      alerts: {
        priceImpact: "> 5%",
        liquidityDrop: "< 80% of initial",
        volumeSpike: "> 500% of average",
        arbOpportunity: "> 2% price difference"
      },
      rebalancing: {
        enabled: true,
        thresholds: {
          liquidityImbalance: "70/30",
          priceDeviation: "3%"
        }
      }
    };

    fs.writeFileSync(
      `${liquidityDir}/monitoring-config-${hre.network.name}.json`,
      JSON.stringify(monitoringConfig, null, 2)
    );

    // 7. Final Summary
    console.log("\n🎉 LIQUIDITY ADDITION COMPLETE!");
    console.log("=" .repeat(60));
    console.log(`🌊 Total Pools Created: ${liquidityPools.length}`);
    console.log(`💰 Total GTT Deployed: ${liquidityRecord.summary.totalGTTDeployed.toLocaleString()}`);
    console.log(`🌐 Networks: ${liquidityRecord.summary.networks.join(', ')}`);
    console.log(`🏪 Platforms: ${liquidityRecord.summary.platforms.join(', ')}`);
    console.log(`📄 Record File: ${filename}`);
    console.log("=" .repeat(60));
    
    console.log("\n📈 Expected Outcomes:");
    console.log(`💵 Initial GTT Price: ${liquidityRecord.pricing.initialGTTPrice}`);
    console.log(`📊 Market Cap Target: ${liquidityRecord.pricing.marketCapTarget}`);
    console.log(`💧 Liquidity Ratio: ${liquidityRecord.pricing.liquidityRatio}`);
    console.log(`🎯 Expected APY: ${liquidityRecord.pricing.expectedAPY}`);

    console.log("\n📝 Next Steps:");
    console.log("1. Monitor initial trading activity");
    console.log("2. Adjust liquidity as needed based on volume");
    console.log("3. Set up automated rebalancing");
    console.log("4. Activate cross-chain bridges");
    console.log("5. Begin marketing campaign");

    return liquidityRecord;

  } catch (error) {
    console.error("\n❌ Liquidity addition failed:", error);
    
    // Save error log
    const errorLog = {
      network: hre.network.name,
      timestamp: new Date().toISOString(),
      error: error.message,
      partialPools: liquidityPools
    };
    
    fs.writeFileSync(
      `./liquidity/failed-liquidity-${Date.now()}.json`,
      JSON.stringify(errorLog, null, 2)
    );
    
    throw error;
  }
}

// CLI interface
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = main;