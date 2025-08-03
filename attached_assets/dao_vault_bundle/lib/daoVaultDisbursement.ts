export function computeVaultDisbursement({ gttTotal, participationWeight }) {
  const disbursement = gttTotal * (participationWeight / 100);
  return {
    gttAwarded: disbursement,
    vaultRemaining: gttTotal - disbursement
  };
}
