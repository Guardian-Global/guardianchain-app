// Contract addresses and ABIs for all supported networks
export const CONTRACTS = {
  // Local Hardhat network
  31337: {
    GTT_TOKEN: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    TRUTH_VAULT: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  },
  // Polygon Mumbai testnet
  80001: {
    GTT_TOKEN: "", // To be filled after deployment
    TRUTH_VAULT: "", // To be filled after deployment
  },
  // Polygon Amoy testnet
  80002: {
    GTT_TOKEN: "", // To be filled after deployment
    TRUTH_VAULT: "", // To be filled after deployment
  },
} as const;

export const NETWORK_NAMES = {
  31337: "Hardhat Local",
  80001: "Polygon Mumbai",
  80002: "Polygon Amoy",
} as const;

export const NETWORK_EXPLORERS = {
  31337: "http://localhost:8545",
  80001: "https://mumbai.polygonscan.com",
  80002: "https://amoy.polygonscan.com",
} as const;

// Contract ABIs
export const GTT_TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function MAX_SUPPLY() view returns (uint256)",
  "function remainingSupply() view returns (uint256)",
  "function setVault(address _vault)",
  "function mint(address to, uint256 amount) returns (bool)",
  "function burn(uint256 amount)",
  "function burnFrom(address from, uint256 amount)",
  "function pause()",
  "function unpause()",
  "function paused() view returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
] as const;

export const TRUTH_VAULT_ABI = [
  "function gttToken() view returns (address)",
  "function capsules(uint256) view returns (tuple(address creator, bool isVerified, bool isSealed, uint256 truthYield, uint256 totalClaimed, uint256 lastClaimTime, string ipfsHash, string veritasSealUrl))",
  "function yieldToGTTRatio() view returns (uint256)",
  "function premiumMultiplier() view returns (uint256)",
  "function eliteMultiplier() view returns (uint256)",
  "function legendaryMultiplier() view returns (uint256)",
  "function MIN_CLAIM_AMOUNT() view returns (uint256)",
  "function CLAIM_COOLDOWN() view returns (uint256)",
  "function registerCapsule(uint256 capsuleId, address creator, string ipfsHash)",
  "function verifyCapsule(uint256 capsuleId, bool isVerified, bool isSealed)",
  "function updateTruthYield(uint256 capsuleId, uint256 newYield)",
  "function claimYield(uint256 capsuleId, uint256 yieldAmount) payable",
  "function calculateGTTAmount(uint256 yieldAmount) view returns (uint256)",
  "function getTierMultiplier(uint256 yieldAmount) view returns (uint256)",
  "function hasRole(bytes32 role, address account) view returns (bool)",
  "function DEFAULT_ADMIN_ROLE() view returns (bytes32)",
  "function GOVERNOR_ROLE() view returns (bytes32)",
  "function ORACLE_ROLE() view returns (bytes32)",
  "event CapsuleRegistered(uint256 indexed capsuleId, address indexed creator, string ipfsHash)",
  "event CapsuleVerified(uint256 indexed capsuleId, bool isVerified, bool isSealed)",
  "event YieldClaimed(address indexed user, uint256 indexed capsuleId, uint256 yieldAmount, uint256 gttAmount, string reason)",
  "event YieldUpdated(uint256 indexed capsuleId, uint256 oldYield, uint256 newYield)",
] as const;

// Helper function to get contract address
export function getContractAddress(chainId: number, contract: 'GTT_TOKEN' | 'TRUTH_VAULT'): string {
  const addresses = CONTRACTS[chainId as keyof typeof CONTRACTS];
  if (!addresses) {
    throw new Error(`Contracts not deployed on chain ${chainId}`);
  }
  
  const address = addresses[contract];
  if (!address) {
    throw new Error(`${contract} not deployed on chain ${chainId}`);
  }
  
  return address;
}

// Helper function to get network name
export function getNetworkName(chainId: number): string {
  return NETWORK_NAMES[chainId as keyof typeof NETWORK_NAMES] || `Unknown Network (${chainId})`;
}

// Helper function to get explorer URL
export function getExplorerUrl(chainId: number, address: string): string {
  const explorer = NETWORK_EXPLORERS[chainId as keyof typeof NETWORK_EXPLORERS];
  if (!explorer) return "";
  
  if (chainId === 31337) {
    return explorer; // Local network
  }
  
  return `${explorer}/address/${address}`;
}

// Helper function to check if network is supported
export function isSupportedNetwork(chainId: number): boolean {
  return chainId in CONTRACTS;
}