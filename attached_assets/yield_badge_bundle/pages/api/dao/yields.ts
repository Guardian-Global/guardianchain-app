export default function handler(_, res) {
  res.status(200).json([
    { name: "NodeAlpha", yield: 420, capsules: 96 },
    { name: "TruthGuard", yield: 385, capsules: 84 },
    { name: "SentinelFox", yield: 290, capsules: 72 }
  ]);
}
