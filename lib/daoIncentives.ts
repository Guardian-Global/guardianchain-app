/**
 * DAO Incentives and Governance System
 * Advanced incentive mechanisms for community participation and protocol governance
 */

export interface IncentiveProgram {
  id: string;
  name: string;
  description: string;
  type: 'staking' | 'governance' | 'validation' | 'community' | 'referral';
  active: boolean;
  startDate: number;
  endDate?: number;
  totalBudget: number;
  remainingBudget: number;
  participants: number;
  requirements: {
    minStake?: number;
    minTier?: string;
    minCapsules?: number;
    timeCommitment?: number; // in days
    specialConditions?: string[];
  };
  rewards: {
    baseReward: number;
    bonusMultipliers: Record<string, number>;
    payoutSchedule: 'immediate' | 'weekly' | 'monthly' | 'milestone';
    rewardCap?: number;
  };
  metrics: {
    totalDistributed: number;
    averageReward: number;
    completionRate: number;
    satisfactionScore: number;
  };
}

export interface UserIncentive {
  userId: string;
  programId: string;
  joinedAt: number;
  status: 'active' | 'completed' | 'paused' | 'disqualified';
  progress: {
    currentLevel: number;
    completedTasks: number;
    totalTasks: number;
    earnedRewards: number;
    nextMilestone?: {
      requirement: string;
      reward: number;
      deadline?: number;
    };
  };
  achievements: Array<{
    id: string;
    name: string;
    earnedAt: number;
    reward: number;
  }>;
  streak: {
    current: number;
    longest: number;
    lastActivity: number;
  };
}

export interface GovernanceProposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  type: 'protocol' | 'treasury' | 'incentive' | 'community';
  status: 'draft' | 'active' | 'passed' | 'rejected' | 'executed';
  votingPower: {
    required: number;
    current: number;
    threshold: number;
  };
  timeline: {
    created: number;
    votingStart: number;
    votingEnd: number;
    executionDeadline?: number;
  };
  votes: {
    for: number;
    against: number;
    abstain: number;
    details: Array<{
      voter: string;
      power: number;
      choice: 'for' | 'against' | 'abstain';
      timestamp: number;
      reason?: string;
    }>;
  };
  rewards: {
    proposerReward: number;
    voterRewards: number;
    implementationReward?: number;
  };
}

export class DAOIncentiveManager {
  private programs: Map<string, IncentiveProgram> = new Map();
  private userIncentives: Map<string, UserIncentive[]> = new Map();
  private proposals: Map<string, GovernanceProposal> = new Map();

  constructor() {
    this.initializeDefaultPrograms();
  }

  /**
   * Initialize default incentive programs
   */
  private initializeDefaultPrograms(): void {
    const defaultPrograms: IncentiveProgram[] = [
      {
        id: 'truth_validator_program',
        name: 'Truth Validator Incentives',
        description: 'Earn rewards for validating truth capsules with high accuracy',
        type: 'validation',
        active: true,
        startDate: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
        totalBudget: 50000,
        remainingBudget: 37500,
        participants: 47,
        requirements: {
          minTier: 'silver',
          minCapsules: 25,
          timeCommitment: 7,
          specialConditions: ['high_accuracy_rate', 'community_standing']
        },
        rewards: {
          baseReward: 5,
          bonusMultipliers: {
            'accuracy_95_plus': 1.5,
            'early_validator': 1.2,
            'consistency_bonus': 1.3
          },
          payoutSchedule: 'weekly',
          rewardCap: 500
        },
        metrics: {
          totalDistributed: 12500,
          averageReward: 265.96,
          completionRate: 89.36,
          satisfactionScore: 4.7
        }
      },
      {
        id: 'community_governance_program',
        name: 'Community Governance Participation',
        description: 'Rewards for active participation in DAO governance decisions',
        type: 'governance',
        active: true,
        startDate: Date.now() - 60 * 24 * 60 * 60 * 1000, // 60 days ago
        totalBudget: 25000,
        remainingBudget: 18750,
        participants: 156,
        requirements: {
          minStake: 100,
          minTier: 'bronze',
          timeCommitment: 30
        },
        rewards: {
          baseReward: 10,
          bonusMultipliers: {
            'proposal_author': 3.0,
            'detailed_analysis': 1.8,
            'community_consensus': 1.4
          },
          payoutSchedule: 'milestone',
          rewardCap: 1000
        },
        metrics: {
          totalDistributed: 6250,
          averageReward: 40.06,
          completionRate: 78.21,
          satisfactionScore: 4.4
        }
      },
      {
        id: 'capsule_creation_incentive',
        name: 'High-Quality Capsule Creation',
        description: 'Incentivize creation of high-grief, verified truth capsules',
        type: 'community',
        active: true,
        startDate: Date.now() - 45 * 24 * 60 * 60 * 1000, // 45 days ago
        totalBudget: 75000,
        remainingBudget: 62500,
        participants: 203,
        requirements: {
          minTier: 'seeker',
          specialConditions: ['grief_score_8_plus', 'community_verification']
        },
        rewards: {
          baseReward: 15,
          bonusMultipliers: {
            'grief_score_9_plus': 2.0,
            'multimedia_content': 1.3,
            'expert_endorsement': 1.6
          },
          payoutSchedule: 'immediate',
          rewardCap: 200
        },
        metrics: {
          totalDistributed: 12500,
          averageReward: 61.58,
          completionRate: 91.63,
          satisfactionScore: 4.8
        }
      },
      {
        id: 'referral_growth_program',
        name: 'Community Growth Referrals',
        description: 'Earn rewards for bringing active users to the platform',
        type: 'referral',
        active: true,
        startDate: Date.now() - 90 * 24 * 60 * 60 * 1000, // 90 days ago
        totalBudget: 40000,
        remainingBudget: 31200,
        participants: 89,
        requirements: {
          minTier: 'seeker',
          timeCommitment: 14,
          specialConditions: ['referee_retention', 'quality_referrals']
        },
        rewards: {
          baseReward: 25,
          bonusMultipliers: {
            'premium_referral': 2.5,
            'validator_referral': 3.0,
            'retention_bonus': 1.8
          },
          payoutSchedule: 'monthly',
          rewardCap: 2500
        },
        metrics: {
          totalDistributed: 8800,
          averageReward: 98.88,
          completionRate: 67.42,
          satisfactionScore: 4.2
        }
      }
    ];

    defaultPrograms.forEach(program => {
      this.programs.set(program.id, program);
    });
  }

  /**
   * Create new incentive program
   */
  createIncentiveProgram(programData: Omit<IncentiveProgram, 'id' | 'participants' | 'metrics'>): IncentiveProgram {
    const program: IncentiveProgram = {
      ...programData,
      id: `program_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      participants: 0,
      metrics: {
        totalDistributed: 0,
        averageReward: 0,
        completionRate: 0,
        satisfactionScore: 0
      }
    };

    this.programs.set(program.id, program);
    return program;
  }

  /**
   * Join user to incentive program
   */
  joinIncentiveProgram(userId: string, programId: string): UserIncentive | null {
    const program = this.programs.get(programId);
    if (!program || !program.active) {
      return null;
    }

    // Check if user already enrolled
    const userIncentives = this.userIncentives.get(userId) || [];
    const existingIncentive = userIncentives.find(ui => ui.programId === programId);
    
    if (existingIncentive) {
      return existingIncentive;
    }

    const userIncentive: UserIncentive = {
      userId,
      programId,
      joinedAt: Date.now(),
      status: 'active',
      progress: {
        currentLevel: 1,
        completedTasks: 0,
        totalTasks: this.calculateTotalTasks(program),
        earnedRewards: 0,
        nextMilestone: this.generateNextMilestone(program, 1)
      },
      achievements: [],
      streak: {
        current: 0,
        longest: 0,
        lastActivity: Date.now()
      }
    };

    userIncentives.push(userIncentive);
    this.userIncentives.set(userId, userIncentives);

    // Update program participants
    program.participants++;
    this.programs.set(programId, program);

    return userIncentive;
  }

  /**
   * Record user activity and distribute rewards
   */
  recordActivity(
    userId: string, 
    programId: string, 
    activityType: string, 
    metadata: Record<string, any> = {}
  ): { success: boolean; reward?: number; achievement?: any; levelUp?: boolean } {
    const program = this.programs.get(programId);
    const userIncentives = this.userIncentives.get(userId) || [];
    const userIncentive = userIncentives.find(ui => ui.programId === programId);

    if (!program || !userIncentive || userIncentive.status !== 'active') {
      return { success: false };
    }

    // Calculate reward based on activity and program
    const reward = this.calculateActivityReward(program, activityType, metadata);
    
    // Update user progress
    userIncentive.progress.completedTasks++;
    userIncentive.progress.earnedRewards += reward;
    userIncentive.streak.current++;
    userIncentive.streak.lastActivity = Date.now();
    
    if (userIncentive.streak.current > userIncentive.streak.longest) {
      userIncentive.streak.longest = userIncentive.streak.current;
    }

    // Check for achievements
    const achievement = this.checkAchievements(userIncentive, activityType, metadata);
    if (achievement) {
      userIncentive.achievements.push(achievement);
    }

    // Check for level up
    const levelUp = this.checkLevelUp(userIncentive, program);
    
    // Update program metrics
    program.metrics.totalDistributed += reward;
    program.remainingBudget -= reward;
    
    this.programs.set(programId, program);
    this.userIncentives.set(userId, userIncentives);

    return {
      success: true,
      reward,
      achievement,
      levelUp
    };
  }

  /**
   * Get user's incentive status across all programs
   */
  getUserIncentiveStatus(userId: string): {
    programs: UserIncentive[];
    totalEarned: number;
    activePrograms: number;
    achievements: number;
    averageProgress: number;
  } {
    const userIncentives = this.userIncentives.get(userId) || [];
    
    const totalEarned = userIncentives.reduce((sum, ui) => sum + ui.progress.earnedRewards, 0);
    const activePrograms = userIncentives.filter(ui => ui.status === 'active').length;
    const totalAchievements = userIncentives.reduce((sum, ui) => sum + ui.achievements.length, 0);
    
    const averageProgress = userIncentives.length > 0 
      ? userIncentives.reduce((sum, ui) => sum + (ui.progress.completedTasks / ui.progress.totalTasks), 0) / userIncentives.length * 100
      : 0;

    return {
      programs: userIncentives,
      totalEarned,
      activePrograms,
      achievements: totalAchievements,
      averageProgress
    };
  }

  /**
   * Create governance proposal
   */
  createProposal(proposalData: Omit<GovernanceProposal, 'id' | 'status' | 'votes'>): GovernanceProposal {
    const proposal: GovernanceProposal = {
      ...proposalData,
      id: `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'draft',
      votes: {
        for: 0,
        against: 0,
        abstain: 0,
        details: []
      }
    };

    this.proposals.set(proposal.id, proposal);
    return proposal;
  }

  /**
   * Vote on governance proposal
   */
  voteOnProposal(
    proposalId: string,
    userId: string,
    choice: 'for' | 'against' | 'abstain',
    votingPower: number,
    reason?: string
  ): { success: boolean; reward?: number } {
    const proposal = this.proposals.get(proposalId);
    if (!proposal || proposal.status !== 'active') {
      return { success: false };
    }

    // Check if user already voted
    const existingVote = proposal.votes.details.find(v => v.voter === userId);
    if (existingVote) {
      return { success: false };
    }

    // Record vote
    const vote = {
      voter: userId,
      power: votingPower,
      choice,
      timestamp: Date.now(),
      reason
    };

    proposal.votes.details.push(vote);
    proposal.votes[choice] += votingPower;
    proposal.votingPower.current += votingPower;

    // Calculate voter reward
    const reward = proposal.rewards.voterRewards * (votingPower / 100); // Scaled by voting power

    this.proposals.set(proposalId, proposal);

    return { success: true, reward };
  }

  /**
   * Get all active incentive programs
   */
  getActivePrograms(): IncentiveProgram[] {
    return Array.from(this.programs.values()).filter(p => p.active);
  }

  /**
   * Get incentive program leaderboard
   */
  getProgramLeaderboard(programId: string, limit: number = 10): Array<{
    userId: string;
    earnedRewards: number;
    completedTasks: number;
    level: number;
    achievements: number;
    rank: number;
  }> {
    const allUsers: Array<{
      userId: string;
      earnedRewards: number;
      completedTasks: number;
      level: number;
      achievements: number;
    }> = [];

    // Collect all users in this program
    for (const [userId, incentives] of this.userIncentives.entries()) {
      const programIncentive = incentives.find(ui => ui.programId === programId);
      if (programIncentive) {
        allUsers.push({
          userId,
          earnedRewards: programIncentive.progress.earnedRewards,
          completedTasks: programIncentive.progress.completedTasks,
          level: programIncentive.progress.currentLevel,
          achievements: programIncentive.achievements.length
        });
      }
    }

    // Sort by earned rewards and add rank
    return allUsers
      .sort((a, b) => b.earnedRewards - a.earnedRewards)
      .slice(0, limit)
      .map((user, index) => ({
        ...user,
        rank: index + 1
      }));
  }

  /**
   * Get comprehensive DAO analytics
   */
  getDAOAnalytics(): {
    programs: {
      total: number;
      active: number;
      totalBudget: number;
      distributedRewards: number;
      participants: number;
    };
    governance: {
      totalProposals: number;
      activeProposals: number;
      passedProposals: number;
      averageParticipation: number;
    };
    engagement: {
      dailyActiveUsers: number;
      weeklyActiveUsers: number;
      averageRewardPerUser: number;
      retentionRate: number;
    };
  } {
    const programs = Array.from(this.programs.values());
    const proposals = Array.from(this.proposals.values());
    const allIncentives = Array.from(this.userIncentives.values()).flat();

    return {
      programs: {
        total: programs.length,
        active: programs.filter(p => p.active).length,
        totalBudget: programs.reduce((sum, p) => sum + p.totalBudget, 0),
        distributedRewards: programs.reduce((sum, p) => sum + p.metrics.totalDistributed, 0),
        participants: programs.reduce((sum, p) => sum + p.participants, 0)
      },
      governance: {
        totalProposals: proposals.length,
        activeProposals: proposals.filter(p => p.status === 'active').length,
        passedProposals: proposals.filter(p => p.status === 'passed').length,
        averageParticipation: proposals.length > 0 
          ? proposals.reduce((sum, p) => sum + p.votes.details.length, 0) / proposals.length 
          : 0
      },
      engagement: {
        dailyActiveUsers: this.calculateActiveUsers(1),
        weeklyActiveUsers: this.calculateActiveUsers(7),
        averageRewardPerUser: allIncentives.length > 0 
          ? allIncentives.reduce((sum, ui) => sum + ui.progress.earnedRewards, 0) / allIncentives.length 
          : 0,
        retentionRate: this.calculateRetentionRate()
      }
    };
  }

  // Private helper methods

  private calculateTotalTasks(program: IncentiveProgram): number {
    // Calculate based on program type and duration
    const baseTasks = {
      'validation': 50,
      'governance': 20,
      'community': 30,
      'referral': 10,
      'staking': 5
    };
    
    return baseTasks[program.type] || 25;
  }

  private generateNextMilestone(program: IncentiveProgram, level: number): UserIncentive['progress']['nextMilestone'] {
    const milestones = {
      1: { requirement: 'Complete 10 tasks', reward: 50 },
      2: { requirement: 'Maintain 7-day streak', reward: 100 },
      3: { requirement: 'Achieve 90% accuracy', reward: 200 },
      4: { requirement: 'Mentor 3 new users', reward: 500 },
      5: { requirement: 'Lead community initiative', reward: 1000 }
    };

    return milestones[level as keyof typeof milestones] || null;
  }

  private calculateActivityReward(program: IncentiveProgram, activityType: string, metadata: Record<string, any>): number {
    let reward = program.rewards.baseReward;

    // Apply multipliers based on activity metadata
    for (const [condition, multiplier] of Object.entries(program.rewards.bonusMultipliers)) {
      if (metadata[condition] || this.checkBonusCondition(condition, metadata)) {
        reward *= multiplier;
      }
    }

    // Apply reward cap
    if (program.rewards.rewardCap && reward > program.rewards.rewardCap) {
      reward = program.rewards.rewardCap;
    }

    return Math.floor(reward);
  }

  private checkBonusCondition(condition: string, metadata: Record<string, any>): boolean {
    switch (condition) {
      case 'accuracy_95_plus':
        return metadata.accuracy && metadata.accuracy >= 95;
      case 'grief_score_8_plus':
        return metadata.griefScore && metadata.griefScore >= 8;
      case 'grief_score_9_plus':
        return metadata.griefScore && metadata.griefScore >= 9;
      default:
        return false;
    }
  }

  private checkAchievements(userIncentive: UserIncentive, activityType: string, metadata: Record<string, any>): any {
    // Check for various achievements
    if (userIncentive.streak.current === 7) {
      return {
        id: 'week_streak',
        name: 'Week Warrior',
        earnedAt: Date.now(),
        reward: 25
      };
    }

    if (userIncentive.progress.completedTasks === 100) {
      return {
        id: 'century_club',
        name: 'Century Club',
        earnedAt: Date.now(),
        reward: 100
      };
    }

    return null;
  }

  private checkLevelUp(userIncentive: UserIncentive, program: IncentiveProgram): boolean {
    const tasksForNextLevel = userIncentive.progress.currentLevel * 20; // 20 tasks per level
    
    if (userIncentive.progress.completedTasks >= tasksForNextLevel) {
      userIncentive.progress.currentLevel++;
      userIncentive.progress.nextMilestone = this.generateNextMilestone(program, userIncentive.progress.currentLevel);
      return true;
    }
    
    return false;
  }

  private calculateActiveUsers(days: number): number {
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    let activeCount = 0;

    for (const incentives of this.userIncentives.values()) {
      const hasRecentActivity = incentives.some(ui => ui.streak.lastActivity > cutoff);
      if (hasRecentActivity) {
        activeCount++;
      }
    }

    return activeCount;
  }

  private calculateRetentionRate(): number {
    // Simple retention calculation - users active in last 30 days vs 60 days
    const active30 = this.calculateActiveUsers(30);
    const active60 = this.calculateActiveUsers(60);
    
    return active60 > 0 ? (active30 / active60) * 100 : 0;
  }
}

// Export singleton instance
export const daoIncentives = new DAOIncentiveManager();