import { verifyRedemptionSig } from "../../../lib/verifyRedemptionSig";

export default async function handler(req, res) {
  const { capsuleId, wallet, signature } = req.body;
  const message = \`Redeem capsule \${capsuleId} to \${wallet}\`;

  const valid = await verifyRedemptionSig({ message, signature, expectedAddress: wallet });
  res.status(200).json({ valid });
}
