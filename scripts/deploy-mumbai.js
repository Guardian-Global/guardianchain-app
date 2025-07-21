import pkg from 'hardhat';
const { ethers } = pkg;
import fs from 'fs';

async function main() {
    console.log("🚀 Starting GUARDIANCHAIN deployment to Polygon Mumbai...");
    
    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
    
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", ethers.formatEther(balance), "MATIC");
    
    if (balance < ethers.parseEther("0.1")) {
        throw new Error("Insufficient MATIC balance for deployment. Need at least 0.1 MATIC.");
    }
    
    try {
        // Deploy SimpleGTTToken first
        console.log("\n📄 Deploying SimpleGTTToken...");
        const GTTToken = await ethers.getContractFactory("SimpleGTTToken");
        
        // Set treasury and yield pool addresses (deployer for now)
        const treasury = deployer.address;
        const yieldPool = deployer.address;
        
        const gttToken = await GTTToken.deploy(treasury, yieldPool);
        await gttToken.waitForDeployment();
        
        console.log("✅ GTTToken deployed to:", await gttToken.getAddress());
        console.log("   Treasury:", treasury);
        console.log("   Yield Pool:", yieldPool);
        
        // Deploy TruthVault
        console.log("\n🏛️ Deploying TruthVault...");
        const TruthVault = await ethers.getContractFactory("TruthVault");
        const truthVault = await TruthVault.deploy(await gttToken.getAddress());
        await truthVault.waitForDeployment();
        
        console.log("✅ TruthVault deployed to:", await truthVault.getAddress());
        
        // Update GTT token's yield pool to TruthVault
        console.log("\n🔧 Configuring contracts...");
        
        // Set TruthVault as tax exempt
        await gttToken.setTaxExempt(await truthVault.getAddress(), true);
        console.log("✅ TruthVault set as tax exempt");
        
        // Mint initial GTT to TruthVault for yield distribution
        const yieldSupply = ethers.parseEther("10000000"); // 10M GTT for yield
        await gttToken.mint(await truthVault.getAddress(), yieldSupply);
        console.log("✅ Minted 10M GTT to TruthVault for yield distribution");
        
        // Verify deployment
        console.log("\n🔍 Verifying deployment...");
        const gttInfo = await gttToken.getTokenInfo();
        const vaultStats = await truthVault.getSystemStats();
        
        console.log("GTT Token Info:");
        console.log("  Total Supply:", ethers.formatEther(gttInfo.totalSupply_));
        console.log("  Max Supply:", ethers.formatEther(gttInfo.maxSupply_));
        console.log("  Trading Tax:", gttInfo.tradingTax_.toString(), "basis points");
        
        console.log("TruthVault Stats:");
        console.log("  Total Capsules:", vaultStats.totalCapsules.toString());
        console.log("  Base Yield:", ethers.formatEther(vaultStats.baseYield));
        
        // Save deployment info
        const deploymentInfo = {
            network: "mumbai",
            chainId: 80001,
            deployer: deployer.address,
            timestamp: new Date().toISOString(),
            contracts: {
                GTTToken: {
                    address: await gttToken.getAddress(),
                    treasury: treasury,
                    yieldPool: yieldPool
                },
                TruthVault: {
                    address: await truthVault.getAddress(),
                    gttToken: await gttToken.getAddress()
                }
            },
            verification: {
                gttTotalSupply: ethers.formatEther(gttInfo.totalSupply_),
                gttTradingTax: gttInfo.tradingTax_.toString(),
                vaultBaseYield: ethers.formatEther(vaultStats.baseYield)
            }
        };
        
        console.log("\n🎉 DEPLOYMENT COMPLETE!");
        console.log("=" * 50);
        console.log("GTTToken Address:", await gttToken.getAddress());
        console.log("TruthVault Address:", await truthVault.getAddress());
        console.log("=" * 50);
        
        // Write deployment info to file
        fs.writeFileSync('deployment-mumbai.json', JSON.stringify(deploymentInfo, null, 2));
        console.log("📁 Deployment info saved to deployment-mumbai.json");
        
        return deploymentInfo;
        
    } catch (error) {
        console.error("❌ Deployment failed:", error.message);
        throw error;
    }
}

// Handle script execution
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

export default main;