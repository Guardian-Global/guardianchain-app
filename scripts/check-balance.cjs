const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 CHECKING WALLET BALANCES ON POLYGON MAINNET");
  console.log("==============================================");
  
  // Get the configured provider
  const provider = ethers.provider;
  const network = await provider.getNetwork();
  console.log("Network:", network.name, "- Chain ID:", network.chainId.toString());
  
  // Check the funded wallet
  const fundedWallet = '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0';
  
  // Also check current signer
  const [signer] = await ethers.getSigners();
  console.log("🔸 Current signer address:", signer.address);
  
  try {
    const fundedBalance = await provider.getBalance(fundedWallet);
    console.log("🔸 Funded wallet (0x7D1A...):", ethers.formatEther(fundedBalance), "MATIC");
    
    const signerBalance = await provider.getBalance(signer.address);
    console.log("🔸 Current signer balance:", ethers.formatEther(signerBalance), "MATIC");
    
    if (signerBalance >= ethers.parseEther("0.002")) {
      console.log("✅ READY FOR DEPLOYMENT - sufficient MATIC balance");
    } else {
      console.log("❌ Need more MATIC for deployment");
    }
    
  } catch (error) {
    console.error("❌ Error checking balances:", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});