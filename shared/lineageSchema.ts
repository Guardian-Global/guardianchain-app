import { pgTable, text, integer, numeric, uuid, timestamptz } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Lineage tracking table for capsule inheritance
export const lineage = pgTable("lineage", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  parentId: text("parent_id"), // references capsules.id
  childId: text("child_id"), // references capsules.id  
  triggeredBy: text("triggered_by"), // wallet address of user who created lineage
  timestamp: timestamptz("timestamp").defaultNow(),
  griefFlow: integer("grief_flow"), // grief score inherited from parent
  influenceScore: numeric("influence_score") // calculated influence metric
});

// Extended capsule fields for lineage support
export interface CapsuleLineageFields {
  inspiredBy?: string; // references capsules.id
  griefInherited?: number; // grief score inherited from parent
  influenceScore?: number; // calculated influence on other capsules
}

// Types for lineage operations
export type LineageInsert = typeof lineage.$inferInsert;
export type LineageSelect = typeof lineage.$inferSelect;

// Lineage creation payload
export interface CreateLineagePayload {
  parentId: string;
  childId: string;
  triggeredBy: string;
  griefFlow?: number;
  influenceScore?: number;
}

// Lineage tree structure for visualization
export interface LineageTree {
  capsuleId: string;
  title: string;
  griefTier: number;
  children: LineageTree[];
  influence: number;
  depth: number;
}

// Lineage analytics
export interface LineageAnalytics {
  totalLineages: number;
  avgGriefFlow: number;
  topInfluencers: Array<{
    capsuleId: string;
    title: string;
    influenceScore: number;
    descendantCount: number;
  }>;
  lineageDepth: {
    maxDepth: number;
    avgDepth: number;
  };
}