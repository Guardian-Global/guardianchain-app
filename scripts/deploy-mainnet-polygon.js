// scripts/deploy-mainnet-polygon.js
const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
    console.log("🚀 Starting Polygon Mainnet Deployment...");
    
    const [deployer] = await ethers.getSigners();
    const deployerAddress = await deployer.getAddress();
    console.log("🔑 Deploying with account:", deployerAddress);
    
    // Check network
    const network = await ethers.provider.getNetwork();
    console.log("🌐 Network:", network.name, "Chain ID:", network.chainId.toString());
    
    if (network.chainId !== 137n) {
        throw new Error("❌ Must be on Polygon Mainnet (chainId: 137)");
    }
    
    // Check balance
    const balance = await ethers.provider.getBalance(deployerAddress);
    console.log("💰 Account balance:", ethers.formatEther(balance), "MATIC");
    
    if (balance < ethers.parseEther("0.1")) {
        throw new Error("❌ Insufficient MATIC balance. Need at least 0.1 MATIC for deployment.");
    }
    
    const deploymentAddresses = {};
    
    try {
        // 1. Deploy GTT Token
        console.log("\n📦 Deploying GTT Token...");
        const GTTToken = await ethers.getContractFactory("GTTToken");
        const gttToken = await GTTToken.deploy(deployerAddress);
        await gttToken.waitForDeployment();
        
        const gttAddress = await gttToken.getAddress();
        deploymentAddresses.GTTToken = gttAddress;
        console.log("✅ GTT Token deployed to:", gttAddress);
        
        // 2. Deploy TruthVault
        console.log("\n🏛️ Deploying TruthVault...");
        const TruthVault = await ethers.getContractFactory("TruthVault");
        const truthVault = await TruthVault.deploy(gttAddress, deployerAddress);
        await truthVault.waitForDeployment();
        
        const vaultAddress = await truthVault.getAddress();
        deploymentAddresses.TruthVault = vaultAddress;
        console.log("✅ TruthVault deployed to:", vaultAddress);
        
        // 3. Deploy Veritas Registry DAO
        console.log("\n🔐 Deploying VeritasRegistryDAO...");
        const VeritasRegistry = await ethers.getContractFactory("VeritasRegistryDAO");
        const veritasRegistry = await VeritasRegistry.deploy(gttAddress, deployerAddress);
        await veritasRegistry.waitForDeployment();
        
        const registryAddress = await veritasRegistry.getAddress();
        deploymentAddresses.VeritasRegistryDAO = registryAddress;
        console.log("✅ VeritasRegistryDAO deployed to:", registryAddress);
        
        // 4. Deploy Capsule Factory
        console.log("\n🏭 Deploying CapsuleFactory...");
        const CapsuleFactory = await ethers.getContractFactory("CapsuleFactory");
        const capsuleFactory = await CapsuleFactory.deploy(
            gttAddress,
            registryAddress,
            deployerAddress
        );
        await capsuleFactory.waitForDeployment();
        
        const factoryAddress = await capsuleFactory.getAddress();
        deploymentAddresses.CapsuleFactory = factoryAddress;
        console.log("✅ CapsuleFactory deployed to:", factoryAddress);
        
        // 5. Initial Setup - Transfer 10M GTT to TruthVault
        console.log("\n⚙️ Setting up initial configurations...");
        const transferAmount = ethers.parseUnits("10000000", 18); // 10M GTT
        
        console.log("📤 Transferring 10M GTT to TruthVault...");
        const transferTx = await gttToken.transfer(vaultAddress, transferAmount);
        await transferTx.wait();
        console.log("✅ Transferred 10M GTT to TruthVault");
        
        // 6. Add CapsuleFactory as minter
        console.log("🔨 Adding CapsuleFactory as GTT minter...");
        const addMinterTx = await gttToken.addMinter(factoryAddress);
        await addMinterTx.wait();
        console.log("✅ CapsuleFactory added as GTT minter");
        
        // 7. Verify balances
        console.log("\n📊 Verifying deployment...");
        const gttBalance = await gttToken.balanceOf(deployerAddress);
        const vaultBalance = await gttToken.balanceOf(vaultAddress);
        const totalSupply = await gttToken.totalSupply();
        
        console.log("💎 GTT Total Supply:", ethers.formatUnits(totalSupply, 18));
        console.log("💰 Deployer GTT Balance:", ethers.formatUnits(gttBalance, 18));
        console.log("🏛️ Vault GTT Balance:", ethers.formatUnits(vaultBalance, 18));
        
        // Save deployment info
        const deploymentInfo = {
            network: "polygon",
            chainId: Number(network.chainId),
            deployer: deployerAddress,
            timestamp: new Date().toISOString(),
            gasUsed: "~0.05 MATIC", // Estimated
            contracts: deploymentAddresses,
            verification: {
                gttTotalSupply: ethers.formatUnits(totalSupply, 18),
                deployerBalance: ethers.formatUnits(gttBalance, 18),
                vaultBalance: ethers.formatUnits(vaultBalance, 18)
            }
        };
        
        fs.writeFileSync(
            "polygon-mainnet-deployment.json",
            JSON.stringify(deploymentInfo, null, 2)
        );
        
        console.log("\n🎉 POLYGON MAINNET DEPLOYMENT SUCCESSFUL!");
        console.log("📄 Deployment info saved to: polygon-mainnet-deployment.json");
        console.log("\n📋 Contract Addresses:");
        Object.entries(deploymentAddresses).forEach(([name, address]) => {
            console.log(`   ${name}: ${address}`);
        });
        
    } catch (error) {
        console.error("\n❌ Deployment failed:", error.message);
        throw error;
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });