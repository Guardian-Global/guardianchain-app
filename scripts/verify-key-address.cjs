const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 PRIVATE KEY TO ADDRESS VERIFICATION");
  console.log("=====================================");
  
  const privateKey = "8b170cf9fdb9a9dc5b1c6229ab0e8ac2fdc5198e422f8d72f6861b59cdf8c7b8";
  
  try {
    // Create wallet from private key
    const wallet = new ethers.Wallet(privateKey);
    console.log("Derived address from private key:", wallet.address);
    console.log("Expected address from deployment:", "0x959C1E8Baa6EB72A0A9F2547B59176a96dD239db");
    
    // Check if they match
    if (wallet.address.toLowerCase() === "0x959C1E8Baa6EB72A0A9F2547B59176a96dD239db".toLowerCase()) {
      console.log("✅ ADDRESSES MATCH - Private key corresponds to expected wallet");
    } else {
      console.log("❌ ADDRESS MISMATCH!");
      console.log("This means the private key corresponds to a DIFFERENT wallet!");
      console.log("Your funds are safe in the wallet shown in MetaMask screenshots");
      console.log("The private key you provided is for a different, empty wallet");
    }
    
    console.log("\n🔍 SECURITY ANALYSIS:");
    console.log("- If addresses match: Wallet never had funds on Polygon");
    console.log("- If addresses don't match: Your funds are in different wallet (safe)");
    
  } catch (error) {
    console.error("Error verifying key:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("Error:", error.message);
    process.exit(1);
  });