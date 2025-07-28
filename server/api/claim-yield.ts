import type { Request, Response } from "express";
import { storage } from "../storage";
import { z } from "zod";

const claimYieldSchema = z.object({
  capsuleId: z.number(),
  txHash: z.string(),
  gttAmount: z.string(),
});

export async function claimYield(req: Request, res: Response) {
  try {
    const { capsuleId, txHash, gttAmount } = claimYieldSchema.parse(req.body);

    // Get the capsule
    const capsule = await storage.getCapsule(capsuleId);
    if (!capsule) {
      return res.status(404).json({ message: "Capsule not found" });
    }

    // Verify the capsule is eligible for claiming (verified or sealed)
    if (capsule.status !== "verified" && capsule.status !== "sealed") {
      return res.status(400).json({
        message: "Capsule must be verified or sealed to claim yield",
      });
    }

    // TODO: Add user authentication check when auth is implemented
    // Ensure the requester is the capsule creator
    // if (req.user?.id !== capsule.creatorId) {
    //   return res.status(403).json({ message: "Only capsule creator can claim yield" });
    // }

    // TODO: Verify the transaction hash on blockchain
    // This would involve checking the TruthVault smart contract events
    // to confirm the yield claim transaction was successful

    // Update capsule with claim information
    const currentClaimed = parseFloat(capsule.gttClaimed || "0");
    const newClaimedAmount = parseFloat(gttAmount);
    const updatedClaimed = (currentClaimed + newClaimedAmount).toFixed(2);

    const updatedCapsule = await storage.updateCapsule(capsuleId, {
      gttClaimed: updatedClaimed,
      claimTxHash: txHash,
      updatedAt: new Date(),
    });

    // Update user's GTT balance
    const user = await storage.getUser(capsule.creatorId);
    if (user) {
      const currentBalance = parseFloat(user.gttBalance || "0");
      const newBalance = (currentBalance + newClaimedAmount).toFixed(2);
      await storage.updateUser(user.id, { gttBalance: newBalance });
    }

    // Create transaction record for the claim
    await storage.createTransaction({
      type: "yield_claim",
      userId: capsule.creatorId,
      amount: gttAmount,
      description: `GTT yield claimed for capsule "${capsule.title}"`,
      capsuleId: capsuleId,
      txHash: txHash,
    });

    res.json({
      success: true,
      capsule: updatedCapsule,
      claimedAmount: gttAmount,
      totalClaimed: updatedClaimed,
      txHash: txHash,
    });
  } catch (error: any) {
    console.error("Claim yield error:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Invalid request data",
        errors: error.errors,
      });
    }

    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}
