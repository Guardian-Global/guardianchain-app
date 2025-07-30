const hre = require("hardhat");

async function main() {
  console.log("🔍 CHECKING DEPLOYMENT WALLET STATUS");
  console.log("=====================================");

  try {
    // Get deployer account
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deployer Address:", deployer.address);

    // Check balance
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    const balanceInMatic = hre.ethers.formatEther(balance);
    
    console.log("MATIC Balance:", balanceInMatic, "MATIC");
    console.log("USD Value (~$1 per MATIC):", "$" + (parseFloat(balanceInMatic) * 1).toFixed(4));

    // Network info
    const network = await hre.ethers.provider.getNetwork();
    console.log("Network:", network.name);
    console.log("Chain ID:", network.chainId.toString());

    // Deployment feasibility
    const deploymentCost = 0.02; // Estimated in MATIC
    console.log("\n💰 DEPLOYMENT ANALYSIS:");
    console.log("Estimated Gas Cost: ~0.02 MATIC");
    console.log("Current Balance:", balanceInMatic, "MATIC");

    if (parseFloat(balanceInMatic) >= deploymentCost) {
      console.log("✅ READY FOR DEPLOYMENT!");
      console.log("Sufficient funds available for GTT token deployment");
    } else {
      console.log("❌ INSUFFICIENT FUNDS");
      console.log("Need additional:", (deploymentCost - parseFloat(balanceInMatic)).toFixed(4), "MATIC");
      console.log("Fund this address:", deployer.address);
    }

    console.log("\n🌐 FUNDING OPTIONS:");
    console.log("1. Send MATIC directly to:", deployer.address);
    console.log("2. Bridge from other chains via Polygon Bridge");
    console.log("3. Buy MATIC on exchange and withdraw to wallet");

  } catch (error) {
    console.error("❌ Error checking wallet:", error);
  }
}

main().catch(console.error);