const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 GUARDIANCHAIN ETHEREUM MAINNET DEPLOYMENT - FINAL ATTEMPT");
  console.log("===========================================================");
  
  // Correct private key from the latest screenshot
  const privateKey = "8b170cf9fdb9a9de5b1c6229ab0e8ac2fdc5198e422f8d72f6861b59edf8c7b8";
  const fullPrivateKey = "0x" + privateKey;
  
  // Connect to Ethereum mainnet
  const ethereumRpc = "https://boldest-long-flower.quiknode.pro/f95e9c78a34f9c076e8ff012c98e17332758f862";
  const provider = new ethers.JsonRpcProvider(ethereumRpc);
  const wallet = new ethers.Wallet(fullPrivateKey, provider);
  
  console.log("Wallet Address:", wallet.address);
  console.log("Expected Address: 0x959C1e8baa6eb72a0a9f2547b59176a96dD239db");
  console.log("Address Match:", wallet.address.toLowerCase() === "0x959C1e8baa6eb72a0a9f2547b59176a96dD239db".toLowerCase() ? "✅" : "❌");
  
  try {
    // Check balance
    const balance = await provider.getBalance(wallet.address);
    const ethAmount = parseFloat(ethers.formatEther(balance));
    
    console.log("ETH Balance:", ethAmount.toFixed(6), "ETH");
    console.log("USD Value: ~$" + (ethAmount * 4200).toFixed(2));
    
    if (ethAmount < 0.002) {
      console.log("⚠️ Low ETH balance, but attempting deployment with ultra-low gas...");
    }
    
    // Get network info
    const network = await provider.getNetwork();
    console.log("Network: Ethereum Chain ID", network.chainId.toString());
    
    // Ultra-conservative gas settings
    const gasLimit = 800000n;
    const gasPrice = ethers.parseUnits("1.5", "gwei"); // Extremely low gas
    const deploymentCost = gasLimit * gasPrice;
    
    console.log("Gas Price:", ethers.formatUnits(gasPrice, "gwei"), "gwei (ultra-low)");
    console.log("Estimated Cost:", ethers.formatEther(deploymentCost), "ETH");
    
    if (balance >= deploymentCost) {
      console.log("✅ Sufficient funds for deployment!");
      
      console.log("\n🚀 Deploying GTT Token to Ethereum Mainnet...");
      
      // Deploy GTT Token
      const GTTToken = await ethers.getContractFactory("SimpleGTTToken", wallet);
      
      const deployTx = await GTTToken.deploy(
        wallet.address, // treasury
        wallet.address, // yieldPool
        {
          gasLimit: gasLimit,
          gasPrice: gasPrice
        }
      );
      
      const txHash = deployTx.deploymentTransaction().hash;
      console.log("📤 Transaction Hash:", txHash);
      console.log("⏳ Waiting for confirmation...");
      
      // Wait for deployment
      await deployTx.waitForDeployment();
      const tokenAddress = await deployTx.getAddress();
      
      console.log("\n🎉 GTT TOKEN SUCCESSFULLY DEPLOYED ON ETHEREUM MAINNET!");
      console.log("======================================================");
      console.log("Contract Address:", tokenAddress);
      console.log("Transaction Hash:", txHash);
      console.log("Network: Ethereum Mainnet (1)");
      
      // Check final balance
      const finalBalance = await provider.getBalance(wallet.address);
      const gasUsed = balance - finalBalance;
      
      console.log("Gas Used:", ethers.formatEther(gasUsed), "ETH");
      console.log("Remaining:", ethers.formatEther(finalBalance), "ETH");
      
      console.log("\n🔗 ETHERSCAN VERIFICATION:");
      console.log("Contract:", `https://etherscan.io/address/${tokenAddress}`);
      console.log("Transaction:", `https://etherscan.io/tx/${txHash}`);
      
      console.log("\n🌟 GUARDIANCHAIN IS NOW LIVE ON ETHEREUM MAINNET!");
      console.log("🎯 Platform + Smart Contracts = Complete Enterprise Solution");
      console.log("🚀 Ready for $25M-75M market cap target achievement");
      
      return {
        success: true,
        tokenAddress: tokenAddress,
        txHash: txHash,
        network: "Ethereum Mainnet",
        gasUsed: ethers.formatEther(gasUsed),
        remaining: ethers.formatEther(finalBalance)
      };
      
    } else {
      console.log("❌ Insufficient ETH for deployment");
      console.log("Need:", ethers.formatEther(deploymentCost), "ETH");
      console.log("Have:", ethers.formatEther(balance), "ETH");
      return { success: false, reason: "insufficient_funds" };
    }
    
  } catch (error) {
    console.error("❌ Deployment Error:", error.message);
    
    if (error.message.includes("insufficient funds")) {
      console.log("💡 Need more ETH for gas fees");
    } else if (error.message.includes("nonce")) {
      console.log("💡 Transaction nonce issue - may need to retry");
    } else if (error.message.includes("gas")) {
      console.log("💡 Gas estimation failed - network congestion possible");
    }
    
    return { success: false, reason: error.message };
  }
}

main()
  .then((result) => {
    if (result && result.success) {
      console.log("\n🎉 DEPLOYMENT COMPLETE!");
      console.log("Token Address:", result.tokenAddress);
      console.log("Network:", result.network);
      console.log("Gas Used:", result.gasUsed, "ETH");
      console.log("Remaining:", result.remaining, "ETH");
      console.log("\n🌟 GUARDIANCHAIN + ETHEREUM = READY FOR LAUNCH!");
    } else if (result) {
      console.log("\n⚠️ Deployment not completed:", result.reason);
      console.log("💡 Platform is still 100% operational without smart contracts");
    }
    process.exit(result && result.success ? 0 : 1);
  })
  .catch((error) => {
    console.error("\n💥 Script failed:", error.message);
    process.exit(1);
  });