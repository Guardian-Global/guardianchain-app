import { Router } from "express";
import { isDebugAuthenticated } from "../debugAuth";
import { storage } from "../storage";

const router = Router();

// Get subscription status
router.get("/status", isDebugAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims?.sub || req.user.id;
    const user = await storage.getUser(userId);

    const tierLimits = {
      EXPLORER: { capsules: 5, price: 0 },
      SEEKER: { capsules: 25, price: 9.99 },
      CREATOR: { capsules: 999, price: 29.99 },
      SOVEREIGN: { capsules: 9999, price: 99.99 },
    };

    const currentTier = user?.tier || "EXPLORER";

    res.json({
      tier: currentTier,
      limits: tierLimits[currentTier as keyof typeof tierLimits],
      usage: {
        capsulesCreated: 0,
        capsulesRemaining:
          tierLimits[currentTier as keyof typeof tierLimits].capsules,
      },
    });
  } catch (error) {
    console.error("Subscription status error:", error);
    res.status(500).json({ message: "Failed to fetch subscription status" });
  }
});

// Upgrade subscription
router.post("/upgrade", isDebugAuthenticated, async (req: any, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user.claims?.sub || req.user.id;

    const validTiers = ["EXPLORER", "SEEKER", "CREATOR", "SOVEREIGN"];
    const newTier = planId.toUpperCase();

    if (!validTiers.includes(newTier)) {
      return res.status(400).json({ message: "Invalid subscription tier" });
    }

    await storage.updateUserTier(userId, newTier);

    res.json({
      success: true,
      message: "Subscription upgraded successfully",
      newTier: newTier,
    });
  } catch (error) {
    console.error("Subscription upgrade error:", error);
    res.status(500).json({ message: "Failed to upgrade subscription" });
  }
});

export default router;
