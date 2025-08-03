import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

// Mock Supabase table for example
const capsuleOwners: Record<string, string> = {
  "capsule-123": "0x123...abc",
  "capsule-456": "0x456...def"
};

export default function withCapsuleAuth(handler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });
    const { capsuleId } = req.query;
    const userAddress = session?.user?.wallet;

    if (!userAddress || capsuleOwners[capsuleId] !== userAddress) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    return handler(req, res);
  };
}
