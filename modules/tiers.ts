import pricingData from '../data/pricing.json';

export interface TierDetails {
  name: string;
  price: number;
  priceAnnual: number;
  gttRequired: number;
  features: string[];
  limits: {
    capsulesPerMonth: number;
    storageGB: number;
    apiCallsPerDay: number;
  };
  apy: number;
  color: string;
}

export type TierName = 'explorer' | 'seeker' | 'creator' | 'sovereign';

/**
 * Get tier details by tier name
 */
export function getTierDetails(tier: string): TierDetails {
  const tierKey = tier.toLowerCase() as TierName;
  return pricingData[tierKey] || pricingData.explorer;
}

/**
 * Get all available tiers
 */
export function getAllTiers(): Record<TierName, TierDetails> {
  return pricingData;
}

/**
 * Check if user has access to specific feature based on tier
 */
export function hasFeatureAccess(userTier: string, feature: string): boolean {
  const tier = getTierDetails(userTier);
  return tier.features.some(f => f.toLowerCase().includes(feature.toLowerCase()));
}

/**
 * Check if user is within usage limits
 */
export function checkUsageLimits(
  userTier: string,
  usage: {
    capsulesThisMonth?: number;
    storageUsedGB?: number;
    apiCallsToday?: number;
  }
): {
  isWithinLimits: boolean;
  exceeded: string[];
  warnings: string[];
} {
  const tier = getTierDetails(userTier);
  const exceeded: string[] = [];
  const warnings: string[] = [];

  // Check capsule limit
  if (usage.capsulesThisMonth && tier.limits.capsulesPerMonth > 0) {
    if (usage.capsulesThisMonth >= tier.limits.capsulesPerMonth) {
      exceeded.push('Monthly capsule limit reached');
    } else if (usage.capsulesThisMonth >= tier.limits.capsulesPerMonth * 0.8) {
      warnings.push('Approaching monthly capsule limit');
    }
  }

  // Check storage limit
  if (usage.storageUsedGB && usage.storageUsedGB >= tier.limits.storageGB) {
    exceeded.push('Storage limit reached');
  } else if (usage.storageUsedGB && usage.storageUsedGB >= tier.limits.storageGB * 0.8) {
    warnings.push('Approaching storage limit');
  }

  // Check API limit
  if (usage.apiCallsToday && usage.apiCallsToday >= tier.limits.apiCallsPerDay) {
    exceeded.push('Daily API limit reached');
  } else if (usage.apiCallsToday && usage.apiCallsToday >= tier.limits.apiCallsPerDay * 0.8) {
    warnings.push('Approaching daily API limit');
  }

  return {
    isWithinLimits: exceeded.length === 0,
    exceeded,
    warnings
  };
}

/**
 * Calculate upgrade benefits
 */
export function getUpgradeBenefits(currentTier: string, targetTier: string): {
  additionalFeatures: string[];
  increasedLimits: Record<string, string>;
  priceDifference: number;
  gttRequirement: number;
} {
  const current = getTierDetails(currentTier);
  const target = getTierDetails(targetTier);

  // Find additional features
  const additionalFeatures = target.features.filter(
    feature => !current.features.includes(feature)
  );

  // Calculate limit increases
  const increasedLimits: Record<string, string> = {};
  
  if (target.limits.capsulesPerMonth === -1) {
    increasedLimits.capsules = 'Unlimited';
  } else if (target.limits.capsulesPerMonth > current.limits.capsulesPerMonth) {
    increasedLimits.capsules = `${current.limits.capsulesPerMonth} → ${target.limits.capsulesPerMonth}`;
  }

  if (target.limits.storageGB > current.limits.storageGB) {
    increasedLimits.storage = `${current.limits.storageGB}GB → ${target.limits.storageGB}GB`;
  }

  if (target.limits.apiCallsPerDay > current.limits.apiCallsPerDay) {
    increasedLimits.apiCalls = `${current.limits.apiCallsPerDay} → ${target.limits.apiCallsPerDay}`;
  }

  return {
    additionalFeatures,
    increasedLimits,
    priceDifference: target.price - current.price,
    gttRequirement: target.gttRequired
  };
}

/**
 * Get recommended tier based on usage patterns
 */
export function getRecommendedTier(usage: {
  capsulesPerMonth: number;
  storageGB: number;
  apiCallsPerDay: number;
  needsMonetization?: boolean;
  needsCustomBranding?: boolean;
  isEnterprise?: boolean;
}): TierName {
  if (usage.isEnterprise || usage.capsulesPerMonth > 20) {
    return 'sovereign';
  }

  if (usage.needsMonetization || usage.needsCustomBranding || usage.capsulesPerMonth > 5) {
    return 'creator';
  }

  if (usage.capsulesPerMonth > 1 || usage.storageGB > 1 || usage.apiCallsPerDay > 100) {
    return 'seeker';
  }

  return 'explorer';
}

/**
 * Validate tier transition
 */
export function validateTierUpgrade(
  currentTier: string,
  targetTier: string,
  userGTTBalance: number
): {
  isValid: boolean;
  errors: string[];
  requirements: string[];
} {
  const target = getTierDetails(targetTier);
  const errors: string[] = [];
  const requirements: string[] = [];

  // Check GTT requirement
  if (userGTTBalance < target.gttRequired) {
    errors.push(`Insufficient GTT balance. Required: ${target.gttRequired}, Current: ${userGTTBalance}`);
  }

  // Add requirement info
  if (target.gttRequired > 0) {
    requirements.push(`Stake ${target.gttRequired} GTT tokens`);
  }

  if (target.price > 0) {
    requirements.push(`Monthly payment of $${target.price}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    requirements
  };
}