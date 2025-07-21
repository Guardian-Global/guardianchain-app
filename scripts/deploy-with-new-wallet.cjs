const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 GUARDIANCHAIN DEPLOYMENT WITH NEW WALLET");
  console.log("============================================");
  
  // New wallet private key from screenshot
  const privateKey = "8b170cf9fdb9a9de5b1c6229ab0e8ac2fdc5198e422f8d72f6861b59edf8c7b8";
  const fullPrivateKey = "0x" + privateKey;
  
  // Create wallet to verify address
  const tempProvider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
  const wallet = new ethers.Wallet(fullPrivateKey);
  
  console.log("New Wallet Address:", wallet.address);
  console.log("Expected Address: 0x959C1e8baa6eb72a0a9f2547b59176a96dD239db");
  console.log("Address Match:", wallet.address.toLowerCase() === "0x959C1e8baa6eb72a0a9f2547b59176a96dD239db".toLowerCase() ? "✅" : "❌");
  
  // Check both Ethereum and Polygon with this wallet
  console.log("\n🔍 CHECKING BALANCES ON BOTH NETWORKS:");
  
  // Ethereum Check
  try {
    const ethProvider = new ethers.JsonRpcProvider("https://boldest-long-flower.quiknode.pro/f95e9c78a34f9c076e8ff012c98e17332758f862");
    const ethWallet = wallet.connect(ethProvider);
    const ethBalance = await ethProvider.getBalance(wallet.address);
    const ethAmount = parseFloat(ethers.formatEther(ethBalance));
    
    console.log(`\nETHEREUM MAINNET:`);
    console.log(`Balance: ${ethAmount.toFixed(6)} ETH`);
    console.log(`USD Value: ~$${(ethAmount * 4200).toFixed(2)}`);
    
    if (ethAmount >= 0.003) {
      console.log("✅ Sufficient ETH for deployment!");
      
      console.log("\n🚀 DEPLOYING TO ETHEREUM MAINNET...");
      
      // Deploy GTT Token to Ethereum
      const GTTToken = await ethers.getContractFactory("SimpleGTTToken", ethWallet);
      
      const deployTx = await GTTToken.deploy(
        wallet.address, // treasury
        wallet.address, // yieldPool
        {
          gasLimit: 1000000n,
          gasPrice: ethers.parseUnits("2", "gwei") // Ultra-low gas
        }
      );
      
      const txHash = deployTx.deploymentTransaction().hash;
      console.log("📤 Transaction Hash:", txHash);
      console.log("⏳ Waiting for confirmation...");
      
      await deployTx.waitForDeployment();
      const tokenAddress = await deployTx.getAddress();
      
      console.log("\n🎉 GTT TOKEN DEPLOYED ON ETHEREUM MAINNET!");
      console.log("Contract Address:", tokenAddress);
      console.log("Etherscan:", `https://etherscan.io/address/${tokenAddress}`);
      console.log("Transaction:", `https://etherscan.io/tx/${txHash}`);
      
      const finalBalance = await ethProvider.getBalance(wallet.address);
      const gasUsed = ethBalance - finalBalance;
      
      console.log("Gas Used:", ethers.formatEther(gasUsed), "ETH");
      console.log("Remaining:", ethers.formatEther(finalBalance), "ETH");
      
      return {
        success: true,
        network: "Ethereum Mainnet",
        tokenAddress: tokenAddress,
        txHash: txHash,
        gasUsed: ethers.formatEther(gasUsed),
        remaining: ethers.formatEther(finalBalance)
      };
    }
    
  } catch (ethError) {
    console.log("❌ Ethereum check failed:", ethError.message.substring(0, 50));
  }
  
  // Polygon Check
  try {
    const polyProvider = new ethers.JsonRpcProvider("https://chaotic-cosmopolitan-tab.matic.quiknode.pro/a62225077279679a5957c8304e1c7042baec8c11");
    const polyWallet = wallet.connect(polyProvider);
    const polyBalance = await polyProvider.getBalance(wallet.address);
    const maticAmount = parseFloat(ethers.formatEther(polyBalance));
    
    console.log(`\nPOLYGON MAINNET:`);
    console.log(`Balance: ${maticAmount.toFixed(6)} MATIC`);
    console.log(`USD Value: ~$${(maticAmount * 0.26).toFixed(2)}`);
    
    if (maticAmount >= 0.05) {
      console.log("✅ Sufficient MATIC for deployment!");
      
      console.log("\n🚀 DEPLOYING TO POLYGON MAINNET...");
      
      // Deploy GTT Token to Polygon
      const GTTToken = await ethers.getContractFactory("SimpleGTTToken", polyWallet);
      
      const deployTx = await GTTToken.deploy(
        wallet.address, // treasury
        wallet.address, // yieldPool
        {
          gasLimit: 1200000n,
          gasPrice: ethers.parseUnits("30", "gwei")
        }
      );
      
      const txHash = deployTx.deploymentTransaction().hash;
      console.log("📤 Transaction Hash:", txHash);
      console.log("⏳ Waiting for confirmation...");
      
      await deployTx.waitForDeployment();
      const tokenAddress = await deployTx.getAddress();
      
      console.log("\n🎉 GTT TOKEN DEPLOYED ON POLYGON MAINNET!");
      console.log("Contract Address:", tokenAddress);
      console.log("PolygonScan:", `https://polygonscan.com/address/${tokenAddress}`);
      console.log("Transaction:", `https://polygonscan.com/tx/${txHash}`);
      
      const finalBalance = await polyProvider.getBalance(wallet.address);
      const gasUsed = polyBalance - finalBalance;
      
      console.log("Gas Used:", ethers.formatEther(gasUsed), "MATIC");
      console.log("Remaining:", ethers.formatEther(finalBalance), "MATIC");
      
      return {
        success: true,
        network: "Polygon Mainnet",
        tokenAddress: tokenAddress,
        txHash: txHash,
        gasUsed: ethers.formatEther(gasUsed),
        remaining: ethers.formatEther(finalBalance)
      };
    }
    
  } catch (polyError) {
    console.log("❌ Polygon check failed:", polyError.message.substring(0, 50));
  }
  
  console.log("\n❌ Insufficient funds on both networks for deployment");
  return { success: false };
}

main()
  .then((result) => {
    if (result && result.success) {
      console.log("\n🌟 GUARDIANCHAIN SMART CONTRACT DEPLOYED!");
      console.log("🎯 Network:", result.network);
      console.log("🎯 Token Address:", result.tokenAddress);
      console.log("💰 Gas Used:", result.gasUsed);
      console.log("💰 Remaining:", result.remaining);
      console.log("\n🚀 PLATFORM + SMART CONTRACTS = COMPLETE!");
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Deployment Failed:", error.message);
    process.exit(1);
  });