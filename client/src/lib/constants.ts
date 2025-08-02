// Smart contract constants for Truth Auctions
export const AUCTION_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";

export const AUCTION_ABI = [
  {
    "inputs": [
      {"name": "auctionId", "type": "uint256"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "fundAuction",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "auctionId", "type": "uint256"}],
    "name": "getAuctionDetails",
    "outputs": [
      {"name": "funded", "type": "uint256"},
      {"name": "unlocked", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// GTT Token contract for approvals
export const GTT_TOKEN_ADDRESS = "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd";

export const GTT_TOKEN_ABI = [
  {
    "inputs": [
      {"name": "spender", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "owner", "type": "address"},
      {"name": "spender", "type": "address"}
    ],
    "name": "allowance",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// Brand colors for consistent theming
export const BRAND_COLORS = {
  primary: '#6366f1', // indigo-500
  secondary: '#8b5cf6', // violet-500
  accent: '#06b6d4', // cyan-500
  success: '#10b981', // emerald-500
  warning: '#f59e0b', // amber-500
  error: '#ef4444', // red-500
  dark: '#0f172a', // slate-900
  light: '#f8fafc', // slate-50
};

// Brand identity constants
export const BRAND_NAME = "GuardianChain";
export const BRAND_TAGLINE = "Sovereign Truth Preservation Protocol";

// Protocol configuration
export const PROTOCOL_CONFIG = {
  NAME: "GuardianChain",
  TAGLINE: "Sovereign Truth Infrastructure",
  version: "2.0",
  network: "polygon",
  chainId: 137,
  rpcUrl: "https://polygon-rpc.com",
  blockExplorer: "https://polygonscan.com",
  features: {
    truthAuctions: true,
    capsuleMinting: true,
    yieldDistribution: true,
    verificationEngine: true,
  },
  SOCIAL: {
    TWITTER: "@GuardianChain",
    DISCORD: "discord.gg/guardianchain",
    GITHUB: "guardianchain",
    TELEGRAM: "@guardianchain_official",
  },
};

// Veritus Node configuration
export const VERITUS_NODE = {
  endpoint: "wss://veritus.guardianchain.app",
  apiKey: "vn_dev_key_placeholder",
  features: {
    truthVerification: true,
    consensusVoting: true,
    reputationScoring: true,
    liveBroadcast: true,
  },
};

// Early adopter rewards configuration
export const EARLY_ADOPTER_REWARDS = {
  multiplier: 2.5,
  bonusTokens: 1000,
  exclusiveFeatures: [
    "premiumVerification",
    "advancedAnalytics",
    "prioritySupport",
    "betaAccess"
  ],
  nftRewards: {
    founderBadge: true,
    limitedEdition: true,
    specialAccess: true,
  },
};

// Staking tier configuration
export const STAKING_TIERS = {
  explorer: {
    minStake: 0,
    multiplier: 1.0,
    features: ["basicAccess", "standardYield"],
  },
  seeker: {
    minStake: 1000,
    multiplier: 1.5,
    features: ["enhancedAccess", "bonusYield", "prioritySupport"],
  },
  creator: {
    minStake: 5000,
    multiplier: 2.0,
    features: ["premiumAccess", "maxYield", "exclusiveFeatures"],
  },
  sovereign: {
    minStake: 25000,
    multiplier: 3.0,
    features: ["sovereignAccess", "maxYield", "governanceRights", "foundersClub"],
  },
};