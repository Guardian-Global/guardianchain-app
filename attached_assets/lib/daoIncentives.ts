export function calculateDAOIncentives({ capsulesReviewed, disputesResolved }) {
  const baseReward = 50;
  const disputeBonus = disputesResolved * 20;
  const reviewReward = capsulesReviewed * 10;

  return {
    totalRewardGTT: baseReward + disputeBonus + reviewReward,
    breakdown: {
      base: baseReward,
      disputeBonus,
      reviewReward
    }
  };
}
