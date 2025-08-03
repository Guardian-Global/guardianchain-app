export default function handler(req, res) {
  const { wallet } = req.query;
  const mockCapsules = [
    {
      title: "Letter to My Daughter",
      griefScore: 9.1,
      unlockDate: "2026-01-01",
      isUnlocked: false
    },
    {
      title: "Dad's Final Message",
      griefScore: 8.8,
      unlockDate: "2025-07-01",
      isUnlocked: true
    }
  ];
  res.status(200).json(mockCapsules);
}
