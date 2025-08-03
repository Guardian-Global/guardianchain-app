export function redeemCapsule(capsule, recipientWallet, unlockConditions) {
  const { griefScore, unlockTimestamp, redeemed } = capsule;
  const now = Date.now();

  if (redeemed) return { success: false, reason: "Already redeemed" };
  if (now < unlockTimestamp) return { success: false, reason: "Not yet unlockable" };
  if (griefScore < unlockConditions.minGriefScore) return { success: false, reason: "GriefScore too low" };

  return {
    success: true,
    capsuleId: capsule.id,
    to: recipientWallet,
    redeemedAt: new Date().toISOString()
  };
}
