import { redeemCapsule } from "../../lib/redeemCapsule";

export default function handler(req, res) {
  const { capsuleId, wallet } = req.body;

  const mockCapsule = {
    id: capsuleId,
    griefScore: 9,
    unlockTimestamp: Date.now() - 60000,
    redeemed: false
  };

  const unlockConditions = { minGriefScore: 7 };
  const result = redeemCapsule(mockCapsule, wallet, unlockConditions);
  res.status(200).json(result);
}
