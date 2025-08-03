export default function handler(req: any, res: any) {
  const mockRankings = [
    { name: "TruthSeeker", score: 9847, badges: 12, followers: 234 },
    { name: "VerityGuard", score: 8756, badges: 9, followers: 189 },
    { name: "ChainWarden", score: 7623, badges: 8, followers: 156 },
    { name: "DataKeeper", score: 6891, badges: 7, followers: 134 },
    { name: "CryptoSage", score: 5947, badges: 6, followers: 98 },
  ];
  
  res.json(mockRankings);
}