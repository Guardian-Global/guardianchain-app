const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🚀 GUARDIANCHAIN GTT TOKEN MAINNET DEPLOYMENT");
  console.log("==============================================");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  // Check deployer balance
  const balance = await deployer.getBalance();
  console.log("Account balance:", ethers.utils.formatEther(balance), "ETH");
  
  if (balance.lt(ethers.utils.parseEther("0.005"))) {
    throw new Error("Insufficient ETH balance for deployment. Need at least 0.005 ETH");
  }
  
  console.log("\n📋 DEPLOYMENT SEQUENCE STARTING...");
  
  // 1. Deploy GTT Token
  console.log("\n1️⃣ Deploying GTT Token Contract...");
  const GTTToken = await ethers.getContractFactory("GTTToken");
  const gttToken = await GTTToken.deploy(
    "Guardian Truth Token",
    "GTT",
    ethers.utils.parseEther("1000000000") // 1 billion tokens
  );
  await gttToken.deployed();
  console.log("✅ GTT Token deployed to:", gttToken.address);
  
  // 2. Deploy Truth Vault
  console.log("\n2️⃣ Deploying Truth Vault Contract...");
  const TruthVault = await ethers.getContractFactory("TruthVault");
  const truthVault = await TruthVault.deploy(gttToken.address);
  await truthVault.deployed();
  console.log("✅ Truth Vault deployed to:", truthVault.address);
  
  // 3. Deploy Capsule Factory
  console.log("\n3️⃣ Deploying Capsule Factory Contract...");
  const CapsuleFactory = await ethers.getContractFactory("CapsuleFactory");
  const capsuleFactory = await CapsuleFactory.deploy(
    gttToken.address,
    truthVault.address
  );
  await capsuleFactory.deployed();
  console.log("✅ Capsule Factory deployed to:", capsuleFactory.address);
  
  // 4. Deploy Veritas NFT
  console.log("\n4️⃣ Deploying Veritas Capsule NFT Contract...");
  const VeritasCapsuleNFT = await ethers.getContractFactory("VeritasCapsuleNFT");
  const veritasNFT = await VeritasCapsuleNFT.deploy();
  await veritasNFT.deployed();
  console.log("✅ Veritas NFT deployed to:", veritasNFT.address);
  
  // 5. Deploy Truth DAO
  console.log("\n5️⃣ Deploying Truth DAO Contract...");
  const TruthDAO = await ethers.getContractFactory("TruthDAO");
  const truthDAO = await TruthDAO.deploy(gttToken.address);
  await truthDAO.deployed();
  console.log("✅ Truth DAO deployed to:", truthDAO.address);
  
  // 6. Deploy Guardian Pass
  console.log("\n6️⃣ Deploying Guardian Pass Contract...");
  const GuardianPass = await ethers.getContractFactory("GuardianPass");
  const guardianPass = await GuardianPass.deploy();
  await guardianPass.deployed();
  console.log("✅ Guardian Pass deployed to:", guardianPass.address);
  
  console.log("\n🎉 ALL CONTRACTS DEPLOYED SUCCESSFULLY!");
  console.log("===========================================");
  
  // Save deployment info
  const deploymentData = {
    network: "mainnet",
    chainId: 1,
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      GTTToken: gttToken.address,
      TruthVault: truthVault.address,
      CapsuleFactory: capsuleFactory.address,
      VeritasCapsuleNFT: veritasNFT.address,
      TruthDAO: truthDAO.address,
      GuardianPass: guardianPass.address
    }
  };
  
  fs.writeFileSync(
    'deployment-mainnet.json',
    JSON.stringify(deploymentData, null, 2)
  );
  
  console.log("\n📄 Deployment details saved to deployment-mainnet.json");
  console.log("\n🚀 GUARDIANCHAIN IS NOW LIVE ON MAINNET!");
  console.log("\nContract Addresses:");
  console.log("GTT Token:", gttToken.address);
  console.log("Truth Vault:", truthVault.address);
  console.log("Capsule Factory:", capsuleFactory.address);
  console.log("Veritas NFT:", veritasNFT.address);
  console.log("Truth DAO:", truthDAO.address);
  console.log("Guardian Pass:", guardianPass.address);
  console.log("\n🎯 Ready for DEX listing and trading!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });