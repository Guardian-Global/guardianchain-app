const { ethers } = require("ethers");

async function main() {
  console.log("🔍 VERIFYING GUARDIANCHAIN DEPLOYMENT");
  console.log("====================================");
  
  const contractAddress = "0x8c7C0A644Cc4C72EBD55b24b43c1290e90fF0a73";
  const txHash = "0xde6354f59a5448fc6df8abc332707767bd3f1f35b74f1accc053d5276e749bde";
  
  const provider = new ethers.JsonRpcProvider("https://eth.llamarpc.com");
  
  try {
    console.log("Contract Address:", contractAddress);
    console.log("Transaction Hash:", txHash);
    
    // Verify contract exists
    const code = await provider.getCode(contractAddress);
    if (code === "0x") {
      console.log("❌ No contract found at address");
      return;
    }
    
    console.log("✅ Contract code found!");
    console.log("Code size:", code.length, "bytes");
    
    // Try to read token details
    const tokenABI = [
      "function name() view returns (string)",
      "function symbol() view returns (string)", 
      "function totalSupply() view returns (uint256)",
      "function decimals() view returns (uint8)",
      "function owner() view returns (address)"
    ];
    
    const contract = new ethers.Contract(contractAddress, tokenABI, provider);
    
    try {
      const name = await contract.name();
      const symbol = await contract.symbol();
      const totalSupply = await contract.totalSupply();
      const decimals = await contract.decimals();
      const owner = await contract.owner();
      
      console.log("\n📊 TOKEN DETAILS:");
      console.log("Name:", name);
      console.log("Symbol:", symbol);
      console.log("Total Supply:", ethers.formatUnits(totalSupply, decimals));
      console.log("Decimals:", decimals);
      console.log("Owner:", owner);
      
      console.log("\n🎉 GUARDIANCHAIN GTT TOKEN VERIFIED!");
      console.log("====================================");
      console.log("Contract Address:", contractAddress);
      console.log("Etherscan:", `https://etherscan.io/address/${contractAddress}`);
      console.log("Transaction:", `https://etherscan.io/tx/${txHash}`);
      
      return {
        contractAddress,
        txHash,
        name,
        symbol,
        totalSupply: ethers.formatUnits(totalSupply, decimals),
        decimals,
        owner,
        verified: true
      };
      
    } catch (error) {
      console.log("Could not read token details:", error.message);
      return { contractAddress, verified: false };
    }
    
  } catch (error) {
    console.error("❌ Verification failed:", error.message);
    return { verified: false };
  }
}

main()
  .then((result) => {
    if (result.verified) {
      console.log("\n🚀 GUARDIANCHAIN IS LIVE ON ETHEREUM MAINNET!");
    }
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });