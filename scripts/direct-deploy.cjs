const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 GTT TOKEN DIRECT DEPLOYMENT");
  console.log("==============================");

  // Try deployment with current configuration
  try {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with account:", deployer.address);

    // Check balance
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    const balanceInMatic = hre.ethers.formatEther(balance);
    console.log("Account balance:", balanceInMatic, "MATIC");

    // Network verification
    const network = await hre.ethers.provider.getNetwork();
    console.log("Network Chain ID:", network.chainId.toString());

    if (parseFloat(balanceInMatic) < 0.02) {
      console.log("❌ Insufficient funds for deployment");
      console.log("Need to send MATIC to:", deployer.address);
      return;
    }

    console.log("✅ Sufficient funds available");
    console.log("🚀 Starting GTT Token deployment...");

    // Deploy GTT Token
    const GTTToken = await hre.ethers.getContractFactory("GTTToken");
    
    console.log("Deploying GTT Token contract...");
    const gttToken = await GTTToken.deploy();
    
    console.log("Waiting for deployment confirmation...");
    await gttToken.waitForDeployment();

    const gttAddress = await gttToken.getAddress();
    console.log("🎉 GTT Token deployed successfully!");
    console.log("Contract Address:", gttAddress);

    // Verify deployment
    const tokenName = await gttToken.name();
    const tokenSymbol = await gttToken.symbol();
    const tokenDecimals = await gttToken.decimals();
    const tokenSupply = await gttToken.totalSupply();

    console.log("\n📄 Token Details:");
    console.log("Name:", tokenName);
    console.log("Symbol:", tokenSymbol);
    console.log("Decimals:", tokenDecimals.toString());
    console.log("Total Supply:", hre.ethers.formatEther(tokenSupply), "GTT");

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
    };

    const deploymentPath = path.join(__dirname, "..", "deployments", "polygon-mainnet-gtt.json");
    const deploymentsDir = path.dirname(deploymentPath);
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }
    fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));

    console.log("\n✅ DEPLOYMENT COMPLETE!");
    console.log("PolygonScan:", `https://polygonscan.com/address/${gttAddress}`);
    console.log("Deployment saved to:", deploymentPath);

    return gttAddress;

  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    if (error.message.includes("insufficient funds")) {
      console.log("💰 Please ensure the deployer wallet has enough MATIC");
    }
    throw error;
  }
}

main()
  .then((address) => {
    if (address) {
      console.log(`\n🔧 UPDATE FRONTEND CONFIG WITH: ${address}`);
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });