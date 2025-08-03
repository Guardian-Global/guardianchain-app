export default function handler(_, res) {
  res.status(200).json([
    { title: "Truth Capsule: Liam’s Memory", author: "Guardian001", timestamp: 1722888000000, url: "/certs/liam.pdf" },
    { title: "Capsule: Final Testimony", author: "NodeAlpha", timestamp: 1722974400000, url: "/certs/final.pdf" }
  ]);
}
