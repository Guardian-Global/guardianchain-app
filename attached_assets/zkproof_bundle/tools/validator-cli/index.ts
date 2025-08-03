import { fetchIPFSMeta } from "../../lib/fetchIPFSMeta";
import { verifyZKUnlock } from "../../lib/zkVerifyUnlock";
import { exportAuditToCSV } from "./exportAuditCSV";
import { sendDiscordAlert } from "./sendDiscordAlert";
import fs from "fs";

async function main() {
  const capsules = JSON.parse(fs.readFileSync("./syncedCapsules.json", "utf-8"));
  const auditReport = [];

  for (const chain of capsules) {
    for (const cap of chain.capsules) {
      const meta = await fetchIPFSMeta(cap.cid || "QmMockCID123");
      const { valid } = await verifyZKUnlock({
        griefScore: meta?.griefScore || 0,
        chainId: chain.chain === "base" ? 8453 : 137,
        unlockTimestamp: new Date("2025-08-05T00:00:00Z").getTime()
      });

      auditReport.push({
        title: meta?.title || "Untitled",
        griefScore: meta?.griefScore || 0,
        chain: chain.chain,
        unlocked: valid,
        timestamp: new Date().toISOString()
      });

      if (valid) {
        await sendDiscordAlert({
          title: meta?.title || "Untitled",
          chain: chain.chain,
          griefScore: meta?.griefScore || 0
        });
      }
    }
  }

  exportAuditToCSV(auditReport);
}

main();
