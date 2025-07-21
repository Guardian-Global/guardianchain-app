import { ethers } from 'ethers';

// Real GTT Token Contract Address from user's screenshot
export const GTT_CONTRACT_ADDRESS = '0x742d35Cc66535C0532925a3b8d0E9B01d9c5d9A6C';

// Standard ERC20 ABI - only functions we need
const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)', 
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 value)'
];

// Polygon/Ethereum RPC endpoints
const RPC_ENDPOINTS = [
  'https://polygon-rpc.com',
  'https://rpc-mainnet.matic.network',
  'https://polygon-mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
];

export class Web3GTTService {
  private provider: ethers.JsonRpcProvider | null = null;
  private contract: ethers.Contract | null = null;

  constructor() {
    this.initializeProvider();
  }

  private async initializeProvider() {
    // Try RPC endpoints until one works
    for (const rpcUrl of RPC_ENDPOINTS) {
      try {
        console.log(`🔗 Trying RPC: ${rpcUrl}`);
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
        
        // Test connection with a simple call
        await this.provider.getBlockNumber();
        console.log(`✅ Connected to Polygon via ${rpcUrl}`);
        
        // Initialize contract
        this.contract = new ethers.Contract(
          GTT_CONTRACT_ADDRESS,
          ERC20_ABI,
          this.provider
        );
        
        break;
      } catch (error) {
        console.warn(`⚠️ RPC ${rpcUrl} failed:`, error);
        continue;
      }
    }

    if (!this.provider || !this.contract) {
      throw new Error('❌ Failed to connect to any Polygon RPC endpoint');
    }
  }

  async getTokenData(): Promise<{
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: string;
    contractAddress: string;
  } | null> {
    try {
      if (!this.contract) {
        await this.initializeProvider();
      }

      const [name, symbol, decimals, totalSupply] = await Promise.all([
        this.contract!.name(),
        this.contract!.symbol(), 
        this.contract!.decimals(),
        this.contract!.totalSupply()
      ]);

      return {
        name,
        symbol,
        decimals: Number(decimals),
        totalSupply: ethers.formatUnits(totalSupply, decimals),
        contractAddress: GTT_CONTRACT_ADDRESS
      };
    } catch (error) {
      console.error('❌ Failed to fetch GTT token data:', error);
      return null;
    }
  }

  async getTokenBalance(walletAddress: string): Promise<string | null> {
    try {
      if (!this.contract) {
        await this.initializeProvider();
      }

      const balance = await this.contract!.balanceOf(walletAddress);
      const decimals = await this.contract!.decimals();
      
      return ethers.formatUnits(balance, decimals);
    } catch (error) {
      console.error('❌ Failed to fetch GTT balance:', error);
      return null;
    }
  }

  async getRecentTransfers(limit: number = 100): Promise<any[]> {
    try {
      if (!this.contract) {
        await this.initializeProvider();
      }

      const currentBlock = await this.provider!.getBlockNumber();
      const fromBlock = currentBlock - 10000; // Last ~10k blocks (~5 hours on Polygon)

      const transferFilter = this.contract!.filters.Transfer();
      const events = await this.contract!.queryFilter(transferFilter, fromBlock, currentBlock);
      
      return events.slice(-limit).map(event => {
        const eventLog = event as any;
        return {
          from: eventLog.args?.from || '',
          to: eventLog.args?.to || '',  
          value: ethers.formatUnits(eventLog.args?.value || 0, 18),
          blockNumber: event.blockNumber || 0,
          transactionHash: event.transactionHash || ''
        };
      });
    } catch (error) {
      console.error('❌ Failed to fetch GTT transfers:', error);
      return [];
    }
  }
}

// Export singleton instance
export const web3GTTService = new Web3GTTService();