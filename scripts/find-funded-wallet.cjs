const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 SEARCHING FOR YOUR FUNDED WALLET");
  console.log("===================================");
  
  // The wallet we've been checking (empty)
  const knownEmpty = "0x959C1E8Baa6EB72A0A9F2547B59176a96dD239db";
  console.log("Known empty wallet:", knownEmpty);
  
  // Check if there are common variations or related addresses
  const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
  
  // From your screenshots, I could see the wallet address partially
  // Let me try some potential variations or check if there's a checksum issue
  const potentialAddresses = [
    "0x959C1E8Baa6EB72A0A9F2547B59176a96dD239db", // Current (empty)
    "0x959c1e8baa6eb72a0a9f2547b59176a96dd239db", // Lowercase
    "0x959C1e8baa6eb72a0a9f2547b59176a96dd239db", // Mixed case from screenshot
  ];
  
  console.log("\n📊 Checking all potential addresses:");
  
  for (const address of potentialAddresses) {
    try {
      console.log(`\n🔍 Checking: ${address}`);
      
      // Get MATIC balance
      const balance = await provider.getBalance(address);
      const maticBalance = ethers.formatEther(balance);
      console.log(`MATIC Balance: ${maticBalance}`);
      
      // Get transaction count
      const txCount = await provider.getTransactionCount(address);
      console.log(`Transaction Count: ${txCount}`);
      
      // If this wallet has transactions, check recent activity
      if (txCount > 0) {
        console.log("✅ WALLET HAS ACTIVITY - This could be your funded wallet!");
        
        // Get latest transactions
        try {
          const latestBlock = await provider.getBlockNumber();
          console.log(`Latest block: ${latestBlock}`);
          
          // Check last few blocks for transactions from this address
          for (let i = 0; i < 10; i++) {
            const block = await provider.getBlock(latestBlock - i, true);
            if (block && block.transactions) {
              for (const tx of block.transactions) {
                if (tx.from && tx.from.toLowerCase() === address.toLowerCase()) {
                  console.log(`Found recent transaction: ${tx.hash}`);
                  console.log(`Value: ${ethers.formatEther(tx.value)} MATIC`);
                }
              }
            }
          }
        } catch (error) {
          console.log("Could not fetch recent transactions");
        }
      } else {
        console.log("❌ Empty wallet");
      }
      
    } catch (error) {
      console.log(`Error checking ${address}:`, error.message);
    }
  }
  
  console.log("\n📝 ANALYSIS:");
  console.log("Based on your MetaMask screenshots showing $18.81 USD:");
  console.log("- 0.005 WETH (worth ~$18)")
  console.log("- 0 POL tokens");
  console.log("This suggests your funds might be:");
  console.log("1. On Ethereum mainnet instead of Polygon");
  console.log("2. In a different wallet address entirely");
  console.log("3. The screenshots show a different account than the private key provided");
  
  console.log("\n💡 RECOMMENDATION:");
  console.log("Check your MetaMask for the exact address that shows the $18.81 balance");
  console.log("It may be a different account than the GUARDIANCHAIN wallet");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("Error:", error.message);
    process.exit(1);
  });