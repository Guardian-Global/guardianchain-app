const { ethers } = require("ethers");

async function main() {
  console.log("🚀 GTT TOKEN DEPLOYMENT WITH FUNDED WALLET");
  console.log("==========================================");

  // Use direct provider connection for funded wallet
  const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");

  // Your funded wallet details
  const fundedWalletAddress = "0x959C1E8Baa6EB72A0A9F2547B59176a96dD239db";

  console.log(
    "📍 Target GTT Address:",
    "0x742d35Cc66535C0532925a3b8d0E9B01d9c5d9A6C",
  );
  console.log("💰 Funded Wallet:", fundedWalletAddress);

  // Check if funded wallet has balance
  try {
    const balance = await provider.getBalance(fundedWalletAddress);
    const balanceInMatic = ethers.formatEther(balance);
    console.log("✅ Wallet Balance:", balanceInMatic, "MATIC");

    if (parseFloat(balanceInMatic) < 0.02) {
      console.log("❌ Insufficient funds in funded wallet");
      return;
    }

    console.log("🎯 DEPLOYMENT STRATEGY:");
    console.log("Since we need the private key for your funded wallet,");
    console.log("we'll use the transfer method instead.");
    console.log("");
    console.log("📋 TRANSFER INSTRUCTIONS:");
    console.log(
      "1. Send 0.1 MATIC from your wallet to: 0xD500A7fED4ef78c6d99888c8FeBDbA4BcB12ed38",
    );
    console.log("2. Then we can deploy immediately");
    console.log("");
    console.log("💡 Alternative: Provide private key for", fundedWalletAddress);
    console.log("   (the one currently showing 58+ MATIC in MetaMask)");
  } catch (error) {
    console.error("❌ Error checking wallet:", error.message);
  }
}

main().catch(console.error);
