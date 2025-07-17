import { pgTable, text, serial, integer, boolean, timestamp, json, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  walletAddress: text("wallet_address"),
  auth0Id: text("auth0_id").notNull().unique(),
  griefScore: decimal("grief_score", { precision: 3, scale: 1 }).default("0.0"),
  gttBalance: decimal("gtt_balance", { precision: 10, scale: 2 }).default("0.00"),
  totalCapsules: integer("total_capsules").default(0),
  verifiedCapsules: integer("verified_capsules").default(0),
  isVerified: boolean("is_verified").default(false),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const capsules = pgTable("capsules", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  status: text("status").notNull().default("pending"), // pending, verified, rejected
  creatorId: integer("creator_id").references(() => users.id).notNull(),
  griefScore: decimal("grief_score", { precision: 3, scale: 1 }).default("0.0"),
  verificationCount: integer("verification_count").default(0),
  replayCount: integer("replay_count").default(0),
  gttReward: decimal("gtt_reward", { precision: 10, scale: 2 }).default("0.00"),
  imageUrl: text("image_url"),
  ipfsHash: text("ipfs_hash"),
  nftTokenId: text("nft_token_id"),
  docusignEnvelopeId: text("docusign_envelope_id"),
  veritasSealUrl: text("veritas_seal_url"),
  isPublic: boolean("is_public").default(true),
  tags: text("tags").array(),
  evidence: json("evidence"),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const verifications = pgTable("verifications", {
  id: serial("id").primaryKey(),
  capsuleId: integer("capsule_id").references(() => capsules.id).notNull(),
  verifierId: integer("verifier_id").references(() => users.id).notNull(),
  vote: text("vote").notNull(), // verify, reject, dispute
  comment: text("comment"),
  evidence: text("evidence"),
  reputationStake: decimal("reputation_stake", { precision: 10, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // reward, stake, penalty, mint, burn
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  capsuleId: integer("capsule_id").references(() => capsules.id),
  txHash: text("tx_hash"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // truth_streak, community_impact, first_nft, etc.
  title: text("title").notNull(),
  description: text("description").notNull(),
  metadata: json("metadata"),
  earnedAt: timestamp("earned_at").defaultNow(),
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

export const insertVerificationSchema = createInsertSchema(verifications).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  earnedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Capsule = typeof capsules.$inferSelect;
export type InsertCapsule = z.infer<typeof insertCapsuleSchema>;
export type Verification = typeof verifications.$inferSelect;
export type InsertVerification = z.infer<typeof insertVerificationSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
