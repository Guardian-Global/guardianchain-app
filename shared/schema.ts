// shared/schema.ts
// Database schema definitions using Drizzle ORM

import { pgTable, text, uuid, timestamp, boolean, json, integer, decimal } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table - stores authentication and profile data
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  username: text('username').unique(),
  displayName: text('display_name'),
  bio: text('bio'),
  location: text('location'),
  website: text('website'),
  profileImage: text('profile_image'),
  coverImage: text('cover_image'),
  socialLinks: json('social_links').$type<Record<string, string>>(),
  tier: text('tier').notNull().default('SEEKER'),
  subscriptionStatus: text('subscription_status').notNull().default('free'),
  onboardingCompleted: boolean('onboarding_completed').notNull().default(false),
  preferences: json('preferences').$type<Record<string, any>>(),
  lastActiveAt: timestamp('last_active_at').defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// User sessions table - stores authentication sessions
export const userSessions = pgTable('user_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  sessionToken: text('session_token').unique().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// User activity log table - tracks user actions and data
export const userActivities = pgTable('user_activities', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  sessionId: uuid('session_id').references(() => userSessions.id, { onDelete: 'set null' }),
  activityType: text('activity_type').notNull(), // login, logout, profile_update, capsule_create, etc.
  activityData: json('activity_data').$type<Record<string, any>>(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Capsules table - stores user-generated content capsules
export const capsules = pgTable('capsules', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  content: text('content'),
  grieveScore: integer('grieve_score').notNull().default(0),
  gttReward: decimal('gtt_reward', { precision: 18, scale: 8 }).notNull().default('0'),
  visibility: text('visibility').notNull().default('private'),
  unlockConditions: json('unlock_conditions').$type<Record<string, any>>(),
  timeLockedUntil: timestamp('time_locked_until'),
  isSealed: boolean('is_sealed').notNull().default(false),
  isMinted: boolean('is_minted').notNull().default(false),
  nftTokenId: text('nft_token_id'),
  ipfsHash: text('ipfs_hash'),
  mediaUrls: json('media_urls').$type<string[]>(),
  tags: json('tags').$type<string[]>(),
  emotionalTags: json('emotional_tags').$type<Record<string, any>>(),
  lineageParentId: uuid('lineage_parent_id').references(() => capsules.id),
  remixCount: integer('remix_count').notNull().default(0),
  viewCount: integer('view_count').notNull().default(0),
  unlockCount: integer('unlock_count').notNull().default(0),
  verificationStatus: text('verification_status').notNull().default('pending'),
  metadata: json('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// User stats table - aggregated user statistics
export const userStats = pgTable('user_stats', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  totalCapsules: integer('total_capsules').notNull().default(0),
  sealedCapsules: integer('sealed_capsules').notNull().default(0),
  verifiedCapsules: integer('verified_capsules').notNull().default(0),
  gttBalance: decimal('gtt_balance', { precision: 18, scale: 8 }).notNull().default('0'),
  totalGttEarned: decimal('total_gtt_earned', { precision: 18, scale: 8 }).notNull().default('0'),
  totalGttSpent: decimal('total_gtt_spent', { precision: 18, scale: 8 }).notNull().default('0'),
  truthScore: integer('truth_score').notNull().default(0),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Vesting alerts table - tracks GTT cliff alerts
export const vestingAlerts = pgTable('vesting_alerts', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  contributorName: text('contributor_name').notNull(),
  walletAddress: text('wallet_address').notNull(),
  releasableAmount: decimal('releasable_amount', { precision: 28, scale: 18 }).notNull(),
  alertTimestamp: timestamp('alert_timestamp').defaultNow(),
  status: text('status').notNull().default('sent'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  sessions: many(userSessions),
  activities: many(userActivities),
  capsules: many(capsules),
  stats: one(userStats),
}));

export const userSessionsRelations = relations(userSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [userSessions.userId],
    references: [users.id],
  }),
  activities: many(userActivities),
}));

export const userActivitiesRelations = relations(userActivities, ({ one }) => ({
  user: one(users, {
    fields: [userActivities.userId],
    references: [users.id],
  }),
  session: one(userSessions, {
    fields: [userActivities.sessionId],
    references: [userSessions.id],
  }),
}));

export const capsulesRelations = relations(capsules, ({ one, many }) => ({
  user: one(users, {
    fields: [capsules.userId],
    references: [users.id],
  }),
  parentCapsule: one(capsules, {
    fields: [capsules.lineageParentId],
    references: [capsules.id],
  }),
  childCapsules: many(capsules),
}));

export const userStatsRelations = relations(userStats, ({ one }) => ({
  user: one(users, {
    fields: [userStats.userId],
    references: [users.id],
  }),
}));

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectUserSchema = createSelectSchema(users);
export const updateUserSchema = insertUserSchema.partial();

export const insertUserSessionSchema = createInsertSchema(userSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserActivitySchema = createInsertSchema(userActivities).omit({
  id: true,
  createdAt: true,
});

export const insertCapsuleSchema = createInsertSchema(capsules).omit({
  id: true,
  userId: true,
  remixCount: true,
  viewCount: true,
  unlockCount: true,
  createdAt: true,
  updatedAt: true,
});

// TypeScript types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type UpdateUser = Partial<InsertUser>;

export type UserSession = typeof userSessions.$inferSelect;
export type InsertUserSession = typeof userSessions.$inferInsert;

export type UserActivity = typeof userActivities.$inferSelect;
export type InsertUserActivity = typeof userActivities.$inferInsert;

export type Capsule = typeof capsules.$inferSelect;
export type InsertCapsule = typeof capsules.$inferInsert;

export type UserStats = typeof userStats.$inferSelect;
export type InsertUserStats = typeof userStats.$inferInsert;