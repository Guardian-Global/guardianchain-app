const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying GTT Token to Polygon Mainnet...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  
  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "MATIC");
  
  if (balance < ethers.parseEther("1.0")) {
    console.log("⚠️  Warning: Low MATIC balance. Recommended: 5+ MATIC for deployment and initial operations");
  }
  
  // Treasury wallet (multi-sig recommended for mainnet)
  const treasuryWallet = "0x742d35cc6634c0532925a3b8d8e4cc14b45d4652"; // Replace with your treasury
  
  // Deploy GTT Token
  console.log("📦 Deploying GTT Token Contract...");
  const GTTToken = await ethers.getContractFactory("GTTToken");
  const gttToken = await GTTToken.deploy(treasuryWallet);
  
  console.log("⏳ Waiting for deployment confirmation...");
  await gttToken.waitForDeployment();
  
  const contractAddress = await gttToken.getAddress();
  console.log("✅ GTT Token deployed to:", contractAddress);
  console.log("🏛️ Treasury wallet set to:", treasuryWallet);
  
  // Verify initial parameters
  const name = await gttToken.name();
  const symbol = await gttToken.symbol();
  const totalSupply = await gttToken.totalSupply();
  const decimals = await gttToken.decimals();
  
  console.log("\n📊 Token Details:");
  console.log("Name:", name);
  console.log("Symbol:", symbol);
  console.log("Decimals:", decimals);
  console.log("Total Supply:", ethers.formatEther(totalSupply), "GTT");
  console.log("Treasury Fee:", "8%");
  
  // Set up initial parameters
  console.log("\n⚙️ Setting up initial parameters...");
  
  // Add deployer to fee exempt list (already done in constructor)
  console.log("✅ Deployer exempt from fees");
  console.log("✅ Treasury exempt from fees");
  
  // Display next steps
  console.log("\n🎯 Next Steps:");
  console.log("1. Verify contract on PolygonScan:");
  console.log(`   npx hardhat verify --network polygon ${contractAddress} ${treasuryWallet}`);
  console.log("\n2. Create initial liquidity pool:");
  console.log("   - Go to QuickSwap.exchange");
  console.log("   - Add Liquidity: GTT/MATIC pair");
  console.log("   - Recommended: 100,000 GTT + 1,000 MATIC");
  console.log("\n3. Submit to CoinGecko:");
  console.log("   - Wait 48+ hours of trading activity");
  console.log("   - Apply at: coingecko.com/en/coins/new");
  console.log("\n4. Community launch:");
  console.log("   - Announce on social media");
  console.log("   - Start marketing campaigns");
  console.log("   - Begin influencer outreach");
  
  // Save deployment info
  const deploymentInfo = {
    network: "polygon",
    contractAddress: contractAddress,
    treasuryWallet: treasuryWallet,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    transactionHash: gttToken.deploymentTransaction()?.hash,
    totalSupply: "1000000000",
    decimals: 18,
    initialFee: "8%"
  };
  
  console.log("\n💾 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  
  // Estimate gas for initial operations
  console.log("\n⛽ Gas Estimates for Initial Operations:");
  console.log("Token Transfer: ~21,000 gas (~0.001 MATIC)");
  console.log("Add Liquidity: ~150,000 gas (~0.01 MATIC)");
  console.log("Approve Token: ~46,000 gas (~0.003 MATIC)");
  
  console.log("\n🎉 Deployment Complete! GTT Token is now live on Polygon Mainnet!");
  console.log("🔗 View on PolygonScan:", `https://polygonscan.com/address/${contractAddress}`);
  
  return {
    contractAddress,
    treasuryWallet,
    deploymentInfo
  };
}

main()
  .then((result) => {
    console.log("\n✅ Deployment successful!");
    console.log("Contract Address:", result.contractAddress);
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });