import fs from "fs";
import { calculateValidatorRewards } from "../../lib/validatorRewards";

function run() {
  const events = JSON.parse(fs.readFileSync("./verified-events.json", "utf-8"));
  const rewards = calculateValidatorRewards(events);
  console.log("🏅 Validator Rewards (GTT):");
  for (const r of rewards) {
    console.log(`🔹 ${r.validator}: ${r.rewardGTT} GTT`);
  }
}

run();
