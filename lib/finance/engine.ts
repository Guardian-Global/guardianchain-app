// GTT Yield and Reward Calculation Engine

export interface YieldCalculation {
  yieldEarned: number;
  rate: number;
  tier: string;
  amount: number;
  duration: number;
}

export interface CapsuleReward {
  tier: string;
  gttBonus: number;
  features: string[];
  stakingMultiplier: number;
}

// Tier-based APY rates for GTT staking
const TIER_APY_RATES = {
  explorer: 0.05,    // 5% APY
  seeker: 0.08,      // 8% APY  
  creator: 0.12,     // 12% APY
  sovereign: 0.25    // 25% APY
} as const;

// GTT reward multipliers by tier
const TIER_MULTIPLIERS = {
  explorer: 1.0,
  seeker: 1.5,
  creator: 2.0,
  sovereign: 3.0
} as const;

// Base GTT rewards for capsule creation
const BASE_CAPSULE_REWARD = 10; // 10 GTT base reward

/**
 * Calculate yield earnings based on tier, amount, and duration
 */
export function calculateYield({
  tier, 
  amount, 
  duration // duration in months
}: {
  tier: string;
  amount: number;
  duration: number;
}): YieldCalculation {
  const tierKey = tier.toLowerCase() as keyof typeof TIER_APY_RATES;
  const rate = TIER_APY_RATES[tierKey] || TIER_APY_RATES.explorer;
  
  // Calculate annualized yield
  const yieldEarned = amount * rate * (duration / 12);
  
  return {
    yieldEarned,
    rate,
    tier,
    amount,
    duration
  };
}

/**
 * Calculate capsule creation rewards based on staking amount
 */
export function calculateCapsuleRewards(amountStaked: number): CapsuleReward {
  if (amountStaked >= 10000) {
    return {
      tier: 'Sovereign Capsule',
      gttBonus: BASE_CAPSULE_REWARD * TIER_MULTIPLIERS.sovereign,
      features: ['Premium verification', 'Enhanced visibility', 'Revenue sharing'],
      stakingMultiplier: TIER_MULTIPLIERS.sovereign
    };
  }
  
  if (amountStaked >= 1000) {
    return {
      tier: 'Creator Capsule', 
      gttBonus: BASE_CAPSULE_REWARD * TIER_MULTIPLIERS.creator,
      features: ['Advanced verification', 'Creator tools', 'Monetization'],
      stakingMultiplier: TIER_MULTIPLIERS.creator
    };
  }
  
  if (amountStaked >= 100) {
    return {
      tier: 'Seeker Capsule',
      gttBonus: BASE_CAPSULE_REWARD * TIER_MULTIPLIERS.seeker, 
      features: ['Enhanced verification', 'Community features'],
      stakingMultiplier: TIER_MULTIPLIERS.seeker
    };
  }
  
  return {
    tier: 'Explorer Capsule',
    gttBonus: BASE_CAPSULE_REWARD * TIER_MULTIPLIERS.explorer,
    features: ['Basic verification', 'Community access'],
    stakingMultiplier: TIER_MULTIPLIERS.explorer
  };
}

/**
 * Calculate total yield for a given period with compounding
 */
export function calculateCompoundYield({
  principal,
  rate,
  compoundingFrequency = 12, // Monthly compounding
  timeInYears
}: {
  principal: number;
  rate: number;
  compoundingFrequency?: number;
  timeInYears: number;
}): number {
  return principal * Math.pow(1 + rate / compoundingFrequency, compoundingFrequency * timeInYears);
}

/**
 * Calculate projected earnings for display in UI
 */
export function calculateProjectedEarnings(
  stakedAmount: number,
  tier: string,
  timeHorizon: '1month' | '3months' | '6months' | '1year'
): {
  period: string;
  yieldEarnings: number;
  capsuleRewards: number;
  totalEarnings: number;
  rate: number;
} {
  const durations = {
    '1month': 1,
    '3months': 3, 
    '6months': 6,
    '1year': 12
  };
  
  const duration = durations[timeHorizon];
  const yieldCalc = calculateYield({ tier, amount: stakedAmount, duration });
  const capsuleReward = calculateCapsuleRewards(stakedAmount);
  
  // Assume user creates 1 capsule per month on average
  const expectedCapsules = duration;
  const capsuleRewards = capsuleReward.gttBonus * expectedCapsules;
  
  return {
    period: timeHorizon,
    yieldEarnings: yieldCalc.yieldEarned,
    capsuleRewards,
    totalEarnings: yieldCalc.yieldEarned + capsuleRewards,
    rate: yieldCalc.rate
  };
}

/**
 * Validate yield calculation parameters
 */
export function validateYieldParams({
  tier,
  amount, 
  duration
}: {
  tier: string;
  amount: number;
  duration: number;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (amount <= 0) {
    errors.push("Staking amount must be greater than 0");
  }
  
  if (duration <= 0) {
    errors.push("Duration must be greater than 0");
  }
  
  if (!Object.keys(TIER_APY_RATES).includes(tier.toLowerCase())) {
    errors.push("Invalid tier specified");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Get tier information for display
 */
export function getTierInfo(tier: string) {
  const tierKey = tier.toLowerCase() as keyof typeof TIER_APY_RATES;
  
  return {
    tier: tierKey,
    apy: TIER_APY_RATES[tierKey] || TIER_APY_RATES.explorer,
    multiplier: TIER_MULTIPLIERS[tierKey] || TIER_MULTIPLIERS.explorer,
    minStaking: tierKey === 'sovereign' ? 10000 :
                tierKey === 'creator' ? 1000 :
                tierKey === 'seeker' ? 100 : 0
  };
}