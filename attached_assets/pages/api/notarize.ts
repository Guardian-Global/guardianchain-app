import crypto from "crypto";

export default function handler(req, res) {
  const { content } = req.body;
  const hash = crypto.createHash("sha256").update(content).digest("hex");
  const timestamp = new Date().toISOString();
  const notarizationRecord = {
    contentHash: `0x${hash}`,
    timestamp,
    admissible: true,
    chainProofLink: `https://polygonscan.com/tx/mockproof${hash.slice(0, 6)}`
  };
  res.status(200).json(notarizationRecord);
}
