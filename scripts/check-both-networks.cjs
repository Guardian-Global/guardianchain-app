const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 CHECKING BOTH NETWORKS FOR YOUR FUNDS");
  console.log("========================================");
  
  const privateKey = "0xde6354f59a5448fc6df8abc332707767bd3f1f35b74f1accc053d5276e749bde";
  
  // Create wallet to get address
  const tempProvider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
  const wallet = new ethers.Wallet(privateKey);
  
  console.log("Wallet Address:", wallet.address);
  console.log("Expected Address: 0x8c7C0A644Cc4C72EBD55b24b43c1290e90fF0a73");
  console.log("");
  
  // Check Ethereum Mainnet
  console.log("🔗 ETHEREUM MAINNET CHECK:");
  try {
    const ethProvider = new ethers.JsonRpcProvider("https://boldest-long-flower.quiknode.pro/f95e9c78a34f9c076e8ff012c98e17332758f862");
    const ethBalance = await ethProvider.getBalance(wallet.address);
    const ethAmount = parseFloat(ethers.formatEther(ethBalance));
    
    console.log(`ETH Balance: ${ethAmount.toFixed(6)} ETH`);
    console.log(`USD Value: ~$${(ethAmount * 4200).toFixed(2)}`);
    
    if (ethAmount > 0.001) {
      console.log("✅ Found ETH funds!");
    } else {
      console.log("❌ Insufficient ETH");
    }
  } catch (error) {
    console.log("❌ Ethereum check failed:", error.message.substring(0, 50));
  }
  
  console.log("");
  
  // Check Polygon Mainnet
  console.log("🔗 POLYGON MAINNET CHECK:");
  try {
    const polyProvider = new ethers.JsonRpcProvider("https://chaotic-cosmopolitan-tab.matic.quiknode.pro/a62225077279679a5957c8304e1c7042baec8c11");
    const polyBalance = await polyProvider.getBalance(wallet.address);
    const maticAmount = parseFloat(ethers.formatEther(polyBalance));
    
    console.log(`MATIC Balance: ${maticAmount.toFixed(6)} MATIC`);
    console.log(`USD Value: ~$${(maticAmount * 0.9).toFixed(2)}`);
    
    if (maticAmount > 0.05) {
      console.log("✅ Found MATIC funds!");
    } else {
      console.log("❌ Insufficient MATIC");
    }
  } catch (error) {
    console.log("❌ Polygon check failed:", error.message.substring(0, 50));
  }
  
  console.log("");
  console.log("💡 TROUBLESHOOTING:");
  console.log("1. Verify this address matches your MetaMask:", wallet.address);
  console.log("2. Check if MetaMask is on the correct network (Ethereum/Polygon)");
  console.log("3. Confirm the private key is from the correct account");
  console.log("4. Try exporting private key from MetaMask again");
  
  // Also check if there might be funds on different addresses
  console.log("");
  console.log("📋 YOUR DEPLOYMENT OPTIONS:");
  console.log("Option 1: Platform is 100% functional without smart contracts");
  console.log("Option 2: Add funds to deploy contracts");
  console.log("Option 3: Verify wallet address/private key accuracy");
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error:", error.message);
    process.exit(1);
  });