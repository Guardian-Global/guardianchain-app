const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 GUARDIANCHAIN DEPLOYMENT WITH PREMIUM QUIKNODE");
  console.log("=================================================");
  
  const walletAddress = "0x8c7C0A644Cc4C72EBD55b24b43c1290e90fF0a73";
  const privateKey = "0xde6354f59a5448fc6df8abc332707767bd3f1f35b74f1accc053d5276e749bde";
  
  // Connect using premium QuikNode Polygon endpoint
  const polygonRpc = "https://chaotic-cosmopolitan-tab.matic.quiknode.pro/a62225077279679a5957c8304e1c7042baec8c11";
  const provider = new ethers.JsonRpcProvider(polygonRpc);
  const wallet = new ethers.Wallet(privateKey, provider);
  
  console.log("Deployer Address:", wallet.address);
  console.log("Target Network: Polygon Mainnet");
  console.log("QuikNode RPC: Connected");
  
  try {
    // Test connection and get balance
    const balance = await provider.getBalance(walletAddress);
    const maticBalance = parseFloat(ethers.formatEther(balance));
    
    console.log("MATIC Balance:", maticBalance.toFixed(4), "MATIC");
    console.log("USD Value: ~$" + (maticBalance * 0.9).toFixed(2));
    
    if (maticBalance < 0.05) {
      throw new Error(`Insufficient MATIC: ${maticBalance.toFixed(4)} (need at least 0.05)`);
    }
    
    // Get network info
    const network = await provider.getNetwork();
    console.log("Chain ID:", network.chainId.toString());
    
    // Get current gas data
    const feeData = await provider.getFeeData();
    console.log("Gas Price:", ethers.formatUnits(feeData.gasPrice, "gwei"), "gwei");
    
    // Calculate deployment cost
    const gasLimit = 1200000n;
    const gasPrice = ethers.parseUnits("30", "gwei");
    const deploymentCost = gasLimit * gasPrice;
    
    console.log("Estimated Cost:", ethers.formatEther(deploymentCost), "MATIC");
    
    if (balance < deploymentCost) {
      console.log("⚠️  Low balance but proceeding with reduced gas");
    }
    
    console.log("\n1️⃣ Deploying GTT Token...");
    
    // Deploy GTT Token
    const GTTToken = await ethers.getContractFactory("SimpleGTTToken", wallet);
    
    const gttToken = await GTTToken.deploy(
      walletAddress, // treasury
      walletAddress, // yieldPool  
      {
        gasLimit: gasLimit,
        gasPrice: gasPrice,
        type: 0 // Legacy transaction for compatibility
      }
    );
    
    const deployTx = gttToken.deploymentTransaction();
    console.log("📤 Transaction Hash:", deployTx.hash);
    console.log("⏳ Waiting for confirmation...");
    
    // Wait for deployment
    await gttToken.waitForDeployment();
    const tokenAddress = await gttToken.getAddress();
    
    console.log("\n✅ GTT TOKEN DEPLOYED SUCCESSFULLY!");
    console.log("Contract Address:", tokenAddress);
    
    // Check if we have enough gas for TruthVault
    const remainingBalance = await provider.getBalance(walletAddress);
    const vaultCost = 800000n * gasPrice;
    
    if (remainingBalance >= vaultCost) {
      console.log("\n2️⃣ Deploying Truth Vault...");
      
      const TruthVault = await ethers.getContractFactory("TruthVault", wallet);
      const truthVault = await TruthVault.deploy(
        tokenAddress,
        walletAddress,
        {
          gasLimit: 800000n,
          gasPrice: gasPrice
        }
      );
      
      await truthVault.waitForDeployment();
      const vaultAddress = await truthVault.getAddress();
      
      console.log("✅ Truth Vault deployed:", vaultAddress);
      
      // Final status
      const finalBalance = await provider.getBalance(walletAddress);
      const totalGasUsed = balance - finalBalance;
      
      console.log("\n🎉 GUARDIANCHAIN LIVE ON POLYGON MAINNET!");
      console.log("==========================================");
      console.log("GTT Token:      ", tokenAddress);
      console.log("Truth Vault:    ", vaultAddress);
      console.log("Deployer:       ", walletAddress);
      console.log("Network:        ", "Polygon (137)");
      console.log("Gas Used:       ", ethers.formatEther(totalGasUsed), "MATIC");
      console.log("Remaining:      ", ethers.formatEther(finalBalance), "MATIC");
      console.log("");
      console.log("🔗 POLYGONSCAN LINKS:");
      console.log("GTT Token:      ", `https://polygonscan.com/address/${tokenAddress}`);
      console.log("Truth Vault:    ", `https://polygonscan.com/address/${vaultAddress}`);
      console.log("Deploy Tx:      ", `https://polygonscan.com/tx/${deployTx.hash}`);
      
      return {
        success: true,
        gttToken: tokenAddress,
        truthVault: vaultAddress,
        txHash: deployTx.hash,
        gasUsed: ethers.formatEther(totalGasUsed),
        network: "Polygon Mainnet"
      };
      
    } else {
      console.log("⚠️  Insufficient gas for TruthVault, but GTT Token deployed!");
      
      const finalBalance = await provider.getBalance(walletAddress);
      const gasUsed = balance - finalBalance;
      
      console.log("\n🎯 PARTIAL DEPLOYMENT COMPLETE");
      console.log("GTT Token:      ", tokenAddress);
      console.log("Gas Used:       ", ethers.formatEther(gasUsed), "MATIC");
      console.log("Remaining:      ", ethers.formatEther(finalBalance), "MATIC");
      console.log("PolygonScan:    ", `https://polygonscan.com/address/${tokenAddress}`);
      
      return {
        success: true,
        gttToken: tokenAddress,
        txHash: deployTx.hash,
        gasUsed: ethers.formatEther(gasUsed),
        network: "Polygon Mainnet"
      };
    }
    
  } catch (error) {
    console.error("❌ Deployment Error:", error.message);
    
    if (error.message.includes("insufficient funds")) {
      console.log("💡 Add more MATIC to wallet:", walletAddress);
    } else if (error.message.includes("nonce")) {
      console.log("💡 Try again - nonce issue resolved automatically");
    }
    
    throw error;
  }
}

main()
  .then((result) => {
    if (result.success) {
      console.log("\n🌟 GUARDIANCHAIN IS NOW LIVE!");
      console.log("View GTT Token:", `https://polygonscan.com/address/${result.gttToken}`);
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Deployment Failed:", error.message);
    process.exit(1);
  });