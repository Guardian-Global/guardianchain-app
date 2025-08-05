import express from "express";
import { db } from "../../db";
import { sql } from "drizzle-orm";

const router = express.Router();

// GET /api/capsule/reactions/:capsuleId
router.get("/reactions/:capsuleId", async (req, res) => {
  try {
    const { capsuleId } = req.params;

    const reactions = await db.execute(sql`
      SELECT emoji, COUNT(*) as count 
      FROM capsule_reactions 
      WHERE capsule_id = ${capsuleId} 
      GROUP BY emoji
    `);

    const reactionMap: Record<string, number> = {};
    reactions.forEach((row: any) => {
      reactionMap[row.emoji] = parseInt(row.count);
    });

    res.json(reactionMap);
  } catch (error) {
    console.error("Failed to fetch reactions:", error);
    res.status(500).json({ error: "Failed to fetch reactions" });
  }
});

// POST /api/capsule/react
router.post("/react", async (req, res) => {
  try {
    const { capsuleId, emoji, userId } = req.body;

    if (!capsuleId || !emoji || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const validEmojis = ['❤️', '🔥', '😂', '😢', '👏', '🤯'];
    if (!validEmojis.includes(emoji)) {
      return res.status(400).json({ error: "Invalid emoji" });
    }

    // Insert reaction
    await db.execute(sql`
      INSERT INTO capsule_reactions (capsule_id, user_id, emoji)
      VALUES (${capsuleId}, ${userId}, ${emoji})
    `);

    // Log user interaction
    await db.execute(sql`
      INSERT INTO user_capsule_interactions (user_id, capsule_id, action)
      VALUES (${userId}, ${capsuleId}, 'react')
    `);

    res.json({ success: true });
  } catch (error) {
    console.error("Failed to add reaction:", error);
    res.status(500).json({ error: "Failed to add reaction" });
  }
});

export default router;