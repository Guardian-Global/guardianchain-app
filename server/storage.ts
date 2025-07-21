import {
  users,
  capsules,
  capsuleInteractions,
  moderationFlags,
  yieldTransactions,
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
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, userData: Partial<UpsertUser>): Promise<User>;
  updateUserTier(id: string, tier: string): Promise<User | undefined>;
  
  // Capsule operations
  createCapsule(capsuleData: any): Promise<Capsule>;
  getUserCapsules(userId: string): Promise<Capsule[]>;
  getCapsule(id: number): Promise<Capsule | undefined>;
  updateCapsule(id: number, updates: Partial<Capsule>): Promise<Capsule | undefined>;
  
  // Interaction operations
  recordInteraction(interaction: InsertCapsuleInteraction): Promise<CapsuleInteraction>;
  getCapsuleInteractions(capsuleId: number): Promise<CapsuleInteraction[]>;
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
}

// Export storage instance
export const storage = new DatabaseStorage();