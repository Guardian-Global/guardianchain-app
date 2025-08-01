import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupSimpleAuth, isSimpleAuthenticated } from "./simpleAuth";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware - Setup Simple Auth for development
  setupSimpleAuth(app);

  // Add subscription management routes
  app.get('/api/subscription/status', isSimpleAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const user = await storage.getUser(userId);
      res.json({
        tier: user?.tier || 'EXPLORER',
        usage: {
          capsulesCreated: 0,
          capsulesLimit: user?.tier === 'EXPLORER' ? 5 : user?.tier === 'SEEKER' ? 25 : 999
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subscription status" });
    }
  });

  app.post('/api/subscription/upgrade', isSimpleAuthenticated, async (req: any, res) => {
    try {
      const { planId } = req.body;
      const userId = req.user?.id;
      
      // For now, just simulate an upgrade
      await storage.updateUserTier(userId, planId.toUpperCase());
      
      res.json({ success: true, message: "Subscription upgraded successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to upgrade subscription" });
    }
  });

  // Simple Auth routes
  app.get('/api/auth/user', isSimpleAuthenticated, async (req: any, res) => {
    try {
      const sessionUser = req.user;
      const userId = sessionUser.id;
      
      let user = await storage.getUser(userId);
      
      // If user doesn't exist in DB, create from session
      if (!user) {
        await storage.upsertUser({
          id: sessionUser.id,
          email: sessionUser.email,
          firstName: sessionUser.firstName,
          lastName: sessionUser.lastName,
          tier: sessionUser.tier || 'EXPLORER'
        });
        user = await storage.getUser(userId);
      }
      
      res.json(user || sessionUser);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}