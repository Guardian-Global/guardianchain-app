import { Router } from "express";
// import { isAuthenticated } from "../middleware/auth";

const router = Router();

interface AirdropEligibility {
  eligible: boolean;
  amount: number;
  claimed: boolean;
  eligibilityReason?: string;
  capsuleCount: number;
  joinDate: string;
  tier: string;
  bonusMultiplier: number;
}

// Mock airdrop database - in production this would be a real database
const airdropDatabase = new Map<string, AirdropEligibility>();

// Initialize some test data for Base airdrop
const initializeTestData = () => {
  // Test addresses with different eligibility states
  airdropDatabase.set("0x742d35cc5551d36536c87ff5f5c6de3c8f3d8a8d", {
    eligible: true,
    amount: 1000,
    claimed: false,
    capsuleCount: 5,
    joinDate: "2024-01-15",
    tier: "CREATOR",
    bonusMultiplier: 1.5, // Coinbase Wallet bonus
  });

  airdropDatabase.set("0x8ba1f109551bd432803012645hac136c770c8e84", {
    eligible: true,
    amount: 500,
    claimed: true,
    capsuleCount: 2,
    joinDate: "2024-02-01",
    tier: "SEEKER", 
    bonusMultiplier: 1.0,
  });

  airdropDatabase.set("0x123456789abcdef123456789abcdef123456789a", {
    eligible: false,
    amount: 0,
    claimed: false,
    eligibilityReason: "Account created after airdrop snapshot date",
    capsuleCount: 0,
    joinDate: "2024-12-01",
    tier: "EXPLORER",
    bonusMultiplier: 1.0,
  });
};

initializeTestData();

// Calculate airdrop eligibility based on user activity
const calculateEligibility = async (walletAddress: string): Promise<AirdropEligibility> => {
  const normalizedAddress = walletAddress.toLowerCase();
  
  // Check if we have existing data
  const existingData = airdropDatabase.get(normalizedAddress);
  if (existingData) {
    return existingData;
  }

  // For new addresses, check against criteria
  // In production, this would query the actual database
  const baseEligibility: AirdropEligibility = {
    eligible: false,
    amount: 0,
    claimed: false,
    eligibilityReason: "Address not found in airdrop snapshot",
    capsuleCount: 0,
    joinDate: new Date().toISOString().split('T')[0],
    tier: "EXPLORER",
    bonusMultiplier: 1.0,
  };

  // Simulate eligibility check for connected users
  if (normalizedAddress === "debug-user-456" || normalizedAddress.includes("debug")) {
    return {
      eligible: true,
      amount: 750,
      claimed: false,
      capsuleCount: 3,
      joinDate: "2024-01-20",
      tier: "SEEKER",
      bonusMultiplier: 1.0,
    };
  }

  return baseEligibility;
};

// GET /api/airdrop?wallet=address - Check airdrop eligibility
router.get("/", async (req, res) => {
  try {
    const walletAddress = req.query.wallet as string;
    
    if (!walletAddress) {
      return res.status(400).json({
        error: "Wallet address is required",
        eligible: false,
        amount: 0,
      });
    }

    const eligibility = await calculateEligibility(walletAddress);
    
    res.json(eligibility);
  } catch (error) {
    console.error("Airdrop eligibility check error:", error);
    res.status(500).json({
      error: "Failed to check eligibility",
      eligible: false,
      amount: 0,
    });
  }
});

// POST /api/claim - Claim airdrop tokens
router.post("/claim", async (req, res) => {
  try {
    const { wallet } = req.body;
    
    if (!wallet) {
      return res.status(400).json({
        success: false,
        error: "Wallet address is required",
      });
    }

    const normalizedAddress = wallet.toLowerCase();
    const eligibility = await calculateEligibility(normalizedAddress);
    
    if (!eligibility.eligible) {
      return res.status(400).json({
        success: false,
        error: "Not eligible for airdrop",
        reason: eligibility.eligibilityReason,
      });
    }

    if (eligibility.claimed) {
      return res.status(400).json({
        success: false,
        error: "Airdrop already claimed",
      });
    }

    // Simulate blockchain transaction
    // In production, this would interact with the actual smart contract
    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    
    // Mark as claimed in our database
    const updatedEligibility = {
      ...eligibility,
      claimed: true,
    };
    airdropDatabase.set(normalizedAddress, updatedEligibility);

    // Log the claim for monitoring
    console.log(`🎁 GTT Airdrop claimed: ${wallet} - ${eligibility.amount} GTT - TX: ${txHash}`);

    res.json({
      success: true,
      amount: eligibility.amount,
      txHash,
      message: `Successfully claimed ${eligibility.amount} GTT on Base network`,
    });
  } catch (error) {
    console.error("Airdrop claim error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process claim",
    });
  }
});

// GET /api/airdrop/stats - Get overall airdrop statistics
router.get("/stats", async (req, res) => {
  try {
    const stats = {
      totalAllocation: 250000,
      totalClaimed: Array.from(airdropDatabase.values())
        .filter(entry => entry.claimed)
        .reduce((sum, entry) => sum + entry.amount, 0),
      totalEligible: Array.from(airdropDatabase.values())
        .filter(entry => entry.eligible).length,
      claimRate: 0,
    };

    stats.claimRate = stats.totalEligible > 0 
      ? (Array.from(airdropDatabase.values()).filter(entry => entry.claimed).length / stats.totalEligible) * 100
      : 0;

    res.json(stats);
  } catch (error) {
    console.error("Airdrop stats error:", error);
    res.status(500).json({
      error: "Failed to fetch airdrop statistics",
    });
  }
});

export default router;