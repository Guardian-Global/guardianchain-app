import hre from "hardhat";

async function main() {
    console.log("🚀 Deploying GUARDIANCHAIN to Polygon Mumbai...");
    
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
    
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", hre.ethers.formatEther(balance), "MATIC");
    
    try {
        console.log("\n📄 Deploying SimpleGTTToken...");
        const GTTToken = await hre.ethers.getContractFactory("SimpleGTTToken");
        const gttToken = await GTTToken.deploy(deployer.address, deployer.address);
        await gttToken.waitForDeployment();
        
        const gttAddress = await gttToken.getAddress();
        console.log("✅ GTTToken deployed to:", gttAddress);
        
        console.log("\n🏛️ Deploying TruthVault...");
        const TruthVault = await hre.ethers.getContractFactory("TruthVault");
        const truthVault = await TruthVault.deploy(gttAddress);
        await truthVault.waitForDeployment();
        
        const vaultAddress = await truthVault.getAddress();
        console.log("✅ TruthVault deployed to:", vaultAddress);
        
        console.log("\n🎉 DEPLOYMENT SUCCESS!");
        console.log("GTTToken:", gttAddress);
        console.log("TruthVault:", vaultAddress);
        
        return { gttAddress, vaultAddress };
        
    } catch (error) {
        console.error("❌ Deployment failed:", error);
        throw error;
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });