const hre = require("hardhat");

async function main() {
  console.log("🚀 GTT TOKEN MAINNET DEPLOYMENT");
  console.log("===============================");

  // Get deployer
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);

  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "MATIC");

  // Deploy GTTToken
  const GTTToken = await hre.ethers.getContractFactory("GTTToken");
  const gttToken = await GTTToken.deploy();
  await gttToken.waitForDeployment();

  const address = await gttToken.getAddress();
  console.log("✅ GTT Token deployed to:", address);

  // Verify deployment
  const name = await gttToken.name();
  const symbol = await gttToken.symbol();
  const supply = await gttToken.totalSupply();

  console.log("Name:", name);
  console.log("Symbol:", symbol);
  console.log("Supply:", hre.ethers.formatUnits(supply, 18));

  console.log(
    "\n🌐 PolygonScan:",
    `https://polygonscan.com/address/${address}`
  );

  return { address, name, symbol, supply: hre.ethers.formatUnits(supply, 18) };
}

main()
  .then((result) => {
    console.log("\n🎉 DEPLOYMENT COMPLETE!");
    console.log("Contract Address:", result.address);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
