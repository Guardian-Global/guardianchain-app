import { 
  users, capsules, verifications, transactions, achievements,
  type User, type InsertUser,
  type Capsule, type InsertCapsule,
  type Verification, type InsertVerification,
  type Transaction, type InsertTransaction,
  type Achievement, type InsertAchievement
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByAuth0Id(auth0Id: string): Promise<User | undefined>;
  getUserByWalletAddress(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  updateUserStripeInfo(id: number, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User>;
  getTopUsers(limit?: number): Promise<User[]>;

  // Capsule operations
  getCapsule(id: number): Promise<Capsule | undefined>;
  getCapsules(filters?: { status?: string; creatorId?: number; isPublic?: boolean; category?: string; limit?: number; offset?: number }): Promise<Capsule[]>;
  createCapsule(capsule: InsertCapsule): Promise<Capsule>;
  updateCapsule(id: number, updates: Partial<Capsule>): Promise<Capsule>;
  getFeaturedCapsules(limit?: number): Promise<Capsule[]>;
  getTrendingCapsules(limit?: number): Promise<Capsule[]>;

  // Verification operations
  getVerification(id: number): Promise<Verification | undefined>;
  getVerificationsByCapsule(capsuleId: number): Promise<Verification[]>;
  getVerificationsByUser(userId: number): Promise<Verification[]>;
  createVerification(verification: InsertVerification): Promise<Verification>;

  // Transaction operations
  getTransaction(id: number): Promise<Transaction | undefined>;
  getTransactionsByUser(userId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;

  // Achievement operations
  getAchievement(id: number): Promise<Achievement | undefined>;
  getAchievementsByUser(userId: number): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;

  // Stats
  getStats(): Promise<{
    totalCapsules: number;
    verifiedTruths: number;
    totalRewards: string;
    activeUsers: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private capsules: Map<number, Capsule>;
  private verifications: Map<number, Verification>;
  private transactions: Map<number, Transaction>;
  private achievements: Map<number, Achievement>;
  private currentUserId: number = 1;
  private currentCapsuleId: number = 1;
  private currentVerificationId: number = 1;
  private currentTransactionId: number = 1;
  private currentAchievementId: number = 1;

  constructor() {
    this.users = new Map();
    this.capsules = new Map();
    this.verifications = new Map();
    this.transactions = new Map();
    this.achievements = new Map();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByAuth0Id(auth0Id: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.auth0Id === auth0Id);
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.walletAddress === walletAddress);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = {
      ...insertUser,
      id,
      griefScore: "0.0",
      gttBalance: "0.00",
      totalCapsules: 0,
      verifiedCapsules: 0,
      isVerified: false,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserStripeInfo(id: number, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User> {
    return this.updateUser(id, { stripeCustomerId, stripeSubscriptionId });
  }

  async getTopUsers(limit: number = 10): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => parseFloat(b.griefScore || "0") - parseFloat(a.griefScore || "0"))
      .slice(0, limit);
  }

  async getCapsule(id: number): Promise<Capsule | undefined> {
    return this.capsules.get(id);
  }

  async getCapsules(filters: { status?: string; creatorId?: number; isPublic?: boolean; category?: string; limit?: number; offset?: number } = {}): Promise<Capsule[]> {
    let capsules = Array.from(this.capsules.values());

    if (filters.status) {
      capsules = capsules.filter(c => c.status === filters.status);
    }
    if (filters.creatorId) {
      capsules = capsules.filter(c => c.creatorId === filters.creatorId);
    }
    if (filters.isPublic !== undefined) {
      capsules = capsules.filter(c => c.isPublic === filters.isPublic);
    }
    if (filters.category) {
      capsules = capsules.filter(c => c.category === filters.category);
    }

    capsules.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    if (filters.offset) {
      capsules = capsules.slice(filters.offset);
    }
    if (filters.limit) {
      capsules = capsules.slice(0, filters.limit);
    }

    return capsules;
  }

  async createCapsule(insertCapsule: InsertCapsule): Promise<Capsule> {
    const id = this.currentCapsuleId++;
    const now = new Date();
    const capsule: Capsule = {
      ...insertCapsule,
      id,
      status: "pending",
      griefScore: "0.0",
      verificationCount: 0,
      replayCount: 0,
      gttReward: "0.00",
      imageUrl: null,
      ipfsHash: null,
      nftTokenId: null,
      docusignEnvelopeId: null,
      isPublic: true,
      metadata: null,
      createdAt: now,
      updatedAt: now,
    };
    this.capsules.set(id, capsule);
    
    // Update user stats
    const user = this.users.get(insertCapsule.creatorId);
    if (user) {
      await this.updateUser(user.id, { totalCapsules: user.totalCapsules + 1 });
    }
    
    return capsule;
  }

  async updateCapsule(id: number, updates: Partial<Capsule>): Promise<Capsule> {
    const capsule = this.capsules.get(id);
    if (!capsule) throw new Error("Capsule not found");
    
    const updatedCapsule = { ...capsule, ...updates, updatedAt: new Date() };
    this.capsules.set(id, updatedCapsule);
    return updatedCapsule;
  }

  async getFeaturedCapsules(limit: number = 6): Promise<Capsule[]> {
    return Array.from(this.capsules.values())
      .filter(c => c.status === "verified" && c.isPublic)
      .sort((a, b) => parseFloat(b.griefScore || "0") - parseFloat(a.griefScore || "0"))
      .slice(0, limit);
  }

  async getTrendingCapsules(limit: number = 10): Promise<Capsule[]> {
    return Array.from(this.capsules.values())
      .filter(c => c.isPublic)
      .sort((a, b) => (b.verificationCount + b.replayCount) - (a.verificationCount + a.replayCount))
      .slice(0, limit);
  }

  async getVerification(id: number): Promise<Verification | undefined> {
    return this.verifications.get(id);
  }

  async getVerificationsByCapsule(capsuleId: number): Promise<Verification[]> {
    return Array.from(this.verifications.values()).filter(v => v.capsuleId === capsuleId);
  }

  async getVerificationsByUser(userId: number): Promise<Verification[]> {
    return Array.from(this.verifications.values()).filter(v => v.verifierId === userId);
  }

  async createVerification(insertVerification: InsertVerification): Promise<Verification> {
    const id = this.currentVerificationId++;
    const verification: Verification = {
      ...insertVerification,
      id,
      createdAt: new Date(),
    };
    this.verifications.set(id, verification);
    return verification;
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async getTransactionsByUser(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(t => t.userId === userId);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      createdAt: new Date(),
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getAchievement(id: number): Promise<Achievement | undefined> {
    return this.achievements.get(id);
  }

  async getAchievementsByUser(userId: number): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter(a => a.userId === userId);
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = this.currentAchievementId++;
    const achievement: Achievement = {
      ...insertAchievement,
      id,
      earnedAt: new Date(),
    };
    this.achievements.set(id, achievement);
    return achievement;
  }

  async getStats(): Promise<{
    totalCapsules: number;
    verifiedTruths: number;
    totalRewards: string;
    activeUsers: number;
  }> {
    const totalCapsules = this.capsules.size;
    const verifiedTruths = Array.from(this.capsules.values()).filter(c => c.status === "verified").length;
    const totalRewards = Array.from(this.transactions.values())
      .filter(t => t.type === "reward")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)
      .toFixed(2);
    const activeUsers = this.users.size;

    return {
      totalCapsules,
      verifiedTruths,
      totalRewards,
      activeUsers,
    };
  }
}

export const storage = new MemStorage();
