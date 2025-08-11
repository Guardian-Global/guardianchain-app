import type { Capsule } from "@/types/schema";

// TruthYield ROI calculation constants
export const ROI_WEIGHTS = {
  VIEW: 0.5,
  SHARE: 1.5,
  VERIFICATION: 3.0,
  MINTED: 10.0,
  VERITAS_SEALED: 5.0,
  COMMUNITY_VOTE: 2.0,
} as const;

// Calculate Truth Yield score based on capsule metrics
export function calculateTruthYield(capsule: Capsule): number {
  const {
    viewCount = 0,
    shareCount = 0,
    verificationStatus,
    contractAddress,
  } = capsule;

  let score = 0;
  
  // Base engagement metrics
  score += viewCount * ROI_WEIGHTS.VIEW;
  score += shareCount * ROI_WEIGHTS.SHARE;
  
  // Verification bonus
  if (verificationStatus === 'verified') {
    score += ROI_WEIGHTS.VERIFICATION;
  }
  
  // Minting bonus
  if (contractAddress) {
    score += ROI_WEIGHTS.MINTED;
  }
  
  return Math.round(score * 100) / 100;
}

// Get yield tier based on score
export function getYieldTier(score: number): string {
  if (score >= 50) return "Legendary";
  if (score >= 25) return "Epic";
  if (score >= 10) return "Rare";
  if (score >= 5) return "Uncommon";
  return "Common";
}

// Get yield multiplier for tier
export function getYieldMultiplier(tier: string): number {
  switch (tier) {
    case "Legendary": return 5.0;
    case "Epic": return 3.0;
    case "Rare": return 2.0;
    case "Uncommon": return 1.5;
    default: return 1.0;
  }
}

// Calculate projected rewards
export function calculateProjectedRewards(capsule: Capsule, timeFrame: number = 30): {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
} {
  const truthYield = calculateTruthYield(capsule);
  const tier = getYieldTier(truthYield);
  const multiplier = getYieldMultiplier(tier);
  
  const dailyBase = truthYield * multiplier * 0.1; // Base daily yield
  
  return {
    daily: Math.round(dailyBase * 100) / 100,
    weekly: Math.round(dailyBase * 7 * 100) / 100,
    monthly: Math.round(dailyBase * 30 * 100) / 100,
    yearly: Math.round(dailyBase * 365 * 100) / 100,
  };
}