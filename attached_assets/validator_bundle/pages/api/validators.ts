export default function handler(_, res) {
  res.status(200).json([
    { name: "TruthSentinel", capsules: 144, rep: 97, active: true },
    { name: "NodeBravo", capsules: 61, rep: 82, active: true },
    { name: "MemoriaOne", capsules: 45, rep: 74, active: false }
  ]);
}
