import { pgTable, serial, text, integer, boolean, timestamp, jsonb, decimal, varchar, index } from "drizzle-orm/pg-core";
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
  "SOULBOUND_MEMOIR"
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
  (table) => [index("IDX_session_expire").on(table.expire)],
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
  socialLinks: jsonb("social_links").$type<Record<string, string>>().default({}),
  isVerified: boolean("is_verified").default(false),
  roles: jsonb("roles").$type<string[]>().default(["USER"]),
  isActive: boolean("is_active").default(true),
  passwordHash: varchar("password_hash"),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

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
  parentCapsuleId: integer("parent_capsule_id").references(() => capsules.id), // For forks/versions
  version: integer("version").default(1),
  evolutionLevel: integer("evolution_level").default(1),
  collaborators: jsonb("collaborators").$type<string[]>().default([]),
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

export const insertCapsuleInteractionSchema = createInsertSchema(capsuleInteractions).omit({
  id: true,
  createdAt: true,
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
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
export type InsertCapsuleInteraction = z.infer<typeof insertCapsuleInteractionSchema>;

export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;

export type NftEvolution = typeof nftEvolutions.$inferSelect;
export type InsertNftEvolution = z.infer<typeof insertNftEvolutionSchema>;