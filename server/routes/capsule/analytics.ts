import express from "express";
import { db } from "../../db";
import { 
  capsuleActivityLog, 
  userCapsuleInteractions, 
  capsuleBehaviorLabels,
  capsuleInteractionSpikes
} from "@shared/schema";
import { eq, sql, desc, and, gte } from "drizzle-orm";
// Note: json2csv would need to be installed, using simple JSON export for now

const router = express.Router();

// Get capsule audit logs with export functionality
router.get("/audit/:capsuleId", async (req, res) => {
  try {
    const { capsuleId } = req.params;
    const format = req.query.format || "json";

    const data = await db
      .select()
      .from(capsuleActivityLog)
      .where(eq(capsuleActivityLog.capsuleId, capsuleId))
      .orderBy(desc(capsuleActivityLog.createdAt));

    if (format === "csv") {
      // Simple CSV conversion without external library
      if (data.length === 0) {
        const csv = "No data available";
        res.header("Content-Type", "text/csv");
        res.attachment(`capsule-${capsuleId}-audit.csv`);
        return res.send(csv);
      }
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map((row: any) => Object.values(row).join(','));
      const csv = [headers, ...rows].join('\n');
      res.header("Content-Type", "text/csv");
      res.attachment(`capsule-${capsuleId}-audit.csv`);
      return res.send(csv);
    }

    res.json(data);
  } catch (error) {
    console.error("Failed to export audit logs:", error);
    res.status(500).json({ error: "Failed to export audit logs" });
  }
});

// Get daily interaction trends
router.get("/trends/:capsuleId", async (req, res) => {
  try {
    const { capsuleId } = req.params;
    
    const trendsData = await db.execute(sql`
      SELECT 
        DATE_TRUNC('day', created_at) as day,
        COUNT(*) as interactions
      FROM ${capsuleActivityLog}
      WHERE capsule_id = ${capsuleId}
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY day ASC
    `);

    res.json(trendsData.rows);
  } catch (error) {
    console.error("Failed to get trends data:", error);
    res.status(500).json({ error: "Failed to get trends data" });
  }
});

// Get engagement heatmap data
router.get("/heatmap/:capsuleId", async (req, res) => {
  try {
    const { capsuleId } = req.params;
    
    const heatmapData = await db.execute(sql`
      SELECT
        EXTRACT(hour from created_at) as hour,
        EXTRACT(dow from created_at) as day_of_week,
        COUNT(*) as interactions
      FROM ${capsuleActivityLog}
      WHERE capsule_id = ${capsuleId}
      GROUP BY EXTRACT(hour from created_at), EXTRACT(dow from created_at)
      ORDER BY day_of_week, hour
    `);

    res.json(heatmapData.rows);
  } catch (error) {
    console.error("Failed to get heatmap data:", error);
    res.status(500).json({ error: "Failed to get heatmap data" });
  }
});

// Get interaction spikes
router.get("/spikes/:capsuleId", async (req, res) => {
  try {
    const { capsuleId } = req.params;
    
    const spikes = await db
      .select()
      .from(capsuleInteractionSpikes)
      .where(eq(capsuleInteractionSpikes.capsuleId, capsuleId))
      .orderBy(desc(capsuleInteractionSpikes.spikeDate));

    res.json(spikes);
  } catch (error) {
    console.error("Failed to get spikes data:", error);
    res.status(500).json({ error: "Failed to get spikes data" });
  }
});

// Get user interaction history
router.get("/user-interactions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    const interactions = await db
      .select()
      .from(userCapsuleInteractions)
      .where(eq(userCapsuleInteractions.userId, userId))
      .orderBy(desc(userCapsuleInteractions.createdAt))
      .limit(100);

    res.json(interactions);
  } catch (error) {
    console.error("Failed to get user interactions:", error);
    res.status(500).json({ error: "Failed to get user interactions" });
  }
});

// Get behavior labels
router.get("/behavior/:capsuleId", async (req, res) => {
  try {
    const { capsuleId } = req.params;
    
    const [behaviorLabel] = await db
      .select()
      .from(capsuleBehaviorLabels)
      .where(eq(capsuleBehaviorLabels.capsuleId, capsuleId));

    res.json(behaviorLabel || null);
  } catch (error) {
    console.error("Failed to get behavior label:", error);
    res.status(500).json({ error: "Failed to get behavior label" });
  }
});

// Log activity with spike detection
router.post("/log-activity", async (req, res) => {
  try {
    const { capsuleId, userId, action, metadata } = req.body;

    // Log the activity
    await db.insert(capsuleActivityLog).values({
      capsuleId,
      userId,
      action,
      metadata,
    });

    // Also log to user interactions
    if (userId) {
      await db.insert(userCapsuleInteractions).values({
        userId,
        capsuleId,
        action,
      });
    }

    // Check for spikes (simple detection - more than 10 interactions in last hour)
    const recentActivity = await db.execute(sql`
      SELECT COUNT(*) as count
      FROM ${capsuleActivityLog}
      WHERE capsule_id = ${capsuleId}
        AND created_at >= NOW() - INTERVAL '1 hour'
    `);

    const recentCount = parseInt(recentActivity.rows[0]?.count || "0");
    
    if (recentCount > 10) {
      // Check if we already recorded this spike today
      const existingSpike = await db
        .select()
        .from(capsuleInteractionSpikes)
        .where(
          and(
            eq(capsuleInteractionSpikes.capsuleId, capsuleId),
            gte(capsuleInteractionSpikes.spikeDate, sql`CURRENT_DATE`)
          )
        );

      if (existingSpike.length === 0) {
        await db.insert(capsuleInteractionSpikes).values({
          capsuleId,
          spikeDate: new Date(),
          cause: `High activity spike: ${recentCount} interactions in 1 hour`,
          metadata: { hourlyCount: recentCount, trigger: action },
        });
      }
    }

    res.json({ success: true, spikeDetected: recentCount > 10 });
  } catch (error) {
    console.error("Failed to log activity:", error);
    res.status(500).json({ error: "Failed to log activity" });
  }
});

export default router;