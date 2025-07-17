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
    
    // Initialize with demo data for analytics
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Create demo users
    const demoUsers = [
      { id: 1, auth0Id: "auth0|user1", username: "climate_researcher", email: "researcher@climate.org", walletAddress: "0x1234567890abcdef1234567890abcdef12345678" },
      { id: 2, auth0Id: "auth0|user2", username: "supply_chain_investigator", email: "investigator@transparency.org", walletAddress: "0x2345678901bcdef0123456789abcdef012345679" },
      { id: 3, auth0Id: "auth0|user3", username: "healthcare_whistleblower", email: "whistleblower@healthcare.org", walletAddress: "0x3456789012cdef01234567890abcdef0123456780" }
    ];

    demoUsers.forEach(userData => {
      const user = {
        ...userData,
        griefScore: "0.2",
        gttBalance: "0.00",
        totalCapsules: 1,
        verifiedCapsules: 1,
        isVerified: true,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.users.set(user.id, user);
    });

    // Create demo capsules
    const demoCapsules = [
      {
        id: 101,
        title: "Climate Change Evidence: Arctic Ice Sheet Melting Acceleration",
        description: "Comprehensive analysis of arctic ice sheet data from 2020-2024 showing unprecedented melting rates.",
        content: "Detailed scientific analysis of satellite data, temperature readings, and ice thickness measurements from multiple Arctic research stations. The data shows a 340% acceleration in ice loss compared to the 1990-2010 baseline period.",
        category: "science",
        status: "sealed",
        creatorId: 1,
        griefScore: "0.2",
        verificationCount: 15,
        replayCount: 89,
        viewCount: 342,
        shareCount: 67,
        minted: true,
        truthYield: "45.60",
        gttReward: "4.56",
        gttClaimed: "0.00",
        claimTxHash: null,
        imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=101&backgroundColor=1e293b",
        ipfsHash: "QmX9ZV7Y8W6U5T4R3Q2P1O0N9M8L7K6J5I4H3G2F1E0D9",
        nftTokenId: "12345",
        docusignEnvelopeId: "env_climate_2024",
        veritasSealUrl: "https://demo.docusign.net/climate-seal",
        isPublic: true,
        tags: ["climate", "science", "arctic"],
        evidence: null,
        metadata: null,
        createdAt: new Date("2024-01-15T10:30:00Z"),
        updatedAt: new Date("2024-02-20T14:45:00Z")
      },
      {
        id: 102,
        title: "Supply Chain Transparency: Fast Fashion Environmental Impact",
        description: "Investigation into hidden environmental costs of major fast fashion brands' supply chains.",
        content: "Detailed investigation revealing toxic chemical usage, water pollution, and labor violations across 50+ factories in Southeast Asia. Includes photo evidence, chemical analysis reports, and worker testimonies.",
        category: "investigation",
        status: "verified",
        creatorId: 2,
        griefScore: "0.8",
        verificationCount: 23,
        replayCount: 156,
        viewCount: 1204,
        shareCount: 189,
        minted: false,
        truthYield: "78.30",
        gttReward: "7.83",
        gttClaimed: "0.00",
        claimTxHash: null,
        imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=102&backgroundColor=2563eb",
        ipfsHash: null,
        nftTokenId: null,
        docusignEnvelopeId: null,
        veritasSealUrl: null,
        isPublic: true,
        tags: ["environment", "fashion", "supply-chain"],
        evidence: null,
        metadata: null,
        createdAt: new Date("2024-02-10T09:15:00Z"),
        updatedAt: new Date("2024-02-25T16:20:00Z")
      },
      {
        id: 103,
        title: "Corporate Whistleblower: Healthcare Data Privacy Violations",
        description: "Internal documents revealing systematic patient data privacy violations at major healthcare provider.",
        content: "Leaked internal emails, database access logs, and compliance reports showing deliberate HIPAA violations affecting 2.3 million patients. Includes executive correspondence authorizing illegal data sharing practices.",
        category: "whistleblowing",
        status: "sealed",
        creatorId: 3,
        griefScore: "0.1",
        verificationCount: 45,
        replayCount: 267,
        viewCount: 2891,
        shareCount: 423,
        minted: true,
        truthYield: "156.75",
        gttReward: "23.51",
        gttClaimed: "0.00",
        claimTxHash: null,
        imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=103&backgroundColor=7c3aed",
        ipfsHash: "QmP8M7L6K5J4I3H2G1F0E9D8C7B6A5Z9Y8X7W6V5U4T3",
        nftTokenId: "67890",
        docusignEnvelopeId: "env_healthcare_2024",
        veritasSealUrl: "https://demo.docusign.net/healthcare-seal",
        isPublic: true,
        tags: ["healthcare", "privacy", "whistleblowing"],
        evidence: null,
        metadata: null,
        createdAt: new Date("2024-01-05T14:22:00Z"),
        updatedAt: new Date("2024-03-15T11:30:00Z")
      }
    ];

    demoCapsules.forEach(capsuleData => {
      this.capsules.set(capsuleData.id, capsuleData);
    });

    // Update counters
    this.currentUserId = 4;
    this.currentCapsuleId = 104;
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
      walletAddress: insertUser.walletAddress || null,
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

    capsules.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));

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
      viewCount: 0,
      shareCount: 0,
      minted: false,
      truthYield: "0.00",
      gttReward: "0.00",
      gttClaimed: "0.00",
      claimTxHash: null,
      imageUrl: null,
      ipfsHash: null,
      nftTokenId: null,
      docusignEnvelopeId: null,
      veritasSealUrl: null,
      isPublic: true,
      tags: null,
      evidence: null,
      metadata: null,
      createdAt: now,
      updatedAt: now,
    };
    this.capsules.set(id, capsule);
    
    // Update user stats
    const user = this.users.get(insertCapsule.creatorId);
    if (user) {
      await this.updateUser(user.id, { totalCapsules: (user.totalCapsules || 0) + 1 });
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
      .sort((a, b) => ((b.verificationCount || 0) + (b.replayCount || 0)) - ((a.verificationCount || 0) + (a.replayCount || 0)))
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
      evidence: insertVerification.evidence || null,
      comment: insertVerification.comment || null,
      reputationStake: insertVerification.reputationStake || null,
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
      description: insertTransaction.description || null,
      capsuleId: insertTransaction.capsuleId || null,
      txHash: insertTransaction.txHash || null,
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
      metadata: insertAchievement.metadata || null,
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
