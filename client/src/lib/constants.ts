// GUARDIANCHAIN Protocol Constants
export const BRAND_NAME = "GUARDIANCHAIN";
export const BRAND_COLORS = {
  GUARDIAN: "#7F5AF0", // purple
  CHAIN: "#2CB67D", // green
};

export const PROTOCOL_CONFIG = {
  NAME: "GUARDIANCHAIN",
  TAGLINE: "Decentralized Truth Verification Protocol",
  DOMAIN: "guardianchain.app",
  SOCIAL: {
    TWITTER: "@guardianchain",
    DISCORD: "discord.gg/guardianchain",
    TELEGRAM: "t.me/guardianchain"
  }
};

export const TOKEN_CONFIG = {
  SYMBOL: "GTT",
  NAME: "Guardian Truth Token",
  DECIMALS: 18,
  INITIAL_SUPPLY: 1000000
};

export const FEE_STRUCTURE = {
  MINT_BASE: 50,
  SEAL_PREMIUM: 100,
  MULTIMEDIA: 25,
  GOVERNANCE: 500,
  VERIFICATION: 25
};

export const EARLY_ADOPTER_REWARDS = {
  FIRST_100_STAKERS: 1000, // GTT bonus
  FIRST_500_USERS: 500, // GTT airdrop
  REFERRAL_BONUS: 100, // GTT per referral
  PIONEER_BADGE_THRESHOLD: 10 // minimum capsules sealed
};

export const STAKING_TIERS = {
  BRONZE: { min: 1000, multiplier: 1.1, color: "#CD7F32" },
  SILVER: { min: 5000, multiplier: 1.25, color: "#C0C0C0" },
  GOLD: { min: 10000, multiplier: 1.5, color: "#FFD700" },
  PLATINUM: { min: 25000, multiplier: 2.0, color: "#E5E4E2" },
  DIAMOND: { min: 50000, multiplier: 3.0, color: "#B9F2FF" }
};

export const LAUNCHPAD_CONFIG = {
  FEATURED_SLOTS: 3,
  VOTING_PERIOD: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  MIN_VOTES: 100,
  FEATURED_REWARD: 2000 // GTT bonus for featured creators
};

// Veritus Node Configuration - Admin wallet address for CapsuleFactoryV2
export const VERITUS_NODE = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // First Hardhat account