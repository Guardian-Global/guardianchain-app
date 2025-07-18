const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying CapsuleFactoryV2...");
  
  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // Set Veritus node (use deployer address for development)
  const veritusNode = deployer.address;
  
  // Deploy CapsuleFactoryV2
  const CapsuleFactoryV2 = await ethers.getContractFactory("CapsuleFactoryV2");
  const factoryV2 = await CapsuleFactoryV2.deploy(veritusNode);
  
  await factoryV2.waitForDeployment();
  
  const factoryV2Address = await factoryV2.getAddress();
  console.log("CapsuleFactoryV2 deployed to:", factoryV2Address);
  console.log("Veritus node set to:", veritusNode);
  
  // Verify deployment
  const deployedVeritusNode = await factoryV2.veritusNode();
  const capsuleCount = await factoryV2.capsuleCount();
  
  console.log("Deployed contract verification:");
  console.log("- Veritus node:", deployedVeritusNode);
  console.log("- Initial capsule count:", capsuleCount.toString());
  
  console.log("\nUpdate client/src/lib/contracts.ts with this address:");
  console.log(`factoryV2: "${factoryV2Address}",`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
