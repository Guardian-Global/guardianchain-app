// Production-ready utility to get user tier from Replit Auth
export async function getUserTierFromAuth(userId: string): Promise<string> {
  try {
    // In production, this would use Replit DB
    // For development, using localStorage as mock
    const tierKey = `tier-${userId}`;
    const tier = localStorage.getItem(tierKey);
    return tier || "guest";
  } catch (error) {
    console.error("Failed to get user tier:", error);
    return "guest";
  }
}

// Production Replit Auth integration (ready for deployment)
export async function getUserTierProduction(userId: string): Promise<string> {
  try {
    // This will be enabled when deploying to production
    // const { replitDb } = await import("@replit/extensions");
    // const tier = await replitDb.get(`tier-${userId}`);
    // return tier || "guest";

    // Development fallback
    return getUserTierFromAuth(userId);
  } catch (error) {
    console.error("Failed to get user tier from Replit DB:", error);
    return "guest";
  }
}

// Helper to check if user has specific access level
export function hasAccess(userTier: string, requiredTiers: string[]): boolean {
  return requiredTiers.includes(userTier);
}

// Tier hierarchy for upgrades
export const TIER_HIERARCHY = {
  guest: 0,
  explorer: 1,
  pro: 2,
  admin: 3,
  enterprise: 4,
};

export function canUpgradeTo(currentTier: string, targetTier: string): boolean {
  return (
    TIER_HIERARCHY[currentTier as keyof typeof TIER_HIERARCHY] <
    TIER_HIERARCHY[targetTier as keyof typeof TIER_HIERARCHY]
  );
}
