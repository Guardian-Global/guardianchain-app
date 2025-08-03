export function canUnlockWithBoost({ griefScore, chainId, unlockTimestamp }) {
  const now = Date.now();
  const baseGrace = 5 * 60 * 1000; // 5 minutes
  const griefBonus = griefScore >= 8 ? 10 * 60 * 1000 : 0; // 10 min early for griefScore 8+

  let allowedUnlock = unlockTimestamp;

  if (chainId === 8453) {
    allowedUnlock = unlockTimestamp - baseGrace - griefBonus;
  } else if (chainId === 137) {
    allowedUnlock = unlockTimestamp - griefBonus;
  }

  return now >= allowedUnlock;
}
