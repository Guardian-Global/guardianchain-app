// scripts/deploy.ts

const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)));

  // Deploy GTTToken
  console.log("\nDeploying GTTToken...");
  const GTT = await ethers.getContractFactory("GTTToken");
  const gtt = await GTT.deploy();
  await gtt.waitForDeployment();
  const gttAddress = await gtt.getAddress();
  console.log("GTTToken deployed to:", gttAddress);

  // Deploy TruthVault
  console.log("\nDeploying TruthVault...");
  const Vault = await ethers.getContractFactory("TruthVault");
  const vault = await Vault.deploy();
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log("TruthVault deployed to:", vaultAddress);

  // Deploy CapsuleFactory
  console.log("\nDeploying CapsuleFactory...");
  const Factory = await ethers.getContractFactory("CapsuleFactory");
  const factory = await Factory.deploy();
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("CapsuleFactory deployed to:", factoryAddress);

  // Deploy VeritasCapsuleNFT
  console.log("\nDeploying VeritasCapsuleNFT...");
  const VeritasNFT = await ethers.getContractFactory("VeritasCapsuleNFT");
  const veritasNFT = await VeritasNFT.deploy();
  await veritasNFT.waitForDeployment();
  const nftAddress = await veritasNFT.getAddress();
  console.log("VeritasCapsuleNFT deployed to:", nftAddress);

  // Deploy TruthDAO
  console.log("\nDeploying TruthDAO...");
  const TruthDAO = await ethers.getContractFactory("TruthDAO");
  const truthDAO = await TruthDAO.deploy(gttAddress);
  await truthDAO.waitForDeployment();
  const daoAddress = await truthDAO.getAddress();
  console.log("TruthDAO deployed to:", daoAddress);

  console.log("\n=== DEPLOYMENT SUMMARY ===");
  console.log("GTTToken:", gttAddress);
  console.log("TruthVault:", vaultAddress);
  console.log("CapsuleFactory:", factoryAddress);
  console.log("VeritasCapsuleNFT:", nftAddress);
  console.log("TruthDAO:", daoAddress);
  console.log("Network: Sepolia");
  console.log("Deployer:", deployer.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});