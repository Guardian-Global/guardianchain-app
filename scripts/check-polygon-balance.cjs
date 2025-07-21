const { ethers } = require("ethers");

async function main() {
  console.log("🔍 CHECKING POLYGON MAINNET BALANCE");
  console.log("==================================");
  
  const walletAddress = "0x8c7C0A644Cc4C72EBD55b24b43c1290e90fF0a73";
  const privateKey = "de6354f59a5448fc6df8abc332707767bd3f1f35b74f1accc053d5276e749bde";
  
  console.log("Wallet:", walletAddress);
  
  try {
    const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
    const wallet = new ethers.Wallet("0x" + privateKey, provider);
    
    // Check if wallet address matches private key
    console.log("Derived address:", wallet.address);
    console.log("Address match:", wallet.address.toLowerCase() === walletAddress.toLowerCase() ? "✅ YES" : "❌ NO");
    
    // Get MATIC balance
    const balance = await provider.getBalance(walletAddress);
    console.log("MATIC Balance:", ethers.formatEther(balance), "MATIC");
    
    // Get transaction count
    const txCount = await provider.getTransactionCount(walletAddress);
    console.log("Transaction Count:", txCount);
    
    if (parseFloat(ethers.formatEther(balance)) > 0) {
      console.log("✅ FOUND MATIC FUNDS!");
      const usdValue = parseFloat(ethers.formatEther(balance)) * 0.9; // Rough MATIC price
      console.log(`Estimated Value: $${usdValue.toFixed(2)} USD`);
      
      // Check if sufficient for deployment
      const gasLimit = 1500000n;
      const gasPrice = ethers.parseUnits("30", "gwei");
      const deploymentCost = gasLimit * gasPrice;
      
      console.log("Deployment cost:", ethers.formatEther(deploymentCost), "MATIC");
      
      if (balance >= deploymentCost) {
        console.log("✅ SUFFICIENT FUNDS FOR DEPLOYMENT");
        return { canDeploy: true, balance: ethers.formatEther(balance) };
      } else {
        console.log("⚠️ Low funds - may need more MATIC");
        return { canDeploy: false, balance: ethers.formatEther(balance) };
      }
    } else {
      console.log("❌ No MATIC found");
      return { canDeploy: false, balance: "0" };
    }
    
  } catch (error) {
    console.error("❌ Error checking balance:", error.message);
    return { canDeploy: false, error: error.message };
  }
}

main()
  .then((result) => {
    if (result.canDeploy) {
      console.log("\n🚀 READY TO DEPLOY GUARDIANCHAIN ON POLYGON!");
    }
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });