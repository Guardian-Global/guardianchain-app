// lib/contracts.ts - Contract addresses and utilities

export interface ContractAddresses {
  chainId: number;
  gtt: string;
  vault: string;
  factory: string;
}

export const CONTRACTS: Record<string, ContractAddresses> = {
  // Local Hardhat Network
  hardhat: {
    chainId: 31337,
    gtt: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    vault: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", 
    factory: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
  },
  
  // Sepolia Testnet
  sepolia: {
    chainId: 11155111,
    gtt: "0x...",          // Replace after deploy
    vault: "0x...",        // Replace after deploy
    factory: "0x..."       // Replace after deploy
  },
  
  // Polygon Amoy Testnet  
  polygonAmoy: {
    chainId: 80002,
    gtt: "0x...",          // Will be updated after deployment
    vault: "0x...",        // Will be updated after deployment
    factory: "0x..."       // Will be updated after deployment
  }
};

/**
 * Get contract address for specific chain and contract name
 */
export function getContractAddress(chainId: number, contractName: keyof ContractAddresses): string {
  const networkKey = Object.keys(CONTRACTS).find(
    key => CONTRACTS[key].chainId === chainId
  );
  
  if (!networkKey) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }
  
  const address = CONTRACTS[networkKey][contractName];
  if (!address || address === "0x...") {
    throw new Error(`Contract ${contractName} not deployed on chain ${chainId}`);
  }
  
  return address;
}

/**
 * Get all contracts for a specific chain
 */
export function getContractsForChain(chainId: number): ContractAddresses | null {
  const networkKey = Object.keys(CONTRACTS).find(
    key => CONTRACTS[key].chainId === chainId
  );
  
  return networkKey ? CONTRACTS[networkKey] : null;
}

/**
 * Update contract addresses after deployment
 */
export function updateContractAddresses(
  chainId: number, 
  addresses: Partial<ContractAddresses>
): void {
  const networkKey = Object.keys(CONTRACTS).find(
    key => CONTRACTS[key].chainId === chainId
  );
  
  if (networkKey) {
    CONTRACTS[networkKey] = { ...CONTRACTS[networkKey], ...addresses };
  }
}

/**
 * Contract ABIs for frontend interaction
 */
export const GTT_TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function mint(address to, uint256 amount)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

export const TRUTH_VAULT_ABI = [
  "function sealCapsule(uint256 capsuleId, string calldata metadataHash)",
  "function getSeal(uint256 capsuleId) view returns (tuple(address sealedBy, uint256 timestamp, string metadataHash))",
  "event CapsuleSealed(uint256 capsuleId, address indexed sealedBy, string metadataHash)"
];

export const CAPSULE_FACTORY_ABI = [
  "function capsuleCounter() view returns (uint256)",
  "function createCapsule(string calldata contentHash) returns (uint256)",
  "function sealCapsule(uint256 id)",
  "function capsules(uint256) view returns (tuple(uint256 id, string contentHash, address creator, bool isSealed))",
  "event CapsuleCreated(uint256 id, address creator)",
  "event CapsuleSealed(uint256 id)"
];

export const CONTRACT_ABIS = {
  GTTToken: [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
    "function mint(address to, uint256 amount)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "event Transfer(address indexed from, address indexed to, uint256 value)"
  ],
  
  TruthVault: [
    "function sealCapsule(uint256 capsuleId, string calldata metadataHash)",
    "function getSeal(uint256 capsuleId) view returns (tuple(address sealedBy, uint256 timestamp, string metadataHash))",
    "event CapsuleSealed(uint256 capsuleId, address indexed sealedBy, string metadataHash)"
  ],
  
  CapsuleFactory: [
    "function capsuleCounter() view returns (uint256)",
    "function createCapsule(string calldata contentHash) returns (uint256)",
    "function sealCapsule(uint256 id)",
    "function capsules(uint256) view returns (tuple(uint256 id, string contentHash, address creator, bool isSealed))",
    "event CapsuleCreated(uint256 id, address creator)",
    "event CapsuleSealed(uint256 id)"
  ]
};

/**
 * Network configurations for Web3 integration
 */
export const NETWORK_CONFIGS = {
  31337: {
    name: "Hardhat",
    rpcUrl: "http://127.0.0.1:8545",
    blockExplorer: null,
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 }
  },
  11155111: {
    name: "Sepolia",
    rpcUrl: "https://eth-sepolia.g.alchemy.com/v2/your-key",
    blockExplorer: "https://sepolia.etherscan.io",
    nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 }
  },
  80002: {
    name: "Polygon Amoy",
    rpcUrl: "https://rpc-amoy.polygon.technology",
    blockExplorer: "https://amoy.polygonscan.com",
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 }
  }
};

/**
 * Check if contracts are deployed on current network
 */
export function areContractsDeployed(chainId: number): boolean {
  const contracts = getContractsForChain(chainId);
  if (!contracts) return false;
  
  return contracts.gtt !== "0x..." && 
         contracts.vault !== "0x..." && 
         contracts.factory !== "0x...";
}

/**
 * Get block explorer URL for transaction or address
 */
export function getExplorerUrl(chainId: number, hash: string, type: 'tx' | 'address' = 'tx'): string | null {
  const config = NETWORK_CONFIGS[chainId as keyof typeof NETWORK_CONFIGS];
  if (!config?.blockExplorer) return null;
  
  return `${config.blockExplorer}/${type}/${hash}`;
}

/**
 * Get network name by chain ID
 */
export function getNetworkName(chainId: number): string {
  const config = NETWORK_CONFIGS[chainId as keyof typeof NETWORK_CONFIGS];
  return config?.name || `Unknown Network (${chainId})`;
}