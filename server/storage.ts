import { 
  users, 
  userSessions, 
  userActivities, 
  userStats,
  capsules,
  type User, 
  type InsertUser,
  type UpdateUser,
  type UserSession,
  type InsertUserSession,
  type UserActivity,
  type InsertUserActivity,
  type UserStats,
  type Capsule
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  updateUser(id: string, updates: UpdateUser): Promise<User>;
  
  // Session management
  createSession(sessionData: InsertUserSession): Promise<UserSession>;
  getSession(sessionToken: string): Promise<UserSession | undefined>;
  updateSession(sessionId: string, updates: Partial<UserSession>): Promise<UserSession>;
  deactivateSession(sessionId: string): Promise<void>;
  
  // Activity logging
  logActivity(activityData: InsertUserActivity): Promise<UserActivity>;
  getUserActivities(userId: string, limit?: number): Promise<UserActivity[]>;
  
  // User stats
  getUserStats(userId: string): Promise<UserStats | undefined>;
  updateUserStats(userId: string, updates: Partial<UserStats>): Promise<UserStats>;
  
  // Capsules
  getUserCapsules(userId: string): Promise<Capsule[]>;
  createCapsule(userId: string, capsuleData: any): Promise<Capsule>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
      
    // Create initial user stats
    await db.insert(userStats).values({
      userId: user.id,
      updatedAt: new Date(),
    });
    
    return user;
  }

  async updateUser(id: string, updates: UpdateUser): Promise<User> {
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

  async createSession(sessionData: InsertUserSession): Promise<UserSession> {
    const [session] = await db
      .insert(userSessions)
      .values({
        ...sessionData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return session;
  }

  async getSession(sessionToken: string): Promise<UserSession | undefined> {
    const [session] = await db
      .select()
      .from(userSessions)
      .where(
        and(
          eq(userSessions.sessionToken, sessionToken),
          eq(userSessions.isActive, true)
        )
      );
    return session || undefined;
  }

  async updateSession(sessionId: string, updates: Partial<UserSession>): Promise<UserSession> {
    const [session] = await db
      .update(userSessions)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(userSessions.id, sessionId))
      .returning();
    return session;
  }

  async deactivateSession(sessionId: string): Promise<void> {
    await db
      .update(userSessions)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(userSessions.id, sessionId));
  }

  async logActivity(activityData: InsertUserActivity): Promise<UserActivity> {
    const [activity] = await db
      .insert(userActivities)
      .values({
        ...activityData,
        createdAt: new Date(),
      })
      .returning();
    return activity;
  }

  async getUserActivities(userId: string, limit: number = 50): Promise<UserActivity[]> {
    return await db
      .select()
      .from(userActivities)
      .where(eq(userActivities.userId, userId))
      .orderBy(desc(userActivities.createdAt))
      .limit(limit);
  }

  async getUserStats(userId: string): Promise<UserStats | undefined> {
    const [stats] = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId));
    return stats || undefined;
  }

  async updateUserStats(userId: string, updates: Partial<UserStats>): Promise<UserStats> {
    const [stats] = await db
      .update(userStats)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(userStats.userId, userId))
      .returning();
    return stats;
  }

  async getUserCapsules(userId: string): Promise<Capsule[]> {
    return await db
      .select()
      .from(capsules)
      .where(eq(capsules.userId, userId))
      .orderBy(desc(capsules.createdAt));
  }

  async createCapsule(userId: string, capsuleData: any): Promise<Capsule> {
    const [capsule] = await db
      .insert(capsules)
      .values({
        ...capsuleData,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return capsule;
  }
}

export const storage = new DatabaseStorage();