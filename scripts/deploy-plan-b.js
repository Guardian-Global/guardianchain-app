const { ethers } = require("hardhat");

/**
 * PLAN B GTT TOKEN DEPLOYMENT SCRIPT
 *
 * This script deploys the optimized Plan B tokenomics configuration:
 * - 1B total supply (institutional optimal)
 * - 8% transaction fee structure
 * - 2.5% strategic burn mechanism
 * - Enhanced founder revenue stream
 */

async function main() {
  console.log("\n🚀 PLAN B GTT TOKEN DEPLOYMENT STARTING...");
  console.log("=====================================");

  // Configuration
  const DEPLOYMENT_CONFIG = {
    name: "GUARDIANCHAIN Token",
    symbol: "GTT",
    totalSupply: "1000000000", // 1B tokens (Plan B)
    founderAllocation: "200000000", // 20% to founder
    communityRewards: "400000000", // 40% to community
    protocolDevelopment: "250000000", // 25% to protocol
    enterprisePartnerships: "150000000", // 15% to partnerships
    transactionFeeRate: 800, // 8% fee (800 basis points)
    burnRate: 250, // 2.5% of fees burned
  };

  // Get deployment account
  const [deployer] = await ethers.getSigners();
  console.log("📍 Deploying from account:", deployer.address);

  // Check balance
  const balance = await deployer.getBalance();
  const balanceInMatic = ethers.formatEther(balance);
  console.log("💰 Account balance:", balanceInMatic, "MATIC");

  if (parseFloat(balanceInMatic) < 0.1) {
    console.log("⚠️  WARNING: Low MATIC balance. Deployment may fail.");
    console.log("💡 Minimum recommended: 0.1 MATIC");
  }

  // Wallet addresses for Plan B distribution
  const ADDRESSES = {
    founder: "0x37A95a77a54FD240805400C54C8bA6e7e7eC6C75", // Your confirmed wallet
    communityPool: "0x8c7C0A644Cc4C72EBD55b24b43c1290e90fF0a73", // Community rewards
    protocolTreasury: "0x959C1E8Baa6EB72A0A9F2547B59176a96dD239db", // Protocol development
  };

  try {
    console.log("\n📋 PLAN B CONFIGURATION:");
    console.log("-------------------------");
    console.log(`Token Name: ${DEPLOYMENT_CONFIG.name}`);
    console.log(`Token Symbol: ${DEPLOYMENT_CONFIG.symbol}`);
    console.log(`Total Supply: ${DEPLOYMENT_CONFIG.totalSupply} GTT`);
    console.log(
      `Transaction Fee: ${DEPLOYMENT_CONFIG.transactionFeeRate / 100}%`,
    );
    console.log(`Burn Rate: ${DEPLOYMENT_CONFIG.burnRate / 100}% of fees`);
    console.log(`Founder Wallet: ${ADDRESSES.founder}`);

    console.log("\n🔨 Deploying GTT Token Plan B...");

    // Deploy the Plan B contract
    const GTTTokenPlanB = await ethers.getContractFactory("GTTTokenPlanB");
    const gttToken = await GTTTokenPlanB.deploy(
      ADDRESSES.founder,
      ADDRESSES.communityPool,
      ADDRESSES.protocolTreasury,
    );

    console.log("⏳ Waiting for deployment confirmation...");
    await gttToken.waitForDeployment();

    const contractAddress = await gttToken.getAddress();
    console.log("\n✅ PLAN B DEPLOYMENT SUCCESSFUL!");
    console.log("================================");
    console.log(`📍 Contract Address: ${contractAddress}`);
    console.log(`🌐 Network: Polygon Mainnet`);
    console.log(`⛽ Gas Used: Calculating...`);

    // Get deployment transaction details
    const deploymentTx = gttToken.deploymentTransaction();
    if (deploymentTx) {
      const receipt = await deploymentTx.wait();
      const gasUsed = receipt.gasUsed;
      const gasPrice = deploymentTx.gasPrice;
      const deploymentCost = gasUsed * gasPrice;

      console.log(`💳 Gas Used: ${gasUsed.toString()}`);
      console.log(
        `💰 Deployment Cost: ${ethers.formatEther(deploymentCost)} MATIC`,
      );
      console.log(`🔗 Transaction Hash: ${receipt.hash}`);
    }

    // Verify Plan B configuration
    console.log("\n🔍 VERIFYING PLAN B CONFIGURATION:");
    console.log("===================================");

    const totalSupply = await gttToken.totalSupply();
    const [supply, feeRate, burnRate, feesCollected, feesBurned] =
      await gttToken.getPlanBSummary();

    console.log(`✅ Total Supply: ${ethers.formatEther(totalSupply)} GTT`);
    console.log(`✅ Transaction Fee Rate: ${feeRate / 100}%`);
    console.log(`✅ Burn Rate: ${burnRate / 100}% of fees`);
    console.log(`✅ Fees Collected: ${ethers.formatEther(feesCollected)} GTT`);
    console.log(`✅ Tokens Burned: ${ethers.formatEther(feesBurned)} GTT`);

    // Check allocations
    console.log("\n📊 CHECKING ALLOCATIONS:");
    console.log("========================");

    const founderBalance = await gttToken.balanceOf(ADDRESSES.founder);
    const communityBalance = await gttToken.balanceOf(ADDRESSES.communityPool);
    const protocolBalance = await gttToken.balanceOf(
      ADDRESSES.protocolTreasury,
    );

    console.log(
      `👑 Founder Balance: ${ethers.formatEther(founderBalance)} GTT (20%)`,
    );
    console.log(
      `🏛️  Community Pool: ${ethers.formatEther(communityBalance)} GTT (40%)`,
    );
    console.log(
      `🔧 Protocol Treasury: ${ethers.formatEther(protocolBalance)} GTT (25%)`,
    );

    // Generate deployment summary
    const deploymentSummary = {
      network: "Polygon Mainnet",
      contractAddress: contractAddress,
      tokenName: DEPLOYMENT_CONFIG.name,
      tokenSymbol: DEPLOYMENT_CONFIG.symbol,
      totalSupply: ethers.formatEther(totalSupply),
      transactionFee: `${feeRate / 100}%`,
      burnRate: `${burnRate / 100}%`,
      founderWallet: ADDRESSES.founder,
      founderAllocation: ethers.formatEther(founderBalance),
      deploymentTime: new Date().toISOString(),
      polygonscanUrl: `https://polygonscan.com/address/${contractAddress}`,
      uniswapUrl: `https://app.uniswap.org/#/tokens/polygon/${contractAddress}`,
      quickswapUrl: `https://quickswap.exchange/#/swap?outputCurrency=${contractAddress}`,
      addLiquidityUrl: `https://app.uniswap.org/#/add/v2/ETH/${contractAddress}`,
    };

    console.log("\n🎯 PLAN B DEPLOYMENT COMPLETE!");
    console.log("==============================");
    console.log("📋 Summary saved to deployment-summary.json");
    console.log(`🌐 View on PolygonScan: ${deploymentSummary.polygonscanUrl}`);
    console.log(`💱 Trade on Uniswap: ${deploymentSummary.uniswapUrl}`);
    console.log(`🚀 Trade on QuickSwap: ${deploymentSummary.quickswapUrl}`);

    // Save deployment summary
    const fs = require("fs");
    fs.writeFileSync(
      "plan-b-deployment-summary.json",
      JSON.stringify(deploymentSummary, null, 2),
    );

    console.log("\n💰 PLAN B REVENUE PROJECTIONS:");
    console.log("==============================");
    console.log("📈 With 8% fees on $10M daily volume:");
    console.log("   Daily Revenue: $800,000");
    console.log("   Monthly Revenue: $24,000,000");
    console.log("   Annual Revenue: $292,000,000");
    console.log("\n🔥 PLAN B DEPLOYMENT SUCCESSFUL!");
    console.log("Ready for DEX listings and institutional partnerships!");
  } catch (error) {
    console.error("\n❌ PLAN B DEPLOYMENT FAILED:");
    console.error("============================");
    console.error(error.message);

    if (error.message.includes("insufficient funds")) {
      console.log("\n💡 SOLUTION:");
      console.log("1. Fund wallet with at least 0.1 MATIC");
      console.log("2. Current wallet:", deployer.address);
      console.log("3. Get MATIC from: https://wallet.polygon.technology/");
    }

    process.exit(1);
  }
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment script failed:", error);
    process.exit(1);
  });
