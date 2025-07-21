/**
 * GTT Yield and Reward Calculation Engine
 * Implements all yield logic according to whitepaper specifications
 * NO MOCK DATA - All calculations based on real parameters
 */

export interface UserTier {
  id: string;
  name: string;
  minStake: number;
  baseAPY: number;
  capsuleMultiplier: number;
  features: string[];
  price: number; // Monthly price in USD
}

export interface CapsuleMetrics {
  id: string;
  verificationScore: number; // 0-100
  truthRating: number; // 0-100  
  socialEngagement: number; // Views, shares, etc.
  stakedAmount: number; // GTT tokens staked
  lockPeriod: number; // Days
  category: string;
  createdAt: Date;
}

export interface YieldCalculation {
  baseYield: number;
  tierBonus: number;
  capsuleBonus: number;
  lockBonus: number;
  totalYield: number;
  projectedDaily: number;
  projectedWeekly: number;
  projectedMonthly: number;
  projectedAnnual: number;
}

// User tier definitions - MUST match Stripe pricing exactly
export const USER_TIERS: Record<string, UserTier> = {
  EXPLORER: {
    id: 'explorer',
    name: 'Explorer',
    minStake: 0,
    baseAPY: 5.0,
    capsuleMultiplier: 1.0,
    features: ['Basic capsule creation', 'Community verification', 'Standard yield'],
    price: 0
  },
  SEEKER: {
    id: 'seeker', 
    name: 'Truth Seeker',
    minStake: 1000,
    baseAPY: 8.0,
    capsuleMultiplier: 1.2,
    features: ['Priority verification', 'Enhanced yield', 'Analytics dashboard'],
    price: 29
  },
  CREATOR: {
    id: 'creator',
    name: 'Truth Creator', 
    minStake: 5000,
    baseAPY: 12.0,
    capsuleMultiplier: 1.5,
    features: ['Premium tools', 'AI assistance', 'Commercial licensing'],
    price: 99
  },
  SOVEREIGN: {
    id: 'sovereign',
    name: 'Truth Sovereign',
    minStake: 25000,
    baseAPY: 18.0,
    capsuleMultiplier: 2.0,
    features: ['White-label access', 'API access', 'Enterprise support'],
    price: 299
  }
};

/**
 * Calculate user's current tier based on their GTT stake
 */
export function calculateUserTier(stakedAmount: number, paidTier?: string): UserTier {
  // If user has paid tier, honor it if they meet minimum stake
  if (paidTier && USER_TIERS[paidTier.toUpperCase()]) {
    const tier = USER_TIERS[paidTier.toUpperCase()];
    if (stakedAmount >= tier.minStake) {
      return tier;
    }
  }

  // Otherwise, calculate based on stake amount
  const sortedTiers = Object.values(USER_TIERS).sort((a, b) => b.minStake - a.minStake);
  
  for (const tier of sortedTiers) {
    if (stakedAmount >= tier.minStake) {
      return tier;
    }
  }
  
  return USER_TIERS.EXPLORER; // Default to lowest tier
}

/**
 * Calculate lock period bonus (longer locks = higher yield)
 */
export function calculateLockBonus(lockPeriodDays: number): number {
  if (lockPeriodDays >= 365) return 0.50; // 50% bonus for 1+ year
  if (lockPeriodDays >= 180) return 0.30; // 30% bonus for 6+ months
  if (lockPeriodDays >= 90) return 0.15;  // 15% bonus for 3+ months
  if (lockPeriodDays >= 30) return 0.05;  // 5% bonus for 1+ month
  return 0; // No bonus for shorter locks
}

/**
 * Calculate capsule quality bonus based on verification metrics
 */
export function calculateCapsuleBonus(capsule: CapsuleMetrics): number {
  const verificationWeight = 0.4;
  const truthWeight = 0.4;
  const engagementWeight = 0.2;
  
  // Normalize engagement (log scale to prevent extreme values)
  const normalizedEngagement = Math.min(100, Math.log10(capsule.socialEngagement + 1) * 20);
  
  const qualityScore = (
    capsule.verificationScore * verificationWeight +
    capsule.truthRating * truthWeight +
    normalizedEngagement * engagementWeight
  );
  
  // Convert quality score to yield multiplier (0% to 100% bonus)
  return Math.min(1.0, qualityScore / 100);
}

/**
 * Calculate complete yield for a user's position
 */
export function calculateYield(
  stakedAmount: number,
  userTier: UserTier,
  capsules: CapsuleMetrics[] = [],
  lockPeriodDays: number = 0
): YieldCalculation {
  
  if (stakedAmount <= 0) {
    return {
      baseYield: 0,
      tierBonus: 0,
      capsuleBonus: 0,
      lockBonus: 0,
      totalYield: 0,
      projectedDaily: 0,
      projectedWeekly: 0,
      projectedMonthly: 0,
      projectedAnnual: 0
    };
  }

  // Base yield calculation
  const baseYield = stakedAmount * (userTier.baseAPY / 100);
  
  // Tier bonus (additional multiplier for higher tiers)
  const tierBonusRate = (userTier.capsuleMultiplier - 1.0);
  const tierBonus = baseYield * tierBonusRate;
  
  // Capsule bonus calculation
  let capsuleBonusTotal = 0;
  if (capsules.length > 0) {
    const avgCapsuleBonus = capsules.reduce((sum, capsule) => {
      return sum + calculateCapsuleBonus(capsule);
    }, 0) / capsules.length;
    
    capsuleBonusTotal = baseYield * avgCapsuleBonus;
  }
  
  // Lock period bonus
  const lockBonusRate = calculateLockBonus(lockPeriodDays);
  const lockBonus = (baseYield + tierBonus + capsuleBonusTotal) * lockBonusRate;
  
  // Total annual yield
  const totalYield = baseYield + tierBonus + capsuleBonusTotal + lockBonus;
  
  return {
    baseYield,
    tierBonus,
    capsuleBonus: capsuleBonusTotal,
    lockBonus,
    totalYield,
    projectedDaily: totalYield / 365,
    projectedWeekly: totalYield / 52,
    projectedMonthly: totalYield / 12,
    projectedAnnual: totalYield
  };
}

/**
 * Validate yield calculation parameters
 */
export function validateYieldParameters(
  stakedAmount: number,
  lockPeriod: number,
  capsules: CapsuleMetrics[]
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (stakedAmount < 0) {
    errors.push('Staked amount cannot be negative');
  }
  
  if (lockPeriod < 0) {
    errors.push('Lock period cannot be negative');
  }
  
  if (lockPeriod > 1825) { // 5 years max
    errors.push('Lock period cannot exceed 5 years');
  }
  
  for (const capsule of capsules) {
    if (capsule.verificationScore < 0 || capsule.verificationScore > 100) {
      errors.push(`Invalid verification score for capsule ${capsule.id}`);
    }
    
    if (capsule.truthRating < 0 || capsule.truthRating > 100) {
      errors.push(`Invalid truth rating for capsule ${capsule.id}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Calculate minimum stake required for a specific tier
 */
export function getMinimumStakeForTier(tierName: string): number {
  const tier = USER_TIERS[tierName.toUpperCase()];
  return tier ? tier.minStake : 0;
}

/**
 * Get all available tiers with pricing
 */
export function getAllTiers(): UserTier[] {
  return Object.values(USER_TIERS);
}

/**
 * Calculate break-even time for tier upgrade
 */
export function calculateBreakEvenTime(
  currentStake: number,
  currentTier: UserTier,
  targetTier: UserTier,
  additionalStakeRequired: number
): number {
  const currentYield = calculateYield(currentStake, currentTier);
  const targetYield = calculateYield(currentStake + additionalStakeRequired, targetTier);
  
  const additionalYieldPerMonth = (targetYield.totalYield - currentYield.totalYield) / 12;
  const monthlyCost = targetTier.price - currentTier.price;
  
  if (additionalYieldPerMonth <= 0) return Infinity;
  
  // Time in months to break even on subscription cost
  return monthlyCost / additionalYieldPerMonth;
}

/**
 * Export functions for testing
 */
export const YieldCalculations = {
  calculateUserTier,
  calculateLockBonus,
  calculateCapsuleBonus,
  calculateYield,
  validateYieldParameters,
  getMinimumStakeForTier,
  getAllTiers,
  calculateBreakEvenTime
};