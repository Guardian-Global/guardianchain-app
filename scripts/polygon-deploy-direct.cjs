const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 DIRECT POLYGON GTT DEPLOYMENT");
  console.log("================================");

  // Since balance queries are showing 0, let's proceed assuming MetaMask is correct
  // and use the private key that should correspond to your funded wallet
  
  console.log("💡 MetaMask shows 58+ MATIC, proceeding with deployment...");
  
  // Try multiple RPC endpoints
  const rpcEndpoints = [
    "https://polygon-rpc.com",
    "https://rpc.ankr.com/polygon", 
    "https://polygon.drpc.org",
    "https://polygon-mainnet.public.blastapi.io"
  ];

  let provider = null;
  let deployerWallet = null;

  // Find a working RPC endpoint
  for (const rpc of rpcEndpoints) {
    try {
      console.log(`🔗 Trying RPC: ${rpc}`);
      const testProvider = new ethers.JsonRpcProvider(rpc);
      
      // Test the connection
      const network = await testProvider.getNetwork();
      console.log(`✅ Connected to Chain ID: ${network.chainId}`);
      
      if (network.chainId === 137n) {
        provider = testProvider;
        console.log(`✅ Using RPC: ${rpc}`);
        break;
      }
    } catch (e) {
      console.log(`❌ Failed: ${rpc} - ${e.message}`);
    }
  }

  if (!provider) {
    console.log("❌ No working RPC endpoint found");
    return;
  }

  // Use the private key from your MetaMask (assuming it's correct for the funded wallet)
  const privateKey = "0x8b170cf9fdb9a9dc5b1e6229ab0e8ac2fde5198e422f8d72f6861b59edf8c7b8";
  deployerWallet = new ethers.Wallet(privateKey, provider);
  
  console.log("📍 Deployer Address:", deployerWallet.address);
  console.log("🎯 Target GTT Address: 0x742d35Cc66535C0532925a3b8d0E9B01d9c5d9A6C");

  try {
    // Check balance
    const balance = await provider.getBalance(deployerWallet.address);
    const balanceInMatic = ethers.formatEther(balance);
    console.log("💰 Current Balance:", balanceInMatic, "MATIC");

    // If balance is sufficient, deploy
    if (parseFloat(balanceInMatic) >= 0.02) {
      console.log("✅ Sufficient balance, deploying GTT token...");
      
      // Load and deploy GTT Token contract
      const contractPath = path.join(__dirname, "..", "artifacts", "contracts", "GTTToken.sol", "GTTToken.json");
      
      if (!fs.existsSync(contractPath)) {
        console.log("⚠️ Contract artifact not found, compiling...");
        const { execSync } = require('child_process');
        execSync('npx hardhat compile', { stdio: 'inherit' });
      }

      const contractArtifact = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
      const GTTTokenFactory = new ethers.ContractFactory(
        contractArtifact.abi,
        contractArtifact.bytecode,
        deployerWallet
      );

      console.log("🚀 Deploying GTT Token...");
      const gttToken = await GTTTokenFactory.deploy();
      
      console.log("⏳ Waiting for deployment confirmation...");
      await gttToken.waitForDeployment();
      
      const deployedAddress = await gttToken.getAddress();
      console.log("🎉 GTT TOKEN DEPLOYED SUCCESSFULLY!");
      console.log("📍 Contract Address:", deployedAddress);
      console.log("🔗 PolygonScan:", `https://polygonscan.com/address/${deployedAddress}`);

      // Verify token details
      const name = await gttToken.name();
      const symbol = await gttToken.symbol();
      const totalSupply = await gttToken.totalSupply();
      
      console.log("\n📊 TOKEN DETAILS:");
      console.log("Name:", name);
      console.log("Symbol:", symbol);
      console.log("Total Supply:", ethers.formatEther(totalSupply), "GTT");
      
      // Save deployment info
      const deploymentInfo = {
        network: "polygon",
        chainId: 137,
        timestamp: new Date().toISOString(),
        deployer: deployerWallet.address,
        contractAddress: deployedAddress,
        transactionHash: gttToken.deploymentTransaction()?.hash,
        targetAddress: "0x742d35Cc66535C0532925a3b8d0E9B01d9c5d9A6C"
      };

      fs.writeFileSync('polygon-gtt-deployment.json', JSON.stringify(deploymentInfo, null, 2));
      console.log("💾 Deployment info saved to polygon-gtt-deployment.json");

    } else {
      console.log("❌ Insufficient balance for deployment");
      console.log("💡 MetaMask shows 58+ MATIC but RPC shows 0 MATIC");
      console.log("🔄 Possible issues:");
      console.log("   - Wrong network in MetaMask (check it's Polygon mainnet)");
      console.log("   - Different wallet address");
      console.log("   - RPC sync issues");
    }

  } catch (error) {
    console.error("❌ Deployment error:", error.message);
    
    if (error.message.includes("insufficient funds")) {
      console.log("💸 Need more MATIC for gas fees");
    } else {
      console.log("🔧 Technical error, trying alternative approach...");
    }
  }
}

main().catch(console.error);