const { run } = require("hardhat");

async function main() {
  console.log("🔍 Verifying GTT Token Contract on PolygonScan...");
  
  // Contract details
  const contractAddress = "0x742d35cc6634c0532925a3b8d8e4cc14b45d4652"; // Replace with deployed address
  const treasuryWallet = "0x742d35cc6634c0532925a3b8d8e4cc14b45d4652"; // Replace with treasury address
  
  try {
    console.log("📝 Contract Address:", contractAddress);
    console.log("🏛️ Treasury Wallet:", treasuryWallet);
    
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [treasuryWallet],
      contract: "contracts/GTTToken.sol:GTTToken"
    });
    
    console.log("✅ Contract verified successfully!");
    console.log("🔗 View on PolygonScan:", `https://polygonscan.com/address/${contractAddress}#code`);
    
    console.log("\n📋 Verification Benefits:");
    console.log("- Source code visible on PolygonScan");
    console.log("- Increased investor trust");
    console.log("- Better exchange listing chances");
    console.log("- CoinGecko/CMC application requirements met");
    
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ Contract already verified!");
      console.log("🔗 View on PolygonScan:", `https://polygonscan.com/address/${contractAddress}#code`);
    } else {
      console.error("❌ Verification failed:");
      console.error(error.message);
      
      console.log("\n🔧 Troubleshooting:");
      console.log("1. Check contract address is correct");
      console.log("2. Verify constructor arguments match deployment");
      console.log("3. Ensure contract source code hasn't changed");
      console.log("4. Wait a few minutes and try again");
      console.log("5. Check PolygonScan API key in hardhat config");
    }
  }
}

main()
  .then(() => {
    console.log("\n🎯 Next Steps After Verification:");
    console.log("1. Add GTT to MetaMask:");
    console.log("   - Token Address: 0x742d35cc6634c0532925a3b8d8e4cc14b45d4652");
    console.log("   - Symbol: GTT");
    console.log("   - Decimals: 18");
    console.log("\n2. Submit to token lists:");
    console.log("   - QuickSwap default token list");
    console.log("   - Community token lists");
    console.log("   - Popular wallet token lists");
    console.log("\n3. Apply to tracking sites:");
    console.log("   - CoinGecko: coingecko.com/en/coins/new");
    console.log("   - CoinMarketCap: coinmarketcap.com/request");
    console.log("   - DexTools: dextools.io");
    console.log("\n4. Begin marketing campaign");
    
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });