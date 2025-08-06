// scripts/verify-contracts.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function verifyContracts(network) {
    console.log(`🔍 Starting contract verification for ${network} network...`);
    
    const deploymentFile = path.join('deployments', `${network}-mainnet-deployment.json`);
    
    if (!fs.existsSync(deploymentFile)) {
        console.error(`❌ Deployment file not found: ${deploymentFile}`);
        process.exit(1);
    }
    
    const deployment = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
    const contracts = deployment.contracts;
    
    const verificationCommands = {
        GTTToken: `npx hardhat verify --network ${network} ${contracts.GTTToken} "${deployment.deployer}"`,
        TruthVault: `npx hardhat verify --network ${network} ${contracts.TruthVault} "${contracts.GTTToken}" "${deployment.deployer}"`,
        VeritasDAO: `npx hardhat verify --network ${network} ${contracts.VeritasDAO} "${contracts.GTTToken}" "${deployment.deployer}"`,
        VeritasRegistryDAO: `npx hardhat verify --network ${network} ${contracts.VeritasRegistryDAO} "${contracts.GTTToken}" "${deployment.deployer}"`,
        CapsuleFactory: `npx hardhat verify --network ${network} ${contracts.CapsuleFactory} "${contracts.GTTToken}" "${contracts.VeritasRegistryDAO}" "${deployment.deployer}"`
    };
    
    console.log('\n📋 Contract Verification Commands:');
    console.log('=====================================');
    
    for (const [contractName, command] of Object.entries(verificationCommands)) {
        console.log(`\n🔍 ${contractName}:`);
        console.log(`   Address: ${contracts[contractName]}`);
        console.log(`   Command: ${command}`);
        
        try {
            console.log(`   ⏳ Verifying...`);
            execSync(command, { stdio: 'inherit' });
            console.log(`   ✅ ${contractName} verified successfully!`);
        } catch (error) {
            console.log(`   ❌ ${contractName} verification failed:`, error.message);
        }
    }
    
    console.log('\n🎉 Contract verification process completed!');
    
    // Output explorer links
    const explorerBase = network === 'polygon' ? 'https://polygonscan.com' : 'https://basescan.org';
    
    console.log(`\n🔗 Block Explorer Links (${network}):`);
    console.log('=====================================');
    
    for (const [contractName, address] of Object.entries(contracts)) {
        console.log(`${contractName}: ${explorerBase}/address/${address}`);
    }
}

// Command line usage
const args = process.argv.slice(2);
const network = args[0];

if (!network || !['polygon', 'base'].includes(network)) {
    console.error('❌ Usage: node scripts/verify-contracts.js <polygon|base>');
    process.exit(1);
}

verifyContracts(network)
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Verification failed:', error);
        process.exit(1);
    });