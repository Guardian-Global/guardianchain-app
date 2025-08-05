// Base Network Configuration for GuardianChain
// Base is an Ethereum L2 optimized for low fees and fast transactions

import { defineChain } from 'viem';

export const baseMainnet = defineChain({
  id: 8453,
  name: 'Base',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://mainnet.base.org'],
      webSocket: ['wss://mainnet.base.org'],
    },
    public: {
      http: ['https://mainnet.base.org'],
      webSocket: ['wss://mainnet.base.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BaseScan',
      url: 'https://basescan.org',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 5022,
    },
  },
});

export const baseTestnet = defineChain({
  id: 84532,
  name: 'Base Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia.base.org'],
      webSocket: ['wss://sepolia.base.org'],
    },
    public: {
      http: ['https://sepolia.base.org'],
      webSocket: ['wss://sepolia.base.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BaseScan',
      url: 'https://sepolia.basescan.org',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 1059647,
    },
  },
  testnet: true,
});

// Contract addresses on Base Network
export const BASE_CONTRACTS = {
  // GTT Token Contract (to be deployed)
  GTT_TOKEN: '0x0000000000000000000000000000000000000000',
  
  // Capsule NFT Contract (to be deployed)
  CAPSULE_NFT: '0x0000000000000000000000000000000000000000',
  
  // Truth Vault Contract (to be deployed)
  TRUTH_VAULT: '0x0000000000000000000000000000000000000000',
  
  // DAO Governance Contract (to be deployed)
  DAO_GOVERNANCE: '0x0000000000000000000000000000000000000000',
  
  // Staking Contract (to be deployed)
  STAKING_VAULT: '0x0000000000000000000000000000000000000000',
};

// Base Network Configuration
export const BASE_CONFIG = {
  chainId: 8453,
  chainName: 'Base',
  symbol: 'ETH',
  decimals: 18,
  rpcUrl: 'https://mainnet.base.org',
  blockExplorer: 'https://basescan.org',
  
  // Gas Configuration (Base has very low fees)
  gasConfig: {
    standard: {
      maxFeePerGas: '0.001', // Much lower than Ethereum
      maxPriorityFeePerGas: '0.0001',
    },
    fast: {
      maxFeePerGas: '0.002',
      maxPriorityFeePerGas: '0.0002',
    },
  },
  
  // Features enabled on Base
  features: {
    lowFees: true,
    fastTransactions: true,
    ethereumCompatible: true,
    l2Security: true,
  },
};

// Base Testnet Configuration
export const BASE_TESTNET_CONFIG = {
  chainId: 84532,
  chainName: 'Base Sepolia',  
  symbol: 'ETH',
  decimals: 18,
  rpcUrl: 'https://sepolia.base.org',
  blockExplorer: 'https://sepolia.basescan.org',
  testnet: true,
};

export default BASE_CONFIG;