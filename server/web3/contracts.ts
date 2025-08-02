import { ethers } from 'ethers';

// GTT Yield Vault Contract ABI
export const GTT_YIELD_VAULT_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_GTTToken",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "author",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "griefTier",
        "type": "uint256"
      }
    ],
    "name": "YieldDistributed",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "GTTToken",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "author",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "griefTier",
        "type": "uint256"
      }
    ],
    "name": "distributeYield",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newAdmin",
        "type": "address"
      }
    ],
    "name": "updateAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Contract Configuration
export const CONTRACT_CONFIG = {
  // Production addresses (to be set after deployment)
  GTT_YIELD_VAULT_ADDRESS: process.env.GTT_YIELD_VAULT_ADDRESS || '0x0000000000000000000000000000000000000000',
  GTT_TOKEN_ADDRESS: process.env.GTT_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000',
  
  // Network configuration
  POLYGON_RPC_URL: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
  POLYGON_CHAIN_ID: 137,
  
  // Gas configuration
  GAS_LIMIT: 100000,
  GAS_PRICE: ethers.parseUnits('30', 'gwei'),
};

// Initialize contract instance
export function getYieldVaultContract(provider: ethers.Provider, signer?: ethers.Signer) {
  const contractAddress = CONTRACT_CONFIG.GTT_YIELD_VAULT_ADDRESS;
  
  if (contractAddress === '0x0000000000000000000000000000000000000000') {
    throw new Error('GTT Yield Vault contract address not configured');
  }
  
  if (signer) {
    return new ethers.Contract(contractAddress, GTT_YIELD_VAULT_ABI, signer);
  }
  
  return new ethers.Contract(contractAddress, GTT_YIELD_VAULT_ABI, provider);
}

// Contract interaction utilities
export class GTTYieldVaultService {
  private contract: ethers.Contract;
  private signer: ethers.Signer;
  
  constructor(provider: ethers.Provider, privateKey: string) {
    this.signer = new ethers.Wallet(privateKey, provider);
    this.contract = getYieldVaultContract(provider, this.signer);
  }
  
  async distributeYield(authorAddress: string, griefTier: number): Promise<{
    transactionHash: string;
    blockNumber: number;
    gasUsed: string;
    yieldAmount: string;
  }> {
    try {
      // Validate inputs
      if (!ethers.isAddress(authorAddress)) {
        throw new Error('Invalid author address');
      }
      
      if (griefTier < 1 || griefTier > 5) {
        throw new Error('Grief tier must be between 1 and 5');
      }
      
      // Execute transaction
      const tx = await this.contract.distributeYield(authorAddress, griefTier, {
        gasLimit: CONTRACT_CONFIG.GAS_LIMIT,
        gasPrice: CONTRACT_CONFIG.GAS_PRICE,
      });
      
      // Wait for confirmation
      const receipt = await tx.wait();
      
      // Calculate yield amount (griefTier * 10 GTT)
      const yieldAmount = ethers.formatEther(BigInt(griefTier * 10) * BigInt(10 ** 18));
      
      return {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        yieldAmount,
      };
    } catch (error) {
      console.error('GTT Yield distribution failed:', error);
      throw error;
    }
  }
  
  async getContractInfo(): Promise<{
    admin: string;
    gttTokenAddress: string;
    contractAddress: string;
    network: string;
  }> {
    try {
      const admin = await this.contract.admin();
      const gttTokenAddress = await this.contract.GTTToken();
      
      return {
        admin,
        gttTokenAddress,
        contractAddress: await this.contract.getAddress(),
        network: 'Polygon',
      };
    } catch (error) {
      console.error('Failed to get contract info:', error);
      throw error;
    }
  }
  
  async updateAdmin(newAdminAddress: string): Promise<string> {
    try {
      if (!ethers.isAddress(newAdminAddress)) {
        throw new Error('Invalid admin address');
      }
      
      const tx = await this.contract.updateAdmin(newAdminAddress, {
        gasLimit: CONTRACT_CONFIG.GAS_LIMIT,
        gasPrice: CONTRACT_CONFIG.GAS_PRICE,
      });
      
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error('Failed to update admin:', error);
      throw error;
    }
  }
}

export default GTTYieldVaultService;