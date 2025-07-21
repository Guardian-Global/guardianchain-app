import {
  users,
  capsules,
  capsuleInteractions,
  type User,
  type UpsertUser,
  type Capsule,
  type InsertCapsule,
  type CapsuleInteraction,
  type InsertCapsuleInteraction
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, userData: Partial<UpsertUser>): Promise<User>;
  updateUserTier(id: string, tier: string): Promise<User | undefined>;
  updateUserLastLogin(userId: string): Promise<void>;
  updateUserStake(userId: string, stakeAmount: number): Promise<void>;
  createUser(userData: {
    email: string;
    passwordHash: string;
    firstName?: string;
    lastName?: string;
    tier: string;
    gttStakeAmount: number;
    emailVerified: boolean;
    isActive: boolean;
    agreedToTermsAt: Date;
  }): Promise<User>;
  getUserById(userId: string): Promise<User | undefined>;
  
  // Capsule operations
  createCapsule(capsuleData: any): Promise<Capsule>;
  getUserCapsules(userId: string): Promise<Capsule[]>;
  getCapsule(id: number): Promise<Capsule | undefined>;
  updateCapsule(id: number, updates: Partial<Capsule>): Promise<Capsule | undefined>;
  
  // Interaction operations
  recordInteraction(interaction: InsertCapsuleInteraction): Promise<CapsuleInteraction>;
  getCapsuleInteractions(capsuleId: number): Promise<CapsuleInteraction[]>;
  
  // Airdrop operations
  getAirdropClaim(address: string): Promise<any | undefined>;
  createAirdropClaim(claim: any): Promise<any>;
  
  // Referral operations
  createReferralCode(referral: any): Promise<any>;
  getReferralData(userId: string): Promise<any | undefined>;
  getReferralByCode(code: string): Promise<any | undefined>;
  getReferralReward(address: string): Promise<any | undefined>;
  createReferralReward(reward: any): Promise<any>;
  
  // Guardian Pass operations
  getGuardianPassCollection(address: string): Promise<any | undefined>;
  getGuardianPassMarketplaceData(): Promise<any>;
  checkGuardianPassEligibility(address: string): Promise<boolean>;
  createGuardianPass(passData: any): Promise<any>;
  getGuardianPassBenefits(address: string): Promise<any>;
  hasGuardianPass(address: string): Promise<boolean>;
  getHighestRarityPass(address: string): Promise<string | undefined>;
  getGuardianPassAPYBonus(address: string): Promise<number>;
  
  // Vault operations
  getVaultStats(): Promise<any>;
  getUserVaultPosition(address: string): Promise<any>;
  recordVaultDeposit(deposit: any): Promise<any>;
  recordVaultWithdrawal(withdrawal: any): Promise<any>;
  recordVaultCompound(compound: any): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUser(id: string, userData: Partial<UpsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...userData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserTier(id: string, tier: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ 
        userTier: tier,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async updateUserLastLogin(userId: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        lastLoginAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  async updateUserStake(userId: string, stakeAmount: number): Promise<void> {
    await db
      .update(users)
      .set({ 
        gttBalance: stakeAmount.toString(),
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  async createUser(userData: {
    email: string;
    passwordHash: string;
    firstName?: string;
    lastName?: string;
    tier: string;
    gttStakeAmount: number;
    emailVerified: boolean;
    isActive: boolean;
    agreedToTermsAt: Date;
  }): Promise<User> {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const [user] = await db
      .insert(users)
      .values({
        id: userId,
        email: userData.email,
        passwordHash: userData.passwordHash,
        firstName: userData.firstName,
        lastName: userData.lastName,
        userTier: userData.tier,
        gttBalance: userData.gttStakeAmount.toString(),
        isActive: userData.isActive,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    
    return user;
  }

  async getUserById(userId: string): Promise<User | undefined> {
    return this.getUser(userId);
  }

  // Capsule operations
  async createCapsule(capsuleData: any): Promise<Capsule> {
    const [capsule] = await db
      .insert(capsules)
      .values({
        title: capsuleData.title,
        content: capsuleData.content,
        creatorId: capsuleData.userId,
        type: capsuleData.capsuleType || "KNOWLEDGE",
        category: capsuleData.category,
        tags: capsuleData.tags || [],
        status: "draft",
        isPublic: true,
        griefScore: 0,
        credibilityScore: 0,
        truthYield: "0",
        metadata: capsuleData.metadata || {},
        heirAddress: capsuleData.heirAddress,
        unlockDate: capsuleData.unlockDate
      })
      .returning();
    return capsule;
  }

  async getUserCapsules(userId: string): Promise<Capsule[]> {
    return await db
      .select()
      .from(capsules)
      .where(eq(capsules.creatorId, userId))
      .orderBy(desc(capsules.createdAt));
  }

  async getCapsule(id: number): Promise<Capsule | undefined> {
    const [capsule] = await db
      .select()
      .from(capsules)
      .where(eq(capsules.id, id));
    return capsule;
  }

  async updateCapsule(id: number, updates: Partial<Capsule>): Promise<Capsule | undefined> {
    const [capsule] = await db
      .update(capsules)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(capsules.id, id))
      .returning();
    return capsule;
  }

  // Interaction operations
  async recordInteraction(interaction: InsertCapsuleInteraction): Promise<CapsuleInteraction> {
    const [result] = await db
      .insert(capsuleInteractions)
      .values(interaction)
      .returning();
    return result;
  }

  async getCapsuleInteractions(capsuleId: number): Promise<CapsuleInteraction[]> {
    return await db
      .select()
      .from(capsuleInteractions)
      .where(eq(capsuleInteractions.capsuleId, capsuleId))
      .orderBy(desc(capsuleInteractions.createdAt));
  }

  // Mock implementations for mainnet launch features
  // In production, these would use proper database tables
  
  // Airdrop operations
  async getAirdropClaim(address: string): Promise<any | undefined> {
    // Mock implementation - in production would query airdrop_claims table
    return null; // No claims found
  }

  async createAirdropClaim(claim: any): Promise<any> {
    // Mock implementation - in production would insert into airdrop_claims table
    return {
      id: Math.floor(Math.random() * 10000),
      ...claim,
      createdAt: new Date().toISOString()
    };
  }

  // Referral operations
  async createReferralCode(referral: any): Promise<any> {
    // Mock implementation - in production would insert into referral_codes table
    return {
      id: Math.floor(Math.random() * 10000),
      ...referral,
      referralLink: `https://guardianchain.app/signup?ref=${referral.code}`
    };
  }

  async getReferralData(userId: string): Promise<any | undefined> {
    // Mock implementation - return sample referral data
    return {
      code: 'GUARD1234',
      totalReferrals: 8,
      totalRewards: '400',
      pendingRewards: '150',
      referralLink: 'https://guardianchain.app/signup?ref=GUARD1234',
      recentReferrals: [
        {
          address: '0x1234...5678',
          joinDate: '2025-01-15',
          rewardEarned: '50',
          status: 'completed'
        },
        {
          address: '0x9876...4321',
          joinDate: '2025-01-20',
          rewardEarned: '50',
          status: 'pending'
        }
      ]
    };
  }

  async getReferralByCode(code: string): Promise<any | undefined> {
    // Mock implementation
    return {
      userId: 'demo-user',
      code,
      createdAt: new Date().toISOString()
    };
  }

  async getReferralReward(address: string): Promise<any | undefined> {
    // Mock implementation - check if user already used referral
    return null; // No existing reward found
  }

  async createReferralReward(reward: any): Promise<any> {
    // Mock implementation
    return {
      id: Math.floor(Math.random() * 10000),
      ...reward,
      createdAt: new Date().toISOString()
    };
  }

  // Guardian Pass operations
  async getGuardianPassCollection(address: string): Promise<any | undefined> {
    // Mock implementation - return sample Guardian Pass collection
    return {
      ownedPasses: [
        {
          tokenId: 42,
          rarity: 'Rare',
          tierName: 'Rare Guardian',
          boostedAPY: 500,
          stakingMultiplier: 12000,
          earlyDAOAccess: true,
          mintTime: '2025-01-15T10:30:00Z'
        },
        {
          tokenId: 157,
          rarity: 'Uncommon',
          tierName: 'Uncommon Guardian',
          boostedAPY: 250,
          stakingMultiplier: 11000,
          earlyDAOAccess: false,
          mintTime: '2025-01-20T14:45:00Z'
        }
      ],
      totalValue: '2,847.50',
      highestRarity: 'Rare',
      benefits: {
        totalAPYBoost: 750,
        stakingMultiplier: 1.2,
        daoVotingPower: 150,
        exclusiveFeatures: [
          'Early DAO proposal access',
          'Premium vault strategies',
          'Priority customer support',
          'Exclusive community channels'
        ]
      }
    };
  }

  async getGuardianPassMarketplaceData(): Promise<any> {
    // Mock marketplace data
    return {
      totalSupply: 847,
      floorPrice: '0.25',
      volume24h: '12.5',
      rarityDistribution: {
        Common: { minted: 423, available: 77 },
        Uncommon: { minted: 267, available: 33 },
        Rare: { minted: 128, available: 22 },
        Epic: { minted: 24, available: 16 },
        Legendary: { minted: 5, available: 5 }
      }
    };
  }

  async checkGuardianPassEligibility(address: string): Promise<boolean> {
    // Mock implementation - in production would check eligibility criteria
    return true; // All addresses eligible for demo
  }

  async createGuardianPass(passData: any): Promise<any> {
    // Mock implementation
    return {
      id: Math.floor(Math.random() * 10000),
      ...passData,
      createdAt: new Date().toISOString()
    };
  }

  async getGuardianPassBenefits(address: string): Promise<any> {
    // Mock implementation
    return {
      totalAPYBoost: 750,
      stakingMultiplier: 1.2,
      daoVotingPower: 150,
      exclusiveFeatures: [
        'Early DAO proposal access',
        'Premium vault strategies'
      ]
    };
  }

  async hasGuardianPass(address: string): Promise<boolean> {
    // Mock implementation
    return Math.random() > 0.3; // 70% chance of having a pass
  }

  async getHighestRarityPass(address: string): Promise<string | undefined> {
    // Mock implementation
    const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
    return rarities[Math.floor(Math.random() * rarities.length)];
  }

  async getGuardianPassAPYBonus(address: string): Promise<number> {
    // Mock implementation - return APY bonus in basis points
    const hasPass = await this.hasGuardianPass(address);
    return hasPass ? 500 : 0; // 5% bonus if has pass
  }

  // Vault operations
  async getVaultStats(): Promise<any> {
    // Mock vault statistics
    return {
      tvl: '2,547,832',
      apy: '25.7',
      userStaked: '15,000',
      pendingRewards: '1,247.50',
      sharePrice: '1.0847',
      nextCompoundTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      totalUsers: 1247,
      performanceFee: '2%'
    };
  }

  async getUserVaultPosition(address: string): Promise<any> {
    // Mock user vault position
    return {
      stakedAmount: '15,000',
      shares: '13,833.24',
      totalRewardsEarned: '3,247.89',
      autoCompoundedAmount: '1,847.32',
      lastDepositTime: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  async recordVaultDeposit(deposit: any): Promise<any> {
    // Mock implementation
    return {
      id: Math.floor(Math.random() * 10000),
      ...deposit,
      status: 'completed'
    };
  }

  async recordVaultWithdrawal(withdrawal: any): Promise<any> {
    // Mock implementation
    return {
      id: Math.floor(Math.random() * 10000),
      ...withdrawal,
      status: 'completed'
    };
  }

  async recordVaultCompound(compound: any): Promise<any> {
    // Mock implementation
    return {
      id: Math.floor(Math.random() * 10000),
      ...compound,
      status: 'completed'
    };
  }
}

// Export storage instance
export const storage = new DatabaseStorage();