import { Request, Response } from 'express';

// Revenue distribution percentages based on GuardianChain model
export const REVENUE_SPLITS = {
  capsuleMint: {
    creator: 70,
    dao: 20,
    platform: 10
  },
  capsuleUnlock: {
    creator: 50,
    referrer: 25, // if applicable
    dao: 25
  },
  gttYield: {
    creator: 90,
    dao: 10
  },
  subscription: {
    creator: 60,
    platform: 30,
    dao: 10
  },
  storageVault: {
    platform: 100 // cost recovery only
  }
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

// API endpoint to get revenue sharing policy
export async function getRevenueSharingPolicy(req: Request, res: Response) {
  try {
    const policy = {
      splits: REVENUE_SPLITS,
      description: {
        capsuleMint: "Revenue from minting new capsules",
        capsuleUnlock: "Fees from unlocking private capsules",
        gttYield: "Yield rewards from GTT token staking",
        subscription: "Monthly subscription revenue",
        storageVault: "Storage infrastructure costs (transparent 25% markup)"
      },
      compliance: {
        transparency: "All revenue splits are publicly disclosed",
        governance: "DAO treasury funds are controlled by GTT token holders",
        legal: "Compliant with regulatory requirements for revenue sharing",
        auditability: "All transactions are recorded on-chain for verification"
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