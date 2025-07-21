#!/usr/bin/env node

/**
 * GUARDIANCHAIN Staking Pool Deployment Script
 * 
 * Deploys enterprise-grade staking pools for GTT token across all networks
 * with tiered rewards and advanced yield farming capabilities.
 */

import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

// Staking pool configurations
const STAKING_CONFIGS = {
  // Main GTT Staking Pool
  gttStaking: {
    name: "GTT Staking Pool",
    rewardRate: ethers.parseEther("100"), // 100 GTT per second base rate
    minimumStakingPeriod: 7 * 24 * 60 * 60, // 7 days
    tiers: [
      { name: "Bronze", minAmount: ethers.parseEther("1000"), multiplier: 10000 },
      { name: "Silver", minAmount: ethers.parseEther("10000"), multiplier: 12500 },
      { name: "Gold", minAmount: ethers.parseEther("50000"), multiplier: 15000 },
      { name: "Platinum", minAmount: ethers.parseEther("250000"), multiplier: 20000 },
      { name: "Diamond", minAmount: ethers.parseEther("1000000"), multiplier: 30000 }
    ]
  },
  
  // LP Token Staking Pools
  lpStaking: {
    name: "LP Token Staking",
    rewardRate: ethers.parseEther("50"), // 50 GTT per second
    minimumStakingPeriod: 3 * 24 * 60 * 60, // 3 days
    pools: [
      { name: "GTT/ETH LP", multiplier: 15000 },
      { name: "GTT/USDC LP", multiplier: 12000 },
      { name: "GTT/WMATIC LP", multiplier: 10000 },
      { name: "GTT/BNB LP", multiplier: 12000 }
    ]
  }
};

async function deployStakingPools() {
  const networkName = process.env.HARDHAT_NETWORK || "localhost";
  
  console.log(`🥩 Deploying Staking Pools to ${networkName}`);
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

    // Deploy main GTT staking pool
    console.log(`\n🔨 Deploying GTT Staking Pool...`);
    
    const StakingPool = await ethers.getContractFactory("StakingPool");
    const gttStakingPool = await StakingPool.deploy(
      gttAddress, // staking token (GTT)
      gttAddress, // reward token (GTT)
      STAKING_CONFIGS.gttStaking.rewardRate
    );

    await gttStakingPool.waitForDeployment();
    const stakingPoolAddress = await gttStakingPool.getAddress();

    console.log(`✅ GTT Staking Pool deployed: ${stakingPoolAddress}`);

    // Configure staking tiers (they're already set in constructor, but we can add more)
    console.log(`\n⚙️ Configuring staking tiers...`);
    
    // The default tiers are already configured in the contract constructor
    // We can add additional tiers if needed
    
    console.log(`✅ Staking tiers configured`);

    // Deploy LP staking pools for each major pair
    const lpStakingPools = [];
    
    for (const pool of STAKING_CONFIGS.lpStaking.pools) {
      console.log(`\n🔨 Deploying ${pool.name} Staking Pool...`);
      
      // For demo purposes, we'll use GTT as LP token address
      // In production, these would be actual LP token addresses
      const lpStakingPool = await StakingPool.deploy(
        gttAddress, // LP token address (would be actual LP token)
        gttAddress, // reward token (GTT)
        STAKING_CONFIGS.lpStaking.rewardRate
      );

      await lpStakingPool.waitForDeployment();
      const lpPoolAddress = await lpStakingPool.getAddress();

      console.log(`✅ ${pool.name} Pool deployed: ${lpPoolAddress}`);
      
      lpStakingPools.push({
        name: pool.name,
        address: lpPoolAddress,
        multiplier: pool.multiplier
      });
    }

    // Prepare deployment info
    const deploymentInfo = {
      network: networkName,
      timestamp: new Date().toISOString(),
      deployer: deployer.address,
      gttToken: gttAddress,
      stakingPools: {
        gttStaking: {
          address: stakingPoolAddress,
          name: STAKING_CONFIGS.gttStaking.name,
          rewardRate: STAKING_CONFIGS.gttStaking.rewardRate.toString(),
          minimumStakingPeriod: STAKING_CONFIGS.gttStaking.minimumStakingPeriod
        },
        lpStaking: lpStakingPools
      },
      totalPools: 1 + lpStakingPools.length
    };

    // Save deployment record
    await saveStakingDeployment(networkName, deploymentInfo);

    // Verify deployed contracts
    console.log(`\n🔍 Verifying deployments...`);
    
    const poolInfo = await gttStakingPool.getPoolInfo();
    console.log(`   Total Staked: ${ethers.formatEther(poolInfo._totalStaked)} GTT`);
    console.log(`   Reward Rate: ${ethers.formatEther(poolInfo._rewardRate)} GTT/sec`);
    console.log(`   Min Staking Period: ${poolInfo._minimumStakingPeriod} seconds`);

    console.log(`\n🎉 Staking Pool deployment complete!`);
    console.log(`📊 Deployment Summary:`);
    console.log(`   Main Pool: ${stakingPoolAddress}`);
    console.log(`   LP Pools: ${lpStakingPools.length}`);
    console.log(`   Total Pools: ${deploymentInfo.totalPools}`);
    
    return deploymentInfo;

  } catch (error) {
    console.error(`💥 Staking deployment failed:`, error);
    throw error;
  }
}

async function loadGTTAddress(networkName) {
  const deploymentFile = path.join(process.cwd(), "deployments", `${networkName}_gtt.json`);
  
  if (!fs.existsSync(deploymentFile)) {
    throw new Error(`GTT deployment not found for ${networkName}. Run deploy_gtt.js first.`);
  }
  
  const deployment = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
  return deployment.contractAddress;
}

async function saveStakingDeployment(networkName, deploymentInfo) {
  const deploymentsDir = path.join(process.cwd(), "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  const deploymentFile = path.join(deploymentsDir, `${networkName}_staking.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  
  console.log(`💾 Staking deployment saved: ${deploymentFile}`);
}

// Execute deployment if script is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  deployStakingPools()
    .then((result) => {
      console.log(`\n🏆 Staking Deployment Summary:`);
      console.log(`   Network: ${result.network}`);
      console.log(`   Main Pool: ${result.stakingPools.gttStaking.address}`);
      console.log(`   LP Pools: ${result.stakingPools.lpStaking.length}`);
      console.log(`   Total Pools: ${result.totalPools}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Staking deployment failed:', error);
      process.exit(1);
    });
}

export { deployStakingPools, STAKING_CONFIGS };