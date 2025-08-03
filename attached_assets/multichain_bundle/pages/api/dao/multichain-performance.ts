export default function handler(_, res) {
  res.status(200).json([
    { name: "NodeAlpha", chain: "Polygon", capsules: 100, reputation: 92 },
    { name: "NodeAlpha", chain: "Base", capsules: 80, reputation: 94 },
    { name: "TruthSentinel", chain: "Polygon", capsules: 76, reputation: 89 },
    { name: "TruthSentinel", chain: "Base", capsules: 69, reputation: 90 }
  ]);
}
