import express from "express";
import { consolidatedAuth } from "../auth/authConsolidation";

export const yieldRoutes = express.Router();

// Create new GTT stake
yieldRoutes.post("/stake", consolidatedAuth, async (req, res) => {
  try {
    const { gttAmount, daysLocked } = req.body;
    const userId = req.user.id;

    if (!gttAmount || !daysLocked || gttAmount <= 0 || daysLocked < 7) {
      return res.status(400).json({ error: "Invalid stake parameters" });
    }

    // Calculate multiplier based on lock duration
    const baseAPY = 0.05;
    const bonusAPY = (daysLocked / 365) * 0.15;
    const multiplier = baseAPY + bonusAPY;

    // Calculate end date
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + (daysLocked * 24 * 60 * 60 * 1000));

    // Mock stake creation - replace with actual database insert
    const newStake = {
      id: `stake_${Date.now()}`,
      userId,
      gttAmount: parseFloat(gttAmount),
      daysLocked: parseInt(daysLocked),
      multiplier,
      startedAt: startDate.toISOString(),
      endsAt: endDate.toISOString(),
      claimed: false,
      yieldEarned: 0,
      createdAt: startDate.toISOString()
    };

    console.log(`🏦 GTT Stake Created: ${gttAmount} GTT for ${daysLocked} days (${userId})`);

    res.json({
      success: true,
      stake: newStake,
      message: `Successfully staked ${gttAmount} GTT for ${daysLocked} days`
    });
  } catch (error) {
    console.error("Error creating stake:", error);
    res.status(500).json({ error: "Failed to create stake" });
  }
});

// Get user's active stakes
yieldRoutes.get("/stakes", consolidatedAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Mock stakes data - replace with actual database query
    const mockStakes = [
      {
        id: "stake_001",
        userId,
        gttAmount: 500,
        daysLocked: 90,
        multiplier: 0.0875,
        startedAt: "2025-07-01T00:00:00Z",
        endsAt: "2025-09-29T00:00:00Z",
        claimed: false,
        yieldEarned: 10.73,
        createdAt: "2025-07-01T00:00:00Z"
      },
      {
        id: "stake_002",
        userId,
        gttAmount: 250,
        daysLocked: 30,
        multiplier: 0.0623,
        startedAt: "2025-07-15T00:00:00Z",
        endsAt: "2025-08-14T00:00:00Z",
        claimed: true,
        yieldEarned: 1.28,
        createdAt: "2025-07-15T00:00:00Z"
      }
    ];

    res.json(mockStakes);
  } catch (error) {
    console.error("Error fetching stakes:", error);
    res.status(500).json({ error: "Failed to fetch stakes" });
  }
});

// Claim matured stake yield
yieldRoutes.post("/claim/:stakeId", consolidatedAuth, async (req, res) => {
  try {
    const { stakeId } = req.params;
    const userId = req.user.id;

    // Mock claim processing - replace with actual database operations
    console.log(`💰 Yield Claim: ${stakeId} by ${userId}`);

    res.json({
      success: true,
      message: "Yield claimed successfully",
      claimedAmount: 10.73
    });
  } catch (error) {
    console.error("Error claiming yield:", error);
    res.status(500).json({ error: "Failed to claim yield" });
  }
});

// Get staking leaderboard
yieldRoutes.get("/leaderboard", async (req, res) => {
  try {
    // Mock leaderboard data
    const mockLeaderboard = [
      { rank: 1, username: "StakeHero", totalStaked: 5000, totalYield: 234.56 },
      { rank: 2, username: "YieldMaster", totalStaked: 4750, totalYield: 198.23 },
      { rank: 3, username: "GTTGuardian", totalStaked: 4200, totalYield: 187.45 },
      { rank: 4, username: "VaultKeeper", totalStaked: 3800, totalYield: 165.78 },
      { rank: 5, username: "StakeGuardian", totalStaked: 3500, totalYield: 142.89 }
    ];

    res.json(mockLeaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Failed to fetch staking leaderboard" });
  }
});

export default yieldRoutes;