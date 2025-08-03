/**
 * GTT Yield Calculation Utilities for GuardianChain Capsules
 */

export interface YieldData {
  currentYield: number;
  dailyRate: number;
  apy: number;
  daysActive: number;
  projectedYearlyEarnings: number;
}

/**
 * Calculate GTT yield for a capsule based on creation date and other factors
 */
export function calculateCapsuleYield(
  createdAt: string,
  baseRate: number = 0.12, // 12% APY default
  truthScore?: number,
  hasVeritasSeal?: boolean
): YieldData {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const daysActive = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  // Apply multipliers based on capsule properties
  let adjustedRate = baseRate;
  
  // Truth score bonus (up to 50% bonus for perfect score)
  if (truthScore) {
    const scoreBonus = (truthScore / 100) * 0.5;
    adjustedRate += scoreBonus;
  }
  
  // Veritas seal bonus (25% bonus)
  if (hasVeritasSeal) {
    adjustedRate += 0.25;
  }
  
  // Calculate yields
  const dailyRate = adjustedRate / 365;
  const currentYield = dailyRate * daysActive;
  const projectedYearlyEarnings = adjustedRate;
  
  return {
    currentYield,
    dailyRate,
    apy: adjustedRate,
    daysActive,
    projectedYearlyEarnings,
  };
}

/**
 * Format yield amount for display
 */
export function formatYieldAmount(amount: number, decimals: number = 4): string {
  return `${amount.toFixed(decimals)} GTT`;
}

/**
 * Format APY percentage for display
 */
export function formatAPY(apy: number): string {
  return `${(apy * 100).toFixed(1)}%`;
}

/**
 * Calculate time until next yield milestone
 */
export function getNextMilestone(daysActive: number): {
  nextMilestone: number;
  daysUntil: number;
  milestoneType: string;
} {
  const milestones = [
    { days: 7, type: "Weekly" },
    { days: 30, type: "Monthly" },
    { days: 90, type: "Quarterly" },
    { days: 365, type: "Yearly" },
  ];
  
  for (const milestone of milestones) {
    if (daysActive < milestone.days) {
      return {
        nextMilestone: milestone.days,
        daysUntil: milestone.days - daysActive,
        milestoneType: milestone.type,
      };
    }
  }
  
  // Beyond yearly milestone, calculate next year
  const nextYear = Math.ceil(daysActive / 365) * 365;
  return {
    nextMilestone: nextYear,
    daysUntil: nextYear - daysActive,
    milestoneType: "Anniversary",
  };
}

/**
 * Calculate yield boost from staking GTT
 */
export function calculateStakingBoost(stakedAmount: number): number {
  // Tiered staking bonuses
  if (stakedAmount >= 100000) return 0.5; // 50% bonus for 100k+ GTT
  if (stakedAmount >= 50000) return 0.3;  // 30% bonus for 50k+ GTT
  if (stakedAmount >= 10000) return 0.2;  // 20% bonus for 10k+ GTT
  if (stakedAmount >= 1000) return 0.1;   // 10% bonus for 1k+ GTT
  return 0; // No bonus below 1k GTT
}

/**
 * Calculate grief score impact on yield
 */
export function calculateGriefScoreMultiplier(griefScore: number): number {
  // Higher grief scores get higher yield multipliers
  // Scale: 0-100 grief score maps to 1.0-2.0x multiplier
  return 1.0 + (griefScore / 100);
}

/**
 * Get yield tier based on daily earnings
 */
export function getYieldTier(dailyYield: number): {
  tier: string;
  color: string;
  description: string;
} {
  if (dailyYield >= 10) {
    return {
      tier: "Legendary",
      color: "text-purple-600",
      description: "Elite truth guardian",
    };
  } else if (dailyYield >= 5) {
    return {
      tier: "Epic",
      color: "text-blue-600",
      description: "Master capsule creator",
    };
  } else if (dailyYield >= 1) {
    return {
      tier: "Rare",
      color: "text-green-600",
      description: "Skilled truth seeker",
    };
  } else if (dailyYield >= 0.1) {
    return {
      tier: "Common",
      color: "text-gray-600",
      description: "Growing guardian",
    };
  } else {
    return {
      tier: "Novice",
      color: "text-gray-400",
      description: "New to the protocol",
    };
  }
}

/**
 * Calculate compound interest for long-term projections
 */
export function calculateCompoundYield(
  principal: number,
  rate: number,
  days: number,
  compoundFrequency: number = 365 // Daily compounding
): number {
  const n = compoundFrequency;
  const t = days / 365;
  return principal * Math.pow(1 + rate / n, n * t) - principal;
}