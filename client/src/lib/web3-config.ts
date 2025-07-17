import { createConfig, http } from 'wagmi';
import { mainnet, sepolia, polygon, polygonAmoy } from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';

// Contract addresses (will be deployed addresses)
export const CONTRACTS = {
  GTT_TOKEN: {
    [mainnet.id]: '0x0000000000000000000000000000000000000000', // Deploy GTT here
    [sepolia.id]: '0x0000000000000000000000000000000000000000', // Testnet GTT
    [polygon.id]: '0x0000000000000000000000000000000000000000', // Polygon GTT
    [polygonAmoy.id]: '0x0000000000000000000000000000000000000000', // Polygon testnet GTT
  },
  TRUTH_VAULT: {
    [mainnet.id]: '0x0000000000000000000000000000000000000000', // Deploy TruthVault here
    [sepolia.id]: '0x0000000000000000000000000000000000000000', // Testnet TruthVault
    [polygon.id]: '0x0000000000000000000000000000000000000000', // Polygon TruthVault
    [polygonAmoy.id]: '0x0000000000000000000000000000000000000000', // Polygon testnet TruthVault
  }
} as const;

// ABI definitions for smart contracts
export const GTT_TOKEN_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "initialOwner", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "remainingSupply",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const TRUTH_VAULT_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "_gttToken", "type": "address"},
      {"internalType": "address", "name": "_admin", "type": "address"}
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "capsuleId", "type": "uint256"}],
    "name": "claimYield",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "yieldAmount", "type": "uint256"}],
    "name": "calculateGTTReward",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "capsuleId", "type": "uint256"}],
    "name": "getCapsuleClaimInfo",
    "outputs": [
      {"internalType": "address", "name": "creator", "type": "address"},
      {"internalType": "uint256", "name": "totalEarned", "type": "uint256"},
      {"internalType": "uint256", "name": "totalClaimed", "type": "uint256"},
      {"internalType": "uint256", "name": "claimable", "type": "uint256"},
      {"internalType": "uint256", "name": "nextClaimTime", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "capsules",
    "outputs": [
      {"internalType": "address", "name": "creator", "type": "address"},
      {"internalType": "bool", "name": "isVerified", "type": "bool"},
      {"internalType": "bool", "name": "isSealed", "type": "bool"},
      {"internalType": "uint256", "name": "truthYield", "type": "uint256"},
      {"internalType": "uint256", "name": "totalClaimed", "type": "uint256"},
      {"internalType": "uint256", "name": "lastClaimTime", "type": "uint256"},
      {"internalType": "string", "name": "ipfsHash", "type": "string"},
      {"internalType": "string", "name": "veritasSealUrl", "type": "string"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": true, "internalType": "uint256", "name": "capsuleId", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "yieldAmount", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "gttAmount", "type": "uint256"},
      {"indexed": false, "internalType": "string", "name": "reason", "type": "string"}
    ],
    "name": "YieldClaimed",
    "type": "event"
  }
] as const;

// Wagmi configuration
export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia, polygon, polygonAmoy],
  connectors: [
    injected({
      shimDisconnect: true,
    }),
    coinbaseWallet({
      appName: 'GuardianChain',
      appLogoUrl: 'https://guardianchain.app/logo.png',
    }),
    walletConnect({
      projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
      metadata: {
        name: 'GuardianChain',
        description: 'Decentralized Truth Verification Platform',
        url: 'https://guardianchain.app',
        icons: ['https://guardianchain.app/logo.png'],
      },
    }),
  ],
  transports: {
    [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY || 'demo'}`),
    [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY || 'demo'}`),
    [polygon.id]: http(`https://polygon-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY || 'demo'}`),
    [polygonAmoy.id]: http(`https://polygon-amoy.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY || 'demo'}`),
  },
});

// Helper function to get contract address for current chain
export function getContractAddress(contractName: keyof typeof CONTRACTS, chainId: number): string {
  const address = CONTRACTS[contractName][chainId as keyof typeof CONTRACTS[typeof contractName]];
  if (!address || address === '0x0000000000000000000000000000000000000000') {
    throw new Error(`${contractName} not deployed on chain ${chainId}`);
  }
  return address;
}

// Network display names
export const NETWORK_NAMES = {
  [mainnet.id]: 'Ethereum',
  [sepolia.id]: 'Sepolia Testnet',
  [polygon.id]: 'Polygon',
  [polygonAmoy.id]: 'Polygon Amoy Testnet',
} as const;

// Support check for networks
export function isSupportedNetwork(chainId: number): boolean {
  return Object.keys(NETWORK_NAMES).includes(chainId.toString());
}