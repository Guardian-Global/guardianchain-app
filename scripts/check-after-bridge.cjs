const { ethers } = require("ethers");

async function main() {
  console.log("🔍 CHECKING WALLET AFTER BRIDGE");
  console.log("===============================");

  const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
  const walletAddress = "0x959C1E8Baa6EB72A0A9F2547B59176a96dD239db";
  
  console.log("📍 Checking Address:", walletAddress);
  console.log("🌐 Network: Polygon Mainnet (Chain ID: 137)");
  console.log("");

  try {
    // Check current balance
    const balance = await provider.getBalance(walletAddress);
    const balanceInMatic = ethers.formatEther(balance);
    
    console.log("💰 Current MATIC Balance:", balanceInMatic);
    
    if (parseFloat(balanceInMatic) >= 0.02) {
      console.log("✅ SUFFICIENT BALANCE FOR DEPLOYMENT!");
      console.log("🚀 Ready to deploy GTT token");
      console.log("📍 Target Address: 0x742d35Cc66535C0532925a3b8d0E9B01d9c5d9A6C");
    } else {
      console.log("⏳ Need more MATIC for deployment");
      console.log("💡 Required: 0.02 MATIC minimum");
      console.log("🌉 Continue bridging from Ethereum network");
    }

    // Check network info
    const network = await provider.getNetwork();
    console.log("\n🌐 Network Info:");
    console.log("Chain ID:", network.chainId.toString());
    console.log("Network Name:", network.name);

  } catch (error) {
    console.error("❌ Error checking balance:", error.message);
  }
}

// Auto-run every 30 seconds to monitor bridge progress
main();
setInterval(() => {
  console.log("\n⏰ Checking again...");
  main();
}, 30000);