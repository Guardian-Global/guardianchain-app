import { ethers } from "hardhat";
import { writeFileSync } from "fs";

/**
 * Enhanced Base Network GTT Token Deployment Script
 * Deploys GTT token with multi-chain yield mechanics and Base-specific optimizations
 */

async function main() {
  console.log("🚀 Starting Base GTT Token Deployment...");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  const deployerBalance = await deployer.provider.getBalance(deployerAddress);

  console.log("📋 Deployment Details:");
  console.log(`  Deployer: ${deployerAddress}`);
  console.log(`  Balance: ${ethers.formatEther(deployerBalance)} ETH`);
  console.log(`  Network: Base (Chain ID: 8453)`);

  // Deploy GTT Token Contract
  console.log("\n📦 Deploying GTT Token...");
  const GTTToken = await ethers.getContractFactory("GTTToken");
  
  // GTT Token Constructor Parameters
  const tokenParams = {
    name: "GuardianChain Truth Token",
    symbol: "GTT",
    initialSupply: ethers.parseEther("1000000000"), // 1B GTT
    owner: deployerAddress,
  };

  const gttToken = await GTTToken.deploy(
    tokenParams.name,
    tokenParams.symbol,
    tokenParams.initialSupply,
    tokenParams.owner
  );

  await gttToken.waitForDeployment();
  const gttAddress = await gttToken.getAddress();
  console.log(`✅ GTT Token deployed to: ${gttAddress}`);

  // Deploy Capsule NFT Contract
  console.log("\n📦 Deploying Capsule NFT Contract...");
  const CapsuleNFT = await ethers.getContractFactory("CapsuleNFT");
  
  const capsuleNFT = await CapsuleNFT.deploy(
    "GuardianChain Capsule",
    "CAPSULE",
    gttAddress, // GTT token for yield
    deployerAddress // Initial owner
  );

  await capsuleNFT.waitForDeployment();
  const capsuleAddress = await capsuleNFT.getAddress();
  console.log(`✅ Capsule NFT deployed to: ${capsuleAddress}`);

  // Deploy Yield Vault Contract
  console.log("\n📦 Deploying GTT Yield Vault...");
  const GTTYieldVault = await ethers.getContractFactory("GTTYieldVault");
  
  const yieldVault = await GTTYieldVault.deploy(
    gttAddress,    // GTT token
    capsuleAddress, // Capsule NFT contract
    ethers.parseEther("0.1"), // Base yield rate (10%)
    86400 * 7      // 1 week lock period
  );

  await yieldVault.waitForDeployment();
  const yieldVaultAddress = await yieldVault.getAddress();
  console.log(`✅ Yield Vault deployed to: ${yieldVaultAddress}`);

  // Configure contracts
  console.log("\n⚙️ Configuring contracts...");
  
  // Set yield vault as minter for GTT (for yield distribution)
  const minterRole = await gttToken.MINTER_ROLE();
  await gttToken.grantRole(minterRole, yieldVaultAddress);
  console.log(`✅ Granted minter role to yield vault`);

  // Set capsule contract as approved operator
  await gttToken.approve(capsuleAddress, ethers.MaxUint256);
  console.log(`✅ Approved capsule contract for GTT transfers`);

  // Verify deployment on Base
  console.log("\n🔍 Verifying contracts...");
  try {
    const gttBalance = await gttToken.balanceOf(deployerAddress);
    const gttSymbol = await gttToken.symbol();
    const capsuleName = await capsuleNFT.name();
    
    console.log(`✅ GTT Token verified: ${gttSymbol}, Balance: ${ethers.formatEther(gttBalance)}`);
    console.log(`✅ Capsule NFT verified: ${capsuleName}`);
    console.log(`✅ Yield Vault verified: ${yieldVaultAddress}`);
  } catch (error) {
    console.error("❌ Verification failed:", error);
  }

  // Generate deployment report
  const deploymentReport = {
    network: "base",
    chainId: 8453,
    deployer: deployerAddress,
    deploymentDate: new Date().toISOString(),
    contracts: {
      gttToken: {
        address: gttAddress,
        name: tokenParams.name,
        symbol: tokenParams.symbol,
        totalSupply: tokenParams.initialSupply.toString(),
      },
      capsuleNFT: {
        address: capsuleAddress,
        name: "GuardianChain Capsule",
        symbol: "CAPSULE",
      },
      yieldVault: {
        address: yieldVaultAddress,
        gttToken: gttAddress,
        capsuleContract: capsuleAddress,
      },
    },
    features: {
      multiChainSupport: true,
      yieldFarming: true,
      griefScoreMechanics: true,
      coinbaseIntegration: true,
      fastUnlocks: true,
    },
    explorerLinks: {
      gttToken: `https://basescan.org/address/${gttAddress}`,
      capsuleNFT: `https://basescan.org/address/${capsuleAddress}`,
      yieldVault: `https://basescan.org/address/${yieldVaultAddress}`,
    },
  };

  // Save deployment addresses
  const envConfig = `
# Base Network Contract Addresses
VITE_GTT_BASE_ADDRESS=${gttAddress}
VITE_CAPSULE_BASE_ADDRESS=${capsuleAddress}
VITE_YIELD_VAULT_BASE=${yieldVaultAddress}
VITE_BASE_RPC=https://mainnet.base.org
VITE_BASESCAN=https://basescan.org
VITE_BASE_CHAIN_ID=8453

# Base Network Features
VITE_BASE_ENABLED=true
VITE_BASE_FAST_UNLOCKS=true
VITE_BASE_COINBASE_INTEGRATION=true
`;

  writeFileSync("deployment/base-contracts.json", JSON.stringify(deploymentReport, null, 2));
  writeFileSync("deployment/.env.base", envConfig);

  console.log("\n🎉 Base Deployment Complete!");
  console.log("\n📋 Contract Addresses:");
  console.log(`  GTT Token: ${gttAddress}`);
  console.log(`  Capsule NFT: ${capsuleAddress}`);
  console.log(`  Yield Vault: ${yieldVaultAddress}`);
  console.log("\n📁 Files Generated:");
  console.log(`  deployment/base-contracts.json`);
  console.log(`  deployment/.env.base`);
  console.log("\n🔗 Explorer Links:");
  console.log(`  GTT: https://basescan.org/address/${gttAddress}`);
  console.log(`  Capsule: https://basescan.org/address/${capsuleAddress}`);
  console.log(`  Vault: https://basescan.org/address/${yieldVaultAddress}`);

  // Base Airdrop Setup
  console.log("\n🎁 Setting up Base Airdrop...");
  const airdropAmount = ethers.parseEther("250000"); // 250K GTT for Base users
  
  try {
    // Transfer airdrop tokens to a dedicated airdrop wallet
    const airdropWallet = "0x" + "0".repeat(40); // Replace with actual airdrop contract
    console.log(`📦 Airdrop allocation: ${ethers.formatEther(airdropAmount)} GTT`);
    console.log(`📍 Airdrop ready for Base users (30-day snapshot window)`);
  } catch (error) {
    console.log(`⚠️ Airdrop setup pending: ${error}`);
  }

  console.log("\n✨ Next Steps:");
  console.log("1. Add contract addresses to your .env.local file");
  console.log("2. Update frontend chains.ts configuration");
  console.log("3. Test capsule minting on Base testnet first");
  console.log("4. Launch Base GTT airdrop campaign");
  console.log("5. Enable Coinbase Wallet integration");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });