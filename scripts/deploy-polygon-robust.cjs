const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 GUARDIANCHAIN POLYGON DEPLOYMENT - ROBUST VERSION");
  console.log("==================================================");
  
  const walletAddress = "0x8c7C0A644Cc4C72EBD55b24b43c1290e90fF0a73";
  const privateKey = "0xde6354f59a5448fc6df8abc332707767bd3f1f35b74f1accc053d5276e749bde";
  
  // Try multiple Polygon RPC endpoints
  const rpcEndpoints = [
    "https://polygon.llamarpc.com",
    "https://poly-rpc.gateway.pokt.network",
    "https://polygon-rpc.com",
    "https://rpc.ankr.com/polygon",
    "https://polygon.blockpi.network/v1/rpc/public"
  ];
  
  let provider;
  let wallet;
  
  for (const rpc of rpcEndpoints) {
    try {
      console.log(`Trying RPC: ${rpc}`);
      provider = new ethers.JsonRpcProvider(rpc);
      
      // Test connection
      const blockNumber = await provider.getBlockNumber();
      console.log(`✅ Connected! Latest block: ${blockNumber}`);
      
      wallet = new ethers.Wallet(privateKey, provider);
      
      // Check balance
      const balance = await provider.getBalance(walletAddress);
      const maticBalance = parseFloat(ethers.formatEther(balance));
      
      console.log(`MATIC Balance: ${maticBalance} MATIC`);
      
      if (maticBalance > 0.05) { // Need at least 0.05 MATIC
        console.log("✅ Sufficient MATIC found!");
        break;
      } else {
        console.log("❌ Insufficient balance, trying next RPC...");
        continue;
      }
      
    } catch (error) {
      console.log(`❌ Failed: ${error.message.substring(0, 50)}...`);
      continue;
    }
  }
  
  if (!wallet) {
    throw new Error("Could not connect to Polygon or find funds");
  }
  
  const balance = await provider.getBalance(walletAddress);
  console.log("\nFinal balance check:", ethers.formatEther(balance), "MATIC");
  
  const network = await provider.getNetwork();
  console.log("Network Chain ID:", network.chainId.toString());
  
  try {
    console.log("\n🚀 Deploying GTT Token to Polygon Mainnet...");
    
    const GTTToken = await ethers.getContractFactory("SimpleGTTToken", wallet);
    
    // Conservative deployment settings
    const deployTx = await GTTToken.deploy(
      walletAddress, // treasury
      walletAddress, // yieldPool
      {
        gasLimit: 1000000,
        gasPrice: ethers.parseUnits("30", "gwei"),
        type: 0 // Legacy transaction
      }
    );
    
    const txHash = deployTx.deploymentTransaction().hash;
    console.log("📤 Transaction submitted:", txHash);
    console.log("⏳ Waiting for confirmation...");
    
    // Wait for deployment
    await deployTx.waitForDeployment();
    const tokenAddress = await deployTx.getAddress();
    
    console.log("\n🎉 GUARDIANCHAIN GTT TOKEN DEPLOYED!");
    console.log("===================================");
    console.log("Contract Address:", tokenAddress);
    console.log("Transaction Hash:", txHash);
    console.log("PolygonScan:", `https://polygonscan.com/address/${tokenAddress}`);
    console.log("Transaction:", `https://polygonscan.com/tx/${txHash}`);
    
    // Check remaining balance
    const finalBalance = await provider.getBalance(walletAddress);
    const gasUsed = balance - finalBalance;
    console.log("Gas used:", ethers.formatEther(gasUsed), "MATIC");
    console.log("Remaining:", ethers.formatEther(finalBalance), "MATIC");
    
    // Try to deploy TruthVault if enough gas remaining
    if (finalBalance > ethers.parseUnits("0.02", "ether")) {
      try {
        console.log("\n⚡ Deploying Truth Vault...");
        const TruthVault = await ethers.getContractFactory("TruthVault", wallet);
        const vaultTx = await TruthVault.deploy(
          tokenAddress,
          walletAddress,
          {
            gasLimit: 600000,
            gasPrice: ethers.parseUnits("30", "gwei")
          }
        );
        
        await vaultTx.waitForDeployment();
        const vaultAddress = await vaultTx.getAddress();
        
        console.log("✅ Truth Vault deployed:", vaultAddress);
        console.log("PolygonScan:", `https://polygonscan.com/address/${vaultAddress}`);
        
        return {
          gttToken: tokenAddress,
          truthVault: vaultAddress,
          txHash,
          deployer: walletAddress,
          network: "Polygon Mainnet (137)"
        };
      } catch (vaultError) {
        console.log("⚠️ TruthVault deployment failed:", vaultError.message);
      }
    }
    
    return {
      gttToken: tokenAddress,
      txHash,
      deployer: walletAddress,
      network: "Polygon Mainnet (137)"
    };
    
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    
    if (error.message.includes("insufficient funds")) {
      console.log("💡 You may need to add more MATIC to your wallet");
    }
    
    throw error;
  }
}

main()
  .then((result) => {
    console.log("\n🌟 GUARDIANCHAIN IS NOW LIVE ON POLYGON!");
    console.log("GTT Token Contract:", result.gttToken);
    console.log("View on PolygonScan:", `https://polygonscan.com/address/${result.gttToken}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Deployment failed:", error.message);
    process.exit(1);
  });