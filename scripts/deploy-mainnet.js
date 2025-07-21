import pkg from 'hardhat';
const { ethers } = pkg;
import fs from 'fs';

async function main() {
  console.log("🚀 GUARDIANCHAIN GTT TOKEN MAINNET DEPLOYMENT");
  console.log("==============================================");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  // Check deployer balance
  const balance = await deployer.getBalance();
  console.log("Account balance:", ethers.utils.formatEther(balance), "ETH");
  
  if (balance.lt(ethers.utils.parseEther("0.01"))) {
    throw new Error("Insufficient ETH balance for deployment. Need at least 0.01 ETH");
  }
  
  console.log("\n📋 DEPLOYMENT SEQUENCE STARTING...");
  
  // 1. Deploy GTT Token
  console.log("\n1️⃣ Deploying GTT Token Contract...");
  const GTTToken = await ethers.getContractFactory("GTTToken");
  const gttToken = await GTTToken.deploy(
    "Guardian Truth Token",
    "GTT",
    ethers.utils.parseEther("1000000000"), // 1 billion tokens
    { gasLimit: 2000000 }
  );
  await gttToken.deployed();
  console.log("✅ GTT Token deployed to:", gttToken.address);
  
  // 2. Deploy Truth Vault
  console.log("\n2️⃣ Deploying Truth Vault Contract...");
  const TruthVault = await ethers.getContractFactory("TruthVault");
  const truthVault = await TruthVault.deploy(
    gttToken.address,
    { gasLimit: 2000000 }
  );
  await truthVault.deployed();
  console.log("✅ Truth Vault deployed to:", truthVault.address);
  
  // 3. Deploy Capsule Factory
  console.log("\n3️⃣ Deploying Capsule Factory Contract...");
  const CapsuleFactoryV2 = await ethers.getContractFactory("CapsuleFactoryV2");
  const capsuleFactory = await CapsuleFactoryV2.deploy(
    gttToken.address,
    truthVault.address,
    { gasLimit: 3000000 }
  );
  await capsuleFactory.deployed();
  console.log("✅ Capsule Factory deployed to:", capsuleFactory.address);
  
  // 4. Deploy NFT Contract
  console.log("\n4️⃣ Deploying Veritas Capsule NFT Contract...");
  const VeritasCapsuleNFT = await ethers.getContractFactory("VeritasCapsuleNFT");
  const veritasNFT = await VeritasCapsuleNFT.deploy(
    "VeritasCapsule",
    "VCAP",
    { gasLimit: 3000000 }
  );
  await veritasNFT.deployed();
  console.log("✅ Veritas NFT deployed to:", veritasNFT.address);
  
  // 5. Deploy DAO Contract
  console.log("\n5️⃣ Deploying Truth DAO Contract...");
  const TruthDAO = await ethers.getContractFactory("TruthDAO");
  const truthDAO = await TruthDAO.deploy(
    gttToken.address,
    { gasLimit: 2500000 }
  );
  await truthDAO.deployed();
  console.log("✅ Truth DAO deployed to:", truthDAO.address);
  
  // 6. Deploy Fee Manager
  console.log("\n6️⃣ Deploying Fee Manager Contract...");
  const FeeManager = await ethers.getContractFactory("FeeManager");
  const feeManager = await FeeManager.deploy(
    gttToken.address,
    truthVault.address,
    { gasLimit: 2000000 }
  );
  await feeManager.deployed();
  console.log("✅ Fee Manager deployed to:", feeManager.address);
  
  console.log("\n🎉 DEPLOYMENT COMPLETE!");
  console.log("========================");
  console.log("GTT Token:", gttToken.address);
  console.log("Truth Vault:", truthVault.address);
  console.log("Capsule Factory:", capsuleFactory.address);
  console.log("Veritas NFT:", veritasNFT.address);
  console.log("Truth DAO:", truthDAO.address);
  console.log("Fee Manager:", feeManager.address);
  
  // Save deployment addresses
  const deploymentData = {
    network: "mainnet",
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      GTTToken: gttToken.address,
      TruthVault: truthVault.address,
      CapsuleFactoryV2: capsuleFactory.address,
      VeritasCapsuleNFT: veritasNFT.address,
      TruthDAO: truthDAO.address,
      FeeManager: feeManager.address
    },
    gasUsed: "Calculating...",
    totalCost: "Calculating..."
  };
  
  fs.writeFileSync(
    'deployment-mainnet.json',
    JSON.stringify(deploymentData, null, 2)
  );
  
  console.log("\n💾 Deployment data saved to deployment-mainnet.json");
  console.log("\n🚀 Ready for DEX listing and trading activation!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });