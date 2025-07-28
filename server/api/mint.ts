import type { Express } from "express";
import {
  calculateGTT,
  calculateAdvancedGTT,
  type CapsuleMetrics,
} from "../../client/src/lib/gttEngine";

/**
 * GTT Minting API endpoints
 * Handles token minting operations and yield claiming
 */

interface MintRequest {
  amount: number;
  wallet: string;
  capsuleId?: string;
  reason?: string;
}

interface ClaimRequest {
  capsuleId: string;
  griefScore: number;
  replayCount: number;
  userWallet: string;
}

interface MintResponse {
  success: boolean;
  amount: number;
  wallet: string;
  transactionHash?: string;
  error?: string;
}

/**
 * Simulate GTT minting to wallet address
 * In production, this would interact with the actual smart contract
 */
async function simulateGTTMint(
  amount: number,
  wallet: string
): Promise<MintResponse> {
  // Validate inputs
  if (amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }

  if (!wallet || !wallet.startsWith("0x") || wallet.length !== 42) {
    throw new Error("Invalid wallet address");
  }

  // Simulate blockchain transaction delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Generate mock transaction hash
  const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;

  console.log(`[GTT MINT] Minting ${amount} GTT to wallet: ${wallet}`);
  console.log(`[GTT MINT] Transaction hash: ${transactionHash}`);

  return {
    success: true,
    amount,
    wallet,
    transactionHash,
  };
}

/**
 * Calculate and mint GTT rewards for capsule performance
 */
async function calculateAndMintRewards(
  capsuleMetrics: CapsuleMetrics,
  wallet: string
): Promise<MintResponse> {
  const rewards = calculateAdvancedGTT(capsuleMetrics);

  console.log(`[GTT REWARDS] Calculated rewards for capsule:`, {
    baseReward: rewards.baseReward,
    griefMultiplier: rewards.griefMultiplier,
    engagementBonus: rewards.engagementBonus,
    sealBonus: rewards.sealBonus,
    totalGTT: rewards.totalGTT,
  });

  return await simulateGTTMint(rewards.totalGTT, wallet);
}

/**
 * Register mint API routes
 */
export function registerMintRoutes(app: Express) {
  // Direct GTT minting endpoint (admin only)
  app.post("/api/mint/gtt", async (req, res) => {
    try {
      const { amount, wallet, reason } = req.body as MintRequest;

      if (!amount || !wallet) {
        return res.status(400).json({
          error: "Missing required fields: amount and wallet",
        });
      }

      // In production, add admin authentication check here
      // if (!req.user?.isAdmin) {
      //   return res.status(403).json({ error: "Admin access required" });
      // }

      const result = await simulateGTTMint(amount, wallet);

      // Log the mint operation
      console.log(
        `[ADMIN MINT] ${amount} GTT minted to ${wallet}. Reason: ${
          reason || "Manual mint"
        }`
      );

      res.status(200).json(result);
    } catch (error: any) {
      console.error("GTT mint error:", error);
      res.status(500).json({
        error: "Failed to mint GTT tokens",
        details: error.message,
      });
    }
  });

  // Claim GTT rewards for capsule performance
  app.post("/api/mint/claim", async (req, res) => {
    try {
      const { capsuleId, griefScore, replayCount, userWallet } =
        req.body as ClaimRequest;

      if (!capsuleId || !userWallet) {
        return res.status(400).json({
          error: "Missing required fields: capsuleId and userWallet",
        });
      }

      // Calculate GTT using the simple formula
      const simpleGTT = calculateGTT(griefScore || 0, replayCount || 0);

      // For advanced calculation, create metrics object
      const capsuleMetrics: CapsuleMetrics = {
        griefScore: griefScore || 0,
        viewCount: replayCount || 0,
        shareCount: Math.floor((replayCount || 0) * 0.1), // Assume 10% share rate
        verificationCount: Math.floor((griefScore || 0) / 20), // Estimate verifications
        timeActive: 24, // Default 24 hours
        sealStatus: griefScore > 70, // Assume high grief score means sealed
        creatorReputation: 750, // Default reputation
      };

      const result = await calculateAndMintRewards(capsuleMetrics, userWallet);

      res.status(200).json({
        ...result,
        capsuleId,
        simpleCalculation: simpleGTT,
        advancedCalculation: result.amount,
        metrics: capsuleMetrics,
      });
    } catch (error: any) {
      console.error("GTT claim error:", error);
      res.status(500).json({
        error: "Failed to claim GTT rewards",
        details: error.message,
      });
    }
  });

  // Batch mint for multiple recipients
  app.post("/api/mint/batch", async (req, res) => {
    try {
      const { recipients } = req.body as { recipients: MintRequest[] };

      if (!recipients || !Array.isArray(recipients)) {
        return res.status(400).json({
          error: "Invalid recipients array",
        });
      }

      const results = [];

      for (const recipient of recipients) {
        try {
          const result = await simulateGTTMint(
            recipient.amount,
            recipient.wallet
          );
          results.push({ ...result, recipient: recipient.wallet });
        } catch (error: any) {
          results.push({
            success: false,
            error: error.message,
            recipient: recipient.wallet,
          });
        }
      }

      res.status(200).json({
        success: true,
        results,
        totalMinted: results
          .filter((r) => r.success)
          .reduce((sum, r) => sum + (r.amount || 0), 0),
      });
    } catch (error: any) {
      console.error("Batch mint error:", error);
      res.status(500).json({
        error: "Failed to process batch mint",
        details: error.message,
      });
    }
  });

  // Get mint history (mock data)
  app.get("/api/mint/history", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;

      // Generate mock mint history
      const history = Array.from({ length: limit }, (_, i) => ({
        id: `mint_${Date.now()}_${i}`,
        amount: Math.floor(Math.random() * 500) + 10,
        recipient: `0x${Math.random().toString(16).substr(2, 40)}`,
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        timestamp: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        reason: [
          "Capsule reward",
          "Admin mint",
          "Staking reward",
          "Governance participation",
        ][Math.floor(Math.random() * 4)],
      }));

      res.status(200).json(history);
    } catch (error: any) {
      console.error("Mint history error:", error);
      res.status(500).json({
        error: "Failed to fetch mint history",
        details: error.message,
      });
    }
  });

  // Get total supply and statistics
  app.get("/api/mint/stats", async (req, res) => {
    try {
      const stats = {
        totalSupply: 125000,
        circulatingSupply: 98750,
        burnedTokens: 1250,
        mintedToday: 450,
        mintedThisWeek: 2100,
        mintedThisMonth: 8500,
        topHolders: [
          { address: "0xA1b2C3d4E5f6789...", balance: 12500 },
          { address: "0xB2c3D4e5F6g7890...", balance: 9800 },
          { address: "0xC3d4E5f6G7h8901...", balance: 7600 },
          { address: "0xD4e5F6g7H8i9012...", balance: 6200 },
          { address: "0xE5f6G7h8I9j0123...", balance: 5100 },
        ],
      };

      res.status(200).json(stats);
    } catch (error: any) {
      console.error("Mint stats error:", error);
      res.status(500).json({
        error: "Failed to fetch mint statistics",
        details: error.message,
      });
    }
  });
}
