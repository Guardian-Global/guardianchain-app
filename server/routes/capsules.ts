import { Request, Response } from "express";
import { apiRequest } from "../lib/queryClient";

// Create new capsule with GTT integration
export async function createCapsule(req: Request, res: Response) {
  try {
    const {
      title,
      content,
      capsuleType,
      accessCost,
      tags,
      isSealed,
      authorId,
    } = req.body;

    // Validate required fields
    if (!title || !content || !authorId) {
      return res.status(400).json({
        error: "Missing required fields: title, content, authorId",
      });
    }

    // Create capsule record
    const capsule = {
      id: `cap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      content,
      author: authorId,
      capsuleType: capsuleType || "personal_memory",
      accessCost: accessCost || 0,
      tags: Array.isArray(tags) ? tags : [],
      isSealed: isSealed || false,
      verificationStatus: "pending",
      truthScore: 0,
      views: 0,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store capsule (in a real app, this would be saved to database)
    console.log("🔵 DEBUG: Creating capsule:", capsule);

    res.status(201).json({
      success: true,
      capsule,
      message: "Capsule created successfully",
    });
  } catch (error) {
    console.error("Error creating capsule:", error);
    res.status(500).json({
      error: "Failed to create capsule",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// Trigger Stripe payment and GTT rewards
export async function triggerStripePayment(req: Request, res: Response) {
  try {
    const { capsuleId, amount } = req.body;

    console.log(
      "🔵 DEBUG: Triggering Stripe payment for capsule:",
      capsuleId,
      "Amount:",
      amount,
    );

    // In a real implementation, you would:
    // 1. Create Stripe payment session
    // 2. Process GTT token minting/distribution
    // 3. Update capsule status
    // 4. Send confirmation

    const paymentResult = {
      sessionId: `stripe_${Date.now()}`,
      amount: amount || 2.5,
      currency: "GTT",
      status: "completed",
      capsuleId,
      timestamp: new Date().toISOString(),
    };

    console.log("✅ DEBUG: Stripe payment processed:", paymentResult);

    res.json({
      success: true,
      payment: paymentResult,
      message: "Payment processed and GTT rewards distributed",
    });
  } catch (error) {
    console.error("Error processing Stripe payment:", error);
    res.status(500).json({
      error: "Payment processing failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// Replay capsule and distribute yield
export async function replayCapsule(req: Request, res: Response) {
  try {
    const { capsuleId, authorId, yieldAmount } = req.body;

    if (!capsuleId) {
      return res.status(400).json({ error: "Missing capsuleId" });
    }

    console.log(
      "🔵 DEBUG: Replaying capsule:",
      capsuleId,
      "Yield:",
      yieldAmount,
    );

    // In a real implementation:
    // 1. Verify capsule exists and is accessible
    // 2. Process GTT yield distribution to author
    // 3. Update capsule replay count
    // 4. Record transaction on blockchain

    const replayResult = {
      capsuleId,
      authorId,
      yieldAmount: yieldAmount || 2.5,
      replayCount: 1,
      timestamp: new Date().toISOString(),
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
    };

    console.log("✅ DEBUG: Capsule replay completed:", replayResult);

    res.json({
      success: true,
      replay: replayResult,
      message: "Capsule replayed and yield distributed successfully",
    });
  } catch (error) {
    console.error("Error replaying capsule:", error);
    res.status(500).json({
      error: "Capsule replay failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// Purchase capsule access
export async function purchaseCapsuleAccess(req: Request, res: Response) {
  try {
    const { capsuleId, amount } = req.body;

    console.log(
      "🔵 DEBUG: Processing capsule access purchase:",
      capsuleId,
      "Amount:",
      amount,
    );

    // In a real implementation:
    // 1. Create Stripe checkout session
    // 2. Verify user has sufficient GTT balance
    // 3. Process payment and unlock access
    // 4. Return session URL

    const sessionUrl = `https://checkout.stripe.com/pay/test_session_${Date.now()}`;

    res.json({
      success: true,
      sessionUrl,
      amount,
      capsuleId,
      message: "Payment session created",
    });
  } catch (error) {
    console.error("Error creating payment session:", error);
    res.status(500).json({
      error: "Failed to create payment session",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// Distribute GTT yield
export async function distributeGttYield(req: Request, res: Response) {
  try {
    const { recipientId, amount, reason, capsuleId } = req.body;

    console.log("🔵 DEBUG: Distributing GTT yield:", {
      recipientId,
      amount,
      reason,
      capsuleId,
    });

    // In a real implementation:
    // 1. Verify recipient exists
    // 2. Process GTT token transfer
    // 3. Update user balance
    // 4. Record transaction

    const distribution = {
      id: `dist_${Date.now()}`,
      recipientId,
      amount,
      reason,
      capsuleId,
      timestamp: new Date().toISOString(),
      status: "completed",
    };

    console.log("✅ DEBUG: GTT yield distributed:", distribution);

    res.json({
      success: true,
      distribution,
      message: "GTT yield distributed successfully",
    });
  } catch (error) {
    console.error("Error distributing GTT yield:", error);
    res.status(500).json({
      error: "GTT distribution failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
