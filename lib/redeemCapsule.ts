/**
 * Enhanced Capsule Redemption System
 * Handles complex redemption logic with DAO vault integration and validator rewards
 */

export interface CapsuleRedemption {
  id: string;
  title: string;
  griefScore: number;
  unlockTimestamp: number;
  redeemed: boolean;
  value: number;
  type: string;
  owner: string;
  requirements?: {
    minGriefScore: number;
    timelock: boolean;
    verified: boolean;
    stakingRequired?: boolean;
  };
  metadata?: {
    category: string;
    emotionalResonance: number;
    truthConfidence: number;
  };
}

export interface UnlockConditions {
  minGriefScore: number;
  requireVerification: boolean;
  stakingAmount?: number;
  timeBuffer?: number; // Additional time buffer in seconds
}

export interface RedemptionResult {
  success: boolean;
  capsuleId?: string;
  to?: string;
  redeemedAt?: string;
  gttReward?: number;
  reason?: string;
  txHash?: string;
  validatorReward?: number;
  daoContribution?: number;
}

/**
 * Core capsule redemption logic with enhanced validation
 */
export function redeemCapsule(
  capsule: CapsuleRedemption, 
  recipientWallet: string, 
  unlockConditions: UnlockConditions
): RedemptionResult {
  const { griefScore, unlockTimestamp, redeemed, value, requirements } = capsule;
  const now = Date.now();

  // Basic validation checks
  if (redeemed) {
    return { 
      success: false, 
      reason: "Capsule has already been redeemed" 
    };
  }

  if (now < unlockTimestamp) {
    const hoursRemaining = Math.ceil((unlockTimestamp - now) / (1000 * 60 * 60));
    return { 
      success: false, 
      reason: `Capsule is still time-locked. ${hoursRemaining} hours remaining` 
    };
  }

  if (griefScore < unlockConditions.minGriefScore) {
    return { 
      success: false, 
      reason: `Grief score too low. Required: ${unlockConditions.minGriefScore}, Current: ${griefScore}` 
    };
  }

  // Additional requirements validation
  if (requirements) {
    if (requirements.minGriefScore && griefScore < requirements.minGriefScore) {
      return {
        success: false,
        reason: `Capsule requires minimum grief score of ${requirements.minGriefScore}`
      };
    }

    if (requirements.verified && !unlockConditions.requireVerification) {
      return {
        success: false,
        reason: "This capsule requires verified user status"
      };
    }

    if (requirements.stakingRequired && !unlockConditions.stakingAmount) {
      return {
        success: false,
        reason: "Staking requirement not met for this capsule"
      };
    }
  }

  // Calculate rewards based on capsule properties
  const baseReward = value || calculateBaseReward(capsule);
  const griefBonus = Math.floor(griefScore * 0.1 * baseReward);
  const typeBonus = calculateTypeBonus(capsule.type, baseReward);
  const totalReward = baseReward + griefBonus + typeBonus;

  // Calculate validator and DAO contributions
  const validatorReward = Math.floor(totalReward * 0.1); // 10% to validator
  const daoContribution = Math.floor(totalReward * 0.05); // 5% to DAO vault

  return {
    success: true,
    capsuleId: capsule.id,
    to: recipientWallet,
    redeemedAt: new Date().toISOString(),
    gttReward: totalReward,
    validatorReward,
    daoContribution,
    txHash: generateMockTxHash() // In production, this would be the actual blockchain transaction hash
  };
}

/**
 * Calculate base reward for a capsule based on its properties
 */
export function calculateBaseReward(capsule: CapsuleRedemption): number {
  let baseReward = 10; // Base 10 GTT
  
  // Bonus based on grief score
  if (capsule.griefScore >= 9) baseReward += 15;
  else if (capsule.griefScore >= 7) baseReward += 10;
  else if (capsule.griefScore >= 5) baseReward += 5;

  // Bonus based on emotional resonance
  if (capsule.metadata?.emotionalResonance) {
    baseReward += Math.floor(capsule.metadata.emotionalResonance * 0.2);
  }

  // Bonus based on truth confidence
  if (capsule.metadata?.truthConfidence) {
    baseReward += Math.floor(capsule.metadata.truthConfidence * 0.15);
  }

  return baseReward;
}

/**
 * Calculate type-specific bonus rewards
 */
export function calculateTypeBonus(type: string, baseReward: number): number {
  const typeMultipliers: Record<string, number> = {
    'whistle': 2.0,      // Whistleblower capsules get highest bonus
    'testimony': 1.5,    // Testimony capsules get high bonus
    'truth': 1.2,        // Truth capsules get moderate bonus
    'legacy': 1.0,       // Legacy capsules get standard bonus
    'evidence': 1.8,     // Evidence capsules get high bonus
    'prophecy': 1.3,     // Prophecy capsules get moderate bonus
  };

  const multiplier = typeMultipliers[type.toLowerCase()] || 1.0;
  return Math.floor(baseReward * (multiplier - 1));
}

/**
 * Check if a capsule is eligible for redemption
 */
export function isRedeemable(
  capsule: CapsuleRedemption, 
  unlockConditions: UnlockConditions
): { eligible: boolean; reason?: string } {
  const result = redeemCapsule(capsule, "0x0000000000000000000000000000000000000000", unlockConditions);
  return {
    eligible: result.success,
    reason: result.reason
  };
}

/**
 * Get redemption eligibility for multiple capsules
 */
export function batchCheckRedemption(
  capsules: CapsuleRedemption[], 
  unlockConditions: UnlockConditions
): Array<{ capsule: CapsuleRedemption; eligible: boolean; reason?: string }> {
  return capsules.map(capsule => ({
    capsule,
    ...isRedeemable(capsule, unlockConditions)
  }));
}

/**
 * Calculate total potential rewards for multiple capsules
 */
export function calculateTotalPotentialRewards(capsules: CapsuleRedemption[]): {
  totalGTT: number;
  redeemableCount: number;
  lockedCount: number;
  breakdown: Record<string, number>;
} {
  let totalGTT = 0;
  let redeemableCount = 0;
  let lockedCount = 0;
  const breakdown: Record<string, number> = {};

  const now = Date.now();
  const unlockConditions: UnlockConditions = {
    minGriefScore: 5,
    requireVerification: false
  };

  capsules.forEach(capsule => {
    const type = capsule.type.toLowerCase();
    
    if (!breakdown[type]) breakdown[type] = 0;
    
    if (!capsule.redeemed && now >= capsule.unlockTimestamp) {
      const { eligible } = isRedeemable(capsule, unlockConditions);
      
      if (eligible) {
        const reward = calculateBaseReward(capsule) + calculateTypeBonus(capsule.type, calculateBaseReward(capsule));
        totalGTT += reward;
        breakdown[type] += reward;
        redeemableCount++;
      } else {
        lockedCount++;
      }
    } else {
      lockedCount++;
    }
  });

  return {
    totalGTT,
    redeemableCount,
    lockedCount,
    breakdown
  };
}

/**
 * Generate a mock transaction hash for development
 * In production, this would be replaced with actual blockchain integration
 */
function generateMockTxHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

/**
 * Validate wallet address format
 */
export function isValidWalletAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Get formatted time until unlock
 */
export function getTimeUntilUnlock(unlockTimestamp: number): string {
  const now = Date.now();
  const diff = unlockTimestamp - now;
  
  if (diff <= 0) return "Available now";
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h remaining`;
  if (hours > 0) return `${hours}h ${minutes}m remaining`;
  return `${minutes}m remaining`;
}