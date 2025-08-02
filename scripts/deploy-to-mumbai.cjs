const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 GTT TOKEN MUMBAI TESTNET DEPLOYMENT");
  console.log("======================================");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  const balanceInMatic = hre.ethers.formatEther(balance);
  console.log("Account balance:", balanceInMatic, "MATIC");

  // Network verification
  const network = await hre.ethers.provider.getNetwork();
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId.toString());

  if (network.chainId !== 80001n) {
    throw new Error(
      "❌ Not connected to Mumbai Testnet! Expected Chain ID: 80001",
    );
  }

  console.log("✅ Connected to Mumbai Testnet");

  // Deploy GTT Token
  console.log("\n📄 Deploying GTT Token Contract...");

  const GTTToken = await hre.ethers.getContractFactory("GTTToken");

  console.log("Token Configuration:");
  console.log("- Name: GUARDIANCHAIN Truth Token");
  console.log("- Symbol: GTT");
  console.log("- Total Supply: 2.5 Billion GTT");
  console.log("- Decimals: 18");

  const gttToken = await GTTToken.deploy();
  await gttToken.waitForDeployment();

  const gttAddress = await gttToken.getAddress();
  console.log("✅ GTT Token deployed to:", gttAddress);

  // Verify deployment
  console.log("\n🔍 Verifying deployment...");

  const tokenName = await gttToken.name();
  const tokenSymbol = await gttToken.symbol();
  const tokenDecimals = await gttToken.decimals();
  const tokenSupply = await gttToken.totalSupply();
  const deployerBalance = await gttToken.balanceOf(deployer.address);

  console.log("Token Name:", tokenName);
  console.log("Token Symbol:", tokenSymbol);
  console.log("Token Decimals:", tokenDecimals.toString());
  console.log("Total Supply:", hre.ethers.formatEther(tokenSupply), "GTT");
  console.log(
    "Deployer Balance:",
    hre.ethers.formatEther(deployerBalance),
    "GTT",
  );

  // Save deployment info
  const deploymentInfo = {
    network: "mumbai",
    chainId: 80001,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contractAddress: gttAddress,
    tokenName: tokenName,
    tokenSymbol: tokenSymbol,
    decimals: tokenDecimals.toString(),
    totalSupply: hre.ethers.formatEther(tokenSupply),
    deployerBalance: hre.ethers.formatEther(deployerBalance),
  };

  const deploymentPath = path.join(
    __dirname,
    "..",
    "deployments",
    "mumbai-testnet-gtt.json",
  );

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.dirname(deploymentPath);
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));

  console.log("\n🎉 GTT TOKEN MUMBAI DEPLOYMENT COMPLETE!");
  console.log("=========================================");
  console.log("Contract Address:", gttAddress);
  console.log("Total Supply:", hre.ethers.formatEther(tokenSupply), "GTT");
  console.log("Deployment info saved to:", deploymentPath);

  console.log("\n📋 NEXT STEPS:");
  console.log("1. Test token functionality on Mumbai");
  console.log("2. Get Mumbai faucet tokens for testing");
  console.log("3. Deploy to Polygon mainnet when ready");

  console.log("\n🌐 Mumbai PolygonScan Link:");
  console.log(`https://mumbai.polygonscan.com/address/${gttAddress}`);

  console.log("\n🔧 Testnet Configuration:");
  console.log("Network: Mumbai Testnet");
  console.log("Chain ID: 80001");
  console.log("Contract:", gttAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
