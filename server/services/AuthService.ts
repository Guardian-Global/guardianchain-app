import { db } from "../db";
import { users, emailVerificationTokens, userActivities, sessions } from "../../shared/schema";
import { eq, and } from "drizzle-orm";
import { randomBytes } from "crypto";
import { hash, compare } from "bcryptjs";
import type { User, InsertUserActivity, UserActivity } from "../../shared/schema";

export class AuthService {
  // Generate secure verification token
  private generateVerificationToken(): string {
    return randomBytes(32).toString("hex");
  }

  // Create user with email verification
  async createUser(userData: {
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    password?: string;
  }): Promise<{ user: User; verificationToken: string }> {
    const now = new Date();
    const verificationToken = this.generateVerificationToken();

    // Create user
    const [user] = await db
      .insert(users)
      .values({
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        emailVerified: false,
        tier: "EXPLORER",
        subscriptionStatus: "inactive",
        onboardingCompleted: false,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    // Create verification token
    await db.insert(emailVerificationTokens).values({
      userId: user.id,
      token: verificationToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    // Log user creation activity
    await this.logUserActivity(user.id, "user_created", "user", user.id, {
      email: userData.email,
      username: userData.username,
    });

    return { user, verificationToken };
  }

  // Verify email address
  async verifyEmail(token: string): Promise<User | null> {
    const [verificationRecord] = await db
      .select()
      .from(emailVerificationTokens)
      .where(eq(emailVerificationTokens.token, token));

    if (!verificationRecord || verificationRecord.expiresAt < new Date()) {
      return null;
    }

    // Update user as verified
    const [user] = await db
      .update(users)
      .set({
        emailVerified: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, verificationRecord.userId))
      .returning();

    // Delete used token
    await db
      .delete(emailVerificationTokens)
      .where(eq(emailVerificationTokens.token, token));

    // Log email verification
    await this.logUserActivity(user.id, "email_verified", "user", user.id);

    return user;
  }

  // Get user by ID
  async getUserById(id: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || null;
  }

  // Get user by email - simplified for existing schema
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const [user] = await db.select().from(users).where(eq(users.email, email));
      return user || null;
    } catch (error) {
      console.error("Error getting user by email:", error);
      // Return null if database error (table/column doesn't exist yet)
      return null;
    }
  }

  // Get user by username
  async getUserByUsername(username: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || null;
  }

  // Update user profile
  async updateUserProfile(
    userId: string,
    updates: Partial<User>
  ): Promise<User | null> {
    const [user] = await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    if (user) {
      await this.logUserActivity(userId, "profile_updated", "user", userId, updates);
    }

    return user || null;
  }

  // Complete onboarding
  async completeOnboarding(userId: string): Promise<User | null> {
    const [user] = await db
      .update(users)
      .set({
        onboardingCompleted: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    if (user) {
      await this.logUserActivity(userId, "onboarding_completed", "user", userId);
    }

    return user || null;
  }

  // Update last login
  async updateLastLogin(userId: string): Promise<void> {
    await db
      .update(users)
      .set({
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    await this.logUserActivity(userId, "login", "session", undefined);
  }

  // Log user activity
  async logUserActivity(
    userId: string,
    action: string,
    resourceType?: string,
    resourceId?: string,
    metadata?: any,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await db.insert(userActivities).values({
      userId,
      action,
      resourceType,
      resourceId,
      metadata: metadata ? JSON.stringify(metadata) : null,
      ipAddress,
      userAgent,
    });
  }

  // Get user activities
  async getUserActivities(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<UserActivity[]> {
    return await db
      .select()
      .from(userActivities)
      .where(eq(userActivities.userId, userId))
      .orderBy(userActivities.createdAt)
      .limit(limit)
      .offset(offset);
  }

  // Get user statistics
  async getUserStats(userId: string): Promise<{
    totalActivities: number;
    recentLogins: number;
    profileCompleteness: number;
  }> {
    // Get total activities
    const activities = await db
      .select()
      .from(userActivities)
      .where(eq(userActivities.userId, userId));

    // Get recent logins (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentLogins = activities.filter(
      activity => activity.action === "login" && activity.createdAt && activity.createdAt >= thirtyDaysAgo
    ).length;

    // Calculate profile completeness
    const user = await this.getUserById(userId);
    let completeness = 0;
    if (user) {
      const fields = [
        user.firstName,
        user.lastName,
        user.username,
        user.bio,
        user.location,
        user.profileImageUrl,
      ];
      completeness = (fields.filter(field => field && field.trim()).length / fields.length) * 100;
    }

    return {
      totalActivities: activities.length,
      recentLogins,
      profileCompleteness: Math.round(completeness),
    };
  }
}

export const authService = new AuthService();