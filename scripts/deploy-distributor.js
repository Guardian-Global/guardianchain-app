// scripts/deploy-distributor.js
const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Deploying GTTDistributor with 4-year vesting...");
    
    const [deployer] = await ethers.getSigners();
    console.log("🔑 Deploying with account:", deployer.address);

    // Configuration
    const GTT_ADDRESS = process.env.GTT_ADDRESS || "0x0000000000000000000000000000000000000000"; // Will be set after GTT deployment
    const BENEFICIARY = deployer.address; // Founder address
    const START_TIME = Math.floor(Date.now() / 1000); // Current timestamp
    const CLIFF_DURATION = 180 * 24 * 60 * 60; // 6 months in seconds
    const VESTING_DURATION = 4 * 365 * 24 * 60 * 60; // 4 years in seconds

    console.log("📊 Vesting Parameters:");
    console.log("- Start Time:", new Date(START_TIME * 1000).toISOString());
    console.log("- Cliff Duration:", CLIFF_DURATION / (24 * 60 * 60), "days");
    console.log("- Total Duration:", VESTING_DURATION / (365 * 24 * 60 * 60), "years");
    console.log("- Beneficiary:", BENEFICIARY);

    // Deploy GTTDistributor
    const GTTDistributor = await ethers.getContractFactory("GTTDistributor");
    const distributor = await GTTDistributor.deploy(
        GTT_ADDRESS,
        BENEFICIARY,
        START_TIME,
        CLIFF_DURATION,
        VESTING_DURATION
    );

    await distributor.waitForDeployment();
    const distributorAddress = await distributor.getAddress();

    console.log("✅ GTTDistributor deployed to:", distributorAddress);
    
    // Save deployment info
    const deploymentInfo = {
        network: network.name,
        distributorAddress: distributorAddress,
        gttAddress: GTT_ADDRESS,
        beneficiary: BENEFICIARY,
        startTime: START_TIME,
        cliffDuration: CLIFF_DURATION,
        vestingDuration: VESTING_DURATION,
        deployedAt: new Date().toISOString()
    };

    console.log("📄 Deployment Info:", JSON.stringify(deploymentInfo, null, 2));
    
    // Verify contract if on mainnet
    if (network.name !== "hardhat" && network.name !== "localhost") {
        console.log("⏳ Waiting 30 seconds before verification...");
        await new Promise(resolve => setTimeout(resolve, 30000));
        
        try {
            await hre.run("verify:verify", {
                address: distributorAddress,
                constructorArguments: [
                    GTT_ADDRESS,
                    BENEFICIARY,
                    START_TIME,
                    CLIFF_DURATION,
                    VESTING_DURATION
                ]
            });
            console.log("✅ Contract verified on block explorer");
        } catch (error) {
            console.log("⚠️ Verification failed:", error.message);
        }
    }

    return distributorAddress;
}

if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = main;