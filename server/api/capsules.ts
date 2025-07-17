// /server/api/capsules.ts

import express from "express";
import { createClient } from "@supabase/supabase-js";
const router = express.Router();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/capsules
router.post("/", async (req, res) => {
  const { creator, title, content, griefScore, status, gttEarned, visibility } = req.body;

  const { data, error } = await supabase
    .from("capsules")
    .insert([{ creator, title, content, griefScore, status, gttEarned, visibility }]);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
});

export default router;