import { Router, Request, Response } from "express";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Pricing matrix matching frontend exactly
const PRICING_MATRIX = {
  tiers: [
    {
      id: "explorer",
      name: "Explorer",
      minStake: 0,
      baseAPY: 5.0,
      capsuleMultiplier: 1.0,
      features: [
        "Basic capsule creation",
        "Community verification",
        "Standard yield",
      ],
      price: 0,
    },
    {
      id: "seeker",
      name: "Truth Seeker",
      minStake: 1000,
      baseAPY: 8.0,
      capsuleMultiplier: 1.2,
      features: [
        "Priority verification",
        "Enhanced yield",
        "Analytics dashboard",
      ],
      price: 29,
    },
    {
      id: "creator",
      name: "Truth Creator",
      minStake: 5000,
      baseAPY: 12.0,
      capsuleMultiplier: 1.5,
      features: ["Premium tools", "AI assistance", "Commercial licensing"],
      price: 99,
    },
    {
      id: "sovereign",
      name: "Truth Sovereign",
      minStake: 25000,
      baseAPY: 18.0,
      capsuleMultiplier: 2.0,
      features: ["White-label access", "API access", "Enterprise support"],
      price: 299,
    },
  ],
  features: [
    {
      name: "Basic Capsule Creation",
      description:
        "Create and submit truth capsules for community verification",
      tiers: ["EXPLORER", "SEEKER", "CREATOR", "SOVEREIGN"],
    },
    {
      name: "Community Verification",
      description: "Participate in decentralized truth verification process",
      tiers: ["EXPLORER", "SEEKER", "CREATOR", "SOVEREIGN"],
    },
    {
      name: "Standard Yield (5% APY)",
      description: "Earn GTT tokens from verified capsules at base rate",
      tiers: ["EXPLORER"],
    },
    {
      name: "Enhanced Yield (8% APY)",
      description: "Higher yield rate for verified truth capsules",
      tiers: ["SEEKER", "CREATOR", "SOVEREIGN"],
    },
    {
      name: "Premium Yield (12% APY)",
      description: "Premium yield rate with tier bonuses",
      tiers: ["CREATOR", "SOVEREIGN"],
    },
    {
      name: "Maximum Yield (18% APY)",
      description: "Highest yield rate with maximum bonuses",
      tiers: ["SOVEREIGN"],
    },
    {
      name: "Priority Verification",
      description: "Your capsules get verified faster by the community",
      tiers: ["SEEKER", "CREATOR", "SOVEREIGN"],
    },
    {
      name: "Analytics Dashboard",
      description: "Detailed performance metrics and yield tracking",
      tiers: ["SEEKER", "CREATOR", "SOVEREIGN"],
    },
    {
      name: "Premium Creation Tools",
      description: "Advanced capsule creation and editing capabilities",
      tiers: ["CREATOR", "SOVEREIGN"],
    },
    {
      name: "AI Content Assistant",
      description: "AI-powered writing and fact-checking assistance",
      tiers: ["CREATOR", "SOVEREIGN"],
    },
    {
      name: "Commercial Licensing",
      description: "License your verified capsules for commercial use",
      tiers: ["CREATOR", "SOVEREIGN"],
    },
    {
      name: "White-label Access",
      description: "Deploy GUARDIANCHAIN with your own branding",
      tiers: ["SOVEREIGN"],
    },
    {
      name: "API Access",
      description: "Full API access for custom integrations",
      tiers: ["SOVEREIGN"],
    },
    {
      name: "Enterprise Support",
      description: "Dedicated support team and custom development",
      tiers: ["SOVEREIGN"],
    },
  ],
  stripeMonthlyPrices: [
    {
      id: "price_seeker_monthly_placeholder",
      tier: "SEEKER",
      amount: 2900,
      currency: "usd",
      interval: "month",
      nickname: "Truth Seeker Monthly",
    },
    {
      id: "price_creator_monthly_placeholder",
      tier: "CREATOR",
      amount: 9900,
      currency: "usd",
      interval: "month",
      nickname: "Truth Creator Monthly",
    },
    {
      id: "price_sovereign_monthly_placeholder",
      tier: "SOVEREIGN",
      amount: 29900,
      currency: "usd",
      interval: "month",
      nickname: "Truth Sovereign Monthly",
    },
  ],
  stripeAnnualPrices: [
    {
      id: "price_seeker_annual_placeholder",
      tier: "SEEKER",
      amount: 29000,
      currency: "usd",
      interval: "year",
      nickname: "Truth Seeker Annual",
    },
    {
      id: "price_creator_annual_placeholder",
      tier: "CREATOR",
      amount: 99000,
      currency: "usd",
      interval: "year",
      nickname: "Truth Creator Annual",
    },
    {
      id: "price_sovereign_annual_placeholder",
      tier: "SOVEREIGN",
      amount: 299000,
      currency: "usd",
      interval: "year",
      nickname: "Truth Sovereign Annual",
    },
  ],
};

/**
 * Get complete pricing matrix
 */
router.get("/matrix", (req: Request, res: Response) => {
  res.json(PRICING_MATRIX);
});

/**
 * Get pricing for specific tier
 */
router.get("/tier/:tierName", (req: Request, res: Response) => {
  const { tierName } = req.params;
  const tier = PRICING_MATRIX.tiers.find(
    (t) =>
      t.id.toLowerCase() === tierName.toLowerCase() ||
      t.name.toLowerCase().includes(tierName.toLowerCase())
  );

  if (!tier) {
    return res.status(404).json({
      success: false,
      message: "Tier not found",
    });
  }

  const features = PRICING_MATRIX.features.filter((f) =>
    f.tiers.includes(tier.name.toUpperCase().replace(" ", "_"))
  );

  res.json({
    success: true,
    data: {
      tier,
      features,
      monthlyPrice: PRICING_MATRIX.stripeMonthlyPrices.find(
        (p) => p.tier === tier.name.toUpperCase().replace(" ", "_")
      ),
      annualPrice: PRICING_MATRIX.stripeAnnualPrices.find(
        (p) => p.tier === tier.name.toUpperCase().replace(" ", "_")
      ),
    },
  });
});

/**
 * Calculate upgrade cost for user
 */
router.post(
  "/calculate-upgrade",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { targetTier, billingInterval = "month" } = req.body;

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const currentTier = PRICING_MATRIX.tiers.find(
        (t) => t.id === req.user!.tier.toLowerCase()
      );
      const target = PRICING_MATRIX.tiers.find(
        (t) =>
          t.id.toLowerCase() === targetTier.toLowerCase() ||
          t.name.toLowerCase().replace(" ", "_") === targetTier.toLowerCase()
      );

      if (!currentTier || !target) {
        return res.status(400).json({
          success: false,
          message: "Invalid tier specified",
        });
      }

      if (target.price <= currentTier.price) {
        return res.status(400).json({
          success: false,
          message: "Cannot downgrade or upgrade to same tier",
        });
      }

      const priceList =
        billingInterval === "year"
          ? PRICING_MATRIX.stripeAnnualPrices
          : PRICING_MATRIX.stripeMonthlyPrices;

      const targetPrice = priceList.find(
        (p) => p.tier === target.name.toUpperCase().replace(" ", "_")
      );
      const currentPrice = priceList.find(
        (p) => p.tier === currentTier.name.toUpperCase().replace(" ", "_")
      );

      const upgradeCost = targetPrice ? targetPrice.amount : target.price * 100;
      const currentCost = currentPrice
        ? currentPrice.amount
        : currentTier.price * 100;

      res.json({
        success: true,
        data: {
          currentTier: currentTier.name,
          targetTier: target.name,
          upgradeCost: upgradeCost - currentCost,
          billingInterval,
          savings:
            billingInterval === "year" ? Math.round(target.price * 2 * 100) : 0,
          features: PRICING_MATRIX.features.filter(
            (f) =>
              f.tiers.includes(target.name.toUpperCase().replace(" ", "_")) &&
              !f.tiers.includes(
                currentTier.name.toUpperCase().replace(" ", "_")
              )
          ),
        },
      });
    } catch (error) {
      console.error("Upgrade calculation error:", error);
      res.status(500).json({
        success: false,
        message: "Error calculating upgrade cost",
      });
    }
  }
);

/**
 * Validate pricing configuration
 */
router.get("/validate", (req: Request, res: Response) => {
  const errors: string[] = [];

  // Check tier pricing consistency
  PRICING_MATRIX.tiers.forEach((tier) => {
    const monthlyPrice = PRICING_MATRIX.stripeMonthlyPrices.find(
      (p) => p.tier === tier.name.toUpperCase().replace(" ", "_")
    );

    if (
      tier.price > 0 &&
      (!monthlyPrice || monthlyPrice.amount !== tier.price * 100)
    ) {
      errors.push(
        `Price mismatch for ${tier.name}: Expected ${tier.price * 100}, got ${
          monthlyPrice?.amount || "none"
        }`
      );
    }
  });

  // Check for placeholder price IDs
  [
    ...PRICING_MATRIX.stripeMonthlyPrices,
    ...PRICING_MATRIX.stripeAnnualPrices,
  ].forEach((price) => {
    if (price.id.includes("placeholder")) {
      errors.push(
        `Stripe price ID for ${price.tier} ${price.interval} is still a placeholder`
      );
    }
  });

  res.json({
    success: true,
    isValid: errors.length === 0,
    errors,
    timestamp: new Date().toISOString(),
  });
});

export default router;
