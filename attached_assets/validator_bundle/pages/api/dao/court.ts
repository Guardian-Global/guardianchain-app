export default function handler(_, res) {
  res.status(200).json([
    { case: "Challenge on Capsule #101", filedBy: "TruthGuard", votes: { yes: 12, no: 2 }, status: "Active" },
    { case: "Validator dispute: MemoriaOne", filedBy: "NodeBravo", votes: { yes: 9, no: 5 }, status: "Resolved" }
  ]);
}
