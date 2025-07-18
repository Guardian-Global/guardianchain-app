const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying TruthAuctionEngine...");
  
  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // Deploy TruthAuctionEngine
  const TruthAuctionEngine = await ethers.getContractFactory("TruthAuctionEngine");
  const auctionEngine = await TruthAuctionEngine.deploy();
  
  await auctionEngine.waitForDeployment();
  
  const auctionAddress = await auctionEngine.getAddress();
  console.log("TruthAuctionEngine deployed to:", auctionAddress);
  
  // Verify deployment
  const platformFee = await auctionEngine.platformFee();
  const auctionCounter = await auctionEngine.auctionCounter();
  
  console.log("Deployed contract verification:");
  console.log("- Platform fee:", platformFee.toString(), "basis points");
  console.log("- Initial auction counter:", auctionCounter.toString());
  console.log("- Owner:", await auctionEngine.owner());
  
  console.log("\nUpdate client/src/lib/contracts.ts with this address:");
  console.log(`auctionEngine: "${auctionAddress}",`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });