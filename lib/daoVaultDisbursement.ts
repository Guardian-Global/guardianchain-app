/**
 * DAO Vault Disbursement System
 * Manages community treasury, reward distribution, and governance incentives
 */

export interface VaultTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'reward' | 'burn';
  amount: number;
  recipient?: string;
  source?: string;
  timestamp: number;
  txHash?: string;
  metadata?: {
    capsuleId?: string;
    validatorAddress?: string;
    proposalId?: string;
    category?: string;
  };
}

export interface VaultState {
  totalBalance: number;
  reserveBalance: number;
  distributedToday: number;
  distributedThisWeek: number;
  distributedThisMonth: number;
  totalDistributed: number;
  activeValidators: number;
  pendingRewards: number;
  lastDistribution: number;
  nextDistribution: number;
}

export interface DistributionPolicy {
  dailyLimit: number;
  weeklyLimit: number;
  monthlyLimit: number;
  validatorSharePercent: number;
  daoReservePercent: number;
  communitySharePercent: number;
  burnPercent: number;
  minimumBalance: number;
}

export class DAOVaultManager {
  private transactions: VaultTransaction[] = [];
  private state: VaultState;
  private policy: DistributionPolicy;

  constructor(initialBalance: number = 50000) {
    this.state = {
      totalBalance: initialBalance,
      reserveBalance: initialBalance * 0.3, // 30% in reserve
      distributedToday: 0,
      distributedThisWeek: 0,
      distributedThisMonth: 0,
      totalDistributed: 0,
      activeValidators: 0,
      pendingRewards: 0,
      lastDistribution: Date.now() - 86400000, // 1 day ago
      nextDistribution: Date.now() + 86400000   // 1 day from now
    };

    this.policy = {
      dailyLimit: 1000,
      weeklyLimit: 5000,
      monthlyLimit: 20000,
      validatorSharePercent: 40,
      daoReservePercent: 20,
      communitySharePercent: 35,
      burnPercent: 5,
      minimumBalance: 10000
    };
  }

  /**
   * Process capsule redemption contribution to vault
   */
  depositFromRedemption(
    amount: number, 
    capsuleId: string, 
    validatorAddress?: string
  ): VaultTransaction {
    const transaction: VaultTransaction = {
      id: `dep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'deposit',
      amount,
      timestamp: Date.now(),
      txHash: this.generateTxHash(),
      metadata: {
        capsuleId,
        validatorAddress,
        category: 'capsule_redemption'
      }
    };

    this.state.totalBalance += amount;
    this.transactions.push(transaction);

    return transaction;
  }

  /**
   * Distribute validator rewards
   */
  distributeValidatorRewards(
    validatorAddress: string, 
    baseAmount: number, 
    capsuleId?: string
  ): { success: boolean; transaction?: VaultTransaction; reason?: string } {
    if (this.state.totalBalance < this.policy.minimumBalance) {
      return {
        success: false,
        reason: "Insufficient vault balance for distribution"
      };
    }

    if (this.state.distributedToday >= this.policy.dailyLimit) {
      return {
        success: false,
        reason: "Daily distribution limit exceeded"
      };
    }

    const transaction: VaultTransaction = {
      id: `val_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'reward',
      amount: baseAmount,
      recipient: validatorAddress,
      timestamp: Date.now(),
      txHash: this.generateTxHash(),
      metadata: {
        capsuleId,
        validatorAddress,
        category: 'validator_reward'
      }
    };

    this.state.totalBalance -= baseAmount;
    this.state.distributedToday += baseAmount;
    this.state.distributedThisWeek += baseAmount;
    this.state.distributedThisMonth += baseAmount;
    this.state.totalDistributed += baseAmount;
    this.transactions.push(transaction);

    return { success: true, transaction };
  }

  /**
   * Process weekly community distribution
   */
  processWeeklyDistribution(): {
    success: boolean;
    distributions?: VaultTransaction[];
    totalDistributed?: number;
    reason?: string;
  } {
    const now = Date.now();
    const weekInMs = 7 * 24 * 60 * 60 * 1000;
    
    if (now < this.state.nextDistribution) {
      return {
        success: false,
        reason: "Not yet time for weekly distribution"
      };
    }

    if (this.state.totalBalance < this.policy.minimumBalance * 2) {
      return {
        success: false,
        reason: "Insufficient balance for weekly distribution"
      };
    }

    const distributionAmount = Math.min(
      this.state.totalBalance * 0.05, // 5% of total balance
      this.policy.weeklyLimit
    );

    const distributions: VaultTransaction[] = [];
    
    // Validator distribution (40%)
    const validatorShare = Math.floor(distributionAmount * (this.policy.validatorSharePercent / 100));
    if (validatorShare > 0) {
      distributions.push({
        id: `weekly_val_${Date.now()}`,
        type: 'reward',
        amount: validatorShare,
        recipient: 'validator_pool',
        timestamp: now,
        txHash: this.generateTxHash(),
        metadata: {
          category: 'weekly_validator_distribution'
        }
      });
    }

    // Community distribution (35%)
    const communityShare = Math.floor(distributionAmount * (this.policy.communitySharePercent / 100));
    if (communityShare > 0) {
      distributions.push({
        id: `weekly_comm_${Date.now()}`,
        type: 'reward',
        amount: communityShare,
        recipient: 'community_pool',
        timestamp: now,
        txHash: this.generateTxHash(),
        metadata: {
          category: 'weekly_community_distribution'
        }
      });
    }

    // Reserve allocation (20%)
    const reserveShare = Math.floor(distributionAmount * (this.policy.daoReservePercent / 100));
    this.state.reserveBalance += reserveShare;

    // Burn mechanism (5%)
    const burnShare = Math.floor(distributionAmount * (this.policy.burnPercent / 100));
    if (burnShare > 0) {
      distributions.push({
        id: `weekly_burn_${Date.now()}`,
        type: 'burn',
        amount: burnShare,
        timestamp: now,
        txHash: this.generateTxHash(),
        metadata: {
          category: 'weekly_burn'
        }
      });
    }

    // Update state
    const totalDistributed = validatorShare + communityShare + burnShare;
    this.state.totalBalance -= totalDistributed;
    this.state.distributedThisWeek = 0; // Reset weekly counter
    this.state.lastDistribution = now;
    this.state.nextDistribution = now + weekInMs;
    this.state.totalDistributed += totalDistributed;

    // Add all transactions
    this.transactions.push(...distributions);

    return {
      success: true,
      distributions,
      totalDistributed
    };
  }

  /**
   * Get current vault statistics
   */
  getVaultStats(): VaultState & {
    recentTransactions: VaultTransaction[];
    distributionProgress: {
      daily: { used: number; limit: number; percentage: number };
      weekly: { used: number; limit: number; percentage: number };
      monthly: { used: number; limit: number; percentage: number };
    };
  } {
    const recentTransactions = this.transactions
      .slice(-10)
      .sort((a, b) => b.timestamp - a.timestamp);

    return {
      ...this.state,
      recentTransactions,
      distributionProgress: {
        daily: {
          used: this.state.distributedToday,
          limit: this.policy.dailyLimit,
          percentage: (this.state.distributedToday / this.policy.dailyLimit) * 100
        },
        weekly: {
          used: this.state.distributedThisWeek,
          limit: this.policy.weeklyLimit,
          percentage: (this.state.distributedThisWeek / this.policy.weeklyLimit) * 100
        },
        monthly: {
          used: this.state.distributedThisMonth,
          limit: this.policy.monthlyLimit,
          percentage: (this.state.distributedThisMonth / this.policy.monthlyLimit) * 100
        }
      }
    };
  }

  /**
   * Get transactions by category
   */
  getTransactionsByCategory(category: string, limit: number = 50): VaultTransaction[] {
    return this.transactions
      .filter(tx => tx.metadata?.category === category)
      .slice(-limit)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Calculate projected rewards for validators
   */
  calculateValidatorProjections(validatorAddress: string, daysAhead: number = 7): {
    dailyAverage: number;
    projectedWeekly: number;
    projectedMonthly: number;
    estimatedAPY: number;
  } {
    const validatorTransactions = this.transactions.filter(
      tx => tx.metadata?.validatorAddress === validatorAddress && tx.type === 'reward'
    );

    const recentTransactions = validatorTransactions.slice(-30); // Last 30 transactions
    const dailyAverage = recentTransactions.length > 0 
      ? recentTransactions.reduce((sum, tx) => sum + tx.amount, 0) / Math.min(30, recentTransactions.length)
      : 0;

    return {
      dailyAverage,
      projectedWeekly: dailyAverage * 7,
      projectedMonthly: dailyAverage * 30,
      estimatedAPY: dailyAverage * 365 // Simplified APY calculation
    };
  }

  /**
   * Update distribution policy (governance function)
   */
  updateDistributionPolicy(newPolicy: Partial<DistributionPolicy>): void {
    this.policy = { ...this.policy, ...newPolicy };
  }

  /**
   * Generate mock transaction hash
   */
  private generateTxHash(): string {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  }

  /**
   * Get vault health score (0-100)
   */
  getVaultHealthScore(): number {
    let score = 100;

    // Deduct for low balance
    if (this.state.totalBalance < this.policy.minimumBalance * 2) score -= 30;
    else if (this.state.totalBalance < this.policy.minimumBalance * 5) score -= 15;

    // Deduct for high distribution rate
    const dailyUsage = (this.state.distributedToday / this.policy.dailyLimit) * 100;
    if (dailyUsage > 90) score -= 20;
    else if (dailyUsage > 70) score -= 10;

    // Deduct for low reserve ratio
    const reserveRatio = (this.state.reserveBalance / this.state.totalBalance) * 100;
    if (reserveRatio < 10) score -= 25;
    else if (reserveRatio < 20) score -= 15;

    return Math.max(0, Math.min(100, score));
  }
}

// Export a singleton instance for the application
export const daoVault = new DAOVaultManager();