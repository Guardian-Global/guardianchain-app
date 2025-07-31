import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  boolean,
  integer,
  text
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table with enhanced fields
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  password: varchar("password").notNull(),
  username: varchar("username"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  tier: varchar("tier").default("EXPLORER").notNull(),
  role: varchar("role").default("USER").notNull(),
  permissions: text("permissions").array().default([]),
  walletAddress: varchar("wallet_address"),
  isActive: boolean("is_active").default(true),
  emailVerified: boolean("email_verified").default(false),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  agreedToTerms: boolean("agreed_to_terms").default(false),
  gttStakeAmount: integer("gtt_stake_amount").default(0),
  industry: varchar("industry"),
  useCase: varchar("use_case"),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  bio: text("bio"),
  interests: text("interests"),
  goals: text("goals"),
  experience: text("experience"),
  socialLinks: jsonb("social_links"),
  lastLogin: timestamp("last_login"),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Truth capsules table
export const capsules = pgTable("capsules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  ipfsHash: varchar("ipfs_hash"),
  authorId: varchar("author_id").references(() => users.id).notNull(),
  status: varchar("status").default("pending"),
  verificationCount: integer("verification_count").default(0),
  truthScore: integer("truth_score").default(0),
  category: varchar("category"),
  tags: varchar("tags").array(),
  isPrivate: boolean("is_private").default(false),
  accessCost: integer("access_cost").default(0),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Verifications table
export const verifications = pgTable("verifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  capsuleId: varchar("capsule_id").references(() => capsules.id).notNull(),
  verifierId: varchar("verifier_id").references(() => users.id).notNull(),
  isTrue: boolean("is_true").notNull(),
  evidence: text("evidence"),
  confidence: integer("confidence").default(50),
  reputationWeight: integer("reputation_weight").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

// GTT transactions table
export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromUserId: varchar("from_user_id").references(() => users.id),
  toUserId: varchar("to_user_id").references(() => users.id),
  amount: integer("amount").notNull(),
  type: varchar("type").notNull(), // 'reward', 'stake', 'payment', 'fee'
  description: text("description"),
  txHash: varchar("tx_hash"),
  status: varchar("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Achievements table
export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: varchar("type").notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  reward: integer("reward").default(0),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

// Asset metadata table for tracking uploaded assets
export const assets = pgTable("assets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  filename: varchar("filename").notNull(),
  originalName: varchar("original_name").notNull(),
  mimeType: varchar("mime_type").notNull(),
  size: integer("size").notNull(),
  url: varchar("url").notNull(),
  category: varchar("category"),
  tags: varchar("tags").array(),
  isPublic: boolean("is_public").default(false),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// Type definitions
export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;
export type NewUser = typeof users.$inferInsert;

export type Capsule = typeof capsules.$inferSelect;
export type NewCapsule = typeof capsules.$inferInsert;

export type Verification = typeof verifications.$inferSelect;
export type NewVerification = typeof verifications.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;

export type Achievement = typeof achievements.$inferSelect;
export type NewAchievement = typeof achievements.$inferInsert;

export type Asset = typeof assets.$inferSelect;
export type NewAsset = typeof assets.$inferInsert;

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCapsuleSchema = createInsertSchema(capsules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVerificationSchema = createInsertSchema(verifications).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertAssetSchema = createInsertSchema(assets).omit({
  id: true,
  uploadedAt: true,
});

// Additional schemas for API validation
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  isMaster: z.boolean().optional(),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  agreedToTerms: z.boolean(),
});

export const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  industry: z.string().optional(),
  useCase: z.string().optional(),
  tier: z.enum(["EXPLORER", "SEEKER", "CREATOR", "SOVEREIGN"]).optional(),
});

export type LoginRequest = z.infer<typeof loginSchema>;
export type RegisterRequest = z.infer<typeof registerSchema>;
export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>;