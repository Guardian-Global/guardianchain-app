import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupDebugAuth, isDebugAuthenticated } from "./debugAuth";
// import { storage } from "./storage"; // Disabled for debug auth

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware - Setup Debug Auth for immediate testing
  setupDebugAuth(app);

  // Add subscription management routes - bypass database
  app.get('/api/subscription/status', isDebugAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      const tier = user?.tier || 'EXPLORER';
      
      res.json({
        tier: tier,
        usage: {
          capsulesCreated: 0,
          capsulesLimit: tier === 'EXPLORER' ? 5 : tier === 'SEEKER' ? 25 : 999
        },
        subscription: null
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subscription status" });
    }
  });

  app.post('/api/subscription/upgrade', isDebugAuthenticated, async (req: any, res) => {
    try {
      const { planId } = req.body;
      
      // For development, just return success without database operations
      console.log('✅ DEBUG: Simulating subscription upgrade to:', planId);
      
      res.json({ 
        success: true, 
        message: "Subscription upgraded successfully",
        newTier: planId.toUpperCase()
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to upgrade subscription" });
    }
  });

  // Debug Auth routes - bypass database for now
  app.get('/api/auth/user', isDebugAuthenticated, async (req: any, res) => {
    try {
      const sessionUser = req.user;
      
      // For development, just return the session user directly
      // This bypasses the database schema issues
      const responseUser = {
        ...sessionUser,
        tier: sessionUser.tier || 'EXPLORER',
        usage: {
          capsulesCreated: 0,
          capsulesLimit: sessionUser.tier === 'EXPLORER' ? 5 : 25
        },
        subscription: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      console.log('✅ DEBUG: Returning user data:', responseUser);
      res.json(responseUser);
    } catch (error) {
      console.error("Error in auth endpoint:", error);
      // Even if there's an error, return the session user
      res.json(req.user);
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}