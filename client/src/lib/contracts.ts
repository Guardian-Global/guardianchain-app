import { ethers } from "ethers";
import { CONTRACT_ADDRESSES } from "@shared/constants";

// Mumbai Testnet Configuration
export const MUMBAI_CHAIN_ID = 80002;
export const DEFAULT_CHAIN_ID = MUMBAI_CHAIN_ID;

// Contract ABIs (minimal required functions)
export const GTT_TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function mint(address to, uint256 amount)",
  "function burn(uint256 amount)",
  "function setTaxExempt(address account, bool exempt)",
  "function distributeYield(address recipient, uint256 amount)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
  "event YieldDistributed(address indexed recipient, uint256 amount)",
];

// Legacy ABI export for compatibility
export const CAPSULE_FACTORY_V2_ABI = GTT_TOKEN_ABI;

export const TRUTH_DAO_ABI = [
  "function proposalCount() view returns (uint256)",
  "function proposals(uint256) view returns (string, string, address, uint256, uint256, uint256, bool, uint256)",
  "function createProposal(string memory title, string memory description)",
  "function vote(uint256 proposalId, bool support)",
  "function execute(uint256 proposalId)",
  "event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title)",
  "event Voted(uint256 indexed proposalId, address indexed voter, bool support, uint256 votes)"
];

export const TRUTH_VAULT_ABI = [
  "function gttToken() view returns (address)",
  "function createCapsule(bytes32 capsuleId, address creator, string memory contentHash, uint256 yieldAmount)",
  "function verifyCapsule(bytes32 capsuleId, uint256 bonusAmount)",
  "function claimYield(bytes32 capsuleId) returns (uint256)",
  "function getCapsuleYield(bytes32 capsuleId) view returns (uint256)",
  "function getCapsuleCreator(bytes32 capsuleId) view returns (address)",
  "function isCapsuleVerified(bytes32 capsuleId) view returns (bool)",
  "function setYieldConfig(uint256 baseAmount, uint256 verificationBonus, uint256 shareBonus)",
  "function pause()",
  "function unpause()",
  "event CapsuleCreated(bytes32 indexed capsuleId, address indexed creator, string contentHash, uint256 yieldAmount)",
  "event CapsuleVerified(bytes32 indexed capsuleId, address indexed verifier, uint256 yieldAmount)",
  "event YieldClaimed(address indexed user, bytes32 indexed capsuleId, uint256 amount)",
];

// Network Configuration
export const SUPPORTED_NETWORKS = [
  {
    chainId: "0x13882", // 80002 in hex
    chainIdNum: 80002,
    chainName: "Polygon Mumbai Testnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
  },
];

export const DEFAULT_NETWORK = SUPPORTED_NETWORKS[0];



// Get contract addresses for current chain
export function getContractAddresses(chainId: number = DEFAULT_CHAIN_ID) {
  return CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES.MUMBAI;
}



// Get contract instance
export function getContract(
  address: string,
  abi: string[],
  provider: ethers.Provider | ethers.Signer
) {
  return new ethers.Contract(address, abi, provider);
}

// Get GTT Token contract
export function getGTTTokenContract(
  provider: ethers.Provider | ethers.Signer,
  chainId: number = DEFAULT_CHAIN_ID
) {
  const addresses = getContractAddresses(chainId);
  return getContract(addresses.GTTToken, GTT_TOKEN_ABI, provider);
}

// Get TruthVault contract
export function getTruthVaultContract(
  provider: ethers.Provider | ethers.Signer,
  chainId: number = DEFAULT_CHAIN_ID
) {
  const addresses = getContractAddresses(chainId);
  return getContract(addresses.TruthVault, TRUTH_VAULT_ABI, provider);
}

// Utility functions
export function formatGTT(amount: bigint | string): string {
  return ethers.formatEther(amount.toString());
}

export function parseGTT(amount: string): bigint {
  return ethers.parseEther(amount);
}

export function generateCapsuleId(
  creator: string,
  content: string,
  timestamp: number
): string {
  const data = ethers.solidityPackedKeccak256(
    ["address", "string", "uint256"],
    [creator, content, timestamp]
  );
  return data;
}

// Provider setup
export async function getProvider(): Promise<ethers.BrowserProvider | null> {
  if (typeof window === "undefined" || !window.ethereum) {
    return null;
  }
  return new ethers.BrowserProvider(window.ethereum);
}

export async function getSigner(): Promise<ethers.Signer | null> {
  const provider = await getProvider();
  if (!provider) return null;
  return await provider.getSigner();
}

// Chain utilities
export function isValidChain(chainId: number): boolean {
  return chainId === MUMBAI_CHAIN_ID;
}

export function getChainName(chainId: number): string {
  const network = SUPPORTED_NETWORKS.find((n) => n.chainIdNum === chainId);
  return network?.chainName || `Unknown Chain (${chainId})`;
}

// Contract address helper
export function getContractAddress(
  chainId: number,
  contractName: string
): string {
  const addresses = getContractAddresses(chainId);
  return addresses[contractName as keyof typeof addresses] || "";
}

// Truth Auction ABI for compatibility
export const TRUTH_AUCTION_ABI = [
  "function createAuction(bytes32 capsuleId, uint256 reservePrice, uint256 duration)",
  "function placeBid(bytes32 capsuleId) payable",
  "function finalizeAuction(bytes32 capsuleId)",
  "function getAuction(bytes32 capsuleId) view returns (tuple)",
  "event AuctionCreated(bytes32 indexed capsuleId, address indexed creator, uint256 reservePrice)",
  "event BidPlaced(bytes32 indexed capsuleId, address indexed bidder, uint256 amount)",
  "event AuctionFinalized(bytes32 indexed capsuleId, address indexed winner, uint256 amount)",
];

// Contract ABIs export for compatibility
export const CONTRACT_ABIS = {
  GTTToken: GTT_TOKEN_ABI,
  TruthVault: TRUTH_VAULT_ABI,
  TruthDAO: TRUTH_DAO_ABI,
  CapsuleFactoryV2: CAPSULE_FACTORY_V2_ABI,
  TruthAuction: TRUTH_AUCTION_ABI,
};
