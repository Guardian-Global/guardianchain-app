const hre = require("hardhat");

async function main() {
  console.log("🔍 CHECKING WALLET ADDRESS FROM SCREENSHOT");
  console.log("===========================================");

  // The address from your screenshot appears to be 0x8c7C0...F0a73
  // But let's check what address the private key actually derives to

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer from private key:", deployer.address);

  // Check balance using alternative RPC
  try {
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    const balanceInMatic = hre.ethers.formatEther(balance);
    console.log("Balance:", balanceInMatic, "MATIC");

    // Also check the balance of the address from your screenshot (if different)
    const screenshotAddress = "0x8c7C0a644Cc4C72EBD55b24b43c1290e90fF0a73"; // From your screenshot
    if (deployer.address.toLowerCase() !== screenshotAddress.toLowerCase()) {
      console.log("\nChecking screenshot address:", screenshotAddress);
      const screenshotBalance =
        await hre.ethers.provider.getBalance(screenshotAddress);
      console.log(
        "Screenshot address balance:",
        hre.ethers.formatEther(screenshotBalance),
        "MATIC",
      );
    }

    console.log("\n📱 Based on your screenshot showing 58+ MATIC:");
    console.log("We need to identify which address has the funds");
    console.log("Screenshot shows: GUARDIANCHAIN PROTOCOL");
    console.log("With balance: 58.37626 MATIC");
  } catch (error) {
    console.error("❌ Error checking balance:", error.message);
  }
}

main().catch(console.error);
