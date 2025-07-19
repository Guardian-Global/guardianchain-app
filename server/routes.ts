import type { Express } from "express";
import { createServer, type Server } from "http";
import authRoutes from "./routes/auth";
import premiumRoutes from "./routes/premium";
import { registerTierRoutes } from "./routes/tiers";
import { registerStripeWebhook } from "./routes/stripe-webhook";
import { uploadToIPFS, uploadJSONToIPFS } from "./api/ipfs-upload";
import { claimYield } from "./api/claim-yield";
import { storage } from "./storage";
import { registerSealRoutes } from "./api/seal";
import { registerMintRoutes } from "./api/mint";
import { insertCapsuleSchema, insertUserSchema, insertCapsuleInteractionSchema } from "@shared/schema";
import capsulesRouter from "./api/capsules";
import veritasRouter from "./api/veritas";
import analyticsRouter from "./api/analytics";
import { 
  generateCapsuleRecommendations,
  analyzeCapsuleContent,
  generateUserInterestProfile,
  type CapsuleData,
  type UserProfile
} from "./lib/aiRecommendations";
import { getCapsuleAnalytics, getAllCapsulesAnalytics } from "./routes/capsule-analytics";
import openaiRoutes from "./routes/openai";
import enterpriseAuthRoutes from "./routes/enterprise-auth";
import aiAssistantRoutes from "./routes/ai-assistant";

export async function registerRoutes(app: Express): Promise<Server> {
  // Enhanced authentication and premium routes
  app.use('/api/auth', authRoutes);
  app.use('/api/premium', premiumRoutes);
  // Register Stripe webhook handler
  registerStripeWebhook(app);
  // Register GuardianChain API routes
  app.use("/api/capsules", capsulesRouter);
  app.use("/api/veritas", veritasRouter);
  app.use("/api/analytics", analyticsRouter);
  app.use("/api", openaiRoutes);
  app.use("/api/auth", enterpriseAuthRoutes);
  app.use("/api/auth", aiAssistantRoutes);
  
  // Capsule Analytics Routes
  app.get("/api/capsule/:capsuleId/analytics", getCapsuleAnalytics);
  app.get("/api/capsules/analytics/summary", getAllCapsulesAnalytics);
  
  // Register Veritas Seal routes
  registerSealRoutes(app);
  
  // Register GTT Mint routes
  registerMintRoutes(app);

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

  // Protocol stats for dashboard
  app.get("/api/protocol/stats", async (req, res) => {
    try {
      const stats = {
        totalCapsules: 24,
        sealedCapsules: 15,
        activeUsers: 89,
        totalGTT: 125000,
        circulatingGTT: 98750,
        vaultGTT: 26250,
        newCapsulesToday: 3,
        sealRate: 62,
        newUsersToday: 12,
        gttMintedToday: 45
      };
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching protocol stats: " + error.message });
    }
  });

  // DAO stats for commander
  app.get("/api/dao/stats", async (req, res) => {
    try {
      const stats = {
        activeProposals: 3,
        totalVoters: 67,
        topVoter: "0xB8c...E19",
        treasuryBalance: "2,450"
      };
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching DAO stats: " + error.message });
    }
  });

  // System health for commander
  app.get("/api/system/health", async (req, res) => {
    try {
      const health = {
        memoryUsage: "45%",
        apiStatus: "online",
        databaseStatus: "healthy",
        ipfsStatus: "connected",
        docusignStatus: "active",
        blockchainStatus: "synced"
      };
      res.json(health);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching system health: " + error.message });
    }
  });

  // Moderation queue for dashboard
  app.get("/api/moderation/queue", async (req, res) => {
    try {
      const queue = {
        pending: 5,
        flagged: 2,
        approved: 18
      };
      res.json(queue);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching moderation queue: " + error.message });
    }
  });

  // System sync operation
  app.post("/api/system/sync-index", async (req, res) => {
    try {
      // Simulate index sync
      await new Promise(resolve => setTimeout(resolve, 2000));
      res.json({ success: true, message: "Index synchronized successfully" });
    } catch (error: any) {
      res.status(500).json({ message: "Error syncing index: " + error.message });
    }
  });

  // AI Recommendations endpoints
  app.get("/api/recommendations", async (req, res) => {
    try {
      // Mock user profile for now - in production this would come from auth/database
      const userProfile: UserProfile = {
        id: "user123",
        interests: ["technology", "blockchain", "truth verification"],
        viewHistory: [1, 2, 3],
        verificationHistory: [1],
        preferredCategories: ["Technology", "Science"]
      };

      // Get available capsules from storage
      const allCapsules = await storage.getCapsules();
      
      // Convert to AI format
      const capsuleData: CapsuleData[] = allCapsules.map(capsule => ({
        id: capsule.id,
        title: capsule.title,
        content: capsule.content,
        category: capsule.category || 'Uncategorized',
        tags: capsule.tags || [],
        verificationScore: capsule.verificationScore || 0,
        engagement: {
          views: capsule.views || 0,
          shares: capsule.shares || 0,
          verifications: capsule.verifications || 0
        },
        createdAt: capsule.createdAt
      }));

      const recommendations = await generateCapsuleRecommendations(userProfile, capsuleData);
      
      // Enhance recommendations with full capsule data
      const enhancedRecommendations = recommendations.map(rec => ({
        ...rec,
        capsule: allCapsules.find(c => c.id === rec.capsuleId)
      }));

      res.json(enhancedRecommendations);
    } catch (error: any) {
      console.error('Recommendations error:', error);
      res.status(500).json({ message: "Error generating recommendations: " + error.message });
    }
  });

  app.get("/api/user-profile", async (req, res) => {
    try {
      // Mock view/verification history - in production get from database
      const viewHistory = await storage.getCapsules();
      const verificationHistory = viewHistory.slice(0, 2); // Mock some verified content
      
      const capsuleData: CapsuleData[] = viewHistory.map(capsule => ({
        id: capsule.id,
        title: capsule.title,
        content: capsule.content,
        category: capsule.category || 'Uncategorized',
        tags: capsule.tags || [],
        verificationScore: capsule.verificationScore || 0,
        engagement: {
          views: capsule.views || 0,
          shares: capsule.shares || 0,
          verifications: capsule.verifications || 0
        },
        createdAt: capsule.createdAt
      }));

      const profile = await generateUserInterestProfile(
        capsuleData,
        capsuleData.slice(0, 2) // Mock verification history
      );

      res.json(profile);
    } catch (error: any) {
      console.error('Profile analysis error:', error);
      res.status(500).json({ message: "Error analyzing profile: " + error.message });
    }
  });

  app.post("/api/analyze-capsule", async (req, res) => {
    try {
      const { capsuleId } = req.body;
      if (!capsuleId) {
        return res.status(400).json({ message: "Capsule ID required" });
      }

      const capsule = await storage.getCapsule(capsuleId);
      if (!capsule) {
        return res.status(404).json({ message: "Capsule not found" });
      }

      const capsuleData: CapsuleData = {
        id: capsule.id,
        title: capsule.title,
        content: capsule.content,
        category: capsule.category || 'Uncategorized',
        tags: capsule.tags || [],
        verificationScore: capsule.verificationScore || 0,
        engagement: {
          views: capsule.views || 0,
          shares: capsule.shares || 0,
          verifications: capsule.verifications || 0
        },
        createdAt: capsule.createdAt
      };

      const analysis = await analyzeCapsuleContent(capsuleData);
      res.json(analysis);
    } catch (error: any) {
      console.error('Content analysis error:', error);
      res.status(500).json({ message: "Error analyzing content: " + error.message });
    }
  });

  // IPFS upload endpoints
  app.post("/api/ipfs/upload", uploadToIPFS);
  app.post("/api/ipfs/upload-json", uploadJSONToIPFS);

  // Capsule type endpoints
  app.get("/api/capsule-types", async (req, res) => {
    try {
      const { getCapsuleTypes } = await import("./api/capsule-types");
      await getCapsuleTypes(req, res);
    } catch (error) {
      res.status(500).json({ error: "Failed to load capsule types" });
    }
  });

  app.post("/api/capsule-types/validate", async (req, res) => {
    try {
      const { validateCapsuleType } = await import("./api/capsule-types");
      await validateCapsuleType(req, res);
    } catch (error) {
      res.status(500).json({ error: "Validation failed" });
    }
  });

  // User API endpoints
  app.get("/api/users/:address", async (req, res) => {
    try {
      const { getUserProfile } = await import("./api/users");
      await getUserProfile(req, res);
    } catch (error) {
      res.status(500).json({ error: "Failed to load user profile" });
    }
  });

  app.get("/api/users/:address/achievements", async (req, res) => {
    try {
      const { getUserAchievements } = await import("./api/users");
      await getUserAchievements(req, res);
    } catch (error) {
      res.status(500).json({ error: "Failed to load user achievements" });
    }
  });

  app.get("/api/users/:address/capsules", async (req, res) => {
    try {
      const { getUserCapsules } = await import("./api/users");
      await getUserCapsules(req, res);
    } catch (error) {
      res.status(500).json({ error: "Failed to load user capsules" });
    }
  });

  app.get("/api/users/:address/transactions", async (req, res) => {
    try {
      const { getUserTransactions } = await import("./api/users");
      await getUserTransactions(req, res);
    } catch (error) {
      res.status(500).json({ error: "Failed to load user transactions" });
    }
  });

  app.get("/api/users/:address/xp-history", async (req, res) => {
    try {
      const { getUserXPHistory } = await import("./api/users");
      await getUserXPHistory(req, res);
    } catch (error) {
      res.status(500).json({ error: "Failed to load user XP history" });
    }
  });

  // GUARDIANCHAIN brand enforcement endpoint
  app.get("/api/brand/info", (req, res) => {
    res.json({
      name: "GUARDIANCHAIN",
      format: "ALL_CAPS_NO_SPACE",
      colors: {
        GUARDIAN: "#7F5AF0",
        CHAIN: "#2CB67D"
      },
      enforced: true,
      protocol_version: "1.0.0"
    });
  });

  // Register tier management routes
  registerTierRoutes(app);

  // Asset Integration Routes
  app.post("/api/assets/process", async (req, res) => {
    try {
      const { userId, selectedAssetIds } = req.body;
      
      if (!userId || !selectedAssetIds || !Array.isArray(selectedAssetIds)) {
        return res.status(400).json({ 
          message: "Missing required parameters: userId and selectedAssetIds array" 
        });
      }

      const { processAssetsForUser } = await import("./lib/supabase-server");
      const result = await processAssetsForUser(userId, selectedAssetIds);
      
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ 
        message: "Error processing assets: " + error.message,
        error: error.toString()
      });
    }
  });

  app.get("/api/assets/status", async (req, res) => {
    try {
      const hasSupabaseUrl = !!(process.env.NEXT_PUBLIC_SUPABASE_URL);
      const hasServiceKey = !!(process.env.SUPABASE_SERVICE_ROLE_KEY);
      
      res.json({
        configured: hasSupabaseUrl && hasServiceKey,
        supabase_url: hasSupabaseUrl,
        service_key: hasServiceKey,
        message: (hasSupabaseUrl && hasServiceKey) 
          ? "Supabase fully configured" 
          : "Supabase configuration incomplete"
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error checking status: " + error.message });
    }
  });

  // AI service endpoints
  app.post("/api/ai/accounting-analysis", async (req, res) => {
    try {
      const { accountingAnalysis } = await import("./api/ai");
      await accountingAnalysis(req, res);
    } catch (error) {
      res.status(500).json({ error: "AI service error" });
    }
  });

  app.post("/api/ai/financial-insights", async (req, res) => {
    try {
      const { financialInsights } = await import("./api/ai");
      await financialInsights(req, res);
    } catch (error) {
      res.status(500).json({ error: "AI service error" });
    }
  });

  // Compliance endpoints
  app.get("/api/compliance/status", async (req, res) => {
    try {
      const { getComplianceStatus } = await import("./api/compliance");
      await getComplianceStatus(req, res);
    } catch (error) {
      res.status(500).json({ error: "Compliance service error" });
    }
  });

  app.get("/api/compliance/alerts", async (req, res) => {
    try {
      const { getComplianceAlerts } = await import("./api/compliance");
      await getComplianceAlerts(req, res);
    } catch (error) {
      res.status(500).json({ error: "Compliance service error" });
    }
  });

  app.post("/api/compliance/regional", async (req, res) => {
    try {
      const { checkRegionalCompliance } = await import("./api/compliance");
      await checkRegionalCompliance(req, res);
    } catch (error) {
      res.status(500).json({ error: "Compliance service error" });
    }
  });

  // Notification endpoints
  app.get("/api/notifications", async (req, res) => {
    try {
      const { getNotifications } = await import("./api/notifications");
      await getNotifications(req, res);
    } catch (error) {
      res.status(500).json({ error: "Notification service error" });
    }
  });

  app.post("/api/notifications/:id/read", async (req, res) => {
    try {
      const { markNotificationRead } = await import("./api/notifications");
      await markNotificationRead(req, res);
    } catch (error) {
      res.status(500).json({ error: "Notification service error" });
    }
  });

  app.get("/api/system/alerts", async (req, res) => {
    try {
      const { getSystemAlerts } = await import("./api/notifications");
      await getSystemAlerts(req, res);
    } catch (error) {
      res.status(500).json({ error: "System alerts service error" });
    }
  });

  // AI Advisor endpoint
  app.post("/api/ai/advisor", async (req, res) => {
    try {
      const { financialAdvisor } = await import("./api/ai");
      await financialAdvisor(req, res);
    } catch (error) {
      res.status(500).json({ error: "AI advisor service error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
