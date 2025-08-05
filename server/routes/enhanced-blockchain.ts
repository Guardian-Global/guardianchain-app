// Enhanced Blockchain API Routes
// Utilizes all newly configured API keys for comprehensive Web3 functionality

import { Router, Request, Response } from "express";
import { ethers } from "ethers";

const router = Router();

// Enhanced multi-chain provider configuration
const getProvider = (network: string) => {
  const rpcUrls: Record<string, string> = {
    ethereum: process.env.ETHEREUM_RPC_URL || "https://eth-mainnet.g.alchemy.com/v2/demo",
    polygon: process.env.POLYGON_RPC_URL || "https://polygon-mainnet.g.alchemy.com/v2/demo", 
    base: process.env.BASE_RPC_URL || "https://base-mainnet.g.alchemy.com/v2/demo",
  };

  const rpcUrl = rpcUrls[network.toLowerCase()];
  if (!rpcUrl) {
    throw new Error(`Unsupported network: ${network}`);
  }

  console.log(`🔗 Connecting to ${network} via Alchemy`);
  return new ethers.JsonRpcProvider(rpcUrl);
};

// Enhanced token analytics endpoint
router.get("/token/:network/:address", async (req: Request, res: Response) => {
  try {
    const { network, address } = req.params;
    const provider = getProvider(network);

    const tokenAbi = [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function decimals() view returns (uint8)", 
      "function totalSupply() view returns (uint256)",
      "function balanceOf(address account) view returns (uint256)",
    ];

    const contract = new ethers.Contract(address, tokenAbi, provider);
    
    // Batch fetch token details for efficiency
    const [name, symbol, decimals, totalSupply, blockNumber] = await Promise.all([
      contract.name(),
      contract.symbol(), 
      contract.decimals(),
      contract.totalSupply(),
      provider.getBlockNumber(),
    ]);

    const tokenData = {
      address,
      network: network.toUpperCase(),
      name,
      symbol,
      decimals: Number(decimals),
      totalSupply: ethers.formatUnits(totalSupply, decimals),
      blockNumber,
      timestamp: new Date().toISOString(),
    };

    console.log(`✅ Enhanced token data fetched for ${symbol} on ${network}`);
    res.json(tokenData);
  } catch (error: any) {
    console.error(`❌ Token fetch failed:`, error.message);
    res.status(500).json({ 
      error: "Failed to fetch token data",
      details: error.message,
    });
  }
});

// Multi-chain transaction tracking
router.get("/transaction/:network/:hash", async (req: Request, res: Response) => {
  try {
    const { network, hash } = req.params;
    const provider = getProvider(network);

    const [transaction, receipt] = await Promise.all([
      provider.getTransaction(hash),
      provider.getTransactionReceipt(hash),
    ]);

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    let block = null;
    if (receipt) {
      block = await provider.getBlock(receipt.blockNumber);
    }

    const enhancedData = {
      hash,
      network: network.toUpperCase(),
      transaction: {
        from: transaction.from,
        to: transaction.to,
        value: ethers.formatEther(transaction.value || 0),
        gasLimit: transaction.gasLimit?.toString(),
        gasPrice: transaction.gasPrice ? ethers.formatUnits(transaction.gasPrice, "gwei") : null,
      },
      receipt: receipt ? {
        status: receipt.status,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        timestamp: block?.timestamp,
      } : null,
    };

    console.log(`✅ Enhanced transaction data fetched for ${hash} on ${network}`);
    res.json(enhancedData);
  } catch (error: any) {
    console.error(`❌ Transaction fetch failed:`, error.message);
    res.status(500).json({
      error: "Failed to fetch transaction",
      details: error.message,
    });
  }
});

// Cross-chain balance checking
router.get("/balance/:network/:address", async (req: Request, res: Response) => {
  try {
    const { network, address } = req.params;
    const provider = getProvider(network);

    const balance = await provider.getBalance(address);
    const blockNumber = await provider.getBlockNumber();

    const balanceData = {
      address,
      network: network.toUpperCase(),
      balance: ethers.formatEther(balance),
      blockNumber,
      timestamp: new Date().toISOString(),
    };

    console.log(`✅ Balance fetched for ${address} on ${network}: ${balanceData.balance}`);
    res.json(balanceData);
  } catch (error: any) {
    console.error(`❌ Balance fetch failed:`, error.message);
    res.status(500).json({
      error: "Failed to fetch balance",
      details: error.message,
    });
  }
});

// Network health monitoring
router.get("/health", async (req: Request, res: Response) => {
  const networks = ["ethereum", "polygon", "base"];
  
  const healthChecks = await Promise.allSettled(
    networks.map(async (network) => {
      const start = Date.now();
      try {
        const provider = getProvider(network);
        const blockNumber = await provider.getBlockNumber();
        const latency = Date.now() - start;
        
        return {
          network: network.toUpperCase(),
          status: "healthy",
          blockNumber,
          latency: `${latency}ms`,
          rpcUrl: network === "ethereum" ? process.env.ETHEREUM_RPC_URL : 
                  network === "polygon" ? process.env.POLYGON_RPC_URL :
                  process.env.BASE_RPC_URL,
        };
      } catch (error: any) {
        return {
          network: network.toUpperCase(),
          status: "error",
          latency: `${Date.now() - start}ms`,
          error: error.message,
        };
      }
    })
  );

  const results = healthChecks.map((result) =>
    result.status === "fulfilled" ? result.value : result.reason
  );

  console.log("🔍 Network health check completed");
  res.json({
    timestamp: new Date().toISOString(),
    networks: results,
    alchemyEnabled: !!(process.env.ALCHEMY_API_KEY),
  });
});

// Gas estimation across networks
router.post("/estimate-gas/:network", async (req: Request, res: Response) => {
  try {
    const { network } = req.params;
    const { to, data, value = "0" } = req.body;
    
    const provider = getProvider(network);
    
    const [gasLimit, feeData] = await Promise.all([
      provider.estimateGas({ 
        to, 
        data, 
        value: ethers.parseEther(value || "0") 
      }),
      provider.getFeeData(),
    ]);

    const gasPrice = feeData.gasPrice || ethers.parseUnits("20", "gwei");
    const estimatedCost = ethers.formatEther(gasLimit * gasPrice);

    const gasEstimate = {
      network: network.toUpperCase(),
      gasLimit: gasLimit.toString(),
      gasPrice: ethers.formatUnits(gasPrice, "gwei"),
      estimatedCost,
      timestamp: new Date().toISOString(),
    };

    console.log(`⛽ Gas estimated for ${network}: ${estimatedCost} ETH`);
    res.json(gasEstimate);
  } catch (error: any) {
    console.error(`❌ Gas estimation failed:`, error.message);
    res.status(500).json({
      error: "Failed to estimate gas",
      details: error.message,
    });
  }
});

export default router;