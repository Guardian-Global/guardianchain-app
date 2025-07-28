import { Router } from "express";
import { storage } from "../storage";

const router = Router();

// Get vault statistics
router.get("/api/vault/stats", async (req, res) => {
  try {
    const stats = await storage.getVaultStats();

    res.json(stats);
  } catch (error) {
    console.error("Vault stats error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user's vault position
router.get("/api/vault/position/:address", async (req, res) => {
  try {
    const { address } = req.params;

    const position = await storage.getUserVaultPosition(address);

    res.json(position);
  } catch (error) {
    console.error("Vault position error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Deposit to vault
router.post("/api/vault/deposit", async (req, res) => {
  try {
    const { address, amount } = req.body;

    if (!address || !amount) {
      return res
        .status(400)
        .json({ message: "Address and amount are required" });
    }

    // In production, this would interact with AutoCompoundVault contract
    // const tx = await vaultContract.deposit(ethers.parseEther(amount));

    // Record deposit in database
    const deposit = await storage.recordVaultDeposit({
      userAddress: address,
      amount,
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`, // Mock tx hash
      timestamp: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: "Deposit successful",
      deposit,
    });
  } catch (error) {
    console.error("Vault deposit error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Withdraw from vault
router.post("/api/vault/withdraw", async (req, res) => {
  try {
    const { address, shares } = req.body;

    if (!address || !shares) {
      return res
        .status(400)
        .json({ message: "Address and shares are required" });
    }

    // In production, this would interact with AutoCompoundVault contract
    // const tx = await vaultContract.withdraw(ethers.parseEther(shares));

    // Record withdrawal in database
    const withdrawal = await storage.recordVaultWithdrawal({
      userAddress: address,
      shares,
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`, // Mock tx hash
      timestamp: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: "Withdrawal successful",
      withdrawal,
    });
  } catch (error) {
    console.error("Vault withdrawal error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Trigger manual compound
router.post("/api/vault/compound", async (req, res) => {
  try {
    // In production, this would call the compound() function on the vault contract
    // const tx = await vaultContract.compound();

    const compound = await storage.recordVaultCompound({
      rewards: (Math.random() * 1000 + 500).toFixed(2), // Mock rewards
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      timestamp: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: "Compound triggered successfully",
      compound,
    });
  } catch (error) {
    console.error("Vault compound error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get vault APY with Guardian Pass bonuses
router.get("/api/vault/apy/:address", async (req, res) => {
  try {
    const { address } = req.params;

    const baseAPY = 25.0; // 25% base APY

    // Check for Guardian Pass bonuses
    const passBonus = await storage.getGuardianPassAPYBonus(address);

    const totalAPY = baseAPY + passBonus / 100;

    res.json({
      baseAPY,
      passBonus: passBonus / 100,
      totalAPY,
      hasGuardianPass: passBonus > 0,
    });
  } catch (error) {
    console.error("Vault APY error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
