export default function handler(_, res) {
  const mockEvents = [
    { title: "Losing Grandpa", action: "Minted on Base", timestamp: "2 min ago" },
    { title: "Survivor Testimony", action: "Approved by Witness", timestamp: "10 min ago" },
    { title: "Dream Archive", action: "Shared publicly", timestamp: "30 min ago" }
  ];
  res.status(200).json(mockEvents);
}
