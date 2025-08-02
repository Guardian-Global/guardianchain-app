const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🧪 GTT TOKEN TESTNET DEPLOYMENT");
  console.log("===============================");
  console.log("Network: Polygon Mumbai Testnet");
  console.log("Cost: FREE (testnet MATIC from faucet)");
  console.log("");

  // Mumbai testnet configuration
  const provider = new ethers.JsonRpcProvider(
    "https://rpc-mumbai.maticvigil.com",
  );

  // Your private key (same as before)
  const privateKey =
    "0x8b170cf9fdb9a9dc5b1e6229ab0e8ac2fde5198e422f8d72f6861b59edf8c7b8";
  const deployerWallet = new ethers.Wallet(privateKey, provider);

  console.log("📍 Deployer Address:", deployerWallet.address);
  console.log(
    "🎯 Target GTT Address: 0x742d35Cc66535C0532925a3b8d0E9B01d9c5d9A6C",
  );
  console.log("");

  try {
    // Check testnet balance
    const balance = await provider.getBalance(deployerWallet.address);
    const balanceInMatic = ethers.formatEther(balance);
    console.log("💰 Testnet MATIC Balance:", balanceInMatic);

    if (parseFloat(balanceInMatic) < 0.01) {
      console.log("⚠️ Need testnet MATIC from faucet");
      console.log("🔗 Get free testnet MATIC:");
      console.log("   https://faucet.polygon.technology/");
      console.log("   https://mumbaifaucet.com/");
      console.log("");
      console.log("📋 Your wallet address for faucet:");
      console.log("   " + deployerWallet.address);
      return;
    }

    console.log("✅ Sufficient testnet balance, deploying GTT token...");

    // Compile contracts if needed
    const contractPath = path.join(
      __dirname,
      "..",
      "artifacts",
      "contracts",
      "GTTToken.sol",
      "GTTToken.json",
    );

    if (!fs.existsSync(contractPath)) {
      console.log("⚠️ Contract artifact not found, compiling...");
      const { execSync } = require("child_process");
      execSync("npx hardhat compile", { stdio: "inherit" });
    }

    // Deploy GTT Token
    const contractArtifact = JSON.parse(fs.readFileSync(contractPath, "utf8"));
    const GTTTokenFactory = new ethers.ContractFactory(
      contractArtifact.abi,
      contractArtifact.bytecode,
      deployerWallet,
    );

    console.log("🚀 Deploying GTT Token to Mumbai testnet...");
    const gttToken = await GTTTokenFactory.deploy();

    console.log("⏳ Waiting for deployment confirmation...");
    await gttToken.waitForDeployment();

    const deployedAddress = await gttToken.getAddress();
    console.log("🎉 GTT TOKEN DEPLOYED SUCCESSFULLY ON TESTNET!");
    console.log("📍 Contract Address:", deployedAddress);
    console.log(
      "🔗 Mumbai Explorer:",
      `https://mumbai.polygonscan.com/address/${deployedAddress}`,
    );

    // Verify token details
    const name = await gttToken.name();
    const symbol = await gttToken.symbol();
    const totalSupply = await gttToken.totalSupply();

    console.log("\n📊 TOKEN DETAILS:");
    console.log("Name:", name);
    console.log("Symbol:", symbol);
    console.log("Total Supply:", ethers.formatEther(totalSupply), "GTT");

    // Save testnet deployment info
    const deploymentInfo = {
      network: "mumbai",
      chainId: 80001,
      timestamp: new Date().toISOString(),
      deployer: deployerWallet.address,
      contractAddress: deployedAddress,
      transactionHash: gttToken.deploymentTransaction()?.hash,
      targetMainnetAddress: "0x742d35Cc66535C0532925a3b8d0E9B01d9c5d9A6C",
      cost: "FREE (testnet)",
    };

    fs.writeFileSync(
      "mumbai-gtt-deployment.json",
      JSON.stringify(deploymentInfo, null, 2),
    );
    console.log("💾 Testnet deployment info saved");

    console.log("\n🎯 NEXT STEPS:");
    console.log("1. ✅ Test all platform features with testnet token");
    console.log("2. ✅ Verify everything works perfectly");
    console.log("3. 🚀 Deploy to mainnet when gas fees are reasonable");
    console.log("4. 💰 Total mainnet cost will be only $0.02");
  } catch (error) {
    console.error("❌ Deployment error:", error.message);

    if (error.message.includes("insufficient funds")) {
      console.log(
        "💸 Get testnet MATIC from: https://faucet.polygon.technology/",
      );
    }
  }
}

main().catch(console.error);
