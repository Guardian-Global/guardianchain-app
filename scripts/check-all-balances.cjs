const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 COMPREHENSIVE WALLET BALANCE CHECK");
  console.log("====================================");
  
  const walletAddress = "0x959C1E8Baa6EB72A0A9F2547B59176a96dD239db";
  console.log("Checking wallet:", walletAddress);
  console.log("Time:", new Date().toISOString());
  
  // Multiple RPC providers to cross-reference
  const providers = [
    { name: "Polygon Official", url: "https://polygon-rpc.com" },
    { name: "Alchemy", url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}` },
    { name: "Chainstack", url: "https://polygon-mainnet.public.blastapi.io" },
    { name: "MaticVigil", url: "https://rpc-mainnet.matic.network" }
  ];
  
  for (const providerConfig of providers) {
    try {
      console.log(`\n📡 Checking with ${providerConfig.name}:`);
      const provider = new ethers.JsonRpcProvider(providerConfig.url);
      
      // Get MATIC balance
      const balance = await provider.getBalance(walletAddress);
      console.log(`MATIC Balance: ${ethers.formatEther(balance)} MATIC`);
      
      // Get latest block to verify connection
      const blockNumber = await provider.getBlockNumber();
      console.log(`Connected - Block: ${blockNumber}`);
      
      // Get transaction count
      const txCount = await provider.getTransactionCount(walletAddress);
      console.log(`Transaction Count: ${txCount}`);
      
      // Check if there are recent transactions
      if (txCount > 0) {
        console.log("✅ Wallet has transaction history");
      } else {
        console.log("⚠️ No transactions found");
      }
      
    } catch (error) {
      console.log(`❌ ${providerConfig.name} failed:`, error.message);
    }
  }
  
  // Also check with Etherscan API equivalent for Polygon
  console.log("\n📊 Attempting Polygonscan API check...");
  try {
    const response = await fetch(`https://api.polygonscan.com/api?module=account&action=balance&address=${walletAddress}&tag=latest`);
    const data = await response.json();
    if (data.status === "1") {
      const balance = ethers.formatEther(data.result);
      console.log(`Polygonscan MATIC Balance: ${balance} MATIC`);
    } else {
      console.log("Polygonscan API error:", data.message);
    }
  } catch (error) {
    console.log("❌ Polygonscan API failed:", error.message);
  }
  
  console.log("\n🔍 BALANCE CHECK COMPLETE");
  console.log("====================================");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("Error:", error.message);
    process.exit(1);
  });