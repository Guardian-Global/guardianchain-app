import fs from "fs";
import { parse } from "json2csv";

export function exportAuditToCSV(auditData, outputPath = "./capsule-audit.csv") {
  const fields = ["title", "griefScore", "chain", "unlocked", "timestamp"];
  const opts = { fields };
  const csv = parse(auditData, opts);
  fs.writeFileSync(outputPath, csv);
  console.log("✅ Audit CSV exported:", outputPath);
}
