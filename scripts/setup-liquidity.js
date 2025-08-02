const { ethers } = require("hardhat");

async function main() {
  console.log("🏊 Setting up GTT/MATIC Liquidity Pool on QuickSwap...");

  // Contract addresses
  const GTT_TOKEN_ADDRESS = "0x742d35cc6634c0532925a3b8d8e4cc14b45d4652"; // Replace with deployed address
  const QUICKSWAP_ROUTER = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff"; // QuickSwap V2 Router
  const WMATIC_ADDRESS = "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"; // Wrapped MATIC

  const [deployer] = await ethers.getSigners();
  console.log("🔗 Connected with account:", deployer.address);

  // Get contract instances
  const gttToken = await ethers.getContractAt("IERC20", GTT_TOKEN_ADDRESS);
  const router = await ethers.getContractAt(
    "IUniswapV2Router02",
    QUICKSWAP_ROUTER,
  );

  // Liquidity amounts
  const gttAmount = ethers.parseEther("100000"); // 100,000 GTT
  const maticAmount = ethers.parseEther("1000"); // 1,000 MATIC

  console.log("💰 Liquidity to add:");
  console.log("GTT:", ethers.formatEther(gttAmount));
  console.log("MATIC:", ethers.formatEther(maticAmount));

  // Check balances
  const gttBalance = await gttToken.balanceOf(deployer.address);
  const maticBalance = await ethers.provider.getBalance(deployer.address);

  console.log("\n💳 Current balances:");
  console.log("GTT:", ethers.formatEther(gttBalance));
  console.log("MATIC:", ethers.formatEther(maticBalance));

  if (gttBalance < gttAmount) {
    throw new Error("Insufficient GTT balance for liquidity");
  }

  if (maticBalance < maticAmount) {
    throw new Error("Insufficient MATIC balance for liquidity");
  }

  // Approve GTT for router
  console.log("\n✅ Approving GTT for QuickSwap Router...");
  const approveTx = await gttToken.approve(QUICKSWAP_ROUTER, gttAmount);
  await approveTx.wait();
  console.log("GTT approved for router");

  // Add liquidity
  console.log("\n🏊 Adding liquidity to GTT/MATIC pool...");
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

  const liquidityTx = await router.addLiquidityETH(
    GTT_TOKEN_ADDRESS,
    gttAmount,
    ethers.parseEther("95000"), // Min GTT (5% slippage)
    ethers.parseEther("950"), // Min MATIC (5% slippage)
    deployer.address,
    deadline,
    { value: maticAmount },
  );

  console.log("⏳ Waiting for liquidity transaction...");
  const receipt = await liquidityTx.wait();
  console.log("✅ Liquidity added successfully!");
  console.log("Transaction hash:", receipt.hash);

  // Get pair address
  const factoryAddress = await router.factory();
  const factory = await ethers.getContractAt(
    "IUniswapV2Factory",
    factoryAddress,
  );
  const pairAddress = await factory.getPair(GTT_TOKEN_ADDRESS, WMATIC_ADDRESS);

  console.log("\n📊 Pool Information:");
  console.log("Pair Address:", pairAddress);
  console.log(
    "QuickSwap URL:",
    `https://quickswap.exchange/#/add/${GTT_TOKEN_ADDRESS}/ETH`,
  );

  // Get LP token balance
  const pair = await ethers.getContractAt("IERC20", pairAddress);
  const lpBalance = await pair.balanceOf(deployer.address);
  console.log("LP Tokens received:", ethers.formatEther(lpBalance));

  console.log("\n🔒 IMPORTANT: Lock your LP tokens!");
  console.log("Recommended platforms:");
  console.log("- Team Finance: team.finance");
  console.log("- Unicrypt: unicrypt.network");
  console.log("- Lock period: 6+ months minimum");

  console.log("\n📈 Next Steps:");
  console.log("1. Lock LP tokens for 6+ months");
  console.log("2. Announce liquidity launch on social media");
  console.log("3. Submit to CoinGecko after 48 hours of trading");
  console.log("4. Begin marketing campaigns");
  console.log("5. Apply to additional DEXs (SushiSwap, etc.)");

  // Calculate initial price
  const initialPrice =
    Number(ethers.formatEther(maticAmount)) /
    Number(ethers.formatEther(gttAmount));
  console.log("\n💲 Initial GTT Price:");
  console.log(`1 GTT = ${initialPrice} MATIC`);
  console.log(`1 GTT ≈ $${(initialPrice * 0.75).toFixed(6)} USD`); // Assuming MATIC = $0.75

  return {
    pairAddress,
    lpTokens: ethers.formatEther(lpBalance),
    initialPrice,
    transactionHash: receipt.hash,
  };
}

main()
  .then((result) => {
    console.log("\n🎉 Liquidity setup complete!");
    console.log("Pair Address:", result.pairAddress);
    console.log("LP Tokens:", result.lpTokens);
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Liquidity setup failed:");
    console.error(error);
    process.exit(1);
  });
