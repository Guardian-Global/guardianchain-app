import {
  users,
  capsules,
  verifications,
  transactions,
  achievements,
  assets,
  type User,
  type UpsertUser,
  type NewUser,
  type Capsule,
  type NewCapsule,
  type Verification,
  type NewVerification,
  type Transaction,
  type NewTransaction,
  type Achievement,
  type NewAchievement,
  type Asset,
  type NewAsset,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: NewUser): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Capsule operations
  getCapsule(id: string): Promise<Capsule | undefined>;
  getCapsulesByUser(userId: string): Promise<Capsule[]>;
  createCapsule(capsule: NewCapsule): Promise<Capsule>;
  updateCapsule(id: string, capsule: Partial<Capsule>): Promise<Capsule>;
  
  // Verification operations
  getVerificationsByCapsule(capsuleId: string): Promise<Verification[]>;
  createVerification(verification: NewVerification): Promise<Verification>;
  
  // Transaction operations
  getTransactionsByUser(userId: string): Promise<Transaction[]>;
  createTransaction(transaction: NewTransaction): Promise<Transaction>;
  
  // Achievement operations
  getAchievementsByUser(userId: string): Promise<Achievement[]>;
  createAchievement(achievement: NewAchievement): Promise<Achievement>;
  
  // Asset operations
  getAssetsByUser(userId: string): Promise<Asset[]>;
  createAsset(asset: NewAsset): Promise<Asset>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: NewUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return user;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
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

  // Capsule operations
  async getCapsule(id: string): Promise<Capsule | undefined> {
    const [capsule] = await db.select().from(capsules).where(eq(capsules.id, id));
    return capsule;
  }

  async getCapsulesByUser(userId: string): Promise<Capsule[]> {
    return await db
      .select()
      .from(capsules)
      .where(eq(capsules.authorId, userId))
      .orderBy(desc(capsules.createdAt));
  }

  async createCapsule(capsuleData: NewCapsule): Promise<Capsule> {
    const [capsule] = await db
      .insert(capsules)
      .values({
        ...capsuleData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return capsule;
  }

  async updateCapsule(id: string, capsuleData: Partial<Capsule>): Promise<Capsule> {
    const [capsule] = await db
      .update(capsules)
      .set({
        ...capsuleData,
        updatedAt: new Date(),
      })
      .where(eq(capsules.id, id))
      .returning();
    return capsule;
  }

  // Verification operations
  async getVerificationsByCapsule(capsuleId: string): Promise<Verification[]> {
    return await db
      .select()
      .from(verifications)
      .where(eq(verifications.capsuleId, capsuleId))
      .orderBy(desc(verifications.createdAt));
  }

  async createVerification(verificationData: NewVerification): Promise<Verification> {
    const [verification] = await db
      .insert(verifications)
      .values({
        ...verificationData,
        createdAt: new Date(),
      })
      .returning();
    return verification;
  }

  // Transaction operations
  async getTransactionsByUser(userId: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.fromUserId, userId),
          eq(transactions.toUserId, userId)
        )
      )
      .orderBy(desc(transactions.createdAt));
  }

  async createTransaction(transactionData: NewTransaction): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values({
        ...transactionData,
        createdAt: new Date(),
      })
      .returning();
    return transaction;
  }

  // Achievement operations
  async getAchievementsByUser(userId: string): Promise<Achievement[]> {
    return await db
      .select()
      .from(achievements)
      .where(eq(achievements.userId, userId))
      .orderBy(desc(achievements.unlockedAt));
  }

  async createAchievement(achievementData: NewAchievement): Promise<Achievement> {
    const [achievement] = await db
      .insert(achievements)
      .values({
        ...achievementData,
        unlockedAt: new Date(),
      })
      .returning();
    return achievement;
  }

  // Asset operations
  async getAssetsByUser(userId: string): Promise<Asset[]> {
    return await db
      .select()
      .from(assets)
      .where(eq(assets.userId, userId))
      .orderBy(desc(assets.uploadedAt));
  }

  async createAsset(assetData: NewAsset): Promise<Asset> {
    const [asset] = await db
      .insert(assets)
      .values({
        ...assetData,
        uploadedAt: new Date(),
      })
      .returning();
    return asset;
  }
}

// Create storage instance
export const storage = new DatabaseStorage();