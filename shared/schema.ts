import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  decimal,
  varchar,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Capsule Types Enum
export const CapsuleType = z.enum([
  "STANDARD",
  "LEGAL",
  "KNOWLEDGE",
  "CREATOR",
  "CIVIC",
  "FINANCIAL",
  "VERITAS_CERTIFICATE",
  "AI_GENERATED",
  "CROSS_CHAIN_ASSET",
  "MULTIMEDIA_STORY",
  "CITIZEN_JOURNALISM",
  "FRAUD_PROOF",
  "WITNESS_TESTIMONY",
  "SOULBOUND_MEMOIR",
]);

export type CapsuleTypeEnum = z.infer<typeof CapsuleType>;

// Session storage table for Replit Auth
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// Enhanced Users table with Replit Auth integration
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  username: text("username").unique(),
  walletAddress: text("wallet_address").unique(),
  bio: text("bio"),
  avatar: text("avatar"),
  reputation: integer("reputation").default(0),
  xpPoints: integer("xp_points").default(0),
  totalCapsules: integer("total_capsules").default(0),
  verifiedCapsules: integer("verified_capsules").default(0),
  gttBalance: decimal("gtt_balance", { precision: 18, scale: 8 }).default("0"),
  badges: jsonb("badges").$type<string[]>().default([]),
  achievements: jsonb("achievements").$type<object[]>().default([]),
  socialLinks: jsonb("social_links")
    .$type<Record<string, string>>()
    .default({}),
  isVerified: boolean("is_verified").default(false),
  roles: jsonb("roles").$type<string[]>().default(["USER"]),
  isActive: boolean("is_active").default(true),
  passwordHash: varchar("password_hash"),
  lastLoginAt: timestamp("last_login_at"),
  
  // Authentication-required fields
  tier: text("tier").default("EXPLORER"),
  userTier: text("user_tier").default("EXPLORER"),
  gttStakeAmount: decimal("gtt_stake_amount", { precision: 18, scale: 8 }).default("0"),
  emailVerified: boolean("email_verified").default(false),
  
  totalYieldClaimed: decimal("total_yield_claimed", {
    precision: 18,
    scale: 8,
  }).default("0"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  
  // Enterprise authentication fields
  permissions: jsonb("permissions").$type<string[]>().default([]),
  role: text("role").default("USER"),
  
  // 2FA and security fields
  twoFactorSecret: text("two_factor_secret"),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  backupCodes: jsonb("backup_codes").$type<string[]>().default([]),
  
  // Session and security tracking
  sessionToken: text("session_token"),
  tokenExpiresAt: timestamp("token_expires_at"),
  failedLoginAttempts: integer("failed_login_attempts").default(0),
  lockedUntil: timestamp("locked_until"),
  
  // Compliance and audit
  agreedToTermsAt: timestamp("agreed_to_terms_at"),
  privacyPolicyAcceptedAt: timestamp("privacy_policy_accepted_at"),
  lastPasswordChangeAt: timestamp("last_password_change_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type UserSelect = typeof users.$inferSelect;
export type User = typeof users.$inferSelect;

// Enhanced authentication schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  agreedToTerms: z.boolean().refine(val => val === true, "Must agree to terms"),
});

export const masterLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.string().min(1, "Role is required"),
  masterKey: z.string().min(1, "Master key is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type MasterLoginInput = z.infer<typeof masterLoginSchema>;

// Enhanced Capsules table
export const capsules = pgTable("capsules", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  creatorId: varchar("creator_id").references(() => users.id),
  type: text("type").$type<CapsuleTypeEnum>().default("STANDARD"),
  category: text("category"),
  tags: jsonb("tags").$type<string[]>().default([]),
  status: text("status").default("draft"), // draft, pending, verified, rejected
  isPublic: boolean("is_public").default(true),
  griefScore: integer("grief_score").default(0),
  credibilityScore: integer("credibility_score").default(0),
  viewCount: integer("view_count").default(0),
  shareCount: integer("share_count").default(0),
  voteCount: integer("vote_count").default(0),
  truthYield: decimal("truth_yield", { precision: 18, scale: 8 }).default("0"),
  ipfsHash: text("ipfs_hash"),
  nftTokenId: integer("nft_token_id"),
  nftContractAddress: text("nft_contract_address"),
  metadata: jsonb("metadata").$type<object>().default({}),
  blocks: jsonb("blocks").$type<object[]>().default([]),
  parentCapsuleId: integer("parent_capsule_id"), // For forks/versions
  version: integer("version").default(1),
  evolutionLevel: integer("evolution_level").default(1),
  collaborators: jsonb("collaborators").$type<string[]>().default([]),
  heirAddress: text("heir_address"), // Inheritance field
  unlockDate: timestamp("unlock_date"), // Inheritance field
  
  // Enhanced Privacy & Access Controls
  accessLevel: text("access_level").default("public"), // public, private, restricted, premium
  authorizedViewers: jsonb("authorized_viewers").$type<string[]>().default([]), // User IDs or email addresses
  viewingCost: decimal("viewing_cost", { precision: 18, scale: 2 }).default("0"), // Cost in USD to view
  requiresAuth: boolean("requires_auth").default(false), // Requires authentication to view
  authLevel: text("auth_level").default("basic"), // basic, enhanced, biometric
  
  // Time Capsule Controls
  isTimeCapsule: boolean("is_time_capsule").default(false),
  revealDate: timestamp("reveal_date"), // When time capsule becomes viewable
  requiredApprovals: integer("required_approvals").default(0), // Number of approvals needed
  approvedBy: jsonb("approved_by").$type<string[]>().default([]), // User IDs who approved
  
  // Social Media Integration
  autoShare: boolean("auto_share").default(false),
  shareToFacebook: boolean("share_to_facebook").default(false),
  shareToTwitter: boolean("share_to_twitter").default(false),
  shareToLinkedIn: boolean("share_to_linkedin").default(false),
  shareToInstagram: boolean("share_to_instagram").default(false),
  shareToTikTok: boolean("share_to_tiktok").default(false),
  shareToYouTube: boolean("share_to_youtube").default(false),
  shareToReddit: boolean("share_to_reddit").default(false),
  shareToDiscord: boolean("share_to_discord").default(false),
  shareToTelegram: boolean("share_to_telegram").default(false),
  socialShareMessage: text("social_share_message"),
  
  // IPFS Automation
  autoIpfs: boolean("auto_ipfs").default(true), // Automatically upload to IPFS
  ipfsProvider: text("ipfs_provider").default("pinata"), // pinata, infura, web3storage
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Capsule Interactions table
export const capsuleInteractions = pgTable("capsule_interactions", {
  id: serial("id").primaryKey(),
  capsuleId: integer("capsule_id").references(() => capsules.id),
  userId: varchar("user_id").references(() => users.id),
  type: text("type").notNull(), // view, share, vote, fork, collaborate
  metadata: jsonb("metadata").$type<object>().default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Achievements table
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  achievementType: text("achievement_type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  iconUrl: text("icon_url"),
  rarity: text("rarity").default("common"), // common, rare, epic, legendary
  unlockedAt: timestamp("unlocked_at").defaultNow(),
  metadata: jsonb("metadata").$type<object>().default({}),
});

// NFT Evolution table
export const nftEvolutions = pgTable("nft_evolutions", {
  id: serial("id").primaryKey(),
  tokenId: integer("token_id").notNull(),
  contractAddress: text("contract_address").notNull(),
  evolutionLevel: integer("evolution_level").default(1),
  traits: jsonb("traits").$type<object[]>().default([]),
  visualMetadata: jsonb("visual_metadata").$type<object>().default({}),
  lastEvolutionAt: timestamp("last_evolution_at").defaultNow(),
  nextEvolutionThreshold: integer("next_evolution_threshold").default(100),
});

// Insert schemas
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

export const insertCapsuleInteractionSchema = createInsertSchema(
  capsuleInteractions
).omit({
  id: true,
  createdAt: true,
});

export const insertUserAchievementSchema = createInsertSchema(
  userAchievements
).omit({
  id: true,
  unlockedAt: true,
});

export const insertNftEvolutionSchema = createInsertSchema(nftEvolutions).omit({
  id: true,
  lastEvolutionAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Capsule = typeof capsules.$inferSelect;
export type InsertCapsule = z.infer<typeof insertCapsuleSchema>;

export type CapsuleInteraction = typeof capsuleInteractions.$inferSelect;
export type InsertCapsuleInteraction = z.infer<
  typeof insertCapsuleInteractionSchema
>;

export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;

export type NftEvolution = typeof nftEvolutions.$inferSelect;
export type InsertNftEvolution = z.infer<typeof insertNftEvolutionSchema>;
