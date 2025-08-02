const { ethers } = require("ethers");

async function main() {
  console.log("🔍 CHECKING PRIVATE KEY MAPPING");
  console.log("================================");

  const privateKey =
    "0xde6354f59a5448fc6df8abc332707767bd3f1f35b74f1accc053d5276e749bde";

  // Create wallet from private key
  const wallet = new ethers.Wallet(privateKey);

  console.log("Private Key:", privateKey);
  console.log("Corresponding Address:", wallet.address);

  console.log("\n🔗 Address Comparison:");
  console.log("Expected:", "0x8c7C0A644Cc4C72EBD55b24b43c1290e90fF0a73");
  console.log("Actual  :", wallet.address);

  if (
    wallet.address.toLowerCase() ===
    "0x8c7C0A644Cc4C72EBD55b24b43c1290e90fF0a73".toLowerCase()
  ) {
    console.log("✅ MATCH: Private key corresponds to expected address");
  } else {
    console.log("❌ MISMATCH: Private key corresponds to different address");
    console.log("Need to use the actual address with funds:", wallet.address);
  }
}

main().catch(console.error);
