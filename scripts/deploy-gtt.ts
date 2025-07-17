import { ethers } from "hardhat";

async function main() {
  console.log("Deploying GTTToken contract...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy GTTToken
  const GTTToken = await ethers.getContractFactory("GTTToken");
  const gttToken = await GTTToken.deploy();
  await gttToken.waitForDeployment();

  const gttAddress = await gttToken.getAddress();
  console.log("GTTToken deployed to:", gttAddress);

  // Display deployment info
  console.log("\n=== Deployment Summary ===");
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId);
  console.log("GTT Token Address:", gttAddress);
  console.log("Deployer Address:", deployer.address);

  // Verify contract info
  const name = await gttToken.name();
  const symbol = await gttToken.symbol();
  const totalSupply = await gttToken.totalSupply();
  
  console.log("\n=== Contract Info ===");
  console.log("Name:", name);
  console.log("Symbol:", symbol);
  console.log("Total Supply:", ethers.formatEther(totalSupply), "GTT");

  return {
    gttToken: gttAddress,
    deployer: deployer.address,
  };
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});