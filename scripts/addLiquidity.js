#!/usr/bin/env node

/**
 * GUARDIANCHAIN Automated Liquidity Addition Script
 * 
 * Adds initial liquidity to major DEX platforms across all networks
 * with optimized parameters for maximum trading efficiency.
 */

import { ethers } from "hardhat";
import yargs from "yargs";
import fs from "fs";
import path from "path";

// DEX Router addresses for each network
const DEX_ROUTERS = {
  mainnet: {
    uniswapv2: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    uniswapv3: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    sushiswap: "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F"
  },
  polygon: {
    quickswap: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
    sushiswap: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
    uniswapv3: "0xE592427A0AEce92De3Edee1F18E0157C05861564"
  },
  bsc: {
    pancakeswap: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
    biswap: "0x3a6d8cA21D1CF76F653A67577FA0D27453350dD8"
  },
  // Testnets
  sepolia: {
    uniswapv2: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
  },
  mumbai: {
    quickswap: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff"
  },
  bscTestnet: {
    pancakeswap: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1"
  }
};

// Liquidity provision parameters
const LIQUIDITY_CONFIGS = {
  mainnet: {
    gttAmount: ethers.parseEther("50000"), // 50,000 GTT
    ethAmount: ethers.parseEther("25"), // 25 ETH (~$62,500 at $2500/ETH)
    usdcAmount: ethers.parseUnits("62500", 6) // 62,500 USDC
  },
  polygon: {
    gttAmount: ethers.parseEther("100000"), // 100,000 GTT
    maticAmount: ethers.parseEther("75000"), // 75,000 MATIC (~$60,000 at $0.8/MATIC)
    usdcAmount: ethers.parseUnits("60000", 6) // 60,000 USDC
  },
  bsc: {
    gttAmount: ethers.parseEther("75000"), // 75,000 GTT
    bnbAmount: ethers.parseEther("200"), // 200 BNB (~$60,000 at $300/BNB)
    busdAmount: ethers.parseUnits("60000", 18) // 60,000 BUSD
  },
  // Reduced amounts for testnets
  testnet: {
    gttAmount: ethers.parseEther("1000"), // 1,000 GTT
    ethAmount: ethers.parseEther("0.5"), // 0.5 ETH
    usdcAmount: ethers.parseUnits("1000", 6) // 1,000 USDC
  }
};

async function addLiquidity() {
  const argv = yargs(process.argv.slice(2))
    .option('network', {
      describe: 'Network to add liquidity to',
      type: 'string',
      default: process.env.HARDHAT_NETWORK || 'localhost'
    })
    .option('router', {
      describe: 'DEX router to use',
      type: 'string',
      default: 'uniswap'
    })
    .option('pair', {
      describe: 'Trading pair (e.g., GTT/ETH)',
      type: 'string',
      default: 'GTT/ETH'
    })
    .option('amounts', {
      describe: 'Liquidity amounts (comma-separated)',
      type: 'string',
      default: '1000,0.5'
    })
    .argv;

  const networkName = argv.network;
  console.log(`💧 Adding Liquidity to ${networkName.toUpperCase()}`);
  console.log(`=========================================`);

  try {
    // Get deployer account
    const [deployer] = await ethers.getSigners();
    const deployerBalance = await ethers.provider.getBalance(deployer.address);
    
    console.log(`👤 Deployer: ${deployer.address}`);
    console.log(`💰 Balance: ${ethers.formatEther(deployerBalance)} ETH`);

    // Load GTT token address
    const gttAddress = await loadGTTAddress(networkName);
    console.log(`🪙 GTT Token: ${gttAddress}`);

    // Get router address
    const routerAddress = getRouterAddress(networkName, argv.router);
    console.log(`🔄 Router: ${routerAddress} (${argv.router})`);

    // Parse trading pair and amounts
    const [tokenA, tokenB] = argv.pair.split('/');
    const [amountA, amountB] = argv.amounts.split(',');
    
    console.log(`📊 Adding liquidity: ${amountA} ${tokenA} + ${amountB} ${tokenB}`);

    // Get token contracts
    const gttToken = await ethers.getContractAt("IERC20", gttAddress);
    const routerContract = await ethers.getContractAt("IUniswapV2Router02", routerAddress);

    // Parse amounts based on token decimals
    const gttAmount = ethers.parseEther(amountA);
    const otherAmount = tokenB === 'ETH' ? 
      ethers.parseEther(amountB) : 
      ethers.parseUnits(amountB, getTokenDecimals(tokenB));

    console.log(`💰 GTT Amount: ${ethers.formatEther(gttAmount)} GTT`);
    console.log(`💰 ${tokenB} Amount: ${tokenB === 'ETH' ? ethers.formatEther(otherAmount) : amountB} ${tokenB}`);

    // Check GTT balance
    const gttBalance = await gttToken.balanceOf(deployer.address);
    console.log(`🏦 GTT Balance: ${ethers.formatEther(gttBalance)} GTT`);
    
    if (gttBalance < gttAmount) {
      throw new Error(`Insufficient GTT balance. Need ${ethers.formatEther(gttAmount)}, have ${ethers.formatEther(gttBalance)}`);
    }

    // Approve GTT for router
    console.log(`✅ Approving GTT for router...`);
    const approveTx = await gttToken.approve(routerAddress, gttAmount);
    await approveTx.wait();
    console.log(`✅ GTT approved: ${approveTx.hash}`);

    // Add liquidity
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes

    let liquidityTx;
    
    if (tokenB === 'ETH') {
      // Add GTT/ETH liquidity
      console.log(`🌊 Adding GTT/ETH liquidity...`);
      liquidityTx = await routerContract.addLiquidityETH(
        gttAddress,
        gttAmount,
        0, // min GTT
        0, // min ETH
        deployer.address,
        deadline,
        { value: otherAmount }
      );
    } else {
      // Add GTT/Token liquidity
      const tokenBAddress = getTokenAddress(networkName, tokenB);
      const tokenBContract = await ethers.getContractAt("IERC20", tokenBAddress);
      
      // Approve token B
      console.log(`✅ Approving ${tokenB} for router...`);
      const approveTokenB = await tokenBContract.approve(routerAddress, otherAmount);
      await approveTokenB.wait();
      
      console.log(`🌊 Adding GTT/${tokenB} liquidity...`);
      liquidityTx = await routerContract.addLiquidity(
        gttAddress,
        tokenBAddress,
        gttAmount,
        otherAmount,
        0, // min GTT
        0, // min tokenB
        deployer.address,
        deadline
      );
    }

    console.log(`⏳ Waiting for liquidity transaction...`);
    const receipt = await liquidityTx.wait();
    
    console.log(`✅ Liquidity added successfully!`);
    console.log(`   Transaction: ${receipt.hash}`);
    console.log(`   Block: ${receipt.blockNumber}`);
    console.log(`   Gas Used: ${receipt.gasUsed.toString()}`);

    // Get pool information
    const factoryAddress = await routerContract.factory();
    const factory = await ethers.getContractAt("IUniswapV2Factory", factoryAddress);
    
    const tokenBAddress = tokenB === 'ETH' ? 
      await routerContract.WETH() : 
      getTokenAddress(networkName, tokenB);
    
    const pairAddress = await factory.getPair(gttAddress, tokenBAddress);
    console.log(`🏊 Pool Address: ${pairAddress}`);

    // Get pool reserves
    const pair = await ethers.getContractAt("IUniswapV2Pair", pairAddress);
    const reserves = await pair.getReserves();
    
    console.log(`📊 Pool Reserves:`);
    console.log(`   Reserve0: ${ethers.formatEther(reserves.reserve0)}`);
    console.log(`   Reserve1: ${ethers.formatEther(reserves.reserve1)}`);

    // Save liquidity record
    const liquidityInfo = {
      network: networkName,
      dex: argv.router,
      pair: argv.pair,
      router: routerAddress,
      pairAddress: pairAddress,
      amounts: {
        gtt: ethers.formatEther(gttAmount),
        [tokenB.toLowerCase()]: tokenB === 'ETH' ? ethers.formatEther(otherAmount) : amountB
      },
      transaction: {
        hash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      },
      timestamp: new Date().toISOString()
    };

    await saveLiquidityRecord(networkName, liquidityInfo);
    
    console.log(`\n🎉 Liquidity addition complete!`);
    console.log(`📈 Pool is now live for trading`);
    
    return liquidityInfo;

  } catch (error) {
    console.error(`💥 Liquidity addition failed:`, error);
    throw error;
  }
}

function getRouterAddress(network, routerName) {
  const routers = DEX_ROUTERS[network];
  if (!routers) {
    throw new Error(`No routers configured for network: ${network}`);
  }
  
  const routerAddress = routers[routerName.toLowerCase()];
  if (!routerAddress) {
    const availableRouters = Object.keys(routers).join(', ');
    throw new Error(`Router ${routerName} not found for ${network}. Available: ${availableRouters}`);
  }
  
  return routerAddress;
}

function getTokenAddress(network, tokenSymbol) {
  // Common token addresses - in production, these would be from a config file
  const tokens = {
    mainnet: {
      USDC: "0xA0b86a33E6441A4bBaB206A6A91E7bb68a1dd2C9",
      USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    },
    polygon: {
      USDC: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      WMATIC: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"
    },
    bsc: {
      BUSD: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      USDT: "0x55d398326f99059fF775485246999027B3197955",
      WBNB: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
    }
  };
  
  return tokens[network]?.[tokenSymbol] || "0x0000000000000000000000000000000000000000";
}

function getTokenDecimals(tokenSymbol) {
  const decimals = {
    USDC: 6,
    USDT: 6,
    BUSD: 18,
    WETH: 18,
    WMATIC: 18,
    WBNB: 18
  };
  
  return decimals[tokenSymbol] || 18;
}

async function loadGTTAddress(networkName) {
  const deploymentFile = path.join(process.cwd(), "deployments", `${networkName}_gtt.json`);
  
  if (!fs.existsSync(deploymentFile)) {
    throw new Error(`GTT deployment not found for ${networkName}. Run deploy_gtt.js first.`);
  }
  
  const deployment = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
  return deployment.contractAddress;
}

async function saveLiquidityRecord(networkName, liquidityInfo) {
  const liquidityDir = path.join(process.cwd(), "deployments", "liquidity");
  if (!fs.existsSync(liquidityDir)) {
    fs.mkdirSync(liquidityDir, { recursive: true });
  }
  
  const liquidityFile = path.join(liquidityDir, `${networkName}_${liquidityInfo.dex}_${liquidityInfo.pair.replace('/', '_')}.json`);
  fs.writeFileSync(liquidityFile, JSON.stringify(liquidityInfo, null, 2));
  
  console.log(`💾 Liquidity record saved: ${liquidityFile}`);
}

// Execute if script is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  addLiquidity()
    .then((result) => {
      console.log(`\n🏆 Liquidity Summary:`);
      console.log(`   Network: ${result.network}`);
      console.log(`   DEX: ${result.dex}`);
      console.log(`   Pair: ${result.pair}`);
      console.log(`   Pool: ${result.pairAddress}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Liquidity addition failed:', error);
      process.exit(1);
    });
}

export { addLiquidity, LIQUIDITY_CONFIGS, DEX_ROUTERS };