const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 CHECKING ETHEREUM MAINNET FOR YOUR FUNDS");
  console.log("===========================================");
  
  const walletAddress = "0x959C1E8Baa6EB72A0A9F2547B59176a96dD239db";
  console.log("Wallet:", walletAddress);
  
  // Check Ethereum mainnet
  try {
    console.log("\n📡 ETHEREUM MAINNET:");
    const ethProvider = new ethers.JsonRpcProvider("https://eth.llamarpc.com");
    
    // Get ETH balance
    const ethBalance = await ethProvider.getBalance(walletAddress);
    console.log(`ETH Balance: ${ethers.formatEther(ethBalance)} ETH`);
    
    // Get transaction count on Ethereum
    const ethTxCount = await ethProvider.getTransactionCount(walletAddress);
    console.log(`ETH Transaction Count: ${ethTxCount}`);
    
    if (parseFloat(ethers.formatEther(ethBalance)) > 0) {
      console.log("✅ FOUND FUNDS ON ETHEREUM MAINNET!");
      const usdValue = parseFloat(ethers.formatEther(ethBalance)) * 3800; // Rough ETH price
      console.log(`Estimated Value: $${usdValue.toFixed(2)} USD`);
    }
    
    // Check for WETH balance (common ERC-20)
    const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; // WETH contract
    const wethABI = [
      "function balanceOf(address owner) view returns (uint256)",
      "function decimals() view returns (uint8)"
    ];
    
    try {
      const wethContract = new ethers.Contract(wethAddress, wethABI, ethProvider);
      const wethBalance = await wethContract.balanceOf(walletAddress);
      const wethFormatted = ethers.formatEther(wethBalance);
      console.log(`WETH Balance: ${wethFormatted} WETH`);
      
      if (parseFloat(wethFormatted) > 0) {
        console.log("✅ FOUND WETH TOKENS!");
        const wethUsd = parseFloat(wethFormatted) * 3800;
        console.log(`WETH Value: $${wethUsd.toFixed(2)} USD`);
      }
    } catch (error) {
      console.log("Could not check WETH balance");
    }
    
  } catch (error) {
    console.log("❌ Ethereum check failed:", error.message);
  }
  
  // Also check Polygon one more time
  try {
    console.log("\n📡 POLYGON MAINNET:");
    const polyProvider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
    
    const polyBalance = await polyProvider.getBalance(walletAddress);
    console.log(`MATIC Balance: ${ethers.formatEther(polyBalance)} MATIC`);
    
    const polyTxCount = await polyProvider.getTransactionCount(walletAddress);
    console.log(`Polygon Transaction Count: ${polyTxCount}`);
    
  } catch (error) {
    console.log("❌ Polygon check failed:", error.message);
  }
  
  console.log("\n📊 SUMMARY:");
  console.log("If funds are found on Ethereum mainnet, you'll need to:");
  console.log("1. Bridge some ETH to Polygon for deployment, OR");
  console.log("2. Deploy on Ethereum mainnet instead, OR"); 
  console.log("3. Use a different wallet that has MATIC on Polygon");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("Error:", error.message);
    process.exit(1);
  });