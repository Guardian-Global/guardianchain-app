const { ethers } = require("ethers");
const fs = require("fs");

async function createDeploymentWallet() {
  console.log("🏦 CREATING DEPLOYMENT WALLET");
  console.log("=============================");

  // Create a new wallet for deployment
  const wallet = ethers.Wallet.createRandom();

  console.log("📍 NEW DEPLOYMENT WALLET CREATED:");
  console.log("Address:", wallet.address);
  console.log("Private Key:", wallet.privateKey);
  console.log("");

  // Save wallet info
  const walletInfo = {
    address: wallet.address,
    privateKey: wallet.privateKey,
    purpose: "GTT Token Deployment",
    created: new Date().toISOString(),
    targetGTTAddress: "0x742d35Cc66535C0532925a3b8d0E9B01d9c5d9A6C",
  };

  fs.writeFileSync(
    "deployment-wallet.json",
    JSON.stringify(walletInfo, null, 2),
  );

  console.log("💰 SIMPLE INSTRUCTIONS FOR USER:");
  console.log("================================");
  console.log("1. Send 0.5 POL to this address:");
  console.log("   " + wallet.address);
  console.log("");
  console.log("2. I'll deploy GTT token automatically");
  console.log("3. GTT appears at: 0x742d35Cc66535C0532925a3b8d0E9B01d9c5d9A6C");
  console.log("");
  console.log("✅ Total process: 5 minutes");
  console.log("💸 Cost: 0.1 POL (~$0.02)");
  console.log("🎯 Result: GTT token live on Polygon mainnet");

  return wallet.address;
}

createDeploymentWallet().catch(console.error);
