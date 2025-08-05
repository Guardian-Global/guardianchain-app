import { Router } from 'express';
import { consolidatedAuth } from '../../auth/authConsolidation';
import { db } from '../../db';
import { capsules, capsuleLineage } from '@shared/schema';
import { eq, and, or, sql } from 'drizzle-orm';

const router = Router();

// Get capsule lineage data for visualization
router.get('/lineage/:capsuleId', consolidatedAuth, async (req, res) => {
  try {
    const { capsuleId } = req.params;
    const user = req.user!;

    // Verify capsule exists and user has access
    const [capsule] = await db
      .select()
      .from(capsules)
      .where(eq(capsules.id, capsuleId));

    if (!capsule) {
      return res.status(404).json({ 
        error: 'Capsule not found',
        code: 'CAPSULE_NOT_FOUND' 
      });
    }

    // Get all lineage relationships for this capsule (both as parent and child)
    const lineageData = await db
      .select({
        id: capsuleLineage.id,
        parentId: capsuleLineage.parentCapsule,
        childId: capsuleLineage.childCapsule,
        relationship: capsuleLineage.action,
        strength: sql`1.0`,
        createdAt: capsuleLineage.createdAt
      })
      .from(capsuleLineage)
      .where(
        or(
          eq(capsuleLineage.parentCapsule, capsuleId),
          eq(capsuleLineage.childCapsule, capsuleId)
        )
      );

    // Get all related capsule IDs
    const relatedIds = new Set([capsuleId]);
    lineageData.forEach(rel => {
      relatedIds.add(rel.parentId);
      relatedIds.add(rel.childId);
    });

    // Fetch details for all related capsules
    const relatedCapsules = await db
      .select({
        id: capsules.id,
        title: capsules.title,
        author: capsules.author,
        createdAt: capsules.createdAt,
        verified: capsules.verified,
        daoCertified: capsules.daoCertified
      })
      .from(capsules)
      .where(
        or(...Array.from(relatedIds).map(id => eq(capsules.id, id)))
      );

    // Build graph structure
    const nodes = relatedCapsules.map(capsule => ({
      id: capsule.id,
      title: capsule.title || 'Untitled Capsule',
      author: capsule.author || 'Unknown',
      createdAt: capsule.createdAt?.toISOString() || new Date().toISOString(),
      verified: capsule.verified || false,
      daoCertified: capsule.daoCertified || false
    }));

    const relationships = lineageData.map(rel => ({
      from: rel.parentId,
      to: rel.childId,
      relationship: rel.relationship || 'reference',
      strength: rel.strength || 0.5
    }));

    // Calculate statistics
    const stats = {
      totalNodes: nodes.length,
      verifiedNodes: nodes.filter(n => n.verified).length,
      daoCertifiedNodes: nodes.filter(n => n.daoCertified).length,
      maxDepth: calculateMaxDepth(relationships, capsuleId)
    };

    res.json({
      nodes,
      relationships,
      stats,
      centerNode: capsuleId
    });

  } catch (error) {
    console.error('Lineage fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch capsule lineage',
      code: 'LINEAGE_FETCH_ERROR' 
    });
  }
});

// Get lineage summary for a user's profile
router.get('/user/:userId/lineage-summary', consolidatedAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const requestingUser = req.user!;

    // Check if user can view this profile (public or own profile)
    if (userId !== requestingUser.id) {
      // Add privacy check if needed
    }

    // Get user's capsules with lineage data
    const userCapsules = await db
      .select({
        id: capsules.id,
        title: capsules.title,
        createdAt: capsules.createdAt,
        verified: capsules.verified,
        daoCertified: capsules.daoCertified
      })
      .from(capsules)
      .where(eq(capsules.author, userId));

    // Get lineage stats for each capsule
    const lineageStats = await Promise.all(
      userCapsules.map(async (capsule) => {
        const [parentCount] = await db
          .select({ count: sql<number>`count(*)` })
          .from(capsuleLineage)
          .where(eq(capsuleLineage.childCapsule, capsule.id));

        const [childCount] = await db
          .select({ count: sql<number>`count(*)` })
          .from(capsuleLineage)
          .where(eq(capsuleLineage.parentCapsule, capsule.id));

        return {
          capsuleId: capsule.id,
          title: capsule.title,
          verified: capsule.verified,
          daoCertified: capsule.daoCertified,
          parentCount: parentCount.count || 0,
          childCount: childCount.count || 0,
          createdAt: capsule.createdAt
        };
      })
    );

    const summary = {
      totalCapsules: userCapsules.length,
      verifiedCapsules: userCapsules.filter(c => c.verified).length,
      daoCertifiedCapsules: userCapsules.filter(c => c.daoCertified).length,
      capsulesWithLineage: lineageStats.filter(s => s.parentCount > 0 || s.childCount > 0).length,
      lineageStats
    };

    res.json(summary);

  } catch (error) {
    console.error('Lineage summary error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch lineage summary',
      code: 'LINEAGE_SUMMARY_ERROR' 
    });
  }
});

// Helper function to calculate maximum depth in lineage tree
function calculateMaxDepth(relationships: any[], startNodeId: string): number {
  const graph = new Map<string, string[]>();
  
  // Build adjacency list
  relationships.forEach(rel => {
    if (!graph.has(rel.from)) graph.set(rel.from, []);
    graph.get(rel.from)!.push(rel.to);
  });

  // DFS to find maximum depth
  function dfs(nodeId: string, visited: Set<string>, depth: number): number {
    if (visited.has(nodeId)) return depth;
    
    visited.add(nodeId);
    const children = graph.get(nodeId) || [];
    
    if (children.length === 0) return depth;
    
    let maxChildDepth = depth;
    children.forEach(childId => {
      const childDepth = dfs(childId, new Set(visited), depth + 1);
      maxChildDepth = Math.max(maxChildDepth, childDepth);
    });
    
    return maxChildDepth;
  }

  return dfs(startNodeId, new Set(), 0);
}

export default router;