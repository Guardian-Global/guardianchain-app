import express from "express";
import { db } from "../../db";
import { sql } from "drizzle-orm";

const router = express.Router();

// POST /api/playlist/create
router.post("/create", async (req, res) => {
  try {
    const { name, userId } = req.body;

    if (!name || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Insert new playlist
    const result = await db.execute(sql`
      INSERT INTO capsule_playlists (user_id, name)
      VALUES (${userId}, ${name})
      RETURNING id, user_id, name, created_at
    `);

    const playlist = result.rows?.[0] || result[0];

    // Log user interaction
    await db.execute(sql`
      INSERT INTO user_capsule_interactions (user_id, capsule_id, action)
      VALUES (${userId}, 'playlist-created', 'create')
    `);

    res.json({ 
      success: true, 
      playlist,
      message: 'Playlist created successfully'
    });
  } catch (error) {
    console.error("Failed to create playlist:", error);
    res.status(500).json({ error: "Failed to create playlist" });
  }
});

export default router;