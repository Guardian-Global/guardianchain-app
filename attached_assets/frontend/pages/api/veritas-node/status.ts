export default function handler(req, res) {
  res.status(200).json({
    nodeId: "0xValidatorA",
    proofs: 120,
    stake: 1500,
    uptime: 98,
    slashingRisk: false
  });
}
