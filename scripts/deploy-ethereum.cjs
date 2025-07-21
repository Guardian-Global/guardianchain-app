const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 GUARDIANCHAIN ETHEREUM MAINNET DEPLOYMENT");
  console.log("============================================");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // Check balance on Ethereum
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("ETH Balance:", ethers.formatEther(balance), "ETH");
  console.log("USD Value (approx):", (parseFloat(ethers.formatEther(balance)) * 3800).toFixed(2));
  
  const network = await deployer.provider.getNetwork();
  console.log("Network:", network.name, "Chain ID:", network.chainId.toString());
  
  // Get current gas price
  const feeData = await deployer.provider.getFeeData();
  console.log("Current gas price:", ethers.formatUnits(feeData.gasPrice, "gwei"), "gwei");
  
  // Estimate deployment cost
  const estimatedGas = 2000000; // Conservative estimate for Ethereum
  const deploymentCost = BigInt(estimatedGas) * feeData.gasPrice;
  console.log("Estimated deployment cost:", ethers.formatEther(deploymentCost), "ETH");
  console.log("Estimated cost USD:", (parseFloat(ethers.formatEther(deploymentCost)) * 3800).toFixed(2));
  
  // Check if we have enough funds
  if (balance < deploymentCost) {
    console.log("⚠️ Low balance warning - proceeding anyway");
  } else {
    console.log("✅ Sufficient funds for deployment");
  }
  
  try {
    console.log("\n1️⃣ Deploying GTT Token Contract...");
    const GTTToken = await ethers.getContractFactory("SimpleGTTToken");
    const gttToken = await GTTToken.deploy(
      deployer.address, // treasury
      deployer.address, // yieldPool
      {
        gasLimit: 1500000,
        gasPrice: feeData.gasPrice
      }
    );
    
    console.log("⏳ Waiting for deployment confirmation...");
    await gttToken.waitForDeployment();
    const tokenAddress = await gttToken.getAddress();
    
    console.log("✅ GTT Token deployed to:", tokenAddress);
    console.log("📊 Transaction hash:", gttToken.deploymentTransaction()?.hash);
    
    // Deploy TruthVault
    console.log("\n2️⃣ Deploying Truth Vault Contract...");
    const TruthVault = await ethers.getContractFactory("TruthVault");
    const truthVault = await TruthVault.deploy(
      tokenAddress,
      deployer.address,
      {
        gasLimit: 1000000,
        gasPrice: feeData.gasPrice
      }
    );
    
    await truthVault.waitForDeployment();
    const vaultAddress = await truthVault.getAddress();
    
    console.log("✅ Truth Vault deployed to:", vaultAddress);
    console.log("📊 Transaction hash:", truthVault.deploymentTransaction()?.hash);
    
    // Deploy GuardianPass
    console.log("\n3️⃣ Deploying Guardian Pass NFT...");
    const GuardianPass = await ethers.getContractFactory("GuardianPass");
    const guardianPass = await GuardianPass.deploy({
      gasLimit: 800000,
      gasPrice: feeData.gasPrice
    });
    
    await guardianPass.waitForDeployment();
    const passAddress = await guardianPass.getAddress();
    
    console.log("✅ Guardian Pass deployed to:", passAddress);
    console.log("📊 Transaction hash:", guardianPass.deploymentTransaction()?.hash);
    
    // Final summary
    console.log("\n🎉 GUARDIANCHAIN ETHEREUM MAINNET DEPLOYMENT COMPLETE!");
    console.log("====================================================");
    console.log("GTT Token:     ", tokenAddress);
    console.log("Truth Vault:   ", vaultAddress);  
    console.log("Guardian Pass: ", passAddress);
    console.log("Deployer:      ", deployer.address);
    console.log("Network:       ", "Ethereum Mainnet (1)");
    
    return {
      gttToken: tokenAddress,
      truthVault: vaultAddress,
      guardianPass: passAddress,
      deployer: deployer.address
    };
    
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    console.log("This could be due to:");
    console.log("- Insufficient gas fees");
    console.log("- Network congestion");
    console.log("- Contract compilation issues");
    throw error;
  }
}

main()
  .then((result) => {
    console.log("\n🚀 GUARDIANCHAIN IS NOW LIVE ON ETHEREUM MAINNET!");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });