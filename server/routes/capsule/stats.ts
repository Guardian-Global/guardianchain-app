import express from "express";
import { db } from "../../db";
import { capsuleStats } from "../../../shared/schema";
import { eq } from "drizzle-orm";

const router = express.Router();

// GET /api/capsule/stats/:capsuleId
router.get("/stats/:capsuleId", async (req, res) => {
  try {
    const { capsuleId } = req.params;

    if (!capsuleId) {
      return res.status(400).json({ error: "Capsule ID is required" });
    }

    // Try to get existing stats from database
    const [existingStats] = await db
      .select()
      .from(capsuleStats)
      .where(eq(capsuleStats.capsuleId, capsuleId))
      .limit(1);

    if (existingStats) {
      res.json({
        views: existingStats.views || 0,
        shares: existingStats.shares || 0,
        unlocks: existingStats.unlocks || 0,
        last_viewed_at: existingStats.lastViewedAt,
      });
    } else {
      // Create initial stats record if it doesn't exist
      const [newStats] = await db
        .insert(capsuleStats)
        .values({
          capsuleId,
          views: 0,
          shares: 0,
          unlocks: 0,
          lastViewedAt: new Date(),
        })
        .returning();

      res.json({
        views: newStats.views || 0,
        shares: newStats.shares || 0,
        unlocks: newStats.unlocks || 0,
        last_viewed_at: newStats.lastViewedAt,
      });
    }
  } catch (error) {
    console.error("Capsule stats error:", error);
    res.status(500).json({ error: "Failed to fetch capsule stats." });
  }
});

// POST /api/capsule/stats/:capsuleId/increment
router.post("/stats/:capsuleId/increment", async (req, res) => {
  try {
    const { capsuleId } = req.params;
    const { type } = req.body; // 'views', 'shares', or 'unlocks'

    if (!capsuleId || !type) {
      return res.status(400).json({ error: "Capsule ID and type are required" });
    }

    if (!['views', 'shares', 'unlocks'].includes(type)) {
      return res.status(400).json({ error: "Invalid increment type" });
    }

    // Check if stats record exists
    const [existingStats] = await db
      .select()
      .from(capsuleStats)
      .where(eq(capsuleStats.capsuleId, capsuleId))
      .limit(1);

    if (existingStats) {
      // Update existing record
      const updateData: any = { lastViewedAt: new Date() };
      
      if (type === 'views') {
        updateData.views = (existingStats.views || 0) + 1;
      } else if (type === 'shares') {
        updateData.shares = (existingStats.shares || 0) + 1;
      } else if (type === 'unlocks') {
        updateData.unlocks = (existingStats.unlocks || 0) + 1;
      }

      const [updatedStats] = await db
        .update(capsuleStats)
        .set(updateData)
        .where(eq(capsuleStats.capsuleId, capsuleId))
        .returning();

      res.json({
        views: updatedStats.views || 0,
        shares: updatedStats.shares || 0,
        unlocks: updatedStats.unlocks || 0,
        last_viewed_at: updatedStats.lastViewedAt,
      });
    } else {
      // Create new record with initial increment
      const initialData: any = {
        capsuleId,
        views: 0,
        shares: 0,
        unlocks: 0,
        lastViewedAt: new Date(),
      };

      if (type === 'views') initialData.views = 1;
      else if (type === 'shares') initialData.shares = 1;
      else if (type === 'unlocks') initialData.unlocks = 1;

      const [newStats] = await db
        .insert(capsuleStats)
        .values(initialData)
        .returning();

      res.json({
        views: newStats.views || 0,
        shares: newStats.shares || 0,
        unlocks: newStats.unlocks || 0,
        last_viewed_at: newStats.lastViewedAt,
      });
    }
  } catch (error) {
    console.error("Capsule stats increment error:", error);
    res.status(500).json({ error: "Failed to increment capsule stats." });
  }
});

export default router;