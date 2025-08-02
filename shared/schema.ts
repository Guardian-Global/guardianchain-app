import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
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

// User storage table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Newsletter subscribers table for email subscriptions
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
  status: varchar("status").default("active"),
});

// Capsules table for truth capsule storage and search
export const capsules = pgTable("capsules", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
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
}, (table) => [
  // Full-text search index
  index("idx_capsules_fulltext").using("gin", sql`to_tsvector('english', ${table.title} || ' ' || coalesce(${table.description}, ''))`),
  // Tag-based filtering index
  index("idx_capsules_tags").using("gin", table.tags),
  // Performance indexes
  index("idx_capsules_author").on(table.author),
  index("idx_capsules_category").on(table.category),
  index("idx_capsules_created_at").on(table.createdAt),
]);

// Type definitions
export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;
export type Capsule = typeof capsules.$inferSelect;
export type InsertCapsule = typeof capsules.$inferInsert;

// Validation schemas
export const insertUserSchema = createInsertSchema(users);
export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers);
export const insertCapsuleSchema = createInsertSchema(capsules);

export type InsertUserType = z.infer<typeof insertUserSchema>;
export type InsertNewsletterSubscriberType = z.infer<typeof insertNewsletterSubscriberSchema>;
export type InsertCapsuleType = z.infer<typeof insertCapsuleSchema>;