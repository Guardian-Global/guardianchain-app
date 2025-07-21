const { ethers } = require("ethers");

async function main() {
  console.log("🔍 CHECKING PROVIDED CONTRACT INFORMATION");
  console.log("========================================");
  
  const contractAddress = "0x8c7C0A644Cc4C72EBD55b24b43c1290e90fF0a73";
  const txHashWithoutPrefix = "de6354f59a5448fc6df8abc332707767bd3f1f35b74f1accc053d5276e749bde";
  const txHashWithPrefix = "0x" + txHashWithoutPrefix;
  
  const providers = {
    ethereum: new ethers.JsonRpcProvider("https://eth.llamarpc.com"),
    polygon: new ethers.JsonRpcProvider("https://polygon-rpc.com"),
    bsc: new ethers.JsonRpcProvider("https://bsc-dataseed.binance.org")
  };
  
  console.log("Contract Address:", contractAddress);
  console.log("Transaction Hash (with 0x):", txHashWithPrefix);
  console.log("Transaction Hash (raw):", txHashWithoutPrefix);
  
  // Check on multiple networks
  for (const [network, provider] of Object.entries(providers)) {
    try {
      console.log(`\n🔍 Checking ${network.toUpperCase()}...`);
      
      // Check if contract exists
      const code = await provider.getCode(contractAddress);
      if (code !== "0x") {
        console.log(`✅ Contract found on ${network}!`);
        console.log("Code size:", code.length, "bytes");
        
        // Try to read token details
        const tokenABI = [
          "function name() view returns (string)",
          "function symbol() view returns (string)",
          "function totalSupply() view returns (uint256)",
          "function decimals() view returns (uint8)"
        ];
        
        try {
          const contract = new ethers.Contract(contractAddress, tokenABI, provider);
          const name = await contract.name();
          const symbol = await contract.symbol();
          const totalSupply = await contract.totalSupply();
          const decimals = await contract.decimals();
          
          console.log("📊 TOKEN DETAILS:");
          console.log("Name:", name);
          console.log("Symbol:", symbol);
          console.log("Total Supply:", ethers.formatUnits(totalSupply, decimals));
          console.log("Decimals:", decimals);
          
          // Get network info
          const networkInfo = await provider.getNetwork();
          console.log("Chain ID:", networkInfo.chainId.toString());
          
          let explorerUrl = "";
          if (networkInfo.chainId === 1n) explorerUrl = "https://etherscan.io";
          else if (networkInfo.chainId === 137n) explorerUrl = "https://polygonscan.com";
          else if (networkInfo.chainId === 56n) explorerUrl = "https://bscscan.com";
          
          if (explorerUrl) {
            console.log("Explorer:", `${explorerUrl}/address/${contractAddress}`);
          }
          
          return {
            network,
            contractAddress,
            chainId: networkInfo.chainId.toString(),
            name,
            symbol,
            totalSupply: ethers.formatUnits(totalSupply, decimals),
            decimals: decimals.toString(),
            explorerUrl
          };
          
        } catch (tokenError) {
          console.log("Could not read token details:", tokenError.message);
        }
      } else {
        console.log(`❌ No contract found on ${network}`);
      }
      
      // Check transaction hash
      try {
        const tx = await provider.getTransaction(txHashWithPrefix);
        if (tx) {
          console.log(`✅ Transaction found on ${network}!`);
          console.log("From:", tx.from);
          console.log("To:", tx.to || "Contract Creation");
          console.log("Block:", tx.blockNumber);
        }
      } catch (txError) {
        // Transaction not found on this network
      }
      
    } catch (error) {
      console.log(`❌ ${network} check failed:`, error.message);
    }
  }
}

main()
  .then((result) => {
    if (result) {
      console.log("\n🎉 GUARDIANCHAIN CONTRACT VERIFIED!");
      console.log("Network:", result.network);
      console.log("Contract:", result.contractAddress);
    } else {
      console.log("\n❌ Contract not found on any checked network");
    }
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });