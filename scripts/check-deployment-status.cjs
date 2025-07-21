const { ethers } = require("ethers");

async function main() {
  console.log("🔍 CHECKING DEPLOYMENT STATUS");
  console.log("============================");
  
  const txHash = "0xcb40769bd0f832553f9bf986226d90313034da08ef7630efe5ab5d5fab47beb8";
  const provider = new ethers.JsonRpcProvider("https://eth.llamarpc.com");
  
  try {
    console.log("Transaction Hash:", txHash);
    console.log("Checking transaction...");
    
    // Get transaction details
    const tx = await provider.getTransaction(txHash);
    if (!tx) {
      console.log("❌ Transaction not found");
      return;
    }
    
    console.log("✅ Transaction found!");
    console.log("From:", tx.from);
    console.log("To:", tx.to || "Contract Creation");
    console.log("Value:", ethers.formatEther(tx.value), "ETH");
    console.log("Gas Limit:", tx.gasLimit.toString());
    console.log("Gas Price:", ethers.formatUnits(tx.gasPrice, "gwei"), "gwei");
    
    // Get transaction receipt
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt) {
      console.log("⏳ Transaction is still pending...");
      return;
    }
    
    console.log("\n📄 TRANSACTION RECEIPT:");
    console.log("Status:", receipt.status === 1 ? "✅ SUCCESS" : "❌ FAILED");
    console.log("Gas Used:", receipt.gasUsed.toString());
    console.log("Block Number:", receipt.blockNumber);
    console.log("Contract Address:", receipt.contractAddress || "N/A");
    
    if (receipt.status === 1 && receipt.contractAddress) {
      console.log("\n🎉 DEPLOYMENT SUCCESSFUL!");
      console.log("GTT Token Address:", receipt.contractAddress);
      console.log("Etherscan:", `https://etherscan.io/address/${receipt.contractAddress}`);
      console.log("Transaction:", `https://etherscan.io/tx/${txHash}`);
      
      // Try to verify the contract is a valid token
      try {
        const contract = new ethers.Contract(
          receipt.contractAddress,
          ["function name() view returns (string)", "function symbol() view returns (string)"],
          provider
        );
        
        const name = await contract.name();
        const symbol = await contract.symbol();
        console.log("Token Name:", name);
        console.log("Token Symbol:", symbol);
      } catch (error) {
        console.log("Could not read token details");
      }
    } else {
      console.log("\n❌ DEPLOYMENT FAILED");
      if (receipt.logs && receipt.logs.length > 0) {
        console.log("Logs found - checking for error details...");
      }
    }
    
  } catch (error) {
    console.error("❌ Error checking transaction:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });