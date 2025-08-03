import { sql } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  timestamp,
  integer,
  boolean,
  jsonb,
  decimal,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Subscription tiers enum
export const subscriptionTierEnum = pgEnum('subscription_tier', [
  'EXPLORER',    // Free tier - 5 capsules, basic features
  'SEEKER',      // $9/month - 50 capsules, AI analysis
  'CREATOR',     // $29/month - 500 capsules, NFT minting, API access
  'SOVEREIGN'    // $99/month - Unlimited, white-label, developer API
]);

// Payment status enum
export const paymentStatusEnum = pgEnum('payment_status', [
  'PENDING',
  'ACTIVE',
  'PAST_DUE',
  'CANCELED',
  'INCOMPLETE',
  'TRIALING'
]);

// Subscription plans table
export const subscriptionPlans = pgTable("subscription_plans", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  tier: subscriptionTierEnum("tier").notNull(),
  priceMonthly: decimal("price_monthly", { precision: 10, scale: 2 }).notNull(),
  priceYearly: decimal("price_yearly", { precision: 10, scale: 2 }),
  features: jsonb("features").notNull().$type<{
    capsulesLimit: number;
    aiAnalysis: boolean;
    nftMinting: boolean;
    apiAccess: boolean;
    whiteLabel: boolean;
    prioritySupport: boolean;
    customBranding: boolean;
    advancedAnalytics: boolean;
  }>(),
  stripeProductId: varchar("stripe_product_id"),
  stripePriceId: varchar("stripe_price_id"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User subscriptions table
export const userSubscriptions = pgTable("user_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  planId: varchar("plan_id").notNull().references(() => subscriptionPlans.id),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  stripeCustomerId: varchar("stripe_customer_id"),
  status: paymentStatusEnum("status").notNull().default('PENDING'),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  trialEnd: timestamp("trial_end"),
  metadata: jsonb("metadata").$type<{
    source?: string;
    promoCode?: string;
    referredBy?: string;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// API usage tracking table
export const apiUsage = pgTable("api_usage", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  endpoint: varchar("endpoint").notNull(),
  method: varchar("method").notNull(),
  requestCount: integer("request_count").notNull().default(1),
  responseTime: integer("response_time"), // in milliseconds
  statusCode: integer("status_code"),
  metadata: jsonb("metadata").$type<{
    userAgent?: string;
    ipAddress?: string;
    capsuleId?: string;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Developer API keys table
export const developerApiKeys = pgTable("developer_api_keys", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  keyName: varchar("key_name").notNull(),
  apiKey: varchar("api_key").notNull().unique(),
  permissions: jsonb("permissions").notNull().$type<{
    endpoints: string[];
    rateLimit: number; // requests per minute
    features: string[];
  }>(),
  isActive: boolean("is_active").default(true),
  lastUsed: timestamp("last_used"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Usage analytics table
export const usageAnalytics = pgTable("usage_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  date: varchar("date").notNull(), // YYYY-MM-DD format
  capsulesCreated: integer("capsules_created").default(0),
  apiCallsMade: integer("api_calls_made").default(0),
  storageUsed: integer("storage_used").default(0), // in MB
  bandwidthUsed: integer("bandwidth_used").default(0), // in MB
  gttEarned: decimal("gtt_earned", { precision: 18, scale: 8 }).default('0'),
  metadata: jsonb("metadata").$type<{
    mostUsedFeatures?: string[];
    peakUsageTime?: string;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas for validation
export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans);
export const insertUserSubscriptionSchema = createInsertSchema(userSubscriptions);
export const insertApiUsageSchema = createInsertSchema(apiUsage);
export const insertDeveloperApiKeySchema = createInsertSchema(developerApiKeys);
export const insertUsageAnalyticsSchema = createInsertSchema(usageAnalytics);

// TypeScript types
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;
export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type InsertUserSubscription = z.infer<typeof insertUserSubscriptionSchema>;
export type ApiUsage = typeof apiUsage.$inferSelect;
export type InsertApiUsage = z.infer<typeof insertApiUsageSchema>;
export type DeveloperApiKey = typeof developerApiKeys.$inferSelect;
export type InsertDeveloperApiKey = z.infer<typeof insertDeveloperApiKeySchema>;
export type UsageAnalytics = typeof usageAnalytics.$inferSelect;
export type InsertUsageAnalytics = z.infer<typeof insertUsageAnalyticsSchema>;

// Subscription tier limits
export const SUBSCRIPTION_LIMITS = {
  EXPLORER: {
    capsulesLimit: 5,
    apiCallsPerMonth: 0,
    storageLimit: 100, // MB
    features: ['basic_capsules', 'public_explorer']
  },
  SEEKER: {
    capsulesLimit: 50,
    apiCallsPerMonth: 1000,
    storageLimit: 1000, // MB
    features: ['basic_capsules', 'ai_analysis', 'truth_genome', 'public_explorer']
  },
  CREATOR: {
    capsulesLimit: 500,
    apiCallsPerMonth: 10000,
    storageLimit: 10000, // MB
    features: ['all_capsule_types', 'ai_analysis', 'nft_minting', 'api_access', 'truth_genome', 'custom_reels']
  },
  SOVEREIGN: {
    capsulesLimit: -1, // unlimited
    apiCallsPerMonth: 100000,
    storageLimit: -1, // unlimited
    features: ['everything', 'white_label', 'priority_support', 'custom_branding', 'advanced_analytics', 'dedicated_support']
  }
} as const;