import { Router } from "express";

const router = Router();

// Production-ready Replit Auth tier endpoint
router.get("/get-user-tier", async (req, res) => {
  try {
    // For production deployment with Replit Auth
    const replitUserId = req.headers['x-replit-user-id'] as string;
    
    if (!replitUserId) {
      return res.json({ tier: "guest", authenticated: false });
    }

    // In production, this would query Replit DB:
    // const tier = await replitDb.get(`user_tier_${replitUserId}`) || "explorer";
    
    // For development, use localStorage simulation
    const tier = "explorer"; // Default for authenticated users
    
    return res.json({
      tier,
      authenticated: true,
      userId: replitUserId,
      features: {
        canCreateCapsules: true,
        canVerify: true,
        canEarnGTT: true,
        maxCapsules: tier === "pro" ? 100 : 10,
        gttMultiplier: tier === "pro" ? 2 : 1
      }
    });
    
  } catch (error) {
    console.error("Error fetching user tier:", error);
    return res.status(500).json({ 
      tier: "guest", 
      authenticated: false, 
      error: "Failed to fetch user tier" 
    });
  }
});

export default router;