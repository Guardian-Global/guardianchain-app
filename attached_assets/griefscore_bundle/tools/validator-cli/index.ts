import { fetchIPFSMeta } from "../../lib/fetchIPFSMeta";
import { canUnlockWithBoost } from "../../lib/unlockWithBoost";
import fs from "fs";

async function main() {
  const capsules = JSON.parse(fs.readFileSync("./syncedCapsules.json", "utf-8"));

  for (const chain of capsules) {
    console.log("🔗", chain.chain.toUpperCase());
    for (const cap of chain.capsules) {
      const meta = await fetchIPFSMeta(cap.cid || "QmMockCID123");
      const unlockable = canUnlockWithBoost({
        griefScore: meta?.griefScore || 0,
        chainId: chain.chain === "base" ? 8453 : 137,
        unlockTimestamp: new Date("2025-08-05T00:00:00Z").getTime()
      });

      console.log(`📄 ${meta?.title}: ${unlockable ? "✅ UNLOCKED" : "🔒 LOCKED"} (GriefScore ${meta?.griefScore})`);
    }
  }
}

main();
