import { Request, Response } from 'express';

// Enhanced Revenue distribution percentages with full compliance framework
export const REVENUE_SPLITS = {
  capsuleMint: {
    creator: 70,
    dao: 20,
    platform: 10,
    description: "Revenue split for new capsule creation and NFT minting",
    compliance: "Requires active capsule creation - not passive income"
  },
  capsuleUnlock: {
    creator: 50,
    referrer: 25, // if applicable
    dao: 25,
    description: "Revenue split when users unlock premium capsules",
    compliance: "Earnings tied to content engagement and referral activity"
  },
  gttYield: {
    creator: 90,
    dao: 10,
    description: "GTT yield rewards from verified authorship and time-lock",
    compliance: "Requires verified authorship and active participation"
  },
  gatedContent: {
    creator: 60,
    platform: 30,
    dao: 10,
    description: "Subscription and gated content revenue distribution",
    compliance: "Creator must maintain active content publishing"
  },
  storageVault: {
    platform: 100, // transparent cost-recovery + 25% markup
    description: "Vault hosting fees for premium storage tiers",
    compliance: "Transparent cost-recovery plus 25% markup - platform operations"
  }
};

// DAO Treasury allocation flows
export const DAO_TREASURY_FLOWS = {
  grantPrograms: 30,
  validatorIncentives: 25,
  complianceAuditFund: 20,
  emergencyLegalReserve: 15,
  communityDevelopment: 10,
  description: "How DAO treasury funds are allocated across key initiatives"
};

// GTT Token utility functions
export const GTT_USE_CASES = [
  "Capsule mint fee and unlock gate payments",
  "Yield staking with capsule dividend sharing", 
  "DAO governance participation and voting rights",
  "Truth validation and capsule scoring incentives",
  "Access to Sovereign AI, time-release, and remix tools"
];

// Legal compliance framework
export const COMPLIANCE_FRAMEWORK = {
  gttTokenStatus: "GTT is not a passive security - rewards require active capsule creation, staking, or sharing",
  revenueDisclosure: "Full revenue disclosures published at guardianchain.app/revenue-sharing-policy",
  kycAmlTiers: "Implemented for fiat off-ramp compliance with tiered verification",
  legalSeparation: "Platform operations legally separated from DAO governance decisions", 
  creatorAgreement: "All creators agree to Terms of Revenue Sharing during onboarding",
  nonCustodial: "Non-custodial ownership with permanent NFT minting rights",
  publicTreasury: "Public DAO Treasury with transparent fund allocation",
  contact: "compliance@guardianchain.app for partnership, audit, or grant requests"
};

// Helper function to calculate revenue splits
export function calculateRevenueSplit(
  amount: number, 
  splitType: keyof typeof REVENUE_SPLITS,
  hasReferrer: boolean = false
) {
  const splits = REVENUE_SPLITS[splitType];
  const result: Record<string, number> = {};
  
  if (splitType === 'capsuleUnlock' && !hasReferrer) {
    // If no referrer, DAO gets the referrer portion too
    const unlockSplits = splits as typeof REVENUE_SPLITS.capsuleUnlock;
    result.creator = (amount * unlockSplits.creator) / 100;
    result.dao = (amount * (unlockSplits.dao + unlockSplits.referrer)) / 100;
  } else {
    // Standard split calculation
    Object.entries(splits).forEach(([role, percentage]) => {
      result[role] = (amount * percentage) / 100;
    });
  }
  
  return result;
}

// API endpoint to get comprehensive revenue sharing policy
export async function getRevenueSharingPolicy(req: Request, res: Response) {
  try {
    const policy = {
      splits: REVENUE_SPLITS,
      daoTreasuryFlows: DAO_TREASURY_FLOWS,
      gttUseCases: GTT_USE_CASES,
      compliance: COMPLIANCE_FRAMEWORK,
      revenueModel: {
        capsuleMinting: "70% Creator / 20% DAO / 10% Platform",
        capsuleUnlock: "50% Creator / 25% Referrer / 25% DAO",
        gttYieldRewards: "90% Creator / 10% DAO Reserve", 
        gatedContent: "60% Creator / 30% Platform / 10% DAO",
        vaultHostingFees: "100% Platform (cost recovery + 25% markup)"
      },
      treasuryFlow: "Revenue Event → DAO Treasury → Grant Programs, Validator Incentives, Compliance/Audit Fund, Emergency Legal Reserve",
      legalDisclosures: {
        noPassiveSecurity: "GTT rewards require active participation in capsule creation, staking, or sharing",
        fullTransparency: "Complete revenue disclosures available at guardianchain.app/revenue-sharing-policy",
        regulatoryCompliance: "KYC/AML tiers implemented for fiat off-ramp compliance",
        legalSeparation: "Platform operations legally separated from DAO governance decisions",
        mandatoryAgreement: "All creators must agree to Terms of Revenue Sharing during onboarding"
      },
      supportContact: {
        compliance: "compliance@guardianchain.app",
        website: "www.guardianchain.app",
        services: "Partnership, audit, and grant request support available"
      },
      lastUpdated: "2025-08-03T00:00:00Z"
    };
    
    res.json(policy);
  } catch (error) {
    console.error('Error fetching revenue sharing policy:', error);
    res.status(500).json({ error: 'Failed to fetch policy' });
  }
}

// API endpoint to calculate potential earnings
export async function calculatePotentialEarnings(req: Request, res: Response) {
  try {
    const { amount, splitType, hasReferrer = false } = req.body;
    
    if (!amount || !splitType) {
      return res.status(400).json({ error: 'Amount and splitType are required' });
    }
    
    if (!(splitType in REVENUE_SPLITS)) {
      return res.status(400).json({ error: 'Invalid splitType' });
    }
    
    const splits = calculateRevenueSplit(amount, splitType, hasReferrer);
    
    res.json({
      originalAmount: amount,
      splitType,
      hasReferrer,
      distribution: splits,
      creatorEarnings: splits.creator || 0,
      platformFee: splits.platform || 0,
      daoContribution: splits.dao || 0,
      referrerReward: splits.referrer || 0
    });
  } catch (error) {
    console.error('Error calculating earnings:', error);
    res.status(500).json({ error: 'Failed to calculate earnings' });
  }
}

// Middleware to log revenue distributions for transparency
export function logRevenueDistribution(
  amount: number, 
  splitType: keyof typeof REVENUE_SPLITS, 
  userId: string,
  additionalData: any = {}
) {
  const splits = calculateRevenueSplit(amount, splitType, additionalData.hasReferrer);
  
  console.log('💰 Revenue Distribution:', {
    timestamp: new Date().toISOString(),
    userId,
    amount,
    splitType,
    distribution: splits,
    additionalData
  });
  
  // In production, this would also log to a proper audit system
  return splits;
}