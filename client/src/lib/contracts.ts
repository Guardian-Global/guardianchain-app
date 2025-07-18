// lib/contracts.ts - Contract addresses and utilities

export interface ContractAddresses {
  chainId: number;
  gtt: string;
  vault: string;
  factory: string;
  factoryV2: string; // New CapsuleFactoryV2
  nft: string;
  dao: string;
  feeManager: string;
  treasury: string;
  auctionEngine: string;
}

export const CONTRACTS: Record<string, ContractAddresses> = {
  // Local Hardhat Network (DEPLOYED ✅)
  hardhat: {
    chainId: 31337,
    gtt: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    vault: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", 
    factory: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    factoryV2: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // CapsuleFactoryV2 deployed
    nft: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    dao: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
    feeManager: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
    treasury: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    auctionEngine: "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  },
  
  // Sepolia Testnet
  sepolia: {
    chainId: 11155111,
    gtt: "0x...",          // Replace after deploy
    vault: "0x...",        // Replace after deploy
    factory: "0x...",      // Replace after deploy
    factoryV2: "0x...",    // CapsuleFactoryV2 - Replace after deploy
    nft: "0x...",          // Replace after deploy
    dao: "0x...",          // Replace after deploy
    feeManager: "0x...",   // Replace after deploy
    treasury: "0x...",      // Replace after deploy
    auctionEngine: "0x..." // Replace after deploy
  },
  
  // Polygon Amoy Testnet  
  polygonAmoy: {
    chainId: 80002,
    gtt: "0x...",          // Will be updated after deployment
    vault: "0x...",        // Will be updated after deployment
    factory: "0x...",      // Will be updated after deployment
    factoryV2: "0x...",    // CapsuleFactoryV2 - Will be updated after deployment
    nft: "0x...",          // Will be updated after deployment
    dao: "0x...",          // Will be updated after deployment
    feeManager: "0x...",   // Will be updated after deployment
    treasury: "0x...",      // Will be updated after deployment
    auctionEngine: "0x..." // Will be updated after deployment
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
    console.warn(`Unsupported chain ID: ${chainId}. Using local hardhat for development.`);
    // Fallback to local hardhat for development
    if (CONTRACTS.hardhat) {
      const address = CONTRACTS.hardhat[contractName];
      if (address && address !== "0x...") {
        return address;
      }
    }
    throw new Error(`Unsupported chain ID: ${chainId}. Please switch to a supported network.`);
  }
  
  const address = CONTRACTS[networkKey][contractName];
  if (!address || address === "0x...") {
    console.warn(`Contract ${contractName} not deployed on chain ${chainId}`);
    return "0x0000000000000000000000000000000000000000"; // Return zero address instead of throwing
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
  ],

  VeritasCapsuleNFT: [
    "function mintVeritasCapsule(address to, string memory tokenUri, uint256 capsuleId, bool soulbound, uint256 grief, string memory vault, string memory sig) returns (uint256)",
    "function getTotalSupply() view returns (uint256)",
    "function getTokenMetadata(uint256 tokenId) view returns (bool, uint256, string, string, uint256)",
    "function tokenURI(uint256 tokenId) view returns (string)",
    "function ownerOf(uint256 tokenId) view returns (address)",
    "function balanceOf(address owner) view returns (uint256)",
    "function isSoulbound(uint256 tokenId) view returns (bool)",
    "function griefScore(uint256 tokenId) view returns (uint256)",
    "event VeritasSealed(address indexed minter, uint256 indexed tokenId, uint256 indexed capsuleId, bool soulbound, uint256 grief, string vault, string sig)"
  ],

  TruthDAO: [
    "function createProposal(string memory title, string memory description)",
    "function vote(uint256 id, bool support)",
    "function executeProposal(uint256 id)",
    "function proposalCount() view returns (uint256)",
    "function getProposal(uint256 id) view returns (uint256, address, string, string, uint256, uint256, uint256, bool, uint256)",
    "function getProposalStatus(uint256 id) view returns (bool, bool, uint256, uint256)",
    "function hasUserVoted(uint256 id, address user) view returns (bool)",
    "function getUserVoteWeight(uint256 id, address user) view returns (uint256)",
    "function proposals(uint256 id) view returns (uint256, address, string, string, uint256, uint256, uint256, bool, uint256)",
    "function hasVoted(uint256 id, address user) view returns (bool)",
    "function votingDuration() view returns (uint256)",
    "function minProposalBalance() view returns (uint256)",
    "event ProposalCreated(uint256 indexed id, address indexed proposer, string title, string description)",
    "event Voted(uint256 indexed id, address indexed voter, bool support, uint256 weight)",
    "event ProposalExecuted(uint256 indexed id, bool passed)"
  ],

  FeeManager: [
    "function payFee(string memory action)",
    "function getFee(string memory action) view returns (uint256)",
    "function setFee(string memory action, uint256 amount)",
    "function updateTreasury(address newTreasury)",
    "function getTotalFeesCollected(string memory action) view returns (uint256)",
    "function getUserFeePaid(address user, string memory action) view returns (uint256)",
    "function getUserTotalFeePaid(address user) view returns (uint256)",
    "function getAllFees() view returns (uint256, uint256, uint256, uint256)",
    "function treasury() view returns (address)",
    "function mintFee() view returns (uint256)",
    "function sealFee() view returns (uint256)",
    "function proposalFee() view returns (uint256)",
    "function verificationFee() view returns (uint256)",
    "event FeePaid(address indexed user, string indexed action, uint256 amount)",
    "event FeeUpdated(string indexed action, uint256 oldAmount, uint256 newAmount)",
    "event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury)"
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
         contracts.factory !== "0x..." &&
         contracts.nft !== "0x..." &&
         contracts.dao !== "0x..." &&
         contracts.feeManager !== "0x..." &&
         contracts.treasury !== "0x...";
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

// CapsuleFactoryV2 ABI - Enhanced capsule creation with yield and sealing
export const CAPSULE_FACTORY_V2_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_veritusNode",
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
        "internalType": "uint256",
        "name": "capsuleId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "storyTitle",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "yield",
        "type": "uint256"
      }
    ],
    "name": "CapsuleCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "capsuleId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "sealedBy",
        "type": "address"
      }
    ],
    "name": "CapsuleSealed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "capsuleId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "yieldValue",
        "type": "uint256"
      }
    ],
    "name": "YieldAssigned",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "capsuleId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "finalYield",
        "type": "uint256"
      }
    ],
    "name": "assignYield",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "capsuleCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "contentHash",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "storyTitle",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "storySummary",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "yieldEstimate",
        "type": "uint256"
      }
    ],
    "name": "createCapsule",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "capsuleId",
        "type": "uint256"
      }
    ],
    "name": "getCapsule",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "creator",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "contentHash",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "storyTitle",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "storySummary",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "createdAt",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "emotionalYield",
            "type": "uint256"
          },
          {
            "internalType": "uint8",
            "name": "status",
            "type": "uint8"
          }
        ],
        "internalType": "struct CapsuleFactoryV2.Capsule",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "capsuleId",
        "type": "uint256"
      }
    ],
    "name": "sealCapsule",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newVeritusNode",
        "type": "address"
      }
    ],
    "name": "updateVeritus",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "veritusNode",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Truth Auction Engine ABI
export const TRUTH_AUCTION_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "capsuleHash", "type": "string" },
      { "internalType": "uint256", "name": "reservePrice", "type": "uint256" }
    ],
    "name": "createAuction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }],
    "name": "placeBid",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }],
    "name": "sealAuction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }],
    "name": "getAuction",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "creator", "type": "address" },
          { "internalType": "string", "name": "capsuleHash", "type": "string" },
          { "internalType": "uint256", "name": "reservePrice", "type": "uint256" },
          { "internalType": "uint256", "name": "highestBid", "type": "uint256" },
          { "internalType": "address", "name": "highestBidder", "type": "address" },
          { "internalType": "uint256", "name": "endTime", "type": "uint256" },
          { "internalType": "bool", "name": "sealed", "type": "bool" },
          { "internalType": "bool", "name": "complete", "type": "bool" },
          { "internalType": "bool", "name": "cancelled", "type": "bool" }
        ],
        "internalType": "struct TruthAuctionEngine.Auction",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "auctionCounter",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;