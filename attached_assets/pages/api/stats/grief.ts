export default function handler(_, res) {
  res.status(200).json({
    avgScore: 7.8,
    total: 182,
    chains: ["Base", "Polygon"],
    approved: 91
  });
}
