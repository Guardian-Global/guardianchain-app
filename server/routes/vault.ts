import express from "express";
import { consolidatedAuth } from "../auth/authConsolidation";

export const vaultRoutes = express.Router();

// Get vault capsules for authenticated user
vaultRoutes.get("/capsules", consolidatedAuth, async (req, res) => {
  try {
    // Mock data for now - replace with actual database queries
    const mockCapsules = [
      {
        id: "vault_001",
        title: "Classified Research Findings 2025",
        creator: "Dr. ResearchGuardian",
        createdAt: "2025-08-01T00:00:00Z",
        isLocked: true,
        isTimeSealed: true,
        unlockDate: "2025-12-31T23:59:59Z",
        truthScore: 96,
        gttValue: 150,
        category: "research",
        content: "Time-sealed research data...",
        tags: ["research", "classified", "2025"],
        isVerified: true,
        mediaAttachments: [],
        viewCount: 0
      },
      {
        id: "vault_002",
        title: "Personal Memory Capsule - Summer 2025",
        creator: "MemoryKeeper",
        createdAt: "2025-07-15T00:00:00Z",
        isLocked: false,
        isTimeSealed: false,
        truthScore: 88,
        gttValue: 75,
        category: "personal",
        content: "Summer memories and experiences...",
        tags: ["personal", "memories", "summer"],
        isVerified: false,
        mediaAttachments: ["image1.jpg", "video1.mp4"],
        viewCount: 23
      },
      {
        id: "vault_003",
        title: "Corporate Whistleblower Evidence",
        creator: "TruthSeeker2025",
        createdAt: "2025-06-20T00:00:00Z",
        isLocked: true,
        isTimeSealed: false,
        truthScore: 94,
        gttValue: 500,
        category: "evidence",
        content: "Confidential corporate evidence...",
        tags: ["whistleblower", "corporate", "evidence"],
        isVerified: true,
        mediaAttachments: ["document1.pdf", "audio1.mp3"],
        viewCount: 156
      }
    ];

    res.json(mockCapsules);
  } catch (error) {
    console.error("Error fetching vault capsules:", error);
    res.status(500).json({ error: "Failed to fetch vault capsules" });
  }
});

// Get unlock trend data
vaultRoutes.get("/unlock-trend", consolidatedAuth, async (req, res) => {
  try {
    // Mock trend data
    const mockTrendData = [
      { day: "2025-07-29", unlocks: 12, isSpike: false },
      { day: "2025-07-30", unlocks: 8, isSpike: false },
      { day: "2025-07-31", unlocks: 15, isSpike: false },
      { day: "2025-08-01", unlocks: 23, isSpike: true },
      { day: "2025-08-02", unlocks: 18, isSpike: false },
      { day: "2025-08-03", unlocks: 27, isSpike: true },
      { day: "2025-08-04", unlocks: 19, isSpike: false }
    ];

    res.json(mockTrendData);
  } catch (error) {
    console.error("Error fetching unlock trend:", error);
    res.status(500).json({ error: "Failed to fetch unlock trend data" });
  }
});

// Get user's GTT balance
vaultRoutes.get("/gtt-balance", consolidatedAuth, async (req, res) => {
  try {
    // Mock balance data
    const mockBalance = {
      amount: 1247.56,
      staked: 500.00,
      available: 747.56,
      pending: 0.00
    };

    res.json(mockBalance);
  } catch (error) {
    console.error("Error fetching GTT balance:", error);
    res.status(500).json({ error: "Failed to fetch GTT balance" });
  }
});

export default vaultRoutes;