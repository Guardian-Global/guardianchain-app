import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  boolean,
  integer,
  text,
  uuid,
  numeric
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

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  // Additional GuardianChain specific fields
  username: varchar("username"),
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
  // Enhanced profile media fields
  profileVideoUrl: varchar("profile_video_url"),
  backgroundImageUrl: varchar("background_image_url"),
  mediaPreferences: jsonb("media_preferences"), // Auto-mint, quality settings, etc.
  language: varchar("language").default("en"), // User's preferred language for interface and voice
  preferredLanguage: varchar("preferred_language").default("en"), // User's preferred language setting
  lastLogin: timestamp("last_login"),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Truth capsules table with comprehensive types and Veritas seal options
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
  // Comprehensive Capsule Type System
  capsuleType: varchar("capsule_type").notNull(),
  // Veritas Seal Options
  veritasSealType: varchar("veritas_seal_type"),
  urgencyLevel: varchar("urgency_level").default("normal"),
  sensitivityLevel: varchar("sensitivity_level").default("public"),
  jurisdictionRegion: varchar("jurisdiction_region"),
  legalImportance: varchar("legal_importance").default("standard"),
  evidenceType: varchar("evidence_type"),
  submissionMethod: varchar("submission_method").default("standard"),
  // Enhanced metadata
  tags: varchar("tags").array(),
  attachments: jsonb("attachments"),
  metadataHash: varchar("metadata_hash"),
  emotionalResonance: varchar("emotional_resonance"),
  therapeuticValue: integer("therapeutic_value").default(0),
  isPrivate: boolean("is_private").default(false),
  accessCost: integer("access_cost").default(0),
  viewCount: integer("view_count").default(0),
  // Media and NFT fields
  mediaType: varchar("media_type"), // image, video, document, audio
  mediaUrl: varchar("media_url"),
  thumbnailUrl: varchar("thumbnail_url"),
  fileSize: integer("file_size"),
  fileName: varchar("file_name"),
  nftTokenId: varchar("nft_token_id"),
  nftContractAddress: varchar("nft_contract_address"),
  isNftMinted: boolean("is_nft_minted").default(false),
  isTruthVaultSealed: boolean("is_truth_vault_sealed").default(false),
  autoMintEnabled: boolean("auto_mint_enabled").default(false),
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

// Replay logs table for tracking capsule replay activities
export const replayLogs = pgTable("replay_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  capsuleId: varchar("capsule_id").references(() => capsules.id).notNull(),
  userId: varchar("user_id").references(() => users.id),
  replayType: varchar("replay_type").default("standard"), // 'standard', 'premium', 'veritas'
  yieldAmount: integer("yield_amount").default(0),
  transactionHash: varchar("transaction_hash"),
  sessionId: varchar("session_id"),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  metadata: jsonb("metadata"), // Additional replay data
  createdAt: timestamp("created_at").defaultNow(),
});

// Type definitions
export type User = typeof users.$inferSelect;

// Comprehensive Capsule Type System
export const CAPSULE_TYPES = {
  // Core Truth Categories
  NEWS_VERIFICATION: "news_verification",
  HISTORICAL_RECORD: "historical_record", 
  PERSONAL_TESTIMONY: "personal_testimony",
  SCIENTIFIC_DATA: "scientific_data",
  LEGAL_DOCUMENT: "legal_document",
  
  // Professional Verification Types
  VERITAS_SEAL: "veritas_seal",
  TRUTH_BOUNTY: "truth_bounty", 
  TRUTH_REDEMPTION: "truth_redemption",
  CONSPIRACY_CAPSULE: "conspiracy_capsule",
  
  // Enterprise & Institutional
  GOVERNMENT_RECORD: "government_record",
  CORPORATE_FILING: "corporate_filing",
  ACADEMIC_RESEARCH: "academic_research",
  MEDICAL_RECORD: "medical_record",
  
  // Security & Whistleblowing
  WHISTLEBLOWER_REPORT: "whistleblower_report",
  LEAK_VERIFICATION: "leak_verification",
  ANONYMOUS_TIP: "anonymous_tip",
  
  // Social & Community
  SOCIAL_MEDIA_FACT: "social_media_fact",
  COMMUNITY_WITNESS: "community_witness",
  CITIZEN_JOURNALISM: "citizen_journalism",
  
  // Specialized Categories
  FINANCIAL_DISCLOSURE: "financial_disclosure",
  ENVIRONMENTAL_REPORT: "environmental_report",
  ELECTION_INTEGRITY: "election_integrity",
  TECHNOLOGY_AUDIT: "technology_audit",
  SUPPLY_CHAIN_VERIFICATION: "supply_chain_verification"
} as const;

// Veritas Seal Types (Professional Truth Certification)
export const VERITAS_SEAL_TYPES = {
  // Legal & Court-Admissible
  LEGAL_AFFIDAVIT: "legal_affidavit",
  SWORN_TESTIMONY: "sworn_testimony", 
  NOTARIZED_STATEMENT: "notarized_statement",
  COURT_EVIDENCE: "court_evidence",
  LEGAL_OPINION: "legal_opinion",
  
  // Professional Certifications
  EXPERT_WITNESS: "expert_witness",
  PROFESSIONAL_AUDIT: "professional_audit",
  LICENSED_VERIFICATION: "licensed_verification",
  CERTIFIED_ANALYSIS: "certified_analysis",
  
  // Investigative & Journalistic
  INVESTIGATIVE_REPORT: "investigative_report",
  SOURCE_PROTECTED: "source_protected",
  FACT_CHECK_VERIFIED: "fact_check_verified",
  EDITORIAL_VERIFIED: "editorial_verified",
  
  // Security & Intelligence
  CLASSIFIED_DECLASSIFIED: "classified_declassified",
  INTELLIGENCE_REPORT: "intelligence_report",
  SECURITY_CLEARANCE: "security_clearance",
  
  // Academic & Scientific
  PEER_REVIEWED: "peer_reviewed",
  ACADEMIC_CERTIFIED: "academic_certified",
  RESEARCH_VERIFIED: "research_verified",
  LABORATORY_CERTIFIED: "laboratory_certified",
  
  // Financial & Corporate
  AUDITOR_CERTIFIED: "auditor_certified",
  FINANCIAL_VERIFIED: "financial_verified",
  REGULATORY_APPROVED: "regulatory_approved",
  COMPLIANCE_CERTIFIED: "compliance_certified",
  
  // Technology & Digital
  CRYPTOGRAPHICALLY_SIGNED: "cryptographically_signed",
  BLOCKCHAIN_VERIFIED: "blockchain_verified",
  DIGITAL_FORENSICS: "digital_forensics",
  TIMESTAMP_VERIFIED: "timestamp_verified"
} as const;

// Urgency Levels
export const URGENCY_LEVELS = {
  CRITICAL: "critical",      // Breaking news, emergency
  HIGH: "high",             // Important, time-sensitive
  NORMAL: "normal",         // Standard processing
  LOW: "low",              // Archive, reference
  SCHEDULED: "scheduled"    // Future release
} as const;

// Sensitivity Levels
export const SENSITIVITY_LEVELS = {
  PUBLIC: "public",           // Open to all
  RESTRICTED: "restricted",   // Tier-based access
  CONFIDENTIAL: "confidential", // Verified users only
  SECRET: "secret",          // Special permission required
  TOP_SECRET: "top_secret"   // Highest security clearance
} as const;

// Legal Importance Levels
export const LEGAL_IMPORTANCE = {
  STANDARD: "standard",
  CONTRACTUAL: "contractual",
  REGULATORY: "regulatory", 
  CRIMINAL: "criminal",
  CIVIL: "civil",
  CONSTITUTIONAL: "constitutional",
  INTERNATIONAL: "international"
} as const;

// Evidence Types
export const EVIDENCE_TYPES = {
  DOCUMENTARY: "documentary",
  PHOTOGRAPHIC: "photographic", 
  VIDEO: "video",
  AUDIO: "audio",
  DIGITAL: "digital",
  WITNESS: "witness",
  EXPERT: "expert",
  PHYSICAL: "physical",
  CIRCUMSTANTIAL: "circumstantial"
} as const;

// Submission Methods
export const SUBMISSION_METHODS = {
  STANDARD: "standard",
  ENCRYPTED: "encrypted",
  ANONYMOUS: "anonymous",
  WHISTLEBLOWER: "whistleblower",
  PROFESSIONAL: "professional",
  EMERGENCY: "emergency",
  SCHEDULED: "scheduled"
} as const;

export type CapsuleType = typeof CAPSULE_TYPES[keyof typeof CAPSULE_TYPES];
export type VeritasSealType = typeof VERITAS_SEAL_TYPES[keyof typeof VERITAS_SEAL_TYPES];
export type UrgencyLevel = typeof URGENCY_LEVELS[keyof typeof URGENCY_LEVELS];
export type SensitivityLevel = typeof SENSITIVITY_LEVELS[keyof typeof SENSITIVITY_LEVELS];
export type LegalImportance = typeof LEGAL_IMPORTANCE[keyof typeof LEGAL_IMPORTANCE];
export type EvidenceType = typeof EVIDENCE_TYPES[keyof typeof EVIDENCE_TYPES];
export type SubmissionMethod = typeof SUBMISSION_METHODS[keyof typeof SUBMISSION_METHODS];

// New capsule vault entries table for timeline functionality
export const capsuleVaultEntries = pgTable("capsule_vault_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  capsuleId: varchar("capsule_id").references(() => capsules.id).notNull(),
  entryType: varchar("entry_type").notNull(), // post, media, story, etc.
  caption: text("caption"),
  visibility: varchar("visibility").default("public"), // public, private, friends
  tags: varchar("tags").array(),
  likesCount: integer("likes_count").default(0),
  commentsCount: integer("comments_count").default(0),
  sharesCount: integer("shares_count").default(0),
  isPinned: boolean("is_pinned").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User saved changes tracking
export const userSavedChanges = pgTable("user_saved_changes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  changeType: varchar("change_type").notNull(), // profile, capsule, media
  changeData: jsonb("change_data").notNull(),
  hasUnsavedChanges: boolean("has_unsaved_changes").default(true),
  sessionId: varchar("session_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type NewUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Capsule = typeof capsules.$inferSelect;
export type NewCapsule = typeof capsules.$inferInsert;
export type CapsuleVaultEntry = typeof capsuleVaultEntries.$inferSelect;
export type NewCapsuleVaultEntry = typeof capsuleVaultEntries.$inferInsert;
export type UserSavedChanges = typeof userSavedChanges.$inferSelect;
export type NewUserSavedChanges = typeof userSavedChanges.$inferInsert;
export type Verification = typeof verifications.$inferSelect;
export type NewVerification = typeof verifications.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
export type Achievement = typeof achievements.$inferSelect;
export type NewAchievement = typeof achievements.$inferInsert;
export type ReplayLog = typeof replayLogs.$inferSelect;
export type NewReplayLog = typeof replayLogs.$inferInsert;

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const insertCapsuleSchema = createInsertSchema(capsules);
export const insertCapsuleVaultEntrySchema = createInsertSchema(capsuleVaultEntries);
export const insertUserSavedChangesSchema = createInsertSchema(userSavedChanges);
export const insertVerificationSchema = createInsertSchema(verifications);
export const insertTransactionSchema = createInsertSchema(transactions);
export const insertAchievementSchema = createInsertSchema(achievements);
export const insertReplayLogSchema = createInsertSchema(replayLogs);

export type Asset = typeof assets.$inferSelect;
export type NewAsset = typeof assets.$inferInsert;

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

// DAO Governance System Tables
export const proposals = pgTable("proposals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title"),
  description: text("description"),
  status: text("status").default("open"), // open, closed, executed
  startTime: timestamp("start_time").defaultNow(),
  endTime: timestamp("end_time"),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const votes = pgTable("votes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  proposalId: varchar("proposal_id").references(() => proposals.id),
  voterAddress: text("voter_address"),
  choice: text("choice"), // support, reject, abstain
  weight: numeric("weight"),
  castAt: timestamp("cast_at").defaultNow(),
});

export const truthCertificates = pgTable("truth_certificates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  capsuleId: text("capsule_id"),
  walletAddress: text("wallet_address"),
  timestamp: timestamp("timestamp").defaultNow(),
  hash: text("hash"),
  signedPdfUrl: text("signed_pdf_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema types for DAO Governance
export const insertProposalSchema = createInsertSchema(proposals);
export const insertVoteSchema = createInsertSchema(votes);
export const insertTruthCertificateSchema = createInsertSchema(truthCertificates);

export type InsertProposal = typeof proposals.$inferInsert;
export type Proposal = typeof proposals.$inferSelect;
export type InsertVote = typeof votes.$inferInsert;
export type Vote = typeof votes.$inferSelect;
export type InsertTruthCertificate = typeof truthCertificates.$inferInsert;
export type TruthCertificate = typeof truthCertificates.$inferSelect;