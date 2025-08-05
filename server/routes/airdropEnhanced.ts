import { Router } from "express";
import { ethers } from "ethers";
import { consolidatedAuth } from "../auth/authConsolidation";

const router = Router();

// Enhanced airdrop snapshot with realistic wallet addresses
const ENHANCED_AIRDROP_SNAPSHOT: Record<string, number> = {
  // Mock realistic addresses for testing
  "0x742d35Cc6634C0532925a3b8c17d7ce8A4e16B8E": 2500,
  "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045": 1750,
  "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5": 3250,
  "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC": 1250,
  "0x90F79bf6EB2c4f870365E785982E1f101E93b906": 4100,
  "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65": 875,
  "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc": 3750,
  "0x976EA74026E726554dB657fA54763abd0C3a0aa9": 1650,
  "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955": 2200,
  "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f": 1450,
  // Add default test addresses for development
  "0x123456789abcdef123456789abcdef123456789a": 250,
  "0x456def789abc123456789def123456789def123a": 500,
  "0x789abc123456def789abc123456def789abc123a": 750,
};

// Track claimed wallets (in production, use database)
const claimedWallets = new Set<string>();

// Eligibility criteria configuration
const ELIGIBILITY_CONFIG = {
  minTransactions: 5,
  minGTTHolding: 100,
  communityMember: true,
  earlySupporter: true,
  snapshotDate: "2025-01-01T00:00:00Z",
};

/**
 * Check GTT claimable amount for a wallet
 */
router.get("/airdrop/check/:wallet", consolidatedAuth, async (req: any, res) => {
  try {
    const { wallet } = req.params;
    
    console.log("💰 Airdrop eligibility check for:", wallet);

    // Validate wallet address
    if (!wallet || !ethers.isAddress(wallet)) {
      return res.status(400).json({ 
        error: "Invalid wallet address format" 
      });
    }

    const normalizedWallet = wallet.toLowerCase();
    const baseAmount = ENHANCED_AIRDROP_SNAPSHOT[normalizedWallet] || 0;
    
    // Check if already claimed
    const alreadyClaimed = claimedWallets.has(normalizedWallet);
    
    // Calculate bonus multipliers
    let bonusMultiplier = 1.0;
    const bonuses = [];

    // Coinbase Wallet bonus (1.5x for Base network)
    if (req.query.coinbaseWallet === "true") {
      bonusMultiplier *= 1.5;
      bonuses.push({ type: "Coinbase Wallet", multiplier: 1.5 });
    }

    // Early supporter bonus
    if (baseAmount > 2000) {
      bonusMultiplier *= 1.2;
      bonuses.push({ type: "Early Supporter", multiplier: 1.2 });
    }

    // Community member bonus
    if (baseAmount > 0) {
      bonusMultiplier *= 1.1;
      bonuses.push({ type: "Community Member", multiplier: 1.1 });
    }

    const finalAmount = Math.floor(baseAmount * bonusMultiplier);

    // Enhanced eligibility check
    const eligibility = {
      isEligible: baseAmount > 0,
      baseAmount,
      finalAmount,
      bonusMultiplier,
      bonuses,
      alreadyClaimed,
      canClaim: baseAmount > 0 && !alreadyClaimed,
      snapshotIncluded: baseAmount > 0,
      requirements: {
        minTransactions: baseAmount > 0, // Mock: assume eligible wallets meet requirements
        minGTTHolding: baseAmount > 0,
        communityMember: baseAmount > 0,
        earlySupporter: baseAmount > 1000,
      },
      network: req.query.network || "base",
      estimatedGasFee: "~$0.01 USD", // Base network advantage
    };

    console.log("💰 Airdrop eligibility:", eligibility);

    res.json(eligibility);

  } catch (error) {
    console.error("❌ Airdrop check error:", error);
    res.status(500).json({ 
      error: "Failed to check airdrop eligibility" 
    });
  }
});

/**
 * Claim GTT airdrop tokens
 */
router.post("/airdrop/claim", consolidatedAuth, async (req: any, res) => {
  try {
    const { walletAddress, signature, network } = req.body;
    const userId = req.user.id;
    
    console.log("🎯 Airdrop claim request:", { walletAddress, userId, network });

    // Validate input
    if (!walletAddress || !ethers.isAddress(walletAddress)) {
      return res.status(400).json({ 
        error: "Invalid wallet address" 
      });
    }

    if (!signature) {
      return res.status(400).json({ 
        error: "Signature required for claim verification" 
      });
    }

    const normalizedWallet = walletAddress.toLowerCase();
    const eligibleAmount = ENHANCED_AIRDROP_SNAPSHOT[normalizedWallet] || 0;

    // Check eligibility
    if (eligibleAmount === 0) {
      return res.status(403).json({ 
        error: "Wallet not eligible for airdrop",
        code: "NOT_ELIGIBLE"
      });
    }

    // Check if already claimed
    if (claimedWallets.has(normalizedWallet)) {
      return res.status(409).json({ 
        error: "Airdrop already claimed for this wallet",
        code: "ALREADY_CLAIMED"
      });
    }

    // In production, verify signature and execute blockchain transaction
    // For now, simulate successful claim
    
    // Calculate final amount with bonuses
    let bonusMultiplier = 1.0;
    if (network === "base") {
      bonusMultiplier = 1.5; // Base network bonus
    }

    const finalAmount = Math.floor(eligibleAmount * bonusMultiplier);

    // Mark as claimed
    claimedWallets.add(normalizedWallet);

    // Mock transaction hash for demonstration
    const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;

    const claimResult = {
      success: true,
      transactionHash: mockTxHash,
      walletAddress: normalizedWallet,
      userId,
      baseAmount: eligibleAmount,
      bonusMultiplier,
      finalAmount,
      network: network || "base",
      claimedAt: new Date().toISOString(),
      explorerUrl: `https://basescan.org/tx/${mockTxHash}`,
      gasUsed: "21000",
      gasFee: "0.000015 ETH (~$0.01 USD)",
    };

    console.log("✅ Airdrop claimed successfully:", claimResult);

    res.json(claimResult);

  } catch (error) {
    console.error("❌ Airdrop claim error:", error);
    res.status(500).json({ 
      error: "Failed to process airdrop claim" 
    });
  }
});

/**
 * Get airdrop statistics and leaderboard
 */
router.get("/airdrop/stats", consolidatedAuth, async (req: any, res) => {
  try {
    console.log("📊 Airdrop statistics requested");

    const totalAllocated = Object.values(ENHANCED_AIRDROP_SNAPSHOT).reduce((sum, amount) => sum + amount, 0);
    const totalClaimed = Array.from(claimedWallets).reduce((sum, wallet) => {
      return sum + (ENHANCED_AIRDROP_SNAPSHOT[wallet] || 0);
    }, 0);

    const stats = {
      totalAllocated,
      totalClaimed,
      totalUnclaimed: totalAllocated - totalClaimed,
      claimPercentage: totalAllocated > 0 ? (totalClaimed / totalAllocated) * 100 : 0,
      eligibleWallets: Object.keys(ENHANCED_AIRDROP_SNAPSHOT).length,
      claimedWallets: claimedWallets.size,
      unclaimedWallets: Object.keys(ENHANCED_AIRDROP_SNAPSHOT).length - claimedWallets.size,
      
      // Network distribution
      networkStats: {
        base: {
          allocation: totalAllocated * 0.7,
          bonus: "1.5x Coinbase Wallet bonus",
          gasEfficiency: "~$0.01 per transaction",
        },
        polygon: {
          allocation: totalAllocated * 0.3,
          bonus: "Community early adopters",
          gasEfficiency: "~$0.05 per transaction",
        },
      },

      // Top claimants (mock data for privacy)
      leaderboard: [
        { rank: 1, amount: 4100, wallet: "0x90F7...b906", claimed: false },
        { rank: 2, amount: 3750, wallet: "0x9965...A4dc", claimed: false },
        { rank: 3, amount: 3250, wallet: "0x9522...afe5", claimed: false },
        { rank: 4, amount: 2500, wallet: "0x742d...6B8E", claimed: false },
        { rank: 5, amount: 2200, wallet: "0x14dC...9955", claimed: false },
      ],

      snapshotInfo: {
        date: ELIGIBILITY_CONFIG.snapshotDate,
        criteria: ELIGIBILITY_CONFIG,
        totalSnapshots: 1,
        blockHeight: "19180000", // Mock block height
      },

      claimWindow: {
        startDate: "2025-01-15T00:00:00Z",
        endDate: "2025-04-15T23:59:59Z",
        daysRemaining: 102,
        isActive: true,
      }
    };

    console.log("📊 Airdrop stats:", { totalAllocated, totalClaimed, claimedWallets: claimedWallets.size });

    res.json(stats);

  } catch (error) {
    console.error("❌ Airdrop stats error:", error);
    res.status(500).json({ 
      error: "Failed to fetch airdrop statistics" 
    });
  }
});

/**
 * Verify airdrop claim signature
 */
router.post("/airdrop/verify", consolidatedAuth, async (req: any, res) => {
  try {
    const { walletAddress, message, signature } = req.body;
    
    console.log("🔐 Airdrop signature verification:", { walletAddress });

    // Validate input
    if (!walletAddress || !message || !signature) {
      return res.status(400).json({ 
        error: "Missing required fields: walletAddress, message, signature" 
      });
    }

    if (!ethers.isAddress(walletAddress)) {
      return res.status(400).json({ 
        error: "Invalid wallet address format" 
      });
    }

    try {
      // Verify signature
      const recoveredAddress = ethers.verifyMessage(message, signature);
      const isValid = recoveredAddress.toLowerCase() === walletAddress.toLowerCase();

      const verificationResult = {
        isValid,
        walletAddress: walletAddress.toLowerCase(),
        recoveredAddress: recoveredAddress.toLowerCase(),
        message,
        timestamp: new Date().toISOString(),
      };

      console.log("🔐 Signature verification result:", verificationResult);

      res.json(verificationResult);

    } catch (signatureError) {
      console.error("❌ Signature verification failed:", signatureError);
      res.status(401).json({ 
        error: "Invalid signature",
        isValid: false 
      });
    }

  } catch (error) {
    console.error("❌ Airdrop verification error:", error);
    res.status(500).json({ 
      error: "Failed to verify signature" 
    });
  }
});

/**
 * Get user's airdrop history
 */
router.get("/airdrop/history", consolidatedAuth, async (req: any, res) => {
  try {
    const userId = req.user.id;
    
    console.log("📜 Airdrop history requested for user:", userId);

    // Mock user airdrop history - in production, query database
    const history = [
      {
        id: "airdrop_1",
        type: "GTT_GENESIS",
        amount: 2500,
        walletAddress: "0x742d35Cc6634C0532925a3b8c17d7ce8A4e16B8E",
        status: "pending",
        claimedAt: null,
        network: "base",
        transactionHash: null,
        eligibility: {
          earlySupporter: true,
          communityMember: true,
          minTransactions: true,
        }
      },
      {
        id: "airdrop_2",
        type: "COMMUNITY_REWARD",
        amount: 750,
        walletAddress: "0x742d35Cc6634C0532925a3b8c17d7ce8A4e16B8E",
        status: "claimed",
        claimedAt: "2025-01-20T15:30:00Z",
        network: "polygon",
        transactionHash: "0xabcd1234567890abcd1234567890abcd1234567890abcd1234567890abcd1234",
        eligibility: {
          earlySupporter: false,
          communityMember: true,
          minTransactions: true,
        }
      }
    ];

    res.json({
      userId,
      history,
      totalEarned: history.reduce((sum, item) => 
        item.status === "claimed" ? sum + item.amount : sum, 0
      ),
      totalPending: history.reduce((sum, item) => 
        item.status === "pending" ? sum + item.amount : sum, 0
      ),
      lastUpdate: new Date().toISOString(),
    });

  } catch (error) {
    console.error("❌ Airdrop history error:", error);
    res.status(500).json({ 
      error: "Failed to fetch airdrop history" 
    });
  }
});

export default router;