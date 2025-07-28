import { Router } from "express";
import { storage } from "../storage";

const router = Router();

// Airdrop claim endpoint
router.post("/api/airdrop/claim", async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    // Check if address has already claimed
    const existingClaim = await storage.getAirdropClaim(address);
    if (existingClaim) {
      return res
        .status(400)
        .json({ message: "Airdrop already claimed for this address" });
    }

    // Check eligibility (for demo, all addresses are eligible)
    const isEligible = true; // In production, implement actual eligibility logic

    if (!isEligible) {
      return res
        .status(400)
        .json({ message: "Address not eligible for airdrop" });
    }

    // Record the claim
    const claim = await storage.createAirdropClaim({
      address,
      amount: "100", // 100 GTT tokens
      claimDate: new Date().toISOString(),
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`, // Mock transaction hash
    });

    // In production, this would trigger actual token transfer
    // await gttToken.transfer(address, ethers.parseEther('100'));

    res.json({
      success: true,
      message: "Airdrop claimed successfully",
      claim,
    });
  } catch (error) {
    console.error("Airdrop claim error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get airdrop status for an address
router.get("/api/airdrop/status", async (req, res) => {
  try {
    const { address } = req.query;

    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    const claim = await storage.getAirdropClaim(address as string);

    res.json({
      claimed: !!claim,
      amount: "100",
      claimDate: claim?.claimDate,
      eligible: true, // In production, implement actual eligibility logic
      eligibilityReason: claim ? "Already claimed" : "Early platform user",
    });
  } catch (error) {
    console.error("Airdrop status error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Referral code generation
router.post("/api/referral/generate", async (req, res) => {
  try {
    // In production, get user ID from authentication
    const userId = "demo-user"; // Mock user ID

    // Generate unique referral code
    const code = `GUARD${Math.random()
      .toString(36)
      .substr(2, 4)
      .toUpperCase()}`;

    const referral = await storage.createReferralCode({
      userId,
      code,
      createdAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      referral,
    });
  } catch (error) {
    console.error("Referral generation error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get referral data
router.get("/api/referral/data", async (req, res) => {
  try {
    // In production, get user ID from authentication
    const userId = "demo-user";

    const referralData = await storage.getReferralData(userId);

    if (!referralData) {
      return res.status(404).json({ message: "No referral data found" });
    }

    res.json(referralData);
  } catch (error) {
    console.error("Referral data error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Process referral reward
router.post("/api/referral/reward", async (req, res) => {
  try {
    const { referralCode, newUserAddress } = req.body;

    if (!referralCode || !newUserAddress) {
      return res
        .status(400)
        .json({ message: "Referral code and user address are required" });
    }

    // Find referral code
    const referral = await storage.getReferralByCode(referralCode);

    if (!referral) {
      return res.status(404).json({ message: "Invalid referral code" });
    }

    // Check if user already used a referral
    const existingReward = await storage.getReferralReward(newUserAddress);
    if (existingReward) {
      return res
        .status(400)
        .json({ message: "User has already been referred" });
    }

    // Create reward records
    const reward = await storage.createReferralReward({
      referralCode,
      referrerUserId: referral.userId,
      newUserAddress,
      referrerReward: "50", // 50 GTT for referrer
      refereeReward: "50", // 50 GTT for referee
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    // In production, this would trigger actual token transfers
    // await gttToken.transfer(referrerAddress, ethers.parseEther('50'));
    // await gttToken.transfer(newUserAddress, ethers.parseEther('50'));

    res.json({
      success: true,
      message: "Referral rewards processed",
      reward,
    });
  } catch (error) {
    console.error("Referral reward error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
