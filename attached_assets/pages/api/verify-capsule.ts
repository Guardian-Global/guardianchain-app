// /api/verify-capsule.ts — Check Veritas hash against SealChain
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { hash } = req.query;
  if (!hash) return res.status(400).json({ status: "Missing hash" });

  const { data, error } = await supabase
    .from("truth_certificates")
    .select("capsule_id, created_at")
    .eq("capsule_hash", hash)
    .single();

  if (error || !data) {
    return res.status(404).json({ status: "Not found" });
  }

  res.status(200).json({
    status: "Valid",
    capsuleId: data.capsule_id,
    timestamp: data.created_at
  });
}
