import { NextApiRequest, NextApiResponse } from "next";
import { Parser } from "json2csv";

// Example mock capsule data
const capsules = [
  { id: "123", name: "Loss of Father", grief_score: 8.5, chain: "Base", owner: "0x123", timestamp: "2025-08-01" },
  { id: "124", name: "Trauma Memory", grief_score: 7.9, chain: "Polygon", owner: "0x456", timestamp: "2025-07-28" },
];

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  const parser = new Parser();
  const csv = parser.parse(capsules);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=capsules_export.csv");
  res.status(200).send(csv);
}
