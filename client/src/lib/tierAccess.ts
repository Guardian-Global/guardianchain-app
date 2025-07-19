export interface TierConfig {
  name: string;
  priceUSD: number;
  mintsPerMonth: number;
  yieldBonus: number;
  canDonate: boolean;
  features: string[];
  priority: 'low' | 'medium' | 'high' | 'premium';
}

export const TIERS: TierConfig[] = [
  {
    name: "Starter (Free)",
    priceUSD: 0,
    mintsPerMonth: 2,
    yieldBonus: 0,
    canDonate: false,
    features: [
      "2 capsule mints per month",
      "Basic yield tracking",
      "Community access",
      "Standard support"
    ],
    priority: 'low'
  },
  {
    name: "Creator",
    priceUSD: 10,
    mintsPerMonth: 15,
    yieldBonus: 0.05,
    canDonate: true,
    features: [
      "15 capsule mints per month",
      "5% yield bonus",
      "Donation capabilities",
      "Priority capsule processing",
      "Advanced analytics",
      "Email support"
    ],
    priority: 'medium'
  },
  {
    name: "Guardian",
    priceUSD: 25,
    mintsPerMonth: 50,
    yieldBonus: 0.1,
    canDonate: true,
    features: [
      "50 capsule mints per month",
      "10% yield bonus",
      "Premium donation features",
      "Fast-track verification",
      "Custom capsule types",
      "Priority support",
      "API access"
    ],
    priority: 'high'
  },
  {
    name: "Institutional",
    priceUSD: 100,
    mintsPerMonth: 250,
    yieldBonus: 0.25,
    canDonate: true,
    features: [
      "250 capsule mints per month",
      "25% yield bonus",
      "Enterprise donation tools",
      "Instant verification",
      "All capsule types",
      "Dedicated support",
      "Full API access",
      "Custom integrations",
      "Compliance reporting"
    ],
    priority: 'premium'
  },
];

export interface User {
  id: string;
  tier: string;
  mintsThisMonth: number;
  maxMintsPerMonth?: number;
  yieldBonus?: number;
  subscriptionStatus?: 'active' | 'inactive' | 'pending';
  subscriptionExpiry?: string;
}

export function getTier(user: User): TierConfig {
  const userTier = TIERS.find(t => t.name === user.tier);
  return userTier || TIERS[0]; // Default to Starter if tier not found
}

export function canMint(user: User): boolean {
  const tier = getTier(user);
  return user.mintsThisMonth < tier.mintsPerMonth;
}

export function getRemainingMints(user: User): number {
  const tier = getTier(user);
  return Math.max(0, tier.mintsPerMonth - user.mintsThisMonth);
}

export function getYieldBonus(user: User): number {
  const tier = getTier(user);
  return tier.yieldBonus;
}

export function canDonate(user: User): boolean {
  const tier = getTier(user);
  return tier.canDonate;
}

export function getTierUpgradeBenefits(currentTier: string, targetTier: string) {
  const current = TIERS.find(t => t.name === currentTier);
  const target = TIERS.find(t => t.name === targetTier);
  
  if (!current || !target) return [];
  
  return {
    additionalMints: target.mintsPerMonth - current.mintsPerMonth,
    yieldBonusIncrease: target.yieldBonus - current.yieldBonus,
    newFeatures: target.features.filter(f => !current.features.includes(f)),
    priceDifference: target.priceUSD - current.priceUSD
  };
}

export function isEligibleForTier(user: User, tierName: string): boolean {
  // In production, this would check payment status, compliance, etc.
  const tier = TIERS.find(t => t.name === tierName);
  if (!tier) return false;
  
  // For now, just check if user can afford the tier (mock logic)
  return true;
}

export function calculateMonthlyCost(tierName: string): number {
  const tier = TIERS.find(t => t.name === tierName);
  return tier?.priceUSD || 0;
}

export function getNextTier(currentTier: string): TierConfig | null {
  const currentIndex = TIERS.findIndex(t => t.name === currentTier);
  if (currentIndex === -1 || currentIndex === TIERS.length - 1) return null;
  
  return TIERS[currentIndex + 1];
}

export function getTierByPrice(priceUSD: number): TierConfig | null {
  return TIERS.find(t => t.priceUSD === priceUSD) || null;
}

export function getUserTierStatus(user: User) {
  const tier = getTier(user);
  const remainingMints = getRemainingMints(user);
  const nextTier = getNextTier(user.tier);
  
  return {
    currentTier: tier,
    remainingMints,
    yieldBonus: tier.yieldBonus,
    canDonate: tier.canDonate,
    nextTier,
    subscriptionStatus: user.subscriptionStatus || 'inactive',
    priority: tier.priority
  };
}

// Tier validation and enforcement
export function validateTierAccess(user: User, action: string): boolean {
  const tier = getTier(user);
  
  switch (action) {
    case 'mint_capsule':
      return canMint(user);
    case 'donate_capsules':
      return canDonate(user);
    case 'api_access':
      return tier.name === 'Guardian' || tier.name === 'Institutional';
    case 'priority_support':
      return tier.priority === 'high' || tier.priority === 'premium';
    case 'custom_integrations':
      return tier.name === 'Institutional';
    default:
      return true;
  }
}