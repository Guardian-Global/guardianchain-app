// Enhanced Alchemy Web3 Service
// Leverages all newly configured API keys for optimal blockchain integration

import { ethers } from "ethers";

interface NetworkConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
}

interface TokenData {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  price?: number;
  holders?: number;
}

class AlchemyService {
  private providers: Map<number, ethers.JsonRpcProvider> = new Map();
  private readonly networks: NetworkConfig[] = [
    {
      name: "Ethereum",
      chainId: 1,
      rpcUrl: process.env.ETHEREUM_RPC_URL || "",
      explorerUrl: "https://etherscan.io",
    },
    {
      name: "Polygon", 
      chainId: 137,
      rpcUrl: process.env.POLYGON_RPC_URL || "",
      explorerUrl: "https://polygonscan.com",
    },
    {
      name: "Base",
      chainId: 8453,
      rpcUrl: process.env.BASE_RPC_URL || "",
      explorerUrl: "https://basescan.org",
    },
  ];

  /**
   * Get optimized provider for specific chain
   */
  public getProvider(chainId: number): ethers.JsonRpcProvider {
    if (this.providers.has(chainId)) {
      return this.providers.get(chainId)!;
    }

    const network = this.networks.find(n => n.chainId === chainId);
    if (!network || !network.rpcUrl) {
      throw new Error(`No RPC URL configured for chain ${chainId}`);
    }

    console.log(`🔗 Initializing Alchemy provider for ${network.name} (${chainId})`);
    const provider = new ethers.JsonRpcProvider(network.rpcUrl);
    this.providers.set(chainId, provider);
    
    return provider;
  }

  /**
   * Enhanced token data fetching with Alchemy optimizations
   */
  public async getTokenData(
    contractAddress: string,
    chainId: number = 137
  ): Promise<TokenData> {
    const provider = this.getProvider(chainId);
    
    const tokenAbi = [
      "function name() view returns (string)",
      "function symbol() view returns (string)", 
      "function decimals() view returns (uint8)",
      "function totalSupply() view returns (uint256)",
    ];

    try {
      const contract = new ethers.Contract(contractAddress, tokenAbi, provider);
      
      // Batch multiple calls for efficiency
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
        contract.totalSupply(),
      ]);

      console.log(`✅ Fetched ${symbol} token data via Alchemy`);

      return {
        name,
        symbol,
        decimals: Number(decimals),
        totalSupply: ethers.formatUnits(totalSupply, decimals),
      };
    } catch (error) {
      console.error(`❌ Failed to fetch token data for ${contractAddress}:`, error);
      throw error;
    }
  }

  /**
   * Get transaction receipt with enhanced details
   */
  public async getTransactionReceipt(txHash: string, chainId: number = 137) {
    const provider = this.getProvider(chainId);
    
    try {
      const receipt = await provider.getTransactionReceipt(txHash);
      if (!receipt) {
        throw new Error("Transaction not found");
      }

      const block = await provider.getBlock(receipt.blockNumber);
      
      return {
        ...receipt,
        timestamp: block?.timestamp,
        networkName: this.networks.find(n => n.chainId === chainId)?.name,
      };
    } catch (error) {
      console.error(`❌ Failed to get transaction receipt:`, error);
      throw error;
    }
  }

  /**
   * Enhanced balance checking across networks
   */
  public async getBalance(address: string, chainId: number = 137): Promise<string> {
    const provider = this.getProvider(chainId);
    
    try {
      const balance = await provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error(`❌ Failed to get balance for ${address}:`, error);
      throw error;
    }
  }

  /**
   * Multi-chain gas estimation
   */
  public async estimateGas(
    to: string,
    data: string,
    chainId: number = 137
  ): Promise<{ gasLimit: string; gasPrice: string; estimatedCost: string }> {
    const provider = this.getProvider(chainId);
    
    try {
      const [gasLimit, feeData] = await Promise.all([
        provider.estimateGas({ to, data }),
        provider.getFeeData(),
      ]);

      const gasPrice = feeData.gasPrice || ethers.parseUnits("20", "gwei");
      const estimatedCost = ethers.formatEther(gasLimit * gasPrice);

      return {
        gasLimit: gasLimit.toString(),
        gasPrice: ethers.formatUnits(gasPrice, "gwei"),
        estimatedCost,
      };
    } catch (error) {
      console.error(`❌ Gas estimation failed:`, error);
      throw error;
    }
  }

  /**
   * Enhanced block monitoring with real-time updates
   */
  public async getLatestBlock(chainId: number = 137) {
    const provider = this.getProvider(chainId);
    
    try {
      const blockNumber = await provider.getBlockNumber();
      const block = await provider.getBlock(blockNumber);
      
      return {
        number: blockNumber,
        timestamp: block?.timestamp,
        hash: block?.hash,
        networkName: this.networks.find(n => n.chainId === chainId)?.name,
      };
    } catch (error) {
      console.error(`❌ Failed to get latest block:`, error);
      throw error;
    }
  }

  /**
   * Network health monitoring
   */
  public async checkNetworkHealth(): Promise<{
    network: string;
    chainId: number;
    status: "healthy" | "degraded" | "offline";
    latency: number;
  }[]> {
    const results = await Promise.allSettled(
      this.networks.map(async (network) => {
        const start = Date.now();
        try {
          const provider = this.getProvider(network.chainId);
          await provider.getBlockNumber();
          const latency = Date.now() - start;
          
          return {
            network: network.name,
            chainId: network.chainId,
            status: latency < 1000 ? "healthy" : "degraded" as const,
            latency,
          };
        } catch (error) {
          return {
            network: network.name,
            chainId: network.chainId,
            status: "offline" as const,
            latency: Date.now() - start,
          };
        }
      })
    );

    return results.map((result) => 
      result.status === "fulfilled" ? result.value : {
        network: "Unknown",
        chainId: 0,
        status: "offline" as const,
        latency: 999999,
      }
    );
  }
}

// Export singleton instance
export const alchemyService = new AlchemyService();
export default alchemyService;