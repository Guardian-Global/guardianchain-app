import { Request, Response } from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../replitAuth";

// Claim GTT yield from verified capsule
export async function claimYield(req: Request, res: Response) {
  try {
    const { capsuleId, userAddress, amount, txHash } = req.body;

    if (!capsuleId || !userAddress || !amount || !txHash) {
      return res.status(400).json({
        message:
          "Missing required fields: capsuleId, userAddress, amount, txHash",
      });
    }

    // Verify capsule exists and user owns it
    const capsule = await storage.getCapsule(capsuleId);
    if (!capsule) {
      return res.status(404).json({ message: "Capsule not found" });
    }

    if (capsule.creator !== userAddress) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Not capsule creator" });
    }

    if (!capsule.verified) {
      return res
        .status(400)
        .json({ message: "Capsule not verified for yield" });
    }

    if (capsule.yieldClaimed) {
      return res.status(400).json({ message: "Yield already claimed" });
    }

    // Update capsule as claimed
    await storage.updateCapsule(capsuleId, {
      yieldClaimed: true,
      yieldClaimedAt: new Date(),
      yieldTxHash: txHash,
      yieldAmount: amount,
    });

    // Log yield claim event to Supabase
    await storage.logYieldEvent({
      capsuleId,
      userAddress,
      amount: parseFloat(amount),
      txHash,
      eventType: "yield_claimed",
      timestamp: new Date(),
    });

    res.json({
      success: true,
      message: "Yield claimed successfully",
      amount,
      txHash,
    });
  } catch (error: any) {
    console.error("Error claiming yield:", error);
    res.status(500).json({
      message: "Failed to claim yield",
      error: error.message,
    });
  }
}

// Get user's claimable capsules
export async function getClaimableCapsules(req: Request, res: Response) {
  try {
    const userAddress = req.params.userAddress;

    if (!userAddress) {
      return res.status(400).json({ message: "User address required" });
    }

    // Get user's verified capsules that haven't been claimed
    const capsules = await storage.getUserCapsules(userAddress, {
      verified: true,
      yieldClaimed: false,
    });

    // Calculate total claimable yield
    const totalClaimable = capsules.reduce(
      (sum, capsule) => sum + (capsule.yieldAmount || 0),
      0
    );

    res.json({
      capsules,
      totalClaimable,
      count: capsules.length,
    });
  } catch (error: any) {
    console.error("Error fetching claimable capsules:", error);
    res.status(500).json({
      message: "Failed to fetch claimable capsules",
      error: error.message,
    });
  }
}

// Get capsule yield history
export async function getCapsuleYieldHistory(req: Request, res: Response) {
  try {
    const capsuleId = req.params.capsuleId;

    if (!capsuleId) {
      return res.status(400).json({ message: "Capsule ID required" });
    }

    const yieldHistory = await storage.getCapsuleYieldHistory(capsuleId);

    res.json({
      capsuleId,
      yieldHistory,
    });
  } catch (error: any) {
    console.error("Error fetching yield history:", error);
    res.status(500).json({
      message: "Failed to fetch yield history",
      error: error.message,
    });
  }
}

// Update capsule yield (admin only)
export async function updateCapsuleYield(req: Request, res: Response) {
  try {
    const { capsuleId, yieldAmount, bonusAmount, reason } = req.body;

    if (!capsuleId || !yieldAmount) {
      return res.status(400).json({
        message: "Missing required fields: capsuleId, yieldAmount",
      });
    }

    // Update capsule yield
    await storage.updateCapsule(capsuleId, {
      yieldAmount: parseFloat(yieldAmount),
      bonusYield: bonusAmount ? parseFloat(bonusAmount) : 0,
      yieldUpdatedAt: new Date(),
      yieldUpdateReason: reason || "Admin adjustment",
    });

    // Log yield update event
    await storage.logYieldEvent({
      capsuleId,
      userAddress: req.user?.claims?.sub || "admin",
      amount: parseFloat(yieldAmount),
      eventType: "yield_updated",
      reason,
      timestamp: new Date(),
    });

    res.json({
      success: true,
      message: "Capsule yield updated successfully",
      capsuleId,
      yieldAmount: parseFloat(yieldAmount),
    });
  } catch (error: any) {
    console.error("Error updating capsule yield:", error);
    res.status(500).json({
      message: "Failed to update capsule yield",
      error: error.message,
    });
  }
}

// Calculate yield based on engagement metrics
export function calculateCapsuleYield(
  views: number,
  shares: number,
  verifications: number
): number {
  const BASE_YIELD = 100; // Base GTT yield
  const VIEW_MULTIPLIER = 0.1; // 0.1 GTT per view
  const SHARE_MULTIPLIER = 5; // 5 GTT per share
  const VERIFICATION_MULTIPLIER = 25; // 25 GTT per verification

  const yieldFromViews = Math.min(views * VIEW_MULTIPLIER, 500); // Cap at 500 GTT
  const yieldFromShares = Math.min(shares * SHARE_MULTIPLIER, 1000); // Cap at 1000 GTT
  const yieldFromVerifications = verifications * VERIFICATION_MULTIPLIER;

  return BASE_YIELD + yieldFromViews + yieldFromShares + yieldFromVerifications;
}

// Verify capsule and set yield
export async function verifyCapsuleYield(req: Request, res: Response) {
  try {
    const { capsuleId, verifierAddress } = req.body;

    if (!capsuleId || !verifierAddress) {
      return res.status(400).json({
        message: "Missing required fields: capsuleId, verifierAddress",
      });
    }

    const capsule = await storage.getCapsule(capsuleId);
    if (!capsule) {
      return res.status(404).json({ message: "Capsule not found" });
    }

    if (capsule.verified) {
      return res.status(400).json({ message: "Capsule already verified" });
    }

    // Calculate yield based on current engagement
    const yieldAmount = calculateCapsuleYield(
      capsule.views || 0,
      capsule.shares || 0,
      capsule.verifications || 0
    );

    // Update capsule as verified with yield
    await storage.updateCapsule(capsuleId, {
      verified: true,
      verifiedAt: new Date(),
      verifiedBy: verifierAddress,
      yieldAmount,
      verifications: (capsule.verifications || 0) + 1,
    });

    // Log verification event
    await storage.logYieldEvent({
      capsuleId,
      userAddress: verifierAddress,
      amount: yieldAmount,
      eventType: "capsule_verified",
      timestamp: new Date(),
    });

    res.json({
      success: true,
      message: "Capsule verified successfully",
      capsuleId,
      yieldAmount,
      verifierAddress,
    });
  } catch (error: any) {
    console.error("Error verifying capsule:", error);
    res.status(500).json({
      message: "Failed to verify capsule",
      error: error.message,
    });
  }
}
