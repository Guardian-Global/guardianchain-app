// scripts/deploy-v2-complete.js - Complete GTT v2 Deployment
const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
    console.log("🚀 Starting GTT v2 Complete Deployment...");
    
    const [deployer] = await ethers.getSigners();
    console.log("🔑 Deploying with account:", deployer.address);
    
    // Check network
    const network = await ethers.provider.getNetwork();
    const networkName = network.name === "unknown" ? 
        (network.chainId === 137n ? "polygon" : 
         network.chainId === 8453n ? "base" : "unknown") : 
        network.name;
    
    console.log("🌐 Network:", networkName, "Chain ID:", network.chainId.toString());

    // GTT v2 Tokenomics Configuration
    const TOTAL_SUPPLY = ethers.parseUnits("2500000000", 18); // 2.5B GTT
    const ALLOCATIONS = {
        FOUNDER: ethers.parseUnits("1250000000", 18), // 50% - 1.25B GTT
        COMMUNITY: ethers.parseUnits("400000000", 18), // 16% - 400M GTT
        ECOSYSTEM_FUND: ethers.parseUnits("300000000", 18), // 12% - 300M GTT
        VALIDATOR_REWARDS: ethers.parseUnits("200000000", 18), // 8% - 200M GTT
        TREASURY: ethers.parseUnits("300000000", 18), // 12% - 300M GTT
        TRUTH_VAULT: ethers.parseUnits("50000000", 18) // 2% - 50M GTT
    };

    console.log("📊 GTT v2 Allocation Structure:");
    console.log("- Founder (50%):", ethers.formatUnits(ALLOCATIONS.FOUNDER, 18), "GTT");
    console.log("- Community (16%):", ethers.formatUnits(ALLOCATIONS.COMMUNITY, 18), "GTT");
    console.log("- Ecosystem Fund (12%):", ethers.formatUnits(ALLOCATIONS.ECOSYSTEM_FUND, 18), "GTT");
    console.log("- Validator Rewards (8%):", ethers.formatUnits(ALLOCATIONS.VALIDATOR_REWARDS, 18), "GTT");
    console.log("- Treasury (12%):", ethers.formatUnits(ALLOCATIONS.TREASURY, 18), "GTT");
    console.log("- TruthVault (2%):", ethers.formatUnits(ALLOCATIONS.TRUTH_VAULT, 18), "GTT");

    // 1. Deploy GTT Token
    console.log("\n1️⃣ Deploying GTT Token...");
    const GTTToken = await ethers.getContractFactory("GTTToken");
    const gttToken = await GTTToken.deploy();
    await gttToken.waitForDeployment();
    const gttAddress = await gttToken.getAddress();
    console.log("✅ GTT Token deployed to:", gttAddress);

    // 2. Deploy TruthVault
    console.log("\n2️⃣ Deploying TruthVault...");
    const TruthVault = await ethers.getContractFactory("TruthVault");
    const truthVault = await TruthVault.deploy(gttAddress);
    await truthVault.waitForDeployment();
    const vaultAddress = await truthVault.getAddress();
    console.log("✅ TruthVault deployed to:", vaultAddress);

    // 3. Deploy VeritasDAO
    console.log("\n3️⃣ Deploying VeritasDAO...");
    const VeritasDAO = await ethers.getContractFactory("VeritasDAO");
    const veritasDAO = await VeritasDAO.deploy(
        gttAddress,
        ethers.parseUnits("10000", 18), // 10K GTT proposal threshold
        ethers.parseUnits("500000", 18), // 500K GTT quorum
        7 * 24 * 60 * 60, // 7 days voting period
        24 * 60 * 60 // 24 hours execution delay
    );
    await veritasDAO.waitForDeployment();
    const daoAddress = await veritasDAO.getAddress();
    console.log("✅ VeritasDAO deployed to:", daoAddress);

    // 4. Deploy GTTDistributor for founder vesting
    console.log("\n4️⃣ Deploying GTTDistributor (Founder Vesting)...");
    const GTTDistributor = await ethers.getContractFactory("GTTDistributor");
    const distributor = await GTTDistributor.deploy(
        gttAddress,
        deployer.address, // Founder as beneficiary
        Math.floor(Date.now() / 1000), // Start now
        180 * 24 * 60 * 60, // 6 months cliff
        4 * 365 * 24 * 60 * 60 // 4 years vesting
    );
    await distributor.waitForDeployment();
    const distributorAddress = await distributor.getAddress();
    console.log("✅ GTTDistributor deployed to:", distributorAddress);

    // 5. Configure token allocations
    console.log("\n5️⃣ Configuring Token Allocations...");
    
    // Transfer founder allocation to vesting contract
    console.log("- Transferring founder allocation to vesting contract...");
    await gttToken.transfer(distributorAddress, ALLOCATIONS.FOUNDER);
    
    // Transfer vault funding
    console.log("- Funding TruthVault...");
    await gttToken.transfer(vaultAddress, ALLOCATIONS.TRUTH_VAULT);
    
    // Transfer treasury to DAO
    console.log("- Transferring treasury to DAO...");
    await gttToken.transfer(daoAddress, ALLOCATIONS.TREASURY);
    
    // Keep remaining allocations with deployer for manual distribution
    console.log("- Remaining allocations kept with deployer for distribution");

    // 6. Set up minter permissions
    console.log("\n6️⃣ Setting up permissions...");
    // Add TruthVault as minter for yield generation (if needed)
    try {
        await gttToken.addMinter(vaultAddress);
        console.log("✅ TruthVault added as minter");
    } catch (error) {
        console.log("ℹ️ Minter setup not needed or already configured");
    }

    // Verification summary
    console.log("\n✅ GTT v2 Deployment Complete!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    const deploymentSummary = {
        network: networkName,
        chainId: network.chainId.toString(),
        contracts: {
            GTTToken: gttAddress,
            TruthVault: vaultAddress,
            VeritasDAO: daoAddress,
            GTTDistributor: distributorAddress
        },
        allocations: {
            founderVesting: ethers.formatUnits(ALLOCATIONS.FOUNDER, 18) + " GTT",
            truthVault: ethers.formatUnits(ALLOCATIONS.TRUTH_VAULT, 18) + " GTT",
            daoTreasury: ethers.formatUnits(ALLOCATIONS.TREASURY, 18) + " GTT"
        },
        vestingInfo: {
            startTime: new Date().toISOString(),
            cliffDuration: "6 months",
            vestingDuration: "4 years",
            beneficiary: deployer.address
        },
        governanceParams: {
            proposalThreshold: "10,000 GTT",
            quorum: "500,000 GTT",
            votingPeriod: "7 days",
            executionDelay: "24 hours"
        }
    };

    console.log(JSON.stringify(deploymentSummary, null, 2));

    // Save deployment info
    const filename = `deployment-v2-${networkName}-${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(deploymentSummary, null, 2));
    console.log(`📄 Deployment info saved to: ${filename}`);

    return deploymentSummary;
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