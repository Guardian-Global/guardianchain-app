import fs from "fs";

export function backupCapsules(capsules, path = "./capsule-backup.json") {
  fs.writeFileSync(path, JSON.stringify(capsules, null, 2));
  console.log("✅ Capsule backup saved to", path);
}
