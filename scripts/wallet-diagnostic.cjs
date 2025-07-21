const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 WALLET DIAGNOSTIC - FINDING YOUR MATIC");
  console.log("==========================================");
  
  const privateKey = "0xde6354f59a5448fc6df8abc332707767bd3f1f35b74f1accc053d5276e749bde";
  
  // Multiple Polygon RPC endpoints to test
  const rpcEndpoints = [
    "https://chaotic-cosmopolitan-tab.matic.quiknode.pro/a62225077279679a5957c8304e1c7042baec8c11",
    "https://polygon.llamarpc.com",
    "https://polygon-rpc.com",
    "https://rpc.ankr.com/polygon"
  ];
  
  // Create wallet from private key
  const tempProvider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
  const wallet = new ethers.Wallet(privateKey, tempProvider);
  
  console.log("Private Key Provided: ****" + privateKey.slice(-8));
  console.log("Derived Address:", wallet.address);
  console.log("Expected Address: 0x8c7C0A644Cc4C72EBD55b24b43c1290e90fF0a73");
  console.log("Address Match:", wallet.address.toLowerCase() === "0x8c7C0A644Cc4C72EBD55b24b43c1290e90fF0a73".toLowerCase() ? "✅ YES" : "❌ NO");
  
  if (wallet.address.toLowerCase() !== "0x8c7C0A644Cc4C72EBD55b24b43c1290e90fF0a73".toLowerCase()) {
    console.log("\n⚠️  ADDRESS MISMATCH DETECTED!");
    console.log("The private key generates:", wallet.address);
    console.log("But MetaMask shows:", "0x8c7C0A644Cc4C72EBD55b24b43c1290e90fF0a73");
    console.log("This explains why we can't find the MATIC funds.");
    return;
  }
  
  console.log("\n🔍 Testing RPC Endpoints for Balance...");
  
  for (const rpc of rpcEndpoints) {
    try {
      console.log(`\nTesting: ${rpc.substring(0, 50)}...`);
      const provider = new ethers.JsonRpcProvider(rpc);
      
      // Test connection
      const blockNumber = await provider.getBlockNumber();
      console.log(`✅ Connected - Block: ${blockNumber}`);
      
      // Check balance for derived address
      const balance = await provider.getBalance(wallet.address);
      const maticBalance = parseFloat(ethers.formatEther(balance));
      
      console.log(`Balance: ${maticBalance.toFixed(6)} MATIC`);
      
      if (maticBalance > 0) {
        console.log("🎉 FOUND MATIC FUNDS!");
        
        // Also check transaction count
        const txCount = await provider.getTransactionCount(wallet.address);
        console.log(`Transaction Count: ${txCount}`);
        
        return {
          foundFunds: true,
          balance: maticBalance,
          rpc: rpc,
          address: wallet.address
        };
      }
      
    } catch (error) {
      console.log(`❌ Failed: ${error.message.substring(0, 50)}...`);
    }
  }
  
  console.log("\n❌ NO MATIC FOUND on derived address");
  console.log("\n💡 POSSIBLE SOLUTIONS:");
  console.log("1. Check if MetaMask is showing a different account");
  console.log("2. Verify the private key from MetaMask (Account Details > Export Private Key)");
  console.log("3. Confirm the funds are on Polygon Mainnet (not Ethereum or testnet)");
  console.log("4. Check if the account in MetaMask matches:", wallet.address);
}

main()
  .then((result) => {
    if (result && result.foundFunds) {
      console.log("\n🚀 READY TO DEPLOY!");
      console.log(`Found ${result.balance} MATIC at ${result.address}`);
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error:", error.message);
    process.exit(1);
  });