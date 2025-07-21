const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 GUARDIANCHAIN ETHEREUM MAINNET DEPLOYMENT");
  console.log("=============================================");
  
  const walletAddress = "0x8c7C0A644Cc4C72EBD55b24b43c1290e90fF0a73";
  const privateKey = "0xde6354f59a5448fc6df8abc332707767bd3f1f35b74f1accc053d5276e749bde";
  
  // Connect to Ethereum mainnet using QuikNode
  const ethereumRpc = "https://boldest-long-flower.quiknode.pro/f95e9c78a34f9c076e8ff012c98e17332758f862";
  const provider = new ethers.JsonRpcProvider(ethereumRpc);
  const wallet = new ethers.Wallet(privateKey, provider);
  
  console.log("Deployer Address:", wallet.address);
  console.log("Target Network: Ethereum Mainnet");
  console.log("QuikNode RPC: Connected");
  
  try {
    // Check balance
    const balance = await provider.getBalance(walletAddress);
    const ethBalance = parseFloat(ethers.formatEther(balance));
    
    console.log("ETH Balance:", ethBalance.toFixed(6), "ETH");
    console.log("USD Value: ~$" + (ethBalance * 4200).toFixed(2)); // ~$4200 per ETH
    
    if (ethBalance < 0.003) {
      throw new Error(`Insufficient ETH: ${ethBalance.toFixed(6)} (need at least 0.003)`);
    }
    
    // Get network info
    const network = await provider.getNetwork();
    console.log("Chain ID:", network.chainId.toString());
    
    // Get current gas data
    const feeData = await provider.getFeeData();
    const currentGasPrice = feeData.gasPrice;
    console.log("Current Gas Price:", ethers.formatUnits(currentGasPrice, "gwei"), "gwei");
    
    // Use conservative gas settings to preserve ETH
    const gasLimit = 1000000n;
    const gasPrice = ethers.parseUnits("1.5", "gwei"); // Ultra-low gas for conservation
    const deploymentCost = gasLimit * gasPrice;
    
    console.log("Using Gas Price:", ethers.formatUnits(gasPrice, "gwei"), "gwei (ultra-low)");
    console.log("Estimated Cost:", ethers.formatEther(deploymentCost), "ETH");
    console.log("Remaining After:", ethers.formatEther(balance - deploymentCost), "ETH");
    
    if (balance < deploymentCost) {
      throw new Error("Insufficient ETH for deployment even with ultra-low gas");
    }
    
    console.log("\n🚀 Deploying GTT Token to Ethereum Mainnet...");
    console.log("Using ultra-low gas strategy to preserve your ETH...");
    
    // Deploy GTT Token with ultra-conservative settings
    const GTTToken = await ethers.getContractFactory("SimpleGTTToken", wallet);
    
    const deployTx = await GTTToken.deploy(
      walletAddress, // treasury
      walletAddress, // yieldPool
      {
        gasLimit: gasLimit,
        gasPrice: gasPrice,
        type: 0 // Legacy transaction
      }
    );
    
    const txHash = deployTx.deploymentTransaction().hash;
    console.log("📤 Transaction Hash:", txHash);
    console.log("⏳ Waiting for confirmation (may take longer due to low gas)...");
    
    // Wait for deployment with longer timeout due to low gas
    await deployTx.waitForDeployment();
    const tokenAddress = await deployTx.getAddress();
    
    console.log("\n🎉 GTT TOKEN DEPLOYED ON ETHEREUM MAINNET!");
    console.log("===========================================");
    console.log("Contract Address:", tokenAddress);
    console.log("Transaction Hash:", txHash);
    console.log("Network: Ethereum Mainnet (Chain ID: 1)");
    
    // Check final balance
    const finalBalance = await provider.getBalance(walletAddress);
    const gasUsed = balance - finalBalance;
    
    console.log("Gas Used:", ethers.formatEther(gasUsed), "ETH");
    console.log("Remaining Balance:", ethers.formatEther(finalBalance), "ETH");
    console.log("USD Preserved: ~$" + (parseFloat(ethers.formatEther(finalBalance)) * 4200).toFixed(2));
    
    console.log("\n🔗 ETHERSCAN LINKS:");
    console.log("Contract:", `https://etherscan.io/address/${tokenAddress}`);
    console.log("Transaction:", `https://etherscan.io/tx/${txHash}`);
    
    // Try TruthVault if enough gas remaining
    const vaultCost = 600000n * gasPrice;
    if (finalBalance >= vaultCost) {
      try {
        console.log("\n⚡ Deploying Truth Vault...");
        
        const TruthVault = await ethers.getContractFactory("TruthVault", wallet);
        const vaultTx = await TruthVault.deploy(
          tokenAddress,
          walletAddress,
          {
            gasLimit: 600000n,
            gasPrice: gasPrice
          }
        );
        
        await vaultTx.waitForDeployment();
        const vaultAddress = await vaultTx.getAddress();
        
        console.log("✅ Truth Vault deployed:", vaultAddress);
        console.log("Etherscan:", `https://etherscan.io/address/${vaultAddress}`);
        
        const finalFinalBalance = await provider.getBalance(walletAddress);
        const totalGasUsed = balance - finalFinalBalance;
        
        return {
          success: true,
          gttToken: tokenAddress,
          truthVault: vaultAddress,
          txHash: txHash,
          gasUsed: ethers.formatEther(totalGasUsed),
          remaining: ethers.formatEther(finalFinalBalance),
          network: "Ethereum Mainnet"
        };
        
      } catch (vaultError) {
        console.log("⚠️ TruthVault deployment failed, but GTT Token is live!");
      }
    }
    
    return {
      success: true,
      gttToken: tokenAddress,
      txHash: txHash,
      gasUsed: ethers.formatEther(gasUsed),
      remaining: ethers.formatEther(finalBalance),
      network: "Ethereum Mainnet"
    };
    
  } catch (error) {
    console.error("❌ Deployment Error:", error.message);
    
    if (error.message.includes("insufficient funds")) {
      console.log("💡 Your ETH balance:", ethBalance.toFixed(6), "ETH");
      console.log("💡 Try reducing gas limit or wait for lower network fees");
    }
    
    throw error;
  }
}

main()
  .then((result) => {
    if (result.success) {
      console.log("\n🌟 GUARDIANCHAIN IS NOW LIVE ON ETHEREUM!");
      console.log("🎯 GTT Token Contract:", result.gttToken);
      console.log("🔗 View on Etherscan:", `https://etherscan.io/address/${result.gttToken}`);
      console.log("💰 Remaining ETH:", result.remaining);
      console.log("\n🚀 READY FOR $25M-75M MARKET CAP LAUNCH!");
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Deployment Failed:", error.message);
    process.exit(1);
  });