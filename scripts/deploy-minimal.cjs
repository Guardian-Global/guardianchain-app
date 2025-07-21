const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 MINIMAL GUARDIANCHAIN DEPLOYMENT");
  console.log("=================================");
  
  const [deployer] = await ethers.getSigners();
  console.log("Account:", deployer.address);
  
  // Check balance with different methods
  try {
    const balance1 = await deployer.provider.getBalance(deployer.address);
    console.log("Balance (method 1):", ethers.formatEther(balance1), "MATIC");
    
    const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
    const balance2 = await provider.getBalance(deployer.address);
    console.log("Balance (method 2):", ethers.formatEther(balance2), "MATIC");
    
    // Try with Alchemy
    const alchemyProvider = new ethers.JsonRpcProvider(`https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);
    const balance3 = await alchemyProvider.getBalance(deployer.address);
    console.log("Balance (Alchemy):", ethers.formatEther(balance3), "MATIC");
    
  } catch (error) {
    console.error("Balance check failed:", error.message);
  }
  
  // Get network info
  const network = await deployer.provider.getNetwork();
  console.log("Network:", network.name, "Chain ID:", network.chainId.toString());
  
  // Try deployment with minimal gas
  console.log("\n🔄 Attempting minimal deployment...");
  try {
    const GTTToken = await ethers.getContractFactory("SimpleGTTToken");
    const gttToken = await GTTToken.deploy(
      deployer.address,
      deployer.address,
      {
        gasLimit: 1500000,
        gasPrice: ethers.parseUnits("20", "gwei")
      }
    );
    
    console.log("⏳ Waiting for deployment...");
    await gttToken.waitForDeployment();
    
    const address = await gttToken.getAddress();
    console.log("✅ SUCCESS! GTT Token deployed to:", address);
    
    return address;
    
  } catch (error) {
    console.error("❌ Deployment error:", error.message);
    
    // Check if it's a gas estimation error
    if (error.message.includes("insufficient funds")) {
      console.log("\n💡 Trying even lower gas...");
      try {
        const GTTToken = await ethers.getContractFactory("SimpleGTTToken");
        const gttToken = await GTTToken.deploy(
          deployer.address,
          deployer.address,
          {
            gasLimit: 1000000,
            gasPrice: ethers.parseUnits("15", "gwei")
          }
        );
        
        await gttToken.waitForDeployment();
        const address = await gttToken.getAddress();
        console.log("✅ SUCCESS with low gas! GTT Token deployed to:", address);
        return address;
        
      } catch (error2) {
        console.error("❌ Still failed:", error2.message);
        throw error2;
      }
    }
    throw error;
  }
}

main()
  .then((address) => {
    console.log("\n🎉 DEPLOYMENT COMPLETE!");
    console.log("Contract Address:", address);
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ DEPLOYMENT FAILED");
    console.error("Error:", error.message);
    process.exit(1);
  });