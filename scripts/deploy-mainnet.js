const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 GTT TOKEN MAINNET DEPLOYMENT STARTING...");
  console.log("==========================================");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  const balanceInMatic = hre.ethers.formatEther(balance);
  console.log("Account balance:", balanceInMatic, "MATIC");

  if (parseFloat(balanceInMatic) < 0.1) {
    console.log(
      "⚠️  WARNING: Low MATIC balance. Need at least 0.1 MATIC for deployment.",
    );
  }

  // Network verification
  const network = await hre.ethers.provider.getNetwork();
  console.log(
    "Network:",
    network.name,
    "Chain ID:",
    network.chainId.toString(),
  );

  if (network.chainId !== 137n) {
    throw new Error(
      "❌ Not connected to Polygon Mainnet! Expected Chain ID: 137",
    );
  }

  console.log("✅ Connected to Polygon Mainnet");

  // Deploy GTT Token
  console.log("\n📄 Deploying GTT Token Contract...");

  const GTTToken = await hre.ethers.getContractFactory("GTTToken");

  // Constructor parameters for GTT Token
  const initialSupply = hre.ethers.parseUnits("2500000000", 18); // 2.5 billion GTT
  const tokenName = "GUARDIANCHAIN Truth Token";
  const tokenSymbol = "GTT";

  console.log(
    "Initial Supply:",
    hre.ethers.formatUnits(initialSupply, 18),
    "GTT",
  );
  console.log("Token Name:", tokenName);
  console.log("Token Symbol:", tokenSymbol);

  const gttToken = await GTTToken.deploy(tokenName, tokenSymbol, initialSupply);
  await gttToken.waitForDeployment();

  const gttAddress = await gttToken.getAddress();
  console.log("✅ GTT Token deployed to:", gttAddress);

  // Deploy TruthVault
  console.log("\n🏦 Deploying TruthVault Contract...");

  const TruthVault = await hre.ethers.getContractFactory("TruthVault");
  const truthVault = await TruthVault.deploy(gttAddress);
  await truthVault.waitForDeployment();

  const vaultAddress = await truthVault.getAddress();
  console.log("✅ TruthVault deployed to:", vaultAddress);

  // Deploy CapsuleFactory
  console.log("\n🏭 Deploying CapsuleFactory Contract...");

  const CapsuleFactory = await hre.ethers.getContractFactory("CapsuleFactory");
  const capsuleFactory = await CapsuleFactory.deploy(gttAddress, vaultAddress);
  await capsuleFactory.waitForDeployment();

  const factoryAddress = await capsuleFactory.getAddress();
  console.log("✅ CapsuleFactory deployed to:", factoryAddress);

  // Initial setup - Transfer 10M GTT to TruthVault for rewards
  console.log("\n💰 Setting up initial token distribution...");

  const transferAmount = hre.ethers.parseUnits("10000000", 18); // 10M GTT
  const transferTx = await gttToken.transfer(vaultAddress, transferAmount);
  await transferTx.wait();

  console.log("✅ Transferred 10M GTT to TruthVault for rewards");

  // Verify deployment
  console.log("\n🔍 Verifying deployment...");

  const gttBalance = await gttToken.balanceOf(deployer.address);
  const vaultBalance = await gttToken.balanceOf(vaultAddress);

  console.log("Deployer GTT Balance:", hre.ethers.formatUnits(gttBalance, 18));
  console.log(
    "TruthVault GTT Balance:",
    hre.ethers.formatUnits(vaultBalance, 18),
  );

  // Save deployment addresses
  const deploymentInfo = {
    network: "polygon",
    chainId: 137,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      GTTToken: gttAddress,
      TruthVault: vaultAddress,
      CapsuleFactory: factoryAddress,
    },
    initialSupply: hre.ethers.formatUnits(initialSupply, 18),
    vaultBalance: hre.ethers.formatUnits(vaultBalance, 18),
  };

  const deploymentPath = path.join(
    __dirname,
    "..",
    "deployments",
    "polygon-mainnet.json",
  );

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.dirname(deploymentPath);
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));

  console.log("\n🎉 GTT TOKEN MAINNET DEPLOYMENT COMPLETE!");
  console.log("==========================================");
  console.log("GTT Token Address:", gttAddress);
  console.log("TruthVault Address:", vaultAddress);
  console.log("CapsuleFactory Address:", factoryAddress);
  console.log("Deployment info saved to:", deploymentPath);

  console.log("\n📋 NEXT STEPS:");
  console.log("1. Update frontend configuration with new contract address");
  console.log("2. Verify contracts on PolygonScan");
  console.log("3. Submit GTT token to DEX listings");
  console.log("4. Update marketing materials with mainnet address");

  console.log("\n🌐 PolygonScan Links:");
  console.log(`GTT Token: https://polygonscan.com/address/${gttAddress}`);
  console.log(`TruthVault: https://polygonscan.com/address/${vaultAddress}`);
  console.log(
    `CapsuleFactory: https://polygonscan.com/address/${factoryAddress}`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
