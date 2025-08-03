export default function handler(_, res) {
  const synced = [
    { capsuleId: "capsule-001", chains: ["Polygon", "Base"], validator: "NodeAlpha" },
    { capsuleId: "capsule-042", chains: ["Base"], validator: "TruthSentinel" }
  ];
  res.status(200).json(synced);
}
