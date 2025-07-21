const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 GUARDIANCHAIN MAINNET DEPLOYMENT - FINAL ATTEMPT");
  console.log("===================================================");
  
  // Create provider with multiple fallbacks
  let provider;
  const rpcUrls = [
    "https://cloudflare-eth.com",
    "https://ethereum.publicnode.com", 
    "https://eth.llamarpc.com"
  ];
  
  for (const url of rpcUrls) {
    try {
      provider = new ethers.JsonRpcProvider(url);
      await provider.getBlockNumber(); // Test connection
      console.log("✅ Connected to:", url);
      break;
    } catch (e) {
      console.log("❌ Failed:", url);
      continue;
    }
  }
  
  if (!provider) {
    throw new Error("No working RPC found");
  }
  
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("PRIVATE_KEY not found");
  }
  
  const wallet = new ethers.Wallet(privateKey, provider);
  console.log("Deployer:", wallet.address);
  
  const balance = await wallet.provider.getBalance(wallet.address);
  console.log("Balance:", ethers.formatEther(balance), "ETH");
  
  // Get latest gas prices
  const feeData = await provider.getFeeData();
  console.log("Network gas price:", ethers.formatUnits(feeData.gasPrice, "gwei"), "gwei");
  
  // Calculate deployment cost
  const gasLimit = 900000n; // Conservative estimate
  const gasPrice = ethers.parseUnits("2", "gwei"); // Low but reasonable
  const totalCost = gasLimit * gasPrice;
  
  console.log("Estimated cost:", ethers.formatEther(totalCost), "ETH");
  console.log("Remaining after:", ethers.formatEther(balance - totalCost), "ETH");
  
  if (balance < totalCost) {
    console.log("❌ Insufficient funds for deployment");
    console.log("Need:", ethers.formatEther(totalCost - balance), "more ETH");
    return;
  }
  
  try {
    console.log("\n🚀 Deploying GTT Token...");
    
    const GTTToken = await ethers.getContractFactory("SimpleGTTToken", wallet);
    
    // Deploy with explicit gas settings
    const gttToken = await GTTToken.deploy(
      wallet.address, // treasury
      wallet.address, // yieldPool  
      {
        gasLimit: gasLimit,
        gasPrice: gasPrice,
        type: 0 // Legacy transaction
      }
    );
    
    const txHash = gttToken.deploymentTransaction().hash;
    console.log("📤 Transaction hash:", txHash);
    console.log("⏳ Waiting for confirmation...");
    
    // Wait for deployment with timeout
    const receipt = await Promise.race([
      gttToken.waitForDeployment(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Deployment timeout")), 300000)) // 5 min timeout
    ]);
    
    const tokenAddress = await gttToken.getAddress();
    
    console.log("\n🎉 DEPLOYMENT SUCCESSFUL!");
    console.log("=========================");
    console.log("Contract:", tokenAddress);
    console.log("Transaction:", txHash);
    console.log("Etherscan:", `https://etherscan.io/address/${tokenAddress}`);
    console.log("Tx Link:", `https://etherscan.io/tx/${txHash}`);
    
    const finalBalance = await wallet.provider.getBalance(wallet.address);
    const gasUsed = balance - finalBalance;
    console.log("Gas used:", ethers.formatEther(gasUsed), "ETH");
    console.log("Remaining:", ethers.formatEther(finalBalance), "ETH");
    
    return {
      tokenAddress,
      txHash,
      deployer: wallet.address,
      gasUsed: ethers.formatEther(gasUsed)
    };
    
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    
    // Specific error handling
    if (error.message.includes("insufficient funds")) {
      console.log("💡 Try bridging more ETH to your wallet");
    } else if (error.message.includes("gas")) {
      console.log("💡 Try increasing gas price or limit");  
    } else if (error.message.includes("timeout")) {
      console.log("💡 Transaction may still be pending - check Etherscan");
    }
    
    throw error;
  }
}

main()
  .then((result) => {
    console.log("\n🌟 GUARDIANCHAIN LIVE ON ETHEREUM MAINNET!");
    console.log("Contract Address:", result.tokenAddress);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });