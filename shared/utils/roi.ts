import type { Capsule } from "../schema";

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
    verificationCount = 0,
    minted = false,
    status,
    griefScore,
  } = capsule;

  let yieldScore = 0;

  // Base metrics
  yieldScore += viewCount * ROI_WEIGHTS.VIEW;
  yieldScore += shareCount * ROI_WEIGHTS.SHARE;
  yieldScore += verificationCount * ROI_WEIGHTS.VERIFICATION;

  // Bonus for minting
  if (minted) {
    yieldScore += ROI_WEIGHTS.MINTED;
  }

  // Bonus for Veritas sealing
  if (status === "sealed") {
    yieldScore += ROI_WEIGHTS.VERITAS_SEALED;
  }

  // Grief score multiplier (higher grief = lower yield)
  const griefMultiplier = Math.max(
    0.1,
    1 - parseFloat(griefScore || "0") * 0.1,
  );
  yieldScore *= griefMultiplier;

  return Math.round(yieldScore * 100) / 100; // Round to 2 decimal places
}

// Calculate GTT token reward based on yield
export function calculateGTTReward(truthYield: number): number {
  // Base GTT conversion: 1 yield point = 0.1 GTT
  const baseReward = truthYield * 0.1;

  // Tier multipliers for high-performing capsules
  let multiplier = 1;
  if (truthYield >= 100) multiplier = 1.5; // Premium tier
  if (truthYield >= 250) multiplier = 2.0; // Elite tier
  if (truthYield >= 500) multiplier = 3.0; // Legendary tier

  return Math.round(baseReward * multiplier * 100) / 100;
}

// Determine yield tier for UI display
export function getYieldTier(truthYield: number): {
  tier: string;
  color: string;
  description: string;
} {
  if (truthYield >= 500) {
    return {
      tier: "Legendary",
      color: "bg-gradient-to-r from-yellow-400 to-orange-500",
      description: "Elite truth content with massive impact",
    };
  }

  if (truthYield >= 250) {
    return {
      tier: "Elite",
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      description: "High-impact verified truth",
    };
  }

  if (truthYield >= 100) {
    return {
      tier: "Premium",
      color: "bg-gradient-to-r from-blue-500 to-cyan-500",
      description: "Well-performing truth capsule",
    };
  }

  if (truthYield >= 25) {
    return {
      tier: "Growing",
      color: "bg-gradient-to-r from-green-500 to-emerald-500",
      description: "Gaining community traction",
    };
  }

  return {
    tier: "Emerging",
    color: "bg-gradient-to-r from-slate-500 to-slate-600",
    description: "New truth capsule building momentum",
  };
}

// Calculate daily yield earning rate
export function calculateDailyYieldRate(
  capsule: Capsule,
  daysActive: number,
): number {
  if (daysActive === 0) return 0;

  const currentYield = parseFloat(capsule.truthYield || "0");
  return Math.round((currentYield / daysActive) * 100) / 100;
}

// Estimate potential yield based on current growth trends
export function estimateYieldProjection(
  currentYield: number,
  dailyViews: number,
  dailyShares: number,
  projectionDays: number = 30,
): number {
  const dailyYieldGrowth =
    dailyViews * ROI_WEIGHTS.VIEW + dailyShares * ROI_WEIGHTS.SHARE;

  const projectedYield = currentYield + dailyYieldGrowth * projectionDays;
  return Math.round(projectedYield * 100) / 100;
}

// Check if user can claim yield for a capsule
export function canClaimYield(
  capsule: Capsule,
  userId: number,
  lastClaimDate?: Date,
): { canClaim: boolean; reason?: string } {
  // Must be the creator
  if (capsule.creatorId !== userId) {
    return { canClaim: false, reason: "Only the creator can claim yield" };
  }

  // Must be verified and sealed
  if (capsule.status !== "sealed" && capsule.status !== "verified") {
    return { canClaim: false, reason: "Capsule must be verified or sealed" };
  }

  // Must have yield to claim
  const yieldAmount = parseFloat(capsule.truthYield || "0");
  if (yieldAmount < 1.0) {
    return {
      canClaim: false,
      reason: "Minimum yield of 1.0 required to claim",
    };
  }

  // Check cooldown period (7 days between claims)
  if (lastClaimDate) {
    const daysSinceLastClaim =
      (Date.now() - lastClaimDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceLastClaim < 7) {
      return {
        canClaim: false,
        reason: `Can claim again in ${Math.ceil(7 - daysSinceLastClaim)} days`,
      };
    }
  }

  return { canClaim: true };
}
