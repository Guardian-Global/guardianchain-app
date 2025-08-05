import express from "express";
import { db } from "../../db";
import { sql } from "drizzle-orm";

const router = express.Router();

// POST /api/capsule/remix - Create AI remix of capsule
router.post("/remix", async (req, res) => {
  try {
    const { capsuleId, style, userId } = req.body;

    if (!capsuleId || !style || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Mock AI remix generation (integrate with Replicate/Stability AI)
    const remixUrl = `https://api.guardianchain.app/remixes/${capsuleId}_${style}_${Date.now()}.png`;

    // Store remix record
    const remixResult = await db.execute(sql`
      INSERT INTO capsule_remixes (capsule_id, user_id, remix_url, remix_style)
      VALUES (${capsuleId}, ${userId}, ${remixUrl}, ${style})
      RETURNING id, capsule_id, user_id, remix_url, remix_style, created_at
    `);

    const remix = remixResult.rows?.[0] || remixResult[0];

    // Update user remix count
    await db.execute(sql`
      UPDATE users SET remix_count = COALESCE(remix_count, 0) + 1 
      WHERE id = ${userId}
    `);

    // Log interaction
    await db.execute(sql`
      INSERT INTO user_capsule_interactions (user_id, capsule_id, action)
      VALUES (${userId}, ${capsuleId}, 'remix')
    `);

    res.json({ 
      success: true,
      remix,
      message: 'Capsule remixed successfully'
    });
  } catch (error) {
    console.error("Failed to remix capsule:", error);
    res.status(500).json({ error: "Failed to remix capsule" });
  }
});

// GET /api/capsule/remix-history/:capsuleId
router.get("/remix-history/:capsuleId", async (req, res) => {
  try {
    const { capsuleId } = req.params;

    const result = await db.execute(sql`
      SELECT cr.*, u.username
      FROM capsule_remixes cr
      JOIN users u ON cr.user_id = u.id
      WHERE cr.capsule_id = ${capsuleId}
      ORDER BY cr.created_at DESC
      LIMIT 20
    `);

    res.json({ 
      success: true,
      remixes: result.rows || result
    });
  } catch (error) {
    console.error("Failed to get remix history:", error);
    res.status(500).json({ error: "Failed to get remix history" });
  }
});

export default router;