// shared/schema.ts
// Database schema definitions using Drizzle ORM

import { pgTable, text, uuid, timestamp, boolean, json, integer, decimal, varchar } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table - stores authentication and profile data with enhanced customization
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  username: text('username').unique(),
  displayName: text('display_name'),
  bio: text('bio'),
  location: text('location'),
  website: text('website'),
  company: text('company'),
  occupation: text('occupation'),
  pronouns: text('pronouns'),
  timezone: text('timezone'),
  profileImage: text('profile_image'),
  coverImage: text('cover_image'),
  profileVideo: text('profile_video'),
  portfolioImages: json('portfolio_images').$type<string[]>(),
  portfolioVideos: json('portfolio_videos').$type<string[]>(),
  profileMusic: text('profile_music'),
  customCSS: text('custom_css'),
  socialLinks: json('social_links').$type<Record<string, string>>(),
  customBadges: json('custom_badges').$type<string[]>(),
  skillTags: json('skill_tags').$type<string[]>(),
  interests: json('interests').$type<string[]>(),
  achievements: json('achievements').$type<string[]>(),
  languages: json('languages').$type<string[]>(),
  musicPreferences: json('music_preferences').$type<string[]>(),
  customization: json('customization').$type<{
    theme?: string;
    accentColor?: string;
    backgroundPattern?: string;
    profileLayout?: string;
    showActivityFeed?: boolean;
    showStatsPublic?: boolean;
    allowDirectMessages?: boolean;
    statusMessage?: string;
    availabilityStatus?: string;
    favoriteQuote?: string;
    animationsEnabled?: boolean;
    particleEffects?: boolean;
    displayMode?: string;
  }>(),
  tier: text('tier').notNull().default('SEEKER'),
  subscriptionStatus: text('subscription_status').notNull().default('free'),
  onboardingCompleted: boolean('onboarding_completed').notNull().default(false),
  preferences: json('preferences').$type<Record<string, any>>(),
  resetToken: text('reset_token'),
  resetTokenExpiresAt: timestamp('reset_token_expires_at'),
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

// Login history table - tracks user login attempts and locations
export const loginHistory = pgTable('login_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  ipAddress: text('ip_address'),
  city: text('city'),
  region: text('region'),
  country: text('country'),
  device: text('device'),
  success: boolean('success').notNull().default(true),
  loginTime: timestamp('login_time').notNull().defaultNow(),
});

// Capsule audit log table - tracks all capsule operations
export const capsuleAudit = pgTable('capsule_audit', {
  id: uuid('id').primaryKey().defaultRandom(),
  capsuleId: uuid('capsule_id').references(() => capsules.id, { onDelete: 'cascade' }),
  action: text('action').notNull(),
  metadata: json('metadata').$type<Record<string, any>>(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
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

// Votes table - stores votes on capsules
export const votes = pgTable('votes', {
  id: uuid('id').primaryKey().defaultRandom(),
  capsuleId: uuid('capsule_id').notNull().references(() => capsules.id, { onDelete: 'cascade' }),
  voterWallet: text('voter_wallet').notNull(),
  voteType: text('vote_type').notNull(), // e.g. 'upvote', 'downvote', etc.
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Transactions table - stores analytics and reward transactions
export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  capsuleId: uuid('capsule_id').references(() => capsules.id, { onDelete: 'set null' }),
  type: text('type').notNull(), // e.g. 'reward', 'purchase', 'transfer', etc.
  amount: decimal('amount', { precision: 18, scale: 8 }).notNull().default('0'),
  metadata: json('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
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

export const vestingAlertsRelations = relations(vestingAlerts, ({ one }) => ({
  // No relations needed for vesting alerts currently
}));

// Export types for enhanced profile features

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

// Login History types
export type InsertLoginHistory = typeof loginHistory.$inferInsert;
export type LoginHistory = typeof loginHistory.$inferSelect;

// Capsule Audit types  
export type InsertCapsuleAudit = typeof capsuleAudit.$inferInsert;
export type CapsuleAudit = typeof capsuleAudit.$inferSelect;

// Session logs table for admin monitoring
export const sessionLogs = pgTable("session_logs", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 255 }).references(() => users.id),
  sessionToken: varchar("session_token", { length: 255 }).notNull(),
  ip: varchar("ip", { length: 45 }).notNull(),
  userAgent: text("user_agent"),
  
  // Geolocation data
  country: varchar("country", { length: 100 }),
  region: varchar("region", { length: 100 }),
  city: varchar("city", { length: 100 }),
  latitude: varchar("latitude", { length: 20 }),
  longitude: varchar("longitude", { length: 20 }),
  timezone: varchar("timezone", { length: 50 }),
  
  // Device information
  device: varchar("device", { length: 100 }),
  browser: varchar("browser", { length: 100 }),
  os: varchar("os", { length: 100 }),
  
  // Security metrics
  riskScore: integer("risk_score").default(0),
  isActive: boolean("is_active").default(true),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type SessionLog = typeof sessionLogs.$inferSelect;
export type InsertSessionLog = typeof sessionLogs.$inferInsert;