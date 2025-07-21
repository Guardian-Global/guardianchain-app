const hre = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🚀 Starting GUARDIANCHAIN GTT Mainnet Deployment...");
  console.log("=" .repeat(60));

  const [deployer] = await hre.ethers.getSigners();
  console.log(`💰 Deploying with account: ${deployer.address}`);
  
  // Check balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log(`💳 Account balance: ${hre.ethers.formatEther(balance)} ETH`);
  
  if (balance < hre.ethers.parseEther("0.1")) {
    console.log("⚠️  Warning: Low ETH balance. Ensure sufficient funds for deployment.");
  }

  console.log("\n📋 Deployment Configuration:");
  console.log("Network:", hre.network.name);
  console.log("Chain ID:", hre.network.config.chainId);
  
  const deployments = {};

  try {
    // 1. Deploy GTT Token
    console.log("\n🔵 1. Deploying GTT Token Contract...");
    const GTTToken = await hre.ethers.getContractFactory("SimpleGTTToken");
    const gttToken = await GTTToken.deploy();
    await gttToken.waitForDeployment();
    
    const gttAddress = await gttToken.getAddress();
    console.log(`✅ GTT Token deployed to: ${gttAddress}`);
    deployments.gttToken = gttAddress;

    // 2. Deploy Auto-Compound Vault
    console.log("\n🔵 2. Deploying Auto-Compound Vault...");
    const AutoCompoundVault = await hre.ethers.getContractFactory("AutoCompoundVault");
    const vault = await AutoCompoundVault.deploy(gttAddress);
    await vault.waitForDeployment();
    
    const vaultAddress = await vault.getAddress();
    console.log(`✅ Auto-Compound Vault deployed to: ${vaultAddress}`);
    deployments.autoCompoundVault = vaultAddress;

    // 3. Deploy Guardian Pass NFT
    console.log("\n🔵 3. Deploying Guardian Pass NFT...");
    const GuardianPass = await hre.ethers.getContractFactory("GuardianPass");
    const guardianPass = await GuardianPass.deploy();
    await guardianPass.waitForDeployment();
    
    const guardianPassAddress = await guardianPass.getAddress();
    console.log(`✅ Guardian Pass NFT deployed to: ${guardianPassAddress}`);
    deployments.guardianPass = guardianPassAddress;

    // 4. Setup Initial Configuration
    console.log("\n🔧 4. Setting up initial configuration...");
    
    // Grant vault minting permissions
    console.log("Granting vault minting permissions...");
    const MINTER_ROLE = await gttToken.MINTER_ROLE();
    await gttToken.grantRole(MINTER_ROLE, vaultAddress);
    console.log("✅ Vault granted minting permissions");

    // Set vault address in Guardian Pass for yield bonuses
    console.log("Configuring Guardian Pass vault integration...");
    await guardianPass.setVaultAddress(vaultAddress);
    console.log("✅ Guardian Pass vault integration configured");

    // 5. Initial Token Distribution
    console.log("\n💰 5. Initial token distribution...");
    
    // Mint initial supply to deployer
    const initialSupply = hre.ethers.parseEther("100000000"); // 100M GTT
    await gttToken.mint(deployer.address, initialSupply);
    console.log(`✅ Minted ${hre.ethers.formatEther(initialSupply)} GTT to deployer`);

    // 6. Verify Network Configuration
    console.log("\n🔍 6. Verifying deployment...");
    
    // Check GTT token
    const gttSymbol = await gttToken.symbol();
    const gttDecimals = await gttToken.decimals();
    const gttSupply = await gttToken.totalSupply();
    
    console.log(`GTT Symbol: ${gttSymbol}`);
    console.log(`GTT Decimals: ${gttDecimals}`);
    console.log(`GTT Total Supply: ${hre.ethers.formatEther(gttSupply)}`);

    // Check vault configuration
    const vaultToken = await vault.stakingToken();
    const sharePrice = await vault.getSharePrice();
    
    console.log(`Vault Token: ${vaultToken}`);
    console.log(`Initial Share Price: ${hre.ethers.formatEther(sharePrice)}`);

    // Check Guardian Pass
    const passName = await guardianPass.name();
    const passSymbol = await guardianPass.symbol();
    
    console.log(`Guardian Pass Name: ${passName}`);
    console.log(`Guardian Pass Symbol: ${passSymbol}`);

    // 7. Create deployment record
    console.log("\n📄 7. Creating deployment record...");
    
    const deploymentRecord = {
      network: hre.network.name,
      chainId: hre.network.config.chainId,
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
      blockNumber: await hre.ethers.provider.getBlockNumber(),
      contracts: {
        gttToken: {
          address: gttAddress,
          symbol: gttSymbol,
          decimals: gttDecimals.toString(),
          initialSupply: hre.ethers.formatEther(gttSupply)
        },
        autoCompoundVault: {
          address: vaultAddress,
          stakingToken: vaultToken,
          initialSharePrice: hre.ethers.formatEther(sharePrice)
        },
        guardianPass: {
          address: guardianPassAddress,
          name: passName,
          symbol: passSymbol
        }
      },
      configuration: {
        vaultHasMinterRole: true,
        guardianPassVaultIntegrated: true,
        initialDistributionComplete: true
      },
      transactions: {
        gttDeployment: gttToken.deploymentTransaction()?.hash,
        vaultDeployment: vault.deploymentTransaction()?.hash,
        guardianPassDeployment: guardianPass.deploymentTransaction()?.hash
      }
    };

    // Save deployment record
    const deploymentsDir = './deployments';
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    const filename = `${deploymentsDir}/mainnet-${hre.network.name}-${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(deploymentRecord, null, 2));
    
    console.log(`✅ Deployment record saved to: ${filename}`);

    // 8. Post-deployment setup
    console.log("\n🛠️  8. Post-deployment setup...");
    
    // Create initial Guardian Passes for early adopters
    console.log("Minting initial Guardian Passes...");
    const earlyAdopters = [deployer.address]; // Add more addresses as needed
    
    for (const adopter of earlyAdopters) {
      await guardianPass.mint(adopter, "Legendary", 2000, true); // Legendary pass with 20% APY boost
      console.log(`✅ Minted Legendary Guardian Pass to ${adopter}`);
    }

    // 9. Generate contract interaction examples
    console.log("\n📋 9. Generating interaction examples...");
    
    const interactionExamples = {
      gttToken: {
        address: gttAddress,
        examples: {
          checkBalance: `await gttToken.balanceOf("${deployer.address}")`,
          transfer: `await gttToken.transfer("RECIPIENT_ADDRESS", ethers.parseEther("100"))`,
          approve: `await gttToken.approve("${vaultAddress}", ethers.parseEther("1000"))`
        }
      },
      autoCompoundVault: {
        address: vaultAddress,
        examples: {
          deposit: `await vault.deposit(ethers.parseEther("1000"))`,
          withdraw: `await vault.withdraw(ethers.parseEther("500"))`,
          checkShares: `await vault.balanceOf("${deployer.address}")`,
          compound: `await vault.compound()`
        }
      },
      guardianPass: {
        address: guardianPassAddress,
        examples: {
          mint: `await guardianPass.mint("RECIPIENT", "Rare", 500, false)`,
          checkBonus: `await guardianPass.getAPYBonus("${deployer.address}")`,
          checkRarity: `await guardianPass.getRarity(TOKEN_ID)`
        }
      }
    };

    fs.writeFileSync(
      `${deploymentsDir}/interaction-examples-${hre.network.name}.json`,
      JSON.stringify(interactionExamples, null, 2)
    );

    // 10. Final Summary
    console.log("\n🎉 GUARDIANCHAIN MAINNET DEPLOYMENT COMPLETE!");
    console.log("=" .repeat(60));
    console.log(`🔗 Network: ${hre.network.name} (Chain ID: ${hre.network.config.chainId})`);
    console.log(`💰 GTT Token: ${gttAddress}`);
    console.log(`🏦 Auto-Compound Vault: ${vaultAddress}`);
    console.log(`🎫 Guardian Pass NFT: ${guardianPassAddress}`);
    console.log(`📄 Deployment Record: ${filename}`);
    console.log("=" .repeat(60));
    
    console.log("\n📝 Next Steps:");
    console.log("1. Add liquidity to DEXs using addLiquidity.js script");
    console.log("2. Submit CEX listing applications using applyBinance.js");
    console.log("3. Apply to launchpads using applyLaunchpad.js");
    console.log("4. Update frontend contract addresses");
    console.log("5. Begin community distribution and marketing");

    return deploymentRecord;

  } catch (error) {
    console.error("\n❌ Deployment failed:", error);
    
    // Save partial deployment record for debugging
    if (Object.keys(deployments).length > 0) {
      const partialRecord = {
        network: hre.network.name,
        timestamp: new Date().toISOString(),
        partialDeployments: deployments,
        error: error.message
      };
      
      fs.writeFileSync(
        `./deployments/failed-deployment-${Date.now()}.json`,
        JSON.stringify(partialRecord, null, 2)
      );
    }
    
    throw error;
  }
}

// CLI interface
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = main;