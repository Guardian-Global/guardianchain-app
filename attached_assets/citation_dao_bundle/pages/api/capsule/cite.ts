export default function handler(req, res) {
  const { capsuleId, author, timestamp, griefScore } = req.body;

  const citation = \`"\${capsuleId}" by \${author}, sealed on \${new Date(timestamp).toUTCString()} (GriefScore: \${griefScore}) - GuardianChain\`;
  res.status(200).json({ citation });
}
