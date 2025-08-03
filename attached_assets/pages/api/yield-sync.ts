import type { NextApiRequest, NextApiResponse } from "next";

// Mock grief capsule NFT data — replace with ethers.js read logic
const capsules = [
  { tokenId: 1, wallet: "0x123...abc", grief: 8, chain: "Base" },
  { tokenId: 2, wallet: "0x456...def", grief: 7, chain: "Polygon" },
  { tokenId: 3, wallet: "0x123...abc", grief: 9, chain: "Base" }
];

// Aggregate griefScore per user
export default function handler(_: NextApiRequest, res: NextApiResponse) {
  const yieldMap: Record<string, any> = {};

  capsules.forEach(({ wallet, grief, chain }) => {
    if (!yieldMap[wallet]) yieldMap[wallet] = { capsules: 0, griefTotal: 0, chain };
    yieldMap[wallet].capsules++;
    yieldMap[wallet].griefTotal += grief;
  });

  const output = Object.entries(yieldMap).map(([wallet, { capsules, griefTotal, chain }]) => ({
    wallet,
    capsules,
    avgGrief: (griefTotal / capsules).toFixed(1),
    gttYield: Math.floor(griefTotal * 10), // Example: 10 GTT per grief point
    chain
  }));

  res.status(200).json(output);
}
