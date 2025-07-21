// GUARDIANCHAIN Protocol Constants

// Contract Addresses (Polygon Mumbai Testnet)
export const CONTRACT_ADDRESSES = {
  MUMBAI: {
    chainId: 80001,
    GTTToken: "0x0000000000000000000000000000000000000000", // To be updated after deployment
    TruthVault: "0x0000000000000000000000000000000000000000", // To be updated after deployment
    rpcUrl: "https://rpc-mumbai.maticvigil.com"
  },
  POLYGON: {
    chainId: 137,
    GTTToken: "0x0000000000000000000000000000000000000000", // For mainnet deployment
    TruthVault: "0x0000000000000000000000000000000000000000", // For mainnet deployment
    rpcUrl: "https://polygon-rpc.com"
  }
};

// Protocol Configuration
export const PROTOCOL_CONFIG = {
  // Token Economics
  GTT_MAX_SUPPLY: "1000000000", // 1 billion GTT
  GTT_INITIAL_SUPPLY: "100000000", // 100 million GTT
  GTT_TRADING_TAX_BP: 250, // 2.5% trading tax
  
  // Yield Configuration
  BASE_YIELD_AMOUNT: "100", // 100 GTT base yield
  VERIFICATION_BONUS: "50", // 50 GTT verification bonus
  SHARE_BONUS: "25", // 25 GTT per 10 shares
  VIEW_BONUS_RATE: "1", // 1 GTT per 100 views
  
  // Capsule Types
  CAPSULE_TYPES: {
    LEGAL: { fee: 100, multiplier: 2.0 },
    KNOWLEDGE: { fee: 50, multiplier: 1.5 },
    CREATOR: { fee: 25, multiplier: 1.2 },
    CIVIC: { fee: 75, multiplier: 1.8 },
    FINANCIAL: { fee: 150, multiplier: 2.5 },
    VERITAS_CERTIFICATE: { fee: 200, multiplier: 3.0 },
    AI_GENERATED: { fee: 30, multiplier: 1.1 },
    CROSS_CHAIN_ASSET: { fee: 100, multiplier: 2.2 },
    MULTIMEDIA_STORY: { fee: 40, multiplier: 1.3 },
    CITIZEN_JOURNALISM: { fee: 60, multiplier: 1.6 },
    FRAUD_PROOF: { fee: 250, multiplier: 4.0 },
    WITNESS_TESTIMONY: { fee: 300, multiplier: 5.0 },
    SOULBOUND_MEMOIR: { fee: 500, multiplier: 10.0 }
  },
  
  // User Tiers
  USER_TIERS: {
    EXPLORER: {
      monthlyFee: 0,
      gttRewards: 100,
      capsuleLimit: 5,
      features: ["basic_verification", "community_access"]
    },
    SEEKER: {
      monthlyFee: 29,
      gttRewards: 500,
      capsuleLimit: 25,
      features: ["advanced_analytics", "priority_support", "nft_minting"]
    },
    CREATOR: {
      monthlyFee: 99,
      gttRewards: 2000,
      capsuleLimit: 100,
      features: ["premium_capsules", "ai_assistant", "custom_branding"]
    },
    SOVEREIGN: {
      monthlyFee: 299,
      gttRewards: 10000,
      capsuleLimit: 1000,
      features: ["institutional_access", "api_access", "white_label"]
    }
  }
};

// Brand Colors
export const BRAND_COLORS = {
  primary: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e"
  },
  secondary: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d"
  },
  purple: {
    50: "#faf5ff",
    100: "#f3e8ff",
    200: "#e9d5ff",
    300: "#d8b4fe",
    400: "#c084fc",
    500: "#a855f7",
    600: "#9333ea",
    700: "#7c3aed",
    800: "#6b21a8",
    900: "#581c87"
  }
};

// API Endpoints
export const API_ENDPOINTS = {
  // Capsule Management
  CAPSULES: "/api/capsules",
  CREATE_CAPSULE: "/api/capsules/create",
  VERIFY_CAPSULE: "/api/capsules/verify",
  CLAIM_YIELD: "/api/capsules/claim-yield",
  
  // User Management
  USERS: "/api/users",
  USER_PROFILE: "/api/users/profile",
  USER_STATS: "/api/users/stats",
  UPDATE_TIER: "/api/users/tier",
  
  // Authentication
  AUTH_USER: "/api/auth/user",
  AUTH_LOGIN: "/api/auth/login",
  AUTH_LOGOUT: "/api/auth/logout",
  
  // Admin
  ADMIN_DASHBOARD: "/api/admin/dashboard",
  ADMIN_CAPSULES: "/api/admin/capsules",
  ADMIN_USERS: "/api/admin/users",
  ADMIN_FLAGS: "/api/admin/flags",
  
  // Analytics
  ANALYTICS_OVERVIEW: "/api/analytics/overview",
  ANALYTICS_CAPSULE: "/api/analytics/capsule",
  ANALYTICS_USER: "/api/analytics/user"
};

// Environment Configuration
export const ENV_CONFIG = {
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  jwtSecret: process.env.JWT_SECRET,
  polygonRpcUrl: process.env.POLYGON_RPC_URL,
  privateKey: process.env.PRIVATE_KEY
};

// Social Media Configuration
export const SOCIAL_CONFIG = {
  platforms: {
    twitter: {
      name: "Twitter",
      icon: "twitter",
      shareUrl: "https://twitter.com/intent/tweet?text={text}&url={url}",
      color: "#1DA1F2"
    },
    linkedin: {
      name: "LinkedIn", 
      icon: "linkedin",
      shareUrl: "https://www.linkedin.com/sharing/share-offsite/?url={url}",
      color: "#0077B5"
    },
    facebook: {
      name: "Facebook",
      icon: "facebook", 
      shareUrl: "https://www.facebook.com/sharer/sharer.php?u={url}",
      color: "#1877F2"
    },
    discord: {
      name: "Discord",
      icon: "discord",
      shareUrl: "https://discord.com/channels/@me",
      color: "#7289DA"
    },
    telegram: {
      name: "Telegram",
      icon: "telegram",
      shareUrl: "https://t.me/share/url?url={url}&text={text}",
      color: "#0088CC"
    }
  }
};

// Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: "You must be logged in to access this feature",
  INSUFFICIENT_BALANCE: "Insufficient GTT balance for this operation",
  CAPSULE_NOT_FOUND: "Capsule not found or access denied",
  INVALID_TIER: "Invalid user tier for this operation",
  NETWORK_ERROR: "Network connection error. Please try again",
  CONTRACT_ERROR: "Smart contract interaction failed",
  VALIDATION_ERROR: "Invalid input data provided"
};

export default {
  CONTRACT_ADDRESSES,
  PROTOCOL_CONFIG,
  BRAND_COLORS,
  API_ENDPOINTS,
  ENV_CONFIG,
  SOCIAL_CONFIG,
  ERROR_MESSAGES
};