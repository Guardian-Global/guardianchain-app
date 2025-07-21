const hre = require("hardhat");

async function main() {
  console.log("🔍 Checking GUARDIANCHAIN Deployment Connection...");
  console.log("=" .repeat(60));

  try {
    // Get network info
    const network = await hre.ethers.provider.getNetwork();
    console.log(`📡 Connected to: ${hre.network.name}`);
    console.log(`🔗 Chain ID: ${network.chainId}`);
    console.log(`🌐 RPC URL: ${hre.network.config.url || 'Default'}`);

    // Get deployer info
    const [deployer] = await hre.ethers.getSigners();
    console.log(`\n🔐 Deployer Address: ${deployer.address}`);

    // Check balance
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    const balanceFormatted = hre.ethers.formatEther(balance);
    const currency = hre.network.name === 'polygon' ? 'MATIC' : 'ETH';
    
    console.log(`💰 Current Balance: ${balanceFormatted} ${currency}`);

    // Check minimum balance requirement
    const minBalance = hre.ethers.parseEther(hre.network.name === 'polygon' ? "50" : "0.1");
    const hasEnoughBalance = balance >= minBalance;
    
    console.log(`\n✅ Balance Check:`);
    console.log(`   Required: ${hre.ethers.formatEther(minBalance)} ${currency}`);
    console.log(`   Current:  ${balanceFormatted} ${currency}`);
    console.log(`   Status:   ${hasEnoughBalance ? '✅ SUFFICIENT' : '❌ INSUFFICIENT'}`);

    // Get latest block to verify connection
    const blockNumber = await hre.ethers.provider.getBlockNumber();
    console.log(`\n📦 Latest Block: ${blockNumber}`);

    // Get gas price
    const feeData = await hre.ethers.provider.getFeeData();
    const gasPrice = hre.ethers.formatUnits(feeData.gasPrice, 'gwei');
    console.log(`⛽ Current Gas Price: ${gasPrice} gwei`);

    // Connection status
    console.log(`\n🔗 Connection Status: ✅ CONNECTED`);
    
    if (hasEnoughBalance) {
      console.log(`\n🚀 READY TO DEPLOY!`);
      console.log(`   Run: npx hardhat run scripts/deploy-mainnet.js --network ${hre.network.name}`);
    } else {
      console.log(`\n⚠️  NEED MORE FUNDS!`);
      console.log(`   Send ${hre.ethers.formatEther(minBalance)} ${currency} to: ${deployer.address}`);
      console.log(`   Current network: ${hre.network.name}`);
    }

    // Estimate deployment cost
    const estimatedGas = 2500000; // Estimated total gas for all contracts
    const estimatedCost = BigInt(estimatedGas) * feeData.gasPrice;
    const estimatedCostFormatted = hre.ethers.formatEther(estimatedCost);
    
    console.log(`\n📊 Deployment Estimates:`);
    console.log(`   Gas Needed: ~${estimatedGas.toLocaleString()}`);
    console.log(`   Cost: ~${estimatedCostFormatted} ${currency}`);

    return {
      connected: true,
      network: hre.network.name,
      chainId: network.chainId,
      deployer: deployer.address,
      balance: balanceFormatted,
      hasEnoughBalance,
      gasPrice: gasPrice,
      estimatedCost: estimatedCostFormatted
    };

  } catch (error) {
    console.error(`\n❌ Connection failed:`, error.message);
    
    console.log(`\n🔧 Troubleshooting:`);
    console.log(`   1. Check your internet connection`);
    console.log(`   2. Verify PRIVATE_KEY in .env file`);
    console.log(`   3. Check RPC endpoint in hardhat.config.cjs`);
    console.log(`   4. Ensure you're using the right network`);
    
    return {
      connected: false,
      error: error.message
    };
  }
}

// CLI interface
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = main;