// scripts/deploy-complete-mainnet.js
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("🚀 Starting Complete GuardianChain Mainnet Deployment...");
    
    const [deployer] = await ethers.getSigners();
    const deployerAddress = await deployer.getAddress();
    console.log("🔑 Deploying with account:", deployerAddress);
    
    // Check network
    const network = await ethers.provider.getNetwork();
    const networkName = network.name === "unknown" ? 
        (network.chainId === 137n ? "polygon" : 
         network.chainId === 8453n ? "base" : "unknown") : 
        network.name;
    
    console.log("🌐 Network:", networkName, "Chain ID:", network.chainId.toString());
    
    // Network validation
    if (network.chainId !== 137n && network.chainId !== 8453n) {
        throw new Error("❌ Must be on Polygon Mainnet (137) or Base Mainnet (8453)");
    }
    
    // Check balance
    const balance = await ethers.provider.getBalance(deployerAddress);
    const nativeToken = network.chainId === 137n ? "MATIC" : "ETH";
    const minBalance = network.chainId === 137n ? "0.1" : "0.01";
    
    console.log("💰 Account balance:", ethers.formatEther(balance), nativeToken);
    
    if (balance < ethers.parseEther(minBalance)) {
        throw new Error(`❌ Insufficient ${nativeToken} balance. Need at least ${minBalance} ${nativeToken} for deployment.`);
    }
    
    const deploymentAddresses = {};
    const deploymentTxHashes = {};
    
    try {
        // 1. Deploy GTT Token
        console.log("\n📦 Deploying GTTToken...");
        const GTTToken = await ethers.getContractFactory("GTTToken");
        const gttToken = await GTTToken.deploy(deployerAddress);
        await gttToken.waitForDeployment();
        
        const gttAddress = await gttToken.getAddress();
        deploymentAddresses.GTTToken = gttAddress;
        deploymentTxHashes.GTTToken = gttToken.deploymentTransaction().hash;
        console.log("✅ GTTToken deployed to:", gttAddress);
        
        // 2. Deploy TruthVault
        console.log("\n🏛️ Deploying TruthVault...");
        const TruthVault = await ethers.getContractFactory("TruthVault");
        const truthVault = await TruthVault.deploy(gttAddress, deployerAddress);
        await truthVault.waitForDeployment();
        
        const vaultAddress = await truthVault.getAddress();
        deploymentAddresses.TruthVault = vaultAddress;
        deploymentTxHashes.TruthVault = truthVault.deploymentTransaction().hash;
        console.log("✅ TruthVault deployed to:", vaultAddress);
        
        // 3. Deploy VeritasDAO
        console.log("\n🗳️ Deploying VeritasDAO...");
        const VeritasDAO = await ethers.getContractFactory("VeritasDAO");
        const veritasDAO = await VeritasDAO.deploy(gttAddress, deployerAddress);
        await veritasDAO.waitForDeployment();
        
        const daoAddress = await veritasDAO.getAddress();
        deploymentAddresses.VeritasDAO = daoAddress;
        deploymentTxHashes.VeritasDAO = veritasDAO.deploymentTransaction().hash;
        console.log("✅ VeritasDAO deployed to:", daoAddress);
        
        // 4. Deploy VeritasRegistryDAO
        console.log("\n🔐 Deploying VeritasRegistryDAO...");
        const VeritasRegistry = await ethers.getContractFactory("VeritasRegistryDAO");
        const veritasRegistry = await VeritasRegistry.deploy(gttAddress, deployerAddress);
        await veritasRegistry.waitForDeployment();
        
        const registryAddress = await veritasRegistry.getAddress();
        deploymentAddresses.VeritasRegistryDAO = registryAddress;
        deploymentTxHashes.VeritasRegistryDAO = veritasRegistry.deploymentTransaction().hash;
        console.log("✅ VeritasRegistryDAO deployed to:", registryAddress);
        
        // 5. Deploy CapsuleFactory
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
        deploymentTxHashes.CapsuleFactory = capsuleFactory.deploymentTransaction().hash;
        console.log("✅ CapsuleFactory deployed to:", factoryAddress);
        
        // 6. Initial Configuration
        console.log("\n⚙️ Setting up initial configurations...");
        
        // Transfer 10M GTT to TruthVault for rewards
        const vaultAllocation = ethers.parseUnits("10000000", 18); // 10M GTT
        console.log("📤 Transferring 10M GTT to TruthVault...");
        const transferTx = await gttToken.transfer(vaultAddress, vaultAllocation);
        await transferTx.wait();
        console.log("✅ Transferred 10M GTT to TruthVault");
        
        // Add CapsuleFactory as GTT minter
        console.log("🔨 Adding CapsuleFactory as GTT minter...");
        const addMinterTx = await gttToken.addMinter(factoryAddress);
        await addMinterTx.wait();
        console.log("✅ CapsuleFactory added as GTT minter");
        
        // Configure VeritasRegistryDAO parameters
        console.log("🔧 Configuring VeritasRegistryDAO parameters...");
        const minGTT = ethers.parseUnits("1000", 18); // 1000 GTT minimum
        const attestationFee = ethers.parseUnits("100", 18); // 100 GTT fee
        
        const setMinTx = await veritasRegistry.setMinGTTToAttest(minGTT);
        await setMinTx.wait();
        const setFeeTx = await veritasRegistry.setAttestationFee(attestationFee);
        await setFeeTx.wait();
        console.log("✅ VeritasRegistryDAO configured");
        
        // 7. Verification
        console.log("\n📊 Verifying deployment...");
        const gttBalance = await gttToken.balanceOf(deployerAddress);
        const vaultBalance = await gttToken.balanceOf(vaultAddress);
        const totalSupply = await gttToken.totalSupply();
        
        console.log("💎 GTT Total Supply:", ethers.formatUnits(totalSupply, 18));
        console.log("💰 Deployer GTT Balance:", ethers.formatUnits(gttBalance, 18));
        console.log("🏛️ Vault GTT Balance:", ethers.formatUnits(vaultBalance, 18));
        
        // 8. Generate environment variables for frontend
        const envConfig = {
            [`NEXT_PUBLIC_GTT_ADDRESS_${networkName.toUpperCase()}`]: gttAddress,
            [`NEXT_PUBLIC_TRUTH_VAULT_ADDRESS_${networkName.toUpperCase()}`]: vaultAddress,
            [`NEXT_PUBLIC_VERITAS_DAO_ADDRESS_${networkName.toUpperCase()}`]: daoAddress,
            [`NEXT_PUBLIC_VERITAS_REGISTRY_ADDRESS_${networkName.toUpperCase()}`]: registryAddress,
            [`NEXT_PUBLIC_CAPSULE_FACTORY_ADDRESS_${networkName.toUpperCase()}`]: factoryAddress,
        };
        
        // Save deployment info
        const deploymentInfo = {
            network: networkName,
            chainId: Number(network.chainId),
            deployer: deployerAddress,
            timestamp: new Date().toISOString(),
            gasUsed: network.chainId === 137n ? "~0.05 MATIC" : "~0.005 ETH",
            contracts: deploymentAddresses,
            transactionHashes: deploymentTxHashes,
            environmentVariables: envConfig,
            verification: {
                gttTotalSupply: ethers.formatUnits(totalSupply, 18),
                deployerBalance: ethers.formatUnits(gttBalance, 18),
                vaultBalance: ethers.formatUnits(vaultBalance, 18),
                minGTTToAttest: ethers.formatUnits(minGTT, 18),
                attestationFee: ethers.formatUnits(attestationFee, 18)
            }
        };
        
        // Create deployments directory if it doesn't exist
        const deploymentsDir = "deployments";
        if (!fs.existsSync(deploymentsDir)) {
            fs.mkdirSync(deploymentsDir);
        }
        
        // Save deployment file
        const deploymentFile = path.join(deploymentsDir, `${networkName}-mainnet-deployment.json`);
        fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
        
        // Save environment variables file
        const envFile = path.join(deploymentsDir, `${networkName}-env-vars.txt`);
        const envContent = Object.entries(envConfig)
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');
        fs.writeFileSync(envFile, envContent);
        
        console.log(`\n🎉 ${networkName.toUpperCase()} MAINNET DEPLOYMENT SUCCESSFUL!`);
        console.log("📄 Deployment info saved to:", deploymentFile);
        console.log("🔧 Environment variables saved to:", envFile);
        console.log("\n📋 Contract Addresses:");
        Object.entries(deploymentAddresses).forEach(([name, address]) => {
            console.log(`   ${name}: ${address}`);
        });
        
        console.log("\n🔧 Add these to your .env file:");
        Object.entries(envConfig).forEach(([key, value]) => {
            console.log(`${key}=${value}`);
        });
        
        console.log(`\n🔍 Verify contracts on ${networkName === 'polygon' ? 'PolygonScan' : 'BaseScan'}:`);
        Object.entries(deploymentAddresses).forEach(([name, address]) => {
            const explorerUrl = networkName === 'polygon' 
                ? `https://polygonscan.com/address/${address}`
                : `https://basescan.org/address/${address}`;
            console.log(`   ${name}: ${explorerUrl}`);
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