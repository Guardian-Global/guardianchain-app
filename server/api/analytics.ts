import express from "express";
import { storage } from "../storage";
import { calculateTruthYield, calculateGTTReward } from "@shared/utils/roi";

const router = express.Router();

// Increment view count for a capsule
router.post("/:id/view", async (req, res) => {
  try {
    const capsuleId = parseInt(req.params.id);
    const capsule = await storage.getCapsule(capsuleId);
    
    if (!capsule) {
      return res.status(404).json({ message: "Capsule not found" });
    }
    
    // Update view count
    const updatedCapsule = await storage.updateCapsule(capsuleId, {
      viewCount: (capsule.viewCount || 0) + 1
    });
    
    // Recalculate truth yield
    const newYield = calculateTruthYield(updatedCapsule);
    const gttReward = calculateGTTReward(newYield);
    
    // Update yield and GTT reward
    await storage.updateCapsule(capsuleId, {
      truthYield: newYield.toString(),
      gttReward: gttReward.toString()
    });
    
    res.json({
      success: true,
      viewCount: updatedCapsule.viewCount,
      truthYield: newYield,
      gttReward
    });
  } catch (error: any) {
    console.error("View tracking error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Increment share count for a capsule
router.post("/:id/share", async (req, res) => {
  try {
    const capsuleId = parseInt(req.params.id);
    const { platform } = req.body; // twitter, facebook, linkedin, etc.
    
    const capsule = await storage.getCapsule(capsuleId);
    
    if (!capsule) {
      return res.status(404).json({ message: "Capsule not found" });
    }
    
    // Update share count
    const updatedCapsule = await storage.updateCapsule(capsuleId, {
      shareCount: (capsule.shareCount || 0) + 1
    });
    
    // Recalculate truth yield
    const newYield = calculateTruthYield(updatedCapsule);
    const gttReward = calculateGTTReward(newYield);
    
    // Update yield and GTT reward
    await storage.updateCapsule(capsuleId, {
      truthYield: newYield.toString(),
      gttReward: gttReward.toString()
    });
    
    // Log the share event
    console.log(`Capsule ${capsuleId} shared on ${platform}`);
    
    res.json({
      success: true,
      shareCount: updatedCapsule.shareCount,
      truthYield: newYield,
      gttReward,
      platform
    });
  } catch (error: any) {
    console.error("Share tracking error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get capsule analytics
router.get("/:id/analytics", async (req, res) => {
  try {
    const capsuleId = parseInt(req.params.id);
    const capsule = await storage.getCapsule(capsuleId);
    
    if (!capsule) {
      return res.status(404).json({ message: "Capsule not found" });
    }
    
    const truthYield = parseFloat(capsule.truthYield || "0");
    const gttReward = parseFloat(capsule.gttReward || "0");
    
    // Calculate growth rates (mock for now - in production, track historical data)
    const daysActive = Math.max(1, Math.ceil((Date.now() - new Date(capsule.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24)));
    const dailyViewRate = (capsule.viewCount || 0) / daysActive;
    const dailyShareRate = (capsule.shareCount || 0) / daysActive;
    
    res.json({
      capsuleId,
      metrics: {
        views: capsule.viewCount || 0,
        shares: capsule.shareCount || 0,
        verifications: capsule.verificationCount || 0,
        truthYield,
        gttReward,
        griefScore: parseFloat(capsule.griefScore || "0"),
        status: capsule.status,
        minted: capsule.minted || false
      },
      growth: {
        daysActive,
        dailyViewRate: Math.round(dailyViewRate * 100) / 100,
        dailyShareRate: Math.round(dailyShareRate * 100) / 100,
        yieldGrowthRate: Math.round((truthYield / daysActive) * 100) / 100
      },
      timestamps: {
        created: capsule.createdAt,
        lastUpdated: capsule.updatedAt
      }
    });
  } catch (error: any) {
    console.error("Analytics error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Claim yield for a capsule (placeholder for smart contract integration)
router.post("/:id/claim-yield", async (req, res) => {
  try {
    const capsuleId = parseInt(req.params.id);
    const { walletAddress } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({ error: "Wallet address required" });
    }
    
    const capsule = await storage.getCapsule(capsuleId);
    
    if (!capsule) {
      return res.status(404).json({ message: "Capsule not found" });
    }
    
    // In production, this would interact with the TruthYield smart contract
    const truthYield = parseFloat(capsule.truthYield || "0");
    
    if (truthYield < 1.0) {
      return res.status(400).json({ error: "Minimum yield of 1.0 required to claim" });
    }
    
    // Mock smart contract interaction
    const claimAmount = calculateGTTReward(truthYield);
    const txHash = `0x${Math.random().toString(16).slice(2)}mock_claim_${Date.now()}`;
    
    // Create transaction record
    await storage.createTransaction({
      userId: capsule.creatorId,
      type: "yield_claim",
      amount: claimAmount.toString(),
      capsuleId,
      txHash,
      description: `Yield claimed for capsule "${capsule.title}"`
    });
    
    // Reset capsule yield after claim
    await storage.updateCapsule(capsuleId, {
      truthYield: "0.00",
      gttReward: "0.00"
    });
    
    res.json({
      success: true,
      message: "Yield claimed successfully",
      claimAmount,
      txHash,
      capsuleId,
      walletAddress
    });
  } catch (error: any) {
    console.error("Yield claim error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;