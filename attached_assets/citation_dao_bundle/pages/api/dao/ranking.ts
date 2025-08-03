export default function handler(_, res) {
  res.status(200).json([
    { name: "NodeAlpha", score: 174 },
    { name: "TruthSentinel", score: 158 },
    { name: "WitnessWolf", score: 123 }
  ]);
}
