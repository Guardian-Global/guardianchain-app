const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 GUARDIANCHAIN POLYGON MAINNET DEPLOYMENT - FINAL");
  console.log("==================================================");
  
  const privateKey = "de6354f59a5448fc6df8abc332707767bd3f1f35b74f1accc053d5276e749bde";
  const fullPrivateKey = "0x" + privateKey;
  
  // Connect to Polygon mainnet using QuikNode
  const polygonRpc = "https://chaotic-cosmopolitan-tab.matic.quiknode.pro/a62225077279679a5957c8304e1c7042baec8c11";
  const provider = new ethers.JsonRpcProvider(polygonRpc);
  const wallet = new ethers.Wallet(fullPrivateKey, provider);
  
  console.log("Deployer Address:", wallet.address);
  console.log("Expected Address: 0x8c7C0A644Cc4C72EBD55b24b43c1290e90fF0a73");
  console.log("Address Match:", wallet.address.toLowerCase() === "0x8c7C0A644Cc4C72EBD55b24b43c1290e90fF0a73".toLowerCase() ? "✅" : "❌");
  
  try {
    // Check balance
    const balance = await provider.getBalance(wallet.address);
    const maticBalance = parseFloat(ethers.formatEther(balance));
    
    console.log("MATIC Balance:", maticBalance.toFixed(6), "MATIC");
    console.log("USD Value: ~$" + (maticBalance * 0.26).toFixed(2)); // Current MATIC price
    
    if (maticBalance < 0.05) {
      console.log("⚠️ Balance seems low, but proceeding with deployment...");
    }
    
    // Get network info
    const network = await provider.getNetwork();
    console.log("Network: Polygon Chain ID", network.chainId.toString());
    
    // Get current gas price
    const feeData = await provider.getFeeData();
    console.log("Current Gas Price:", ethers.formatUnits(feeData.gasPrice, "gwei"), "gwei");
    
    // Use reasonable gas settings
    const gasLimit = 1200000n;
    const gasPrice = ethers.parseUnits("30", "gwei"); // 30 gwei
    const deploymentCost = gasLimit * gasPrice;
    
    console.log("Gas Price:", ethers.formatUnits(gasPrice, "gwei"), "gwei");
    console.log("Estimated Cost:", ethers.formatEther(deploymentCost), "MATIC");
    
    console.log("\n🚀 Deploying GTT Token to Polygon...");
    
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
    
    console.log("\n🎉 GTT TOKEN DEPLOYED ON POLYGON MAINNET!");
    console.log("==========================================");
    console.log("Contract Address:", tokenAddress);
    console.log("Transaction Hash:", txHash);
    console.log("Network: Polygon Mainnet (137)");
    
    // Check final balance
    const finalBalance = await provider.getBalance(wallet.address);
    const gasUsed = balance - finalBalance;
    
    console.log("Gas Used:", ethers.formatEther(gasUsed), "MATIC");
    console.log("Remaining:", ethers.formatEther(finalBalance), "MATIC");
    
    console.log("\n🔗 POLYGONSCAN LINKS:");
    console.log("Contract:", `https://polygonscan.com/address/${tokenAddress}`);
    console.log("Transaction:", `https://polygonscan.com/tx/${txHash}`);
    
    // Try TruthVault if enough gas remaining
    const vaultCost = 800000n * gasPrice;
    if (finalBalance >= vaultCost) {
      try {
        console.log("\n⚡ Deploying Truth Vault...");
        
        const TruthVault = await ethers.getContractFactory("TruthVault", wallet);
        const vaultTx = await TruthVault.deploy(
          tokenAddress,
          wallet.address,
          {
            gasLimit: 800000n,
            gasPrice: gasPrice
          }
        );
        
        await vaultTx.waitForDeployment();
        const vaultAddress = await vaultTx.getAddress();
        
        console.log("✅ Truth Vault deployed:", vaultAddress);
        console.log("PolygonScan:", `https://polygonscan.com/address/${vaultAddress}`);
        
        const finalFinalBalance = await provider.getBalance(wallet.address);
        const totalGasUsed = balance - finalFinalBalance;
        
        console.log("\n🎉 GUARDIANCHAIN FULLY DEPLOYED ON POLYGON!");
        console.log("============================================");
        console.log("GTT Token:      ", tokenAddress);
        console.log("Truth Vault:    ", vaultAddress);
        console.log("Total Gas Used: ", ethers.formatEther(totalGasUsed), "MATIC");
        console.log("Remaining:      ", ethers.formatEther(finalFinalBalance), "MATIC");
        
        return {
          success: true,
          gttToken: tokenAddress,
          truthVault: vaultAddress,
          txHash: txHash,
          gasUsed: ethers.formatEther(totalGasUsed),
          remaining: ethers.formatEther(finalFinalBalance),
          network: "Polygon Mainnet"
        };
        
      } catch (vaultError) {
        console.log("⚠️ TruthVault deployment failed:", vaultError.message);
      }
    } else {
      console.log("⚠️ Insufficient gas for TruthVault, but GTT Token is live!");
    }
    
    return {
      success: true,
      gttToken: tokenAddress,
      txHash: txHash,
      gasUsed: ethers.formatEther(gasUsed),
      remaining: ethers.formatEther(finalBalance),
      network: "Polygon Mainnet"
    };
    
  } catch (error) {
    console.error("❌ Deployment Error:", error.message);
    
    if (error.message.includes("insufficient funds")) {
      console.log("💡 Current balance may be too low for deployment");
    } else if (error.message.includes("nonce")) {
      console.log("💡 Nonce error - transaction may have been processed");
    }
    
    throw error;
  }
}

main()
  .then((result) => {
    if (result && result.success) {
      console.log("\n🌟 GUARDIANCHAIN IS NOW LIVE ON POLYGON MAINNET!");
      console.log("🎯 GTT Token Address:", result.gttToken);
      console.log("🔗 View on PolygonScan:", `https://polygonscan.com/address/${result.gttToken}`);
      console.log("💰 Gas Used:", result.gasUsed, "MATIC");
      console.log("💰 Remaining:", result.remaining, "MATIC");
      console.log("\n🚀 READY FOR $25M-75M MARKET CAP LAUNCH!");
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Deployment Failed:", error.message);
    process.exit(1);
  });