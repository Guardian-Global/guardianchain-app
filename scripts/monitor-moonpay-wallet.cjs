const { ethers } = require("ethers");

async function monitorMoonPayWallet() {
  console.log("🔍 MONITORING MOONPAY DELIVERY");
  console.log("=============================");
  
  const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
  const moonpayWallet = "0x26A61461802E74A265c7548Efb8CaDDf4c4a81Dc";
  const deploymentWallet = "0xD500A7fED4ef78c6d99888c8FeBDbA4BcB12ed38";
  
  console.log("📍 MoonPay Wallet:", moonpayWallet);
  console.log("🎯 Deployment Wallet:", deploymentWallet);
  console.log("💰 Checking every 30 seconds for POL delivery...");
  console.log("");

  const checkBalance = async () => {
    try {
      const balance = await provider.getBalance(moonpayWallet);
      const balanceInPol = ethers.formatEther(balance);
      
      const timestamp = new Date().toLocaleTimeString();
      console.log(`⏰ ${timestamp} - MoonPay Wallet Balance: ${balanceInPol} POL`);
      
      if (parseFloat(balanceInPol) >= 0.1) {
        console.log("");
        console.log("🎉 POL DELIVERED TO MOONPAY WALLET!");
        console.log("💰 Balance:", balanceInPol, "POL");
        console.log("");
        console.log("📋 NEXT STEP - TRANSFER INSTRUCTIONS:");
        console.log("=====================================");
        console.log("1. Open your wallet app (MoonPay/MetaMask)");
        console.log("2. Find your POL balance");
        console.log("3. Send 0.1 POL to deployment wallet:");
        console.log("   " + deploymentWallet);
        console.log("");
        console.log("4. Once sent, GTT token deploys automatically!");
        console.log("   Target address: 0x742d35Cc66535C0532925a3b8d0E9B01d9c5d9A6C");
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.log(`❌ ${new Date().toLocaleTimeString()} - Check failed:`, error.message);
      return false;
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

monitorMoonPayWallet().catch(console.error);