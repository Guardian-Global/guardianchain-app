const { ethers } = require("ethers");

async function main() {
  console.log("🔍 WALLET ADDRESS ANALYSIS");
  console.log("==========================");

  // From screenshot: 0x959C1...239db with 58.37626 MATIC
  const fundedAddress = "0x959C1E8Baa6EB72A0A9F2547B59176a96dD239db"; // Full address from previous context

  // Currently configured wallet
  const privateKey =
    "de6354f59a5448fc6df8abc332707767bd3f1f35b74f1accc053d5276e749bde";
  const wallet = new ethers.Wallet(privateKey);

  console.log("📱 From Screenshot:");
  console.log("Funded Address:", fundedAddress);
  console.log("Balance: 58.37626 MATIC");

  console.log("\n🔧 Currently Configured:");
  console.log("Private Key:", privateKey);
  console.log("Derived Address:", wallet.address);

  console.log("\n🔍 Address Comparison:");
  if (wallet.address.toLowerCase() === fundedAddress.toLowerCase()) {
    console.log("✅ MATCH: Private key corresponds to funded wallet");
    console.log("✅ Ready to deploy!");
  } else {
    console.log("❌ MISMATCH: Need to use funded wallet for deployment");
    console.log("Option 1: Get private key for", fundedAddress);
    console.log(
      "Option 2: Send 0.1 MATIC from",
      fundedAddress,
      "to",
      wallet.address,
    );
  }

  // Check if we need the private key for the funded wallet
  console.log("\n💡 RECOMMENDATION:");
  console.log("If these addresses don't match, please either:");
  console.log("1. Send 0.1 MATIC from your funded wallet to:", wallet.address);
  console.log(
    "2. Or provide the private key for your funded wallet:",
    fundedAddress,
  );
}

main().catch(console.error);
