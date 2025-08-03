export function managePayoutQueue(requests, vaultGTT) {
  let remaining = vaultGTT;
  const queue = [];

  for (const r of requests) {
    if (remaining >= r.amount) {
      queue.push({ ...r, approved: true });
      remaining -= r.amount;
    } else {
      queue.push({ ...r, approved: false });
    }
  }

  return { queue, vaultRemaining: remaining };
}
