export function calculateValidatorRewards(events, rewardRate = 2.5) {
  const summary = {};

  for (const ev of events) {
    const key = ev.validator || "unknown";
    if (!summary[key]) summary[key] = 0;
    summary[key] += rewardRate;
  }

  return Object.entries(summary).map(([validator, total]) => ({
    validator,
    rewardGTT: total
  }));
}
