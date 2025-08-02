const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

async function waitAndDeploy() {
  console.log("⏳ WAITING FOR WALLET FUNDING - AUTO DEPLOY");
  console.log("==========================================");

  const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
  const walletAddress = "0x959C1E8Baa6EB72A0A9F2547B59176a96dD239db";
  const privateKey =
    "0x8b170cf9fdb9a9dc5b1e6229ab0e8ac2fde5198e422f8d72f6861b59edf8c7b8";

  console.log("📍 Monitoring Address:", walletAddress);
  console.log(
    "🎯 Target GTT Address: 0x742d35Cc66535C0532925a3b8d0E9B01d9c5d9A6C",
  );
  console.log("💰 Checking every 30 seconds...");
  console.log("");

  const checkBalance = async () => {
    try {
      const balance = await provider.getBalance(walletAddress);
      const balanceInMatic = ethers.formatEther(balance);

      console.log(
        `⏰ ${new Date().toLocaleTimeString()} - Balance: ${balanceInMatic} MATIC`,
      );

      if (parseFloat(balanceInMatic) >= 0.02) {
        console.log("🎉 FUNDING DETECTED! DEPLOYING NOW...");
        await deployGTT();
        return true;
      }
      return false;
    } catch (error) {
      console.log("❌ Check failed:", error.message);
      return false;
    }
  };

  const deployGTT = async () => {
    try {
      console.log("🚀 Starting GTT deployment...");

      const deployerWallet = new ethers.Wallet(privateKey, provider);

      // Load contract artifact
      const contractPath = path.join(
        __dirname,
        "..",
        "artifacts",
        "contracts",
        "GTTToken.sol",
        "GTTToken.json",
      );

      if (!fs.existsSync(contractPath)) {
        console.log("⚠️ Compiling contracts...");
        const { execSync } = require("child_process");
        execSync("npx hardhat compile", { stdio: "inherit" });
      }

      const contractArtifact = JSON.parse(
        fs.readFileSync(contractPath, "utf8"),
      );
      const GTTTokenFactory = new ethers.ContractFactory(
        contractArtifact.abi,
        contractArtifact.bytecode,
        deployerWallet,
      );

      console.log("📡 Deploying GTT Token to Polygon mainnet...");
      const gttToken = await GTTTokenFactory.deploy();

      console.log("⏳ Waiting for confirmation...");
      await gttToken.waitForDeployment();

      const deployedAddress = await gttToken.getAddress();

      console.log("");
      console.log("🎉🎉🎉 GTT TOKEN DEPLOYED SUCCESSFULLY! 🎉🎉🎉");
      console.log("===============================================");
      console.log("📍 Contract Address:", deployedAddress);
      console.log(
        "🔗 PolygonScan:",
        `https://polygonscan.com/address/${deployedAddress}`,
      );
      console.log(
        "🎯 Target Address Match:",
        deployedAddress === "0x742d35Cc66535C0532925a3b8d0E9B01d9c5d9A6C"
          ? "✅ YES"
          : "⚠️ Different",
      );

      // Get token details
      const name = await gttToken.name();
      const symbol = await gttToken.symbol();
      const totalSupply = await gttToken.totalSupply();

      console.log("");
      console.log("📊 TOKEN DETAILS:");
      console.log("Name:", name);
      console.log("Symbol:", symbol);
      console.log("Total Supply:", ethers.formatEther(totalSupply), "GTT");
      console.log("Decimals: 18");

      // Save deployment
      const deploymentInfo = {
        success: true,
        network: "polygon",
        chainId: 137,
        timestamp: new Date().toISOString(),
        deployer: deployerWallet.address,
        contractAddress: deployedAddress,
        transactionHash: gttToken.deploymentTransaction()?.hash,
        targetAddress: "0x742d35Cc66535C0532925a3b8d0E9B01d9c5d9A6C",
        tokenDetails: {
          name,
          symbol,
          totalSupply: ethers.formatEther(totalSupply),
        },
      };

      fs.writeFileSync(
        "gtt-mainnet-deployment-SUCCESS.json",
        JSON.stringify(deploymentInfo, null, 2),
      );

      console.log("");
      console.log("🚀 GUARDIANCHAIN IS NOW LIVE ON POLYGON MAINNET!");
      console.log("💰 GTT token ready for trading and ecosystem launch");
      console.log("🏆 Deployment complete - target market cap: $25M-75M");
    } catch (error) {
      console.error("❌ Deployment failed:", error.message);
    }
  };

  // Check immediately, then every 30 seconds
  if (!(await checkBalance())) {
    const interval = setInterval(async () => {
      if (await checkBalance()) {
        clearInterval(interval);
      }
    }, 30000);
  }
}

waitAndDeploy().catch(console.error);
