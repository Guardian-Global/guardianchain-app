export default function handler(_, res) {
  const genome = {
    capsuleId: "capsule-abc123",
    emotionHash: "0xf98a...de4c",
    authorHash: "0x9d4f...a320",
    lineageHash: "0xa94b...c7ef",
    combinedHash: "0x1fc4...f3ae",
    createdAt: "2025-08-02T10:00:00Z"
  };
  res.status(200).json(genome);
}
