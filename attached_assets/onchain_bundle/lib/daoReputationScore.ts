export function calculateReputation({ votesCast, capsulesReviewed, disputesResolved }) {
  const voteWeight = 2;
  const reviewWeight = 3;
  const disputeWeight = 5;

  const score = (votesCast * voteWeight) + 
                (capsulesReviewed * reviewWeight) + 
                (disputesResolved * disputeWeight);

  return {
    totalScore: score,
    breakdown: {
      votes: votesCast * voteWeight,
      reviews: capsulesReviewed * reviewWeight,
      disputes: disputesResolved * disputeWeight
    }
  };
}
