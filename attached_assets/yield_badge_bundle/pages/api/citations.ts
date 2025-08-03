export default function handler(_, res) {
  res.status(200).json([
    {
      capsuleId: "capsule-001",
      citation: "\"capsule-001\" by Guardian001, sealed on Aug 1, 2025 (GriefScore: 8) - GuardianChain"
    },
    {
      capsuleId: "capsule-024",
      citation: "\"capsule-024\" by NodeAlpha, sealed on Jul 22, 2025 (GriefScore: 9) - GuardianChain"
    }
  ]);
}
