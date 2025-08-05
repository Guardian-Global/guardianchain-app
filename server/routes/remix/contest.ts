import express from "express";
import { db } from "../../db";
import { sql } from "drizzle-orm";

const router = express.Router();

// POST /api/remix/contest/submit - Submit remix to contest
router.post("/submit", async (req, res) => {
  try {
    const { remixId, contestId, userId } = req.body;

    if (!remixId || !contestId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if contest is active
    const contestResult = await db.execute(sql`
      SELECT * FROM remix_contests 
      WHERE id = ${contestId} AND is_active = true 
      AND NOW() BETWEEN start_time AND end_time
    `);

    if (!contestResult.rows || contestResult.rows.length === 0) {
      return res.status(404).json({ error: "Contest not found or inactive" });
    }

    // Submit entry
    await db.execute(sql`
      INSERT INTO remix_contest_entries (remix_id, contest_id)
      VALUES (${remixId}, ${contestId})
      ON CONFLICT (remix_id, contest_id) DO NOTHING
    `);

    res.json({ 
      success: true,
      message: 'Remix submitted to contest successfully'
    });
  } catch (error) {
    console.error("Failed to submit remix to contest:", error);
    res.status(500).json({ error: "Failed to submit remix to contest" });
  }
});

// POST /api/remix/contest/vote - Vote for remix
router.post("/vote", async (req, res) => {
  try {
    const { remixId, userId } = req.body;

    if (!remixId || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user already voted for this remix
    const existingVote = await db.execute(sql`
      SELECT id FROM remix_votes 
      WHERE remix_id = ${remixId} AND user_id = ${userId}
    `);

    if (existingVote.rows && existingVote.rows.length > 0) {
      return res.status(400).json({ error: "Already voted for this remix" });
    }

    // Add vote
    await db.execute(sql`
      INSERT INTO remix_votes (remix_id, user_id)
      VALUES (${remixId}, ${userId})
    `);

    // Update vote count
    await db.execute(sql`
      UPDATE remix_contest_entries 
      SET votes = votes + 1 
      WHERE remix_id = ${remixId}
    `);

    res.json({ 
      success: true,
      message: 'Vote cast successfully'
    });
  } catch (error) {
    console.error("Failed to vote:", error);
    res.status(500).json({ error: "Failed to vote" });
  }
});

// GET /api/remix/contest/leaderboard/:contestId
router.get("/leaderboard/:contestId", async (req, res) => {
  try {
    const { contestId } = req.params;

    const result = await db.execute(sql`
      SELECT 
        rce.remix_id,
        rce.votes,
        cr.remix_url,
        cr.remix_style,
        u.username,
        u.id as user_id
      FROM remix_contest_entries rce
      JOIN capsule_remixes cr ON rce.remix_id = cr.id
      JOIN users u ON cr.user_id = u.id
      WHERE rce.contest_id = ${contestId}
      ORDER BY rce.votes DESC, rce.created_at ASC
      LIMIT 20
    `);

    res.json({ 
      success: true,
      entries: result.rows || result
    });
  } catch (error) {
    console.error("Failed to get contest leaderboard:", error);
    res.status(500).json({ error: "Failed to get contest leaderboard" });
  }
});

// GET /api/remix/contest/active - Get active contest
router.get("/active", async (req, res) => {
  try {
    const result = await db.execute(sql`
      SELECT * FROM remix_contests 
      WHERE is_active = true AND NOW() BETWEEN start_time AND end_time
      ORDER BY created_at DESC
      LIMIT 1
    `);

    const contest = result.rows?.[0] || result[0] || null;

    res.json({ 
      success: true,
      contest
    });
  } catch (error) {
    console.error("Failed to get active contest:", error);
    res.status(500).json({ error: "Failed to get active contest" });
  }
});

export default router;