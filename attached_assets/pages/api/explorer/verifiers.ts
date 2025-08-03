export default function handler(_, res) {
  res.status(200).json([
    { name: "NodeAlpha", verified: 128, disputes: 3, active: true },
    { name: "TruthGuard", verified: 92, disputes: 1, active: true },
    { name: "WitnessWolf", verified: 63, disputes: 0, active: false }
  ]);
}
