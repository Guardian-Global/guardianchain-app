import { Router } from 'express';
import { requireAdmin, requireSovereign } from '../middleware/requireAdmin';
import { adminRateLimiter } from '../middleware/rateLimiter';
import { db } from '../db';
// import { capsules, daoCertifications, capsuleLineage, users } from '../compatibility/schema-adapter';
// Temporary: Using minimal exports
import { eq, desc, count, and } from 'drizzle-orm';

const router = Router();

// Apply admin rate limiting to all DAO routes
router.use(adminRateLimiter);

// DAO Certification Management
router.post('/certify/:capsuleId', requireAdmin, async (req, res) => {
  try {
    const { capsuleId } = req.params;
    const { reason, expiresInDays = 365 } = req.body;
    const certifier = req.user!;

    // Check if capsule exists
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

    // Check if already certified
    if (capsule.daoCertified) {
      return res.status(409).json({ 
        error: 'Capsule already DAO-certified',
        code: 'ALREADY_CERTIFIED',
        certificationDate: capsule.certificationDate
      });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    // Create certification record
    const [certification] = await db
      .insert(daoCertifications)
      .values({
        capsuleId,
        certifiedBy: certifier.id,
        status: 'approved',
        reason: reason || 'DAO approved for minting',
        votesFor: '1',
        votesAgainst: '0',
        certificationDate: new Date(),
        expiresAt
      })
      .returning();

    // Update capsule with certification
    const [updatedCapsule] = await db
      .update(capsules)
      .set({
        daoCertified: true,
        certificationDate: new Date(),
        updatedAt: new Date()
      })
      .where(eq(capsules.id, capsuleId))
      .returning();

    console.log(`✅ DAO certified capsule ${capsuleId} by admin ${certifier.email}`);

    res.json({
      success: true,
      message: 'Capsule successfully DAO-certified',
      capsule: updatedCapsule,
      certification: certification
    });

  } catch (error) {
    console.error('DAO certification error:', error);
    res.status(500).json({ 
      error: 'Failed to certify capsule',
      code: 'CERTIFICATION_ERROR' 
    });
  }
});

// Revoke DAO certification
router.delete('/certify/:capsuleId', requireSovereign, async (req, res) => {
  try {
    const { capsuleId } = req.params;
    const { reason } = req.body;

    // Update capsule to remove certification
    const [updatedCapsule] = await db
      .update(capsules)
      .set({
        daoCertified: false,
        certificationDate: null,
        updatedAt: new Date()
      })
      .where(eq(capsules.id, capsuleId))
      .returning();

    if (!updatedCapsule) {
      return res.status(404).json({ 
        error: 'Capsule not found',
        code: 'CAPSULE_NOT_FOUND' 
      });
    }

    // Update certification record
    await db
      .update(daoCertifications)
      .set({
        status: 'revoked',
        reason: reason || 'Certification revoked by sovereign admin'
      })
      .where(eq(daoCertifications.capsuleId, capsuleId));

    console.log(`❌ DAO certification revoked for capsule ${capsuleId}`);

    res.json({
      success: true,
      message: 'DAO certification revoked',
      capsule: updatedCapsule
    });

  } catch (error) {
    console.error('DAO certification revocation error:', error);
    res.status(500).json({ 
      error: 'Failed to revoke certification',
      code: 'REVOCATION_ERROR' 
    });
  }
});

// Get pending certifications
router.get('/certifications/pending', requireAdmin, async (req, res) => {
  try {
    const pendingCapsules = await db
      .select({
        id: capsules.id,
        title: capsules.title,
        author: capsules.author,
        createdAt: capsules.createdAt,
        daoCertified: capsules.daoCertified,
        restrictedContent: capsules.restrictedContent
      })
      .from(capsules)
      .where(eq(capsules.daoCertified, false))
      .orderBy(desc(capsules.createdAt))
      .limit(50);

    res.json({
      pendingCertifications: pendingCapsules,
      count: pendingCapsules.length
    });

  } catch (error) {
    console.error('Pending certifications error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch pending certifications',
      code: 'PENDING_CERTIFICATIONS_ERROR' 
    });
  }
});

// Get certification history
router.get('/certifications/history', requireAdmin, async (req, res) => {
  try {
    const certifications = await db
      .select()
      .from(daoCertifications)
      .orderBy(desc(daoCertifications.createdAt))
      .limit(100);

    res.json({
      certifications,
      count: certifications.length
    });

  } catch (error) {
    console.error('Certification history error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch certification history',
      code: 'CERTIFICATION_HISTORY_ERROR' 
    });
  }
});

// Capsule Lineage Management
router.post('/lineage', requireAdmin, async (req, res) => {
  try {
    const { parentCapsule, childCapsule, action, metadata } = req.body;

    if (!childCapsule || !action) {
      return res.status(400).json({ 
        error: 'Child capsule and action are required',
        code: 'MISSING_LINEAGE_DATA' 
      });
    }

    const [lineage] = await db
      .insert(capsuleLineage)
      .values({
        parentCapsule: parentCapsule || null,
        childCapsule,
        action,
        metadata: metadata || {}
      })
      .returning();

    console.log(`📊 Lineage recorded: ${action} for capsule ${childCapsule}`);

    res.json({
      success: true,
      lineage
    });

  } catch (error) {
    console.error('Lineage creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create lineage record',
      code: 'LINEAGE_ERROR' 
    });
  }
});

// Get capsule lineage graph
router.get('/lineage/:capsuleId', async (req, res) => {
  try {
    const { capsuleId } = req.params;

    // Get all related lineage records
    const lineageRecords = await db
      .select()
      .from(capsuleLineage)
      .where(
        eq(capsuleLineage.childCapsule, capsuleId)
      );

    // Get parent lineage
    const parentLineage = await db
      .select()
      .from(capsuleLineage)
      .where(
        eq(capsuleLineage.parentCapsule, capsuleId)
      );

    const allLineages = [...lineageRecords, ...parentLineage];

    // Build graph data structure
    const nodes = new Set();
    const edges = [];

    // Add current capsule as root node
    nodes.add(capsuleId);

    allLineages.forEach(lineage => {
      if (lineage.parentCapsule) {
        nodes.add(lineage.parentCapsule);
        edges.push({
          id: lineage.id,
          source: lineage.parentCapsule,
          target: lineage.childCapsule,
          action: lineage.action,
          metadata: lineage.metadata,
          createdAt: lineage.createdAt
        });
      }
      nodes.add(lineage.childCapsule);
    });

    res.json({
      capsuleId,
      graph: {
        nodes: Array.from(nodes).map(id => ({ id, type: 'capsule' })),
        edges
      },
      lineageCount: allLineages.length
    });

  } catch (error) {
    console.error('Lineage graph error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch capsule lineage',
      code: 'LINEAGE_FETCH_ERROR' 
    });
  }
});

// DAO Statistics
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const [totalCertified] = await db
      .select({ count: count() })
      .from(capsules)
      .where(eq(capsules.daoCertified, true));

    const [totalPending] = await db
      .select({ count: count() })
      .from(capsules)
      .where(eq(capsules.daoCertified, false));

    const [totalLineageRecords] = await db
      .select({ count: count() })
      .from(capsuleLineage);

    const recentCertifications = await db
      .select({
        id: capsules.id,
        title: capsules.title,
        certificationDate: capsules.certificationDate
      })
      .from(capsules)
      .where(eq(capsules.daoCertified, true))
      .orderBy(desc(capsules.certificationDate))
      .limit(10);

    res.json({
      certified: totalCertified.count,
      pending: totalPending.count,
      lineageRecords: totalLineageRecords.count,
      recentCertifications,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('DAO stats error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch DAO statistics',
      code: 'DAO_STATS_ERROR' 
    });
  }
});

export default router;