const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 GUARDIANCHAIN SIMPLE DEPLOYMENT");
  console.log("================================");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const network = await deployer.provider.getNetwork();
  console.log("Network:", network.name, "Chain ID:", network.chainId.toString());
  
  try {
    console.log("🔄 Deploying GTT Token...");
    const GTTToken = await ethers.getContractFactory("SimpleGTTToken");
    const gttToken = await GTTToken.deploy(
      deployer.address, // treasury
      deployer.address  // yieldPool
    );
    
    console.log("⏳ Waiting for deployment...");
    await gttToken.waitForDeployment();
    const tokenAddress = await gttToken.getAddress();
    
    console.log("✅ SUCCESS! GTT Token deployed to:", tokenAddress);
    console.log("🎉 GUARDIANCHAIN TOKEN IS LIVE ON POLYGON MAINNET!");
    
    return {
      gttToken: tokenAddress,
      deployer: deployer.address,
      network: network.chainId.toString()
    };
    
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    throw error;
  }
}

main()
  .then((result) => {
    console.log("\n🎯 DEPLOYMENT COMPLETE:");
    console.log("Token Address:", result.gttToken);
    console.log("Deployer:", result.deployer);
    console.log("Network:", result.network);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });