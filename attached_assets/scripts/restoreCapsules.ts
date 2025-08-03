import fs from "fs";

export function restoreCapsules(path = "./capsule-backup.json") {
  if (!fs.existsSync(path)) throw new Error("❌ Backup file not found.");
  const data = JSON.parse(fs.readFileSync(path, "utf-8"));
  console.log("🔁 Restored", data.length, "capsules from backup.");
  return data;
}
