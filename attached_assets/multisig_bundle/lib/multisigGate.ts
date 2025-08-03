export function isApprovedByMultisig(signers, threshold = 2) {
  const unique = new Set(signers);
  return unique.size >= threshold;
}
