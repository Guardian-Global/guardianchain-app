const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 GUARDIANCHAIN GAS ESTIMATION");
  console.log("==============================");
  
  // Estimate gas for GTT token deployment
  const GTTToken = await ethers.getContractFactory("SimpleGTTToken");
  
  // Get current gas price from network
  const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
  const gasPrice = await provider.getFeeData();
  
  console.log("Current gas price:", ethers.formatUnits(gasPrice.gasPrice, "gwei"), "gwei");
  
  // Estimate deployment gas
  const deploymentData = GTTToken.interface.encodeDeploy([
    "0x959C1E8Baa6EB72A0A9F2547B59176a96dD239db", // treasury
    "0x959C1E8Baa6EB72A0A9F2547B59176a96dD239db"  // yieldPool
  ]);
  
  const estimatedGas = 1500000; // Conservative estimate for token deployment
  const totalCost = BigInt(estimatedGas) * gasPrice.gasPrice;
  
  console.log("Estimated gas units:", estimatedGas);
  console.log("Total deployment cost:", ethers.formatEther(totalCost), "MATIC");
  console.log("Total deployment cost in USD (assuming $0.32/MATIC):", (parseFloat(ethers.formatEther(totalCost)) * 0.32).toFixed(4));
  
  // Check what user needs
  console.log("\n💰 SOLUTION:");
  console.log("You need approximately", ethers.formatEther(totalCost), "MATIC for deployment");
  console.log("You can:");
  console.log("1. Swap your 0.005 WETH to MATIC using MetaMask swap");
  console.log("2. Buy ~0.002 MATIC (about $0.001) directly in MetaMask");
  console.log("3. Use a bridge to get MATIC from another chain");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("Error:", error.message);
    process.exit(1);
  });