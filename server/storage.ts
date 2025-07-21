import { 
  users, capsules,
  type User, type UpsertUser,
  type Capsule, type InsertCapsule
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createAdminUser(adminData: {
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    isActive: boolean;
    passwordHash: string;
  }): Promise<User>;
  updateUserRoles(userId: string, roles: string[]): Promise<User>;
  getUserByAuth0Id?(auth0Id: string): Promise<User | undefined>;
  getUserByWallet?(walletAddress: string): Promise<User | undefined>;
  getUserByWalletAddress?(walletAddress: string): Promise<User | undefined>;

  // Capsule operations
  getCapsule(id: number): Promise<Capsule | undefined>;
  getCapsules(filters?: { 
    status?: string; 
    creatorId?: string; 
    isPublic?: boolean; 
    category?: string; 
    limit?: number; 
    offset?: number 
  }): Promise<Capsule[]>;
  getCapsulesByCreator(creatorId: string): Promise<Capsule[]>;
  createCapsule(capsule: InsertCapsule): Promise<Capsule>;

  // Stats
  getStats(): Promise<{
    totalCapsules: number;
    verifiedTruths: number;
    totalRewards: string;
    activeUsers: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    // For now return mock data - will be implemented with actual database
    return {
      id,
      email: "user@example.com",
      firstName: "John",
      lastName: "Doe",
      profileImageUrl: null,
      username: null,
      walletAddress: null,
      bio: null,
      avatar: null,
      reputation: 0,
      xpPoints: 0,
      totalCapsules: 0,
      verifiedCapsules: 0,
      gttBalance: "0",
      badges: [],
      achievements: [],
      socialLinks: {},
      isVerified: false,
      roles: ["USER"],
      isActive: true,
      passwordHash: null,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    // Mock implementation for now
    if (email === process.env.MASTER_ADMIN_EMAIL) {
      return {
        id: "master-admin-1",
        email,
        firstName: "Master",
        lastName: "Admin",
        profileImageUrl: null,
        username: null,
        walletAddress: null,
        bio: null,
        avatar: null,
        reputation: 0,
        xpPoints: 0,
        totalCapsules: 0,
        verifiedCapsules: 0,
        gttBalance: "0",
        badges: [],
        achievements: [],
        socialLinks: {},
        isVerified: true,
        roles: ["MASTER_ADMIN"],
        isActive: true,
        passwordHash: null,
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    return undefined;
  }

  async createAdminUser(adminData: {
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    isActive: boolean;
    passwordHash: string;
  }): Promise<User> {
    const newUser: User = {
      id: `admin-${Date.now()}`,
      email: adminData.email,
      firstName: adminData.firstName,
      lastName: adminData.lastName,
      profileImageUrl: null,
      username: null,
      walletAddress: null,
      bio: null,
      avatar: null,
      reputation: 0,
      xpPoints: 0,
      totalCapsules: 0,
      verifiedCapsules: 0,
      gttBalance: "0",
      badges: [],
      achievements: [],
      socialLinks: {},
      isVerified: true,
      roles: adminData.roles,
      isActive: adminData.isActive,
      passwordHash: adminData.passwordHash,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return newUser;
  }

  async updateUserRoles(userId: string, roles: string[]): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return {
      ...user,
      roles,
      updatedAt: new Date(),
    };
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // For now return mock data - will be implemented with actual database
    return {
      id: userData.id || "mock-id",
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      profileImageUrl: userData.profileImageUrl,
      username: userData.username || null,
      walletAddress: userData.walletAddress || null,
      bio: userData.bio || null,
      avatar: userData.avatar || null,
      reputation: userData.reputation || 0,
      xpPoints: userData.xpPoints || 0,
      totalCapsules: userData.totalCapsules || 0,
      verifiedCapsules: userData.verifiedCapsules || 0,
      gttBalance: userData.gttBalance || "0",
      badges: userData.badges || [],
      achievements: userData.achievements || [],
      socialLinks: userData.socialLinks || {},
      isVerified: userData.isVerified || false,
      roles: userData.roles || ["USER"],
      isActive: userData.isActive !== undefined ? userData.isActive : true,
      passwordHash: userData.passwordHash || null,
      lastLoginAt: userData.lastLoginAt || null,
      createdAt: userData.createdAt || new Date(),
      updatedAt: new Date(),
    };
  }

  async getCapsule(id: number): Promise<Capsule | undefined> {
    return undefined; // Mock implementation
  }

  async getCapsules(filters?: { 
    status?: string; 
    creatorId?: string; 
    isPublic?: boolean; 
    category?: string; 
    limit?: number; 
    offset?: number 
  }): Promise<Capsule[]> {
    return []; // Mock implementation
  }

  async getCapsulesByCreator(creatorId: string): Promise<Capsule[]> {
    return []; // Mock implementation
  }

  async createCapsule(capsule: InsertCapsule): Promise<Capsule> {
    const newCapsule: Capsule = {
      id: Date.now(),
      title: capsule.title,
      content: capsule.content,
      creatorId: capsule.creatorId,
      type: capsule.type || "STANDARD",
      category: capsule.category,
      tags: capsule.tags || [],
      status: capsule.status || "draft",
      isPublic: capsule.isPublic !== false,
      griefScore: capsule.griefScore || 0,
      credibilityScore: capsule.credibilityScore || 0,
      viewCount: capsule.viewCount || 0,
      shareCount: capsule.shareCount || 0,
      voteCount: capsule.voteCount || 0,
      truthYield: capsule.truthYield || "0",
      ipfsHash: capsule.ipfsHash,
      nftTokenId: capsule.nftTokenId,
      nftContractAddress: capsule.nftContractAddress,
      metadata: capsule.metadata || {},
      blocks: capsule.blocks || [],
      parentCapsuleId: capsule.parentCapsuleId,
      version: capsule.version || 1,
      evolutionLevel: capsule.evolutionLevel || 1,
      collaborators: capsule.collaborators || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return newCapsule;
  }

  async getStats(): Promise<{
    totalCapsules: number;
    verifiedTruths: number;
    totalRewards: string;
    activeUsers: number;
  }> {
    return {
      totalCapsules: 0,
      verifiedTruths: 0,
      totalRewards: "0",
      activeUsers: 0,
    };
  }
}

export class MemStorage implements IStorage {
  private users: User[] = [];
  private capsules: Capsule[] = [];

  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUserIndex = this.users.findIndex(u => u.id === userData.id);
    const user: User = {
      id: userData.id || `user-${Date.now()}`,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      profileImageUrl: userData.profileImageUrl,
      username: userData.username || null,
      walletAddress: userData.walletAddress || null,
      bio: userData.bio || null,
      avatar: userData.avatar || null,
      reputation: userData.reputation || 0,
      xpPoints: userData.xpPoints || 0,
      totalCapsules: userData.totalCapsules || 0,
      verifiedCapsules: userData.verifiedCapsules || 0,
      gttBalance: userData.gttBalance || "0",
      badges: userData.badges || [],
      achievements: userData.achievements || [],
      socialLinks: userData.socialLinks || {},
      isVerified: userData.isVerified || false,
      roles: userData.roles || ["USER"],
      isActive: userData.isActive !== undefined ? userData.isActive : true,
      passwordHash: userData.passwordHash || null,
      lastLoginAt: userData.lastLoginAt || null,
      createdAt: userData.createdAt || new Date(),
      updatedAt: new Date(),
    };

    if (existingUserIndex >= 0) {
      this.users[existingUserIndex] = user;
    } else {
      this.users.push(user);
    }
    
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find(u => u.email === email);
  }

  async createAdminUser(adminData: {
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    isActive: boolean;
    passwordHash: string;
  }): Promise<User> {
    const newUser: User = {
      id: `admin-${Date.now()}`,
      email: adminData.email,
      firstName: adminData.firstName,
      lastName: adminData.lastName,
      profileImageUrl: null,
      username: null,
      walletAddress: null,
      bio: null,
      avatar: null,
      reputation: 1000,
      xpPoints: 1000,
      totalCapsules: 0,
      verifiedCapsules: 0,
      gttBalance: "1000",
      badges: ["ADMIN"],
      achievements: [],
      socialLinks: {},
      isVerified: true,
      roles: adminData.roles,
      isActive: adminData.isActive,
      passwordHash: adminData.passwordHash,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.users.push(newUser);
    return newUser;
  }

  async updateUserRoles(userId: string, roles: string[]): Promise<User> {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error("User not found");
    }
    
    this.users[userIndex] = {
      ...this.users[userIndex],
      roles,
      updatedAt: new Date(),
    };
    
    return this.users[userIndex];
  }

  async getCapsule(id: number): Promise<Capsule | undefined> {
    return this.capsules.find(c => c.id === id);
  }

  async getCapsules(filters?: { 
    status?: string; 
    creatorId?: string; 
    isPublic?: boolean; 
    category?: string; 
    limit?: number; 
    offset?: number 
  }): Promise<Capsule[]> {
    let filtered = [...this.capsules];
    
    if (filters?.status) {
      filtered = filtered.filter(c => c.status === filters.status);
    }
    if (filters?.creatorId) {
      filtered = filtered.filter(c => c.creatorId === filters.creatorId);
    }
    if (filters?.isPublic !== undefined) {
      filtered = filtered.filter(c => c.isPublic === filters.isPublic);
    }
    if (filters?.category) {
      filtered = filtered.filter(c => c.category === filters.category);
    }
    
    const offset = filters?.offset || 0;
    const limit = filters?.limit || 50;
    
    return filtered.slice(offset, offset + limit);
  }

  async getCapsulesByCreator(creatorId: string): Promise<Capsule[]> {
    return this.capsules.filter(c => c.creatorId === creatorId);
  }

  async createCapsule(capsule: InsertCapsule): Promise<Capsule> {
    const newCapsule: Capsule = {
      id: Date.now(),
      title: capsule.title,
      content: capsule.content,
      creatorId: capsule.creatorId,
      type: capsule.type || "STANDARD",
      category: capsule.category,
      tags: capsule.tags || [],
      status: capsule.status || "draft",
      isPublic: capsule.isPublic !== false,
      griefScore: capsule.griefScore || 0,
      credibilityScore: capsule.credibilityScore || 0,
      viewCount: capsule.viewCount || 0,
      shareCount: capsule.shareCount || 0,
      voteCount: capsule.voteCount || 0,
      truthYield: capsule.truthYield || "0",
      ipfsHash: capsule.ipfsHash,
      nftTokenId: capsule.nftTokenId,
      nftContractAddress: capsule.nftContractAddress,
      metadata: capsule.metadata || {},
      blocks: capsule.blocks || [],
      parentCapsuleId: capsule.parentCapsuleId,
      version: capsule.version || 1,
      evolutionLevel: capsule.evolutionLevel || 1,
      collaborators: capsule.collaborators || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.capsules.push(newCapsule);
    return newCapsule;
  }

  async getStats(): Promise<{
    totalCapsules: number;
    verifiedTruths: number;
    totalRewards: string;
    activeUsers: number;
  }> {
    return {
      totalCapsules: this.capsules.length,
      verifiedTruths: this.capsules.filter(c => c.status === "verified").length,
      totalRewards: "0",
      activeUsers: this.users.length,
    };
  }
}

// Use MemStorage for now, will switch to DatabaseStorage when DB is properly configured
export const storage = new MemStorage();