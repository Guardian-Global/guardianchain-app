const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying contracts to local Hardhat network...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy GTTToken
  const GTTToken = await ethers.getContractFactory("GTTToken");
  const gttToken = await GTTToken.deploy();
  await gttToken.waitForDeployment();
  const gttAddress = await gttToken.getAddress();
  
  console.log("GTTToken deployed to:", gttAddress);

  // Deploy TruthVault with GTT token address and admin
  const TruthVault = await ethers.getContractFactory("TruthVault");
  const truthVault = await TruthVault.deploy(gttAddress, deployer.address);
  await truthVault.waitForDeployment();
  const vaultAddress = await truthVault.getAddress();
  
  console.log("TruthVault deployed to:", vaultAddress);

  // Set the vault as the minter for GTT tokens
  await gttToken.setVault(vaultAddress);
  console.log("Vault set as GTT minter");

  // Update the constants file with deployed addresses
  const constantsPath = path.join(__dirname, "../client/src/lib/constants.ts");
  let constantsContent = fs.readFileSync(constantsPath, "utf8");
  
  // Replace the local network addresses
  constantsContent = constantsContent.replace(
    /31337: \{[^}]+\}/s,
    `31337: {
    GTT_TOKEN: "${gttAddress}",
    TRUTH_VAULT: "${vaultAddress}",
  }`
  );
  
  fs.writeFileSync(constantsPath, constantsContent);
  console.log("Updated constants.ts with deployed addresses");

  // Display deployment info
  console.log("\n=== Deployment Summary ===");
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId);
  console.log("GTT Token Address:", gttAddress);
  console.log("TruthVault Address:", vaultAddress);
  console.log("Deployer Address:", deployer.address);

  // Test some basic functionality
  console.log("\n=== Testing Basic Functionality ===");
  
  // Check GTT token info
  const name = await gttToken.name();
  const symbol = await gttToken.symbol();
  const totalSupply = await gttToken.totalSupply();
  
  console.log("GTT Name:", name);
  console.log("GTT Symbol:", symbol);
  console.log("GTT Total Supply:", ethers.formatEther(totalSupply));

  // Check vault info
  const vaultGttToken = await truthVault.gttToken();
  const minimumStake = await truthVault.minimumStake();
  
  console.log("Vault GTT Token:", vaultGttToken);
  console.log("Minimum Stake:", ethers.formatEther(minimumStake), "GTT");

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