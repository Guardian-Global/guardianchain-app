/**
 * GTT Token Calculation Engine
 * Handles truth yield calculations, reward distributions, and token economics
 */

export interface CapsuleMetrics {
  griefScore: number;
  viewCount: number;
  shareCount: number;
  verificationCount: number;
  timeActive: number; // hours since creation
  sealStatus: boolean;
  creatorReputation: number;
}

export interface GTTReward {
  baseReward: number;
  griefMultiplier: number;
  engagementBonus: number;
  sealBonus: number;
  reputationBonus: number;
  totalGTT: number;
}

/**
 * Core GTT calculation function based on grief score and engagement
 */
export function calculateGTT(griefScore: number, replays: number): number {
  const multiplier = 0.1;
  return parseFloat((griefScore * replays * multiplier).toFixed(2));
}

/**
 * Advanced GTT reward calculation with multiple factors
 */
export function calculateAdvancedGTT(metrics: CapsuleMetrics): GTTReward {
  // Base reward from grief score (0-100 maps to 0-50 GTT base)
  const baseReward = (metrics.griefScore / 100) * 50;

  // Grief score multiplier (higher grief = higher multiplier)
  const griefMultiplier = 1 + (metrics.griefScore / 100) * 2; // 1x to 3x

  // Engagement bonus from views and shares
  const viewBonus = Math.min(metrics.viewCount * 0.01, 10); // Max 10 GTT from views
  const shareBonus = Math.min(metrics.shareCount * 0.5, 20); // Max 20 GTT from shares
  const verificationBonus = metrics.verificationCount * 2; // 2 GTT per verification
  const engagementBonus = viewBonus + shareBonus + verificationBonus;

  // Seal bonus (20% bonus for sealed capsules)
  const sealBonus = metrics.sealStatus ? baseReward * 0.2 : 0;

  // Creator reputation bonus (0-10% based on reputation score)
  const reputationBonus = baseReward * (metrics.creatorReputation / 1000);

  // Calculate total with diminishing returns for very high values
  const preTotal =
    baseReward * griefMultiplier +
    engagementBonus +
    sealBonus +
    reputationBonus;
  const totalGTT = Math.min(preTotal, 1000); // Cap at 1000 GTT per capsule

  return {
    baseReward: parseFloat(baseReward.toFixed(2)),
    griefMultiplier: parseFloat(griefMultiplier.toFixed(2)),
    engagementBonus: parseFloat(engagementBonus.toFixed(2)),
    sealBonus: parseFloat(sealBonus.toFixed(2)),
    reputationBonus: parseFloat(reputationBonus.toFixed(2)),
    totalGTT: parseFloat(totalGTT.toFixed(2)),
  };
}

/**
 * Calculate Truth Yield based on capsule performance over time
 */
export function calculateTruthYield(metrics: CapsuleMetrics): number {
  const baseYield = metrics.griefScore * 0.8; // Base yield from grief score
  const engagementYield = (metrics.viewCount + metrics.shareCount * 3) * 0.1;
  const timeDecay = Math.max(0.5, 1 - metrics.timeActive / (24 * 30)); // Decay over 30 days
  const sealBonus = metrics.sealStatus ? 1.3 : 1.0; // 30% bonus for sealed content

  const totalYield = (baseYield + engagementYield) * timeDecay * sealBonus;
  return parseFloat(Math.max(0, totalYield).toFixed(2));
}

/**
 * Calculate staking rewards for GTT holders
 */
export function calculateStakingRewards(
  stakedAmount: number,
  stakingDuration: number, // in days
  totalStaked: number,
  rewardPool: number
): number {
  const annualRate = 0.08; // 8% APY base rate
  const dailyRate = annualRate / 365;

  // Your share of the total staked amount
  const stakeShare = stakedAmount / totalStaked;

  // Your portion of the reward pool
  const poolReward = rewardPool * stakeShare;

  // Time-based staking reward
  const stakingReward = stakedAmount * dailyRate * stakingDuration;

  return parseFloat((poolReward + stakingReward).toFixed(2));
}

/**
 * Calculate DAO voting power based on GTT holdings and reputation
 */
export function calculateVotingPower(
  gttBalance: number,
  reputation: number,
  stakingBonus: number = 0
): number {
  const baseVotingPower = Math.sqrt(gttBalance); // Square root to prevent whale dominance
  const reputationMultiplier = 1 + reputation / 1000; // Max 2x multiplier
  const stakingMultiplier = 1 + stakingBonus; // Bonus for staked tokens

  return parseFloat(
    (baseVotingPower * reputationMultiplier * stakingMultiplier).toFixed(2)
  );
}

/**
 * Calculate creator rewards for successful capsules
 */
export function calculateCreatorRewards(
  capsuleMetrics: CapsuleMetrics[]
): number {
  let totalRewards = 0;

  capsuleMetrics.forEach((metrics) => {
    const reward = calculateAdvancedGTT(metrics);
    totalRewards += reward.totalGTT;
  });

  // Apply creator multiplier (creators get 10% bonus)
  return parseFloat((totalRewards * 1.1).toFixed(2));
}

/**
 * Calculate network fees for various operations
 */
export function calculateNetworkFees(
  operation: string,
  amount: number
): number {
  const feeRates = {
    mint: 0.001, // 0.1% fee for minting
    transfer: 0.005, // 0.5% fee for transfers
    claim: 0.002, // 0.2% fee for claiming rewards
    stake: 0.001, // 0.1% fee for staking
    vote: 0, // No fee for voting
  };

  const rate = feeRates[operation as keyof typeof feeRates] || 0.005;
  return parseFloat((amount * rate).toFixed(2));
}

/**
 * Simulate yield over time for projections
 */
export function simulateYieldProjection(
  initialMetrics: CapsuleMetrics,
  daysToProject: number
): { day: number; cumulativeYield: number; dailyYield: number }[] {
  const projection = [];
  let cumulativeYield = 0;

  for (let day = 1; day <= daysToProject; day++) {
    // Simulate growth in engagement over time
    const growthFactor = 1 + day * 0.05; // 5% daily growth initially
    const decayFactor = Math.exp(-day / 30); // Exponential decay over 30 days

    const simulatedMetrics: CapsuleMetrics = {
      ...initialMetrics,
      viewCount: Math.floor(
        initialMetrics.viewCount * growthFactor * decayFactor
      ),
      shareCount: Math.floor(
        initialMetrics.shareCount * growthFactor * decayFactor
      ),
      timeActive: day * 24, // Convert days to hours
    };

    const dailyYield = calculateTruthYield(simulatedMetrics) / 30; // Spread over 30 days
    cumulativeYield += dailyYield;

    projection.push({
      day,
      cumulativeYield: parseFloat(cumulativeYield.toFixed(2)),
      dailyYield: parseFloat(dailyYield.toFixed(2)),
    });
  }

  return projection;
}

/**
 * Get GTT tier based on total holdings
 */
export function getGTTTier(gttBalance: number): {
  tier: string;
  name: string;
  benefits: string[];
  nextTierThreshold?: number;
} {
  if (gttBalance >= 10000) {
    return {
      tier: "Legendary",
      name: "Truth Guardian",
      benefits: [
        "50% bonus on all rewards",
        "Priority verification queue",
        "Exclusive governance proposals",
        "Custom capsule themes",
        "Direct creator support",
      ],
    };
  } else if (gttBalance >= 5000) {
    return {
      tier: "Epic",
      name: "Truth Keeper",
      benefits: [
        "30% bonus on all rewards",
        "Fast-track verification",
        "Enhanced governance weight",
        "Premium analytics access",
      ],
      nextTierThreshold: 10000,
    };
  } else if (gttBalance >= 1000) {
    return {
      tier: "Rare",
      name: "Truth Seeker",
      benefits: [
        "20% bonus on all rewards",
        "Priority support",
        "Advanced analytics",
        "Beta feature access",
      ],
      nextTierThreshold: 5000,
    };
  } else if (gttBalance >= 100) {
    return {
      tier: "Uncommon",
      name: "Truth Explorer",
      benefits: [
        "10% bonus on all rewards",
        "Basic analytics access",
        "Community events access",
      ],
      nextTierThreshold: 1000,
    };
  } else {
    return {
      tier: "Common",
      name: "Truth Novice",
      benefits: ["Standard rewards", "Basic platform access"],
      nextTierThreshold: 100,
    };
  }
}
