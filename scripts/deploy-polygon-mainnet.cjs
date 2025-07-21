const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 GUARDIANCHAIN POLYGON MAINNET DEPLOYMENT");
  console.log("===========================================");
  
  const walletAddress = "0x8c7C0A644Cc4C72EBD55b24b43c1290e90fF0a73";
  const privateKey = "0xde6354f59a5448fc6df8abc332707767bd3f1f35b74f1accc053d5276e749bde";
  
  // Connect to Polygon mainnet
  const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
  const wallet = new ethers.Wallet(privateKey, provider);
  
  console.log("Deployer:", wallet.address);
  
  // Check balance
  const balance = await provider.getBalance(wallet.address);
  console.log("MATIC Balance:", ethers.formatEther(balance), "MATIC");
  console.log("USD Value:", (parseFloat(ethers.formatEther(balance)) * 0.9).toFixed(2));
  
  // Get network info
  const network = await provider.getNetwork();
  console.log("Network: Polygon Chain ID:", network.chainId.toString());
  
  // Get current gas price
  const feeData = await provider.getFeeData();
  console.log("Current gas price:", ethers.formatUnits(feeData.gasPrice, "gwei"), "gwei");
  
  // Calculate deployment cost
  const gasLimit = 1200000n;
  const gasPrice = ethers.parseUnits("25", "gwei"); // Conservative gas price
  const deploymentCost = gasLimit * gasPrice;
  
  console.log("Estimated cost:", ethers.formatEther(deploymentCost), "MATIC");
  console.log("Remaining after:", ethers.formatEther(balance - deploymentCost), "MATIC");
  
  if (balance < deploymentCost) {
    throw new Error("Insufficient MATIC for deployment");
  }
  
  try {
    console.log("\n1️⃣ Deploying GTT Token Contract...");
    
    const GTTToken = await ethers.getContractFactory("SimpleGTTToken", wallet);
    
    const gttToken = await GTTToken.deploy(
      wallet.address, // treasury
      wallet.address, // yieldPool
      {
        gasLimit: gasLimit,
        gasPrice: gasPrice
      }
    );
    
    const txHash = gttToken.deploymentTransaction().hash;
    console.log("📤 Transaction hash:", txHash);
    console.log("⏳ Waiting for confirmation...");
    
    await gttToken.waitForDeployment();
    const tokenAddress = await gttToken.getAddress();
    
    console.log("✅ GTT Token deployed successfully!");
    console.log("Contract Address:", tokenAddress);
    
    // Deploy TruthVault
    console.log("\n2️⃣ Deploying Truth Vault...");
    
    const TruthVault = await ethers.getContractFactory("TruthVault", wallet);
    const truthVault = await TruthVault.deploy(
      tokenAddress,
      wallet.address,
      {
        gasLimit: 800000n,
        gasPrice: gasPrice
      }
    );
    
    await truthVault.waitForDeployment();
    const vaultAddress = await truthVault.getAddress();
    
    console.log("✅ Truth Vault deployed!");
    console.log("Contract Address:", vaultAddress);
    
    // Check final balance
    const finalBalance = await provider.getBalance(wallet.address);
    const gasUsed = balance - finalBalance;
    
    console.log("\n🎉 GUARDIANCHAIN DEPLOYED ON POLYGON MAINNET!");
    console.log("=============================================");
    console.log("GTT Token:     ", tokenAddress);
    console.log("Truth Vault:   ", vaultAddress);
    console.log("Deployer:      ", wallet.address);
    console.log("Network:       ", "Polygon Mainnet (137)");
    console.log("Gas Used:      ", ethers.formatEther(gasUsed), "MATIC");
    console.log("Remaining:     ", ethers.formatEther(finalBalance), "MATIC");
    console.log("");
    console.log("🔗 POLYGONSCAN LINKS:");
    console.log("GTT Token:", `https://polygonscan.com/address/${tokenAddress}`);
    console.log("Truth Vault:", `https://polygonscan.com/address/${vaultAddress}`);
    console.log("Transaction:", `https://polygonscan.com/tx/${txHash}`);
    
    return {
      gttToken: tokenAddress,
      truthVault: vaultAddress,
      deployer: wallet.address,
      txHash,
      gasUsed: ethers.formatEther(gasUsed),
      network: "Polygon Mainnet"
    };
    
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    throw error;
  }
}

main()
  .then((result) => {
    console.log("\n🌟 GUARDIANCHAIN IS LIVE ON POLYGON MAINNET!");
    console.log("View on PolygonScan:", `https://polygonscan.com/address/${result.gttToken}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });