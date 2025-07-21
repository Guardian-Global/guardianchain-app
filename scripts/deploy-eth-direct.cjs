const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 GUARDIANCHAIN ETHEREUM MAINNET DIRECT DEPLOYMENT");
  console.log("==================================================");
  
  // Create direct Ethereum provider
  const provider = new ethers.JsonRpcProvider("https://eth.llamarpc.com");
  const privateKey = process.env.PRIVATE_KEY;
  
  if (!privateKey) {
    throw new Error("PRIVATE_KEY not found in environment");
  }
  
  const wallet = new ethers.Wallet(privateKey, provider);
  console.log("Deploying with account:", wallet.address);
  
  // Check balance
  const balance = await wallet.provider.getBalance(wallet.address);
  console.log("ETH Balance:", ethers.formatEther(balance), "ETH");
  console.log("USD Value (approx):", (parseFloat(ethers.formatEther(balance)) * 3800).toFixed(2));
  
  // Get network info
  const network = await provider.getNetwork();
  console.log("Network:", network.name, "Chain ID:", network.chainId.toString());
  
  // Get current gas price
  const feeData = await provider.getFeeData();
  console.log("Current gas price:", ethers.formatUnits(feeData.gasPrice, "gwei"), "gwei");
  
  try {
    console.log("\n1️⃣ Deploying GTT Token Contract...");
    
    // Get contract factory
    const GTTToken = await ethers.getContractFactory("SimpleGTTToken", wallet);
    
    // Deploy with specific gas settings
    const gttToken = await GTTToken.deploy(
      wallet.address, // treasury
      wallet.address, // yieldPool
      {
        gasLimit: 1200000,
        gasPrice: ethers.parseUnits("12", "gwei") // Lower gas price
      }
    );
    
    console.log("⏳ Waiting for deployment confirmation...");
    await gttToken.waitForDeployment();
    const tokenAddress = await gttToken.getAddress();
    
    console.log("✅ GTT Token deployed to:", tokenAddress);
    console.log("📊 Transaction hash:", gttToken.deploymentTransaction()?.hash);
    
    // Check remaining balance
    const remainingBalance = await wallet.provider.getBalance(wallet.address);
    console.log("Remaining ETH:", ethers.formatEther(remainingBalance), "ETH");
    
    console.log("\n🎉 GUARDIANCHAIN GTT TOKEN IS LIVE ON ETHEREUM MAINNET!");
    console.log("====================================================");
    console.log("Contract Address:", tokenAddress);
    console.log("Deployer:", wallet.address);
    console.log("Network: Ethereum Mainnet (1)");
    console.log("Etherscan:", `https://etherscan.io/address/${tokenAddress}`);
    
    return {
      gttToken: tokenAddress,
      deployer: wallet.address,
      txHash: gttToken.deploymentTransaction()?.hash
    };
    
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    
    if (error.message.includes("insufficient funds")) {
      console.log("\n💡 Gas fee estimation:");
      const gasLimit = 1200000;
      const gasPrice = ethers.parseUnits("12", "gwei");
      const cost = BigInt(gasLimit) * gasPrice;
      console.log("Deployment cost:", ethers.formatEther(cost), "ETH");
      console.log("Your balance:", ethers.formatEther(balance), "ETH");
    }
    
    throw error;
  }
}

main()
  .then((result) => {
    console.log("\n🚀 DEPLOYMENT COMPLETE - GUARDIANCHAIN LIVE!");
    console.log("Token Address:", result.gttToken);
    console.log("Transaction:", `https://etherscan.io/tx/${result.txHash}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });