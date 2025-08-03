export default function handler(_, res) {
  res.status(200).json([
    { id: "d1", issue: "Challenge on Capsule #741", votes: { yes: 2, no: 1 } },
    { id: "d2", issue: "Validator misconduct claim #104", votes: { yes: 3, no: 0 } }
  ]);
}
