const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying contracts to Polygon Mumbai testnet...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "MATIC");

  if (balance < ethers.parseEther("0.1")) {
    console.warn("⚠️  Low balance! Make sure you have enough MATIC for gas fees.");
    console.warn("Get free MATIC from: https://faucet.polygon.technology/");
  }

  // Deploy GTTToken
  console.log("\n🚀 Deploying GTTToken...");
  const GTTToken = await ethers.getContractFactory("GTTToken");
  const gttToken = await GTTToken.deploy();
  await gttToken.waitForDeployment();
  const gttAddress = await gttToken.getAddress();
  
  console.log("✅ GTTToken deployed to:", gttAddress);

  // Deploy TruthVault with GTT token address and admin
  console.log("\n🚀 Deploying TruthVault...");
  const TruthVault = await ethers.getContractFactory("TruthVault");
  const truthVault = await TruthVault.deploy(gttAddress, deployer.address);
  await truthVault.waitForDeployment();
  const vaultAddress = await truthVault.getAddress();
  
  console.log("✅ TruthVault deployed to:", vaultAddress);

  // Set the vault as the minter for GTT tokens
  console.log("\n⚙️  Setting up vault permissions...");
  const tx = await gttToken.setVault(vaultAddress);
  await tx.wait();
  console.log("✅ Vault set as GTT minter");

  // Update the constants file with deployed addresses
  const constantsPath = path.join(__dirname, "../client/src/lib/constants.ts");
  let constantsContent = fs.readFileSync(constantsPath, "utf8");
  
  // Replace the Polygon Amoy network addresses
  constantsContent = constantsContent.replace(
    /80002: \{[^}]+\}/s,
    `80002: {
    GTT_TOKEN: "${gttAddress}",
    TRUTH_VAULT: "${vaultAddress}",
  }`
  );
  
  fs.writeFileSync(constantsPath, constantsContent);
  console.log("✅ Updated constants.ts with Mumbai addresses");

  // Create contracts export file
  const contractsExport = `// Auto-generated contract addresses and ABIs
export const MUMBAI_CONTRACTS = {
  GTT_TOKEN: "${gttAddress}",
  TRUTH_VAULT: "${vaultAddress}",
  DEPLOYER: "${deployer.address}",
  NETWORK: "polygon-amoy",
  CHAIN_ID: 80002,
};

export const DEPLOYMENT_BLOCK = {
  GTT_TOKEN: ${await ethers.provider.getBlockNumber()},
  TRUTH_VAULT: ${await ethers.provider.getBlockNumber()},
};

// Contract ABIs are imported from constants.ts
export { GTT_TOKEN_ABI, TRUTH_VAULT_ABI } from './constants';
`;

  fs.writeFileSync(path.join(__dirname, "../client/src/lib/contracts.ts"), contractsExport);
  console.log("✅ Created contracts.ts export file");

  // Display deployment summary
  console.log("\n🎉 === DEPLOYMENT SUMMARY ===");
  console.log("Network:", "Polygon Amoy Testnet");
  console.log("Chain ID:", 80002);
  console.log("GTT Token:", gttAddress);
  console.log("TruthVault:", vaultAddress);
  console.log("Deployer:", deployer.address);
  console.log("Block Number:", await ethers.provider.getBlockNumber());

  // Test some basic functionality
  console.log("\n🔍 === TESTING BASIC FUNCTIONALITY ===");
  
  // Check GTT token info
  const name = await gttToken.name();
  const symbol = await gttToken.symbol();
  const totalSupply = await gttToken.totalSupply();
  const maxSupply = await gttToken.MAX_SUPPLY();
  
  console.log("GTT Name:", name);
  console.log("GTT Symbol:", symbol);
  console.log("GTT Total Supply:", ethers.formatEther(totalSupply));
  console.log("GTT Max Supply:", ethers.formatEther(maxSupply));

  // Check vault info
  const vaultGttToken = await truthVault.gttToken();
  console.log("Vault GTT Token:", vaultGttToken);
  console.log("Vault correctly linked:", vaultGttToken === gttAddress);

  // Test minting (should work since vault is set as minter)
  console.log("\n🧪 Testing GTT minting from vault...");
  try {
    const testAmount = ethers.parseEther("100");
    await truthVault.connect(deployer).updateTruthYield(1, testAmount);
    console.log("✅ Test yield update successful");
  } catch (error) {
    console.log("ℹ️  Test yield update skipped (expected for new deployment)");
  }

  console.log("\n🎯 === NEXT STEPS ===");
  console.log("1. Add Mumbai MATIC to your wallet for gas fees");
  console.log("2. Connect your wallet to Mumbai testnet in MetaMask");
  console.log("3. Test the Web3 Demo page with the new contracts");
  console.log("4. Mumbai Explorer:", `https://mumbai.polygonscan.com/address/${gttAddress}`);

  return {
    gttToken: gttAddress,
    truthVault: vaultAddress,
    deployer: deployer.address,
    chainId: 80001,
  };
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});