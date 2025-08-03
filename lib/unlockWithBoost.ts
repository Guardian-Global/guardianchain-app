/**
 * Grief Score Boost System for GuardianChain
 * Provides early unlock capabilities based on grief score and blockchain network
 */

export interface UnlockBoostParams {
  griefScore: number;
  chainId: number;
  unlockTimestamp: number;
  userTier?: 'EXPLORER' | 'SEEKER' | 'CREATOR' | 'SOVEREIGN';
  premiumBonus?: boolean;
}

export interface UnlockBoostResult {
  canUnlock: boolean;
  timeReduction: number;
  boostType: string;
  remainingTime: number;
  eligibleBoosts: string[];
}

/**
 * Chain-specific configurations for unlock boosts
 */
const CHAIN_CONFIGS = {
  8453: { // Base Network
    name: 'Base',
    baseGrace: 5 * 60 * 1000, // 5 minutes base grace period
    griefMultiplier: 1.5, // Enhanced grief bonuses on Base
    networkBonus: 2 * 60 * 1000 // 2 minute network bonus
  },
  137: { // Polygon
    name: 'Polygon',
    baseGrace: 3 * 60 * 1000, // 3 minutes base grace period
    griefMultiplier: 1.0, // Standard grief bonuses
    networkBonus: 0 // No additional network bonus
  },
  1: { // Ethereum Mainnet
    name: 'Ethereum',
    baseGrace: 10 * 60 * 1000, // 10 minutes base grace period (higher fees = more grace)
    griefMultiplier: 2.0, // Enhanced grief bonuses for premium network
    networkBonus: 5 * 60 * 1000 // 5 minute network bonus
  }
};

/**
 * Tier-based unlock multipliers
 */
const TIER_MULTIPLIERS = {
  'EXPLORER': 1.0,
  'SEEKER': 1.2,
  'CREATOR': 1.5,
  'SOVEREIGN': 2.0
};

/**
 * Calculate grief score bonus time reduction
 * @param griefScore - User's grief score (0-10)
 * @param chainMultiplier - Chain-specific multiplier
 * @returns Time reduction in milliseconds
 */
function calculateGriefBonus(griefScore: number, chainMultiplier: number): number {
  if (griefScore < 5) return 0;
  
  // Progressive bonus system
  let bonus = 0;
  
  if (griefScore >= 5) bonus += 5 * 60 * 1000; // 5 min for grief 5+
  if (griefScore >= 7) bonus += 10 * 60 * 1000; // +10 min for grief 7+
  if (griefScore >= 8) bonus += 15 * 60 * 1000; // +15 min for grief 8+
  if (griefScore >= 9) bonus += 30 * 60 * 1000; // +30 min for grief 9+
  if (griefScore >= 10) bonus += 60 * 60 * 1000; // +60 min for grief 10
  
  return Math.floor(bonus * chainMultiplier);
}

/**
 * Check if capsule can be unlocked with boost system
 * @param params - Unlock boost parameters
 * @returns UnlockBoostResult
 */
export function canUnlockWithBoost(params: UnlockBoostParams): UnlockBoostResult {
  const { griefScore, chainId, unlockTimestamp, userTier = 'EXPLORER', premiumBonus = false } = params;
  const now = Date.now();
  
  // Get chain configuration
  const chainConfig = CHAIN_CONFIGS[chainId as keyof typeof CHAIN_CONFIGS] || CHAIN_CONFIGS[137];
  
  // Calculate various bonuses
  const griefBonus = calculateGriefBonus(griefScore, chainConfig.griefMultiplier);
  const tierMultiplier = TIER_MULTIPLIERS[userTier];
  const tierBonus = Math.floor(griefBonus * (tierMultiplier - 1));
  const networkBonus = chainConfig.networkBonus;
  const premiumBonusTime = premiumBonus ? 30 * 60 * 1000 : 0; // 30 min premium bonus
  
  // Calculate total time reduction
  const totalReduction = chainConfig.baseGrace + griefBonus + tierBonus + networkBonus + premiumBonusTime;
  const adjustedUnlockTime = unlockTimestamp - totalReduction;
  
  // Determine eligible boosts
  const eligibleBoosts: string[] = [];
  if (chainConfig.baseGrace > 0) eligibleBoosts.push(`${chainConfig.name} Network Grace`);
  if (griefBonus > 0) eligibleBoosts.push(`Grief Score ${griefScore} Boost`);
  if (tierBonus > 0) eligibleBoosts.push(`${userTier} Tier Bonus`);
  if (networkBonus > 0) eligibleBoosts.push(`${chainConfig.name} Network Bonus`);
  if (premiumBonusTime > 0) eligibleBoosts.push('Premium Subscriber Bonus');
  
  const canUnlock = now >= adjustedUnlockTime;
  const remainingTime = Math.max(0, adjustedUnlockTime - now);
  
  // Determine boost type
  let boostType = 'None';
  if (totalReduction > 0) {
    if (griefScore >= 9) boostType = 'Legendary Grief Boost';
    else if (griefScore >= 8) boostType = 'Epic Grief Boost';
    else if (griefScore >= 7) boostType = 'Rare Grief Boost';
    else if (griefScore >= 5) boostType = 'Common Grief Boost';
    else boostType = 'Network Grace Period';
  }
  
  return {
    canUnlock,
    timeReduction: totalReduction,
    boostType,
    remainingTime,
    eligibleBoosts
  };
}

/**
 * Get human-readable time until unlock
 * @param milliseconds - Time in milliseconds
 * @returns Formatted time string
 */
export function formatTimeUntilUnlock(milliseconds: number): string {
  if (milliseconds <= 0) return 'Available now';
  
  const hours = Math.floor(milliseconds / (60 * 60 * 1000));
  const minutes = Math.floor((milliseconds % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((milliseconds % (60 * 1000)) / 1000);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Calculate optimal unlock strategy
 * @param params - Unlock boost parameters
 * @returns Recommendation for best unlock approach
 */
export function getOptimalUnlockStrategy(params: UnlockBoostParams): {
  recommendation: string;
  potentialSavings: number;
  upgradeOptions: string[];
} {
  const currentResult = canUnlockWithBoost(params);
  
  // Test different scenarios
  const upgradedTierResult = canUnlockWithBoost({
    ...params,
    userTier: 'SOVEREIGN'
  });
  
  const premiumResult = canUnlockWithBoost({
    ...params,
    premiumBonus: true
  });
  
  const upgradeOptions: string[] = [];
  let potentialSavings = 0;
  
  if (upgradedTierResult.timeReduction > currentResult.timeReduction) {
    const savings = upgradedTierResult.timeReduction - currentResult.timeReduction;
    upgradeOptions.push(`Upgrade to SOVEREIGN tier (saves ${formatTimeUntilUnlock(savings)})`);
    potentialSavings = Math.max(potentialSavings, savings);
  }
  
  if (premiumResult.timeReduction > currentResult.timeReduction) {
    const savings = premiumResult.timeReduction - currentResult.timeReduction;
    upgradeOptions.push(`Premium subscription (saves ${formatTimeUntilUnlock(savings)})`);
    potentialSavings = Math.max(potentialSavings, savings);
  }
  
  let recommendation = 'Current setup is optimal';
  if (currentResult.canUnlock) {
    recommendation = 'Capsule ready to unlock now!';
  } else if (upgradeOptions.length > 0) {
    recommendation = `Consider upgrades to unlock ${formatTimeUntilUnlock(potentialSavings)} earlier`;
  } else if (currentResult.remainingTime > 0) {
    recommendation = `Wait ${formatTimeUntilUnlock(currentResult.remainingTime)} for unlock`;
  }
  
  return {
    recommendation,
    potentialSavings,
    upgradeOptions
  };
}