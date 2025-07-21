#!/usr/bin/env node

/**
 * GUARDIANCHAIN GTT Token Deployment Script
 * 
 * Deploys the Guardian Truth Token (GTT) to specified networks
 * with comprehensive configuration and verification.
 */

import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

// GTT Token configuration
const GTT_CONFIG = {
  name: "Guardian Truth Token",
  symbol: "GTT", 
  totalSupply: ethers.parseEther("1000000000"), // 1 billion GTT
  decimals: 18,
  
  // Initial distribution
  distribution: {
    treasury: ethers.parseEther("400000000"), // 40% - 400M GTT
    ecosystem: ethers.parseEther("250000000"), // 25% - 250M GTT
    team: ethers.parseEther("150000000"),     // 15% - 150M GTT
    liquidity: ethers.parseEther("150000000"), // 15% - 150M GTT
    advisors: ethers.parseEther("50000000")   // 5% - 50M GTT
  },
  
  // Network-specific gas configurations
  gasConfig: {
    mainnet: { gasPrice: ethers.parseUnits("20", "gwei"), gasLimit: 3000000 },
    polygon: { gasPrice: ethers.parseUnits("30", "gwei"), gasLimit: 3000000 },
    bsc: { gasPrice: ethers.parseUnits("5", "gwei"), gasLimit: 3000000 },
    sepolia: { gasPrice: ethers.parseUnits("20", "gwei"), gasLimit: 3000000 },
    mumbai: { gasPrice: ethers.parseUnits("20", "gwei"), gasLimit: 3000000 },
    bscTestnet: { gasPrice: ethers.parseUnits("10", "gwei"), gasLimit: 3000000 }
  }
};

async function deployGTT() {
  const networkName = process.env.HARDHAT_NETWORK || "localhost";
  
  console.log(`🪙 Deploying GTT Token to ${networkName.toUpperCase()}`);
  console.log(`============================================`);

  try {
    // Get network info
    const network = await ethers.provider.getNetwork();
    console.log(`🌐 Network: ${network.name} (Chain ID: ${network.chainId})`);

    // Get deployer account
    const [deployer] = await ethers.getSigners();
    const deployerBalance = await ethers.provider.getBalance(deployer.address);
    
    console.log(`👤 Deployer: ${deployer.address}`);
    console.log(`💰 Balance: ${ethers.formatEther(deployerBalance)} ETH`);
    
    // Check minimum balance requirement
    const minBalance = ethers.parseEther("0.1");
    if (deployerBalance < minBalance) {
      throw new Error(`Insufficient balance. Need at least 0.1 ETH, have ${ethers.formatEther(deployerBalance)} ETH`);
    }

    // Get gas configuration for network
    const gasConfig = GTT_CONFIG.gasConfig[networkName] || GTT_CONFIG.gasConfig.mainnet;
    console.log(`⛽ Gas Price: ${ethers.formatUnits(gasConfig.gasPrice, "gwei")} gwei`);
    console.log(`⛽ Gas Limit: ${gasConfig.gasLimit.toLocaleString()}`);

    // Deploy GTT Token contract
    console.log(`\n🔨 Deploying GTT Token...`);
    
    const GTTToken = await ethers.getContractFactory("GTTToken");
    const gttToken = await GTTToken.deploy(
      GTT_CONFIG.name,
      GTT_CONFIG.symbol,
      GTT_CONFIG.totalSupply,
      {
        gasPrice: gasConfig.gasPrice,
        gasLimit: gasConfig.gasLimit
      }
    );

    console.log(`⏳ Waiting for deployment transaction...`);
    await gttToken.waitForDeployment();
    
    const gttAddress = await gttToken.getAddress();
    console.log(`✅ GTT Token deployed: ${gttAddress}`);

    // Verify deployment
    console.log(`\n🔍 Verifying deployment...`);
    
    const tokenName = await gttToken.name();
    const tokenSymbol = await gttToken.symbol();
    const tokenDecimals = await gttToken.decimals();
    const tokenSupply = await gttToken.totalSupply();
    const ownerBalance = await gttToken.balanceOf(deployer.address);
    
    console.log(`   Name: ${tokenName}`);
    console.log(`   Symbol: ${tokenSymbol}`);
    console.log(`   Decimals: ${tokenDecimals}`);
    console.log(`   Total Supply: ${ethers.formatEther(tokenSupply)} GTT`);
    console.log(`   Owner Balance: ${ethers.formatEther(ownerBalance)} GTT`);

    // Verify supply allocation
    if (tokenSupply.toString() !== GTT_CONFIG.totalSupply.toString()) {
      throw new Error(`Supply mismatch! Expected ${ethers.formatEther(GTT_CONFIG.totalSupply)}, got ${ethers.formatEther(tokenSupply)}`);
    }

    if (ownerBalance.toString() !== GTT_CONFIG.totalSupply.toString()) {
      throw new Error(`Owner balance mismatch! Expected ${ethers.formatEther(GTT_CONFIG.totalSupply)}, got ${ethers.formatEther(ownerBalance)}`);
    }

    console.log(`✅ All verifications passed!`);

    // Setup initial distribution (optional)
    if (process.env.SETUP_DISTRIBUTION === "true") {
      console.log(`\n💰 Setting up initial distribution...`);
      await setupInitialDistribution(gttToken, deployer);
    }

    // Prepare deployment info
    const deploymentInfo = {
      network: networkName,
      chainId: Number(network.chainId),
      contractAddress: gttAddress,
      deployerAddress: deployer.address,
      deploymentTimestamp: new Date().toISOString(),
      blockNumber: await ethers.provider.getBlockNumber(),
      gasUsed: "Estimated 2,500,000",
      
      // Token details
      tokenDetails: {
        name: tokenName,
        symbol: tokenSymbol,
        decimals: Number(tokenDecimals),
        totalSupply: ethers.formatEther(tokenSupply),
        ownerBalance: ethers.formatEther(ownerBalance)
      },
      
      // Network-specific explorer URL
      explorerUrl: getExplorerUrl(networkName, gttAddress),
      
      // Contract verification status
      verification: {
        status: "pending",
        explorerUrl: getExplorerUrl(networkName, gttAddress)
      }
    };

    // Save deployment record
    await saveDeploymentRecord(networkName, deploymentInfo);
    
    // Display summary
    console.log(`\n🎉 GTT Token deployment complete!`);
    console.log(`📊 Deployment Summary:`);
    console.log(`   Contract: ${gttAddress}`);
    console.log(`   Network: ${networkName} (${network.chainId})`);
    console.log(`   Supply: ${ethers.formatEther(tokenSupply)} GTT`);
    console.log(`   Explorer: ${deploymentInfo.explorerUrl}`);
    
    // Contract verification instructions
    if (networkName !== "localhost" && networkName !== "hardhat") {
      console.log(`\n📋 Next Steps:`);
      console.log(`   1. Verify contract on explorer: ${deploymentInfo.explorerUrl}`);
      console.log(`   2. Add liquidity to DEX pools`);
      console.log(`   3. Setup staking contracts`);
      console.log(`   4. Configure cross-chain bridges`);
      console.log(`\n💡 Verification Command:`);
      console.log(`   npx hardhat verify --network ${networkName} ${gttAddress} "${GTT_CONFIG.name}" "${GTT_CONFIG.symbol}" "${GTT_CONFIG.totalSupply}"`);
    }
    
    return deploymentInfo;

  } catch (error) {
    console.error(`💥 GTT deployment failed:`, error);
    throw error;
  }
}

async function setupInitialDistribution(gttToken, deployer) {
  console.log(`📤 Distributing initial token allocation...`);
  
  // Note: In production, these would be real addresses from a secure config
  const distributionAddresses = {
    treasury: deployer.address, // Placeholder - would be multi-sig treasury
    ecosystem: deployer.address, // Placeholder - would be ecosystem fund
    team: deployer.address,      // Placeholder - would be team vesting contract
    liquidity: deployer.address, // Placeholder - would be liquidity manager
    advisors: deployer.address   // Placeholder - would be advisor vesting
  };
  
  const transfers = [];
  
  for (const [allocation, amount] of Object.entries(GTT_CONFIG.distribution)) {
    const recipient = distributionAddresses[allocation];
    
    if (recipient && recipient !== deployer.address) {
      console.log(`   Transferring ${ethers.formatEther(amount)} GTT to ${allocation}: ${recipient}`);
      
      const tx = await gttToken.transfer(recipient, amount);
      await tx.wait();
      
      transfers.push({
        allocation,
        recipient,
        amount: ethers.formatEther(amount),
        txHash: tx.hash
      });
      
      console.log(`   ✅ ${allocation} transfer complete: ${tx.hash}`);
    }
  }
  
  console.log(`✅ Initial distribution completed: ${transfers.length} transfers`);
  return transfers;
}

function getExplorerUrl(networkName, contractAddress) {
  const explorers = {
    mainnet: `https://etherscan.io/address/${contractAddress}`,
    sepolia: `https://sepolia.etherscan.io/address/${contractAddress}`,
    goerli: `https://goerli.etherscan.io/address/${contractAddress}`,
    polygon: `https://polygonscan.com/address/${contractAddress}`,
    mumbai: `https://mumbai.polygonscan.com/address/${contractAddress}`,
    bsc: `https://bscscan.com/address/${contractAddress}`,
    bscTestnet: `https://testnet.bscscan.com/address/${contractAddress}`
  };
  
  return explorers[networkName] || `https://etherscan.io/address/${contractAddress}`;
}

async function saveDeploymentRecord(networkName, deploymentInfo) {
  const deploymentsDir = path.join(process.cwd(), "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  const deploymentFile = path.join(deploymentsDir, `${networkName}_gtt.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  
  console.log(`💾 Deployment record saved: ${deploymentFile}`);
  
  // Also save to a timestamped backup
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(deploymentsDir, `${networkName}_gtt_${timestamp}.json`);
  fs.writeFileSync(backupFile, JSON.stringify(deploymentInfo, null, 2));
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};
  
  for (let i = 0; i < args.length; i += 2) {
    if (args[i].startsWith('--')) {
      const key = args[i].replace('--', '');
      const value = args[i + 1];
      options[key] = value;
    }
  }
  
  return options;
}

// Execute deployment if script is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const options = parseArgs();
  
  // Set environment variables from command line options
  if (options.distribution) {
    process.env.SETUP_DISTRIBUTION = options.distribution;
  }
  
  deployGTT()
    .then((result) => {
      console.log(`\n🏆 GTT Deployment Summary:`);
      console.log(`   Network: ${result.network}`);
      console.log(`   Contract: ${result.contractAddress}`);
      console.log(`   Supply: ${result.tokenDetails.totalSupply} GTT`);
      console.log(`   Explorer: ${result.explorerUrl}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 GTT deployment failed:', error);
      process.exit(1);
    });
}

export { deployGTT, GTT_CONFIG };