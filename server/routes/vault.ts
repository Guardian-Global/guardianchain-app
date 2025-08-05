import { Router } from "express";
import { consolidatedAuth } from "../auth/authConsolidation";
import { calculateCapsuleYield } from "../../client/src/utils/capsuleYield";

const router = Router();

// Enhanced Vault API - Get claimable GTT yield for user
router.get("/claimable", consolidatedAuth, async (req: any, res) => {
  try {
    const userId = req.user?.id;
    const { owner } = req.query;
    
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Use owner from query if provided, otherwise use authenticated user
    const targetUserId = owner || userId;
    
    console.log("💰 Calculating claimable yield for user:", targetUserId);

    // Mock capsules data - in production this would query Supabase
    const mockCapsules = [
      {
        id: "cap_1754140001_abc123",
        title: "Family Legacy Collection",
        created_at: "2024-07-15T10:00:00Z",
        truth_score: 95,
        has_veritas_seal: true,
        owner: targetUserId
      },
      {
        id: "cap_1754140002_def456", 
        title: "Corporate Whistleblower Report",
        created_at: "2024-06-20T15:30:00Z",
        truth_score: 98,
        has_veritas_seal: true,
        owner: targetUserId
      },
      {
        id: "cap_1754140003_ghi789",
        title: "Personal Memory Archive",
        created_at: "2024-08-01T08:15:00Z", 
        truth_score: 87,
        has_veritas_seal: false,
        owner: targetUserId
      }
    ];

    // Calculate yield for each capsule using our advanced system
    const yields = mockCapsules.map(capsule => {
      const yieldData = calculateCapsuleYield(
        capsule.created_at,
        0.12, // 12% base APY
        capsule.truth_score,
        capsule.has_veritas_seal
      );
      
      return {
        capsuleId: capsule.id,
        title: capsule.title,
        currentYield: yieldData.currentYield,
        dailyRate: yieldData.dailyRate,
        apy: yieldData.apy,
        daysActive: yieldData.daysActive
      };
    });

    const totalYield = yields.reduce((sum, y) => sum + y.currentYield, 0);
    const averageAPY = yields.reduce((sum, y) => sum + y.apy, 0) / yields.length;

    const response = {
      amount: totalYield.toFixed(6),
      totalYield: totalYield,
      averageAPY: averageAPY,
      capsuleCount: yields.length,
      breakdown: yields,
      lastUpdated: new Date().toISOString()
    };

    console.log("💰 Claimable yield calculated:", response);
    res.json(response);

  } catch (error) {
    console.error("Error calculating claimable yield:", error);
    res.status(500).json({ 
      error: "Failed to calculate claimable yield",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Get yield history for analytics
router.get("/history", consolidatedAuth, async (req: any, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Mock yield history - in production this would be stored in database
    const mockHistory = [
      {
        date: "2024-08-01",
        totalYield: 15.234567,
        capsuleCount: 3,
        averageAPY: 15.8
      },
      {
        date: "2024-08-02", 
        totalYield: 15.456789,
        capsuleCount: 3,
        averageAPY: 15.9
      },
      {
        date: "2024-08-03",
        totalYield: 15.678901,
        capsuleCount: 3,
        averageAPY: 16.1
      }
    ];

    res.json({
      history: mockHistory,
      totalGrown: mockHistory[mockHistory.length - 1].totalYield - mockHistory[0].totalYield,
      periodDays: mockHistory.length
    });

  } catch (error) {
    console.error("Error fetching yield history:", error);
    res.status(500).json({ error: "Failed to fetch yield history" });
  }
});

// Simulate claiming yield (blockchain integration ready)
router.post("/claim", consolidatedAuth, async (req: any, res) => {
  try {
    const userId = req.user?.id;
    const { amount, capsuleIds } = req.body;
    
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid claim amount" });
    }

    console.log("🎯 Processing yield claim:", { userId, amount, capsuleIds });

    // In production, this would:
    // 1. Verify the claimable amount matches calculation
    // 2. Call the smart contract to mint GTT tokens
    // 3. Update database with claim transaction
    // 4. Send confirmation to user

    // Mock successful claim
    const mockTransaction = {
      hash: `0x${Math.random().toString(16).substr(2, 64)}`,
      amount: parseFloat(amount),
      gasUsed: "0.001 MATIC",
      gasPrice: "30 gwei",
      blockNumber: Math.floor(Math.random() * 1000000) + 45000000,
      timestamp: new Date().toISOString(),
      status: "confirmed"
    };

    res.json({
      success: true,
      transaction: mockTransaction,
      newBalance: parseFloat(amount) + 2547.89, // Mock existing balance
      message: "GTT yield successfully claimed!"
    });

  } catch (error) {
    console.error("Error processing yield claim:", error);
    res.status(500).json({ error: "Failed to process yield claim" });
  }
});

export default router;