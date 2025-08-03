import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

interface DeploymentResult {
  network: string;
  gttToken: string;
  airdropContract: string;
  deployer: string;
  totalSupply: string;
  airdropAllocation: string;
  gasUsed: string;
  transactionHashes: string[];
}

async function main(): Promise<DeploymentResult> {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  
  console.log("\n🚀 DEPLOYING GTT TOKEN & AIRDROP TO BASE NETWORK");
  console.log("================================================");
  console.log(`Network: Base (${network.chainId})`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Balance: ${ethers.utils.formatEther(await deployer.getBalance())} ETH\n`);

  const transactionHashes: string[] = [];
  let totalGasUsed = ethers.BigNumber.from(0);

  // Deploy GTT Token Contract
  console.log("1️⃣ Deploying GTT Token Contract...");
  const GTTToken = await ethers.getContractFactory("GTTToken");
  const gttToken = await GTTToken.deploy(
    "GuardianChain Truth Token", // name
    "GTT", // symbol
    ethers.utils.parseEther("1000000000"), // 1 billion total supply
    deployer.address // initial owner
  );
  
  await gttToken.deployed();
  console.log(`✅ GTT Token deployed to: ${gttToken.address}`);
  console.log(`   Transaction: ${gttToken.deployTransaction.hash}`);
  transactionHashes.push(gttToken.deployTransaction.hash);
  
  const gttReceipt = await gttToken.deployTransaction.wait();
  totalGasUsed = totalGasUsed.add(gttReceipt.gasUsed);

  // Deploy Airdrop Contract
  console.log("\n2️⃣ Deploying Airdrop Contract...");
  const BaseAirdrop = await ethers.getContractFactory("BaseAirdrop");
  const airdropContract = await BaseAirdrop.deploy(
    gttToken.address, // GTT token address
    ethers.utils.parseEther("250000"), // 250,000 GTT airdrop allocation
    Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days from now
    ethers.utils.parseEther("1.5") // 1.5x multiplier for Coinbase wallet users
  );

  await airdropContract.deployed();
  console.log(`✅ Airdrop Contract deployed to: ${airdropContract.address}`);
  console.log(`   Transaction: ${airdropContract.deployTransaction.hash}`);
  transactionHashes.push(airdropContract.deployTransaction.hash);
  
  const airdropReceipt = await airdropContract.deployTransaction.wait();
  totalGasUsed = totalGasUsed.add(airdropReceipt.gasUsed);

  // Transfer airdrop allocation to airdrop contract
  console.log("\n3️⃣ Transferring Airdrop Allocation...");
  const transferTx = await gttToken.transfer(
    airdropContract.address,
    ethers.utils.parseEther("250000")
  );
  
  await transferTx.wait();
  console.log(`✅ Transferred 250,000 GTT to airdrop contract`);
  console.log(`   Transaction: ${transferTx.hash}`);
  transactionHashes.push(transferTx.hash);
  
  const transferReceipt = await transferTx.wait();
  totalGasUsed = totalGasUsed.add(transferReceipt.gasUsed);

  // Verify deployment
  console.log("\n4️⃣ Verifying Deployment...");
  const tokenSupply = await gttToken.totalSupply();
  const airdropBalance = await gttToken.balanceOf(airdropContract.address);
  const deployerBalance = await gttToken.balanceOf(deployer.address);

  console.log(`✅ Token Total Supply: ${ethers.utils.formatEther(tokenSupply)} GTT`);
  console.log(`✅ Airdrop Contract Balance: ${ethers.utils.formatEther(airdropBalance)} GTT`);
  console.log(`✅ Deployer Balance: ${ethers.utils.formatEther(deployerBalance)} GTT`);

  const result: DeploymentResult = {
    network: `Base (Chain ID: ${network.chainId})`,
    gttToken: gttToken.address,
    airdropContract: airdropContract.address,
    deployer: deployer.address,
    totalSupply: ethers.utils.formatEther(tokenSupply),
    airdropAllocation: ethers.utils.formatEther(airdropBalance),
    gasUsed: ethers.utils.formatEther(totalGasUsed.mul(ethers.utils.parseUnits("1", "gwei"))),
    transactionHashes
  };

  console.log("\n🎉 DEPLOYMENT COMPLETE!");
  console.log("======================");
  console.log(JSON.stringify(result, null, 2));

  // Generate environment variables
  console.log("\n📝 Add these to your .env file:");
  console.log("================================");
  console.log(`VITE_GTT_BASE_ADDRESS=${gttToken.address}`);
  console.log(`VITE_AIRDROP_BASE_ADDRESS=${airdropContract.address}`);
  console.log(`BASE_GTT_DEPLOYED_BLOCK=${gttReceipt.blockNumber}`);
  console.log(`BASE_AIRDROP_DEPLOYED_BLOCK=${airdropReceipt.blockNumber}`);

  return result;
}

// Execute deployment
if (require.main === module) {
  main()
    .then((result) => {
      console.log("\n✨ Base network deployment successful!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Deployment failed:", error);
      process.exit(1);
    });
}

export { main as deployBaseGTT };