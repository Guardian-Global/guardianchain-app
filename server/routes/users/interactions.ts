import express from "express";
import { db } from "../../db";
import { sql } from "drizzle-orm";

const router = express.Router();

// GET /api/users/:userId/interactions
router.get("/:userId/interactions", async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;

    const interactions = await db.execute(sql`
      SELECT id, user_id, capsule_id, action, created_at
      FROM user_capsule_interactions
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `);

    res.json({ data: interactions });
  } catch (error) {
    console.error("Failed to fetch user interactions:", error);
    res.status(500).json({ error: "Failed to fetch interactions" });
  }
});

export default router;