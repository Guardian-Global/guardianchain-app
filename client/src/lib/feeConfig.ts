// Fee configuration and utilities
export const FEE_CONFIG = {
  // Fee amounts in GTT tokens (with 18 decimals)
  MINT_FEE: "50000000000000000000", // 50 GTT
  SEAL_FEE: "100000000000000000000", // 100 GTT
  PROPOSAL_FEE: "500000000000000000000", // 500 GTT
  VERIFICATION_FEE: "25000000000000000000", // 25 GTT
} as const;

// USD equivalent estimates (for display purposes)
export const FEE_USD_ESTIMATES = {
  MINT_FEE: 2.5, // ~$2.50 USD
  SEAL_FEE: 5.0, // ~$5.00 USD
  PROPOSAL_FEE: 25.0, // ~$25.00 USD
  VERIFICATION_FEE: 1.25, // ~$1.25 USD
} as const;

// Fee justifications for UI tooltips
export const FEE_JUSTIFICATIONS = {
  mint: {
    title: "NFT Minting Fee",
    description:
      "Covers blockchain storage, IPFS metadata hosting, and platform maintenance costs",
    benefits: [
      "Permanent NFT storage",
      "IPFS metadata hosting",
      "Platform sustainability",
    ],
  },
  seal: {
    title: "Capsule Sealing Fee",
    description:
      "Funds truth verification infrastructure and rewards for accurate content verification",
    benefits: [
      "Truth verification process",
      "Verifier rewards",
      "Content quality assurance",
    ],
  },
  proposal: {
    title: "DAO Proposal Fee",
    description:
      "Prevents spam proposals and funds governance infrastructure maintenance",
    benefits: [
      "Spam prevention",
      "Governance infrastructure",
      "Democratic decision making",
    ],
  },
  verification: {
    title: "Content Verification Fee",
    description:
      "Supports the verification ecosystem and rewards accurate truth assessments",
    benefits: [
      "Verification rewards",
      "Truth accuracy",
      "Community incentives",
    ],
  },
} as const;

// Fee action types
export type FeeAction = "mint" | "seal" | "proposal" | "verification";

// Helper function to get fee amount in GTT
export function getFeeAmount(action: FeeAction): string {
  switch (action) {
    case "mint":
      return FEE_CONFIG.MINT_FEE;
    case "seal":
      return FEE_CONFIG.SEAL_FEE;
    case "proposal":
      return FEE_CONFIG.PROPOSAL_FEE;
    case "verification":
      return FEE_CONFIG.VERIFICATION_FEE;
    default:
      return "0";
  }
}

// Helper function to get USD estimate
export function getFeeUSDEstimate(action: FeeAction): number {
  switch (action) {
    case "mint":
      return FEE_USD_ESTIMATES.MINT_FEE;
    case "seal":
      return FEE_USD_ESTIMATES.SEAL_FEE;
    case "proposal":
      return FEE_USD_ESTIMATES.PROPOSAL_FEE;
    case "verification":
      return FEE_USD_ESTIMATES.VERIFICATION_FEE;
    default:
      return 0;
  }
}

// Helper function to get fee justification
export function getFeeJustification(action: FeeAction) {
  return FEE_JUSTIFICATIONS[action];
}

// Helper function to format GTT amount for display
export function formatGTTAmount(amount: string): string {
  const gttAmount = parseFloat(amount) / 1e18;
  return gttAmount.toFixed(0);
}

// Helper function to check if user has sufficient balance
export function hasSufficientBalance(
  userBalance: string,
  feeAmount: string,
): boolean {
  const balance = BigInt(userBalance);
  const fee = BigInt(feeAmount);
  return balance >= fee;
}
