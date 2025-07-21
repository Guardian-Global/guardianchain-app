const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 GUARDIANCHAIN FINAL ETHEREUM DEPLOYMENT");
  console.log("==========================================");
  
  // Use multiple fallback providers
  const providers = [
    "https://eth.llamarpc.com",
    "https://ethereum.publicnode.com",
    "https://cloudflare-eth.com"
  ];
  
  let provider;
  let wallet;
  
  // Try providers until one works
  for (const rpcUrl of providers) {
    try {
      provider = new ethers.JsonRpcProvider(rpcUrl);
      await provider.getBlockNumber(); // Test connection
      wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
      console.log("✅ Connected via:", rpcUrl);
      break;
    } catch (error) {
      console.log("❌ Failed:", rpcUrl.substring(0, 30) + "...");
      continue;
    }
  }
  
  if (!wallet) {
    throw new Error("All RPC providers failed");
  }
  
  console.log("Deployer:", wallet.address);
  
  const balance = await wallet.provider.getBalance(wallet.address);
  console.log("ETH Balance:", ethers.formatEther(balance), "ETH");
  
  const network = await provider.getNetwork();
  console.log("Network: Ethereum Chain ID:", network.chainId.toString());
  
  try {
    console.log("\n🚀 Deploying GTT Token with minimal gas...");
    
    const GTTToken = await ethers.getContractFactory("SimpleGTTToken", wallet);
    
    // Ultra-conservative gas settings for your limited ETH
    const deploymentTx = await GTTToken.deploy(
      wallet.address, // treasury  
      wallet.address, // yieldPool
      {
        gasLimit: 800000,  // Reduced gas limit
        gasPrice: ethers.parseUnits("1.5", "gwei"), // Very low gas price
        type: 0 // Legacy transaction type
      }
    );
    
    console.log("📤 Transaction sent:", deploymentTx.deploymentTransaction()?.hash);
    console.log("⏳ Waiting for confirmation (this may take several minutes due to low gas)...");
    
    await deploymentTx.waitForDeployment();
    const tokenAddress = await deploymentTx.getAddress();
    
    console.log("\n🎉 SUCCESS! GUARDIANCHAIN GTT TOKEN DEPLOYED!");
    console.log("============================================");
    console.log("Contract Address:", tokenAddress);
    console.log("Transaction Hash:", deploymentTx.deploymentTransaction()?.hash);
    console.log("Etherscan Link: https://etherscan.io/address/" + tokenAddress);
    console.log("Transaction Link: https://etherscan.io/tx/" + deploymentTx.deploymentTransaction()?.hash);
    
    // Check remaining balance
    const finalBalance = await wallet.provider.getBalance(wallet.address);
    console.log("Remaining ETH:", ethers.formatEther(finalBalance), "ETH");
    console.log("Gas Used:", ethers.formatEther(balance - finalBalance), "ETH");
    
    console.log("\n🌟 GUARDIANCHAIN IS NOW LIVE ON ETHEREUM MAINNET!");
    
    return {
      tokenAddress,
      txHash: deploymentTx.deploymentTransaction()?.hash,
      deployer: wallet.address,
      gasUsed: ethers.formatEther(balance - finalBalance)
    };
    
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    console.log("\nDebugging info:");
    console.log("- Error type:", error.code);
    console.log("- Your balance:", ethers.formatEther(balance), "ETH");
    
    // Calculate exact cost needed
    const gasNeeded = 800000n * ethers.parseUnits("1.5", "gwei");
    console.log("- Gas cost needed:", ethers.formatEther(gasNeeded), "ETH");
    
    if (balance < gasNeeded) {
      console.log("❌ Insufficient funds. Need", ethers.formatEther(gasNeeded - balance), "more ETH");
    }
    
    throw error;
  }
}

main()
  .then((result) => {
    console.log("\n🎯 DEPLOYMENT COMPLETE!");
    console.log("View on Etherscan: https://etherscan.io/address/" + result.tokenAddress);
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Deployment failed:", error.message);
    process.exit(1);
  });