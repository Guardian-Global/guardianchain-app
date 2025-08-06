// shared/schema.ts
// Database schema definitions and validation

import { z } from 'zod';

// User Profile Schema
export const ProfileSchema = z.object({
  id: z.string().uuid(),
  wallet_address: z.string(),
  email: z.string().email().optional(),
  username: z.string().min(3).max(50).optional(),
  display_name: z.string().max(100).optional(),
  avatar_url: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().optional(),
  social_links: z.record(z.string()).optional(),
  tier: z.enum(['SEEKER', 'EXPLORER', 'CREATOR', 'SOVEREIGN', 'ADMIN']).default('SEEKER'),
  subscription_status: z.enum(['free', 'active', 'canceled', 'expired']).default('free'),
  onboarding_completed: z.boolean().default(false),
  preferences: z.record(z.any()).optional(),
  created_at: z.string(),
  updated_at: z.string()
});

export const CreateProfileSchema = ProfileSchema.omit({
  id: true,
  created_at: true,
  updated_at: true
});

export const UpdateProfileSchema = CreateProfileSchema.partial();

// Capsule Schema
export const CapsuleSchema = z.object({
  id: z.string().uuid(),
  owner_wallet_address: z.string(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  content: z.string().optional(),
  grief_score: z.number().int().min(0).max(10).default(0),
  gtt_reward: z.number().default(0),
  visibility: z.enum(['private', 'friends', 'public', 'unlockable']).default('private'),
  unlock_conditions: z.record(z.any()).optional(),
  time_locked_until: z.string().optional(),
  is_sealed: z.boolean().default(false),
  is_minted: z.boolean().default(false),
  nft_token_id: z.string().optional(),
  ipfs_hash: z.string().optional(),
  media_urls: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  emotional_tags: z.record(z.any()).optional(),
  lineage_parent_id: z.string().uuid().optional(),
  remix_count: z.number().int().default(0),
  view_count: z.number().int().default(0),
  unlock_count: z.number().int().default(0),
  verification_status: z.enum(['pending', 'verified', 'rejected']).default('pending'),
  metadata: z.record(z.any()).optional(),
  created_at: z.string(),
  updated_at: z.string()
});

export const CreateCapsuleSchema = CapsuleSchema.omit({
  id: true,
  owner_wallet_address: true,
  remix_count: true,
  view_count: true,
  unlock_count: true,
  created_at: true,
  updated_at: true
});

// Vault Entry Schema
export const VaultEntrySchema = z.object({
  id: z.string().uuid(),
  owner_wallet_address: z.string(),
  title: z.string().min(1).max(200),
  content: z.string().optional(),
  entry_type: z.enum(['memory', 'document', 'media', 'note']).default('memory'),
  is_encrypted: z.boolean().default(false),
  encryption_key_hash: z.string().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
  created_at: z.string(),
  updated_at: z.string()
});

export const CreateVaultEntrySchema = VaultEntrySchema.omit({
  id: true,
  owner_wallet_address: true,
  created_at: true,
  updated_at: true
});

// GTT Balance Schema
export const GTTBalanceSchema = z.object({
  id: z.string().uuid(),
  wallet_address: z.string(),
  balance: z.number().default(0),
  total_earned: z.number().default(0),
  total_spent: z.number().default(0),
  last_calculated_at: z.string(),
  updated_at: z.string()
});

// Activity Schema
export const UserActivitySchema = z.object({
  id: z.string().uuid(),
  user_wallet_address: z.string(),
  activity_type: z.string(),
  activity_data: z.record(z.any()).optional(),
  ip_address: z.string().optional(),
  user_agent: z.string().optional(),
  created_at: z.string()
});

export const CreateUserActivitySchema = UserActivitySchema.omit({
  id: true,
  created_at: true
});

// Session Schema
export const SessionSchema = z.object({
  id: z.string().uuid(),
  user_wallet_address: z.string(),
  session_token: z.string(),
  expires_at: z.string(),
  created_at: z.string(),
  updated_at: z.string()
});

export const CreateSessionSchema = SessionSchema.omit({
  id: true,
  created_at: true,
  updated_at: true
});

// Email Verification Token Schema
export const EmailVerificationTokenSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  token: z.string(),
  expires_at: z.string(),
  created_at: z.string()
});

export const CreateEmailVerificationTokenSchema = EmailVerificationTokenSchema.omit({
  id: true,
  created_at: true
});

// User Schema for compatibility
export const UserSchema = ProfileSchema.extend({
  email_verified: z.boolean().default(false),
  password_hash: z.string().optional()
});

export const CreateUserSchema = UserSchema.omit({
  id: true,
  created_at: true,
  updated_at: true
});

// Registration and update schemas for server compatibility
export const userRegistrationSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  username: z.string().min(3),
  password: z.string().min(8).optional()
});

export const userProfileUpdateSchema = z.object({
  display_name: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().optional(),
  avatar_url: z.string().url().optional()
});

// Legacy field mappings for server compatibility
export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

// Additional schemas for DAO and lineage functionality
export const DAOCertificationSchema = z.object({
  id: z.string().uuid(),
  capsule_id: z.string().uuid(),
  certifier_wallet_address: z.string(),
  certification_type: z.enum(['verified', 'disputed', 'endorsed']),
  certification_data: z.record(z.any()).optional(),
  created_at: z.string()
});

export const CapsuleLineageSchema = z.object({
  id: z.string().uuid(),
  child_capsule_id: z.string().uuid(),
  parent_capsule_id: z.string().uuid(),
  relationship_type: z.enum(['remix', 'response', 'reference', 'evolution']),
  influence_score: z.number().default(0),
  created_at: z.string()
});

// Drizzle table exports for server compatibility
export const users = UserSchema;
export const profiles = ProfileSchema;
export const capsules = CapsuleSchema;
export const sessions = SessionSchema;
export const emailVerificationTokens = EmailVerificationTokenSchema;
export const userActivities = UserActivitySchema;
export const vaultEntries = VaultEntrySchema;
export const gttBalances = GTTBalanceSchema;
export const daoCertifications = DAOCertificationSchema;
export const capsuleLineage = CapsuleLineageSchema;

// Additional schemas for stats and analytics
export const CapsuleStatsSchema = z.object({
  id: z.string().uuid(),
  capsule_id: z.string().uuid(),
  daily_views: z.number().default(0),
  daily_unlocks: z.number().default(0),
  total_views: z.number().default(0),
  total_unlocks: z.number().default(0),
  engagement_score: z.number().default(0),
  last_updated: z.string(),
  created_at: z.string()
});

export const capsuleStats = CapsuleStatsSchema;

// Type exports
export type Profile = z.infer<typeof ProfileSchema>;
export type CreateProfile = z.infer<typeof CreateProfileSchema>;
export type UpdateProfile = z.infer<typeof UpdateProfileSchema>;

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;

export type Capsule = z.infer<typeof CapsuleSchema>;
export type CreateCapsule = z.infer<typeof CreateCapsuleSchema>;

export type VaultEntry = z.infer<typeof VaultEntrySchema>;
export type CreateVaultEntry = z.infer<typeof CreateVaultEntrySchema>;

export type Session = z.infer<typeof SessionSchema>;
export type CreateSession = z.infer<typeof CreateSessionSchema>;

export type EmailVerificationToken = z.infer<typeof EmailVerificationTokenSchema>;
export type CreateEmailVerificationToken = z.infer<typeof CreateEmailVerificationTokenSchema>;

export type GTTBalance = z.infer<typeof GTTBalanceSchema>;
export type UserActivity = z.infer<typeof UserActivitySchema>;
export type CreateUserActivity = z.infer<typeof CreateUserActivitySchema>;

// Additional type exports for server compatibility
export type UserRegistration = z.infer<typeof userRegistrationSchema>;
export type UserProfileUpdate = z.infer<typeof userProfileUpdateSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;

// Legacy interface for AuthService compatibility
export interface InsertUserActivity {
  user_wallet_address: string;
  activity_type: string;
  activity_data?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

// Additional type exports
export type DAOCertification = z.infer<typeof DAOCertificationSchema>;
export type CapsuleLineage = z.infer<typeof CapsuleLineageSchema>;
export type CapsuleStats = z.infer<typeof CapsuleStatsSchema>;