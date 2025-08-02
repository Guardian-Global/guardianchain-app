const { ethers } = require("ethers");

async function main() {
  console.log("🔍 VERIFYING PRIVATE KEY DERIVATION");
  console.log("===================================");

  const privateKeyFromScreenshot =
    "8b170cf9fdb9a9dc5b1e6229ab0e8ac2fde5198e422f8d72f6861b59edf8c7b8";
  const expectedAddress = "0x959C1E8Baa6EB72A0A9F2547B59176a96dD239db";

  console.log("Private Key from Screenshot:", privateKeyFromScreenshot);
  console.log("Expected Address:", expectedAddress);

  // Try without 0x prefix
  try {
    const wallet1 = new ethers.Wallet(privateKeyFromScreenshot);
    console.log("Derived Address (no prefix):", wallet1.address);

    if (wallet1.address.toLowerCase() === expectedAddress.toLowerCase()) {
      console.log("✅ MATCH: Private key is correct without 0x prefix");
    }
  } catch (e) {
    console.log("❌ Failed without 0x prefix:", e.message);
  }

  // Try with 0x prefix
  try {
    const wallet2 = new ethers.Wallet("0x" + privateKeyFromScreenshot);
    console.log("Derived Address (with 0x):", wallet2.address);

    if (wallet2.address.toLowerCase() === expectedAddress.toLowerCase()) {
      console.log("✅ MATCH: Private key is correct with 0x prefix");
    }
  } catch (e) {
    console.log("❌ Failed with 0x prefix:", e.message);
  }

  console.log("\n🎯 TARGET VERIFICATION:");
  console.log("We need to derive:", expectedAddress);
  console.log(
    "To deploy GTT token to: 0x742d35Cc66535C0532925a3b8d0E9B01d9c5d9A6C",
  );
}

main().catch(console.error);
