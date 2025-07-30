const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 GTT TOKEN SIMPLE DEPLOYMENT STARTING...");
  console.log("==========================================");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  const balanceInMatic = hre.ethers.formatEther(balance);
  console.log("Account balance:", balanceInMatic, "MATIC");

  if (parseFloat(balanceInMatic) < 0.02) {
    console.log(
      "⚠️  WARNING: Low MATIC balance. Need at least 0.02 MATIC for deployment."
    );
    console.log("Please fund the deployer wallet:", deployer.address);
    console.log("Required: ~0.02 MATIC (~$0.02 USD)");
    process.exit(1);
  }

  // Network verification
  const network = await hre.ethers.provider.getNetwork();
  console.log(
    "Network:",
    network.name,
    "Chain ID:",
    network.chainId.toString()
  );

  if (network.chainId !== 137n) {
    throw new Error(
      "❌ Not connected to Polygon Mainnet! Expected Chain ID: 137"
    );
  }

  console.log("✅ Connected to Polygon Mainnet");

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
  console.log("Deployer Balance:", hre.ethers.formatEther(deployerBalance), "GTT");

  // Save deployment info
  const deploymentInfo = {
    network: "polygon",
    chainId: 137,
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
    "polygon-mainnet-gtt.json"
  );

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.dirname(deploymentPath);
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));

  console.log("\n🎉 GTT TOKEN MAINNET DEPLOYMENT COMPLETE!");
  console.log("==========================================");
  console.log("Contract Address:", gttAddress);
  console.log("Total Supply:", hre.ethers.formatEther(tokenSupply), "GTT");
  console.log("Deployment info saved to:", deploymentPath);

  console.log("\n📋 NEXT STEPS:");
  console.log("1. Update frontend configuration with contract address");
  console.log("2. Verify contract on PolygonScan");
  console.log("3. Create initial liquidity pool");
  console.log("4. Submit to token listing sites");

  console.log("\n🌐 PolygonScan Link:");
  console.log(`https://polygonscan.com/address/${gttAddress}`);

  console.log("\n🔧 Frontend Update Required:");
  console.log("Update GTT_CONTRACT_ADDRESS in:");
  console.log("- client/src/lib/contractConfig.ts");
  console.log("- lib/web3/token.ts");
  console.log(`New address: ${gttAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });