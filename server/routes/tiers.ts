import type { Express, Request, Response } from "express";
import { z } from "zod";

// Tier validation schemas
const UserTierSchema = z.object({
  userId: z.string(),
  tierId: z.string(),
  mintsThisPeriod: z.number().default(0),
  periodStartDate: z.string(),
  subscriptionStatus: z
    .enum(["active", "cancelled", "past_due", "trialing"])
    .optional(),
  gttBalance: z.number().optional(),
  totalYieldEarned: z.number().optional(),
});

const TierUpgradeSchema = z.object({
  userId: z.string(),
  tierId: z.string(),
  billingPeriod: z.enum(["monthly", "annual"]).default("monthly"),
});

// Mock user data for development
const mockUsers = new Map([
  [
    "user-123",
    {
      id: "user-123",
      tierId: "explorer",
      mintsThisPeriod: 1,
      periodStartDate: new Date().toISOString(),
      gttBalance: 150.75,
      totalYieldEarned: 45.25,
      subscriptionStatus: "active",
      subscriptionEndDate: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
  ],
]);

export function registerTierRoutes(app: Express) {
  // Get user tier information
  app.get("/api/users/:userId/tier", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      // Get user from mock data
      const user = mockUsers.get(userId) || {
        id: userId,
        tierId: "explorer",
        mintsThisPeriod: 0,
        periodStartDate: new Date().toISOString(),
        gttBalance: 0,
        totalYieldEarned: 0,
        subscriptionStatus: "active",
      };

      res.json({ user });
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch user tier",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Update user tier
  app.put("/api/users/:userId/tier", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { tierId } = TierUpgradeSchema.parse(req.body);

      // Update user tier in mock data
      const user = mockUsers.get(userId);
      if (user) {
        user.tierId = tierId;
        user.subscriptionStatus = "active";
        mockUsers.set(userId, user);
      }

      res.json({
        success: true,
        message: `User ${userId} upgraded to ${tierId} tier`,
      });
    } catch (error) {
      res.status(400).json({
        error: "Failed to update user tier",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Increment user mint count
  app.post("/api/users/:userId/mints", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      // Update mint count in mock data
      const user = mockUsers.get(userId);
      if (user) {
        user.mintsThisPeriod += 1;
        mockUsers.set(userId, user);
      }

      res.json({
        success: true,
        message: `Mint count updated for user ${userId}`,
        mintsThisPeriod: user?.mintsThisPeriod || 1,
      });
    } catch (error) {
      res.status(500).json({
        error: "Failed to update mint count",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Update GTT balance
  app.put(
    "/api/users/:userId/gtt-balance",
    async (req: Request, res: Response) => {
      try {
        const { userId } = req.params;
        const { balance } = z.object({ balance: z.number() }).parse(req.body);

        // Update GTT balance in mock data
        const user = mockUsers.get(userId);
        if (user) {
          user.gttBalance = balance;
          mockUsers.set(userId, user);
        }

        res.json({
          success: true,
          message: `GTT balance updated for user ${userId}`,
          balance,
        });
      } catch (error) {
        res.status(400).json({
          error: "Failed to update GTT balance",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  );

  // Check user access permissions
  app.get("/api/users/:userId/access", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const user = mockUsers.get(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Calculate access permissions based on tier
      const access = {
        canMint: user.mintsThisPeriod < getTierMintLimit(user.tierId),
        remainingMints: Math.max(
          getTierMintLimit(user.tierId) - user.mintsThisPeriod,
          0
        ),
        canAccessAnalytics: user.tierId !== "explorer",
        canAccessMarketplace: ["creator", "sovereign"].includes(user.tierId),
        canUseAPI: user.tierId === "sovereign",
        yieldBonus: getTierYieldBonus(user.tierId),
      };

      res.json({ access });
    } catch (error) {
      res.status(500).json({
        error: "Failed to check user access",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Create Stripe checkout session for tier upgrade
  app.post(
    "/api/stripe/create-session",
    async (req: Request, res: Response) => {
      try {
        const { tierId, userId, billingPeriod } = TierUpgradeSchema.parse(
          req.body
        );

        // Mock Stripe integration - replace with actual Stripe API calls
        const sessionId = `cs_mock_${Date.now()}`;
        const mockUrl = `https://checkout.stripe.com/pay/${sessionId}`;

        // In production, this would create an actual Stripe checkout session
        // const session = await stripe.checkout.sessions.create({
        //   mode: 'subscription',
        //   payment_method_types: ['card'],
        //   customer_email: userEmail,
        //   line_items: [{
        //     price: getPriceIdForTier(tierId, billingPeriod),
        //     quantity: 1
        //   }],
        //   success_url: `${process.env.FRONTEND_URL}/tiers?success=true`,
        //   cancel_url: `${process.env.FRONTEND_URL}/tiers?cancelled=true`,
        //   metadata: { userId, tierId }
        // });

        res.json({
          url: mockUrl,
          sessionId,
          message: "Mock checkout session created for development",
        });
      } catch (error) {
        res.status(400).json({
          error: "Failed to create checkout session",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  );
}

// Helper functions
function getTierMintLimit(tierId: string): number {
  const limits = {
    explorer: 3,
    seeker: 15,
    creator: 50,
    sovereign: 200,
  };
  return limits[tierId as keyof typeof limits] || 3;
}

function getTierYieldBonus(tierId: string): number {
  const bonuses = {
    explorer: 0,
    seeker: 0.05,
    creator: 0.1,
    sovereign: 0.25,
  };
  return bonuses[tierId as keyof typeof bonuses] || 0;
}

function getPriceIdForTier(tierId: string, billingPeriod: string): string {
  // Mock price IDs - replace with actual Stripe price IDs
  const priceIds = {
    seeker:
      billingPeriod === "annual"
        ? "price_seeker_annual"
        : "price_seeker_monthly",
    creator:
      billingPeriod === "annual"
        ? "price_creator_annual"
        : "price_creator_monthly",
    sovereign:
      billingPeriod === "annual"
        ? "price_sovereign_annual"
        : "price_sovereign_monthly",
  };
  return priceIds[tierId as keyof typeof priceIds] || "price_default";
}
