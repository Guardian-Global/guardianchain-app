export default function handler(req, res) {
  const { capsuleId } = req.query;

  // Mock grief timeline events
  const events = [
    { timestamp: "T0", action: "Capsule sealed by user" },
    { timestamp: "T+1d", action: "Veritas Certificate generated" },
    { timestamp: "T+3d", action: "Capsule unlocked by self" },
    { timestamp: "T+7d", action: "Shared publicly on Base" }
  ];

  res.status(200).json(events);
}
