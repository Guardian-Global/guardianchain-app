export default function handler(req: any, res: any) {
  const mockYields = [
    { name: "Guardian Alpha", yield: 1247, capsules: 89, rank: 1, change: 12.5 },
    { name: "Truth Keeper", yield: 987, capsules: 67, rank: 2, change: 8.3 },
    { name: "Validator Prime", yield: 756, capsules: 54, rank: 3, change: -2.1 },
    { name: "Chain Sentinel", yield: 623, capsules: 43, rank: 4, change: 15.7 },
  ];
  
  res.json(mockYields);
}