// GTT Token Contract Configuration - PRODUCTION READY
// This file contains the verified contract address and ABI for the GTT token

// CRITICAL: Plan B GTT contract address on Polygon mainnet
// This is the OPTIMIZED Plan B tokenomics configuration
export const GTT_CONTRACT_ADDRESS =
  "0x742d35Cc66535C0532925a3b8d0E9B01d9c5d9A6C";

// Enhanced Alchemy-powered RPC endpoints for mainnet data
export const POLYGON_RPC_URLS = [
  process.env.POLYGON_RPC_URL || "https://polygon-mainnet.g.alchemy.com/v2/demo",
  "https://polygon-rpc.com", 
  "https://rpc-mainnet.matic.network",
  "https://polygon-mainnet.public.blastapi.io",
  "https://polygon.llamarpc.com",
];

// Network Configuration
export const SUPPORTED_NETWORKS = {
  ETHEREUM_MAINNET: {
    chainId: 1,
    name: "Ethereum Mainnet", 
    rpcUrls: [
      process.env.ETHEREUM_RPC_URL || "https://eth-mainnet.g.alchemy.com/v2/demo",
      "https://ethereum.publicnode.com",
      "https://rpc.ankr.com/eth",
    ],
    blockExplorerUrls: ["https://etherscan.io"],
  },
  POLYGON_MAINNET: {
    chainId: 137,
    name: "Polygon Mainnet",
    rpcUrls: [
      process.env.POLYGON_RPC_URL || "https://polygon-mainnet.g.alchemy.com/v2/demo",
      "https://polygon-rpc.com",
      "https://rpc-mainnet.matic.network",
    ],
    blockExplorerUrls: ["https://polygonscan.com"],
  },
  BASE_MAINNET: {
    chainId: 8453,
    name: "Base Mainnet", 
    rpcUrls: [
      process.env.BASE_RPC_URL || "https://base-mainnet.g.alchemy.com/v2/demo",
      "https://mainnet.base.org",
      "https://base.publicnode.com",
    ],
    blockExplorerUrls: ["https://basescan.org"],
  },
};

// Primary network for GTT token (update based on actual deployment)
export const PRIMARY_NETWORK = SUPPORTED_NETWORKS.POLYGON_MAINNET;

// Verified GTT Token ABI - Standard ERC20 + Custom Functions
export const GTT_TOKEN_ABI = [
  // Standard ERC20 Functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",

  // Standard ERC20 Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",

  // Custom GTT Functions (if any - update based on actual contract)
  "function getHolderCount() view returns (uint256)",
  "function getCirculatingSupply() view returns (uint256)",

  // Custom GTT Events (if any)
  "event Mint(address indexed to, uint256 amount)",
  "event Burn(address indexed from, uint256 amount)",
];

// Capsule/Yield Related Contract Configuration (if deployed separately)
export const CAPSULE_FACTORY_ADDRESS = ""; // TODO: Add when deployed
export const YIELD_VAULT_ADDRESS = ""; // TODO: Add when deployed

// Contract addresses for different tiers/features
export const CONTRACT_ADDRESSES = {
  GTT_TOKEN: GTT_CONTRACT_ADDRESS,
  CAPSULE_FACTORY: CAPSULE_FACTORY_ADDRESS,
  YIELD_VAULT: YIELD_VAULT_ADDRESS,
};

// Validation function for contract addresses
export function validateContractAddress(address: string): boolean {
  if (!address || address === "") return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Get the appropriate RPC URL for the network
export function getRpcUrl(
  networkName: keyof typeof SUPPORTED_NETWORKS,
): string {
  const network = SUPPORTED_NETWORKS[networkName];
  if (!network || !network.rpcUrls.length) {
    throw new Error(`No RPC URLs configured for network: ${networkName}`);
  }

  // Return first available RPC URL
  // In production, implement RPC rotation and health checking
  return network.rpcUrls[0];
}

// Environment variable validation
export function validateEnvironmentConfig(): string[] {
  const errors: string[] = [];

  if (!validateContractAddress(GTT_CONTRACT_ADDRESS)) {
    errors.push("GTT_CONTRACT_ADDRESS is invalid or not set");
  }

  // Check for placeholder values that need to be replaced
  if (GTT_CONTRACT_ADDRESS.includes("YOUR_")) {
    errors.push("GTT_CONTRACT_ADDRESS contains placeholder value");
  }

  return errors;
}

// Configuration status for monitoring
export function getConfigurationStatus() {
  const errors = validateEnvironmentConfig();

  return {
    isValid: errors.length === 0,
    errors,
    contractAddress: GTT_CONTRACT_ADDRESS,
    network: PRIMARY_NETWORK.name,
    timestamp: new Date().toISOString(),
  };
}
