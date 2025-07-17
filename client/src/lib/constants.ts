export const APP_NAME = "Veritas";
export const APP_DESCRIPTION = "Web3 Truth Verification Platform";

// API Endpoints
export const API_BASE_URL = "/api";

// Web3 Constants
export const SUPPORTED_NETWORKS = [
  {
    chainId: "0x1", // Ethereum Mainnet
    chainName: "Ethereum Mainnet",
    rpcUrls: ["https://mainnet.infura.io/v3/"],
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: ["https://etherscan.io/"],
  },
  {
    chainId: "0x5", // Goerli Testnet
    chainName: "Goerli Testnet",
    rpcUrls: ["https://goerli.infura.io/v3/"],
    nativeCurrency: {
      name: "Goerli Ether",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: ["https://goerli.etherscan.io/"],
  },
  {
    chainId: "0x89", // Polygon Mainnet
    chainName: "Polygon Mainnet",
    rpcUrls: ["https://polygon-rpc.com/"],
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    blockExplorerUrls: ["https://polygonscan.com/"],
  },
];

export const DEFAULT_NETWORK = SUPPORTED_NETWORKS[0]; // Ethereum Mainnet

// GTT Token Constants
export const GTT_TOKEN = {
  name: "Governance Truth Token",
  symbol: "GTT",
  decimals: 18,
  totalSupply: "1000000000", // 1 billion tokens
};

// Capsule Categories
export const CAPSULE_CATEGORIES = [
  "Technology",
  "Science",
  "Politics",
  "Economics",
  "Health",
  "Environment",
  "Social Issues",
  "Predictions",
  "Facts",
  "Analysis",
  "Other",
] as const;

// Verification Status
export const VERIFICATION_STATUS = {
  PENDING: "pending",
  VERIFIED: "verified",
  REJECTED: "rejected",
} as const;

// Transaction Types
export const TRANSACTION_TYPES = {
  REWARD: "reward",
  STAKE: "stake",
  PENALTY: "penalty",
  MINT: "mint",
  BURN: "burn",
} as const;

// Achievement Types
export const ACHIEVEMENT_TYPES = {
  TRUTH_STREAK: "truth_streak",
  COMMUNITY_IMPACT: "community_impact",
  FIRST_NFT: "first_nft",
  EARLY_ADOPTER: "early_adopter",
  VERIFICATION_EXPERT: "verification_expert",
  HIGH_ACCURACY: "high_accuracy",
} as const;

// Grief Score Thresholds
export const GRIEF_SCORE_THRESHOLDS = {
  EXCELLENT: 9.0,
  GOOD: 7.0,
  AVERAGE: 5.0,
  POOR: 3.0,
  TERRIBLE: 1.0,
} as const;

// Platform Settings
export const PLATFORM_SETTINGS = {
  MAX_CAPSULE_TITLE_LENGTH: 200,
  MAX_CAPSULE_DESCRIPTION_LENGTH: 500,
  MAX_CAPSULE_CONTENT_LENGTH: 10000,
  MIN_GRIEF_SCORE_FOR_VERIFICATION: 1.0,
  DEFAULT_GTT_REWARD: 10,
  MAX_FILE_UPLOAD_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FILE_TYPES: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "text/plain",
    "application/json",
  ],
} as const;

// Social Links
export const SOCIAL_LINKS = {
  TWITTER: "https://twitter.com/veritasplatform",
  DISCORD: "https://discord.gg/veritas",
  GITHUB: "https://github.com/veritas-platform",
  TELEGRAM: "https://t.me/veritasplatform",
  MEDIUM: "https://medium.com/@veritasplatform",
} as const;

// External Service URLs
export const EXTERNAL_SERVICES = {
  ETHERSCAN: "https://etherscan.io",
  POLYGONSCAN: "https://polygonscan.com",
  OPENSEA: "https://opensea.io",
  UNISWAP: "https://app.uniswap.org",
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: "Please connect your wallet to continue",
  INSUFFICIENT_BALANCE: "Insufficient balance to complete this transaction",
  NETWORK_NOT_SUPPORTED: "Please switch to a supported network",
  TRANSACTION_FAILED: "Transaction failed. Please try again",
  CAPSULE_NOT_FOUND: "Capsule not found",
  UNAUTHORIZED: "You are not authorized to perform this action",
  VALIDATION_ERROR: "Please check your input and try again",
  NETWORK_ERROR: "Network error. Please check your connection",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  WALLET_CONNECTED: "Wallet connected successfully",
  TRANSACTION_CONFIRMED: "Transaction confirmed",
  CAPSULE_CREATED: "Truth capsule created successfully",
  VERIFICATION_SUBMITTED: "Verification submitted successfully",
  PROFILE_UPDATED: "Profile updated successfully",
  SETTINGS_SAVED: "Settings saved successfully",
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: "veritas-theme",
  WALLET_CONNECTION: "veritas-wallet-connected",
  USER_PREFERENCES: "veritas-user-preferences",
  RECENT_SEARCHES: "veritas-recent-searches",
} as const;

// Query Keys for React Query
export const QUERY_KEYS = {
  STATS: "stats",
  CAPSULES: "capsules",
  FEATURED_CAPSULES: "featured-capsules",
  TRENDING_CAPSULES: "trending-capsules",
  USER: "user",
  LEADERBOARD: "leaderboard",
  TRANSACTIONS: "transactions",
  ACHIEVEMENTS: "achievements",
  VERIFICATIONS: "verifications",
} as const;
