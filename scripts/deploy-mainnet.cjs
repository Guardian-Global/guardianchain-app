const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🚀 GUARDIANCHAIN GTT TOKEN MAINNET DEPLOYMENT");
  console.log("==============================================");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  // Check deployer balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");
  
  if (balance < ethers.parseEther("0.001")) {
    throw new Error("Insufficient ETH balance for deployment. Need at least 0.001 ETH");
  }
  
  console.log("\n📋 DEPLOYMENT SEQUENCE STARTING...");
  
  // 1. Deploy GTT Token
  console.log("\n1️⃣ Deploying GTT Token Contract...");
  const GTTToken = await ethers.getContractFactory("SimpleGTTToken");
  const gttToken = await GTTToken.deploy(
    deployer.address, // treasury
    deployer.address  // yieldPool (same as deployer initially)
  );
  await gttToken.waitForDeployment();
  console.log("✅ GTT Token deployed to:", await gttToken.getAddress());
  
  // 2. Deploy Truth Vault
  console.log("\n2️⃣ Deploying Truth Vault Contract...");
  const TruthVault = await ethers.getContractFactory("TruthVault");
  const truthVault = await TruthVault.deploy(await gttToken.getAddress());
  await truthVault.waitForDeployment();
  console.log("✅ Truth Vault deployed to:", await truthVault.getAddress());
  
  // 3. Deploy Guardian Pass  
  console.log("\n3️⃣ Deploying Guardian Pass Contract...");
  const GuardianPass = await ethers.getContractFactory("GuardianPass");
  const guardianPass = await GuardianPass.deploy();
  await guardianPass.waitForDeployment();
  console.log("✅ Guardian Pass deployed to:", await guardianPass.getAddress());
  
  console.log("\n🎉 ALL CONTRACTS DEPLOYED SUCCESSFULLY!");
  console.log("===========================================");
  
  // Save deployment info
  const deploymentData = {
    network: "mainnet",
    chainId: 1,
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      SimpleGTTToken: await gttToken.getAddress(),
      TruthVault: await truthVault.getAddress(),
      GuardianPass: await guardianPass.getAddress()
    },
    gasUsed: "Calculating...",
    totalCost: "Calculating..."
  };
  
  fs.writeFileSync(
    'deployment-mainnet.json',
    JSON.stringify(deploymentData, null, 2)
  );
  
  console.log("\n📄 Deployment details saved to deployment-mainnet.json");
  console.log("\n🚀 GUARDIANCHAIN IS NOW LIVE ON MAINNET!");
  console.log("\nContract Addresses:");
  console.log("GTT Token:", await gttToken.getAddress());
  console.log("Truth Vault:", await truthVault.getAddress());
  console.log("Guardian Pass:", await guardianPass.getAddress());
  console.log("\n🎯 Ready for DEX listing and trading!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });