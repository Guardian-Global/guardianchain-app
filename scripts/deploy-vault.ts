import { ethers } from "hardhat";

async function main() {
  console.log("Deploying TruthVault contract...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // First, we need the GTT token address
  // For demo purposes, we'll deploy a new GTT token if one doesn't exist
  const GTTToken = await ethers.getContractFactory("GTTToken");
  const gttToken = await GTTToken.deploy();
  await gttToken.waitForDeployment();
  const gttAddress = await gttToken.getAddress();
  
  console.log("GTTToken deployed to:", gttAddress);

  // Deploy TruthVault with GTT token address
  const TruthVault = await ethers.getContractFactory("TruthVault");
  const truthVault = await TruthVault.deploy(gttAddress);
  await truthVault.waitForDeployment();

  const vaultAddress = await truthVault.getAddress();
  console.log("TruthVault deployed to:", vaultAddress);

  // Set the vault as the minter for GTT tokens
  await gttToken.setVault(vaultAddress);
  console.log("Vault set as GTT minter");

  // Display deployment info
  console.log("\n=== Deployment Summary ===");
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId);
  console.log("GTT Token Address:", gttAddress);
  console.log("TruthVault Address:", vaultAddress);
  console.log("Deployer Address:", deployer.address);

  // Verify vault info
  const gttTokenAddress = await truthVault.gttToken();
  const owner = await truthVault.owner();
  
  console.log("\n=== Contract Info ===");
  console.log("Vault GTT Token:", gttTokenAddress);
  console.log("Vault Owner:", owner);

  return {
    gttToken: gttAddress,
    truthVault: vaultAddress,
    deployer: deployer.address,
  };
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});