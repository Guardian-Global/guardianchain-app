import { Router } from "express";
import { z } from "zod";

const router = Router();

// Balance checking endpoint
router.get("/balance/:address", async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return res.status(400).json({ error: "Invalid Ethereum address" });
    }

    // Mock balance data for testing
    // In production, this would connect to actual RPC endpoints
    const mockBalanceData = {
      ethBalance: 0.05 + Math.random() * 0.1, // Random balance between 0.05-0.15 ETH
      gttBalance: Math.floor(Math.random() * 10000), // Random GTT balance
      lastUpdated: Date.now(),
    };

    res.json(mockBalanceData);
  } catch (error) {
    console.error("Balance check error:", error);
    res.status(500).json({ error: "Failed to fetch balance" });
  }
});

// Contract interaction test endpoint
router.post("/contract/call", async (req, res) => {
  try {
    const { contractAddress, method, args, chainId } = req.body;
    
    // Validate inputs
    if (!contractAddress || !method) {
      return res.status(400).json({ error: "Contract address and method required" });
    }

    // Mock contract call response
    const mockResponse = {
      success: true,
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
      gasUsed: Math.floor(Math.random() * 200000) + 21000,
      timestamp: Date.now(),
      method,
      args: args || [],
    };

    res.json(mockResponse);
  } catch (error) {
    console.error("Contract call error:", error);
    res.status(500).json({ error: "Contract call failed" });
  }
});

// Network status endpoint
router.get("/network/:chainId", async (req, res) => {
  try {
    const { chainId } = req.params;
    const chainIdNum = parseInt(chainId);
    
    const networkInfo = {
      chainId: chainIdNum,
      name: getNetworkName(chainIdNum),
      rpcUrl: getRpcUrl(chainIdNum),
      blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
      gasPrice: Math.floor(Math.random() * 50) + 20, // 20-70 gwei
      status: "connected",
      lastBlock: Date.now() - Math.floor(Math.random() * 15000), // Within last 15 seconds
    };

    res.json(networkInfo);
  } catch (error) {
    console.error("Network status error:", error);
    res.status(500).json({ error: "Failed to get network status" });
  }
});

// Transaction simulation endpoint
router.post("/simulate", async (req, res) => {
  try {
    const { to, data, value, from } = req.body;
    
    // Mock transaction simulation
    const simulation = {
      success: true,
      estimatedGas: Math.floor(Math.random() * 100000) + 21000,
      gasPrice: Math.floor(Math.random() * 50) + 20,
      estimatedCost: "0.00" + (Math.floor(Math.random() * 999) + 100),
      revertReason: null,
      changes: [
        {
          type: "balance",
          address: from,
          before: "1.5 ETH",
          after: "1.49 ETH",
        },
        {
          type: "nft",
          contract: to,
          tokenId: Math.floor(Math.random() * 10000),
          action: "mint",
        },
      ],
    };

    res.json(simulation);
  } catch (error) {
    console.error("Simulation error:", error);
    res.status(500).json({ error: "Transaction simulation failed" });
  }
});

// Minting test endpoint
router.post("/test-mint", async (req, res) => {
  try {
    const { capsuleData, walletAddress, testMode } = req.body;
    
    if (!capsuleData || !walletAddress) {
      return res.status(400).json({ error: "Capsule data and wallet address required" });
    }

    // Simulate minting process
    const steps = [
      "Validating capsule data",
      "Generating metadata",
      "Uploading to IPFS",
      "Preparing transaction",
      "Submitting to blockchain",
      "Confirming transaction",
      "Updating database",
    ];

    // Mock successful minting result
    const result = {
      success: true,
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      tokenId: Math.floor(Math.random() * 10000),
      ipfsHash: `Qm${Math.random().toString(36).substr(2, 44)}`,
      gasUsed: Math.floor(Math.random() * 150000) + 50000,
      blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
      networkFee: "0.00" + (Math.floor(Math.random() * 99) + 10),
      steps: steps.map((step, index) => ({
        step,
        completed: true,
        timestamp: Date.now() - (steps.length - index) * 1000,
      })),
      testMode: testMode || false,
    };

    res.json(result);
  } catch (error) {
    console.error("Test mint error:", error);
    res.status(500).json({ error: "Minting test failed" });
  }
});

// Helper functions
function getNetworkName(chainId: number): string {
  switch (chainId) {
    case 1:
      return "Ethereum Mainnet";
    case 137:
      return "Polygon";
    case 80001:
      return "Mumbai Testnet";
    case 31337:
      return "Hardhat Local";
    default:
      return "Unknown Network";
  }
}

function getRpcUrl(chainId: number): string {
  switch (chainId) {
    case 1:
      return "https://eth-mainnet.alchemyapi.io/v2/";
    case 137:
      return "https://polygon-rpc.com";
    case 80001:
      return "https://rpc-mumbai.maticvigil.com";
    case 31337:
      return "http://localhost:8545";
    default:
      return "https://unknown-network.com";
  }
}

export default router;