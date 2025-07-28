import { Router } from "express";
import { storage } from "../storage";

const router = Router();

// Get user's Guardian Pass collection
router.get("/api/guardian-pass/collection", async (req, res) => {
  try {
    // In production, get user address from authentication
    const userAddress = (req.query.address as string) || "demo-user";

    const collection = await storage.getGuardianPassCollection(userAddress);

    if (!collection) {
      return res.json({
        ownedPasses: [],
        totalValue: "0",
        highestRarity: "None",
        benefits: {
          totalAPYBoost: 0,
          stakingMultiplier: 1.0,
          daoVotingPower: 0,
          exclusiveFeatures: [],
        },
      });
    }

    res.json(collection);
  } catch (error) {
    console.error("Guardian Pass collection error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get marketplace data
router.get("/api/guardian-pass/marketplace", async (req, res) => {
  try {
    const marketplaceData = await storage.getGuardianPassMarketplaceData();

    res.json(marketplaceData);
  } catch (error) {
    console.error("Guardian Pass marketplace error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Mint Guardian Pass (for early verifiers)
router.post("/api/guardian-pass/mint", async (req, res) => {
  try {
    const { address, isEarlyVerifier } = req.body;

    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    // Check eligibility
    if (!isEarlyVerifier) {
      const isEligible = await storage.checkGuardianPassEligibility(address);
      if (!isEligible) {
        return res
          .status(400)
          .json({ message: "Not eligible for Guardian Pass minting" });
      }
    }

    // Determine rarity for early verifiers (higher chance for rare+)
    let rarity: string;
    if (isEarlyVerifier) {
      const rand = Math.random();
      if (rand < 0.1) rarity = "Legendary";
      else if (rand < 0.3) rarity = "Epic";
      else if (rand < 0.7) rarity = "Rare";
      else rarity = "Uncommon";
    } else {
      // Normal distribution
      const rand = Math.random();
      if (rand < 0.01) rarity = "Legendary";
      else if (rand < 0.05) rarity = "Epic";
      else if (rand < 0.2) rarity = "Rare";
      else if (rand < 0.5) rarity = "Uncommon";
      else rarity = "Common";
    }

    // Generate token ID
    const tokenId = Math.floor(Math.random() * 10000) + 1;

    // Create Guardian Pass
    const guardianPass = await storage.createGuardianPass({
      tokenId,
      ownerAddress: address,
      rarity,
      mintTime: new Date().toISOString(),
      isEarlyVerifier,
    });

    // In production, this would interact with GuardianPass contract
    // await guardianPassContract.mintPass(address, rarity);

    res.json({
      success: true,
      message: "Guardian Pass minted successfully",
      guardianPass,
    });
  } catch (error) {
    console.error("Guardian Pass mint error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Guardian Pass benefits for user
router.get("/api/guardian-pass/benefits/:address", async (req, res) => {
  try {
    const { address } = req.params;

    const benefits = await storage.getGuardianPassBenefits(address);

    res.json(benefits);
  } catch (error) {
    console.error("Guardian Pass benefits error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Check if user has Guardian Pass for feature gating
router.get("/api/guardian-pass/check/:address", async (req, res) => {
  try {
    const { address } = req.params;

    const hasPass = await storage.hasGuardianPass(address);
    const highestRarity = await storage.getHighestRarityPass(address);

    res.json({
      hasGuardianPass: hasPass,
      highestRarity: highestRarity || "None",
      benefits: hasPass ? await storage.getGuardianPassBenefits(address) : null,
    });
  } catch (error) {
    console.error("Guardian Pass check error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
