/**
 * Enhanced Validator Rewards System
 * Manages validator incentives, performance tracking, and reward distribution
 */

export interface ValidatorEvent {
  id: string;
  validator: string;
  eventType: 'capsule_validation' | 'truth_verification' | 'zk_proof' | 'consensus_participation' | 'uptime_bonus';
  timestamp: number;
  capsuleId?: string;
  griefScore?: number;
  confidence?: number;
  gasUsed?: number;
  difficulty?: number;
  metadata?: {
    networkFee?: number;
    boostType?: string;
    verificationTime?: number;
    quality?: 'high' | 'medium' | 'low';
  };
}

export interface ValidatorStats {
  validator: string;
  totalEvents: number;
  totalRewardsEarned: number;
  averageGriefScore: number;
  successRate: number;
  uptime: number;
  lastActive: number;
  rank: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  specializations: string[];
  performance: {
    daily: number;
    weekly: number;
    monthly: number;
    allTime: number;
  };
}

export interface RewardCalculation {
  validator: string;
  baseReward: number;
  performanceBonus: number;
  qualityBonus: number;
  uptimeBonus: number;
  tierMultiplier: number;
  totalReward: number;
  breakdown: {
    eventType: string;
    count: number;
    reward: number;
  }[];
}

export class ValidatorRewardsManager {
  private events: ValidatorEvent[] = [];
  private stats: Map<string, ValidatorStats> = new Map();
  
  // Reward rates by event type and tier
  private readonly BASE_RATES = {
    capsule_validation: 2.5,
    truth_verification: 3.0,
    zk_proof: 4.0,
    consensus_participation: 1.5,
    uptime_bonus: 0.5
  };

  private readonly TIER_MULTIPLIERS = {
    bronze: 1.0,
    silver: 1.2,
    gold: 1.5,
    platinum: 1.8,
    diamond: 2.2
  };

  private readonly QUALITY_BONUSES = {
    high: 1.5,
    medium: 1.2,
    low: 1.0
  };

  /**
   * Record a validator event and calculate immediate reward
   */
  recordValidatorEvent(event: Omit<ValidatorEvent, 'id' | 'timestamp'>): ValidatorEvent {
    const fullEvent: ValidatorEvent = {
      ...event,
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };

    this.events.push(fullEvent);
    this.updateValidatorStats(fullEvent);
    
    return fullEvent;
  }

  /**
   * Calculate rewards for validator events
   */
  calculateValidatorRewards(
    events: ValidatorEvent[], 
    rewardRate: number = 1.0
  ): RewardCalculation[] {
    const validatorRewards = new Map<string, RewardCalculation>();

    // Group events by validator
    const eventsByValidator = this.groupEventsByValidator(events);

    eventsByValidator.forEach((validatorEvents, validator) => {
      const stats = this.getValidatorStats(validator);
      const breakdown = this.calculateEventBreakdown(validatorEvents, rewardRate);
      
      const baseReward = breakdown.reduce((sum, item) => sum + item.reward, 0);
      const performanceBonus = this.calculatePerformanceBonus(validator, validatorEvents);
      const qualityBonus = this.calculateQualityBonus(validatorEvents);
      const uptimeBonus = this.calculateUptimeBonus(validator);
      const tierMultiplier = this.TIER_MULTIPLIERS[stats.tier];
      
      const totalReward = Math.floor(
        (baseReward + performanceBonus + qualityBonus + uptimeBonus) * tierMultiplier
      );

      validatorRewards.set(validator, {
        validator,
        baseReward,
        performanceBonus,
        qualityBonus,
        uptimeBonus,
        tierMultiplier,
        totalReward,
        breakdown
      });
    });

    return Array.from(validatorRewards.values());
  }

  /**
   * Get comprehensive validator statistics
   */
  getValidatorStats(validator: string): ValidatorStats {
    if (!this.stats.has(validator)) {
      // Initialize new validator stats
      this.stats.set(validator, {
        validator,
        totalEvents: 0,
        totalRewardsEarned: 0,
        averageGriefScore: 0,
        successRate: 100,
        uptime: 100,
        lastActive: Date.now(),
        rank: 0,
        tier: 'bronze',
        specializations: [],
        performance: {
          daily: 0,
          weekly: 0,
          monthly: 0,
          allTime: 0
        }
      });
    }
    
    return this.stats.get(validator)!;
  }

  /**
   * Update validator statistics based on new event
   */
  private updateValidatorStats(event: ValidatorEvent): void {
    const stats = this.getValidatorStats(event.validator);
    
    stats.totalEvents++;
    stats.lastActive = event.timestamp;
    
    // Update grief score average
    if (event.griefScore !== undefined) {
      const totalGriefScore = stats.averageGriefScore * (stats.totalEvents - 1) + event.griefScore;
      stats.averageGriefScore = totalGriefScore / stats.totalEvents;
    }

    // Update performance metrics
    this.updatePerformanceMetrics(stats, event);
    
    // Update tier based on performance
    this.updateValidatorTier(stats);
    
    // Update specializations
    this.updateSpecializations(stats, event);
    
    this.stats.set(event.validator, stats);
  }

  /**
   * Calculate performance bonus based on recent activity
   */
  private calculatePerformanceBonus(validator: string, events: ValidatorEvent[]): number {
    const stats = this.getValidatorStats(validator);
    const recentEvents = events.filter(e => 
      Date.now() - e.timestamp < 7 * 24 * 60 * 60 * 1000 // Last 7 days
    );
    
    let bonus = 0;
    
    // Consistency bonus (events spread across multiple days)
    const uniqueDays = new Set(
      recentEvents.map(e => Math.floor(e.timestamp / (24 * 60 * 60 * 1000)))
    ).size;
    
    if (uniqueDays >= 7) bonus += 5; // Full week consistency
    else if (uniqueDays >= 5) bonus += 3;
    else if (uniqueDays >= 3) bonus += 1;
    
    // Volume bonus
    if (recentEvents.length >= 50) bonus += 10;
    else if (recentEvents.length >= 25) bonus += 5;
    else if (recentEvents.length >= 10) bonus += 2;
    
    // High-value events bonus
    const highValueEvents = recentEvents.filter(e => 
      (e.griefScore && e.griefScore >= 8) || 
      (e.confidence && e.confidence >= 90)
    );
    
    bonus += Math.floor(highValueEvents.length * 0.5);
    
    return bonus;
  }

  /**
   * Calculate quality bonus based on event metadata
   */
  private calculateQualityBonus(events: ValidatorEvent[]): number {
    let bonus = 0;
    
    events.forEach(event => {
      if (event.metadata?.quality) {
        const qualityMultiplier = this.QUALITY_BONUSES[event.metadata.quality];
        bonus += (qualityMultiplier - 1) * this.BASE_RATES[event.eventType];
      }
      
      // Fast verification bonus
      if (event.metadata?.verificationTime && event.metadata.verificationTime < 1000) {
        bonus += 0.5;
      }
      
      // High confidence bonus
      if (event.confidence && event.confidence >= 95) {
        bonus += 1.0;
      }
    });
    
    return bonus;
  }

  /**
   * Calculate uptime bonus
   */
  private calculateUptimeBonus(validator: string): number {
    const stats = this.getValidatorStats(validator);
    
    if (stats.uptime >= 99) return 5;
    if (stats.uptime >= 95) return 3;
    if (stats.uptime >= 90) return 1;
    
    return 0;
  }

  /**
   * Group events by validator address
   */
  private groupEventsByValidator(events: ValidatorEvent[]): Map<string, ValidatorEvent[]> {
    const grouped = new Map<string, ValidatorEvent[]>();
    
    events.forEach(event => {
      const validator = event.validator;
      if (!grouped.has(validator)) {
        grouped.set(validator, []);
      }
      grouped.get(validator)!.push(event);
    });
    
    return grouped;
  }

  /**
   * Calculate breakdown of rewards by event type
   */
  private calculateEventBreakdown(
    events: ValidatorEvent[], 
    rewardRate: number
  ): Array<{ eventType: string; count: number; reward: number }> {
    const breakdown = new Map<string, { count: number; reward: number }>();
    
    events.forEach(event => {
      const eventType = event.eventType;
      const baseRate = this.BASE_RATES[eventType] || 1.0;
      const reward = baseRate * rewardRate;
      
      if (!breakdown.has(eventType)) {
        breakdown.set(eventType, { count: 0, reward: 0 });
      }
      
      const current = breakdown.get(eventType)!;
      current.count++;
      current.reward += reward;
    });
    
    return Array.from(breakdown.entries()).map(([eventType, data]) => ({
      eventType,
      ...data
    }));
  }

  /**
   * Update validator tier based on performance
   */
  private updateValidatorTier(stats: ValidatorStats): void {
    const { totalEvents, averageGriefScore, successRate, uptime } = stats;
    
    let tierScore = 0;
    
    // Event volume score
    if (totalEvents >= 1000) tierScore += 40;
    else if (totalEvents >= 500) tierScore += 30;
    else if (totalEvents >= 100) tierScore += 20;
    else if (totalEvents >= 50) tierScore += 10;
    
    // Quality score
    if (averageGriefScore >= 9) tierScore += 25;
    else if (averageGriefScore >= 8) tierScore += 20;
    else if (averageGriefScore >= 7) tierScore += 15;
    else if (averageGriefScore >= 6) tierScore += 10;
    
    // Reliability score
    if (successRate >= 99) tierScore += 20;
    else if (successRate >= 95) tierScore += 15;
    else if (successRate >= 90) tierScore += 10;
    
    // Uptime score
    if (uptime >= 99) tierScore += 15;
    else if (uptime >= 95) tierScore += 10;
    else if (uptime >= 90) tierScore += 5;
    
    // Determine tier
    if (tierScore >= 90) stats.tier = 'diamond';
    else if (tierScore >= 75) stats.tier = 'platinum';
    else if (tierScore >= 60) stats.tier = 'gold';
    else if (tierScore >= 40) stats.tier = 'silver';
    else stats.tier = 'bronze';
  }

  /**
   * Update validator specializations
   */
  private updateSpecializations(stats: ValidatorStats, event: ValidatorEvent): void {
    const specializations = new Set(stats.specializations);
    
    // Add specialization based on event type and performance
    if (event.eventType === 'zk_proof' && (event.confidence || 0) >= 90) {
      specializations.add('zk_specialist');
    }
    
    if (event.eventType === 'truth_verification' && (event.griefScore || 0) >= 8) {
      specializations.add('truth_expert');
    }
    
    if (event.eventType === 'capsule_validation' && event.metadata?.quality === 'high') {
      specializations.add('capsule_expert');
    }
    
    stats.specializations = Array.from(specializations);
  }

  /**
   * Update performance metrics for time periods
   */
  private updatePerformanceMetrics(stats: ValidatorStats, event: ValidatorEvent): void {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    
    // Reset counters if periods have passed
    if (now - stats.lastActive > dayMs) {
      stats.performance.daily = 0;
    }
    
    if (now - stats.lastActive > 7 * dayMs) {
      stats.performance.weekly = 0;
    }
    
    if (now - stats.lastActive > 30 * dayMs) {
      stats.performance.monthly = 0;
    }
    
    // Increment counters
    stats.performance.daily++;
    stats.performance.weekly++;
    stats.performance.monthly++;
    stats.performance.allTime++;
  }

  /**
   * Get top validators by performance
   */
  getTopValidators(limit: number = 10): ValidatorStats[] {
    const allStats = Array.from(this.stats.values());
    
    return allStats
      .sort((a, b) => {
        // Sort by tier first, then by total events
        const tierOrder = { diamond: 5, platinum: 4, gold: 3, silver: 2, bronze: 1 };
        const aTierValue = tierOrder[a.tier];
        const bTierValue = tierOrder[b.tier];
        
        if (aTierValue !== bTierValue) {
          return bTierValue - aTierValue;
        }
        
        return b.totalEvents - a.totalEvents;
      })
      .slice(0, limit)
      .map((stats, index) => ({
        ...stats,
        rank: index + 1
      }));
  }

  /**
   * Get validator performance summary
   */
  getValidatorSummary(): {
    totalValidators: number;
    activeValidators: number;
    totalEvents: number;
    totalRewardsDistributed: number;
    averageRewardPerEvent: number;
    tierDistribution: Record<string, number>;
  } {
    const allStats = Array.from(this.stats.values());
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    
    const activeValidators = allStats.filter(
      stats => now - stats.lastActive < 7 * dayMs
    ).length;
    
    const totalEvents = allStats.reduce((sum, stats) => sum + stats.totalEvents, 0);
    const totalRewards = allStats.reduce((sum, stats) => sum + stats.totalRewardsEarned, 0);
    
    const tierDistribution = allStats.reduce((dist, stats) => {
      dist[stats.tier] = (dist[stats.tier] || 0) + 1;
      return dist;
    }, {} as Record<string, number>);
    
    return {
      totalValidators: allStats.length,
      activeValidators,
      totalEvents,
      totalRewardsDistributed: totalRewards,
      averageRewardPerEvent: totalEvents > 0 ? totalRewards / totalEvents : 0,
      tierDistribution
    };
  }
}

// Export singleton instance
export const validatorRewards = new ValidatorRewardsManager();