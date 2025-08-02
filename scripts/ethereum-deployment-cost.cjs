const { ethers } = require("ethers");

async function main() {
  console.log("💰 ETHEREUM DEPLOYMENT COST ANALYSIS");
  console.log("====================================");

  // Current ETH prices (approximate)
  const ethUsdPrice = 3200; // $3,200 per ETH (approximate)

  // Smart contract deployment gas estimates
  const tokenDeploymentGas = 1200000; // ~1.2M gas for ERC20 token deployment

  // Current gas price scenarios (in gwei)
  const gasScenarios = [
    { name: "Low (10 gwei)", gasPrice: 10 },
    { name: "Standard (20 gwei)", gasPrice: 20 },
    { name: "Fast (35 gwei)", gasPrice: 35 },
    { name: "Fastest (50 gwei)", gasPrice: 50 },
  ];

  console.log("📊 ETH DEPLOYMENT COST BREAKDOWN:");
  console.log("================================");

  gasScenarios.forEach((scenario) => {
    const gasCostWei =
      BigInt(tokenDeploymentGas) * BigInt(scenario.gasPrice * 1e9);
    const gasCostEth = Number(gasCostWei) / 1e18;
    const gasCostUsd = gasCostEth * ethUsdPrice;

    console.log(`\n${scenario.name}:`);
    console.log(`  Gas: ${tokenDeploymentGas.toLocaleString()} units`);
    console.log(`  Price: ${scenario.gasPrice} gwei`);
    console.log(`  Cost: ${gasCostEth.toFixed(4)} ETH`);
    console.log(`  USD: $${gasCostUsd.toFixed(2)}`);
  });

  console.log("\n🔄 POLYGON vs ETHEREUM COMPARISON:");
  console.log("=================================");
  console.log("Polygon Mainnet:");
  console.log("  Gas Cost: ~0.02 MATIC (~$0.02 USD)");
  console.log("  Speed: 2-3 seconds");
  console.log("  Network: Mature, established");

  console.log("\nEthereum Mainnet:");
  console.log("  Gas Cost: 0.024-0.06 ETH ($77-$192 USD)");
  console.log("  Speed: 15 seconds - 5 minutes");
  console.log("  Network: Most established, highest liquidity");

  console.log("\n💡 RECOMMENDATION:");
  console.log("For GTT token deployment, Polygon offers:");
  console.log("✅ 4000x lower costs");
  console.log("✅ Faster transactions");
  console.log("✅ Same security model");
  console.log("✅ Easy bridging to Ethereum later");

  console.log("\n📝 ETH REQUIRED FOR ETHEREUM DEPLOYMENT:");
  console.log("Minimum: 0.025 ETH (~$80 USD)");
  console.log("Recommended: 0.08 ETH (~$256 USD) for safety margin");
}

main().catch(console.error);
