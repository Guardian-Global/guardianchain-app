import { sql } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  numeric,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table with complete profile system
export const users = pgTable("users", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  emailVerified: boolean("email_verified").default(false),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  username: varchar("username").unique(),
  profileImageUrl: varchar("profile_image_url"),
  bio: text("bio"),
  location: varchar("location"),
  website: varchar("website"),
  twitter: varchar("twitter"),
  github: varchar("github"),
  linkedin: varchar("linkedin"),
  tier: varchar("tier").default("EXPLORER"), // EXPLORER, SEEKER, CREATOR, SOVEREIGN, ADMIN
  role: varchar("role").default("user"), // user, admin, moderator
  emailConfirmed: boolean("email_confirmed").default(false),
  phoneConfirmed: boolean("phone_confirmed").default(false),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  loginAttempts: varchar("login_attempts").default("0"),
  lockedUntil: timestamp("locked_until"),
  subscriptionStatus: varchar("subscription_status").default("inactive"),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  lastLoginAt: timestamp("last_login_at"),
  isActive: boolean("is_active").default(true),
  preferences: jsonb("preferences"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Email verification tokens
export const emailVerificationTokens = pgTable("email_verification_tokens", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// User activity tracking for complete audit trail
export const userActivities = pgTable("user_activities", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  action: varchar("action").notNull(), // login, logout, create_capsule, vote, etc.
  resourceType: varchar("resource_type"), // capsule, vote, profile, etc.
  resourceId: uuid("resource_id"),
  metadata: jsonb("metadata"), // Additional action data
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_user_activities_user").on(table.userId),
  index("idx_user_activities_action").on(table.action),
  index("idx_user_activities_created_at").on(table.createdAt),
]);

// Media files table for user photo/video uploads
export const mediaFiles = pgTable("media_files", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type").notNull(), // 'image' or 'video'
  originalName: varchar("original_name").notNull(),
  fileName: varchar("file_name").notNull(),
  fileSize: numeric("file_size").notNull(),
  mimeType: varchar("mime_type").notNull(),
  url: varchar("url").notNull(), // Object storage URL
  thumbnailUrl: varchar("thumbnail_url"),
  width: numeric("width"),
  height: numeric("height"),
  duration: numeric("duration"), // For videos, in seconds
  title: varchar("title"),
  description: text("description"),
  tags: jsonb("tags").default(sql`'[]'::jsonb`),
  isPublic: boolean("is_public").default(false),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_media_files_user").on(table.userId),
  index("idx_media_files_type").on(table.type),
  index("idx_media_files_uploaded_at").on(table.uploadedAt),
]);

// User social links table
export const userSocialLinks = pgTable("user_social_links", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  platform: varchar("platform").notNull(),
  username: varchar("username").notNull(),
  url: varchar("url").notNull(),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_user_social_links_user").on(table.userId),
]);

// Newsletter subscribers table for email subscriptions
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
  status: varchar("status").default("active"),
});

// Capsule Votes table - For community verification and engagement
export const capsuleVotes = pgTable(
  "capsule_votes",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    capsuleId: uuid("capsule_id")
      .notNull()
      .references(() => capsules.id, { onDelete: "cascade" }),
    voterWallet: varchar("voter_wallet").notNull(),
    voteType: varchar("vote_type").notNull().default("upvote"), // upvote, downvote
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    // Ensure one vote per wallet per capsule
    index("idx_capsule_votes_unique").on(table.capsuleId, table.voterWallet),
    // Performance indexes
    index("idx_capsule_votes_capsule").on(table.capsuleId),
    index("idx_capsule_votes_wallet").on(table.voterWallet),
  ],
);

// Capsules table for truth capsule storage and search
export const capsules = pgTable(
  "capsules",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    title: text("title").notNull(),
    description: text("description"),
    content: jsonb("content"),
    authorId: uuid("author_id").references(() => users.id),
    author: text("author"), // Denormalized for search performance
    category: text("category"),
    tags: text("tags").array(),
    verificationStatus: varchar("verification_status").default("pending"),
    griefScore: text("grief_score").default("0"),
    views: text("views").default("0"),
    likes: text("likes").default("0"),
    comments: text("comments").default("0"),
    shares: text("shares").default("0"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    // Full-text search index
    index("idx_capsules_fulltext").using(
      "gin",
      sql`to_tsvector('english', ${table.title} || ' ' || coalesce(${table.description}, ''))`,
    ),
    // Tag-based filtering index
    index("idx_capsules_tags").using("gin", table.tags),
    // Performance indexes
    index("idx_capsules_author").on(table.author),
    index("idx_capsules_category").on(table.category),
    index("idx_capsules_created_at").on(table.createdAt),
  ],
);

// DAO Proposals table for governance voting
export const proposals = pgTable("proposals", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: varchar("status").default("open"), // open, closed, executed
  createdAt: timestamp("created_at").defaultNow(),
  endTime: timestamp("end_time"),
});

// DAO Votes table for proposal voting
export const votes = pgTable("votes", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  proposalId: uuid("proposal_id")
    .notNull()
    .references(() => proposals.id, { onDelete: "cascade" }),
  voterAddress: varchar("voter_address").notNull(),
  choice: varchar("choice").notNull(), // support, reject, abstain
  weight: numeric("weight").default("1"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Truth Auctions table for sealed disclosure capsules
export const truthAuctions = pgTable(
  "truth_auctions",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    reservePrice: numeric("reserve_price").notNull(),
    currentFunding: numeric("current_funding").default("0"),
    beneficiaries: text("beneficiaries").array(),
    disclosureContent: text("disclosure_content"), // Encrypted content
    expiresAt: timestamp("expires_at").notNull(),
    unlocked: boolean("unlocked").default(false),
    creatorId: uuid("creator_id").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("idx_truth_auctions_creator").on(table.creatorId),
    index("idx_truth_auctions_expires").on(table.expiresAt),
    index("idx_truth_auctions_unlocked").on(table.unlocked),
  ],
);

// Type definitions
export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;
export type EmailVerificationToken = typeof emailVerificationTokens.$inferSelect;
export type InsertEmailVerificationToken = typeof emailVerificationTokens.$inferInsert;
export type UserActivity = typeof userActivities.$inferSelect;
export type InsertUserActivity = typeof userActivities.$inferInsert;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber =
  typeof newsletterSubscribers.$inferInsert;
export type Capsule = typeof capsules.$inferSelect;
export type InsertCapsule = typeof capsules.$inferInsert;
export type CapsuleVote = typeof capsuleVotes.$inferSelect;
export type InsertCapsuleVote = typeof capsuleVotes.$inferInsert;
export type TruthAuction = typeof truthAuctions.$inferSelect;
export type InsertTruthAuction = typeof truthAuctions.$inferInsert;

// Extended types for UI compatibility
export interface EnhancedCapsuleData extends Omit<Capsule, 'content'> {
  isPrivate?: boolean;
  content?: {
    type: string;
    data: string;
    metadata?: any;
    encrypted?: boolean;
    encryptedContent?: string;
    encryptedSymmetricKey?: string;
    accessControlConditions?: any[];
    minted?: boolean;
    tx_hash?: string;
    unlocked?: boolean;
    isPrivate?: boolean;
  };
}

// Validation schemas
export const insertUserSchema = createInsertSchema(users);
export const insertEmailVerificationTokenSchema = createInsertSchema(emailVerificationTokens);
export const insertUserActivitySchema = createInsertSchema(userActivities);
export const insertNewsletterSubscriberSchema = createInsertSchema(
  newsletterSubscribers,
);
export const insertCapsuleSchema = createInsertSchema(capsules);
export const insertCapsuleVoteSchema = createInsertSchema(capsuleVotes);
export const insertTruthAuctionSchema = createInsertSchema(truthAuctions);

// User registration and profile schemas
export const userRegistrationSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(3, "Username must be at least 3 characters").max(30, "Username must be less than 30 characters"),
});

export const userProfileUpdateSchema = z.object({
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  username: z.string().min(3, "Username must be at least 3 characters").max(30, "Username must be less than 30 characters").optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  location: z.string().max(100, "Location must be less than 100 characters").optional(),
  website: z.string().url("Invalid website URL").or(z.string().length(0)).optional(),
  twitter: z.string().max(50, "Twitter handle must be less than 50 characters").optional(),
  github: z.string().max(50, "GitHub username must be less than 50 characters").optional(),
  linkedin: z.string().max(100, "LinkedIn profile must be less than 100 characters").optional(),
  profileImageUrl: z.string().url("Invalid profile image URL").optional(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type UpdateUser = Partial<InsertUser>;
export type UpsertUser = typeof users.$inferInsert;

export type MediaFile = typeof mediaFiles.$inferSelect;
export type InsertMediaFile = typeof mediaFiles.$inferInsert;
export type UserSocialLink = typeof userSocialLinks.$inferSelect;
export type InsertUserSocialLink = typeof userSocialLinks.$inferInsert;

export type InsertUserType = z.infer<typeof insertUserSchema>;
export type InsertNewsletterSubscriberType = z.infer<
  typeof insertNewsletterSubscriberSchema
>;
export type InsertCapsuleType = z.infer<typeof insertCapsuleSchema>;
export type InsertCapsuleVoteType = z.infer<typeof insertCapsuleVoteSchema>;
export type InsertTruthAuctionType = z.infer<typeof insertTruthAuctionSchema>;

// Lineage tracking tables for capsule relationships
export const lineageNodes = pgTable("lineage_nodes", {
  id: varchar("id").primaryKey(), // matches capsule ID
  title: varchar("title").notNull(),
  x: numeric("x").default("0"),
  y: numeric("y").default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const lineageEdges = pgTable("lineage_edges", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  source: varchar("source").notNull().references(() => lineageNodes.id),
  target: varchar("target").notNull().references(() => lineageNodes.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Lineage types
export type LineageNode = typeof lineageNodes.$inferSelect;
export type InsertLineageNode = typeof lineageNodes.$inferInsert;
export type LineageEdge = typeof lineageEdges.$inferSelect;
export type InsertLineageEdge = typeof lineageEdges.$inferInsert;

// DAO cluster voting table
export const clusterVotes = pgTable("cluster_votes", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  clusterId: numeric("cluster_id").notNull(),
  userId: varchar("user_id").notNull(),
  theme: varchar("theme").notNull(),
  votedAt: timestamp("voted_at").defaultNow(),
}, (table) => [
  index("idx_cluster_votes_cluster").on(table.clusterId),
  index("idx_cluster_votes_user").on(table.userId)
]);

// Cluster vote types
export type ClusterVote = typeof clusterVotes.$inferSelect;
export type InsertClusterVote = typeof clusterVotes.$inferInsert;

// DAO types
export type Proposal = typeof proposals.$inferSelect;
export type InsertProposal = typeof proposals.$inferInsert;
export type Vote = typeof votes.$inferSelect;
export type InsertVote = typeof votes.$inferInsert;
