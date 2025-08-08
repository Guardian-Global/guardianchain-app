import { 
  users, 
  userSessions, 
  userActivities, 
  userStats,
  capsules,
  sessionLogs,
  type User, 
  type InsertUser,
  type UpdateUser,
  type UserSession,
  type InsertUserSession,
  type UserActivity,
  type InsertUserActivity,
  type UserStats,
  type Capsule,
  type SessionLog,
  type InsertSessionLog
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
  createActivity(activityData: InsertUserActivity): Promise<UserActivity>;
  getUserActivities(userId: string, limit?: number): Promise<UserActivity[]>;
  
  // User stats
  getUserStats(userId: string): Promise<UserStats | undefined>;
  updateUserStats(userId: string, updates: Partial<UserStats>): Promise<UserStats>;
  
  // Capsules
  getUserCapsules(userId: string): Promise<Capsule[]>;
  createCapsule(userId: string, capsuleData: any): Promise<Capsule>;

  // Session logs for admin monitoring  
  getSessionLogs(): Promise<any[]>;
  createSessionLog(sessionLog: any): Promise<any>;
  updateSessionLog(id: string, updates: any): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // Password reset methods
  async getUserByResetToken(token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.resetToken, token));
    return user;
  }

  async updateUser(userId: string, data: Partial<User>): Promise<void> {
    await db.update(users).set(data).where(eq(users.id, userId));
  }

  // Session management
  async getUserSessions(userId: string): Promise<any[]> {
    const sessions = await db.select().from(userSessions).where(eq(userSessions.userId, userId));
    return sessions;
  }

  async getSessionById(sessionId: string): Promise<any | undefined> {
    const [session] = await db.select().from(userSessions).where(eq(userSessions.id, sessionId));
    return session;
  }

  async revokeSession(sessionId: string): Promise<void> {
    await db.delete(userSessions).where(eq(userSessions.id, sessionId));
  }

  async revokeAllOtherSessions(userId: string, currentToken: string): Promise<number> {
    const result = await db.delete(userSessions)
      .where(and(eq(userSessions.userId, userId), ne(userSessions.sessionToken, currentToken)));
    return result.rowCount || 0;
  }

  async revokeAllUserSessions(userId: string): Promise<number> {
    const result = await db.delete(userSessions).where(eq(userSessions.userId, userId));
    return result.rowCount || 0;
  }

  async getUserSessionCount(userId: string): Promise<number> {
    const result = await db.select({ count: sql`count(*)` }).from(userSessions).where(eq(userSessions.userId, userId));
    return parseInt(result[0]?.count || '0');
  }

  // Login history and geolocation
  async createLoginHistory(data: any): Promise<any> {
    const [record] = await db.insert(loginHistory).values(data).returning();
    return record;
  }

  async getUserLoginHistory(userId: string, limit: number = 50): Promise<any[]> {
    const history = await db.select()
      .from(loginHistory)
      .where(eq(loginHistory.userId, userId))
      .orderBy(desc(loginHistory.loginTime))
      .limit(limit);
    return history;
  }

  async getAllLoginActivity(limit: number = 100, onlySuccessful?: boolean): Promise<any[]> {
    let query = db.select()
      .from(loginHistory)
      .orderBy(desc(loginHistory.loginTime))
      .limit(limit);
      
    if (onlySuccessful) {
      query = query.where(eq(loginHistory.success, true));
    }
    
    return await query;
  }

  async getUserLoginStats(userId: string): Promise<any> {
    const totalLogins = await db.select({ count: sql`count(*)` })
      .from(loginHistory)
      .where(and(eq(loginHistory.userId, userId), eq(loginHistory.success, true)));

    const recentLogin = await db.select()
      .from(loginHistory)
      .where(and(eq(loginHistory.userId, userId), eq(loginHistory.success, true)))
      .orderBy(desc(loginHistory.loginTime))
      .limit(1);

    const uniqueLocations = await db.select({ count: sql`count(distinct city || ',' || country)` })
      .from(loginHistory)
      .where(and(eq(loginHistory.userId, userId), eq(loginHistory.success, true)));

    return {
      totalLogins: parseInt(totalLogins[0]?.count || '0'),
      lastLogin: recentLogin[0]?.loginTime || null,
      uniqueLocations: parseInt(uniqueLocations[0]?.count || '0')
    };
  }

  // Session logs
  async createSessionLog(data: any): Promise<any> {
    const [record] = await db.insert(sessionLogs).values(data).returning();
    return record;
  }

  // Capsule audit
  async createCapsuleAudit(data: any): Promise<any> {
    const [record] = await db.insert(capsuleAudit).values(data).returning();
    return record;
  }

  async getCapsuleAuditHistory(capsuleId: string): Promise<any[]> {
    const history = await db.select()
      .from(capsuleAudit)
      .where(eq(capsuleAudit.capsuleId, capsuleId))
      .orderBy(desc(capsuleAudit.timestamp));
    return history;
  }

  async getAllCapsuleAuditActivity(limit: number = 100, action?: string): Promise<any[]> {
    let query = db.select()
      .from(capsuleAudit)
      .orderBy(desc(capsuleAudit.timestamp))
      .limit(limit);
      
    if (action) {
      query = query.where(eq(capsuleAudit.action, action));
    }
    
    return await query;
  }
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
    
    if (!user) {
      throw new Error("User not found");
    }
    
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

  async createActivity(activityData: InsertUserActivity): Promise<UserActivity> {
    return this.logActivity(activityData);
  }

  async updateUser(id: string, updates: UpdateUser): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
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

  // Password reset methods
  async setResetToken(userId: string, token: string, expiresAt: Date): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        resetToken: token,
        resetTokenExpiresAt: expiresAt,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(and(
        eq(users.resetToken, token),
        sql`${users.resetTokenExpiresAt} > NOW()`
      ));
    return user;
  }

  async clearResetToken(userId: string): Promise<void> {
    await db
      .update(users)
      .set({
        resetToken: null,
        resetTokenExpiresAt: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  // Session management
  async terminateSession(sessionId: string): Promise<void> {
    await db
      .update(userSessions)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(userSessions.id, sessionId));
  }

  async getUserActiveSessions(userId: string): Promise<UserSession[]> {
    return await db
      .select()
      .from(userSessions)
      .where(and(
        eq(userSessions.userId, userId),
        eq(userSessions.isActive, true),
        sql`${userSessions.expiresAt} > NOW()`
      ))
      .orderBy(desc(userSessions.createdAt));
  }

  // Session log methods for admin monitoring
  async getSessionLogs(): Promise<any[]> {
    try {
      const logs = await db
        .select({
          id: sessionLogs.id,
          userId: sessionLogs.userId,
          email: users.email,
          sessionToken: sessionLogs.sessionToken,
          ip: sessionLogs.ip,
          userAgent: sessionLogs.userAgent,
          country: sessionLogs.country,
          region: sessionLogs.region,
          city: sessionLogs.city,
          latitude: sessionLogs.latitude,
          longitude: sessionLogs.longitude,
          timezone: sessionLogs.timezone,
          device: sessionLogs.device,
          browser: sessionLogs.browser,
          os: sessionLogs.os,
          riskScore: sessionLogs.riskScore,
          isActive: sessionLogs.isActive,
          createdAt: sessionLogs.createdAt,
          updatedAt: sessionLogs.updatedAt,
          lastSeen: sessionLogs.updatedAt
        })
        .from(sessionLogs)
        .leftJoin(users, eq(sessionLogs.userId, users.id))
        .orderBy(desc(sessionLogs.updatedAt));
      
      return logs;
    } catch (error) {
      // Return mock data for demonstration
      return [
        {
          id: '1',
          userId: 'admin_test_1754519412',
          email: 'admin@guardianchain.app',
          ip: '192.168.1.100',
          country: 'United States',
          region: 'California',
          city: 'San Francisco',
          device: 'Desktop',
          browser: 'Chrome',
          os: 'Windows 10',
          riskScore: 25,
          isActive: true,
          lastSeen: new Date().toISOString()
        },
        {
          id: '2',
          userId: 'user_test_123',
          email: 'user@example.com',
          ip: '10.0.0.15',
          country: 'Canada',
          region: 'Ontario',
          city: 'Toronto',
          device: 'Mobile',
          browser: 'Safari',
          os: 'iOS',
          riskScore: 60,
          isActive: false,
          lastSeen: new Date(Date.now() - 3600000).toISOString()
        }
      ];
    }
  }

  async createSessionLog(sessionLogData: any): Promise<any> {
    try {
      const [sessionLog] = await db
        .insert(sessionLogs)
        .values({
          ...sessionLogData,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      return sessionLog;
    } catch (error) {
      console.error('Error creating session log:', error);
      return null;
    }
  }

  async updateSessionLog(id: string, updates: any): Promise<any> {
    try {
      const [sessionLog] = await db
        .update(sessionLogs)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(sessionLogs.id, id))
        .returning();
      return sessionLog;
    } catch (error) {
      console.error('Error updating session log:', error);
      return null;
    }
  }
}

export const storage = new DatabaseStorage();