// Central role/tier logic for GuardianChain user access, pricing, mints, and privileges

export interface Tier {
  id: string;
  name: string;
  priceUSD: number;
  capsuleLimit: number;
  yieldBonus: number;
  description: string;
  badge: string;
  features: string[];
  color: string;
}

export const TIERS: Tier[] = [
  {
    id: "explorer",
    name: "Explorer",
    priceUSD: 0,
    capsuleLimit: 3,
    yieldBonus: 0,
    description:
      "Perfect for newcomers. Mint up to 3 truth capsules per month, completely free.",
    badge: "🌱",
    features: [
      "3 capsule mints per month",
      "Basic verification access",
      "Community support",
      "Standard yield rate",
    ],
    color: "#10b981",
  },
  {
    id: "seeker",
    name: "Seeker",
    priceUSD: 9.99,
    capsuleLimit: 15,
    yieldBonus: 0.05,
    description:
      "For active truth seekers. Enhanced capacity with yield boost and priority support.",
    badge: "🔍",
    features: [
      "15 capsule mints per month",
      "5% yield bonus",
      "Priority verification queue",
      "Basic analytics dashboard",
      "Email support",
    ],
    color: "#3b82f6",
  },
  {
    id: "creator",
    name: "Creator",
    priceUSD: 24.99,
    capsuleLimit: 50,
    yieldBonus: 0.1,
    description:
      "Built for content creators and active community members with advanced features.",
    badge: "🎨",
    features: [
      "50 capsule mints per month",
      "10% yield bonus",
      "Advanced analytics",
      "Custom verification seals",
      "Priority support",
      "Creator marketplace access",
    ],
    color: "#8b5cf6",
  },
  {
    id: "sovereign",
    name: "Sovereign",
    priceUSD: 49.99,
    capsuleLimit: 200,
    yieldBonus: 0.25,
    description:
      "Maximum tier for institutions, DAOs, and power users with unlimited potential.",
    badge: "👑",
    features: [
      "200 capsule mints per month",
      "25% yield bonus",
      "Full analytics suite",
      "Custom branding options",
      "Dedicated support",
      "Early feature access",
      "API access",
      "Bulk operations",
    ],
    color: "#f59e0b",
  },
];

/**
 * Get tier configuration by ID
 */
export function getTierById(id: string): Tier {
  return TIERS.find((t) => t.id === id) || TIERS[0];
}

/**
 * Get all available tiers
 */
export function getAllTiers(): Tier[] {
  return TIERS;
}

/**
 * Check if a tier exists
 */
export function isValidTier(id: string): boolean {
  return TIERS.some((t) => t.id === id);
}

/**
 * Get the next tier in progression
 */
export function getNextTier(currentTierId: string): Tier | null {
  const currentIndex = TIERS.findIndex((t) => t.id === currentTierId);
  if (currentIndex === -1 || currentIndex === TIERS.length - 1) {
    return null;
  }
  return TIERS[currentIndex + 1];
}

/**
 * Calculate upgrade savings (annual vs monthly)
 */
export function calculateAnnualSavings(tier: Tier): number {
  if (tier.priceUSD === 0) return 0;
  const monthlyTotal = tier.priceUSD * 12;
  const annualPrice = tier.priceUSD * 10; // 2 months free
  return monthlyTotal - annualPrice;
}

/**
 * Get tier comparison data
 */
export function getTierComparison() {
  return TIERS.map((tier) => ({
    ...tier,
    annualSavings: calculateAnnualSavings(tier),
    monthlyPrice: tier.priceUSD,
    annualPrice: tier.priceUSD === 0 ? 0 : tier.priceUSD * 10,
  }));
}

/**
 * Check if user can access a feature based on tier
 */
export function canAccessFeature(
  userTierId: string,
  requiredTierId: string,
): boolean {
  const userTierIndex = TIERS.findIndex((t) => t.id === userTierId);
  const requiredTierIndex = TIERS.findIndex((t) => t.id === requiredTierId);

  if (userTierIndex === -1 || requiredTierIndex === -1) {
    return false;
  }

  return userTierIndex >= requiredTierIndex;
}

/**
 * Get tier benefits summary
 */
export function getTierBenefits(tierId: string) {
  const tier = getTierById(tierId);
  return {
    capsuleLimit: tier.capsuleLimit,
    yieldBonus: tier.yieldBonus,
    monthlyValue: tier.capsuleLimit * 0.5, // Estimate $0.50 per capsule value
    totalValue: tier.capsuleLimit * 0.5 + tier.yieldBonus * 100,
    roi:
      tier.priceUSD > 0 ? ((tier.capsuleLimit * 0.5) / tier.priceUSD) * 100 : 0,
  };
}
