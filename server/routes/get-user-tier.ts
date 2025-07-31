import { Router, Request, Response } from "express";

const router = Router();

// Production-ready Replit Auth tier endpoint
router.get("/get-user-tier", async (req, res) => {
  try {
    const session = req.session as any;
    
    console.log('Session check:', {
      sessionExists: !!session,
      sessionUser: session?.user,
      sessionID: req.sessionID
    });
    
    // Check for Replit Auth headers in production
    const replitUserId = req.headers['x-replit-user-id'] as string;
    const replitUserName = req.headers['x-replit-user-name'] as string;
    
    // Check session authentication or Replit headers
    if (session?.user || replitUserId) {
      const user = session?.user || {
        id: replitUserId,
        username: replitUserName || 'User',
        tier: 'CREATOR'
      };
      
      console.log('Authenticated user found:', user);
      
      return res.status(200).json({
        tier: user.tier || "CREATOR",
        authenticated: true,
        userId: user.id,
        username: user.username,
        email: user.email,
        capabilities: {
          createCapsules: true,
          verifyContent: true,
          earnGTT: true,
          accessPremiumFeatures: user.tier !== 'EXPLORER'
        }
      });
    }

    // Unauthenticated: Return guest tier
    return res.status(401).json({
      tier: "guest",
      authenticated: false,
      message: "Authentication required",
      capabilities: {
        createCapsules: false,
        verifyContent: false,
        earnGTT: false,
        accessPremiumFeatures: false
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