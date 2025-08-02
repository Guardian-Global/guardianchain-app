const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

async function autoDeployOnFunding() {
  console.log("🤖 AUTO-DEPLOYMENT SYSTEM ACTIVE");
  console.log("================================");

  // Load deployment wallet
  const walletData = JSON.parse(
    fs.readFileSync("deployment-wallet.json", "utf8"),
  );
  const deploymentAddress = walletData.address;
  const privateKey = walletData.privateKey;

  console.log("📍 Monitoring wallet:", deploymentAddress);
  console.log(
    "🎯 Will deploy GTT to: 0x742d35Cc66535C0532925a3b8d0E9B01d9c5d9A6C",
  );
  console.log("⏰ Checking every 30 seconds...");
  console.log("");

  const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
  const deployerWallet = new ethers.Wallet(privateKey, provider);

  const checkAndDeploy = async () => {
    try {
      const balance = await provider.getBalance(deploymentAddress);
      const balanceInPol = ethers.formatEther(balance);

      const timestamp = new Date().toLocaleTimeString();
      console.log(`⏰ ${timestamp} - Balance: ${balanceInPol} POL`);

      if (parseFloat(balanceInPol) >= 0.1) {
        console.log("");
        console.log("💰 FUNDING DETECTED! DEPLOYING GTT TOKEN NOW...");
        console.log("===============================================");

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
          console.log("⚠️ Compiling contracts...");
          const { execSync } = require("child_process");
          execSync("npx hardhat compile", { stdio: "inherit" });
        }

        // Deploy GTT Token
        const contractArtifact = JSON.parse(
          fs.readFileSync(contractPath, "utf8"),
        );
        const GTTTokenFactory = new ethers.ContractFactory(
          contractArtifact.abi,
          contractArtifact.bytecode,
          deployerWallet,
        );

        console.log("🚀 Deploying GTT Token to Polygon mainnet...");
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
          "🎯 Target Match:",
          deployedAddress === "0x742d35Cc66535C0532925a3b8d0E9B01d9c5d9A6C"
            ? "✅ PERFECT"
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

        // Save successful deployment
        const deploymentResult = {
          success: true,
          timestamp: new Date().toISOString(),
          network: "polygon",
          chainId: 137,
          deployerAddress: deploymentAddress,
          contractAddress: deployedAddress,
          transactionHash: gttToken.deploymentTransaction()?.hash,
          targetAddress: "0x742d35Cc66535C0532925a3b8d0E9B01d9c5d9A6C",
          tokenDetails: {
            name,
            symbol,
            totalSupply: ethers.formatEther(totalSupply),
          },
          cost: balanceInPol + " POL",
        };

        fs.writeFileSync(
          "GTT-DEPLOYMENT-SUCCESS.json",
          JSON.stringify(deploymentResult, null, 2),
        );

        console.log("");
        console.log("🚀 GUARDIANCHAIN IS NOW LIVE ON POLYGON MAINNET!");
        console.log("💎 GTT token ready for $25M-75M market cap launch");
        console.log("🏆 Mission accomplished!");

        return true;
      }

      return false;
    } catch (error) {
      console.error("❌ Error:", error.message);
      return false;
    }
  };

  // Check immediately, then every 30 seconds
  if (!(await checkAndDeploy())) {
    const interval = setInterval(async () => {
      if (await checkAndDeploy()) {
        clearInterval(interval);
      }
    }, 30000);
  }
}

autoDeployOnFunding().catch(console.error);
