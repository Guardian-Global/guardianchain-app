import type { Express } from "express";
import { createServer, type Server } from "http";
import { claimYield } from "./api/claim-yield";
import { storage } from "./storage";
import { registerSealRoutes } from "./api/seal";
import { insertCapsuleSchema, insertVerificationSchema, insertTransactionSchema } from "@shared/schema";
import capsulesRouter from "./api/capsules";
import veritasRouter from "./api/veritas";
import mintRouter from "./api/mint";
import analyticsRouter from "./api/analytics";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register GuardianChain API routes
  app.use("/api/capsules", capsulesRouter);
  app.use("/api/veritas", veritasRouter);
  app.use("/api/mint", mintRouter);
  app.use("/api/analytics", analyticsRouter);
  
  // Register Veritas Seal routes
  registerSealRoutes(app);

  // Stats endpoint
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching stats: " + error.message });
    }
  });

  // User endpoints
  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching user: " + error.message });
    }
  });

  app.get("/api/users/auth0/:auth0Id", async (req, res) => {
    try {
      const auth0Id = req.params.auth0Id;
      const user = await storage.getUserByAuth0Id(auth0Id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching user: " + error.message });
    }
  });

  app.get("/api/users/wallet/:walletAddress", async (req, res) => {
    try {
      const walletAddress = req.params.walletAddress;
      const user = await storage.getUserByWalletAddress(walletAddress);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching user: " + error.message });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = req.body;
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(500).json({ message: "Error creating user: " + error.message });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const user = await storage.updateUser(id, updates);
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating user: " + error.message });
    }
  });

  app.get("/api/leaderboard", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const users = await storage.getTopUsers(limit);
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching leaderboard: " + error.message });
    }
  });

  // Capsule endpoints
  app.get("/api/capsules", async (req, res) => {
    try {
      const filters = {
        status: req.query.status as string,
        creatorId: req.query.creatorId ? parseInt(req.query.creatorId as string) : undefined,
        isPublic: req.query.isPublic ? req.query.isPublic === "true" : undefined,
        category: req.query.category as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
      };
      const capsules = await storage.getCapsules(filters);
      res.json(capsules);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching capsules: " + error.message });
    }
  });

  app.get("/api/capsules/featured", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 6;
      const capsules = await storage.getFeaturedCapsules(limit);
      res.json(capsules);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching featured capsules: " + error.message });
    }
  });

  app.get("/api/capsules/trending", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const capsules = await storage.getTrendingCapsules(limit);
      res.json(capsules);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching trending capsules: " + error.message });
    }
  });

  app.get("/api/capsules/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const capsule = await storage.getCapsule(id);
      if (!capsule) {
        return res.status(404).json({ message: "Capsule not found" });
      }
      res.json(capsule);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching capsule: " + error.message });
    }
  });

  app.post("/api/capsules", async (req, res) => {
    try {
      const validatedData = insertCapsuleSchema.parse(req.body);
      const capsule = await storage.createCapsule(validatedData);
      res.status(201).json(capsule);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating capsule: " + error.message });
    }
  });

  app.patch("/api/capsules/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const capsule = await storage.updateCapsule(id, updates);
      res.json(capsule);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating capsule: " + error.message });
    }
  });

  // Verification endpoints
  app.get("/api/capsules/:id/verifications", async (req, res) => {
    try {
      const capsuleId = parseInt(req.params.id);
      const verifications = await storage.getVerificationsByCapsule(capsuleId);
      res.json(verifications);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching verifications: " + error.message });
    }
  });

  app.post("/api/verifications", async (req, res) => {
    try {
      const validatedData = insertVerificationSchema.parse(req.body);
      const verification = await storage.createVerification(validatedData);
      res.status(201).json(verification);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating verification: " + error.message });
    }
  });

  // Transaction endpoints
  app.get("/api/users/:id/transactions", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const transactions = await storage.getTransactionsByUser(userId);
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching transactions: " + error.message });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating transaction: " + error.message });
    }
  });

  // Achievement endpoints
  app.get("/api/users/:id/achievements", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const achievements = await storage.getAchievementsByUser(userId);
      res.json(achievements);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching achievements: " + error.message });
    }
  });

  // Claim GTT yield for verified capsules
  app.post("/api/claim-yield", claimYield);

  // Private feed endpoints for friends-only content
  app.get("/api/capsules/private", async (req, res) => {
    try {
      const privateCapsules = [
        {
          id: 101,
          creator: 'Leila Chen',
          creatorId: 1,
          title: 'Private: Family Recipe Truth',
          content: 'This is the real story behind our family\'s secret recipe that was stolen by a major corporation...',
          griefScore: 87,
          isSealed: true,
          isPrivate: true,
          tags: ['family', 'corporate-theft', 'recipes'],
          createdAt: '2024-01-20T08:30:00Z',
          verificationStatus: 'verified',
          truthYield: '125.5',
          viewCount: 0,
          shareCount: 0,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=leila'
        },
        {
          id: 102,
          creator: 'Nuru Makena',
          creatorId: 2,
          title: 'Private: Whistleblower Evidence',
          content: 'Documented proof of environmental violations by mining company in Kenya. Sharing privately first...',
          griefScore: 94,
          isSealed: true,
          isPrivate: true,
          tags: ['environment', 'whistleblower', 'kenya'],
          createdAt: '2024-01-19T14:15:00Z',
          verificationStatus: 'pending',
          truthYield: '200.0',
          viewCount: 0,
          shareCount: 0,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nuru'
        }
      ];
      res.json(privateCapsules);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching private capsules: " + error.message });
    }
  });

  // Friend requests endpoint
  app.get("/api/friends/requests", async (req, res) => {
    try {
      const requests = {
        pending: 2,
        accepted: 3,
        total: 5
      };
      res.json(requests);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching friend requests: " + error.message });
    }
  });

  // Friend stats endpoint
  app.get("/api/friends/stats", async (req, res) => {
    try {
      const stats = {
        activeFriends: 3,
        pendingRequests: 2,
        privateCapsules: 2,
        totalConnections: 5
      };
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching friend stats: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
