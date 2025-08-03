export default function handler(_, res) {
  const ledger = [
    { title: "Capsule A", score: 8.5, chain: "Base", timestamp: "2025-08-02 14:20", validator: "Node-9x" },
    { title: "Capsule B", score: 9.1, chain: "Polygon", timestamp: "2025-08-01 09:18", validator: "Node-4z" }
  ];
  res.status(200).json(ledger);
}
