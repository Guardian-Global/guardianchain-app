export default function handler(_, res) {
  res.status(200).json({
    totalGTT: "920,000 GTT",
    lastDisbursement: "2025-08-01",
    pendingTxs: 2
  });
}
