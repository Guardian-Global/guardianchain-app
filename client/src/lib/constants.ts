// Contract addresses - update these after deployment
export const CONTRACT_ADDRESSES = {
  // Local Hardhat network
  31337: {
    GTT_TOKEN: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    TRUTH_VAULT: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  },
  // Sepolia testnet
  11155111: {
    GTT_TOKEN: "", // To be filled after deployment
    TRUTH_VAULT: "", // To be filled after deployment
  },
  // Polygon Amoy testnet
  80002: {
    GTT_TOKEN: "", // To be filled after deployment
    TRUTH_VAULT: "", // To be filled after deployment
  },
} as const;

// Get contract address for current network
export function getContractAddress(chainId: number, contract: 'GTT_TOKEN' | 'TRUTH_VAULT'): string {
  const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
  if (!addresses) {
    throw new Error(`Contracts not deployed on chain ${chainId}`);
  }
  
  const address = addresses[contract];
  if (!address) {
    throw new Error(`${contract} not deployed on chain ${chainId}`);
  }
  
  return address;
}

// Contract ABIs - these will be generated after compilation
export const GTT_TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
] as const;

export const TRUTH_VAULT_ABI = [
  "function gttToken() view returns (address)",
  "function capsules(uint256) view returns (tuple(address creator, bool isVerified, bool isSealed, uint256 truthYield, uint256 totalClaimed, uint256 lastClaimTime, string ipfsHash, string veritasSealUrl))",
  "function claimYield(uint256 capsuleId, uint256 yieldAmount) payable",
  "function registerCapsule(uint256 capsuleId, address creator, string ipfsHash)",
  "function verifyCapsule(uint256 capsuleId, bool isVerified, bool isSealed)",
  "function updateTruthYield(uint256 capsuleId, uint256 newYield)",
  "event YieldClaimed(address indexed user, uint256 indexed capsuleId, uint256 yieldAmount, uint256 gttAmount, string reason)",
  "event CapsuleRegistered(uint256 indexed capsuleId, address indexed creator, string ipfsHash)",
  "event CapsuleVerified(uint256 indexed capsuleId, bool isVerified, bool isSealed)"
] as const;