import {
  users,
  capsules,
  newsletterSubscribers,
  capsuleVotes,
  type User,
  type UpsertUser,
  type Capsule,
  type InsertCapsule,
  type NewsletterSubscriber,
  type InsertNewsletterSubscriber,
  type CapsuleVote,
  type InsertCapsuleVote,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;

  // Capsule operations
  getCapsule(id: string): Promise<Capsule | undefined>;
  getCapsulesByUser(userId: string): Promise<Capsule[]>;
  getAllCapsules(): Promise<Capsule[]>;
  createCapsule(capsule: InsertCapsule): Promise<Capsule>;
  updateCapsule(id: string, capsule: Partial<Capsule>): Promise<Capsule>;
  deleteCapsule(id: string): Promise<void>;

  // Vote operations
  recordVote(vote: InsertCapsuleVote): Promise<CapsuleVote>;
  getVotesByCapsule(capsuleId: string): Promise<CapsuleVote[]>;
  getUserVote(
    capsuleId: string,
    wallet: string,
  ): Promise<CapsuleVote | undefined>;

  // Newsletter operations
  subscribeToNewsletter(
    subscriber: InsertNewsletterSubscriber,
  ): Promise<NewsletterSubscriber>;


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
    const [capsule] = await db
      .select()
      .from(capsules)
      .where(eq(capsules.id, id));
    return capsule;
  }

  async getCapsulesByUser(userId: string): Promise<Capsule[]> {
    return await db
      .select()
      .from(capsules)
      .where(eq(capsules.authorId, userId))
      .orderBy(desc(capsules.createdAt));
  }

  async getAllCapsules(): Promise<Capsule[]> {
    return await db.select().from(capsules).orderBy(desc(capsules.createdAt));
  }

  async createCapsule(capsuleData: InsertCapsule): Promise<Capsule> {
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

  async updateCapsule(
    id: string,
    capsuleData: Partial<Capsule>,
  ): Promise<Capsule> {
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

  async deleteCapsule(id: string): Promise<void> {
    await db.delete(capsules).where(eq(capsules.id, id));
  }

  // Vote operations
  async recordVote(voteData: InsertCapsuleVote): Promise<CapsuleVote> {
    // Check if user has already voted on this capsule
    const existingVote = await this.getUserVote(
      voteData.capsuleId,
      voteData.voterWallet,
    );

    if (existingVote) {
      // Update existing vote
      const [vote] = await db
        .update(capsuleVotes)
        .set({
          voteType: voteData.voteType,
          createdAt: new Date(),
        })
        .where(
          and(
            eq(capsuleVotes.capsuleId, voteData.capsuleId),
            eq(capsuleVotes.voterWallet, voteData.voterWallet),
          ),
        )
        .returning();
      return vote;
    } else {
      // Create new vote
      const [vote] = await db.insert(capsuleVotes).values(voteData).returning();
      return vote;
    }
  }

  async getVotesByCapsule(capsuleId: string): Promise<CapsuleVote[]> {
    return await db
      .select()
      .from(capsuleVotes)
      .where(eq(capsuleVotes.capsuleId, capsuleId))
      .orderBy(desc(capsuleVotes.createdAt));
  }

  async getUserVote(
    capsuleId: string,
    wallet: string,
  ): Promise<CapsuleVote | undefined> {
    const [vote] = await db
      .select()
      .from(capsuleVotes)
      .where(
        and(
          eq(capsuleVotes.capsuleId, capsuleId),
          eq(capsuleVotes.voterWallet, wallet),
        ),
      );
    return vote;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Newsletter operations
  async subscribeToNewsletter(
    subscriberData: InsertNewsletterSubscriber,
  ): Promise<NewsletterSubscriber> {
    const [subscriber] = await db
      .insert(newsletterSubscribers)
      .values({
        ...subscriberData,
        subscribedAt: new Date(),
      })
      .returning();
    return subscriber;
  }


}

export const storage = new DatabaseStorage();
