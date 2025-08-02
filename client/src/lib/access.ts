import { getTierById, type Tier } from "./roles";

export interface UserProfile {
  id: string;
  tierId: string;
  mintsThisPeriod: number;
  periodStartDate: string;
  gttBalance?: number;
  totalYieldEarned?: number;
  subscriptionStatus?: "active" | "cancelled" | "past_due" | "trialing";
  subscriptionEndDate?: string;
}

/**
 * Check if user can mint a new capsule
 */
export function canMint(user: UserProfile): boolean {
  const tier = getTierById(user.tierId);

  // Check subscription status for paid tiers
  if (
    tier.priceUSD > 0 &&
    user.subscriptionStatus !== "active" &&
    user.subscriptionStatus !== "trialing"
  ) {
    return false;
  }

  // Check mint limit
  return user.mintsThisPeriod < tier.capsuleLimit;
}

/**
 * Get remaining mints for the current period
 */
export function getRemainingMints(user: UserProfile): number {
  const tier = getTierById(user.tierId);
  return Math.max(tier.capsuleLimit - user.mintsThisPeriod, 0);
}

/**
 * Get days until period reset
 */
export function getDaysUntilReset(user: UserProfile): number {
  const startDate = new Date(user.periodStartDate);
  const nextReset = new Date(startDate);
  nextReset.setMonth(nextReset.getMonth() + 1);

  const now = new Date();
  const diffTime = nextReset.getTime() - now.getTime();
  return Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 0);
}

/**
 * Calculate mint usage percentage
 */
export function getMintUsagePercentage(user: UserProfile): number {
  const tier = getTierById(user.tierId);
  if (tier.capsuleLimit === 0) return 0;
  return Math.min((user.mintsThisPeriod / tier.capsuleLimit) * 100, 100);
}

/**
 * Check if user needs tier upgrade prompt
 */
export function shouldPromptUpgrade(user: UserProfile): boolean {
  const tier = getTierById(user.tierId);
  const usagePercentage = getMintUsagePercentage(user);

  // Prompt upgrade if:
  // 1. On free tier and using > 80% of mints
  // 2. On any tier and consistently hitting limits
  return (
    (tier.id === "explorer" && usagePercentage > 80) || usagePercentage >= 100
  );
}

/**
 * Get tier access restrictions
 */
export function getTierRestrictions(user: UserProfile): {
  canAccessAnalytics: boolean;
  canAccessMarketplace: boolean;
  canUseAPI: boolean;
  canCustomizeBranding: boolean;
  supportLevel: "community" | "email" | "priority" | "dedicated";
} {
  const tier = getTierById(user.tierId);

  return {
    canAccessAnalytics: tier.id !== "explorer",
    canAccessMarketplace: ["creator", "sovereign"].includes(tier.id),
    canUseAPI: tier.id === "sovereign",
    canCustomizeBranding: tier.id === "sovereign",
    supportLevel:
      tier.id === "explorer"
        ? "community"
        : tier.id === "seeker"
          ? "email"
          : tier.id === "creator"
            ? "priority"
            : "dedicated",
  };
}

/**
 * Calculate yield with tier bonus
 */
export function calculateYieldWithBonus(
  baseYield: number,
  user: UserProfile,
): number {
  const tier = getTierById(user.tierId);
  return baseYield * (1 + tier.yieldBonus);
}

/**
 * Get upgrade urgency level
 */
export function getUpgradeUrgency(
  user: UserProfile,
): "none" | "low" | "medium" | "high" {
  const usagePercentage = getMintUsagePercentage(user);
  const tier = getTierById(user.tierId);

  if (tier.id === "sovereign") return "none";

  if (usagePercentage >= 100) return "high";
  if (usagePercentage >= 80) return "medium";
  if (usagePercentage >= 60) return "low";

  return "none";
}

/**
 * Check if user can donate capsule credits
 */
export function canDonate(user: UserProfile, donationAmount: number): boolean {
  const remainingMints = getRemainingMints(user);
  return remainingMints >= donationAmount;
}

/**
 * Validate tier transition
 */
export function canUpgradeToTier(
  currentTierId: string,
  targetTierId: string,
): boolean {
  const currentTier = getTierById(currentTierId);
  const targetTier = getTierById(targetTierId);

  // Can always upgrade to a higher-priced tier
  return targetTier.priceUSD >= currentTier.priceUSD;
}

/**
 * Get recommended tier based on usage
 */
export function getRecommendedTier(
  user: UserProfile,
  projectedUsage?: number,
): Tier {
  const currentTier = getTierById(user.tierId);
  const usage = projectedUsage || user.mintsThisPeriod;

  // Find the most cost-effective tier for the usage
  const suitableTiers = getAllTiers().filter(
    (tier) =>
      tier.capsuleLimit >= usage && tier.priceUSD >= currentTier.priceUSD,
  );

  return suitableTiers.length > 0 ? suitableTiers[0] : currentTier;
}

// Helper function to get all tiers (from roles.ts)
function getAllTiers(): Tier[] {
  const { getAllTiers } = require("./roles");
  return getAllTiers();
}
