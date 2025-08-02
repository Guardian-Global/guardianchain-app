import {
  users,
  capsules,
  newsletterSubscribers,
  type User,
  type UpsertUser,
  type Capsule,
  type InsertCapsule,
  type NewsletterSubscriber,
  type InsertNewsletterSubscriber,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Capsule operations
  getCapsule(id: string): Promise<Capsule | undefined>;
  getCapsulesByUser(userId: string): Promise<Capsule[]>;
  createCapsule(capsule: InsertCapsule): Promise<Capsule>;
  updateCapsule(id: string, capsule: Partial<Capsule>): Promise<Capsule>;
  deleteCapsule(id: string): Promise<void>;
  
  // Newsletter operations
  subscribeToNewsletter(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
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

  async deleteCapsule(id: string): Promise<void> {
    await db.delete(capsules).where(eq(capsules.id, id));
  }

  // Newsletter operations
  async subscribeToNewsletter(subscriberData: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
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