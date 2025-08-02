import { ethers } from "ethers";
import {
  GTT_CONTRACT_ADDRESS,
  GTT_TOKEN_ABI,
  PRIMARY_NETWORK,
  validateContractAddress,
  getConfigurationStatus,
} from "./contractConfig";

/**
 * Production-ready Web3 service for GTT token data fetching
 * Implements proper error handling, fallbacks, and data validation
 */

export interface TokenData {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  circulatingSupply: string;
  contractAddress: string;
  network: string;
  verified: boolean;
}

export interface TokenBalance {
  address: string;
  balance: string;
  balanceFormatted: string;
  decimals: number;
}

export interface TokenTransfer {
  from: string;
  to: string;
  value: string;
  valueFormatted: string;
  blockNumber: number;
  transactionHash: string;
  timestamp?: number;
}

export interface TokenMetrics {
  holderCount: number;
  totalTransfers: number;
  volume24h: string;
  price?: number;
  marketCap?: number;
}

class Web3TokenService {
  private provider: ethers.JsonRpcProvider | null = null;
  private contract: ethers.Contract | null = null;
  private isInitialized = false;
  private lastError: string | null = null;

  constructor() {
    this.initializeProvider();
  }

  /**
   * Initialize Web3 provider with fallback RPC endpoints
   */
  private async initializeProvider(): Promise<void> {
    const rpcUrls = PRIMARY_NETWORK.rpcUrls;

    for (const rpcUrl of rpcUrls) {
      try {
        // Skip placeholder URLs
        if (rpcUrl.includes("YOUR_")) {
          console.warn(`⚠️ Skipping placeholder RPC URL: ${rpcUrl}`);
          continue;
        }

        console.log(`🔗 Attempting connection to: ${rpcUrl}`);
        this.provider = new ethers.JsonRpcProvider(rpcUrl);

        // Test connection
        const blockNumber = await this.provider.getBlockNumber();
        console.log(
          `✅ Connected to ${PRIMARY_NETWORK.name} via ${rpcUrl}, block: ${blockNumber}`,
        );

        // Initialize contract
        this.contract = new ethers.Contract(
          GTT_CONTRACT_ADDRESS,
          GTT_TOKEN_ABI,
          this.provider,
        );

        // Test contract call
        await this.contract.symbol();
        console.log(`✅ GTT contract verified at ${GTT_CONTRACT_ADDRESS}`);

        this.isInitialized = true;
        this.lastError = null;
        return;
      } catch (error) {
        console.warn(`⚠️ RPC ${rpcUrl} failed:`, error);
        continue;
      }
    }

    this.lastError = `Failed to connect to any RPC endpoint for ${PRIMARY_NETWORK.name}`;
    throw new Error(this.lastError);
  }

  /**
   * Get comprehensive token data from blockchain
   */
  async getTokenData(): Promise<TokenData | null> {
    if (!this.isInitialized || !this.contract) {
      console.error("❌ Web3 service not initialized");
      return null;
    }

    try {
      console.log("🔍 Fetching token data from blockchain...");

      const [name, symbol, decimals, totalSupply] = await Promise.all([
        this.contract.name(),
        this.contract.symbol(),
        this.contract.decimals(),
        this.contract.totalSupply(),
      ]);

      // Try to get circulating supply (may not be available on all contracts)
      let circulatingSupply = totalSupply;
      try {
        circulatingSupply = await this.contract.getCirculatingSupply();
      } catch {
        // Use total supply if circulating supply function doesn't exist
        circulatingSupply = totalSupply;
      }

      const tokenData: TokenData = {
        name,
        symbol,
        decimals: Number(decimals),
        totalSupply: ethers.formatUnits(totalSupply, decimals),
        circulatingSupply: ethers.formatUnits(circulatingSupply, decimals),
        contractAddress: GTT_CONTRACT_ADDRESS,
        network: PRIMARY_NETWORK.name,
        verified: true,
      };

      console.log("✅ Token data retrieved successfully:", tokenData);
      return tokenData;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("❌ Failed to fetch token data:", error);
      this.lastError = `Token data fetch failed: ${errorMessage}`;
      return null;
    }
  }

  /**
   * Get token balance for a specific address
   */
  async getTokenBalance(walletAddress: string): Promise<TokenBalance | null> {
    if (!this.isInitialized || !this.contract) {
      console.error("❌ Web3 service not initialized");
      return null;
    }

    if (!validateContractAddress(walletAddress)) {
      console.error("❌ Invalid wallet address:", walletAddress);
      return null;
    }

    try {
      const balance = await this.contract.balanceOf(walletAddress);
      const decimals = await this.contract.decimals();

      return {
        address: walletAddress,
        balance: balance.toString(),
        balanceFormatted: ethers.formatUnits(balance, decimals),
        decimals: Number(decimals),
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("❌ Failed to fetch token balance:", error);
      this.lastError = `Balance fetch failed: ${errorMessage}`;
      return null;
    }
  }

  /**
   * Get recent token transfers
   */
  async getRecentTransfers(limit: number = 100): Promise<TokenTransfer[]> {
    if (!this.isInitialized || !this.contract) {
      console.error("❌ Web3 service not initialized");
      return [];
    }

    try {
      const currentBlock = await this.provider!.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - 10000); // Last ~10k blocks

      const transferFilter = this.contract.filters.Transfer();
      const events = await this.contract.queryFilter(
        transferFilter,
        fromBlock,
        currentBlock,
      );

      const decimals = await this.contract.decimals();

      const transfers = events.slice(-limit).map((event: any) => ({
        from: event.args?.from || "",
        to: event.args?.to || "",
        value: event.args?.value?.toString() || "0",
        valueFormatted: ethers.formatUnits(event.args?.value || 0, decimals),
        blockNumber: event.blockNumber || 0,
        transactionHash: event.transactionHash || "",
      }));

      console.log(`✅ Retrieved ${transfers.length} recent transfers`);
      return transfers;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("❌ Failed to fetch transfers:", error);
      this.lastError = `Transfer fetch failed: ${errorMessage}`;
      return [];
    }
  }

  /**
   * Get token holder count (if supported by contract)
   */
  async getHolderCount(): Promise<number | null> {
    if (!this.isInitialized || !this.contract) {
      return null;
    }

    try {
      const holderCount = await this.contract.getHolderCount();
      return Number(holderCount);
    } catch (error) {
      // Many contracts don't implement this function
      console.warn("⚠️ Holder count not available from contract");
      return null;
    }
  }

  /**
   * Validate that the service is properly configured and working
   */
  async validateService(): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    // Check configuration
    const configStatus = getConfigurationStatus();
    if (!configStatus.isValid) {
      errors.push(...configStatus.errors);
    }

    // Check initialization
    if (!this.isInitialized) {
      errors.push("Web3 service not initialized");
    }

    // Test contract connection
    if (this.contract) {
      try {
        await this.contract.symbol();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        errors.push(`Contract connection failed: ${errorMessage}`);
      }
    }

    // Add last error if any
    if (this.lastError) {
      errors.push(this.lastError);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get service status for monitoring
   */
  getServiceStatus() {
    return {
      isInitialized: this.isInitialized,
      hasProvider: !!this.provider,
      hasContract: !!this.contract,
      lastError: this.lastError,
      contractAddress: GTT_CONTRACT_ADDRESS,
      network: PRIMARY_NETWORK.name,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Force reconnection (useful for error recovery)
   */
  async reconnect(): Promise<void> {
    this.isInitialized = false;
    this.provider = null;
    this.contract = null;
    this.lastError = null;

    await this.initializeProvider();
  }
}

// Export singleton instance
export const web3TokenService = new Web3TokenService();

// Export service for testing
export { Web3TokenService };
