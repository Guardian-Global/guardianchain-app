import express from "express";
import { db } from "../../db";
import { sql } from "drizzle-orm";

const router = express.Router();

// GET /api/leaderboard/capsules
router.get("/capsules", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 25;

    // Generate sample leaderboard data for demonstration
    const leaderboard = await db.execute(sql`
      SELECT 
        cs.capsule_id as id,
        CONCAT('Capsule ', SUBSTRING(cs.capsule_id, 1, 8)) as title,
        'Guardian' as username,
        CASE 
          WHEN (cs.views + cs.shares * 2 + cs.unlocks * 3) >= 90 THEN 'platinum'
          WHEN (cs.views + cs.shares * 2 + cs.unlocks * 3) >= 70 THEN 'gold'
          WHEN (cs.views + cs.shares * 2 + cs.unlocks * 3) >= 40 THEN 'silver'
          ELSE 'bronze'
        END as tier,
        (cs.views + cs.shares * 2 + cs.unlocks * 3) as total_score
      FROM capsule_stats cs
      WHERE cs.views > 0
      ORDER BY total_score DESC
      LIMIT ${limit}
    `);

    res.json(leaderboard);
  } catch (error) {
    console.error("Failed to fetch capsule leaderboard:", error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

export default router;