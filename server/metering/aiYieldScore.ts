/**
 * GUARDIANCHAIN AI Yield Score Calculator
 * Calculates trust & billing eligibility for users based on AI + capsule yield behavior
 */

interface UserMetrics {
  gttSpent: number;
  gttEarned: number;
  capsulesCreated: number;
  capsulesRemixed: number;
  capsulesSealed: number;
  aiInteractions: number;
  memorySaves: number;
  daoVotes: number;
  legacySet: boolean;
  accountAge: number; // days
  verificationScore: number; // 0-1
  socialScore: number; // 0-1
}

interface TrustScoreResult {
  score: number; // 0-100
  tier: 'Explorer' | 'Seeker' | 'Creator' | 'Guardian' | 'Sovereign';
  multiplier: number;
  breakdown: {
    efficiency: number;
    activity: number;
    social: number;
    legacy: number;
    verification: number;
  };
  recommendations: string[];
  billingEligibility: {
    creditLimit: number;
    interestRate: number;
    paymentTerms: string;
  };
}

export class GuardianTrustCalculator {
  private static readonly TIER_THRESHOLDS = {
    Explorer: 0,
    Seeker: 25,
    Creator: 50,
    Guardian: 75,
    Sovereign: 90
  };

  private static readonly MULTIPLIERS = {
    Explorer: 1.0,
    Seeker: 1.2,
    Creator: 1.5,
    Guardian: 2.0,
    Sovereign: 3.0
  };

  /**
   * Calculate comprehensive Guardian Trust Score
   */
  static calculateGuardianTrustScore(user: UserMetrics): TrustScoreResult {
    const breakdown = {
      efficiency: this.calculateEfficiencyScore(user),
      activity: this.calculateActivityScore(user),
      social: this.calculateSocialScore(user),
      legacy: this.calculateLegacyScore(user),
      verification: this.calculateVerificationScore(user)
    };

    // Weighted combination of all factors
    const rawScore = (
      breakdown.efficiency * 0.30 +      // 30% - Financial efficiency
      breakdown.activity * 0.25 +        // 25% - Platform activity
      breakdown.social * 0.20 +          // 20% - Social engagement
      breakdown.legacy * 0.15 +          // 15% - Long-term commitment
      breakdown.verification * 0.10      // 10% - Identity verification
    );

    const score = Math.min(100, Math.max(0, rawScore));
    const tier = this.determineTier(score);
    const multiplier = this.MULTIPLIERS[tier];

    return {
      score: Number(score.toFixed(2)),
      tier,
      multiplier,
      breakdown,
      recommendations: this.generateRecommendations(user, breakdown),
      billingEligibility: this.calculateBillingEligibility(score, tier)
    };
  }

  /**
   * Calculate financial efficiency score (GTT earned vs spent)
   */
  private static calculateEfficiencyScore(user: UserMetrics): number {
    if (user.gttSpent === 0) {
      return user.gttEarned > 0 ? 100 : 50; // Perfect efficiency or neutral
    }

    const efficiency = user.gttEarned / user.gttSpent;
    
    // Scale efficiency to 0-100
    if (efficiency >= 2.0) return 100;      // 2x return = perfect
    if (efficiency >= 1.5) return 85;       // 1.5x return = excellent
    if (efficiency >= 1.0) return 70;       // Break-even = good
    if (efficiency >= 0.5) return 50;       // 50% return = fair
    return Math.max(0, efficiency * 100);   // Below 50% = poor
  }

  /**
   * Calculate platform activity score
   */
  private static calculateActivityScore(user: UserMetrics): number {
    const totalActions = user.capsulesCreated + user.capsulesRemixed + 
                        user.capsulesSealed + user.aiInteractions + 
                        user.memorySaves + user.daoVotes;

    // Activity score based on total platform engagement
    if (totalActions >= 100) return 100;
    if (totalActions >= 50) return 85;
    if (totalActions >= 25) return 70;
    if (totalActions >= 10) return 55;
    if (totalActions >= 5) return 40;
    return Math.min(40, totalActions * 8);
  }

  /**
   * Calculate social engagement score
   */
  private static calculateSocialScore(user: UserMetrics): number {
    const socialWeight = user.socialScore * 100;
    
    // Bonus for capsule interactions
    const remixBonus = Math.min(30, user.capsulesRemixed * 3);
    const sealBonus = Math.min(20, user.capsulesSealed * 2);
    const voteBonus = Math.min(15, user.daoVotes * 1.5);

    return Math.min(100, socialWeight + remixBonus + sealBonus + voteBonus);
  }

  /**
   * Calculate legacy commitment score
   */
  private static calculateLegacyScore(user: UserMetrics): number {
    let legacyScore = 0;

    // Legacy protocol setup bonus
    if (user.legacySet) {
      legacyScore += 60;
    }

    // Account age bonus (long-term commitment)
    const ageBonus = Math.min(25, user.accountAge / 10); // 1 point per 10 days, max 25
    legacyScore += ageBonus;

    // AI memory saves (long-term value)
    const memoryBonus = Math.min(15, user.memorySaves * 0.5);
    legacyScore += memoryBonus;

    return Math.min(100, legacyScore);
  }

  /**
   * Calculate verification score
   */
  private static calculateVerificationScore(user: UserMetrics): number {
    return user.verificationScore * 100;
  }

  /**
   * Determine user tier based on trust score
   */
  private static determineTier(score: number): TrustScoreResult['tier'] {
    if (score >= this.TIER_THRESHOLDS.Sovereign) return 'Sovereign';
    if (score >= this.TIER_THRESHOLDS.Guardian) return 'Guardian';
    if (score >= this.TIER_THRESHOLDS.Creator) return 'Creator';
    if (score >= this.TIER_THRESHOLDS.Seeker) return 'Seeker';
    return 'Explorer';
  }

  /**
   * Generate personalized recommendations for improving trust score
   */
  private static generateRecommendations(user: UserMetrics, breakdown: any): string[] {
    const recommendations: string[] = [];

    // Efficiency recommendations
    if (breakdown.efficiency < 60) {
      if (user.gttEarned === 0) {
        recommendations.push("Create and seal your first truth capsule to start earning GTT");
      } else {
        recommendations.push("Focus on high-yield capsule creation to improve efficiency ratio");
      }
    }

    // Activity recommendations
    if (breakdown.activity < 50) {
      recommendations.push("Increase platform engagement through capsule remixing and AI interactions");
    }

    // Social recommendations
    if (breakdown.social < 60) {
      recommendations.push("Participate in DAO governance and remix community capsules");
    }

    // Legacy recommendations
    if (breakdown.legacy < 40) {
      if (!user.legacySet) {
        recommendations.push("Set up Legacy Protocol to demonstrate long-term commitment");
      }
      recommendations.push("Save important AI conversations to build digital legacy");
    }

    // Verification recommendations
    if (breakdown.verification < 80) {
      recommendations.push("Complete identity verification to access premium features");
    }

    return recommendations;
  }

  /**
   * Calculate billing eligibility based on trust score
   */
  private static calculateBillingEligibility(
    score: number, 
    tier: TrustScoreResult['tier']
  ): TrustScoreResult['billingEligibility'] {
    const baseCreditLimit = 1000; // GTT
    const tierMultipliers = {
      Explorer: 0.5,
      Seeker: 1.0,
      Creator: 2.0,
      Guardian: 5.0,
      Sovereign: 10.0
    };

    const creditLimit = baseCreditLimit * tierMultipliers[tier];
    
    // Interest rate decreases with higher trust score
    const baseRate = 5.0; // 5% base rate
    const interestRate = Math.max(0.5, baseRate - (score / 100) * 4); // Down to 0.5%

    const paymentTerms = tier === 'Sovereign' ? '60 days' :
                        tier === 'Guardian' ? '45 days' :
                        tier === 'Creator' ? '30 days' :
                        tier === 'Seeker' ? '14 days' : '7 days';

    return {
      creditLimit,
      interestRate: Number(interestRate.toFixed(2)),
      paymentTerms
    };
  }

  /**
   * Calculate yield multiplier for rewards
   */
  static calculateYieldMultiplier(trustScore: number): number {
    const tier = this.determineTier(trustScore);
    return this.MULTIPLIERS[tier];
  }

  /**
   * Batch calculate trust scores for multiple users
   */
  static batchCalculateTrustScores(users: UserMetrics[]): TrustScoreResult[] {
    return users.map(user => this.calculateGuardianTrustScore(user));
  }

  /**
   * Get trust score statistics for analytics
   */
  static getTrustScoreStats(results: TrustScoreResult[]) {
    const scores = results.map(r => r.score);
    const tiers = results.map(r => r.tier);

    return {
      averageScore: scores.reduce((a, b) => a + b, 0) / scores.length,
      medianScore: scores.sort()[Math.floor(scores.length / 2)],
      tierDistribution: {
        Explorer: tiers.filter(t => t === 'Explorer').length,
        Seeker: tiers.filter(t => t === 'Seeker').length,
        Creator: tiers.filter(t => t === 'Creator').length,
        Guardian: tiers.filter(t => t === 'Guardian').length,
        Sovereign: tiers.filter(t => t === 'Sovereign').length
      },
      totalUsers: results.length
    };
  }
}