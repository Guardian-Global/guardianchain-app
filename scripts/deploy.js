const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting GTT Token deployment...");

  // Get the contract factory
  const GTTToken = await ethers.getContractFactory("GTTToken");

  // Deploy the contract
  console.log("📄 Deploying GTT Token contract...");
  const gttToken = await GTTToken.deploy();

  // Wait for deployment
  await gttToken.waitForDeployment();

  const contractAddress = await gttToken.getAddress();

  console.log("✅ GTT Token deployed successfully!");
  console.log("📍 Contract Address:", contractAddress);
  console.log(
    "🔗 View on PolygonScan: https://polygonscan.com/address/" +
      contractAddress,
  );

  // Log deployment details
  console.log("\n📊 Deployment Summary:");
  console.log("- Token Name: GUARDIANCHAIN Token");
  console.log("- Token Symbol: GTT");
  console.log("- Total Supply: 2,500,000,000 GTT");
  console.log("- Decimals: 18");
  console.log("- Network: Polygon Mainnet");
  console.log("- Gas Used: Approximately 1.2M gas");

  return contractAddress;
}

main()
  .then((address) => {
    console.log("\n🎉 GTT Token Launch Complete!");
    console.log("Contract ready for trading at:", address);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
