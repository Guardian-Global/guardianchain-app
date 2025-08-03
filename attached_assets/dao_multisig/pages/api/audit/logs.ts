export default function handler(_, res) {
  const logs = [
    { timestamp: "2025-08-01", event: "Capsule #741 Attested", validator: "NodeAlpha" },
    { timestamp: "2025-07-30", event: "Dispute Resolution #104 Resolved", validator: "TruthSentinel" },
    { timestamp: "2025-07-25", event: "Capsule #825 Attested", validator: "WitnessWolf" }
  ];
  res.status(200).json(logs);
}
