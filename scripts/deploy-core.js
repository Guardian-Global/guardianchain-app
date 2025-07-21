import hre from "hardhat";
import fs from 'fs';

async function main() {
    console.log("🚀 Deploying GUARDIANCHAIN Core Contracts to Polygon Mumbai...");
    
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
    
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", hre.ethers.formatEther(balance), "MATIC");
    
    if (balance < hre.ethers.parseEther("0.05")) {
        throw new Error("Insufficient MATIC balance. Need at least 0.05 MATIC.");
    }
    
    try {
        // Deploy SimpleGTTToken first
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
        
        console.log("\n🔧 Configuring contracts...");
        
        // Set TruthVault as tax exempt
        await gttToken.setTaxExempt(vaultAddress, true);
        console.log("✅ TruthVault set as tax exempt");
        
        // Mint initial GTT to TruthVault for yield distribution
        const yieldSupply = hre.ethers.parseEther("10000000"); // 10M GTT for yield
        await gttToken.mint(vaultAddress, yieldSupply);
        console.log("✅ Minted 10M GTT to TruthVault for yield distribution");
        
        const deploymentInfo = {
            network: "mumbai",
            chainId: 80001,
            deployer: deployer.address,
            timestamp: new Date().toISOString(),
            contracts: {
                GTTToken: {
                    address: gttAddress,
                    treasury: deployer.address,
                    yieldPool: deployer.address
                },
                TruthVault: {
                    address: vaultAddress,
                    gttToken: gttAddress
                }
            }
        };
        
        console.log("\n🎉 DEPLOYMENT SUCCESS!");
        console.log("=" * 50);
        console.log("GTTToken Address:", gttAddress);
        console.log("TruthVault Address:", vaultAddress);
        console.log("Mumbai Explorer:");
        console.log(`GTT: https://mumbai.polygonscan.com/address/${gttAddress}`);
        console.log(`Vault: https://mumbai.polygonscan.com/address/${vaultAddress}`);
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

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });