import type { Request, Response } from "express";
import { storage } from "../storage";

// Get user profile by wallet address
export async function getUserProfile(req: Request, res: Response) {
  try {
    const { address } = req.params;
    
    if (!address) {
      return res.status(400).json({ error: "Wallet address required" });
    }

    const user = await storage.getUserByWallet(address);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        walletAddress: user.walletAddress,
        bio: user.bio,
        avatar: user.avatar,
        reputation: user.reputation,
        xpPoints: user.xpPoints,
        totalCapsules: user.totalCapsules,
        verifiedCapsules: user.verifiedCapsules,
        gttBalance: user.gttBalance,
        badges: user.badges,
        achievements: user.achievements,
        socialLinks: user.socialLinks,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ 
      error: "Failed to fetch user profile",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

// Get user achievements
export async function getUserAchievements(req: Request, res: Response) {
  try {
    const { address } = req.params;
    
    const user = await storage.getUserByWallet(address);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return achievements with enhanced formatting
    const achievements = (user.achievements as any[]) || [];
    const formattedAchievements = achievements.map(achievement => ({
      id: achievement.id,
      name: achievement.title || achievement.name,
      title: achievement.title,
      description: achievement.description,
      image: achievement.metadata?.imageUrl || `/api/badges/${achievement.id}.svg`,
      rarity: achievement.rarity || 'common',
      unlockedAt: achievement.unlockedAt || achievement.createdAt,
      metadata: achievement.metadata
    }));

    res.json({
      achievements: formattedAchievements,
      count: formattedAchievements.length
    });
  } catch (error) {
    console.error("Error fetching user achievements:", error);
    res.status(500).json({ error: "Failed to fetch achievements" });
  }
}

// Get user capsules
export async function getUserCapsules(req: Request, res: Response) {
  try {
    const { address } = req.params;
    
    const user = await storage.getUserByWallet(address);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const capsules = await storage.getCapsulesByCreator(user.id);
    
    const formattedCapsules = capsules.map(capsule => ({
      id: capsule.id,
      title: capsule.title,
      type: capsule.type,
      status: capsule.status,
      griefScore: capsule.griefScore,
      credibilityScore: capsule.credibilityScore,
      truthYield: capsule.truthYield,
      gttEarnings: parseFloat(capsule.truthYield?.toString() || "0") * 10, // Convert yield to GTT
      timestamp: capsule.createdAt,
      stats: {
        views: capsule.viewCount,
        shares: capsule.shareCount,
        votes: capsule.voteCount
      }
    }));

    res.json({
      capsules: formattedCapsules,
      count: formattedCapsules.length
    });
  } catch (error) {
    console.error("Error fetching user capsules:", error);
    res.status(500).json({ error: "Failed to fetch capsules" });
  }
}

// Get user transactions
export async function getUserTransactions(req: Request, res: Response) {
  try {
    const { address } = req.params;
    
    const user = await storage.getUserByWallet(address);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const transactions = await storage.getTransactionsByUser(user.id);
    
    res.json({
      transactions: transactions || [],
      count: transactions?.length || 0
    });
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
}

// Get user XP history
export async function getUserXPHistory(req: Request, res: Response) {
  try {
    const { address } = req.params;
    
    const user = await storage.getUserByWallet(address);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate XP history data based on user's current XP
    const currentXP = user.xpPoints || 0;
    const days = 30;
    const xpHistory = [];
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Simulate gradual XP growth
      const dayProgress = (days - i) / days;
      const xp = Math.floor(currentXP * dayProgress);
      const reputation = Math.floor(xp * 0.5);
      const capsules = Math.floor(xp / 100);
      
      xpHistory.push({
        date: date.toISOString().split('T')[0],
        day: i === 0 ? 'Today' : `Day ${days - i}`,
        xp,
        XP: xp, // For compatibility
        reputation,
        capsules
      });
    }

    res.json({
      xpHistory,
      currentXP,
      currentLevel: Math.floor(currentXP / 1000) + 1
    });
  } catch (error) {
    console.error("Error fetching user XP history:", error);
    res.status(500).json({ error: "Failed to fetch XP history" });
  }
}