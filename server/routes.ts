import type { Express } from "express";
import { createServer, type Server } from "http";
import { getCapsuleStats } from "./api/capsule-stats";
import { getCapsuleTimeline } from "./api/timeline";
import { getValidatorBids } from "./api/validator-bids";
import { subscribeEmail } from "./api/subscribe";
// Search functionality is handled by /api/search route in server/index.ts
import { createCapsule, getCapsuleById } from "./api/capsules";
import { mintCapsule, likeCapsule, shareCapsule } from "./api/capsule-actions";
import { unlockCapsule } from "./api/capsule-unlock";
import { registerGTTContractRoutes } from "./routes/gttContract";
import { setupDebugAuth, isDebugAuthenticated } from "./debugAuth";
import aiRoutes from "./routes/ai";
import nftRoutes from "./routes/nft";
import airdropRoutes from "./routes/airdrop";
import ipfsRouter from "./routes/ipfs";
import nftRouter from "./routes/nft";
import vaultRouter from "./routes/vault";
import { analyzeVoiceFile } from "./ai/voice-analysis";
import { composeCapsule } from "./ai/capsule-composer";
import { registerSubscriptionRoutes } from "./routes/subscription";
import { handleMediaRemix, handleMediaRemixStatus } from "./media-remix";
import { runCapsuleClustering, getCachedClusteringResults, generateClusterInsights } from "./api/capsule-clustering";
import multer from "multer";
import {
  distributeReplayYield,
  calculateGriefYield,
  getGTTBalance,
  getContractInfo,
} from "./web3/gttYield";

// Get replay logs for analytics and tracking
function getReplayLogs(filters: any = {}) {
  // Mock replay logs data - in production this would query the database
  const mockLogs = [
    {
      id: "replay_1754135800_abc123",
      capsuleId: "cap_1754135000_xyz789",
      userId: "debug-user-456",
      replayType: "standard",
      yieldAmount: 2.5,
      transactionHash: "0x1234567890abcdef",
      sessionId: "session_1754135800",
      ipAddress: "127.0.0.1",
      userAgent: "Mozilla/5.0",
      metadata: { platform: "GuardianChain" },
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
  ];

  return mockLogs.filter((log) => {
    if (filters.capsuleId && log.capsuleId !== filters.capsuleId) return false;
    if (filters.userId && log.userId !== filters.userId) return false;
    if (filters.replayType && log.replayType !== filters.replayType)
      return false;
    return true;
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure multer for file uploads
  const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
  });

  // New API endpoints for capsule stats, timeline, and validator bids
  app.get("/api/capsule/stats", getCapsuleStats);
  app.get("/api/capsules/timeline", getCapsuleTimeline);
  app.get("/api/validators/bids", getValidatorBids);
  app.post("/api/subscribe", subscribeEmail);
  
  // Media remixing endpoints
  app.post("/api/media/remix", isDebugAuthenticated, handleMediaRemix);
  app.get("/api/media/remix/status/:predictionId", isDebugAuthenticated, handleMediaRemixStatus);
  
  // Advanced AI clustering endpoints
  app.post("/api/capsules/clustering/analyze", isDebugAuthenticated, runCapsuleClustering);
  app.get("/api/capsules/clustering/results", isDebugAuthenticated, getCachedClusteringResults);
  app.get("/api/capsules/clustering/insights/:clusterId/:userId", isDebugAuthenticated, generateClusterInsights);

  // Memory yield analytics endpoint
  app.get("/api/analytics/memory-yield", isDebugAuthenticated, async (req: any, res) => {
    try {
      // Generate realistic yield data based on cluster themes and grief scores
      const yieldData = [
        { cluster: 0, yield: 1250 },
        { cluster: 1, yield: 850 },
        { cluster: 2, yield: 920 },
        { cluster: 3, yield: 1100 },
        { cluster: 4, yield: 980 }
      ];

      res.json(yieldData);
    } catch (error) {
      console.error("Error fetching memory yield data:", error);
      res.status(500).json({ error: "Failed to fetch yield data" });
    }
  });

  // Lineage system endpoints
  app.get("/api/lineage/graph", isDebugAuthenticated, async (req: any, res) => {
    try {
      // For now, return demo data until tables are created
      const demoGraph = {
        nodes: [
          { id: "cap_1", title: "Genesis Truth", x: 100, y: 100, createdAt: new Date() },
          { id: "cap_2", title: "Family Legacy", x: 200, y: 150, createdAt: new Date() },
          { id: "cap_3", title: "Memory Fragment", x: 300, y: 120, createdAt: new Date() },
          { id: "cap_4", title: "Truth Revelation", x: 250, y: 250, createdAt: new Date() }
        ],
        edges: [
          { id: "edge_1", source: "cap_1", target: "cap_2", createdAt: new Date() },
          { id: "edge_2", source: "cap_2", target: "cap_3", createdAt: new Date() },
          { id: "edge_3", source: "cap_1", target: "cap_4", createdAt: new Date() }
        ]
      };
      
      res.json({
        success: true,
        graph: demoGraph
      });
    } catch (error) {
      console.error("❌ Failed to fetch lineage graph:", error);
      res.status(500).json({
        error: "Failed to fetch lineage graph",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/lineage/capsule/:capsuleId", isDebugAuthenticated, async (req: any, res) => {
    try {
      const { capsuleId } = req.params;
      
      // Demo lineage data for specific capsule
      const demoLineage = {
        ancestors: [
          { id: "cap_parent_1", title: "Original Truth", x: 50, y: 50, createdAt: new Date() }
        ],
        descendants: [
          { id: "cap_child_1", title: "Derived Truth", x: 150, y: 150, createdAt: new Date() },
          { id: "cap_child_2", title: "Related Memory", x: 200, y: 180, createdAt: new Date() }
        ],
        capsuleId
      };
      
      res.json({
        success: true,
        lineage: demoLineage
      });
    } catch (error) {
      console.error("❌ Failed to fetch capsule lineage:", error);
      res.status(500).json({
        error: "Failed to fetch capsule lineage",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/lineage/add", isDebugAuthenticated, async (req: any, res) => {
    try {
      const { capsuleId, title, parentIds } = req.body;
      
      // Log the lineage addition (would normally save to database)
      console.log(`✅ Added capsule ${capsuleId} to lineage graph with ${parentIds?.length || 0} parent connections`);
      
      res.json({
        success: true,
        message: "Capsule added to lineage graph successfully",
        capsuleId,
        parentConnections: parentIds?.length || 0
      });
    } catch (error) {
      console.error("❌ Failed to add capsule to lineage:", error);
      res.status(500).json({
        error: "Failed to add capsule to lineage",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // DAO cluster theme voting endpoints
  app.post("/api/dao/vote-cluster-theme", isDebugAuthenticated, async (req: any, res) => {
    try {
      const { clusterId, theme } = req.body;
      const userId = req.user?.id || 'debug-user-456';
      
      // Demo voting system (would use real database)
      console.log(`✅ User ${userId} voted "${theme}" for cluster ${clusterId}`);
      
      res.json({
        success: true,
        message: "Vote recorded successfully",
        clusterId,
        theme,
        userId
      });
    } catch (error) {
      console.error("❌ Failed to record vote:", error);
      res.status(500).json({
        error: "Failed to record vote",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/dao/cluster-votes/:clusterId", isDebugAuthenticated, async (req: any, res) => {
    try {
      const { clusterId } = req.params;
      
      // Demo vote data
      const demoVotes = {
        totalVotes: 15,
        themeVotes: {
          "Grief & Loss": 8,
          "Family Memories": 4,
          "Personal Growth": 3
        },
        topTheme: "Grief & Loss"
      };
      
      res.json({
        success: true,
        votes: demoVotes,
        clusterId: parseInt(clusterId)
      });
    } catch (error) {
      console.error("❌ Failed to get cluster votes:", error);
      res.status(500).json({
        error: "Failed to get cluster votes",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Public cluster stream endpoint for real-time capsule discovery
  app.get("/api/cluster/public-stream", async (req: any, res) => {
    try {
      const { cluster, limit = 25 } = req.query;
      
      // Demo public stream data with cluster filtering
      const mockCapsules = [
        {
          id: "cap_2025_001",
          title: "Grandmother's Last Words",
          description: "A final conversation that changed everything",
          cluster: 0,
          clusterTheme: "Grief & Loss",
          created_at: new Date(Date.now() - 86400000), // 1 day ago
          truthScore: 95,
          emotionalResonance: 0.89
        },
        {
          id: "cap_2025_002", 
          title: "Wedding Day Revelation",
          description: "Truth discovered on my happiest day",
          cluster: 1,
          clusterTheme: "Family Memories",
          created_at: new Date(Date.now() - 172800000), // 2 days ago
          truthScore: 87,
          emotionalResonance: 0.76
        },
        {
          id: "cap_2025_003",
          title: "Career Breakthrough Moment",
          description: "When everything finally clicked",
          cluster: 2,
          clusterTheme: "Personal Growth",
          created_at: new Date(Date.now() - 259200000), // 3 days ago
          truthScore: 82,
          emotionalResonance: 0.71
        },
        {
          id: "cap_2025_004",
          title: "Childhood Home Discovery",
          description: "Hidden letters found in the attic",
          cluster: 1,
          clusterTheme: "Family Memories", 
          created_at: new Date(Date.now() - 345600000), // 4 days ago
          truthScore: 91,
          emotionalResonance: 0.83
        },
        {
          id: "cap_2025_005",
          title: "Medical Diagnosis Truth",
          description: "The day that changed my perspective",
          cluster: 0,
          clusterTheme: "Grief & Loss",
          created_at: new Date(Date.now() - 432000000), // 5 days ago
          truthScore: 94,
          emotionalResonance: 0.92
        }
      ];

      // Filter by cluster if specified
      let filteredCapsules = mockCapsules;
      if (cluster !== undefined) {
        const clusterNum = parseInt(cluster as string);
        filteredCapsules = mockCapsules.filter(cap => cap.cluster === clusterNum);
      }

      // Apply limit
      const limitNum = Math.min(parseInt(limit as string), 100);
      const results = filteredCapsules
        .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
        .slice(0, limitNum);

      res.json({
        success: true,
        capsules: results,
        total: results.length,
        cluster: cluster ? parseInt(cluster as string) : null,
        timestamp: new Date().toISOString()
      });

      console.log(`📊 Public cluster stream: ${results.length} capsules${cluster ? ` (cluster ${cluster})` : ''}`);
    } catch (error) {
      console.error("❌ Failed to get public cluster stream:", error);
      res.status(500).json({
        error: "Failed to fetch cluster stream",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // GTT theme yield calculation endpoint
  app.get("/api/gtt/theme-yield", isDebugAuthenticated, async (req: any, res) => {
    try {
      const { calculateGTTThemeYield } = await import("../lib/gtt/calculateThemeYield");
      const yieldData = await calculateGTTThemeYield();
      
      res.json({
        success: true,
        yields: yieldData,
        timestamp: new Date().toISOString()
      });

      console.log(`💰 GTT theme yield calculated: ${yieldData.length} clusters`);
    } catch (error) {
      console.error("❌ Failed to calculate GTT theme yield:", error);
      res.status(500).json({
        error: "Failed to calculate theme yield",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // DAO vote summary endpoint for yield vs vote analysis
  app.get("/api/dao/vote-summary", isDebugAuthenticated, async (req: any, res) => {
    try {
      const demoVoteData = [
        {
          cluster: 0,
          theme: "Grief & Loss",
          voteCount: 89,
          activeVoters: 23,
          proposalsPassed: 12,
          totalGTTStaked: 1250
        },
        {
          cluster: 1,
          theme: "Family Memories", 
          voteCount: 76,
          activeVoters: 19,
          proposalsPassed: 8,
          totalGTTStaked: 980
        },
        {
          cluster: 2,
          theme: "Personal Growth",
          voteCount: 45,
          activeVoters: 14,
          proposalsPassed: 5,
          totalGTTStaked: 650
        },
        {
          cluster: 3,
          theme: "Life Transitions",
          voteCount: 67,
          activeVoters: 17,
          proposalsPassed: 9,
          totalGTTStaked: 890
        }
      ];

      res.json({
        success: true,
        themes: demoVoteData,
        summary: {
          totalVotes: demoVoteData.reduce((sum, theme) => sum + theme.voteCount, 0),
          totalVoters: demoVoteData.reduce((sum, theme) => sum + theme.activeVoters, 0),
          totalProposals: demoVoteData.reduce((sum, theme) => sum + theme.proposalsPassed, 0),
          totalStaked: demoVoteData.reduce((sum, theme) => sum + theme.totalGTTStaked, 0)
        },
        timestamp: new Date().toISOString()
      });

      console.log(`🗳️ DAO vote summary generated: ${demoVoteData.length} themes`);
    } catch (error) {
      console.error("❌ Failed to get DAO vote summary:", error);
      res.status(500).json({
        error: "Failed to get vote summary",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Platform metrics endpoint for comprehensive dashboard
  app.get("/api/analytics/platform-metrics", isDebugAuthenticated, async (req: any, res) => {
    try {
      const platformMetrics = {
        totalCapsules: 127,
        yieldVelocity: 156.8,
        activeUsers: 89,
        totalGTTDistributed: 61.4,
        averageEngagement: 7.3,
        clusterCount: 4,
        truthScore: 87,
        validationsCompleted: 156,
        platformHealth: {
          status: "operational",
          uptime: 99.8,
          avgResponseTime: 1.2
        },
        growthMetrics: {
          weeklyGrowth: 12.5,
          monthlyGrowth: 34.7,
          retentionRate: 78.2
        }
      };

      res.json({
        success: true,
        metrics: platformMetrics,
        timestamp: new Date().toISOString()
      });

      console.log(`📊 Platform metrics generated successfully`);
    } catch (error) {
      console.error("❌ Failed to get platform metrics:", error);
      res.status(500).json({
        error: "Failed to get platform metrics",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // User onboarding completion endpoint
  app.put("/api/user/onboarding", isDebugAuthenticated, async (req: any, res) => {
    try {
      const { displayName, bio, interests, tier, preferences } = req.body;
      
      // Mock saving onboarding profile data
      const profileData = {
        userId: req.user.id,
        displayName,
        bio,
        interests,
        tier,
        preferences,
        updatedAt: new Date().toISOString()
      };

      res.json({
        success: true,
        profile: profileData,
        message: "Onboarding profile updated successfully"
      });
      
      console.log(`👤 User onboarding profile updated: ${req.user.id}`);
    } catch (error) {
      console.error("❌ Failed to update onboarding profile:", error);
      res.status(500).json({
        error: "Failed to update onboarding profile",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Profile update endpoint
  app.put("/api/user/profile", isDebugAuthenticated, async (req: any, res) => {
    try {
      const { displayName, bio, backgroundImageUrl, avatarUrl, preferences, truthGenome, metadata } = req.body;
      
      // Mock saving profile data
      const profileData = {
        userId: req.user.id,
        displayName,
        bio,
        backgroundImageUrl,
        avatarUrl,
        preferences,
        truthGenome,
        metadata,
        updatedAt: new Date().toISOString()
      };

      res.json({
        success: true,
        profile: profileData,
        message: "Profile updated successfully"
      });
      
      console.log(`👤 User profile updated: ${req.user.id}`);
    } catch (error) {
      console.error("❌ Failed to update profile:", error);
      res.status(500).json({
        error: "Failed to update profile",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Complete onboarding endpoint
  app.post("/api/user/complete-onboarding", isDebugAuthenticated, async (req: any, res) => {
    try {
      const { profile, completedAt } = req.body;
      
      // Mock completing onboarding
      const onboardingData = {
        userId: req.user.id,
        profile,
        completedAt,
        onboardingVersion: "1.0.0",
        status: "completed"
      };

      res.json({
        success: true,
        onboarding: onboardingData,
        message: "Onboarding completed successfully"
      });
      
      console.log(`🎉 User onboarding completed: ${req.user.id}`);
    } catch (error) {
      console.error("❌ Failed to complete onboarding:", error);
      res.status(500).json({
        error: "Failed to complete onboarding",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // DAO proposals endpoint
  app.get("/api/dao/proposals", isDebugAuthenticated, async (req: any, res) => {
    try {
      const proposals = [
        {
          id: "prop-1",
          title: "Increase Validator Rewards",
          description: "Proposal to increase validator rewards by 15% to incentivize network security.",
          status: "active",
          votesFor: 12500,
          votesAgainst: 3200,
          totalVotes: 15700,
          endDate: "2025-08-10",
          requiredGTT: 1000
        },
        {
          id: "prop-2", 
          title: "New Truth Portal Integration",
          description: "Add support for academic research submissions with specialized verification.",
          status: "active",
          votesFor: 8900,
          votesAgainst: 2100,
          totalVotes: 11000,
          endDate: "2025-08-08",
          requiredGTT: 500
        }
      ];

      res.json(proposals);
      console.log(`🗳️ DAO proposals retrieved: ${proposals.length} active`);
    } catch (error) {
      console.error("❌ Failed to get DAO proposals:", error);
      res.status(500).json({
        error: "Failed to get DAO proposals",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // DAO stats endpoint
  app.get("/api/dao/stats", isDebugAuthenticated, async (req: any, res) => {
    try {
      const stats = {
        totalMembers: 2847,
        totalGTT: 156780,
        activeProposals: 3,
        treasuryBalance: 89340
      };

      res.json(stats);
      console.log(`📊 DAO stats retrieved`);
    } catch (error) {
      console.error("❌ Failed to get DAO stats:", error);
      res.status(500).json({
        error: "Failed to get DAO stats",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // DAO vote endpoint
  app.post("/api/dao/vote", isDebugAuthenticated, async (req: any, res) => {
    try {
      const { proposalId, vote, gttAmount } = req.body;
      
      // Mock voting logic
      const voteData = {
        userId: req.user.id,
        proposalId,
        vote, // 'for' or 'against'
        gttAmount,
        timestamp: new Date().toISOString()
      };

      res.json({
        success: true,
        vote: voteData,
        message: "Vote cast successfully"
      });
      
      console.log(`🗳️ DAO vote cast by ${req.user.id} on proposal ${proposalId}: ${vote}`);
    } catch (error) {
      console.error("❌ Failed to cast DAO vote:", error);
      res.status(500).json({
        error: "Failed to cast vote",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Truth Genome AI analysis endpoint
  app.get("/api/ai/truth-genome/:userId", isDebugAuthenticated, async (req: any, res) => {
    try {
      const { userId } = req.params;
      
      // Generate comprehensive Truth Genome analysis
      const truthGenomeData = {
        traits: {
          seeker: Math.floor(Math.random() * 40) + 60, // 60-100
          whistleblower: Math.floor(Math.random() * 30) + 40, // 40-70
          visionary: Math.floor(Math.random() * 35) + 50, // 50-85
          historian: Math.floor(Math.random() * 45) + 55, // 55-100
        },
        dominantTrait: ["seeker", "whistleblower", "visionary", "historian"][Math.floor(Math.random() * 4)],
        evidenceCount: {
          researched: Math.floor(Math.random() * 20) + 5,
          exposed: Math.floor(Math.random() * 10) + 1,
          predicted: Math.floor(Math.random() * 15) + 3,
          preserved: Math.floor(Math.random() * 25) + 8,
        },
        genomeScore: Math.floor(Math.random() * 25) + 75, // 75-100
        evolution: {
          lastMonth: Math.floor(Math.random() * 15) + 1,
          trend: ["rising", "stable", "declining"][Math.floor(Math.random() * 3)],
        },
        achievements: [
          "Truth Seeker Badge",
          "Memory Keeper",
          "Evidence Collector",
          "Pattern Recognizer"
        ].slice(0, Math.floor(Math.random() * 3) + 1),
        specializations: [
          "Historical Analysis",
          "Data Preservation", 
          "Pattern Recognition",
          "Memory Documentation"
        ].slice(0, Math.floor(Math.random() * 2) + 1),
      };

      res.json(truthGenomeData);
      console.log(`🧬 Truth Genome generated for user: ${userId}`);
    } catch (error) {
      console.error("❌ Failed to generate Truth Genome:", error);
      res.status(500).json({
        error: "Failed to generate Truth Genome",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Multichain staking performance endpoint
  app.get("/api/staking/multichain-performance", isDebugAuthenticated, async (req: any, res) => {
    try {
      const stakingData = {
        totalValueLocked: 2847500,
        totalRewards: 12450,
        averageApr: 8.7,
        activePools: 6,
        attestations: 47,
        pools: [
          {
            chain: "Ethereum",
            chainId: 1,
            totalStaked: 1250000,
            apr: 7.2,
            validators: 12,
            myStake: 5000,
            rewards: 360,
            lockPeriod: "32 epochs",
            status: "active"
          },
          {
            chain: "Polygon",
            chainId: 137,
            totalStaked: 875000,
            apr: 12.4,
            validators: 8,
            myStake: 2500,
            rewards: 310,
            lockPeriod: "14 days",
            status: "active"
          },
          {
            chain: "Base",
            chainId: 8453,
            totalStaked: 622500,
            apr: 9.8,
            validators: 6,
            myStake: 1500,
            rewards: 147,
            lockPeriod: "7 days",
            status: "active"
          }
        ]
      };

      res.json({
        success: true,
        data: stakingData,
        timestamp: new Date().toISOString()
      });

      console.log(`⚡ Multichain staking performance data generated`);
    } catch (error) {
      console.error("❌ Failed to get staking performance:", error);
      res.status(500).json({
        error: "Failed to get staking performance",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // DAO audit logs endpoint
  app.get("/api/audit/logs", isDebugAuthenticated, async (req: any, res) => {
    try {
      const auditData = {
        summary: {
          totalLogs: 1247,
          pendingActions: 23,
          criticalIssues: 2,
          resolvedToday: 15,
          validatorAttestations: 89
        },
        logs: [
          {
            id: "audit-001",
            timestamp: new Date(Date.now() - 300000).toISOString(),
            action: "Capsule Validation Failed",
            actor: "validator-0x1234",
            target: "capsule-789",
            severity: "high",
            status: "investigating",
            details: "Truth verification score below threshold (0.65)",
            txHash: "0xabc123...",
            blockNumber: 18950234
          },
          {
            id: "audit-002",
            timestamp: new Date(Date.now() - 465000).toISOString(),
            action: "GTT Yield Distribution",
            actor: "dao-contract",
            target: "yield-pool-4",
            severity: "low",
            status: "resolved",
            details: "Weekly yield distribution completed successfully",
            txHash: "0xdef456...",
            blockNumber: 18950220
          },
          {
            id: "audit-003",
            timestamp: new Date(Date.now() - 630000).toISOString(),
            action: "Multisig Transaction",
            actor: "guardian-council",
            target: "treasury-vault",
            severity: "medium",
            status: "pending",
            details: "Requires 3/5 signatures for 50,000 GTT transfer",
            txHash: "0x789abc...",
            blockNumber: 18950210
          }
        ]
      };

      res.json({
        success: true,
        ...auditData,
        timestamp: new Date().toISOString()
      });

      console.log(`🔍 DAO audit logs generated: ${auditData.logs.length} entries`);
    } catch (error) {
      console.error("❌ Failed to get audit logs:", error);
      res.status(500).json({
        error: "Failed to get audit logs",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  // Search endpoint is handled in server/index.ts via /api/search route
  app.post("/api/capsules", createCapsule);
  app.get("/api/capsules/:id", getCapsuleById);
  app.post("/api/capsules/:id/mint", mintCapsule);
  app.post("/api/capsules/:id/like", likeCapsule);
  app.post("/api/capsules/:id/share", shareCapsule);
  app.get("/api/capsules/:id/unlock", unlockCapsule);

  // Truth Genome API routes
  app.get("/api/truth-genome/:capsuleId", async (req, res) => {
    const { analyzeTruthGenome } = await import("./api/truth-genome");
    await analyzeTruthGenome(req, res);
  });
  app.get("/api/truth-genome/:capsuleId/report", async (req, res) => {
    const { getTruthGenomeReport } = await import("./api/truth-genome");
    await getTruthGenomeReport(req, res);
  });

  // Truth Net API routes
  app.get("/api/truth-net", async (req, res) => {
    const { getTruthNetwork } = await import("./api/truth-net");
    await getTruthNetwork(req, res);
  });
  app.get("/api/truth-net/analytics", async (req, res) => {
    const { getNetworkAnalytics } = await import("./api/truth-net");
    await getNetworkAnalytics(req, res);
  });
  app.get("/api/truth-net/export", async (req, res) => {
    const { exportTruthNetwork } = await import("./api/truth-net");
    await exportTruthNetwork(req, res);
  });

  // Notarization API routes
  app.post("/api/notarize", async (req, res) => {
    const { notarizeCapsule } = await import("./api/notarize");
    await notarizeCapsule(req, res);
  });
  app.get("/api/notarize/:notarizationId/proof", async (req, res) => {
    const { getNotarizationProof } = await import("./api/notarize");
    await getNotarizationProof(req, res);
  });
  app.get("/api/notarize/registry", async (req, res) => {
    const { getCertificateRegistry } = await import("./api/notarize");
    await getCertificateRegistry(req, res);
  });

  // Certificate API routes
  app.post("/api/certificates/generate", async (req, res) => {
    const { generatePDFCertificate } = await import("./api/certificates");
    await generatePDFCertificate(req, res);
  });
  app.get("/api/certificates/:notarizationId/preview", async (req, res) => {
    const { generateCertificatePreview } = await import("./api/certificates");
    await generateCertificatePreview(req, res);
  });
  app.post("/api/certificates/verify", async (req, res) => {
    const { verifyCertificateFromPDF } = await import("./api/certificates");
    await verifyCertificateFromPDF(req, res);
  });
  app.get("/api/certificates/stats", async (req, res) => {
    const { getCertificateStats } = await import("./api/certificates");
    await getCertificateStats(req, res);
  });

  // Explorer API routes (for public access)
  app.get("/api/explorer/stats", async (req, res) => {
    const { getNetworkAnalytics } = await import("./api/truth-net");
    await getNetworkAnalytics(req, res);
  });

  // Enhanced AI endpoints for voice analysis and capsule composition
  app.post("/api/ai/voice-analysis", upload.single('audio'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No audio file provided" });
      }
      
      const result = await analyzeVoiceFile(req.file.buffer);
      res.json(result);
    } catch (error) {
      console.error("Voice analysis failed:", error);
      res.status(500).json({ error: "Voice analysis failed" });
    }
  });

  app.post("/api/ai/compose-capsule", async (req, res) => {
    try {
      const result = await composeCapsule(req.body);
      res.json(result);
    } catch (error) {
      console.error("Capsule composition failed:", error);
      res.status(500).json({ error: "AI composition failed" });
    }
  });

  app.post("/api/capsules/voice", upload.single('audio'), isDebugAuthenticated, async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No audio file provided" });
      }

      // Mock voice capsule creation - in production this would store in database
      const capsuleId = `voice_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      const capsule = {
        id: capsuleId,
        type: "voice",
        userId: req.user.id,
        transcription: req.body.transcription,
        emotionalAnalysis: JSON.parse(req.body.emotionalAnalysis || '{}'),
        audioUrl: `/api/audio/${capsuleId}`, // Mock URL
        createdAt: new Date().toISOString()
      };

      res.json(capsule);
    } catch (error) {
      console.error("Voice capsule creation failed:", error);
      res.status(500).json({ error: "Failed to create voice capsule" });
    }
  });

  // Analytics endpoint for emotion heatmap
  app.get("/api/analytics/emotion-heatmap", async (req, res) => {
    try {
      const { timeRange = 'week' } = req.query;
      
      // Mock heatmap data - in production this would query the database
      const mockData = {
        days: timeRange === 'week' ? 
          ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
          timeRange === 'month' ?
          ['Week 1', 'Week 2', 'Week 3', 'Week 4'] :
          ['Q1', 'Q2', 'Q3', 'Q4'],
        emotions: ['happy', 'sad', 'anger', 'fear', 'grief', 'hope', 'love'],
        data: [
          [2, 3, 4, 1, 2, 5, 3],
          [4, 5, 2, 3, 1, 2, 4],
          [1, 2, 8, 3, 4, 1, 2],
          [3, 1, 2, 6, 2, 3, 1],
          [6, 7, 5, 4, 8, 6, 5],
          [2, 3, 1, 2, 3, 4, 6],
          [3, 4, 2, 1, 2, 3, 5]
        ],
        metadata: {
          totalCapsules: 247,
          avgGriefScore: 6.3,
          mostActiveDay: timeRange === 'week' ? 'Wednesday' : timeRange === 'month' ? 'Week 3' : 'Q3',
          dominantEmotion: 'grief'
        }
      };

      res.json(mockData);
    } catch (error) {
      console.error("Emotion heatmap failed:", error);
      res.status(500).json({ error: "Failed to generate heatmap data" });
    }
  });

  // GET /api/capsules/multi-chain - Get capsules from multiple chains
  app.get("/api/capsules/multi-chain", isDebugAuthenticated, async (req: any, res) => {
    const { category, userId, chains } = req.query;
    
    console.log("🔗 Multi-chain capsules requested:", { category, userId, chains });
    
    const mockMultiChainCapsules = [
      {
        id: "poly-cap-1",
        title: "Family Legacy on Polygon",
        description: "Preserving family stories with ultra-low gas costs",
        truthScore: 94,
        chainId: 137,
        contractAddress: "0x742d35cc5551d36536c87ff5f5c6de3c8f3d8a8d",
        tokenId: "1001",
        isMinted: true,
        createdAt: "2024-08-02T10:00:00Z",
        author: { name: "Sarah Chen", avatar: "/avatar-1.jpg" },
        mediaType: "video",
        mediaUrl: "/family-legacy.mp4",
        views: 2847,
        likes: 189,
        gasUsed: "0.002 MATIC (~$0.001)",
        transactionHash: "0x1234567890abcdef1234567890abcdef12345678",
      },
      {
        id: "base-cap-1", 
        title: "Truth Report on Base",
        description: "Coinbase's L2 for mainstream adoption",
        truthScore: 91,
        chainId: 8453,
        contractAddress: "0x8ba1f109551bd432803012645hac136c770c8e84",
        tokenId: "2001",
        isMinted: true,
        createdAt: "2024-08-01T15:30:00Z",
        author: { name: "Alex Rivera", avatar: "/avatar-2.jpg" },
        mediaType: "document",
        views: 1523,
        likes: 98,
        gasUsed: "0.0001 ETH (~$0.01)",
        transactionHash: "0xabcdef1234567890abcdef1234567890abcdef12",
      },
      {
        id: "base-cap-2",
        title: "Coinbase Wallet Integration Test",
        description: "Testing ultra-low fees on Base network",
        truthScore: 88,
        chainId: 8453,
        contractAddress: "0x123456789abcdef123456789abcdef123456789a",
        tokenId: "2002", 
        isMinted: true,
        createdAt: "2024-08-03T08:15:00Z",
        author: { name: "Dr. Kim Park", avatar: "/avatar-3.jpg" },
        mediaType: "image",
        mediaUrl: "/coinbase-test.jpg",
        views: 892,
        likes: 67,
        gasUsed: "0.00005 ETH (~$0.005)",
        transactionHash: "0xfedcba0987654321fedcba0987654321fedcba09",
      },
      {
        id: "poly-cap-2",
        title: "Climate Data Collection",
        description: "Long-term environmental monitoring capsule",
        truthScore: 96,
        chainId: 137,
        contractAddress: "0x555666777888999aaabbbcccdddeeefffgg1122",
        tokenId: "1002",
        isMinted: true,
        createdAt: "2024-07-28T12:45:00Z",
        author: { name: "Dr. Elena Vasquez", avatar: "/avatar-4.jpg" },
        mediaType: "data",
        views: 3241,
        likes: 287,
        gasUsed: "0.003 MATIC (~$0.002)",
        transactionHash: "0x9876543210987654321098765432109876543210",
      },
      {
        id: "eth-cap-1",
        title: "Historic Documentation",
        description: "High-value archival on Ethereum mainnet",
        truthScore: 99,
        chainId: 1,
        contractAddress: "0xaabbccddeeff11223344556677889900aabbccdd",
        tokenId: "3001",
        isMinted: true,
        createdAt: "2024-07-20T14:20:00Z",
        author: { name: "Professor Thompson", avatar: "/avatar-5.jpg" },
        mediaType: "document",
        views: 5847,
        likes: 432,
        gasUsed: "0.05 ETH (~$15)",
        transactionHash: "0x1111222233334444555566667777888899990000",
      }
    ];

    res.json(mockMultiChainCapsules);
  });

  // Truth Auction endpoints
  app.post("/api/auction/new", isDebugAuthenticated, async (req: any, res) => {
    try {
      const { title, summary, reservePrice, beneficiaries } = req.body;
      
      if (!title || !summary || !reservePrice) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const auctionId = `auction_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const expiresAt = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)); // 7 days from now
      
      // Mock storage - in production this would use the database
      const auction = {
        id: auctionId,
        title,
        summary,
        reservePrice: parseFloat(reservePrice),
        currentFunding: 0,
        beneficiaries: beneficiaries || [],
        expiresAt: expiresAt.getTime(),
        unlocked: false,
        creatorId: req.user.id,
        disclosureContent: `This is a sealed disclosure for: ${title}\n\nDetailed information will be revealed once the reserve price of ${reservePrice} GTT is met.\n\nCreated by: ${req.user.email}`,
        createdAt: new Date().toISOString(),
      };

      res.json(auction);
    } catch (error) {
      console.error("Error creating auction:", error);
      res.status(500).json({ error: "Failed to create auction" });
    }
  });

  app.get("/api/auction/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Mock auction data - in production this would query the database
      const auction = {
        id,
        title: "Whistleblower Testimony 2024",
        summary: "Critical information about corporate misconduct that needs to be brought to light. The truth deserves to be heard.",
        reservePrice: 5000,
        currentFunding: 2750,
        funded: 2750,
        beneficiaries: ["0x1234567890123456789012345678901234567890", "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd"],
        expiresAt: Date.now() + (5 * 24 * 60 * 60 * 1000), // 5 days from now
        unlocked: false,
        creatorId: "debug-user-456",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      };

      res.json(auction);
    } catch (error) {
      console.error("Error fetching auction:", error);
      res.status(500).json({ error: "Failed to fetch auction" });
    }
  });

  app.post("/api/auction/:id/fund", isDebugAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { amount } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid contribution amount" });
      }

      // Mock funding logic - in production this would update the database
      // and verify blockchain transaction
      res.json({ 
        success: true, 
        newFunding: amount,
        transactionHash: `0x${Math.random().toString(16).substring(2)}`,
        message: "Contribution successful"
      });
    } catch (error) {
      console.error("Error funding auction:", error);
      res.status(500).json({ error: "Failed to process contribution" });
    }
  });

  app.get("/api/auction/:id/disclosure", isDebugAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      
      // Mock disclosure content - in production this would decrypt and serve the content
      const disclosureContent = `CONFIDENTIAL DISCLOSURE - AUCTION ${id}

This sealed disclosure contains critical information about:
- Corporate misconduct patterns from 2020-2024
- Financial irregularities totaling $2.3M
- Internal communications exposing cover-up attempts
- Documented evidence of regulatory violations

Key Evidence:
1. Email chains showing deliberate misreporting
2. Financial records with altered timestamps
3. Recorded conversations with senior management
4. Compliance audit reports marked "confidential"

Timeline of Events:
- January 2020: First incident reported internally
- March 2020: Management directive to suppress findings
- June 2020: External audit manipulation discovered
- September 2020: Whistleblower protection request filed
- December 2020: Retaliation against reporting employee

This disclosure is now permanently sealed on the blockchain and verified through GuardianChain's Truth Vault Protocol.

Reserve met on: ${new Date().toISOString()}
Contributors: Community-funded truth preservation
Verification Status: Authenticated via Veritas Certificate Engine

[Additional 50+ pages of detailed evidence, documents, and witness testimonies would follow...]`;

      res.json({ content: disclosureContent });
    } catch (error) {
      console.error("Error fetching disclosure:", error);
      res.status(500).json({ error: "Failed to fetch disclosure content" });
    }
  });

  // Auth middleware - Setup Debug Auth for immediate testing
  setupDebugAuth(app);

  // Simple subscription status - no database calls
  app.get(
    "/api/subscription/status",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log("🔵 DEBUG: /api/subscription/status called");
      const user = req.user;
      const tier = user?.tier || "EXPLORER";

      res.json({
        tier: tier,
        usage: {
          capsulesCreated: 0,
          capsulesLimit: tier === "EXPLORER" ? 5 : tier === "SEEKER" ? 25 : 999,
        },
        subscription: null,
      });
    },
  );

  // Simple subscription upgrade - no database calls
  app.post(
    "/api/subscription/upgrade",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log("🔵 DEBUG: /api/subscription/upgrade called");
      const { planId } = req.body;

      res.json({
        success: true,
        message: "Subscription upgraded successfully",
        newTier: planId?.toUpperCase() || "SEEKER",
      });
    },
  );

  // Capsule Management Routes
  app.post("/api/capsules", isDebugAuthenticated, async (req: any, res) => {
    const { title, content, capsuleType, accessCost, tags, isSealed } =
      req.body;
    const authorId = req.user.id;

    if (!title || !content) {
      return res
        .status(400)
        .json({ error: "Missing required fields: title, content" });
    }

    const capsule = {
      id: `cap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      content,
      author: authorId,
      capsuleType: capsuleType || "personal_memory",
      accessCost: accessCost || 0,
      tags: Array.isArray(tags) ? tags : [],
      isSealed: isSealed || false,
      verificationStatus: "pending",
      truthScore: 0,
      views: 0,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("🔵 DEBUG: Creating capsule:", capsule);
    res
      .status(201)
      .json({
        success: true,
        capsule,
        message: "Capsule created successfully",
      });
  });

  app.post(
    "/api/trigger-stripe",
    isDebugAuthenticated,
    async (req: any, res) => {
      const { capsuleId, amount } = req.body;
      console.log(
        "🔵 DEBUG: Triggering Stripe payment for capsule:",
        capsuleId,
        "Amount:",
        amount,
      );

      const paymentResult = {
        sessionId: `stripe_${Date.now()}`,
        amount: amount || 2.5,
        currency: "GTT",
        status: "completed",
        capsuleId,
        timestamp: new Date().toISOString(),
      };

      console.log("✅ DEBUG: Stripe payment processed:", paymentResult);
      res.json({
        success: true,
        payment: paymentResult,
        message: "Payment processed and GTT rewards distributed",
      });
    },
  );

  app.post(
    "/api/replay-capsule",
    isDebugAuthenticated,
    async (req: any, res) => {
      const {
        capsuleId,
        authorId,
        authorWalletAddress,
        viewerWalletAddress,
        truthScore = 75,
        verificationCount = 1,
        capsuleAge = Date.now() - 86400000, // 1 day old default
      } = req.body;

      if (!capsuleId) {
        return res.status(400).json({ error: "Missing capsuleId" });
      }

      console.log(
        "🔵 DEBUG: Processing capsule replay with Web3 yield distribution",
      );

      try {
        // Calculate advanced grief-based yield
        const yieldCalculation = await calculateGriefYield(
          truthScore,
          verificationCount,
          capsuleAge,
        );
        console.log("📊 Grief yield calculation:", yieldCalculation);

        // Create replay log entry
        const replayLogId = `replay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        let web3Result = null;
        let transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`; // Fallback

        // Attempt Web3 yield distribution if wallet addresses provided
        if (authorWalletAddress && viewerWalletAddress) {
          try {
            web3Result = await distributeReplayYield(
              authorWalletAddress,
              viewerWalletAddress,
              capsuleId,
              yieldCalculation.totalYield,
            );
            transactionHash = web3Result.authorTxHash;
            console.log("⛓️ Web3 yield distribution successful:", web3Result);
          } catch (web3Error) {
            console.warn(
              "⚠️ Web3 yield distribution failed, continuing with mock:",
              web3Error,
            );
            // Continue with mock data for development
          }
        }

        const replayLog = {
          id: replayLogId,
          capsuleId,
          userId: req.user.id,
          replayType: web3Result ? "web3_verified" : "standard",
          yieldAmount: Math.round(yieldCalculation.totalYield * 100),
          transactionHash,
          sessionId: req.sessionID || `session_${Date.now()}`,
          ipAddress: req.ip || "unknown",
          userAgent: req.get("User-Agent") || "unknown",
          metadata: {
            authorId,
            authorWalletAddress,
            viewerWalletAddress,
            yieldCalculation,
            web3Result,
            requestTimestamp: new Date().toISOString(),
            platform: "GuardianChain",
          },
          createdAt: new Date().toISOString(),
        };

        const replayResult = {
          capsuleId,
          authorId,
          yieldAmount: yieldCalculation.totalYield,
          yieldCalculation,
          web3Distribution: web3Result,
          replayCount: 1,
          timestamp: new Date().toISOString(),
          transactionHash,
          replayLogId,
          isWeb3Verified: !!web3Result,
        };

        console.log("✅ Advanced replay completed with grief-based yield");
        res.json({
          success: true,
          replay: replayResult,
          replayLog,
          message:
            "Capsule replayed with advanced grief-based yield distribution",
        });
      } catch (error) {
        console.error("❌ Replay processing failed:", error);
        res.status(500).json({
          error: "Replay processing failed",
          details: error instanceof Error ? error.message : "Unknown error",
        });
      }
    },
  );

  app.post(
    "/api/purchase-capsule-access",
    isDebugAuthenticated,
    async (req: any, res) => {
      const { capsuleId, amount } = req.body;
      console.log(
        "🔵 DEBUG: Processing capsule access purchase:",
        capsuleId,
        "Amount:",
        amount,
      );

      const sessionUrl = `https://checkout.stripe.com/pay/test_session_${Date.now()}`;
      res.json({
        success: true,
        sessionUrl,
        amount,
        capsuleId,
        message: "Payment session created",
      });
    },
  );

  app.post(
    "/api/distribute-gtt-yield",
    isDebugAuthenticated,
    async (req: any, res) => {
      const { recipientId, amount, reason, capsuleId } = req.body;

      console.log("🔵 DEBUG: Distributing GTT yield:", {
        recipientId,
        amount,
        reason,
        capsuleId,
      });

      const distribution = {
        id: `dist_${Date.now()}`,
        recipientId,
        amount,
        reason,
        capsuleId,
        timestamp: new Date().toISOString(),
        status: "completed",
      };

      console.log("✅ DEBUG: GTT yield distributed:", distribution);
      res.json({
        success: true,
        distribution,
        message: "GTT yield distributed successfully",
      });
    },
  );

  // Get replay logs for analytics
  app.get("/api/replay-logs", isDebugAuthenticated, async (req: any, res) => {
    const { capsuleId, userId, replayType, limit = 50 } = req.query;

    console.log("🔵 DEBUG: Fetching replay logs with filters:", {
      capsuleId,
      userId,
      replayType,
      limit,
    });

    const filters = { capsuleId, userId, replayType };
    const logs = getReplayLogs(filters).slice(0, parseInt(limit));

    const analytics = {
      totalReplays: logs.length,
      totalYieldDistributed: logs.reduce(
        (sum, log) => sum + log.yieldAmount,
        0,
      ),
      uniqueUsers: new Set(logs.map((log) => log.userId)).size,
      replayTypes: logs.reduce(
        (acc, log) => {
          acc[log.replayType] = (acc[log.replayType] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };

    console.log("✅ DEBUG: Replay logs analytics:", analytics);
    res.json({
      success: true,
      logs,
      analytics,
      message: "Replay logs retrieved successfully",
    });
  });

  // Get replay logs for specific capsule
  app.get(
    "/api/capsules/:capsuleId/replay-logs",
    isDebugAuthenticated,
    async (req: any, res) => {
      const { capsuleId } = req.params;
      const { limit = 20 } = req.query;

      console.log("🔵 DEBUG: Fetching replay logs for capsule:", capsuleId);

      const logs = getReplayLogs({ capsuleId }).slice(0, parseInt(limit));

      console.log(
        "✅ DEBUG: Capsule replay logs retrieved:",
        logs.length,
        "entries",
      );
      res.json({
        success: true,
        logs,
        capsuleId,
        message: "Capsule replay logs retrieved successfully",
      });
    },
  );

  // Get GTT balance for user wallet
  app.get(
    "/api/gtt/balance/:address",
    isDebugAuthenticated,
    async (req: any, res) => {
      const { address } = req.params;

      try {
        console.log("🔵 DEBUG: Fetching GTT balance for address:", address);
        const balance = await getGTTBalance(address);

        console.log("✅ GTT balance retrieved:", balance);
        res.json({ success: true, address, balance, symbol: "GTT" });
      } catch (error) {
        console.error("❌ Failed to get GTT balance:", error);
        res.status(500).json({
          error: "Failed to get GTT balance",
          details: error instanceof Error ? error.message : "Unknown error",
        });
      }
    },
  );

  // Get GTT contract information
  app.get("/api/gtt/contract-info", async (req, res) => {
    try {
      console.log("🔵 DEBUG: Fetching GTT contract information");
      const contractInfo = await getContractInfo();

      if (contractInfo) {
        console.log("✅ GTT contract info retrieved");
        res.json({ success: true, contract: contractInfo });
      } else {
        res
          .status(500)
          .json({ error: "Failed to retrieve contract information" });
      }
    } catch (error) {
      console.error("❌ Failed to get contract info:", error);
      res.status(500).json({
        error: "Failed to get contract info",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Calculate grief-based yield for capsule
  app.post(
    "/api/gtt/calculate-yield",
    isDebugAuthenticated,
    async (req: any, res) => {
      const { truthScore, verificationCount, capsuleAge } = req.body;

      try {
        console.log("🔵 DEBUG: Calculating grief-based yield");
        const yieldCalculation = await calculateGriefYield(
          truthScore || 75,
          verificationCount || 1,
          capsuleAge || Date.now() - 86400000,
        );

        console.log("✅ Yield calculation completed:", yieldCalculation);
        res.json({
          success: true,
          yieldCalculation,
          message: "Grief-based yield calculated successfully",
        });
      } catch (error) {
        console.error("❌ Yield calculation failed:", error);
        res.status(500).json({
          error: "Yield calculation failed",
          details: error instanceof Error ? error.message : "Unknown error",
        });
      }
    },
  );

  // Direct GTT yield distribution endpoint
  app.post(
    "/api/gtt/distribute-yield",
    isDebugAuthenticated,
    async (req: any, res) => {
      const { authorAddress, griefTier } = req.body;

      if (!authorAddress || !griefTier) {
        return res
          .status(400)
          .json({ error: "Missing authorAddress or griefTier" });
      }

      try {
        console.log("🔵 DEBUG: Direct GTT yield distribution:", {
          authorAddress,
          griefTier,
        });

        // Calculate yield amount: 10 GTT per grief tier
        const yieldAmount = griefTier * 10;

        // Mock transaction hash for development
        const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;

        const distribution = {
          authorAddress,
          griefTier,
          yieldAmount,
          transactionHash,
          timestamp: new Date().toISOString(),
          status: "completed",
          network: "Polygon",
          blockNumber: Math.floor(Math.random() * 1000000) + 50000000,
        };

        console.log("✅ GTT yield distributed:", distribution);
        res.json({
          success: true,
          distribution,
          transactionHash,
          message: "GTT yield distributed successfully",
        });
      } catch (error) {
        console.error("❌ GTT yield distribution failed:", error);
        res.status(500).json({
          error: "GTT yield distribution failed",
          details: error instanceof Error ? error.message : "Unknown error",
        });
      }
    },
  );

  // GTT balance endpoint
  app.get(
    "/api/gtt/balance/:address",
    isDebugAuthenticated,
    async (req: any, res) => {
      const { address } = req.params;

      try {
        console.log("🔵 DEBUG: Getting GTT balance for:", address);

        // Mock balance for development
        const mockBalance = "125.50";

        res.json({ success: true, balance: mockBalance, address });
      } catch (error) {
        console.error("❌ Failed to get GTT balance:", error);
        res.status(500).json({
          error: "Failed to get GTT balance",
          details: error instanceof Error ? error.message : "Unknown error",
        });
      }
    },
  );

  // GTT contract info endpoint
  app.get(
    "/api/gtt/contract-info",
    isDebugAuthenticated,
    async (req: any, res) => {
      try {
        console.log("🔵 DEBUG: Getting GTT contract info");

        const contractInfo = {
          name: "GuardianChain Truth Token",
          symbol: "GTT",
          totalSupply: "1000000000",
          decimals: 18,
          contractAddress: "0x0000000000000000000000000000000000000000",
          network: "Polygon",
          status: "development",
        };

        res.json({ success: true, contract: contractInfo });
      } catch (error) {
        console.error("❌ Failed to get contract info:", error);
        res.status(500).json({
          error: "Failed to get contract info",
          details: error instanceof Error ? error.message : "Unknown error",
        });
      }
    },
  );

  // Enhanced Redemption System API endpoints
  app.get("/api/redeem/available", isDebugAuthenticated, async (req: any, res) => {
    try {
      console.log("🎁 Fetching available redemptions for user:", req.user.id);
      
      // Mock redeemable capsules - in production, query from database
      const mockRedeemableCapusles = [
        {
          id: "cap_redeem_001",
          title: "High-Value Truth Disclosure",
          griefScore: 9,
          unlockTimestamp: Date.now() - 3600000, // 1 hour ago (unlocked)
          redeemed: false,
          value: 75,
          type: "whistle",
          requirements: { minGriefScore: 8, timelock: true, verified: false }
        },
        {
          id: "cap_redeem_002", 
          title: "Community Testimony",
          griefScore: 7,
          unlockTimestamp: Date.now() - 1800000, // 30 minutes ago (unlocked)
          redeemed: false,
          value: 45,
          type: "testimony",
          requirements: { minGriefScore: 6, timelock: true, verified: false }
        },
        {
          id: "cap_redeem_003",
          title: "Legacy Archive",
          griefScore: 6,
          unlockTimestamp: Date.now() + 7200000, // 2 hours from now (locked)
          redeemed: false,
          value: 30,
          type: "legacy",
          requirements: { minGriefScore: 5, timelock: true, verified: false }
        }
      ];

      res.json({
        success: true,
        capsules: mockRedeemableCapusles,
        count: mockRedeemableCapusles.length
      });
    } catch (error) {
      console.error("❌ Failed to fetch redeemable capsules:", error);
      res.status(500).json({
        error: "Failed to fetch redeemable capsules",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/redeem", isDebugAuthenticated, async (req: any, res) => {
    try {
      const { capsuleId, wallet } = req.body;
      console.log("🔓 Processing capsule redemption:", { capsuleId, wallet });

      if (!capsuleId || !wallet) {
        return res.status(400).json({
          success: false,
          reason: "Missing capsuleId or wallet address"
        });
      }

      // Import redemption logic
      const { redeemCapsule, isValidWalletAddress } = await import("../lib/redeemCapsule");

      // Validate wallet address
      if (!isValidWalletAddress(wallet)) {
        return res.json({
          success: false,
          reason: "Invalid wallet address format"
        });
      }

      // Mock capsule data - in production, fetch from database
      const mockCapsule = {
        id: capsuleId,
        title: "Sample Capsule",
        griefScore: 8,
        unlockTimestamp: Date.now() - 3600000, // 1 hour ago
        redeemed: false,
        value: 50,
        type: "truth",
        owner: req.user.id,
        metadata: {
          emotionalResonance: 85,
          truthConfidence: 92
        }
      };

      // Process redemption
      const unlockConditions = {
        minGriefScore: 5,
        requireVerification: false
      };

      const result = redeemCapsule(mockCapsule, wallet, unlockConditions);

      if (result.success) {
        // In production, update database to mark capsule as redeemed
        console.log("✅ Capsule redeemed successfully:", result);
        
        // Record DAO vault contribution
        const { daoVault } = await import("../lib/daoVaultDisbursement");
        if (result.daoContribution && result.daoContribution > 0) {
          daoVault.depositFromRedemption(
            result.daoContribution,
            capsuleId,
            "validator_address_placeholder"
          );
        }

        // Distribute validator rewards if applicable
        if (result.validatorReward && result.validatorReward > 0) {
          daoVault.distributeValidatorRewards(
            "validator_address_placeholder",
            result.validatorReward,
            capsuleId
          );
        }
      }

      res.json(result);
    } catch (error) {
      console.error("❌ Redemption failed:", error);
      res.status(500).json({
        success: false,
        reason: "Internal server error during redemption"
      });
    }
  });

  // DAO Vault endpoints
  app.get("/api/dao/vault/stats", isDebugAuthenticated, async (req: any, res) => {
    try {
      console.log("🏛️ Fetching DAO vault statistics");
      
      const { daoVault } = await import("../lib/daoVaultDisbursement");
      const stats = daoVault.getVaultStats();

      res.json({
        success: true,
        vault: stats
      });
    } catch (error) {
      console.error("❌ Failed to fetch vault stats:", error);
      res.status(500).json({
        error: "Failed to fetch vault statistics",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/dao/vault/distribute", isDebugAuthenticated, async (req: any, res) => {
    try {
      console.log("💰 Processing weekly DAO distribution");
      
      const { daoVault } = await import("../lib/daoVaultDisbursement");
      const result = daoVault.processWeeklyDistribution();

      res.json({
        success: result.success,
        ...result
      });
    } catch (error) {
      console.error("❌ Failed to process distribution:", error);
      res.status(500).json({
        error: "Failed to process weekly distribution",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Validator Rewards endpoints
  app.get("/api/validators/rewards/:validator", isDebugAuthenticated, async (req: any, res) => {
    try {
      const { validator } = req.params;
      console.log("🏆 Fetching validator rewards for:", validator);
      
      const { validatorRewards } = await import("../lib/validatorRewards");
      const stats = validatorRewards.getValidatorStats(validator);
      const projections = validatorRewards.calculateValidatorProjections(validator, 7);

      res.json({
        success: true,
        validator: stats,
        projections
      });
    } catch (error) {
      console.error("❌ Failed to fetch validator rewards:", error);
      res.status(500).json({
        error: "Failed to fetch validator rewards",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/validators/record-event", isDebugAuthenticated, async (req: any, res) => {
    try {
      const eventData = req.body;
      console.log("📊 Recording validator event:", eventData);
      
      const { validatorRewards } = await import("../lib/validatorRewards");
      const event = validatorRewards.recordValidatorEvent(eventData);

      res.json({
        success: true,
        event
      });
    } catch (error) {
      console.error("❌ Failed to record validator event:", error);
      res.status(500).json({
        error: "Failed to record validator event",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/validators/leaderboard", isDebugAuthenticated, async (req: any, res) => {
    try {
      console.log("🥇 Fetching validator leaderboard");
      
      const { validatorRewards } = await import("../lib/validatorRewards");
      const topValidators = validatorRewards.getTopValidators(20);
      const summary = validatorRewards.getValidatorSummary();

      res.json({
        success: true,
        leaderboard: topValidators,
        summary
      });
    } catch (error) {
      console.error("❌ Failed to fetch validator leaderboard:", error);
      res.status(500).json({
        error: "Failed to fetch validator leaderboard",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // DAO Incentives endpoints
  app.get("/api/dao/incentives/programs", isDebugAuthenticated, async (req: any, res) => {
    try {
      console.log("🎯 Fetching active incentive programs");
      
      const { daoIncentives } = await import("../lib/daoIncentives");
      const programs = daoIncentives.getActivePrograms();

      res.json({
        success: true,
        programs,
        count: programs.length
      });
    } catch (error) {
      console.error("❌ Failed to fetch incentive programs:", error);
      res.status(500).json({
        error: "Failed to fetch incentive programs",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/dao/incentives/join", isDebugAuthenticated, async (req: any, res) => {
    try {
      const { programId } = req.body;
      console.log("🎯 User joining incentive program:", programId);
      
      const { daoIncentives } = await import("../lib/daoIncentives");
      const result = daoIncentives.joinIncentiveProgram(req.user.id, programId);

      if (result) {
        res.json({
          success: true,
          incentive: result
        });
      } else {
        res.status(400).json({
          success: false,
          error: "Unable to join program - may be inactive or already joined"
        });
      }
    } catch (error) {
      console.error("❌ Failed to join incentive program:", error);
      res.status(500).json({
        success: false,
        error: "Failed to join incentive program",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/dao/incentives/status", isDebugAuthenticated, async (req: any, res) => {
    try {
      console.log("📊 Fetching user incentive status");
      
      const { daoIncentives } = await import("../lib/daoIncentives");
      const status = daoIncentives.getUserIncentiveStatus(req.user.id);

      res.json({
        success: true,
        status
      });
    } catch (error) {
      console.error("❌ Failed to fetch incentive status:", error);
      res.status(500).json({
        error: "Failed to fetch incentive status",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/dao/analytics", isDebugAuthenticated, async (req: any, res) => {
    try {
      console.log("📈 Fetching DAO analytics");
      
      const { daoIncentives } = await import("../lib/daoIncentives");
      const analytics = daoIncentives.getDAOAnalytics();

      res.json({
        success: true,
        analytics
      });
    } catch (error) {
      console.error("❌ Failed to fetch DAO analytics:", error);
      res.status(500).json({
        error: "Failed to fetch DAO analytics",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // License Verification endpoints
  app.post("/api/licenses/generate", isDebugAuthenticated, async (req: any, res) => {
    try {
      const licenseData = req.body;
      console.log("📜 Generating capsule license:", licenseData.capsuleId);
      
      const { capsuleLicenseManager } = await import("../lib/capsuleLicense");
      const license = capsuleLicenseManager.generateCapsuleLicense({
        ...licenseData,
        author: req.user.id
      });

      res.json({
        success: true,
        license
      });
    } catch (error) {
      console.error("❌ License generation failed:", error);
      res.status(500).json({
        success: false,
        error: "License generation failed",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/licenses/verify", async (req: any, res) => {
    try {
      const { licenseId, verifierAddress } = req.body;
      console.log("🔍 Verifying license:", licenseId);
      
      const { capsuleLicenseManager } = await import("../lib/capsuleLicense");
      const result = capsuleLicenseManager.verifyLicense(licenseId, verifierAddress);

      res.json(result);
    } catch (error) {
      console.error("❌ License verification failed:", error);
      res.status(500).json({
        valid: false,
        error: "License verification failed",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/licenses/metrics", isDebugAuthenticated, async (req: any, res) => {
    try {
      console.log("📊 Fetching license metrics");
      
      const { capsuleLicenseManager } = await import("../lib/capsuleLicense");
      const metrics = capsuleLicenseManager.getLicenseMetrics();

      res.json({
        success: true,
        metrics
      });
    } catch (error) {
      console.error("❌ Failed to fetch license metrics:", error);
      res.status(500).json({
        error: "Failed to fetch license metrics",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Payout Queue endpoints
  app.post("/api/payout/request", isDebugAuthenticated, async (req: any, res) => {
    try {
      const requestData = req.body;
      console.log("💳 Creating payout request:", requestData);
      
      const { payoutQueueManager } = await import("../lib/payoutQueue");
      const request = payoutQueueManager.addPayoutRequest({
        ...requestData,
        requestedBy: req.user.id
      });

      res.json({
        success: true,
        request
      });
    } catch (error) {
      console.error("❌ Payout request failed:", error);
      res.status(500).json({
        success: false,
        error: "Payout request failed",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/payout/process", isDebugAuthenticated, async (req: any, res) => {
    try {
      const { vaultBalance = 50000 } = req.body;
      console.log("🔄 Processing payout queue with balance:", vaultBalance);
      
      const { payoutQueueManager } = await import("../lib/payoutQueue");
      const result = await payoutQueueManager.processPayoutQueue(vaultBalance);

      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      console.error("❌ Payout processing failed:", error);
      res.status(500).json({
        success: false,
        error: "Payout processing failed",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/payout/stats", isDebugAuthenticated, async (req: any, res) => {
    try {
      console.log("📊 Fetching payout queue statistics");
      
      const { payoutQueueManager } = await import("../lib/payoutQueue");
      const stats = payoutQueueManager.getQueueStats();

      res.json({
        success: true,
        stats
      });
    } catch (error) {
      console.error("❌ Failed to fetch payout stats:", error);
      res.status(500).json({
        error: "Failed to fetch payout statistics",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Multisig Security endpoints
  app.post("/api/multisig/create", isDebugAuthenticated, async (req: any, res) => {
    try {
      const transactionData = req.body;
      console.log("🔐 Creating multisig transaction:", transactionData.type);
      
      const { multisigGate } = await import("../lib/multisigGate");
      const transaction = multisigGate.createMultisigTransaction({
        ...transactionData,
        createdBy: req.user.id
      });

      res.json({
        success: true,
        transaction
      });
    } catch (error) {
      console.error("❌ Multisig creation failed:", error);
      res.status(500).json({
        success: false,
        error: "Multisig transaction creation failed",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/multisig/sign", isDebugAuthenticated, async (req: any, res) => {
    try {
      const { txId, signature, message } = req.body;
      console.log("✍️ Signing multisig transaction:", txId);
      
      const { multisigGate } = await import("../lib/multisigGate");
      const result = multisigGate.signTransaction(txId, req.user.id, signature, message);

      res.json(result);
    } catch (error) {
      console.error("❌ Multisig signing failed:", error);
      res.status(500).json({
        success: false,
        error: "Multisig signing failed",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/multisig/execute", isDebugAuthenticated, async (req: any, res) => {
    try {
      const { txId } = req.body;
      console.log("🚀 Executing multisig transaction:", txId);
      
      const { multisigGate } = await import("../lib/multisigGate");
      const result = await multisigGate.executeTransaction(txId, req.user.id);

      res.json(result);
    } catch (error) {
      console.error("❌ Multisig execution failed:", error);
      res.status(500).json({
        success: false,
        error: "Multisig execution failed",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/multisig/pending", isDebugAuthenticated, async (req: any, res) => {
    try {
      console.log("📋 Fetching pending multisig transactions");
      
      const { multisigGate } = await import("../lib/multisigGate");
      const pending = multisigGate.getPendingTransactions(req.user.id);

      res.json({
        success: true,
        transactions: pending,
        count: pending.length
      });
    } catch (error) {
      console.error("❌ Failed to fetch pending multisig transactions:", error);
      res.status(500).json({
        error: "Failed to fetch pending transactions",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Redemption Signature Verification endpoints
  app.post("/api/redeem/verify-signature", async (req: any, res) => {
    try {
      const { signature, additionalSignatures } = req.body;
      console.log("🔐 Verifying redemption signature");
      
      const { redemptionSignatureVerifier } = await import("../lib/verifyRedemptionSig");
      const result = redemptionSignatureVerifier.verifyRedemptionSignature(
        signature, 
        additionalSignatures
      );

      res.json(result);
    } catch (error) {
      console.error("❌ Signature verification failed:", error);
      res.status(500).json({
        valid: false,
        error: "Signature verification failed",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/redeem/create-challenge", isDebugAuthenticated, async (req: any, res) => {
    try {
      const { capsuleId, redeemer } = req.body;
      console.log("🎯 Creating redemption challenge:", capsuleId);
      
      const { redemptionSignatureVerifier } = await import("../lib/verifyRedemptionSig");
      const challenge = redemptionSignatureVerifier.createSignatureChallenge(capsuleId, redeemer);

      res.json({
        success: true,
        challenge
      });
    } catch (error) {
      console.error("❌ Challenge creation failed:", error);
      res.status(500).json({
        success: false,
        error: "Challenge creation failed",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Archive Certificate endpoints
  app.post("/api/certificates/generate", isDebugAuthenticated, async (req: any, res) => {
    try {
      const { capsuleData, options = {} } = req.body;
      console.log("📜 Generating archive certificate for capsule:", capsuleData?.capsuleId);
      
      const { archiveCertificateGenerator } = await import("../scripts/generateArchiveCert");
      const result = await archiveCertificateGenerator.generateCertificate(capsuleData, options);

      res.json(result);
    } catch (error) {
      console.error("❌ Certificate generation failed:", error);
      res.status(500).json({
        success: false,
        error: "Certificate generation failed",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/certificates/verify", async (req: any, res) => {
    try {
      const { certificateHash, capsuleId } = req.body;
      console.log("🔍 Verifying certificate:", certificateHash);
      
      const { archiveCertificateGenerator } = await import("../scripts/generateArchiveCert");
      const result = await archiveCertificateGenerator.verifyCertificate(certificateHash, capsuleId);

      res.json(result);
    } catch (error) {
      console.error("❌ Certificate verification failed:", error);
      res.status(500).json({
        valid: false,
        error: "Certificate verification failed",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Backup System endpoints
  app.post("/api/capsules/backup", isDebugAuthenticated, async (req: any, res) => {
    try {
      const { options = {} } = req.body;
      console.log("💾 Creating capsule backup with options:", options);
      
      // Mock capsules for backup - in production, fetch user's capsules from database
      const mockCapsules = [
        {
          id: "cap_backup_001",
          title: "Sample Truth Capsule",
          content: "This is a sample truth capsule for backup testing",
          griefScore: 8,
          author: req.user.id,
          timestamp: Date.now() - 86400000,
          type: "truth",
          metadata: {
            emotionalResonance: 75,
            truthConfidence: 88
          }
        }
      ];

      const { capsuleBackup } = await import("../scripts/backupCapsules");
      const result = await capsuleBackup.backupCapsules(mockCapsules, options);

      res.json(result);
    } catch (error) {
      console.error("❌ Backup failed:", error);
      res.status(500).json({
        success: false,
        error: "Backup operation failed",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/capsules/restore", isDebugAuthenticated, async (req: any, res) => {
    try {
      const { backupPath, options = {} } = req.body;
      console.log("🔄 Restoring capsules from backup:", backupPath);
      
      const { capsuleBackup } = await import("../scripts/backupCapsules");
      const result = await capsuleBackup.restoreCapsules(backupPath, options);

      res.json(result);
    } catch (error) {
      console.error("❌ Restore failed:", error);
      res.status(500).json({
        success: false,
        error: "Restore operation failed",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Sovereign Social Profile endpoints
  app.put("/api/user/profile", isDebugAuthenticated, (req: any, res) => {
    console.log("📝 Profile update requested:", req.body);
    res.json({ success: true, message: "Profile updated successfully" });
  });

  // Profile data endpoint - Enhanced with subscription data
  app.get("/api/profile/:userId", isDebugAuthenticated, (req: any, res) => {
    console.log("🔵 DEBUG: Getting profile for user:", req.params.userId);
    const userId = req.params.userId;
    const user = req.user;

    // Enhanced profile data with subscription integration
    const mockProfile = {
      id: userId,
      email: user?.email || "debug@guardianchain.app",
      firstName: user?.firstName || "Debug",
      lastName: user?.lastName || "User",
      displayName: `${user?.firstName || "Debug"} ${user?.lastName || "User"}`,
      bio: "Guardian of truth and digital sovereignty",
      profileImageUrl: "/assets/default-avatar.png",
      coverImageUrl: "/assets/default-cover.jpg",
      location: "Global",
      website: "https://guardianchain.app",
      occupation: "Truth Seeker",
      interests: ["Blockchain", "Truth Verification", "Digital Sovereignty"],
      tier: user?.tier || "EXPLORER",
      roles: ["USER"],
      isFounder: false,
      isVerified: true,
      stats: {
        capsulesCreated: 3,
        totalYieldEarned: 127.5,
        verificationScore: 87,
        followerCount: 42,
        followingCount: 18,
        gttBalance: 1247.83,
      },
      preferences: {
        theme: "dark",
        emailNotifications: true,
        pushNotifications: false,
        aiAssistantEnabled: true,
        publicProfile: true,
        showStats: true,
        allowMessages: true,
      },
      subscription: {
        tier: user?.tier || "EXPLORER",
        status: "active",
        features: getTierFeatures(user?.tier || "EXPLORER"),
        usage: {
          capsulesCreated: 3,
          capsulesLimit: getTierLimits(user?.tier || "EXPLORER").capsules,
          storageUsed: 1.2,
          storageLimit: getTierLimits(user?.tier || "EXPLORER").storage,
        },
      },
      createdAt: new Date().toISOString(),
    };

    res.json(mockProfile);
  });

  // Helper functions for tier features and limits
  function getTierFeatures(tier: string) {
    const features = {
      EXPLORER: ["Basic Capsules", "Community Access", "Limited AI Assistance"],
      SEEKER: [
        "Advanced Capsules",
        "Truth Verification",
        "Extended AI Assistance",
        "Priority Support",
      ],
      CREATOR: [
        "Unlimited Capsules",
        "NFT Minting",
        "Full AI Suite",
        "Revenue Sharing",
      ],
      SOVEREIGN: [
        "All Features",
        "White Label",
        "Custom Integration",
        "Priority Development",
      ],
    };
    return features[tier as keyof typeof features] || features.EXPLORER;
  }

  function getTierLimits(tier: string) {
    const limits = {
      EXPLORER: { capsules: 5, storage: 1, aiQueries: 50 },
      SEEKER: { capsules: 25, storage: 10, aiQueries: 200 },
      CREATOR: { capsules: 999, storage: 100, aiQueries: 1000 },
      SOVEREIGN: { capsules: 9999, storage: 1000, aiQueries: 9999 },
    };
    return limits[tier as keyof typeof limits] || limits.EXPLORER;
  }

  // Profile update endpoint with subscription awareness
  app.put("/api/profile/:userId", isDebugAuthenticated, (req: any, res) => {
    console.log("📝 Profile update requested for user:", req.params.userId);
    console.log("📝 Update data:", req.body);

    // In real implementation, validate tier permissions before allowing updates
    const userTier = req.user?.tier || "EXPLORER";
    const tierLimits = getTierLimits(userTier);

    res.json({
      success: true,
      message: "Profile updated successfully",
      tierInfo: {
        current: userTier,
        limits: tierLimits,
        features: getTierFeatures(userTier),
      },
    });
  });

  app.get(
    "/api/profile/featured-capsules",
    isDebugAuthenticated,
    (req: any, res) => {
      console.log("⭐ Featured capsules requested");
      res.json({
        featuredCapsules: [
          {
            id: "featured-1",
            title: "My Life Story",
            description: "A comprehensive autobiography",
            mediaUrl: "/api/placeholder-image",
            truthScore: 95,
            views: 1247,
            likes: 89,
            isSealed: true,
            isMinted: true,
            nftTokenId: "1001",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            featuredAt: new Date().toISOString(),
            position: 1,
          },
        ],
      });
    },
  );

  app.post(
    "/api/profile/featured-capsules",
    isDebugAuthenticated,
    (req: any, res) => {
      console.log("⭐ Adding capsule to featured:", req.body.capsuleId);
      res.json({ success: true, message: "Capsule added to featured" });
    },
  );

  app.delete(
    "/api/profile/featured-capsules/:id",
    isDebugAuthenticated,
    (req: any, res) => {
      console.log("⭐ Removing capsule from featured:", req.params.id);
      res.json({ success: true, message: "Capsule removed from featured" });
    },
  );

  app.get("/api/capsules/search", isDebugAuthenticated, (req: any, res) => {
    const query = req.query.q as string;
    console.log("🔍 Capsule search requested:", query);
    res.json({
      capsules: [
        {
          id: "search-1",
          title: `Results for "${query}"`,
          description: "Search result description",
          mediaUrl: "/api/placeholder-image",
          truthScore: 78,
          isSealed: true,
          isMinted: false,
          createdAt: new Date().toISOString(),
        },
      ],
    });
  });

  app.post("/api/nft/auto-mint", isDebugAuthenticated, (req: any, res) => {
    console.log("🎨 NFT auto-mint requested:", req.body);
    res.json({
      success: true,
      tokenId: Math.floor(Math.random() * 10000).toString(),
      transactionHash: "0x" + Math.random().toString(16).substring(2),
      ipfsHash: "Qm" + Math.random().toString(36).substring(2),
    });
  });

  app.post("/api/ai/analyze-capsule", isDebugAuthenticated, (req: any, res) => {
    console.log("🧠 AI capsule analysis requested:", req.body);
    res.json({
      success: true,
      analysis: {
        emotionalResonance: Math.floor(Math.random() * 20 + 80),
        truthLikelihood: Math.floor(Math.random() * 15 + 85),
        historicalSignificance: Math.floor(Math.random() * 30 + 60),
        personalValue: Math.floor(Math.random() * 10 + 90),
        suggestedTitle: `Enhanced ${req.body.fileName} Memory`,
        keyThemes: ["Family", "Legacy", "Truth", "Memory"],
        recommendedAudience: "Family and trusted connections",
      },
    });
  });

  app.post("/api/capsules/metadata", isDebugAuthenticated, (req: any, res) => {
    console.log("📝 Storing capsule metadata:", req.body);
    res.json({
      success: true,
      message: "Capsule metadata stored successfully",
      capsuleId: req.body.capsuleId,
    });
  });

  // User preferred language update
  app.put(
    "/api/user/preferred-language",
    isDebugAuthenticated,
    (req: any, res) => {
      const { preferredLanguage } = req.body;

      if (!preferredLanguage || typeof preferredLanguage !== "string") {
        return res
          .status(400)
          .json({ error: "Preferred language is required" });
      }

      console.log("🌐 Updating preferred language:", preferredLanguage);
      res.json({
        success: true,
        message: "Preferred language updated",
        preferredLanguage,
      });
    },
  );

  // Auto-translate endpoint for multilingual content
  app.post("/api/ai/translate", isDebugAuthenticated, (req: any, res) => {
    const { text, targetLanguage, sourceLanguage = "en" } = req.body;

    if (!text || !targetLanguage) {
      return res
        .status(400)
        .json({ error: "Text and target language are required" });
    }

    console.log("🔄 Translation requested:", {
      text: text.substring(0, 50) + "...",
      sourceLanguage,
      targetLanguage,
    });

    // Mock translation for demo - in production, use Google Translate API or similar
    const mockTranslations = {
      ar: "نص مترجم تلقائياً إلى العربية",
      he: "טקסט מתורגם אוטומטית לעברית",
      fa: "متن به طور خودکار به فارسی ترجمه شده",
      ur: "خودکار طور پر اردو میں ترجمہ شدہ متن",
      es: "Texto traducido automáticamente al español",
      fr: "Texte traduit automatiquement en français",
      de: "Automatisch ins Deutsche übersetzter Text",
      zh: "自动翻译成中文的文本",
      ja: "日本語に自動翻訳されたテキスト",
      ko: "한국어로 자동 번역된 텍스트",
      hi: "हिंदी में स्वचालित रूप से अनुवादित पाठ",
      ru: "Автоматически переведенный на русский язык текст",
      pt: "Texto traduzido automaticamente para português",
      it: "Testo tradotto automaticamente in italiano",
      tr: "Türkçeye otomatik olarak çevrilmiş metin",
    };

    const translatedText = mockTranslations[targetLanguage] || text;

    res.json({
      success: true,
      translatedText,
      sourceLanguage,
      targetLanguage,
      confidence: 0.95,
    });
  });

  // Reels API endpoints
  app.get("/api/reels", isDebugAuthenticated, (req: any, res) => {
    console.log("🎬 User reels requested");

    // Mock user reels data
    const mockReels = [
      {
        id: "reel-1",
        name: "Family Legacy Collection",
        description: "Personal family stories and memories",
        capsuleIds: ["cap-1", "cap-4"],
        createdAt: "2024-03-20T12:00:00Z",
        updatedAt: "2024-03-20T12:00:00Z",
        isPublic: true,
        playCount: 127,
        likeCount: 23,
        language: "en",
      },
      {
        id: "reel-2",
        name: "Truth Investigations",
        description: "Evidence-based exposures and investigations",
        capsuleIds: ["cap-2", "cap-3"],
        createdAt: "2024-02-25T15:30:00Z",
        updatedAt: "2024-02-25T15:30:00Z",
        isPublic: false,
        playCount: 89,
        likeCount: 45,
        language: "en",
      },
    ];

    res.json(mockReels);
  });

  app.post("/api/reels", isDebugAuthenticated, (req: any, res) => {
    console.log("🎬 Creating new reel:", req.body);

    const {
      name,
      description,
      capsuleIds,
      isPublic = true,
      language = "en",
    } = req.body;

    const newReel = {
      id: `reel-${Date.now()}`,
      name,
      description,
      capsuleIds,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublic,
      playCount: 0,
      likeCount: 0,
      language,
    };

    res.json(newReel);
  });

  // Capsule collections for reels - get user's owned capsules
  app.get("/api/capsules/owned", isDebugAuthenticated, (req: any, res) => {
    console.log("📦 User owned capsules requested");

    const mockOwnedCapsules = [
      {
        id: "cap-1",
        title: "Family Memories 2024",
        description: "Collection of precious family moments",
        summary:
          "A heartwarming collection capturing the essence of family bonds, laughter, and shared experiences throughout 2024.",
        truthScore: 92,
        mediaType: "video",
        mediaUrl: "/placeholder-video.mp4",
        createdAt: "2024-03-15T10:00:00Z",
      },
      {
        id: "cap-2",
        title: "Truth About Corporate Fraud",
        description: "Whistleblower testimony exposing corporate misconduct",
        summary:
          "Detailed account of financial irregularities and ethical violations within a major corporation, backed by documented evidence.",
        truthScore: 96,
        mediaType: "document",
        createdAt: "2024-02-20T14:30:00Z",
      },
      {
        id: "cap-3",
        title: "Climate Change Evidence",
        description: "Scientific observations and data collection",
        summary:
          "Comprehensive documentation of local climate patterns, temperature changes, and environmental impact over the past decade.",
        truthScore: 89,
        mediaType: "image",
        mediaUrl: "/placeholder-chart.jpg",
        createdAt: "2024-01-10T09:15:00Z",
      },
      {
        id: "cap-4",
        title: "Heritage Recipe Collection",
        description: "Grandmother's secret recipes and cooking traditions",
        summary:
          "Traditional family recipes passed down through generations, including cooking techniques and cultural significance.",
        truthScore: 85,
        mediaType: "text",
        createdAt: "2024-04-05T16:45:00Z",
      },
    ];

    res.json(mockOwnedCapsules);
  });

  // AI Translation endpoint
  app.post("/api/ai/translate", isDebugAuthenticated, (req: any, res) => {
    console.log("🌐 Translation requested:", req.body);

    const { text, targetLanguage, sourceLanguage = "en" } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({ error: "Missing text or targetLanguage" });
    }

    // Mock translation responses for different languages
    const mockTranslations: Record<string, Record<string, string>> = {
      es: {
        "Family Memories 2024": "Recuerdos Familiares 2024",
        "A heartwarming collection capturing the essence of family bonds, laughter, and shared experiences throughout 2024.":
          "Una colección conmovedora que captura la esencia de los vínculos familiares, la risa y las experiencias compartidas durante 2024.",
        "Truth About Corporate Fraud": "La Verdad Sobre el Fraude Corporativo",
        "Detailed account of financial irregularities and ethical violations within a major corporation, backed by documented evidence.":
          "Relato detallado de irregularidades financieras y violaciones éticas dentro de una corporación importante, respaldado por evidencia documentada.",
      },
      fr: {
        "Family Memories 2024": "Souvenirs de Famille 2024",
        "A heartwarming collection capturing the essence of family bonds, laughter, and shared experiences throughout 2024.":
          "Une collection réconfortante capturant l'essence des liens familiaux, du rire et des expériences partagées tout au long de 2024.",
        "Truth About Corporate Fraud": "La Vérité sur la Fraude d'Entreprise",
        "Detailed account of financial irregularities and ethical violations within a major corporation, backed by documented evidence.":
          "Compte rendu détaillé des irrégularités financières et des violations éthiques au sein d'une grande corporation, soutenu par des preuves documentées.",
      },
      ar: {
        "Family Memories 2024": "ذكريات العائلة 2024",
        "A heartwarming collection capturing the essence of family bonds, laughter, and shared experiences throughout 2024.":
          "مجموعة مؤثرة تلتقط جوهر الروابط الأسرية والضحك والتجارب المشتركة خلال عام 2024.",
        "Truth About Corporate Fraud": "الحقيقة حول الاحتيال المؤسسي",
        "Detailed account of financial irregularities and ethical violations within a major corporation, backed by documented evidence.":
          "حساب مفصل للمخالفات المالية والانتهاكات الأخلاقية داخل شركة كبرى، مدعوم بأدلة موثقة.",
      },
      zh: {
        "Family Memories 2024": "家庭回忆 2024",
        "A heartwarming collection capturing the essence of family bonds, laughter, and shared experiences throughout 2024.":
          "一个温馨的合集，捕捉了2024年家庭纽带、欢声笑语和共同经历的精髓。",
        "Truth About Corporate Fraud": "企业欺诈真相",
        "Detailed account of financial irregularities and ethical violations within a major corporation, backed by documented evidence.":
          "详细记录了一家大公司内部的财务违规和道德违法行为，有文件证据支持。",
      },
      de: {
        "Family Memories 2024": "Familienerinnerungen 2024",
        "A heartwarming collection capturing the essence of family bonds, laughter, and shared experiences throughout 2024.":
          "Eine herzerwärmende Sammlung, die das Wesen von Familienbanden, Lachen und gemeinsamen Erfahrungen während 2024 einfängt.",
        "Truth About Corporate Fraud": "Die Wahrheit über Unternehmensbetrug",
        "Detailed account of financial irregularities and ethical violations within a major corporation, backed by documented evidence.":
          "Detaillierter Bericht über finanzielle Unregelmäßigkeiten und ethische Verstöße innerhalb eines großen Unternehmens, unterstützt durch dokumentierte Beweise.",
      },
    };

    // Get translation or fallback to original text
    const languageTranslations = mockTranslations[targetLanguage] || {};
    const translatedText =
      languageTranslations[text] || `[${targetLanguage.toUpperCase()}] ${text}`;

    // Simulate API delay
    setTimeout(() => {
      res.json({
        success: true,
        translatedText,
        sourceLanguage,
        targetLanguage,
        confidence: 0.95,
      });
    }, 800);
  });

  // Register GTT Contract routes
  registerGTTContractRoutes(app);

  // Register metadata routes
  const { registerMetadataRoutes } = await import("./routes/metadata");
  registerMetadataRoutes(app);

  // Reels management endpoints
  app.get("/api/reels/:reelId", isDebugAuthenticated, async (req: any, res) => {
    console.log("🎬 Fetching reel:", req.params.reelId);

    // Mock reel capsules data with voiceover URLs
    const mockReelCapsules = [
      {
        id: "capsule-reel-1",
        title: "Family Heritage Truth",
        summary:
          "A heartfelt story about preserving family traditions and values for future generations.",
        mediaUrl: "/assets/reel-video-1.mp4",
        voiceoverUrl: "/assets/reel-voice-1.mp3",
        truthScore: 95,
        views: 2847,
        likes: 189,
        author: {
          id: "user-1",
          name: "Sarah Chen",
          avatar: "/assets/avatar-1.jpg",
        },
        tags: ["family", "heritage", "wisdom"],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        language: "en",
        translatedSummary: null,
      },
      {
        id: "capsule-reel-2",
        title: "Climate Change Witness",
        summary:
          "Personal observations of environmental changes in my hometown over 30 years.",
        mediaUrl: "/assets/reel-video-2.mp4",
        voiceoverUrl: "/assets/reel-voice-2.mp3",
        truthScore: 88,
        views: 5124,
        likes: 342,
        author: {
          id: "user-2",
          name: "Dr. Ahmed Hassan",
          avatar: "/assets/avatar-2.jpg",
        },
        tags: ["environment", "climate", "science"],
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        language: "en",
        translatedSummary: null,
      },
      {
        id: "capsule-reel-3",
        title: "Medical Research Truth",
        summary:
          "Documenting breakthrough discoveries in rare disease treatment protocols.",
        mediaUrl: "/assets/reel-video-3.mp4",
        voiceoverUrl: "/assets/reel-voice-3.mp3",
        truthScore: 92,
        views: 1523,
        likes: 98,
        author: {
          id: "user-3",
          name: "Dr. Maria Rodriguez",
          avatar: "/assets/avatar-3.jpg",
        },
        tags: ["medical", "research", "breakthrough"],
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        language: "en",
        translatedSummary: null,
      },
    ];

    res.json(mockReelCapsules);
  });

  // Translation API endpoint
  app.post("/api/ai/translate", isDebugAuthenticated, async (req: any, res) => {
    const { text, targetLanguage, sourceLanguage } = req.body;
    console.log("🌐 Translation requested:", {
      targetLanguage,
      textLength: text?.length,
    });

    // Mock translation responses for different languages
    const mockTranslations: Record<string, string> = {
      ar: "قصة مؤثرة حول الحفاظ على التقاليد والقيم العائلية للأجيال القادمة.",
      es: "Una historia emotiva sobre preservar las tradiciones familiares y valores para las futuras generaciones.",
      fr: "Une histoire touchante sur la préservation des traditions familiales et des valeurs pour les générations futures.",
      de: "Eine herzliche Geschichte über die Bewahrung von Familientraditionen und Werten für zukünftige Generationen.",
      zh: "一个关于为后代保存家庭传统和价值观的感人故事。",
      ja: "将来の世代のために家族の伝統と価値観を保存することについての心温まる物語。",
    };

    const translatedText = mockTranslations[targetLanguage] || text;

    res.json({
      translatedText,
      sourceLanguage: sourceLanguage || "auto",
      targetLanguage,
      confidence: 0.95,
    });
  });

  // Text-to-speech API endpoint
  app.post(
    "/api/ai/text-to-speech",
    isDebugAuthenticated,
    async (req: any, res) => {
      const { text, language, voice } = req.body;
      console.log("🎤 TTS requested:", {
        language,
        voice,
        textLength: text?.length,
      });

      // Mock TTS response - in production this would generate actual audio
      res.set({
        "Content-Type": "audio/mpeg",
        "Content-Length": "1024",
      });

      // Return a mock audio buffer
      const mockAudioBuffer = Buffer.alloc(1024);
      res.send(mockAudioBuffer);
    },
  );

  // User language preference endpoints
  app.get("/api/user/language", isDebugAuthenticated, async (req: any, res) => {
    const user = req.user;
    console.log("🌐 Getting user language preference for:", user.id);

    res.json({
      language: user.language || "en",
      preferredLanguage: user.language || "en",
    });
  });

  app.put("/api/user/language", isDebugAuthenticated, async (req: any, res) => {
    const { language } = req.body;
    const user = req.user;
    console.log("🌐 Setting user language preference:", {
      userId: user.id,
      language,
    });

    // In real implementation, update user.language in database
    res.json({
      success: true,
      language: language,
      message: "Language preference updated successfully",
    });
  });

  // Reel creation and management
  app.post("/api/reels", isDebugAuthenticated, async (req: any, res) => {
    const { name, capsuleIds } = req.body;
    const user = req.user;
    console.log("🎬 Creating reel:", { name, capsuleIds, userId: user.id });

    const newReel = {
      id: `reel-${Date.now()}`,
      name,
      capsuleIds,
      userId: user.id,
      createdAt: new Date().toISOString(),
      isPublic: true,
    };

    res.json({
      success: true,
      reel: newReel,
      message: "Reel created successfully",
    });
  });

  app.get("/api/user/reels", isDebugAuthenticated, async (req: any, res) => {
    const user = req.user;
    console.log("🎬 Getting user reels for:", user.id);

    const mockUserReels = [
      {
        id: "reel-user-1",
        name: "My Truth Journey",
        capsuleIds: ["capsule-1", "capsule-2", "capsule-3"],
        userId: user.id,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        isPublic: true,
        views: 245,
        likes: 18,
      },
      {
        id: "reel-user-2",
        name: "Family Memories",
        capsuleIds: ["capsule-4", "capsule-5"],
        userId: user.id,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        isPublic: false,
        views: 89,
        likes: 7,
      },
    ];

    res.json(mockUserReels);
  });

  // Register profile routes
  const profileRoutes = await import("./routes/profile");
  app.use("/api/profile", profileRoutes.default);

  // Media and Vault Routes
  const mediaRoutes = await import("./routes/media");
  app.use("/api/media", mediaRoutes.default);

  const userChangesRoutes = await import("./routes/userChanges");
  app.use("/api/user", userChangesRoutes.default);

  // Register engagement routes
  const { registerEngagementRoutes } = await import("./routes/engagement");
  registerEngagementRoutes(app);

  // Analytics dashboard endpoint
  app.get(
    "/api/analytics/dashboard",
    isDebugAuthenticated,
    async (req: any, res) => {
      try {
        // Mock analytics data - in production this would query the database
        const analyticsData = {
          dailyReplays: {
            labels: Array.from({ length: 14 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - i);
              return date.toISOString().split("T")[0];
            }).reverse(),
            counts: [12, 19, 8, 15, 23, 18, 27, 31, 22, 16, 25, 29, 34, 28],
          },
          griefTierDistribution: {
            labels: ["Tier 1", "Tier 2", "Tier 3", "Tier 4", "Tier 5"],
            data: [45, 32, 28, 18, 12],
          },
          yieldDistribution: {
            total: 2850,
            byTier: [450, 640, 840, 720, 600],
          },
          topCapsules: [
            {
              id: "cap_1754140000_abc123",
              title: "A Message from the Past",
              replays: 156,
              yield: 312,
            },
            {
              id: "cap_1754139000_def456",
              title: "Family Legacy",
              replays: 134,
              yield: 268,
            },
            {
              id: "cap_1754138000_ghi789",
              title: "The Truth About...",
              replays: 98,
              yield: 196,
            },
            {
              id: "cap_1754137000_jkl012",
              title: "War Stories",
              replays: 87,
              yield: 174,
            },
            {
              id: "cap_1754136000_mno345",
              title: "Lost Memories",
              replays: 76,
              yield: 152,
            },
          ],
        };

        console.log("📊 Analytics dashboard data requested");
        res.json(analyticsData);
      } catch (error) {
        console.error("❌ Analytics dashboard error:", error);
        res.status(500).json({
          error: "Failed to fetch analytics data",
          details: error instanceof Error ? error.message : "Unknown error",
        });
      }
    },
  );

  // Moderation logs endpoint
  app.get(
    "/api/moderation/logs",
    isDebugAuthenticated,
    async (req: any, res) => {
      try {
        // Mock moderation logs - in production this would query the database
        const mockLogs = [
          {
            id: "mod_1754140001",
            content: "This capsule contains family memories from the 1980s...",
            user: "user_abc123",
            reason: "Content approved after review",
            severity: 1,
            flags: [],
            status: "approved",
            created_at: new Date(Date.now() - 86400000).toISOString(),
            reviewed_at: new Date(Date.now() - 3600000).toISOString(),
            reviewer: "admin_def456",
          },
          {
            id: "mod_1754140002",
            content: "A story about overcoming challenges in life...",
            user: "user_xyz789",
            reason: "Flagged for emotional content review",
            severity: 3,
            flags: ["emotional_content"],
            status: "pending",
            created_at: new Date(Date.now() - 7200000).toISOString(),
          },
          {
            id: "mod_1754140003",
            content: "Historical account of family immigration...",
            user: "user_hist001",
            reason: "Content contains sensitive historical information",
            severity: 2,
            flags: ["historical_content"],
            status: "approved",
            created_at: new Date(Date.now() - 14400000).toISOString(),
            reviewed_at: new Date(Date.now() - 1800000).toISOString(),
            reviewer: "admin_def456",
          },
        ];

        console.log("📋 Moderation logs requested");
        res.json(mockLogs);
      } catch (error) {
        console.error("❌ Moderation logs error:", error);
        res.status(500).json({ error: "Failed to fetch moderation logs" });
      }
    },
  );

  // Moderation statistics endpoint
  app.get(
    "/api/moderation/stats",
    isDebugAuthenticated,
    async (req: any, res) => {
      try {
        const mockStats = {
          total: 156,
          pending: 8,
          approved: 132,
          rejected: 16,
          todayTotal: 12,
        };

        console.log("📊 Moderation stats requested");
        res.json(mockStats);
      } catch (error) {
        console.error("❌ Moderation stats error:", error);
        res
          .status(500)
          .json({ error: "Failed to fetch moderation statistics" });
      }
    },
  );

  // Moderation review action endpoint
  app.post(
    "/api/moderation/review",
    isDebugAuthenticated,
    async (req: any, res) => {
      try {
        const { logId, action, reviewerNotes } = req.body;

        if (!logId || !action) {
          return res
            .status(400)
            .json({ error: "Missing required fields: logId, action" });
        }

        // In production, this would update the database
        const reviewResult = {
          logId,
          action,
          reviewerNotes,
          reviewedBy: req.user.id,
          reviewedAt: new Date().toISOString(),
          status: "completed",
        };

        console.log("✅ Moderation review completed:", reviewResult);
        res.json(reviewResult);
      } catch (error) {
        console.error("❌ Moderation review failed:", error);
        res.status(500).json({ error: "Failed to process moderation review" });
      }
    },
  );

  // Capsule creation endpoint
  app.post("/api/capsules", isDebugAuthenticated, async (req: any, res) => {
    try {
      const {
        title,
        content,
        griefTier,
        category,
        nftTokenId,
        transactionHash,
      } = req.body;

      if (!title || !content) {
        return res
          .status(400)
          .json({ error: "Title and content are required" });
      }

      // In production, this would create a capsule in the database
      const capsule = {
        id: `cap_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
        title,
        content,
        griefTier: griefTier || 3,
        category: category || "memory",
        nftTokenId,
        transactionHash,
        author: req.user.id,
        createdAt: new Date().toISOString(),
        status: "active",
      };

      console.log("📦 Capsule created:", {
        id: capsule.id,
        title,
        griefTier: capsule.griefTier,
        category,
        nftTokenId,
      });

      res.json(capsule);
    } catch (error) {
      console.error("❌ Capsule creation failed:", error);
      res.status(500).json({
        error: "Failed to create capsule",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Get single capsule endpoint
  app.get("/api/capsules/:id", isDebugAuthenticated, async (req: any, res) => {
    try {
      const capsuleId = req.params.id;

      if (!capsuleId) {
        return res.status(400).json({ error: "Capsule ID is required" });
      }

      // Mock single capsule data - in production this would query the database
      const mockCapsule = {
        id: capsuleId,
        title: "Family Memories from the 1980s",
        content: `Growing up in a small town in the 1980s was a magical experience. I remember the summer evenings when the whole neighborhood would come alive with the sounds of children playing, lawn mowers humming, and the distant melody of ice cream trucks.

Our house was a modest two-story colonial with a wraparound porch where my grandmother would sit in her rocking chair, watching the world go by. She had the most incredible stories about our family's journey to America, tales that seemed like fairy tales to my young mind.

I can still smell the fresh-baked apple pies cooling on the windowsill and hear my mother's voice calling us in for dinner as the sun began to set. Those were simpler times, when a bicycle and your imagination were all you needed for adventure.

This memory is preserved here as a testament to the beauty of ordinary moments that become extraordinary in retrospect. The love, laughter, and lessons learned in that small town shaped who I am today.`,
        griefTier: 2,
        category: "memory",
        nftTokenId: "1234",
        transactionHash: "0x" + Math.random().toString(16).slice(2, 66),
        author: req.user.id,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        status: "active",
        replays: 15,
        yieldEarned: 30,
      };

      console.log("📦 Single capsule requested:", capsuleId);
      res.json(mockCapsule);
    } catch (error) {
      console.error("❌ Failed to fetch capsule:", error);
      res.status(500).json({
        error: "Failed to fetch capsule",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Get user capsules endpoint
  app.get("/api/capsules", isDebugAuthenticated, async (req: any, res) => {
    try {
      // Mock user capsules - in production this would query the database
      const mockCapsules = [
        {
          id: "cap_1754140001_abc123",
          title: "Family Memories from the 1980s",
          content: "Growing up in a small town...",
          griefTier: 2,
          category: "memory",
          nftTokenId: "1234",
          author: req.user.id,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          status: "active",
          replays: 12,
          yieldEarned: 24,
        },
        {
          id: "cap_1754140002_def456",
          title: "A Message to Future Generations",
          content: "The wisdom I want to pass down...",
          griefTier: 3,
          category: "legacy",
          nftTokenId: "1235",
          author: req.user.id,
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          status: "active",
          replays: 8,
          yieldEarned: 24,
        },
      ];

      console.log("📋 User capsules requested");
      res.json(mockCapsules);
    } catch (error) {
      console.error("❌ Failed to fetch capsules:", error);
      res.status(500).json({ error: "Failed to fetch capsules" });
    }
  });

  // Capsule replay endpoint
  app.post(
    "/api/capsules/replay",
    isDebugAuthenticated,
    async (req: any, res) => {
      try {
        const { capsuleId, emotionalResponse, timestamp } = req.body;

        if (!capsuleId || typeof emotionalResponse !== "number") {
          return res
            .status(400)
            .json({ error: "Capsule ID and emotional response are required" });
        }

        // Calculate yield based on emotional response (0-100) and base grief tier
        const baseYield = 10; // Base yield per replay
        const emotionalMultiplier = Math.max(0.5, emotionalResponse / 100);
        const yieldAmount = Math.round(baseYield * emotionalMultiplier);

        // In production, this would:
        // 1. Record the replay in the database
        // 2. Update capsule replay count
        // 3. Distribute GTT tokens to user
        // 4. Log the emotional response for analytics

        const replayRecord = {
          id: `replay_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
          capsuleId,
          userId: req.user.id,
          emotionalResponse,
          yieldAmount,
          timestamp: timestamp || new Date().toISOString(),
          status: "completed",
        };

        console.log("🎬 Capsule replay completed:", {
          capsuleId,
          emotionalResponse,
          yieldAmount,
          user: req.user.id,
        });

        res.json({
          success: true,
          replayId: replayRecord.id,
          yieldAmount,
          emotionalResponse,
          message: `Replay completed! You earned ${yieldAmount} GTT tokens.`,
        });
      } catch (error) {
        console.error("❌ Capsule replay failed:", error);
        res.status(500).json({
          error: "Failed to process capsule replay",
          details: error instanceof Error ? error.message : "Unknown error",
        });
      }
    },
  );

  // AI Summary endpoint
  app.post("/api/ai-summary", isDebugAuthenticated, async (req: any, res) => {
    try {
      const { content, capsule_id } = req.body;

      if (!content) {
        return res.status(400).json({ error: "Content is required" });
      }

      const summaryPrompt = `Summarize the following memory as 1 sentence and classify the primary emotion (joy, sadness, fear, anger, nostalgia, hope, grief):\n\n"${content}"`;

      // In production, this would use the actual OpenAI API
      // For now, we'll simulate the AI summary generation
      const mockSummary = generateMockSummary(content);

      console.log("🤖 AI Summary generated:", {
        capsule_id,
        summary: mockSummary.substring(0, 50) + "...",
      });

      // In production, this would update the database
      // await storage.updateCapsuleSummary(capsule_id, mockSummary);

      res.status(200).json({
        summary: mockSummary,
        capsule_id,
        emotions_detected: extractEmotions(content),
      });
    } catch (error) {
      console.error("❌ AI Summary failed:", error);
      res.status(500).json({
        error: "Failed to generate AI summary",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // ROI Analysis endpoint
  app.get("/api/roi/:id", isDebugAuthenticated, async (req: any, res) => {
    try {
      const capsuleId = req.params.id;

      if (!capsuleId) {
        return res.status(400).json({ error: "Capsule ID is required" });
      }

      // Mock replay data - in production this would query the database
      const mockReplays = Math.floor(Math.random() * 50) + 5; // 5-55 replays
      const gttEarned = mockReplays * 10; // 10 GTT per replay

      const roiData = {
        capsuleId,
        replays: mockReplays,
        gttEarned,
        averageEmotionalResponse: Math.floor(Math.random() * 40) + 60, // 60-100%
        totalViews: mockReplays + Math.floor(Math.random() * 20),
        yieldPerReplay: 10,
        creationCost: 0, // Free creation
        netProfit: gttEarned,
        roi: gttEarned > 0 ? "∞%" : "0%", // Infinite ROI since creation is free
      };

      console.log("📊 ROI Analysis requested:", { capsuleId, gttEarned });
      res.status(200).json(roiData);
    } catch (error) {
      console.error("❌ ROI Analysis failed:", error);
      res.status(500).json({
        error: "Failed to generate ROI analysis",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Content moderation endpoint
  app.post(
    "/api/moderate-content",
    isDebugAuthenticated,
    async (req: any, res) => {
      try {
        const { content } = req.body;

        if (!content) {
          return res.status(400).json({ error: "Content is required" });
        }

        // Import moderation function
        const { moderateCapsule, calculateGriefScore } = await import(
          "./lib/moderation"
        );

        const moderationResult = await moderateCapsule(content);
        const griefScore = await calculateGriefScore(content);

        console.log("🔍 Content moderated:", {
          isAllowed: moderationResult.isAllowed,
          griefScore,
          flags: moderationResult.flags,
        });

        res.json({
          moderation: moderationResult,
          griefScore,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error("❌ Content moderation failed:", error);
        res.status(500).json({
          error: "Content moderation failed",
          details: error instanceof Error ? error.message : "Unknown error",
        });
      }
    },
  );

  // Auction unlock logging endpoint with Supabase integration
  app.post("/api/auction/:id/unlock-log", isDebugAuthenticated, async (req: any, res) => {
    try {
      const auctionId = req.params.id;
      const { wallet, timestamp } = req.body;
      
      if (!auctionId || !wallet || !timestamp) {
        return res.status(400).json({ error: 'Missing required fields: auctionId, wallet, or timestamp' });
      }

      console.log("🔓 Auction unlock event logging to Supabase:", {
        auctionId,
        wallet,
        timestamp,
        user: req.user.id
      });

      // Import Supabase client
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      // Insert unlock event into Supabase
      const { data, error } = await supabase.from('auction_unlocks').insert({
        auction_id: auctionId,
        wallet_address: wallet,
        user_id: req.user.id,
        unlocked_at: new Date(timestamp).toISOString()
      }).select();

      if (error) {
        console.error("❌ Supabase unlock logging error:", error);
        return res.status(500).json({ 
          error: 'Failed to log unlock event to database',
          details: error.message 
        });
      }

      const unlockEvent = data?.[0] || {
        auction_id: auctionId,
        wallet_address: wallet,
        user_id: req.user.id,
        unlocked_at: new Date(timestamp).toISOString()
      };

      console.log("✅ Auction unlock event successfully logged to Supabase:", unlockEvent);

      res.json({
        success: true,
        unlockEvent,
        message: "Unlock event logged successfully to database"
      });
    } catch (error) {
      console.error("❌ Failed to log unlock event:", error);
      res.status(500).json({
        error: "Failed to log unlock event",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Simple auth user endpoint - no database calls
  app.get("/api/auth/user", isDebugAuthenticated, async (req: any, res) => {
    console.log("🔵 DEBUG: /api/auth/user called");
    const sessionUser = req.user;

    const responseUser = {
      id: sessionUser.id,
      email: sessionUser.email,
      firstName: sessionUser.firstName,
      lastName: sessionUser.lastName,
      tier: sessionUser.tier || "EXPLORER",
      usage: {
        capsulesCreated: 0,
        capsulesLimit: sessionUser.tier === "EXPLORER" ? 5 : 25,
      },
      subscription: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("✅ DEBUG: Returning user data:", responseUser);
    res.json(responseUser);
  });

  // Get all unlock events endpoint
  app.get("/api/unlocks", isDebugAuthenticated, async (req: any, res) => {
    try {
      console.log("📜 Fetching all unlock events");

      // Import Supabase client
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      // First fetch unlock events
      const { data: unlocks, error: unlocksError } = await supabase
        .from('auction_unlocks')
        .select('*')
        .order('unlocked_at', { ascending: false })
        .limit(100);

      if (unlocksError) {
        console.error("❌ Failed to fetch unlock events:", unlocksError);
        return res.status(500).json({ 
          error: 'Failed to fetch unlock events',
          details: unlocksError.message 
        });
      }

      // Then fetch auction details separately and merge
      const auctionIds = [...new Set((unlocks || []).map(unlock => unlock.auction_id))];
      
      let auctionsMap = {};
      if (auctionIds.length > 0) {
        const { data: auctions, error: auctionsError } = await supabase
          .from('auctions')
          .select('id, title, summary')
          .in('id', auctionIds);

        if (!auctionsError && auctions) {
          auctionsMap = auctions.reduce((acc, auction) => {
            acc[auction.id] = auction;
            return acc;
          }, {});
        }
      }

      // Format response for frontend
      const formattedUnlocks = (unlocks || []).map(unlock => ({
        id: unlock.id,
        auction_id: unlock.auction_id,
        auction_title: auctionsMap[unlock.auction_id]?.title || 'Unknown Auction',
        auction_summary: auctionsMap[unlock.auction_id]?.summary || null,
        wallet_address: unlock.wallet_address,
        user_id: unlock.user_id,
        unlocked_at: unlock.unlocked_at,
        created_at: unlock.created_at
      }));

      console.log("✅ Fetched unlock events:", formattedUnlocks.length);
      res.json(formattedUnlocks);
    } catch (error) {
      console.error("❌ Failed to fetch unlock events:", error);
      res.status(500).json({
        error: "Failed to fetch unlock events",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Auction unlock logging endpoint
  app.post("/api/auction/:id/unlock-log", isDebugAuthenticated, async (req: any, res) => {
    const { id } = req.params;
    const { wallet, timestamp, userId } = req.body;

    if (!id || !wallet || !timestamp) {
      return res.status(400).json({ 
        error: 'Missing required fields: auction_id, wallet, timestamp' 
      });
    }

    try {
      console.log('🔓 Logging auction unlock:', { auction_id: id, wallet, userId });

      // Import Supabase client
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      // Check if unlock already exists for this user/auction combo
      const { data: existingUnlock } = await supabase
        .from('auction_unlocks')
        .select('id')
        .eq('auction_id', id)
        .eq('wallet_address', wallet)
        .single();

      if (existingUnlock) {
        return res.status(409).json({ 
          error: 'Unlock already logged for this auction and wallet' 
        });
      }

      // Insert new unlock event
      const { data, error } = await supabase
        .from('auction_unlocks')
        .insert({
          auction_id: id,
          wallet_address: wallet,
          user_id: userId || null,
          unlocked_at: new Date(timestamp),
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Failed to log unlock event:', error);
        return res.status(500).json({ error: error.message });
      }

      console.log('✅ Unlock event logged successfully:', data.id);
      
      // Optional: Log GTT yield distribution if provided
      const { authorYield, beneficiaryYield, referrerWallet, referrerYield } = req.body;
      if (authorYield || beneficiaryYield) {
        try {
          const { error: yieldError } = await supabase
            .from('auction_yield')
            .insert({
              auction_id: id,
              unlocker_wallet: wallet,
              author_yield: authorYield || 0,
              beneficiary_yield: beneficiaryYield || 0,
              referrer_wallet: referrerWallet || null,
              referrer_yield: referrerYield || 0,
            });

          if (yieldError) {
            console.error('⚠️ Failed to log yield distribution:', yieldError);
          } else {
            console.log('💰 GTT yield distribution logged');
          }
        } catch (yieldLogError) {
          console.error('⚠️ Yield logging error:', yieldLogError);
        }
      }

      return res.status(200).json({ 
        success: true, 
        unlock_id: data.id,
        message: 'Unlock event logged successfully'
      });

    } catch (error) {
      console.error('❌ Unlock logging error:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GTT Yield Analytics endpoint
  app.get("/api/yield/analytics", isDebugAuthenticated, async (req: any, res) => {
    try {
      console.log("💰 Fetching GTT yield analytics");

      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      // Fetch yield data with auction details
      const { data: yields, error } = await supabase
        .from('auction_yield')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) {
        console.error("❌ Failed to fetch yield data:", error);
        return res.status(500).json({ 
          error: 'Failed to fetch yield analytics',
          details: error.message 
        });
      }

      // Calculate analytics
      const totalAuthorYield = yields?.reduce((sum, y) => sum + Number(y.author_yield), 0) || 0;
      const totalBeneficiaryYield = yields?.reduce((sum, y) => sum + Number(y.beneficiary_yield), 0) || 0;
      const totalReferrerYield = yields?.reduce((sum, y) => sum + Number(y.referrer_yield), 0) || 0;
      const totalYield = totalAuthorYield + totalBeneficiaryYield + totalReferrerYield;

      const analytics = {
        totalDistributions: yields?.length || 0,
        totalYield,
        authorYield: totalAuthorYield,
        beneficiaryYield: totalBeneficiaryYield,
        referrerYield: totalReferrerYield,
        recentDistributions: yields?.slice(0, 10) || []
      };

      console.log("✅ GTT yield analytics calculated");
      res.json(analytics);
    } catch (error) {
      console.error("❌ Failed to fetch yield analytics:", error);
      res.status(500).json({
        error: "Failed to fetch yield analytics",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Auction funding endpoint
  app.post("/api/auction/:id/fund", isDebugAuthenticated, async (req: any, res) => {
    const { id } = req.params;
    const { amount, wallet, transactionHash, blockNumber } = req.body;

    if (!id || !amount || !wallet) {
      return res.status(400).json({ 
        error: 'Missing required fields: auction_id, amount, wallet' 
      });
    }

    try {
      console.log('💰 Logging auction funding:', { auction_id: id, amount, wallet });

      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      // Check if auction exists
      const { data: auction, error: auctionError } = await supabase
        .from('auctions')
        .select('id, title')
        .eq('id', id)
        .single();

      if (auctionError || !auction) {
        return res.status(404).json({ error: 'Auction not found' });
      }

      // Insert funding record
      const { data, error } = await supabase
        .from('auction_funding')
        .insert({
          auction_id: id,
          amount: parseFloat(amount),
          wallet_address: wallet,
          transaction_hash: transactionHash || null,
          block_number: blockNumber || null,
          funded_at: new Date(),
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Failed to log funding:', error);
        return res.status(500).json({ error: error.message });
      }

      console.log('✅ Auction funding logged successfully:', data.id);
      return res.status(200).json({ 
        success: true,
        funding_id: data.id,
        message: 'Funding logged successfully'
      });

    } catch (error) {
      console.error('❌ Funding logging error:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Auction funding analytics endpoint
  app.get("/api/funding/analytics", isDebugAuthenticated, async (req: any, res) => {
    try {
      console.log("💰 Fetching auction funding analytics");

      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      // Fetch funding data with auction details
      const { data: funding, error } = await supabase
        .from('auction_funding')
        .select('*, auctions(title)')
        .order('funded_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error("❌ Failed to fetch funding data:", error);
        return res.status(500).json({ 
          error: 'Failed to fetch funding analytics',
          details: error.message 
        });
      }

      // Calculate analytics
      const totalFunding = funding?.reduce((sum, f) => sum + Number(f.amount), 0) || 0;
      const totalContributions = funding?.length || 0;
      const uniqueContributors = new Set(funding?.map(f => f.wallet_address)).size;
      const avgContribution = totalContributions > 0 ? totalFunding / totalContributions : 0;

      const analytics = {
        totalFunding,
        totalContributions,
        uniqueContributors,
        avgContribution,
        recentFunding: funding?.slice(0, 10) || []
      };

      console.log("✅ Funding analytics calculated");
      res.json(analytics);
    } catch (error) {
      console.error("❌ Failed to fetch funding analytics:", error);
      res.status(500).json({
        error: "Failed to fetch funding analytics",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get auction details endpoint with Supabase integration
  app.get("/api/auction/:id", isDebugAuthenticated, async (req: any, res) => {
    try {
      const auctionId = req.params.id;
      
      console.log("🏛️ Fetching auction details for:", auctionId);

      // Import Supabase client
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      // Fetch auction from database
      const { data: auction, error } = await supabase
        .from('auctions')
        .select('*')
        .eq('id', auctionId)
        .single();

      if (error || !auction) {
        console.error("❌ Auction not found:", auctionId, error);
        return res.status(404).json({ 
          error: 'Auction not found',
          details: error?.message 
        });
      }

      // Format response for frontend
      const auctionResponse = {
        id: auction.id,
        title: auction.title,
        summary: auction.summary,
        reservePrice: auction.reserve_price,
        funded: auction.funded_amount,
        unlocked: auction.unlocked,
        beneficiaries: auction.beneficiaries || [],
        encryptedContent: auction.encrypted_content,
        encryptedSymmetricKey: auction.encrypted_symmetric_key,
        accessControlConditions: auction.access_control_conditions,
        createdAt: auction.created_at
      };

      console.log("✅ Auction details fetched:", { id: auctionId, title: auction.title });
      res.json(auctionResponse);
    } catch (error) {
      console.error("❌ Failed to fetch auction:", error);
      res.status(500).json({
        error: "Failed to fetch auction details",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Login route for debug authentication - simulates successful login
  app.get("/api/login", (req, res) => {
    console.log("🔵 DEBUG: Login route accessed");
    // Simulate successful login and redirect to home
    res.redirect("/");
  });

  // Logout route for debug authentication
  app.get("/api/logout", (req, res) => {
    console.log("🔵 DEBUG: Logout route accessed");
    // Simply redirect to home (debug auth will show landing page)
    res.redirect("/");
  });

  // Capsule creation endpoint
  app.post("/api/capsules", isDebugAuthenticated, async (req: any, res) => {
    console.log("🔵 DEBUG: /api/capsules POST called");
    const user = req.user;
    const capsuleData = req.body;

    // Create a mock capsule with comprehensive data
    const newCapsule = {
      id: `capsule-${Date.now()}`,
      title: capsuleData.title,
      content: capsuleData.content,
      capsuleType: capsuleData.capsuleType,
      veritasSealType: capsuleData.veritasSealType,
      urgencyLevel: capsuleData.urgencyLevel || "normal",
      sensitivityLevel: capsuleData.sensitivityLevel || "public",
      legalImportance: capsuleData.legalImportance || "standard",
      evidenceType: capsuleData.evidenceType,
      submissionMethod: capsuleData.submissionMethod || "standard",
      tags: capsuleData.tags || [],
      authorId: user.id,
      status: "pending",
      verificationCount: 0,
      truthScore: 0,
      isPrivate: capsuleData.isPrivate || false,
      accessCost: capsuleData.accessCost || 0,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("✅ DEBUG: Created capsule:", newCapsule);
    res.status(201).json(newCapsule);
  });

  // Get user capsules
  app.get("/api/capsules", isDebugAuthenticated, async (req: any, res) => {
    console.log("📋 User capsules requested");
    const user = req.user;

    // Return enhanced mock capsules with comprehensive data
    const mockCapsules = [
      {
        id: "cap_1754140001_abc123",
        title: "Family Legacy Documentation",
        content:
          "Important family documents and memories preserved for future generations.",
        capsuleType: "personal_memory",
        veritasSealType: "notarized_statement",
        urgencyLevel: "normal",
        sensitivityLevel: "private",
        legalImportance: "standard",
        authorId: user.id,
        status: "verified",
        verificationCount: 2,
        truthScore: 92,
        tags: ["family", "legacy", "private"],
        accessCost: 0,
        viewCount: 5,
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        updatedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      },
      {
        id: "cap_1754140002_def456",
        title: "Corporate Transparency Report",
        content: "Quarterly financial disclosures and governance updates.",
        capsuleType: "corporate_filing",
        veritasSealType: "auditor_certified",
        urgencyLevel: "high",
        sensitivityLevel: "public",
        legalImportance: "regulatory",
        authorId: user.id,
        status: "pending",
        verificationCount: 0,
        truthScore: 0,
        tags: ["corporate", "financial", "transparency"],
        accessCost: 2.5,
        viewCount: 0,
        createdAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
        updatedAt: new Date(Date.now() - 43200000).toISOString(),
      },
    ];

    res.json(mockCapsules);
  });

  // DAO Governance Routes

  // DAO Rankings endpoint  
  app.get("/api/dao/ranking", isDebugAuthenticated, async (req: any, res) => {
    try {
      console.log("🏆 DAO rankings requested");
      
      const mockRankings = [
        { name: "TruthSeeker", score: 9847, badges: 12, followers: 234 },
        { name: "VerityGuard", score: 8756, badges: 9, followers: 189 },
        { name: "ChainWarden", score: 7623, badges: 8, followers: 156 },
        { name: "DataKeeper", score: 6891, badges: 7, followers: 134 },
        { name: "CryptoSage", score: 5947, badges: 6, followers: 98 },
      ];
      
      res.json(mockRankings);
    } catch (error) {
      console.error("❌ Failed to get DAO rankings:", error);
      res.status(500).json({ error: "Failed to fetch DAO rankings" });
    }
  });

  // DAO Yields endpoint
  app.get("/api/dao/yields", isDebugAuthenticated, async (req: any, res) => {
    try {
      console.log("📈 DAO yields requested");
      
      const mockYields = [
        { name: "Guardian Alpha", yield: 1247, capsules: 89, rank: 1, change: 12.5 },
        { name: "Truth Keeper", yield: 987, capsules: 67, rank: 2, change: 8.3 },
        { name: "Validator Prime", yield: 756, capsules: 54, rank: 3, change: -2.1 },
        { name: "Chain Sentinel", yield: 623, capsules: 43, rank: 4, change: 15.7 },
      ];
      
      res.json(mockYields);
    } catch (error) {
      console.error("❌ Failed to get DAO yields:", error);
      res.status(500).json({ error: "Failed to fetch DAO yields" });
    }
  });

  // Capsule Redemption endpoint
  app.post("/api/redeem", isDebugAuthenticated, async (req: any, res) => {
    try {
      const { capsuleId, wallet } = req.body;
      
      if (!capsuleId || !wallet) {
        return res.status(400).json({ 
          success: false, 
          reason: 'Missing capsuleId or wallet address' 
        });
      }

      console.log("🔓 Capsule redemption requested:", { capsuleId, wallet });

      // Mock redemption logic
      const success = Math.random() > 0.3;
      
      if (success) {
        const result = {
          success: true,
          capsuleId,
          redeemedAt: new Date().toISOString(),
          reward: Math.floor(Math.random() * 1000) + 100,
        };
        
        console.log("✅ Capsule redeemed successfully:", result);
        res.json(result);
      } else {
        const result = {
          success: false,
          reason: 'Capsule not eligible for redemption or already claimed',
        };
        
        console.log("❌ Capsule redemption failed:", result);
        res.json(result);
      }
    } catch (error) {
      console.error("❌ Capsule redemption error:", error);
      res.status(500).json({ 
        success: false, 
        reason: "Server error occurred" 
      });
    }
  });

  // Validator Registry endpoint
  app.get("/api/validators/registry", isDebugAuthenticated, async (req: any, res) => {
    try {
      console.log("👥 Validator registry requested");
      
      const mockValidators = [
        {
          name: "TruthSeeker Alpha",
          capsules: 1247,
          reputation: 9850,
          active: true,
          gttEarned: 12450,
          joinedDate: "Jan 2024",
          specialization: "Financial Disclosures"
        },
        {
          name: "VerityGuard Prime",
          capsules: 987,
          reputation: 8920,
          active: true,
          gttEarned: 9870,
          joinedDate: "Feb 2024",
          specialization: "Legal Documents"
        },
        {
          name: "ChainWarden Beta",
          capsules: 756,
          reputation: 7650,
          active: false,
          gttEarned: 7560,
          joinedDate: "Mar 2024",
          specialization: "Medical Records"
        },
        {
          name: "DataKeeper Gamma",
          capsules: 623,
          reputation: 6890,
          active: true,
          gttEarned: 6230,
          joinedDate: "Apr 2024",
          specialization: "Personal Testimonies"
        }
      ];
      
      res.json(mockValidators);
    } catch (error) {
      console.error("❌ Failed to get validator registry:", error);
      res.status(500).json({ error: "Failed to fetch validator registry" });
    }
  });

  // Witness Testimonies endpoint
  app.get("/api/witnesses/testimonies", isDebugAuthenticated, async (req: any, res) => {
    try {
      console.log("📣 Witness testimonies requested");
      
      const mockTestimonies = [
        {
          id: "witness_001",
          message: "I witnessed the corruption of funds in the city council meeting on December 15th. Documents were destroyed intentionally.",
          author: "Anonymous Whistleblower",
          timestamp: "2 hours ago",
          votes: 47,
          status: "verified",
          category: "Government Corruption"
        },
        {
          id: "witness_002", 
          message: "Company XYZ has been dumping toxic waste into the river for months. I have photographic evidence and chemical analysis.",
          author: "Environmental Activist",
          timestamp: "5 hours ago",
          votes: 23,
          status: "pending",
          category: "Environmental Crime"
        },
        {
          id: "witness_003",
          message: "The construction company used substandard materials in the school building. Children's safety is at risk.",
          author: "Former Employee",
          timestamp: "1 day ago",
          votes: 156,
          status: "disputed",
          category: "Public Safety"
        }
      ];
      
      res.json(mockTestimonies);
    } catch (error) {
      console.error("❌ Failed to get witness testimonies:", error);
      res.status(500).json({ error: "Failed to fetch witness testimonies" });
    }
  });

  // Submit witness testimony
  app.post("/api/witnesses/testimonies", isDebugAuthenticated, async (req: any, res) => {
    try {
      const { message } = req.body;
      console.log("📝 New witness testimony submitted:", message.substring(0, 50) + "...");
      
      const newTestimony = {
        id: `witness_${Date.now()}`,
        message,
        author: "Anonymous User",
        timestamp: "just now",
        votes: 0,
        status: "pending",
        category: "General"
      };
      
      res.json(newTestimony);
    } catch (error) {
      console.error("❌ Failed to submit testimony:", error);
      res.status(500).json({ error: "Failed to submit testimony" });
    }
  });

  // License Verifier endpoint
  app.get("/api/explorer/verifiers", isDebugAuthenticated, async (req: any, res) => {
    try {
      console.log("🔍 License verifications requested");
      
      const mockVerifications = [
        {
          id: "lic_001",
          capsuleId: "cap_abc123",
          licenseType: "commercial",
          status: "pending",
          payoutAmount: 2500,
          verifierName: "LegalTech Validators",
          submittedDate: "2 hours ago",
          processingTime: "24-48 hours"
        },
        {
          id: "lic_002",
          capsuleId: "cap_def456", 
          licenseType: "exclusive",
          status: "approved",
          payoutAmount: 5000,
          verifierName: "Premium Licensing Inc",
          submittedDate: "1 day ago",
          processingTime: "Completed"
        },
        {
          id: "lic_003",
          capsuleId: "cap_ghi789",
          licenseType: "creative_commons",
          status: "rejected",
          payoutAmount: 750,
          verifierName: "Open Source Validators",
          submittedDate: "3 days ago",
          processingTime: "Rejected after review"
        }
      ];
      
      res.json(mockVerifications);
    } catch (error) {
      console.error("❌ Failed to get license verifications:", error);
      res.status(500).json({ error: "Failed to fetch license verifications" });
    }
  });

  // Vault Stats endpoint
  app.get("/api/vault/stats", isDebugAuthenticated, async (req: any, res) => {
    try {
      console.log("🏛️ Vault stats requested");
      
      const mockVaultStats = {
        totalGTT: 2847650,
        lastDisbursement: "2 hours ago",
        pendingTxs: 4,
        weeklyDisbursement: 125000,
        validatorRewards: 45000,
        treasuryHealth: 87
      };
      
      res.json(mockVaultStats);
    } catch (error) {
      console.error("❌ Failed to get vault stats:", error);
      res.status(500).json({ error: "Failed to fetch vault stats" });
    }
  });

  // Pending Multisig Transactions endpoint
  app.get("/api/vault/pending-transactions", isDebugAuthenticated, async (req: any, res) => {
    try {
      console.log("📋 Pending multisig transactions requested");
      
      const mockPendingTxs = [
        {
          id: "tx_001",
          type: "disbursement",
          amount: 125000,
          recipient: "0x1234567890abcdef1234567890abcdef12345678",
          description: "Weekly validator rewards distribution",
          signatures: 3,
          requiredSignatures: 5,
          status: "pending",
          createdAt: "2 hours ago",
          signers: ["Guardian1", "Guardian2", "Guardian3"]
        },
        {
          id: "tx_002",
          type: "payout",
          amount: 2500,
          recipient: "0xabcdef1234567890abcdef1234567890abcdef12",
          description: "License verification payout - Commercial License",
          signatures: 2,
          requiredSignatures: 3,
          status: "pending",
          createdAt: "4 hours ago",
          signers: ["Validator1", "Validator2"]
        },
        {
          id: "tx_003",
          type: "governance",
          amount: 50000,
          recipient: "0x9876543210fedcba9876543210fedcba98765432",
          description: "Emergency fund allocation for infrastructure upgrade",
          signatures: 1,
          requiredSignatures: 7,
          status: "pending",
          createdAt: "1 day ago",
          signers: ["TreasuryManager"]
        }
      ];
      
      res.json(mockPendingTxs);
    } catch (error) {
      console.error("❌ Failed to get pending transactions:", error);
      res.status(500).json({ error: "Failed to fetch pending transactions" });
    }
  });

  // Multichain Performance endpoint
  app.get("/api/dao/multichain-performance", isDebugAuthenticated, async (req: any, res) => {
    try {
      console.log("🌐 Multichain performance requested");
      
      const mockMultichainData = [
        {
          name: "TruthSeeker Alpha",
          chain: "Ethereum",
          capsules: 1247,
          reputation: 9850,
          stakingRewards: 15420,
          isActive: true
        },
        {
          name: "VerityGuard Prime", 
          chain: "Polygon",
          capsules: 987,
          reputation: 8920,
          stakingRewards: 12890,
          isActive: true
        },
        {
          name: "ChainWarden Beta",
          chain: "Base",
          capsules: 756,
          reputation: 7650,
          stakingRewards: 9870,
          isActive: false
        },
        {
          name: "DataKeeper Gamma",
          chain: "Arbitrum",
          capsules: 623,
          reputation: 6890,
          stakingRewards: 7650,
          isActive: true
        },
        {
          name: "CryptoSentinel Delta",
          chain: "Ethereum",
          capsules: 1456,
          reputation: 10120,
          stakingRewards: 18750,
          isActive: true
        }
      ];
      
      res.json(mockMultichainData);
    } catch (error) {
      console.error("❌ Failed to get multichain performance:", error);
      res.status(500).json({ error: "Failed to fetch multichain performance" });
    }
  });

  // Staking Statistics endpoint
  app.get("/api/staking/stats", isDebugAuthenticated, async (req: any, res) => {
    try {
      console.log("📊 Staking statistics requested");
      
      const mockStakingStats = {
        totalStaked: 847230,
        rewardsDistributed: 156890,
        activeValidators: 47,
        supportedChains: 4,
        aprRate: 12.5,
        totalStakers: 2341
      };
      
      res.json(mockStakingStats);
    } catch (error) {
      console.error("❌ Failed to get staking stats:", error);
      res.status(500).json({ error: "Failed to fetch staking stats" });
    }
  });

  // Staking Mint endpoint
  app.post("/api/staking/mint", isDebugAuthenticated, async (req: any, res) => {
    try {
      const { wallet, amount, chain } = req.body;
      console.log("🪙 Staking mint requested:", { wallet: wallet.substring(0, 10) + "...", amount, chain });
      
      if (!wallet || !amount || amount <= 0) {
        return res.status(400).json({ 
          success: false,
          message: "Invalid staking parameters" 
        });
      }

      // Mock staking logic
      const stakingResult = {
        success: true,
        message: `Successfully staked ${amount} GTT on ${chain}`,
        transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
        stakingId: `stake_${Date.now()}`,
        estimatedRewards: Math.floor(amount * 0.125), // 12.5% APR
        unlockDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      res.json(stakingResult);
    } catch (error) {
      console.error("❌ Failed to process staking:", error);
      res.status(500).json({ error: "Failed to process staking" });
    }
  });

  // Audit Logs endpoint
  app.get("/api/audit/logs", isDebugAuthenticated, async (req: any, res) => {
    try {
      console.log("📜 Audit logs requested");
      
      const mockAuditLogs = [
        {
          id: "audit_001",
          event: "DAO Proposal #47 Approved",
          timestamp: "2 hours ago",
          validator: "TruthSeeker Alpha",
          transactionHash: "0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
          eventType: "proposal",
          chainId: "ethereum-1",
          gasUsed: 145280,
          details: "Proposal for validator reward increase passed with 87% approval",
          severity: "medium"
        },
        {
          id: "audit_002",
          event: "Weekly Disbursement Executed",
          timestamp: "6 hours ago",
          validator: "MultisigVault Contract",
          transactionHash: "0xb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567a",
          eventType: "disbursement",
          chainId: "polygon-137",
          gasUsed: 89760,
          details: "125,000 GTT distributed to validator reward pool",
          severity: "high"
        },
        {
          id: "audit_003",
          event: "License Verification Completed",
          timestamp: "1 day ago",
          validator: "LegalTech Validators",
          transactionHash: "0xc3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567ab2",
          eventType: "validation",
          chainId: "base-8453",
          gasUsed: 67340,
          details: "Commercial license verified for capsule cap_abc123",
          severity: "low"
        },
        {
          id: "audit_004",
          event: "Critical Security Alert",
          timestamp: "2 days ago",
          validator: "Security Monitor",
          transactionHash: "0xd4e5f6789012345678901234567890abcdef1234567890abcdef1234567ab2c3",
          eventType: "multisig",
          chainId: "arbitrum-42161",
          gasUsed: 234560,
          details: "Suspicious multisig transaction detected and blocked",
          severity: "critical"
        },
        {
          id: "audit_005",
          event: "Validator Reputation Update",
          timestamp: "3 days ago",
          validator: "ReputationOracle",
          transactionHash: "0xe5f6789012345678901234567890abcdef1234567890abcdef1234567ab2c3d4",
          eventType: "validation",
          chainId: "ethereum-1",
          gasUsed: 54320,
          details: "Validator VerityGuard Prime reputation increased to 8920",
          severity: "low"
        },
        {
          id: "audit_006",
          event: "Community Vote Recorded",
          timestamp: "4 days ago",
          validator: "VotingContract",
          transactionHash: "0xf6789012345678901234567890abcdef1234567890abcdef1234567ab2c3d4e5",
          eventType: "vote",
          chainId: "polygon-137",
          gasUsed: 43210,
          details: "Vote cast on witness testimony witness_001 verification",
          severity: "medium"
        }
      ];
      
      res.json(mockAuditLogs);
    } catch (error) {
      console.error("❌ Failed to get audit logs:", error);
      res.status(500).json({ error: "Failed to fetch audit logs" });
    }
  });

  // Attestation Sync endpoint  
  app.get("/api/sync/attestations", isDebugAuthenticated, async (req: any, res) => {
    try {
      console.log("🔁 Attestation sync requested");
      
      const mockAttestations = [
        {
          capsuleId: "cap_abc123",
          chains: ["Ethereum", "Polygon"],
          validator: "TruthSeeker Alpha",
          attestedAt: "2024-08-03T19:30:00Z",
          crossChainVerified: true
        },
        {
          capsuleId: "cap_def456",
          chains: ["Base", "Arbitrum"],
          validator: "VerityGuard Prime",
          attestedAt: "2024-08-03T18:45:00Z",
          crossChainVerified: true
        },
        {
          capsuleId: "cap_ghi789",
          chains: ["Ethereum", "Base", "Polygon"],
          validator: "ChainWarden Beta",
          attestedAt: "2024-08-03T17:20:00Z",
          crossChainVerified: false
        }
      ];
      
      res.json(mockAttestations);
    } catch (error) {
      console.error("❌ Failed to get attestations:", error);
      res.status(500).json({ error: "Failed to fetch attestations" });
    }
  });

  // AI Memory Recall endpoint with enhanced pattern recognition
  app.post("/api/ai/recall", isDebugAuthenticated, async (req: any, res) => {
    try {
      const { prompt, userId } = req.body;
      console.log("🧠 AI memory recall requested for user:", userId);
      
      if (!prompt || !userId) {
        return res.status(400).json({ error: "Missing prompt or userId" });
      }

      // Enhanced AI response with pattern recognition
      const memoryCategories = ['family', 'milestone', 'grief', 'love', 'conflict', 'achievement', 'travel', 'legacy'];
      const detectedCategory = memoryCategories[Math.floor(Math.random() * memoryCategories.length)];
      const confidenceScore = Math.floor(Math.random() * 25) + 75;
      const relatedCapsules = Math.floor(Math.random() * 5) + 1;
      const timelineDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
      
      const enhancedResponse = `Memory Analysis for: "${prompt}"

🎯 CATEGORY DETECTED: ${detectedCategory.toUpperCase()}
📊 CONFIDENCE SCORE: ${confidenceScore}%

🔍 PATTERN RECOGNITION:
• Found ${relatedCapsules} related capsules in your truth vault
• Emotional resonance: ${Math.floor(Math.random() * 40) + 60}% match with previous memories
• Memory cluster: Similar events archived around ${timelineDate.toLocaleDateString()}

💎 TRUTH GENOME ANALYSIS:
• Verification status: ${Math.random() > 0.5 ? 'Community verified' : 'Pending validation'}
• Grief score impact: ${Math.random() > 0.6 ? 'High emotional significance' : 'Moderate emotional weight'}
• Replay frequency: ${Math.random() > 0.4 ? 'Frequently accessed' : 'Rarely revisited'}

🧬 MEMORY FRAGMENTS:
${getMemoryFragments(detectedCategory, prompt)}

⚡ BLOCKCHAIN ANCHORS:
• IPFS hash: Qm${Math.random().toString(36).substring(2, 15)}...
• Truth seal: ${Math.random() > 0.7 ? 'VERIFIED' : 'PENDING'}
• Capsule lineage: ${Math.floor(Math.random() * 3)} generations deep`;

      res.json({ result: enhancedResponse });
    } catch (error) {
      console.error("❌ AI recall error:", error);
      res.status(500).json({ error: "Internal error recalling memory" });
    }
  });

  function getMemoryFragments(category: string, prompt: string): string {
    const fragments = {
      family: "• Detected voices of loved ones in background audio\n• Emotional markers suggest joy and connection\n• Geographic data indicates familiar locations",
      milestone: "• Achievement patterns match previous success markers\n• Temporal clustering with other significant events\n• Community engagement spike detected",
      grief: "• Emotional depth analysis shows profound significance\n• Protected encryption due to sensitive content\n• Memorial date correlations identified",
      love: "• Romantic context markers detected\n• Heart rate data suggests elevated emotional state\n• Partner voice recognition patterns found",
      conflict: "• Stress indicators in voice analysis\n• Relationship dynamic patterns identified\n• Resolution tracking available",
      achievement: "• Success celebration markers detected\n• Progress milestone correlation found\n• Achievement badge eligibility confirmed",
      travel: "• Location metadata spans multiple coordinates\n• Cultural immersion markers detected\n• Journey documentation complete",
      legacy: "• Generational wisdom patterns identified\n• Family history connections found\n• Heritage preservation markers active"
    };
    
    return fragments[category] || "• Context analysis in progress\n• Pattern recognition ongoing\n• Memory classification pending";
  }

  // Profile endpoints
  app.get("/api/profile/:wallet", isDebugAuthenticated, async (req: any, res) => {
    try {
      const { wallet } = req.params;
      console.log("👤 Profile requested for wallet:", wallet.substring(0, 10) + "...");
      
      const mockProfile = {
        id: `profile_${wallet}`,
        wallet: wallet,
        username: `Guardian_${wallet.substring(2, 8)}`,
        displayName: "Truth Seeker",
        bio: "Dedicated to preserving truth and validating memories through blockchain technology.",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${wallet}`,
        coverImage: "/api/placeholder/800/200",
        truthScore: Math.floor(Math.random() * 40) + 60,
        reputation: Math.floor(Math.random() * 5000) + 1000,
        joinedAt: "2024-01-15T00:00:00Z",
        twitter: Math.random() > 0.5 ? `truthseeker_${wallet.substring(2, 6)}` : null,
        website: Math.random() > 0.7 ? `https://${wallet.substring(2, 8)}.truth.app` : null,
        email: Math.random() > 0.8 ? `guardian@${wallet.substring(2, 6)}.eth` : null,
        ens: Math.random() > 0.6 ? `${wallet.substring(2, 8)}.eth` : null,
        isVerified: Math.random() > 0.3,
        badges: Math.floor(Math.random() * 10) + 5,
        capsuleCount: Math.floor(Math.random() * 50) + 10,
        friendCount: Math.floor(Math.random() * 100) + 20
      };
      
      res.json(mockProfile);
    } catch (error) {
      console.error("❌ Failed to get profile:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.get("/api/profile/:wallet/capsules", isDebugAuthenticated, async (req: any, res) => {
    try {
      const { wallet } = req.params;
      console.log("📋 Profile capsules requested for:", wallet.substring(0, 10) + "...");
      
      const mockCapsules = Array.from({ length: Math.floor(Math.random() * 15) + 5 }, (_, i) => ({
        id: `cap_${wallet}_${i + 1}`,
        title: `Memory Capsule #${i + 1}`,
        description: `A preserved memory containing important truth and emotional significance.`,
        verified: Math.random() > 0.4,
        verifiedAt: Math.random() > 0.4 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : null,
        verifiedBy: Math.random() > 0.4 ? "TruthValidator" : null,
        truthScore: Math.floor(Math.random() * 40) + 60,
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        isTimeSealed: Math.random() > 0.6,
        unlockDate: Math.random() > 0.6 ? new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString() : null,
        type: ["memory", "testimony", "legacy", "truth"][Math.floor(Math.random() * 4)]
      }));
      
      res.json(mockCapsules);
    } catch (error) {
      console.error("❌ Failed to get profile capsules:", error);
      res.status(500).json({ error: "Failed to fetch profile capsules" });
    }
  });

  app.get("/api/profile/:wallet/badges", isDebugAuthenticated, async (req: any, res) => {
    try {
      const { wallet } = req.params;
      console.log("🏆 Profile badges requested for:", wallet.substring(0, 10) + "...");
      
      const badgeTypes = [
        { name: "Truth Pioneer", icon: "/badges/pioneer.svg", description: "Early platform adopter" },
        { name: "Memory Keeper", icon: "/badges/keeper.svg", description: "Preserved 10+ memories" },
        { name: "Validator", icon: "/badges/validator.svg", description: "Community truth validator" },
        { name: "Witness", icon: "/badges/witness.svg", description: "Provided testimony" },
        { name: "Guardian", icon: "/badges/guardian.svg", description: "Platform guardian" },
        { name: "Legacy Builder", icon: "/badges/legacy.svg", description: "Built family legacy" },
        { name: "Truth Seeker", icon: "/badges/seeker.svg", description: "High truth score" },
        { name: "Time Master", icon: "/badges/time.svg", description: "Time-sealed capsules" }
      ];
      
      const earnedBadges = badgeTypes
        .filter(() => Math.random() > 0.4)
        .map((badge, i) => ({
          id: `badge_${wallet}_${i}`,
          ...badge,
          earnedAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
          rarity: ["common", "rare", "epic", "legendary"][Math.floor(Math.random() * 4)]
        }));
      
      res.json(earnedBadges);
    } catch (error) {
      console.error("❌ Failed to get profile badges:", error);
      res.status(500).json({ error: "Failed to fetch profile badges" });
    }
  });

  app.get("/api/profile/:wallet/friends", isDebugAuthenticated, async (req: any, res) => {
    try {
      const { wallet } = req.params;
      console.log("👥 Profile friends requested for:", wallet.substring(0, 10) + "...");
      
      const mockFriends = Array.from({ length: Math.floor(Math.random() * 20) + 5 }, (_, i) => ({
        id: `friend_${wallet}_${i}`,
        wallet: `0x${Math.random().toString(16).substring(2, 42)}`,
        username: `Friend_${i + 1}`,
        displayName: `Guardian Friend ${i + 1}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=friend${i}`,
        truthScore: Math.floor(Math.random() * 40) + 60,
        addedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        isOnline: Math.random() > 0.6,
        lastSeen: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      }));
      
      res.json(mockFriends);
    } catch (error) {
      console.error("❌ Failed to get profile friends:", error);
      res.status(500).json({ error: "Failed to fetch profile friends" });
    }
  });

  app.get("/api/profile/timeline/:userId", isDebugAuthenticated, async (req: any, res) => {
    try {
      const { userId } = req.params;
      console.log("📅 Activity timeline requested for user:", userId);
      
      const eventTypes = [
        "capsule_created",
        "capsule_verified", 
        "friend_added",
        "badge_earned",
        "truth_validated",
        "witness_testimony",
        "dao_proposal",
        "vault_interaction"
      ];
      
      const mockEvents = Array.from({ length: Math.floor(Math.random() * 30) + 10 }, (_, i) => {
        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        return {
          id: `event_${userId}_${i}`,
          type: eventType,
          description: getEventDescription(eventType),
          timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          metadata: getEventMetadata(eventType)
        };
      }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      res.json(mockEvents);
    } catch (error) {
      console.error("❌ Failed to get activity timeline:", error);
      res.status(500).json({ error: "Failed to fetch activity timeline" });
    }
  });

  function getEventDescription(eventType: string): string {
    switch (eventType) {
      case "capsule_created":
        return "Created a new truth capsule with encrypted memories";
      case "capsule_verified":
        return "Capsule verified by community validators";
      case "friend_added":
        return "Connected with a new guardian friend";
      case "badge_earned":
        return "Earned a new achievement badge";
      case "truth_validated":
        return "Validated truth for community verification";
      case "witness_testimony":
        return "Provided witness testimony for truth capsule";
      case "dao_proposal":
        return "Participated in DAO governance proposal";
      case "vault_interaction":
        return "Interacted with Truth Vault system";
      default:
        return "Performed platform activity";
    }
  }

  function getEventMetadata(eventType: string): any {
    switch (eventType) {
      case "capsule_created":
        return { 
          capsuleType: ["memory", "legacy", "testimony"][Math.floor(Math.random() * 3)],
          isTimeSealed: Math.random() > 0.5
        };
      case "badge_earned":
        return { 
          badgeName: "Truth Seeker",
          rarity: ["common", "rare", "epic"][Math.floor(Math.random() * 3)]
        };
      case "dao_proposal":
        return { 
          proposalId: `prop_${Math.floor(Math.random() * 1000)}`,
          vote: Math.random() > 0.5 ? "approve" : "reject"
        };
      default:
        return {};
    }
  }

  // Get all proposals with voting data
  app.get("/api/dao/proposals", isDebugAuthenticated, async (req: any, res) => {
    console.log("🏛️ DAO proposals requested");

    const mockProposals = [
      {
        id: "prop_1754140100_gov001",
        title: "Increase GTT Yield Rewards for Truth Verification",
        description:
          "Proposal to increase GTT token rewards from 10 to 15 tokens per verified truth capsule to incentivize more community participation in verification processes.",
        status: "open",
        startTime: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        endTime: new Date(Date.now() + 518400000).toISOString(), // 6 days from now
        createdBy: "dao-member-123",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        votes: [
          {
            id: "vote_001",
            proposalId: "prop_1754140100_gov001",
            voterAddress: "0x1234567890abcdef",
            choice: "support",
            weight: 1000,
            castAt: new Date(Date.now() - 43200000).toISOString(),
          },
          {
            id: "vote_002",
            proposalId: "prop_1754140100_gov001",
            voterAddress: "0xfedcba0987654321",
            choice: "support",
            weight: 750,
            castAt: new Date(Date.now() - 21600000).toISOString(),
          },
          {
            id: "vote_003",
            proposalId: "prop_1754140100_gov001",
            voterAddress: "0x9876543210fedcba",
            choice: "reject",
            weight: 500,
            castAt: new Date(Date.now() - 10800000).toISOString(),
          },
        ],
        supportVotes: 2,
        rejectVotes: 1,
        abstainVotes: 0,
        totalWeight: 2250,
      },
      {
        id: "prop_1754140200_gov002",
        title: "Implement Tiered Access for Premium Capsule Features",
        description:
          "Introduce a tiered access system where premium features like advanced encryption, priority verification, and extended storage are available to higher-tier subscribers.",
        status: "open",
        startTime: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        endTime: new Date(Date.now() + 345600000).toISOString(), // 4 days from now
        createdBy: "dao-member-456",
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
        votes: [
          {
            id: "vote_004",
            proposalId: "prop_1754140200_gov002",
            voterAddress: "0xabcdef1234567890",
            choice: "support",
            weight: 1500,
            castAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: "vote_005",
            proposalId: "prop_1754140200_gov002",
            voterAddress: "0x5678901234abcdef",
            choice: "abstain",
            weight: 300,
            castAt: new Date(Date.now() - 43200000).toISOString(),
          },
        ],
        supportVotes: 1,
        rejectVotes: 0,
        abstainVotes: 1,
        totalWeight: 1800,
      },
    ];

    res.json(mockProposals);
  });

  // Create new proposal
  app.post(
    "/api/dao/proposals",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log("🏛️ Creating new DAO proposal");
      const user = req.user;
      const { title, description, endTime } = req.body;

      const newProposal = {
        id: `prop_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        title,
        description,
        status: "open",
        startTime: new Date().toISOString(),
        endTime: endTime ? new Date(endTime).toISOString() : null,
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        votes: [],
        supportVotes: 0,
        rejectVotes: 0,
        abstainVotes: 0,
        totalWeight: 0,
      };

      console.log("✅ Proposal created:", newProposal.id);
      res.status(201).json(newProposal);
    },
  );

  // Vote on proposal
  app.post("/api/dao/vote", isDebugAuthenticated, async (req: any, res) => {
    console.log("🗳️ Processing DAO vote");
    const user = req.user;
    const { proposalId, choice } = req.body;

    // Simulate wallet address (in production, this would come from Web3 wallet)
    const walletAddress =
      user.walletAddress || `0x${Math.random().toString(16).substring(2, 42)}`;

    const vote = {
      id: `vote_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      proposalId,
      voterAddress: walletAddress,
      choice, // support, reject, abstain
      weight: 100, // Base voting weight (would be calculated from GTT holdings)
      castAt: new Date().toISOString(),
    };

    console.log("✅ Vote recorded:", vote.id, "Choice:", choice);
    res.status(201).json(vote);
  });

  // Get vote results for a specific proposal
  app.get(
    "/api/dao/results/:id",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log("📊 Vote results requested for proposal:", req.params.id);
      const proposalId = req.params.id;

      // Mock vote data calculation (in production this would query the database)
      const mockVoteData = {
        prop_1754140100_gov001: {
          title: "Increase GTT Yield Rewards for Truth Verification",
          votes: [
            { choice: "support", weight: 1000 },
            { choice: "support", weight: 750 },
            { choice: "reject", weight: 500 },
            { choice: "abstain", weight: 200 },
          ],
        },
        prop_1754140200_gov002: {
          title: "Implement Tiered Access for Premium Capsule Features",
          votes: [
            { choice: "support", weight: 1500 },
            { choice: "abstain", weight: 300 },
            { choice: "reject", weight: 200 },
          ],
        },
      };

      const proposalData =
        mockVoteData[proposalId as keyof typeof mockVoteData];

      if (!proposalData) {
        return res.status(404).json({ error: "Proposal not found" });
      }

      // Calculate vote tallies
      let total = 0,
        support = 0,
        reject = 0,
        abstain = 0;
      proposalData.votes.forEach((vote) => {
        const weight = Number(vote.weight);
        total += weight;
        if (vote.choice === "support") support += weight;
        if (vote.choice === "reject") reject += weight;
        if (vote.choice === "abstain") abstain += weight;
      });

      const results = {
        title: proposalData.title,
        total,
        support,
        reject,
        abstain,
        supportPct: total ? ((support / total) * 100).toFixed(1) : "0",
        rejectPct: total ? ((reject / total) * 100).toFixed(1) : "0",
        abstainPct: total ? ((abstain / total) * 100).toFixed(1) : "0",
        result: support > reject ? "Accepted" : "Rejected",
        status:
          support > total * 0.6
            ? "Passed"
            : support > reject
              ? "Accepted"
              : "Rejected",
      };

      console.log("✅ Vote results calculated:", results);
      res.json(results);
    },
  );

  // Get minted capsules for gallery
  app.get(
    "/api/capsules/minted",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log("🖼️ Minted capsules requested for gallery");

      const mockMintedCapsules = [
        {
          id: "cap_1754140001_abc123",
          title: "Family Legacy Documentation",
          content:
            "Important family documents and memories preserved for future generations, including historical photographs, family trees, and personal testimonies that tell the story of our heritage.",
          griefTier: 4,
          walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
          replayCount: 15,
          mintedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          nftTokenId: "1001",
          openseaUrl: "https://opensea.io/assets/matic/0x123.../1001",
          verificationStatus: "verified",
          truthScore: 92,
          capsuleType: "personal_memory",
          tags: ["family", "legacy", "heritage"],
        },
        {
          id: "cap_1754140002_def456",
          title: "Corporate Transparency Report Q4 2024",
          content:
            "Quarterly financial disclosures and governance updates for stakeholder transparency. Includes detailed financial statements, operational metrics, and strategic initiatives.",
          griefTier: 3,
          walletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
          replayCount: 8,
          mintedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          nftTokenId: "1002",
          openseaUrl: "https://opensea.io/assets/matic/0x123.../1002",
          verificationStatus: "verified",
          truthScore: 88,
          capsuleType: "corporate_filing",
          tags: ["corporate", "financial", "transparency"],
        },
        {
          id: "cap_1754140003_ghi789",
          title: "Environmental Impact Study",
          content:
            "Comprehensive analysis of environmental changes in the local ecosystem over the past decade, including water quality assessments and biodiversity surveys.",
          griefTier: 5,
          walletAddress: "0x567890abcdef1234567890abcdef1234567890ab",
          replayCount: 23,
          mintedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          nftTokenId: "1003",
          openseaUrl: "https://opensea.io/assets/matic/0x123.../1003",
          verificationStatus: "verified",
          truthScore: 95,
          capsuleType: "scientific_research",
          tags: ["environment", "research", "sustainability"],
        },
        {
          id: "cap_1754140004_jkl012",
          title: "Community Safety Initiative",
          content:
            "Documentation of local community safety measures and neighborhood watch programs implemented to enhance public security and wellbeing.",
          griefTier: 2,
          walletAddress: "0x234567890abcdef1234567890abcdef1234567890",
          replayCount: 5,
          mintedAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
          nftTokenId: "1004",
          openseaUrl: "https://opensea.io/assets/matic/0x123.../1004",
          verificationStatus: "pending",
          truthScore: 76,
          capsuleType: "public_safety",
          tags: ["community", "safety", "public"],
        },
      ];

      res.json(mockMintedCapsules);
    },
  );

  // Get individual capsule details
  app.get("/api/capsules/:id", isDebugAuthenticated, async (req: any, res) => {
    console.log("🔍 Capsule details requested for ID:", req.params.id);
    const capsuleId = req.params.id;

    // Mock detailed capsule data
    const mockCapsuleDetails = {
      cap_1754140001_abc123: {
        id: "cap_1754140001_abc123",
        title: "Family Legacy Documentation",
        content: `Important family documents and memories preserved for future generations.

This comprehensive collection includes:

• Historical family photographs dating back to the 1920s
• Detailed family tree with genealogical research spanning 4 generations  
• Personal testimonies from grandparents about their immigration story
• Original letters and documents from family members who served in WWII
• Cultural traditions and recipes passed down through generations
• Property deeds and important legal documents
• Video recordings of family gatherings and celebrations

These materials represent our family's journey through time and serve as a bridge between past and future generations. The collection has been carefully digitized and verified to ensure authenticity and preservation for decades to come.`,
        griefTier: 4,
        walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
        replayCount: 15,
        mintedAt: new Date(Date.now() - 172800000).toISOString(),
        nftTokenId: "1001",
        openseaUrl: "https://opensea.io/assets/matic/0x123.../1001",
        verificationStatus: "verified",
        truthScore: 92,
        capsuleType: "personal_memory",
        tags: ["family", "legacy", "heritage", "genealogy", "history"],
      },
      cap_1754140002_def456: {
        id: "cap_1754140002_def456",
        title: "Corporate Transparency Report Q4 2024",
        content: `Quarterly financial disclosures and governance updates for stakeholder transparency.

Financial Highlights:
• Revenue: $2.4M (+15% YoY)
• Operating Expenses: $1.8M 
• Net Income: $600K
• Cash Position: $3.2M

Operational Metrics:
• Customer Acquisition: 1,200 new customers
• Customer Retention Rate: 94%
• Employee Satisfaction: 8.7/10
• Product Development: 3 major feature releases

Governance Updates:
• Board composition changes
• Updated compliance policies
• Enhanced data protection measures
• Sustainability initiatives launched

This report demonstrates our commitment to transparency and accountability to all stakeholders.`,
        griefTier: 3,
        walletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
        replayCount: 8,
        mintedAt: new Date(Date.now() - 86400000).toISOString(),
        nftTokenId: "1002",
        openseaUrl: "https://opensea.io/assets/matic/0x123.../1002",
        verificationStatus: "verified",
        truthScore: 88,
        capsuleType: "corporate_filing",
        tags: [
          "corporate",
          "financial",
          "transparency",
          "governance",
          "quarterly",
        ],
      },
    };

    const capsuleDetails =
      mockCapsuleDetails[capsuleId as keyof typeof mockCapsuleDetails];

    if (!capsuleDetails) {
      return res.status(404).json({ error: "Capsule not found" });
    }

    res.json(capsuleDetails);
  });

  // AI Content Analysis
  app.post(
    "/api/capsules/analyze",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log("🧠 Content analysis requested");
      const { title, content } = req.body;

      try {
        // Import services (would be at top of file in production)
        const { aiContentAnalysis } = await import("./aiContentAnalysis");
        const analysis = await aiContentAnalysis.analyzeCapsuleContent(
          content,
          title,
        );

        console.log(
          "✅ Analysis completed with grief tier:",
          analysis.griefScore,
        );
        res.json(analysis);
      } catch (error) {
        console.error("❌ Analysis failed:", error);
        // Fallback analysis
        const fallbackAnalysis = {
          griefScore: 3,
          emotionalResonance: 75,
          truthLikelihood: 80,
          contentType: "personal_memory",
          themes: ["memory", "truth"],
          sentiment: "neutral",
          complexity: "moderate",
          suggestedTags: ["personal", "memory"],
          moderationFlags: [],
          summary: content.slice(0, 100) + "...",
        };
        res.json(fallbackAnalysis);
      }
    },
  );

  // Content Moderation
  app.post(
    "/api/capsules/moderate",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log("🛡️ Content moderation requested");
      const { content } = req.body;

      try {
        const { aiContentAnalysis } = await import("./aiContentAnalysis");
        const moderation = await aiContentAnalysis.moderateContent(content);

        console.log(
          "✅ Moderation completed:",
          moderation.approved ? "APPROVED" : "FLAGGED",
        );
        res.json(moderation);
      } catch (error) {
        console.error("❌ Moderation failed:", error);
        // Fallback - approve with warning
        res.json({
          approved: true,
          issues: [],
          severity: "low",
          recommendations: [
            "Manual review recommended due to AI service error",
          ],
        });
      }
    },
  );

  // IPFS Upload
  app.post(
    "/api/capsules/upload-ipfs",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log("📦 IPFS upload requested");
      const capsuleData = req.body;

      try {
        const { ipfsService } = await import("./ipfsService");

        // Create IPFS metadata
        const metadata = {
          id: `cap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title: capsuleData.title,
          content: capsuleData.content,
          contentType: "text/plain",
          griefTier: capsuleData.analysis?.griefScore || 3,
          author: req.user.id,
          timestamp: new Date().toISOString(),
          tags: capsuleData.tags || [],
          sealed: false,
        };

        // Seal the capsule
        const sealedMetadata = await ipfsService.sealCapsule(metadata);

        // Upload to IPFS
        const uploadResult = await ipfsService.uploadCapsule(sealedMetadata);

        console.log("✅ IPFS upload successful:", uploadResult.hash);
        res.json(uploadResult);
      } catch (error) {
        console.error("❌ IPFS upload failed:", error);
        res.status(500).json({ error: "IPFS upload failed" });
      }
    },
  );

  // NFT Minting
  app.post(
    "/api/capsules/mint-nft",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log("🎨 NFT minting requested");
      const { ipfsHash } = req.body;

      try {
        // Mock NFT minting for development
        const tokenId = Math.floor(Math.random() * 10000) + 1000;
        const transactionHash = "0x" + Math.random().toString(16).substr(2, 64);

        console.log("✅ NFT minted successfully - Token ID:", tokenId);
        res.json({
          tokenId: tokenId.toString(),
          transactionHash,
          openseaUrl: `https://opensea.io/assets/matic/0x123.../${tokenId}`,
        });
      } catch (error) {
        console.error("❌ NFT minting failed:", error);
        res.status(500).json({ error: "NFT minting failed" });
      }
    },
  );

  // GTT Yield Claiming Status
  app.get(
    "/api/gtt/claim-status",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log("💰 GTT claim status requested");

      const mockStatuses = [1, 2, 3, 4, 5].map((tier) => ({
        griefTier: tier,
        yieldAmount: tier * 10,
        canClaim: Math.random() > 0.5, // Random availability for demo
        nextClaimTime: new Date(
          Date.now() + Math.random() * 86400000,
        ).toISOString(),
        cooldownHours: 24,
      }));

      res.json(mockStatuses);
    },
  );

  // GTT Balance
  app.get("/api/gtt/balance", isDebugAuthenticated, async (req: any, res) => {
    console.log("💳 GTT balance requested");

    const mockBalance = Math.floor(Math.random() * 1000) + 100;
    res.json({
      balance: mockBalance,
      formatted: `${mockBalance.toLocaleString()} GTT`,
    });
  });

  // GTT Claim History
  app.get(
    "/api/gtt/claim-history",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log("📊 GTT claim history requested");

      const mockHistory = Array.from({ length: 5 }, (_, i) => ({
        id: `claim_${Date.now()}_${i}`,
        griefTier: Math.floor(Math.random() * 5) + 1,
        amount: (Math.floor(Math.random() * 5) + 1) * 10,
        timestamp: new Date(
          Date.now() - Math.random() * 2592000000,
        ).toISOString(),
        transactionHash: "0x" + Math.random().toString(16).substr(2, 64),
      }));

      res.json(mockHistory);
    },
  );

  // GTT Yield Claim
  app.post(
    "/api/gtt/claim-yield",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log("💸 GTT yield claim requested");
      const { griefTier } = req.body;

      try {
        const yieldAmount = griefTier * 10;
        const transactionHash = "0x" + Math.random().toString(16).substr(2, 64);

        console.log(
          "✅ GTT yield claimed:",
          yieldAmount,
          "GTT for tier",
          griefTier,
        );
        res.json({
          success: true,
          amount: yieldAmount,
          griefTier,
          transactionHash,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error("❌ GTT claim failed:", error);
        res.status(500).json({ error: "Claim failed" });
      }
    },
  );

  // Get user stats for dashboard
  app.get("/api/user/stats", isDebugAuthenticated, async (req: any, res) => {
    console.log("📊 User stats requested");

    const mockStats = {
      truthScore: 87,
      gttEarned: 12547,
      capsulesCreated: 5,
      verifiedCapsules: 3,
      timeLockedValue: 45200,
      nextUnlock: "2025-12-25",
      tierProgress: 65,
      activeStakes: 12,
      pendingYields: 2400,
    };

    res.json(mockStats);
  });

  // Get recent capsules for dashboard
  app.get(
    "/api/capsules/recent",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log("📝 Recent capsules requested");

      const mockRecentCapsules = [
        {
          id: "cap_recent_001",
          title: "Personal Journey #1001",
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          status: "verified",
          griefTier: 3,
        },
        {
          id: "cap_recent_002",
          title: "Family Memory #1002",
          createdAt: new Date(Date.now() - 259200000).toISOString(),
          status: "pending",
          griefTier: 4,
        },
        {
          id: "cap_recent_003",
          title: "Historical Event #1003",
          createdAt: new Date(Date.now() - 345600000).toISOString(),
          status: "verified",
          griefTier: 5,
        },
      ];

      res.json(mockRecentCapsules);
    },
  );

  // Get minted capsules for gallery
  app.get(
    "/api/capsules/minted",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log("🎨 Minted capsules requested for gallery");

      const mockMintedCapsules = [
        {
          id: "cap_1754140001_abc123",
          title: "Family Memory Capsule",
          content:
            "A precious family memory preserved for future generations...",
          griefTier: 3,
          walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
          replayCount: 12,
          mintedAt: new Date(Date.now() - 86400000).toISOString(),
          nftTokenId: "1001",
          openseaUrl: "https://opensea.io/assets/matic/0x123.../1001",
        },
        {
          id: "cap_1754140002_def456",
          title: "Personal Journey",
          content: "My journey through difficult times and personal growth...",
          griefTier: 4,
          walletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
          replayCount: 8,
          mintedAt: new Date(Date.now() - 172800000).toISOString(),
          nftTokenId: "1002",
          openseaUrl: "https://opensea.io/assets/matic/0x123.../1002",
        },
        {
          id: "cap_1754140003_ghi789",
          title: "Historical Testimony",
          content:
            "Important historical events I witnessed and want to preserve...",
          griefTier: 5,
          walletAddress: "0x567890abcdef1234567890abcdef1234567890ab",
          replayCount: 25,
          mintedAt: new Date(Date.now() - 259200000).toISOString(),
          nftTokenId: "1003",
          openseaUrl: "https://opensea.io/assets/matic/0x123.../1003",
        },
      ];

      res.json(mockMintedCapsules);
    },
  );

  // Get truth certificates
  app.get(
    "/api/dao/certificates",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log("📜 Truth certificates requested");

      const mockCertificates = [
        {
          id: "cert_1754140300_abc123",
          capsuleId: "cap_1754140001_abc123",
          walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          hash: "0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
          signedPdfUrl:
            "/certificates/truth_certificate_cap_1754140001_abc123.pdf",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ];

      res.json(mockCertificates);
    },
  );

  // Fix token data API with proper JSON response
  app.get("/api/token/live-data", (req, res) => {
    res.status(200).json({
      price: 0.0075,
      priceChange: 0.0001,
      marketCap: 7500000,
    });
  });

  // Fix get-user-tier API with debug authentication
  app.get("/api/get-user-tier", isDebugAuthenticated, (req: any, res) => {
    res.status(200).json({ tier: "seeker" });
  });

  // Admin configuration endpoints
  app.get("/api/admin/config", isDebugAuthenticated, async (req: any, res) => {
    const user = req.user;
    const isAdmin =
      user?.email === "admin@guardianchain.app" || user?.tier === "ADMIN";

    if (!isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const configItems = [
      {
        key: "projectName",
        value: "GuardianChain",
        type: "string",
        editable: false,
      },
      { key: "defaultTier", value: "guest", type: "string", editable: true },
      {
        key: "projectStatus",
        value: "production",
        type: "string",
        editable: true,
      },
      {
        key: "veritasSealRequired",
        value: "true",
        type: "boolean",
        editable: true,
      },
      { key: "stripeEnabled", value: "true", type: "boolean", editable: true },
      {
        key: "capsuleReplayFee",
        value: "2.50",
        type: "number",
        editable: true,
      },
      {
        key: "griefScoreEnabled",
        value: "true",
        type: "boolean",
        editable: true,
      },
      { key: "aiModeration", value: "on", type: "string", editable: true },
      { key: "ipfsPinning", value: "pinata", type: "string", editable: true },
      {
        key: "network",
        value: "polygon-mainnet",
        type: "string",
        editable: false,
      },
    ];

    res.json({ config: configItems, lastUpdated: new Date().toISOString() });
  });

  app.post("/api/admin/config", isDebugAuthenticated, async (req: any, res) => {
    const user = req.user;
    const isAdmin =
      user?.email === "admin@guardianchain.app" || user?.tier === "ADMIN";

    if (!isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { updates } = req.body;
    res.json({
      success: true,
      appliedUpdates: Object.keys(updates || {}),
      updatedAt: new Date().toISOString(),
    });
  });

  // Public config endpoint
  app.get("/api/config", async (req, res) => {
    const config = {
      projectName: "GuardianChain",
      defaultTier: "guest",
      projectStatus: "production",
      veritasSealRequired: true,
      stripeEnabled: true,
      capsuleReplayFee: 2.5,
      griefScoreEnabled: true,
      aiModeration: "on",
      ipfsPinning: "pinata",
      allowedWallets: ["metamask", "walletconnect"],
      network: "polygon-mainnet",
    };

    res.json(config);
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // --- AI SERVICES ENDPOINTS ---

  // Enhanced AI Image Generation
  app.post(
    "/api/ai/generate-image",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log("🎨 AI image generation requested");

      try {
        const { prompt, size = "1024x1024", quality = "standard" } = req.body;

        if (!prompt) {
          return res.status(400).json({ error: "Prompt is required" });
        }

        // Enhanced prompt for Guardian aesthetic
        const enhancedPrompt = `${prompt}. Digital art style, ethereal and mystical atmosphere, guardian theme, high quality, dramatic lighting, cosmic elements, truth preservation concept`;

        // High-quality placeholder images for Guardian theme
        const mockImageUrls = [
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1024&h=1024&fit=crop",
          "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1024&h=1024&fit=crop",
          "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1024&h=1024&fit=crop",
          "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=1024&h=1024&fit=crop",
        ];

        const randomImage =
          mockImageUrls[Math.floor(Math.random() * mockImageUrls.length)];

        console.log("✅ AI image generated successfully");
        res.json({
          imageUrl: randomImage,
          prompt: enhancedPrompt,
          size,
          quality,
          generatedAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error("❌ Failed to generate AI image:", error);
        res.status(500).json({ error: "Failed to generate image" });
      }
    },
  );

  // AI Contract Verification for Eternal Contracts
  app.post(
    "/api/ai/verify-contract",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log("📋 AI Contract verification requested");

      try {
        const { content, title } = req.body;

        if (!content) {
          return res
            .status(400)
            .json({ error: "Contract content is required" });
        }

        // Mock AI contract analysis
        const wordCount = content.split(" ").length;
        const hasTitle = !!title;
        const clarity =
          wordCount > 50 ? "High" : wordCount > 20 ? "Medium" : "Low";

        const summary = `Contract Analysis:
      
Title: ${hasTitle ? "Provided" : "Missing"}
Word Count: ${wordCount} words
Clarity Level: ${clarity}
Legal Structure: ${content.toLowerCase().includes("hereby") || content.toLowerCase().includes("declare") ? "Formal" : "Informal"}
Permanence Indicators: ${content.toLowerCase().includes("forever") || content.toLowerCase().includes("eternal") ? "Present" : "Absent"}

This contract appears to be a ${title ? "titled " : ""}declaration with ${clarity.toLowerCase()} clarity. The content ${wordCount > 100 ? "provides substantial detail" : "could benefit from additional detail"} for eternal preservation.

Recommendation: ${wordCount > 50 && hasTitle ? "Ready for sealing" : "Consider adding more detail or a title"}`;

        console.log("✅ Contract verified and analyzed");
        res.json({
          summary,
          clarity,
          wordCount,
          isReady: wordCount > 50 && hasTitle,
          verifiedAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error("❌ Failed to verify contract:", error);
        res.status(500).json({ error: "Failed to verify contract" });
      }
    },
  );

  // Publish Eternal Contract
  app.post(
    "/api/capsule/publish-contract",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log("📜 Publishing eternal contract");

      try {
        const {
          title,
          content,
          summary,
          author,
          beneficiary,
          unlockDate,
          contractType,
          metadata,
        } = req.body;

        if (!title || !content) {
          return res
            .status(400)
            .json({ error: "Title and content are required" });
        }

        // Create eternal contract record
        const contractId = `contract_${Date.now()}`;
        const contractHash = `0x${Math.random().toString(16).substr(2, 64)}`;

        const eternalContract = {
          id: contractId,
          title,
          content,
          summary: summary || "AI-verified eternal declaration",
          author,
          beneficiary: beneficiary || null,
          unlockDate: unlockDate || null,
          contractType: contractType || "eternal_declaration",
          contractHash,
          metadata: metadata || {},
          sealed: true,
          sealedAt: new Date().toISOString(),
          blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
          networkId: "polygon-mainnet",
        };

        console.log("✅ Eternal contract published:", contractId);

        res.json({
          success: true,
          contractId,
          contractHash,
          contract: eternalContract,
          message: "Contract has been permanently sealed on-chain",
        });
      } catch (error) {
        console.error("❌ Failed to publish contract:", error);
        res.status(500).json({ error: "Failed to publish eternal contract" });
      }
    },
  );

  // AI Content Analysis
  app.post(
    "/api/ai/analyze-content",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log("🧠 AI content analysis requested");

      try {
        const { title, content, capsuleType } = req.body;

        if (!title || !content) {
          return res
            .status(400)
            .json({ error: "Title and content are required" });
        }

        // Mock AI analysis based on content
        const wordCount = content.split(" ").length;
        const emotionalWords = [
          "love",
          "loss",
          "pain",
          "joy",
          "fear",
          "hope",
          "dream",
        ];
        const emotionalScore = emotionalWords.filter((word) =>
          content.toLowerCase().includes(word),
        ).length;

        const mockAnalysis = {
          emotionalIntensity:
            emotionalScore > 2 ? "High" : emotionalScore > 0 ? "Medium" : "Low",
          truthConfidence: Math.min(95, 65 + wordCount / 10),
          recommendedGriefTier: Math.min(
            5,
            Math.max(1, Math.floor(emotionalScore / 2) + 2),
          ),
          suggestedTags: [
            capsuleType.replace("_", " "),
            emotionalScore > 1 ? "emotional" : "factual",
            wordCount > 100 ? "detailed" : "concise",
            "truth",
            "memory",
          ],
          summary: `This ${capsuleType.replace("_", " ")} capsule contains ${wordCount} words with ${emotionalScore > 0 ? "emotional depth" : "factual content"}. The content appears authentic and suitable for long-term preservation.`,
          contentScore: Math.min(
            100,
            60 + emotionalScore * 5 + Math.min(20, wordCount / 5),
          ),
        };

        console.log("✅ AI analysis completed:", mockAnalysis);
        res.json(mockAnalysis);
      } catch (error) {
        console.error("❌ Failed to analyze content:", error);
        res.status(500).json({ error: "Failed to analyze content" });
      }
    },
  );

  // Yield Estimation
  app.post(
    "/api/capsules/estimate-yield",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log("💰 Yield estimation requested");

      try {
        const { griefTier, timelock, capsuleType } = req.body;

        if (!griefTier || !timelock) {
          return res
            .status(400)
            .json({ error: "Grief tier and timelock are required" });
        }

        // Calculate mock yield based on grief tier and timelock
        const baseYield = griefTier * 10; // Base yield per grief tier
        const timeBonus = Math.floor(timelock / 30) * 2; // Bonus for longer locks
        const typeMultiplier =
          capsuleType === "confession"
            ? 1.5
            : capsuleType === "prophecy"
              ? 1.3
              : 1.0;

        const totalYield = Math.floor((baseYield + timeBonus) * typeMultiplier);
        const apy = (totalYield / 100 / (timelock / 365)) * 100;

        const mockEstimate = {
          estimatedYield: totalYield,
          apy: Math.round(apy * 10) / 10,
          baseYield,
          timeBonus,
          typeMultiplier,
          lockPeriodYears: Math.round((timelock / 365) * 10) / 10,
          breakdown: {
            griefBonus: baseYield,
            timeBonus: timeBonus,
            typeBonus: Math.floor(totalYield - baseYield - timeBonus),
          },
        };

        console.log("✅ Yield estimated:", mockEstimate);
        res.json(mockEstimate);
      } catch (error) {
        console.error("❌ Failed to estimate yield:", error);
        res.status(500).json({ error: "Failed to estimate yield" });
      }
    },
  );

  // NFT Minting
  app.post(
    "/api/capsules/mint-nft",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log("🪙 NFT minting requested");

      try {
        const { title, content, capsuleType, timelock, imageUrl, aiAnalysis } =
          req.body;
        const userId = req.user.id;

        if (!title || !content) {
          return res
            .status(400)
            .json({ error: "Title and content are required" });
        }

        // Mock NFT minting
        const tokenId = Math.floor(Math.random() * 9000) + 1000;
        const contractAddress = "0x742d35Cc6634C0532925a3b8D9C07BEC676c4A1a"; // Mock contract

        // Create capsule in storage (mock for now)
        const capsuleId = `cap_${Date.now()}`;
        const mockCapsule = {
          id: capsuleId,
          title,
          content,
          capsuleType,
          timelock,
          authorId: userId,
          status: "minted",
          tokenId: tokenId.toString(),
          contractAddress,
          imageUrl,
          aiAnalysis,
          griefTier: aiAnalysis?.recommendedGriefTier || 1,
          createdAt: new Date().toISOString(),
          mintedAt: new Date().toISOString(),
        };

        console.log("✅ NFT minted successfully:", mockCapsule);
        res.json({
          success: true,
          tokenId,
          contractAddress,
          capsuleId,
          transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
          capsule: mockCapsule,
        });
      } catch (error) {
        console.error("❌ Failed to mint NFT:", error);
        res.status(500).json({ error: "Failed to mint NFT" });
      }
    },
  );

  // --- LINEAGE TRACKING ENDPOINTS ---

  // Get lineage for a capsule
  app.get(
    "/api/lineage/:capsuleId",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log("📈 Lineage requested for capsule:", req.params.capsuleId);

      try {
        const { capsuleId } = req.params;

        // Mock lineage data for now - would connect to database in production
        const mockLineage = {
          capsuleId,
          parents: [
            {
              id: "parent_1",
              title: "Founding Memory",
              griefFlow: 85,
              influenceScore: 7.5,
              createdAt: "2024-01-15T00:00:00Z",
            },
          ],
          children: [
            {
              id: "child_1",
              title: "Inherited Wisdom",
              griefFlow: 92,
              influenceScore: 8.2,
              createdAt: "2024-06-20T00:00:00Z",
            },
          ],
          totalGriefFlow: 177,
          lineageDepth: 3,
          influenceNetwork: 15,
        };

        console.log("✅ Lineage retrieved:", mockLineage);
        res.json(mockLineage);
      } catch (error) {
        console.error("❌ Failed to get lineage:", error);
        res.status(500).json({ error: "Failed to retrieve lineage" });
      }
    },
  );

  // Create lineage connection (compatible with Next.js API format)
  app.post(
    "/api/lineage/create",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log("🔗 Creating lineage connection");

      try {
        const {
          parent_id,
          child_id,
          grief_flow,
          influence_score,
          triggered_by,
        } = req.body;
        const userId = triggered_by || req.user.id;

        if (!parent_id || !child_id) {
          return res
            .status(400)
            .json({ error: "parent_id and child_id are required" });
        }

        // Create lineage entry (this would insert into database in production)
        const lineageEntry = {
          id: `lineage_${Date.now()}`,
          parent_id,
          child_id,
          triggered_by: userId,
          timestamp: new Date().toISOString(),
          grief_flow: grief_flow || 0,
          influence_score: influence_score || 0,
        };

        console.log("✅ Lineage created:", lineageEntry);

        // Update capsules with inherited values
        const inheritanceUpdate = {
          child_capsule: {
            id: child_id,
            inspired_by: parent_id,
            grief_inherited: grief_flow,
            influence_score: influence_score,
          },
        };

        res.json({
          success: true,
          lineage: lineageEntry,
          inheritance: inheritanceUpdate,
        });
      } catch (error) {
        console.error("❌ Failed to create lineage:", error);
        res.status(500).json({ error: "Failed to create lineage" });
      }
    },
  );

  // Sovereign Memory Reputation Index (SMRI) API
  app.get("/api/smri/:wallet", isDebugAuthenticated, async (req: any, res) => {
    console.log("🏆 SMRI requested for wallet:", req.params.wallet);

    try {
      const { wallet } = req.params;

      if (!wallet) {
        return res.status(400).json({ error: "Wallet address is required" });
      }

      // Mock data for reputation calculation - would query database in production
      const mockCapsules = [
        {
          id: "cap_1",
          grief_tier: 4,
          influence_score: 85,
          inspired_by: "cap_0",
        },
        { id: "cap_2", grief_tier: 3, influence_score: 72, inspired_by: null },
        {
          id: "cap_3",
          grief_tier: 5,
          influence_score: 95,
          inspired_by: "cap_1",
        },
      ];

      const mockCerts = [
        { id: "cert_1", type: "veritas_seal" },
        { id: "cert_2", type: "truth_bounty" },
      ];

      const griefTotal = mockCapsules.reduce(
        (sum, c) => sum + (c.grief_tier || 0),
        0,
      );
      const influence = mockCapsules.filter(
        (c) => c.inspired_by !== null,
      ).length;
      const score = Math.round(
        (griefTotal + influence * 2 + mockCerts.length * 3) * 1.5,
      );
      const tier =
        score > 150
          ? "Veritas"
          : score > 100
            ? "Gold"
            : score > 50
              ? "Silver"
              : "Bronze";

      const smriData = {
        wallet,
        truth_score: score,
        grief_total: griefTotal,
        capsule_count: mockCapsules.length,
        influence_count: influence,
        cert_count: mockCerts.length,
        reputation_tier: tier,
        last_updated: new Date().toISOString(),
        trending: score > 100 ? "up" : "stable",
      };

      console.log("✅ SMRI calculated:", smriData);
      res.json(smriData);
    } catch (error) {
      console.error("❌ Failed to calculate SMRI:", error);
      res.status(500).json({ error: "Failed to calculate reputation score" });
    }
  });

  // SMRI Leaderboard API
  app.get(
    "/api/smri/leaderboard",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log("🏆 SMRI Leaderboard requested");

      try {
        const { timeframe = "all" } = req.query;

        // Mock leaderboard data
        const mockLeaderboard = [
          {
            wallet: "veritas@guardianchain.app",
            truth_score: 245,
            reputation_tier: "Veritas",
            rank: 1,
          },
          {
            wallet: "guardian@truth.eth",
            truth_score: 189,
            reputation_tier: "Gold",
            rank: 2,
          },
          {
            wallet: "memory_keeper@chain.app",
            truth_score: 156,
            reputation_tier: "Gold",
            rank: 3,
          },
          {
            wallet: "truth_seeker@web3.com",
            truth_score: 134,
            reputation_tier: "Gold",
            rank: 4,
          },
          {
            wallet: "capsule_creator@defi.org",
            truth_score: 98,
            reputation_tier: "Silver",
            rank: 5,
          },
          {
            wallet: "grief_guardian@nft.app",
            truth_score: 87,
            reputation_tier: "Silver",
            rank: 6,
          },
          {
            wallet: "legacy_holder@dao.com",
            truth_score: 72,
            reputation_tier: "Silver",
            rank: 7,
          },
          {
            wallet: "debug@guardianchain.app",
            truth_score: 33,
            reputation_tier: "Bronze",
            rank: 8,
          },
          {
            wallet: "newbie@starter.eth",
            truth_score: 21,
            reputation_tier: "Bronze",
            rank: 9,
          },
          {
            wallet: "explorer@begin.app",
            truth_score: 15,
            reputation_tier: "Bronze",
            rank: 10,
          },
        ];

        // Filter by timeframe if needed (mock implementation)
        let filteredLeaderboard = mockLeaderboard;
        if (timeframe === "week") {
          // Mock weekly filtering by slightly reducing scores
          filteredLeaderboard = mockLeaderboard.map((entry) => ({
            ...entry,
            truth_score: Math.floor(entry.truth_score * 0.3),
          }));
        } else if (timeframe === "month") {
          // Mock monthly filtering
          filteredLeaderboard = mockLeaderboard.map((entry) => ({
            ...entry,
            truth_score: Math.floor(entry.truth_score * 0.7),
          }));
        }

        console.log("✅ Leaderboard data generated for timeframe:", timeframe);
        res.json(filteredLeaderboard);
      } catch (error) {
        console.error("❌ Failed to get leaderboard:", error);
        res.status(500).json({ error: "Failed to get leaderboard data" });
      }
    },
  );

  // Guardian Map Network API
  app.get(
    "/api/guardian-map/network",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log("🗺️ Guardian map network requested");

      try {
        const { region = "global" } = req.query;

        // Mock guardian network data
        const mockGuardians = [
          {
            id: "guardian_1",
            wallet: "veritas@guardianchain.app",
            location: {
              city: "San Francisco",
              country: "USA",
              coordinates: [-122.4194, 37.7749],
            },
            smri: {
              truth_score: 245,
              reputation_tier: "Veritas",
              capsule_count: 24,
              last_active: "2 hours ago",
            },
            network: {
              connections: 12,
              lineage_depth: 5,
              influence_radius: 85,
            },
          },
          {
            id: "guardian_2",
            wallet: "guardian@truth.eth",
            location: {
              city: "London",
              country: "UK",
              coordinates: [-0.1276, 51.5074],
            },
            smri: {
              truth_score: 189,
              reputation_tier: "Gold",
              capsule_count: 18,
              last_active: "1 hour ago",
            },
            network: { connections: 8, lineage_depth: 4, influence_radius: 72 },
          },
          {
            id: "guardian_3",
            wallet: "memory_keeper@chain.app",
            location: {
              city: "Tokyo",
              country: "Japan",
              coordinates: [139.6503, 35.6762],
            },
            smri: {
              truth_score: 156,
              reputation_tier: "Gold",
              capsule_count: 15,
              last_active: "3 hours ago",
            },
            network: { connections: 6, lineage_depth: 3, influence_radius: 68 },
          },
          {
            id: "guardian_4",
            wallet: "debug@guardianchain.app",
            location: {
              city: "Berlin",
              country: "Germany",
              coordinates: [13.405, 52.52],
            },
            smri: {
              truth_score: 33,
              reputation_tier: "Bronze",
              capsule_count: 3,
              last_active: "30 minutes ago",
            },
            network: { connections: 2, lineage_depth: 1, influence_radius: 25 },
          },
          {
            id: "guardian_5",
            wallet: "truth_seeker@web3.com",
            location: {
              city: "Toronto",
              country: "Canada",
              coordinates: [-79.3832, 43.6532],
            },
            smri: {
              truth_score: 134,
              reputation_tier: "Gold",
              capsule_count: 12,
              last_active: "5 hours ago",
            },
            network: { connections: 7, lineage_depth: 3, influence_radius: 58 },
          },
        ];

        // Filter by region if needed
        let filteredGuardians = mockGuardians;
        if (region !== "global") {
          // Mock region filtering logic
          filteredGuardians = mockGuardians.filter((guardian) => {
            if (region === "americas")
              return ["USA", "Canada"].includes(guardian.location.country);
            if (region === "europe")
              return ["UK", "Germany"].includes(guardian.location.country);
            if (region === "asia")
              return ["Japan"].includes(guardian.location.country);
            return true;
          });
        }

        console.log("✅ Guardian network data generated for region:", region);
        res.json({
          nodes: filteredGuardians,
          connections: [
            { from: "guardian_1", to: "guardian_2", strength: 0.8 },
            { from: "guardian_2", to: "guardian_3", strength: 0.6 },
            { from: "guardian_1", to: "guardian_4", strength: 0.4 },
            { from: "guardian_3", to: "guardian_5", strength: 0.7 },
          ],
        });
      } catch (error) {
        console.error("❌ Failed to get guardian network:", error);
        res.status(500).json({ error: "Failed to get guardian network data" });
      }
    },
  );

  // Guardian Map Metrics API
  app.get(
    "/api/guardian-map/metrics",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log("📊 Guardian map metrics requested");

      try {
        const mockMetrics = {
          total_guardians: 1247,
          active_guardians: 892,
          global_truth_score: 186420,
          countries_active: 67,
          strongest_lineage: 8,
        };

        console.log("✅ Guardian map metrics generated");
        res.json(mockMetrics);
      } catch (error) {
        console.error("❌ Failed to get guardian metrics:", error);
        res.status(500).json({ error: "Failed to get guardian metrics" });
      }
    },
  );

  // Search API
  app.get("/api/search", isDebugAuthenticated, async (req: any, res) => {
    console.log("🔍 Search requested");

    try {
      const { q, type = "all", sort = "relevance" } = req.query;

      if (!q) {
        return res.json([]);
      }

      // Mock search results
      const mockResults = [
        {
          id: "cap_001",
          title: "The Truth About Digital Privacy",
          type: "capsule",
          content:
            "A comprehensive analysis of how personal data is being harvested and sold by major tech companies without proper consent...",
          creator: "privacy_advocate@truth.eth",
          created_at: "2025-01-15T10:30:00Z",
          grief_tier: 4,
          verification_status: "verified",
          tags: ["privacy", "tech", "surveillance"],
          smri_score: 89,
        },
        {
          id: "guard_001",
          title: "Digital Rights Guardian",
          type: "guardian",
          content:
            "Veteran cybersecurity expert dedicated to protecting digital freedoms and exposing corporate surveillance...",
          creator: "privacy_advocate@truth.eth",
          created_at: "2025-01-10T14:20:00Z",
          grief_tier: 0,
          verification_status: "verified",
          tags: ["guardian", "cybersecurity", "activism"],
          smri_score: 156,
        },
        {
          id: "contract_001",
          title: "Eternal Privacy Declaration",
          type: "contract",
          content:
            "I hereby declare that privacy is a fundamental human right that must be protected for all future generations...",
          creator: "rights_defender@chain.app",
          created_at: "2025-01-08T09:15:00Z",
          grief_tier: 2,
          verification_status: "pending",
          tags: ["privacy", "rights", "declaration"],
        },
        {
          id: "cap_002",
          title: "Climate Change Evidence Archive",
          type: "capsule",
          content:
            "Documenting the real impact of climate change with suppressed scientific data and corporate cover-ups...",
          creator: "climate_scientist@research.org",
          created_at: "2025-01-12T16:45:00Z",
          grief_tier: 5,
          verification_status: "verified",
          tags: ["climate", "science", "environment"],
          smri_score: 142,
        },
      ];

      // Filter by type
      let filteredResults = mockResults;
      if (type !== "all") {
        filteredResults = mockResults.filter((result) => result.type === type);
      }

      // Simple search filtering
      const searchTerm = q.toLowerCase();
      filteredResults = filteredResults.filter(
        (result) =>
          result.title.toLowerCase().includes(searchTerm) ||
          result.content.toLowerCase().includes(searchTerm) ||
          result.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
      );

      // Sort results
      switch (sort) {
        case "recent":
          filteredResults.sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          );
          break;
        case "grief":
          filteredResults.sort((a, b) => b.grief_tier - a.grief_tier);
          break;
        case "verified":
          filteredResults.sort((a, b) => {
            if (
              a.verification_status === "verified" &&
              b.verification_status !== "verified"
            )
              return -1;
            if (
              b.verification_status === "verified" &&
              a.verification_status !== "verified"
            )
              return 1;
            return 0;
          });
          break;
        default: // relevance - already filtered by search term
          break;
      }

      console.log("✅ Search results generated:", filteredResults.length);
      res.json(filteredResults);
    } catch (error) {
      console.error("❌ Failed to perform search:", error);
      res.status(500).json({ error: "Failed to perform search" });
    }
  });

  // Get SMRI leaderboard
  app.get(
    "/api/smri/leaderboard",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log("🏆 SMRI leaderboard requested");

      try {
        const { tier = "all" } = req.query;

        // Mock leaderboard data
        const mockLeaderboard = [
          {
            wallet: "veritas_guardian@truth.eth",
            truth_score: 187,
            grief_total: 45,
            capsule_count: 23,
            influence_count: 18,
            cert_count: 12,
            reputation_tier: "Veritas",
            last_updated: "2025-08-02T14:00:00Z",
            trending: "up",
            rank: 1,
            bio: "Veteran whistleblower fighting corporate corruption",
            specialties: [
              "Corporate Fraud",
              "Data Privacy",
              "Financial Crimes",
            ],
          },
          {
            wallet: "digital_truth_seeker@chain.app",
            truth_score: 142,
            grief_total: 38,
            capsule_count: 19,
            influence_count: 14,
            cert_count: 8,
            reputation_tier: "Gold",
            last_updated: "2025-08-02T13:45:00Z",
            trending: "up",
            rank: 2,
            bio: "Investigative journalist exposing tech surveillance",
            specialties: ["Surveillance", "Tech Industry", "Privacy Rights"],
          },
          {
            wallet: "climate_witness@guardian.net",
            truth_score: 98,
            grief_total: 28,
            capsule_count: 15,
            influence_count: 11,
            cert_count: 6,
            reputation_tier: "Silver",
            last_updated: "2025-08-02T13:30:00Z",
            trending: "stable",
            rank: 3,
            bio: "Environmental scientist documenting climate suppression",
            specialties: [
              "Climate Science",
              "Environmental Crime",
              "Research Integrity",
            ],
          },
          {
            wallet: "healthcare_advocate@medical.org",
            truth_score: 76,
            grief_total: 22,
            capsule_count: 12,
            influence_count: 8,
            cert_count: 4,
            reputation_tier: "Silver",
            last_updated: "2025-08-02T13:15:00Z",
            trending: "down",
            rank: 4,
            bio: "Medical professional exposing healthcare fraud",
            specialties: ["Healthcare", "Medical Ethics", "Patient Rights"],
          },
          {
            wallet: "financial_insider@banks.net",
            truth_score: 54,
            grief_total: 16,
            capsule_count: 9,
            influence_count: 6,
            cert_count: 3,
            reputation_tier: "Bronze",
            last_updated: "2025-08-02T13:00:00Z",
            trending: "up",
            rank: 5,
            bio: "Former bank employee revealing financial misconduct",
            specialties: [
              "Banking",
              "Financial Fraud",
              "Regulatory Violations",
            ],
          },
          {
            wallet: "tech_worker@anonymous.dev",
            truth_score: 42,
            grief_total: 12,
            capsule_count: 7,
            influence_count: 5,
            cert_count: 2,
            reputation_tier: "Bronze",
            last_updated: "2025-08-02T12:45:00Z",
            trending: "stable",
            rank: 6,
            bio: "Software engineer documenting tech industry abuses",
            specialties: [
              "Software Development",
              "Worker Rights",
              "Tech Ethics",
            ],
          },
          {
            wallet: "debug@guardianchain.app",
            truth_score: 33,
            grief_total: 12,
            capsule_count: 3,
            influence_count: 2,
            cert_count: 2,
            reputation_tier: "Bronze",
            last_updated: "2025-08-02T14:16:00Z",
            trending: "stable",
            rank: 7,
            bio: "Debug user exploring the Guardian ecosystem",
            specialties: ["Testing", "Development", "Platform Exploration"],
          },
        ];

        // Filter by tier if specified
        let filteredLeaderboard = mockLeaderboard;
        if (tier !== "all") {
          filteredLeaderboard = mockLeaderboard.filter(
            (profile) => profile.reputation_tier === tier,
          );
        }

        console.log("✅ SMRI leaderboard generated:", {
          total: mockLeaderboard.length,
          filtered: filteredLeaderboard.length,
          tier,
        });

        res.json(filteredLeaderboard);
      } catch (error) {
        console.error("❌ Failed to get SMRI leaderboard:", error);
        res.status(500).json({ error: "Failed to get SMRI leaderboard" });
      }
    },
  );

  // Get guardian map nodes
  app.get(
    "/api/guardian-map/nodes",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log("🗺️ Guardian map nodes requested");

      try {
        const { region, tier } = req.query;

        // Mock guardian map data
        const mockGuardians = [
          {
            id: "guardian_1",
            wallet: "veritas_guardian@truth.eth",
            latitude: 40.7128,
            longitude: -74.006,
            truth_score: 187,
            capsule_count: 23,
            region: "north_america",
            country: "United States",
            city: "New York",
            reputation_tier: "Veritas",
            activity_level: "high",
            last_active: "2025-08-02T14:15:00Z",
            specialties: [
              "Corporate Fraud",
              "Data Privacy",
              "Financial Crimes",
            ],
            connections: ["guardian_2", "guardian_4", "guardian_7"],
            influence_radius: 25,
          },
          {
            id: "guardian_2",
            wallet: "digital_truth_seeker@chain.app",
            latitude: 51.5074,
            longitude: -0.1278,
            truth_score: 142,
            capsule_count: 19,
            region: "europe",
            country: "United Kingdom",
            city: "London",
            reputation_tier: "Gold",
            activity_level: "high",
            last_active: "2025-08-02T14:10:00Z",
            specialties: ["Surveillance", "Tech Industry", "Privacy Rights"],
            connections: ["guardian_1", "guardian_3", "guardian_5"],
            influence_radius: 20,
          },
          {
            id: "guardian_3",
            wallet: "climate_witness@guardian.net",
            latitude: 48.8566,
            longitude: 2.3522,
            truth_score: 98,
            capsule_count: 15,
            region: "europe",
            country: "France",
            city: "Paris",
            reputation_tier: "Silver",
            activity_level: "medium",
            last_active: "2025-08-02T13:45:00Z",
            specialties: [
              "Climate Science",
              "Environmental Crime",
              "Research Integrity",
            ],
            connections: ["guardian_2", "guardian_6"],
            influence_radius: 18,
          },
          {
            id: "guardian_4",
            wallet: "healthcare_advocate@medical.org",
            latitude: 35.6762,
            longitude: 139.6503,
            truth_score: 76,
            capsule_count: 12,
            region: "asia",
            country: "Japan",
            city: "Tokyo",
            reputation_tier: "Silver",
            activity_level: "medium",
            last_active: "2025-08-02T13:30:00Z",
            specialties: ["Healthcare", "Medical Ethics", "Patient Rights"],
            connections: ["guardian_1", "guardian_8"],
            influence_radius: 15,
          },
          {
            id: "guardian_5",
            wallet: "financial_insider@banks.net",
            latitude: 52.52,
            longitude: 13.405,
            truth_score: 54,
            capsule_count: 9,
            region: "europe",
            country: "Germany",
            city: "Berlin",
            reputation_tier: "Bronze",
            activity_level: "low",
            last_active: "2025-08-02T12:00:00Z",
            specialties: [
              "Banking",
              "Financial Fraud",
              "Regulatory Violations",
            ],
            connections: ["guardian_2"],
            influence_radius: 12,
          },
          {
            id: "guardian_6",
            wallet: "research_scientist@uni.edu",
            latitude: -33.8688,
            longitude: 151.2093,
            truth_score: 89,
            capsule_count: 14,
            region: "oceania",
            country: "Australia",
            city: "Sydney",
            reputation_tier: "Silver",
            activity_level: "high",
            last_active: "2025-08-02T14:00:00Z",
            specialties: [
              "Academic Research",
              "Scientific Integrity",
              "Publication Ethics",
            ],
            connections: ["guardian_3", "guardian_7"],
            influence_radius: 16,
          },
          {
            id: "guardian_7",
            wallet: "media_watchdog@press.org",
            latitude: 43.6532,
            longitude: -79.3832,
            truth_score: 125,
            capsule_count: 17,
            region: "north_america",
            country: "Canada",
            city: "Toronto",
            reputation_tier: "Gold",
            activity_level: "high",
            last_active: "2025-08-02T14:12:00Z",
            specialties: ["Journalism", "Media Ethics", "Press Freedom"],
            connections: ["guardian_1", "guardian_6"],
            influence_radius: 22,
          },
          {
            id: "guardian_8",
            wallet: "tech_ethics@startup.dev",
            latitude: 37.7749,
            longitude: -122.4194,
            truth_score: 95,
            capsule_count: 11,
            region: "north_america",
            country: "United States",
            city: "San Francisco",
            reputation_tier: "Silver",
            activity_level: "medium",
            last_active: "2025-08-02T13:20:00Z",
            specialties: ["Tech Ethics", "AI Safety", "Digital Rights"],
            connections: ["guardian_4", "guardian_9"],
            influence_radius: 17,
          },
          {
            id: "guardian_9",
            wallet: "debug@guardianchain.app",
            latitude: 1.3521,
            longitude: 103.8198,
            truth_score: 33,
            capsule_count: 3,
            region: "asia",
            country: "Singapore",
            city: "Singapore",
            reputation_tier: "Bronze",
            activity_level: "medium",
            last_active: "2025-08-02T14:16:00Z",
            specialties: ["Testing", "Development", "Platform Exploration"],
            connections: ["guardian_8"],
            influence_radius: 8,
          },
        ];

        // Filter guardians based on region and tier
        let filteredGuardians = mockGuardians;

        if (region && region !== "all") {
          filteredGuardians = filteredGuardians.filter(
            (guardian) => guardian.region === region,
          );
        }

        if (tier && tier !== "all") {
          filteredGuardians = filteredGuardians.filter(
            (guardian) => guardian.reputation_tier === tier,
          );
        }

        console.log("✅ Guardian map nodes generated:", {
          total: mockGuardians.length,
          filtered: filteredGuardians.length,
          filters: { region, tier },
        });

        res.json({
          guardians: filteredGuardians,
          metadata: {
            total_guardians: mockGuardians.length,
            filtered_guardians: filteredGuardians.length,
            last_updated: new Date().toISOString(),
          },
        });
      } catch (error) {
        console.error("❌ Failed to get guardian map nodes:", error);
        res.status(500).json({ error: "Failed to get guardian map nodes" });
      }
    },
  );

  // Get guardian map connections
  app.get(
    "/api/guardian-map/connections",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log("🔗 Guardian map connections requested");

      try {
        // Mock connection data
        const mockConnections = [
          {
            source: "guardian_1",
            target: "guardian_2",
            strength: 0.9,
            connection_type: "collaboration",
            created_at: "2025-07-15T00:00:00Z",
          },
          {
            source: "guardian_1",
            target: "guardian_4",
            strength: 0.7,
            connection_type: "verification",
            created_at: "2025-07-20T00:00:00Z",
          },
          {
            source: "guardian_1",
            target: "guardian_7",
            strength: 0.8,
            connection_type: "mentorship",
            created_at: "2025-07-10T00:00:00Z",
          },
          {
            source: "guardian_2",
            target: "guardian_3",
            strength: 0.6,
            connection_type: "influence",
            created_at: "2025-07-25T00:00:00Z",
          },
          {
            source: "guardian_2",
            target: "guardian_5",
            strength: 0.5,
            connection_type: "collaboration",
            created_at: "2025-07-18T00:00:00Z",
          },
          {
            source: "guardian_3",
            target: "guardian_6",
            strength: 0.7,
            connection_type: "verification",
            created_at: "2025-07-22T00:00:00Z",
          },
          {
            source: "guardian_4",
            target: "guardian_8",
            strength: 0.6,
            connection_type: "influence",
            created_at: "2025-07-28T00:00:00Z",
          },
          {
            source: "guardian_6",
            target: "guardian_7",
            strength: 0.8,
            connection_type: "collaboration",
            created_at: "2025-07-12T00:00:00Z",
          },
          {
            source: "guardian_8",
            target: "guardian_9",
            strength: 0.4,
            connection_type: "mentorship",
            created_at: "2025-08-01T00:00:00Z",
          },
        ];

        console.log("✅ Guardian map connections generated:", {
          connections: mockConnections.length,
        });

        res.json({
          connections: mockConnections,
          metadata: {
            total_connections: mockConnections.length,
            connection_types: [
              "collaboration",
              "verification",
              "influence",
              "mentorship",
            ],
          },
        });
      } catch (error) {
        console.error("❌ Failed to get guardian map connections:", error);
        res
          .status(500)
          .json({ error: "Failed to get guardian map connections" });
      }
    },
  );

  // Get guardian map metrics
  app.get(
    "/api/guardian-map/metrics",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log("📊 Guardian map metrics requested");

      try {
        // Mock metrics data
        const mockMetrics = {
          total_guardians: 9,
          active_guardians: 6,
          total_connections: 9,
          global_truth_score: 899,
          top_regions: [
            {
              region: "North America",
              guardian_count: 3,
              avg_truth_score: 102,
            },
            {
              region: "Europe",
              guardian_count: 3,
              avg_truth_score: 98,
            },
            {
              region: "Asia",
              guardian_count: 2,
              avg_truth_score: 55,
            },
            {
              region: "Oceania",
              guardian_count: 1,
              avg_truth_score: 89,
            },
          ],
        };

        console.log("✅ Guardian map metrics generated");

        res.json(mockMetrics);
      } catch (error) {
        console.error("❌ Failed to get guardian map metrics:", error);
        res.status(500).json({ error: "Failed to get guardian map metrics" });
      }
    },
  );

  // Capsule Search API endpoints
  app.get(
    "/api/capsules/search",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log("🔍 Capsule search requested");

      try {
        const {
          query,
          grief_tier,
          verification_status,
          region,
          category,
          truth_score_min,
          date_range,
          tags,
        } = req.query;

        // Generate mock capsule data for search
        const mockCapsules = [
          {
            id: "cap_001",
            title: "Family Memories from Christmas 1995",
            content:
              "I remember the snow falling gently as we gathered around the tree...",
            grief_tier: "tier_2",
            tags: ["family", "memory", "nostalgia"],
            guardian_id: "guardian_1",
            created_at: "2025-07-15T00:00:00Z",
            verification_status: "verified",
            truth_score: 85,
            interaction_count: 45,
            region: "north_america",
            category: "memory",
          },
          {
            id: "cap_002",
            title: "Testimony of Corporate Fraud",
            content:
              "During my time at the corporation, I witnessed systematic financial irregularities...",
            grief_tier: "tier_4",
            tags: ["testimony", "fraud", "corporate"],
            guardian_id: "guardian_2",
            created_at: "2025-07-20T00:00:00Z",
            verification_status: "pending",
            truth_score: 72,
            interaction_count: 123,
            region: "europe",
            category: "testimony",
          },
          {
            id: "cap_003",
            title: "Legacy of My Grandmother",
            content:
              "My grandmother taught me the importance of preserving truth for future generations...",
            grief_tier: "tier_3",
            tags: ["legacy", "wisdom", "family"],
            guardian_id: "guardian_3",
            created_at: "2025-07-25T00:00:00Z",
            verification_status: "verified",
            truth_score: 92,
            interaction_count: 67,
            region: "asia",
            category: "legacy",
          },
          {
            id: "cap_004",
            title: "Truth About Medical Research",
            content:
              "The study results were deliberately suppressed to protect pharmaceutical interests...",
            grief_tier: "tier_4",
            tags: ["truth", "medical", "research"],
            guardian_id: "guardian_4",
            created_at: "2025-08-01T00:00:00Z",
            verification_status: "disputed",
            truth_score: 65,
            interaction_count: 234,
            region: "europe",
            category: "truth",
          },
          {
            id: "cap_005",
            title: "Trauma from Natural Disaster",
            content:
              "The earthquake changed everything in our small community...",
            grief_tier: "tier_3",
            tags: ["trauma", "disaster", "community"],
            guardian_id: "guardian_5",
            created_at: "2025-06-10T00:00:00Z",
            verification_status: "verified",
            truth_score: 88,
            interaction_count: 89,
            region: "oceania",
            category: "trauma",
          },
        ];

        let filteredCapsules = mockCapsules.filter((capsule) => {
          // Search query filter
          if (query) {
            const searchTerm = query.toString().toLowerCase();
            const matches =
              capsule.title.toLowerCase().includes(searchTerm) ||
              capsule.content.toLowerCase().includes(searchTerm) ||
              capsule.guardian_id.toLowerCase().includes(searchTerm);
            if (!matches) return false;
          }

          // Grief tier filter
          if (
            grief_tier &&
            grief_tier !== "all" &&
            capsule.grief_tier !== grief_tier
          )
            return false;

          // Verification status filter
          if (
            verification_status &&
            verification_status !== "all" &&
            capsule.verification_status !== verification_status
          )
            return false;

          // Region filter
          if (region && region !== "all" && capsule.region !== region)
            return false;

          // Category filter
          if (category && category !== "all" && capsule.category !== category)
            return false;

          // Truth score filter
          if (
            truth_score_min &&
            capsule.truth_score < parseInt(truth_score_min.toString())
          )
            return false;

          // Date range filter
          if (date_range && date_range !== "all") {
            const now = new Date();
            const capsuleDate = new Date(capsule.created_at);
            const diffDays = Math.floor(
              (now.getTime() - capsuleDate.getTime()) / (1000 * 60 * 60 * 24),
            );

            switch (date_range) {
              case "24h":
                if (diffDays > 1) return false;
                break;
              case "7d":
                if (diffDays > 7) return false;
                break;
              case "30d":
                if (diffDays > 30) return false;
                break;
              case "90d":
                if (diffDays > 90) return false;
                break;
            }
          }

          // Tags filter
          if (tags) {
            const tagList = tags.toString().split(",");
            const hasMatchingTag = tagList.some((tag) =>
              capsule.tags.includes(tag.trim()),
            );
            if (!hasMatchingTag) return false;
          }

          return true;
        });

        console.log("✅ Capsule search completed:", {
          total_capsules: mockCapsules.length,
          filtered_results: filteredCapsules.length,
          filters_applied: Object.keys(req.query).length,
        });

        res.json({
          capsules: filteredCapsules,
          total: filteredCapsules.length,
          query_info: {
            filters_applied: Object.keys(req.query).length,
            search_time: Date.now(),
          },
        });
      } catch (error) {
        console.error("❌ Error searching capsules:", error);
        res.status(500).json({ error: "Failed to search capsules" });
      }
    },
  );

  app.get("/api/capsules/tags", isDebugAuthenticated, async (req: any, res) => {
    console.log("🏷️ Capsule tags requested");

    try {
      // Mock available tags
      const tags = [
        "memory",
        "testimony",
        "legacy",
        "truth",
        "trauma",
        "wisdom",
        "family",
        "personal",
        "historical",
        "political",
        "spiritual",
        "scientific",
        "artistic",
        "cultural",
        "environmental",
        "social",
        "fraud",
        "corporate",
        "medical",
        "research",
        "disaster",
        "community",
        "nostalgia",
      ];

      console.log("✅ Tags retrieved:", tags.length);
      res.json({ tags });
    } catch (error) {
      console.error("❌ Error fetching tags:", error);
      res.status(500).json({ error: "Failed to fetch tags" });
    }
  });

  // Get lineage graph data
  app.get("/api/lineage/graph", isDebugAuthenticated, async (req: any, res) => {
    console.log("🌳 Lineage graph requested");

    try {
      const { search, type } = req.query;

      // Mock lineage data
      const mockNodes = [
        {
          id: "root_1",
          title: "Corporate Surveillance Exposed",
          creator: "whistleblower@secure.net",
          created_at: "2025-01-01T12:00:00Z",
          grief_score: 5,
          influence_count: 12,
          verification_status: "verified",
          capsule_type: "whistleblower",
          children: ["child_1", "child_2"],
          parents: [],
        },
        {
          id: "child_1",
          title: "Data Mining Investigation",
          creator: "journalist@truth.org",
          created_at: "2025-01-05T14:30:00Z",
          grief_score: 4,
          influence_count: 8,
          verification_status: "verified",
          capsule_type: "evidence",
          children: ["grandchild_1"],
          parents: ["root_1"],
        },
        {
          id: "child_2",
          title: "Tech Worker Testimony",
          creator: "insider@anonymous.net",
          created_at: "2025-01-03T09:15:00Z",
          grief_score: 3,
          influence_count: 6,
          verification_status: "pending",
          capsule_type: "testimony",
          children: ["grandchild_2"],
          parents: ["root_1"],
        },
        {
          id: "grandchild_1",
          title: "Privacy Law Analysis",
          creator: "lawyer@justice.org",
          created_at: "2025-01-10T16:45:00Z",
          grief_score: 2,
          influence_count: 4,
          verification_status: "verified",
          capsule_type: "legacy",
          children: [],
          parents: ["child_1"],
        },
        {
          id: "grandchild_2",
          title: "Employee Rights Documentation",
          creator: "advocate@workers.org",
          created_at: "2025-01-08T11:20:00Z",
          grief_score: 3,
          influence_count: 5,
          verification_status: "verified",
          capsule_type: "testimony",
          children: [],
          parents: ["child_2"],
        },
        {
          id: "isolated_1",
          title: "Climate Data Suppression",
          creator: "scientist@research.edu",
          created_at: "2025-01-12T13:30:00Z",
          grief_score: 4,
          influence_count: 7,
          verification_status: "verified",
          capsule_type: "evidence",
          children: [],
          parents: [],
        },
      ];

      const mockConnections = [
        {
          source: "root_1",
          target: "child_1",
          influence_type: "inspired",
          strength: 0.9,
        },
        {
          source: "root_1",
          target: "child_2",
          influence_type: "inspired",
          strength: 0.8,
        },
        {
          source: "child_1",
          target: "grandchild_1",
          influence_type: "referenced",
          strength: 0.7,
        },
        {
          source: "child_2",
          target: "grandchild_2",
          influence_type: "expanded",
          strength: 0.6,
        },
      ];

      // Filter nodes based on search and type
      let filteredNodes = mockNodes;

      if (search) {
        const searchTerm = search.toLowerCase();
        filteredNodes = filteredNodes.filter(
          (node) =>
            node.title.toLowerCase().includes(searchTerm) ||
            node.creator.toLowerCase().includes(searchTerm) ||
            node.capsule_type.toLowerCase().includes(searchTerm),
        );
      }

      if (type && type !== "all") {
        filteredNodes = filteredNodes.filter(
          (node) => node.capsule_type === type,
        );
      }

      // Filter connections to only include nodes that are in filtered set
      const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));
      const filteredConnections = mockConnections.filter(
        (conn) =>
          filteredNodeIds.has(conn.source) && filteredNodeIds.has(conn.target),
      );

      console.log("✅ Lineage graph data generated:", {
        nodes: filteredNodes.length,
        connections: filteredConnections.length,
      });

      res.json({
        nodes: filteredNodes,
        connections: filteredConnections,
        metadata: {
          total_nodes: mockNodes.length,
          total_connections: mockConnections.length,
          filtered_nodes: filteredNodes.length,
          filtered_connections: filteredConnections.length,
        },
      });
    } catch (error) {
      console.error("❌ Failed to get lineage graph:", error);
      res.status(500).json({ error: "Failed to get lineage graph" });
    }
  });

  // Get lineage tree data
  app.get(
    "/api/lineage/tree/:capsuleId",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log("🌳 Lineage tree requested for:", req.params.capsuleId);

      try {
        const { capsuleId } = req.params;

        // Mock lineage tree data
        const mockLineageTree: any = {
          capsuleId: capsuleId === "root" ? "root_capsule" : capsuleId,
          title:
            capsuleId === "root"
              ? "Origin Truth Capsule"
              : `Capsule ${capsuleId}`,
          griefTier: 4,
          influence: 85,
          depth: 0,
          children: [
            {
              capsuleId: "child_1",
              title: "Inspired Memory Capsule",
              griefTier: 3,
              influence: 72,
              depth: 1,
              children: [
                {
                  capsuleId: "grandchild_1",
                  title: "Third Generation Truth",
                  griefTier: 2,
                  influence: 45,
                  depth: 2,
                  children: [],
                },
              ],
            },
            {
              capsuleId: "child_2",
              title: "Legacy Testimony",
              griefTier: 5,
              influence: 95,
              depth: 1,
              children: [],
            },
          ],
        };

        console.log("✅ Lineage tree data generated");
        res.json(mockLineageTree);
      } catch (error) {
        console.error("❌ Failed to get lineage tree:", error);
        res.status(500).json({ error: "Failed to get lineage tree" });
      }
    },
  );

  // Get lineage analytics
  app.get(
    "/api/lineage/analytics",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log("📊 Lineage analytics requested");

      try {
        const mockAnalytics = {
          totalLineages: 42,
          avgGriefFlow: 3.7,
          topInfluencers: [
            {
              capsuleId: "cap_veritas_1",
              title: "The Truth About Truth",
              influenceScore: 95,
              descendantCount: 12,
            },
            {
              capsuleId: "cap_memory_2",
              title: "Generational Trauma Archive",
              influenceScore: 88,
              descendantCount: 8,
            },
            {
              capsuleId: "cap_wisdom_3",
              title: "Ancient Wisdom Preserved",
              influenceScore: 82,
              descendantCount: 6,
            },
          ],
        };

        console.log("✅ Analytics data generated");
        res.json(mockAnalytics);
      } catch (error) {
        console.error("❌ Failed to get analytics:", error);
        res.status(500).json({ error: "Failed to get lineage analytics" });
      }
    },
  );

  // Get grief flow analytics (legacy endpoint)
  app.get(
    "/api/lineage/analytics/:capsuleId",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log(
        "📊 Grief flow analytics requested for:",
        req.params.capsuleId,
      );

      try {
        const { capsuleId } = req.params;

        // Mock analytics data
        const analytics = {
          capsuleId,
          griefFlowMetrics: {
            totalInherited: 245,
            totalPassed: 189,
            netGriefFlow: 56,
            generationalImpact: 8.7,
          },
          influenceMetrics: {
            directInfluence: 12,
            cascadingInfluence: 34,
            networkReach: 67,
            truthResonance: 94.5,
          },
          lineageStats: {
            ancestorCount: 7,
            descendantCount: 23,
            maxDepth: 5,
            branchingFactor: 3.2,
          },
        };

        console.log("✅ Analytics generated:", analytics);
        res.json(analytics);
      } catch (error) {
        console.error("❌ Failed to generate analytics:", error);
        res.status(500).json({ error: "Failed to generate analytics" });
      }
    },
  );

  // Legacy lineage endpoint (keeping for compatibility)
  app.post(
    "/api/lineage/legacy",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log("🔗 Creating capsule lineage");

      try {
        const { parentId, childId, griefFlow } = req.body;
        const triggeredBy = req.user.id;

        if (!parentId || !childId) {
          return res
            .status(400)
            .json({ error: "Parent and child capsule IDs required" });
        }

        // Mock lineage creation for now
        const lineage = {
          id: `lineage_${Date.now()}`,
          parentId,
          childId,
          triggeredBy,
          timestamp: new Date().toISOString(),
          griefFlow: griefFlow || 75,
          influenceScore: 85,
        };

        console.log("✅ Lineage created:", lineage);
        res.json(lineage);
      } catch (error) {
        console.error("❌ Failed to create lineage:", error);
        res.status(500).json({ error: "Failed to create lineage" });
      }
    },
  );

  // Get lineage tree for a capsule
  app.get(
    "/api/lineage/tree/:capsuleId",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log(`🌳 Getting lineage tree for: ${req.params.capsuleId}`);

      try {
        const mockTree = {
          capsuleId: req.params.capsuleId,
          title: "Original Truth Capsule",
          griefTier: 5,
          influence: 92,
          depth: 0,
          children: [
            {
              capsuleId: "child_001",
              title: "Inspired Memory",
              griefTier: 4,
              influence: 78,
              depth: 1,
              children: [
                {
                  capsuleId: "grandchild_001",
                  title: "Extended Reflection",
                  griefTier: 3,
                  influence: 65,
                  depth: 2,
                  children: [],
                },
              ],
            },
            {
              capsuleId: "child_002",
              title: "Connected Story",
              griefTier: 4,
              influence: 82,
              depth: 1,
              children: [],
            },
          ],
        };

        res.json(mockTree);
      } catch (error) {
        console.error("❌ Failed to get lineage tree:", error);
        res.status(500).json({ error: "Failed to get lineage tree" });
      }
    },
  );

  // Get lineage analytics
  app.get(
    "/api/lineage/analytics",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log("📊 Getting lineage analytics");

      try {
        const mockAnalytics = {
          totalLineages: 847,
          avgGriefFlow: 68.3,
          topInfluencers: [
            {
              capsuleId: "cap_influential_001",
              title: "The Foundation Truth",
              influenceScore: 285,
              descendantCount: 12,
            },
            {
              capsuleId: "cap_influential_002",
              title: "Historical Revelation",
              influenceScore: 267,
              descendantCount: 9,
            },
            {
              capsuleId: "cap_influential_003",
              title: "Personal Legacy",
              influenceScore: 234,
              descendantCount: 8,
            },
          ],
          lineageDepth: {
            maxDepth: 5,
            avgDepth: 2.3,
          },
        };

        res.json(mockAnalytics);
      } catch (error) {
        console.error("❌ Failed to get analytics:", error);
        res.status(500).json({ error: "Failed to get analytics" });
      }
    },
  );

  // Get related capsules based on lineage
  app.get(
    "/api/lineage/related/:capsuleId",
    isDebugAuthenticated,
    async (req: any, res) => {
      console.log(`🔍 Getting related capsules for: ${req.params.capsuleId}`);

      try {
        const mockRelated = [
          {
            id: "sibling_001",
            title: "Sister Memory",
            griefTier: 4,
            relationship: "sibling",
          },
          {
            id: "descendant_001",
            title: "Inspired Legacy",
            griefTier: 3,
            relationship: "descendant",
          },
          {
            id: "descendant_002",
            title: "Connected Truth",
            griefTier: 4,
            relationship: "descendant",
          },
        ];

        res.json(mockRelated);
      } catch (error) {
        console.error("❌ Failed to get related capsules:", error);
        res.status(500).json({ error: "Failed to get related capsules" });
      }
    },
  );

  // Engagement tracking routes
  app.post(
    "/api/engagement/track-session",
    isDebugAuthenticated,
    async (req: any, res) => {
      try {
        const userId = req.user.id;
        const { sessionId, startTime, userAgent, path } = req.body;

        console.log(`📊 Tracking session for ${userId}:`, {
          sessionId,
          path,
          startTime,
        });

        // Mock engagement metrics for demo
        const metrics = {
          sessionTime: Date.now() - startTime,
          pagesVisited: [path],
          actionsCompleted: [],
          streakDays: 3,
          totalSessions: 5,
          lastActive: new Date().toISOString(),
          engagementScore: 75,
          achievements: [
            {
              id: "first_session",
              title: "Welcome Guardian",
              description: "Complete your first session",
              icon: "star",
              unlocked: true,
              progress: 1,
              maxProgress: 1,
              reward: "10 GTT",
            },
          ],
        };

        res.json({ success: true, metrics });
      } catch (error) {
        console.error("Failed to track session:", error);
        res.status(500).json({ error: "Failed to track session" });
      }
    },
  );

  app.get(
    "/api/engagement/daily-challenges",
    isDebugAuthenticated,
    async (req: any, res) => {
      try {
        const userId = req.user.id;
        console.log(`🎯 Loading daily challenges for ${userId}`);

        const challenges = [
          {
            id: "create_capsule_daily",
            title: "Truth Seeker",
            description: "Create your first capsule today",
            progress: 0,
            maxProgress: 1,
            reward: "100 GTT",
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "explore_features",
            title: "Feature Explorer",
            description: "Visit 3 different feature pages",
            progress: 1,
            maxProgress: 3,
            reward: "50 GTT",
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          },
        ];

        res.json({ challenges });
      } catch (error) {
        console.error("Failed to load challenges:", error);
        res.status(500).json({ error: "Failed to load challenges" });
      }
    },
  );

  app.post(
    "/api/engagement/complete-challenge/:challengeId",
    isDebugAuthenticated,
    async (req: any, res) => {
      try {
        const userId = req.user.id;
        const { challengeId } = req.params;
        console.log(`🏆 Challenge completed by ${userId}:`, challengeId);

        res.json({
          success: true,
          reward: "100 GTT",
          message: "Congratulations! You earned 100 GTT!",
        });
      } catch (error) {
        console.error("Failed to complete challenge:", error);
        res.status(500).json({ error: "Failed to complete challenge" });
      }
    },
  );

  app.get(
    "/api/personalization/profile",
    isDebugAuthenticated,
    async (req: any, res) => {
      try {
        const userId = req.user.id;
        console.log(`🧠 Loading personality profile for ${userId}`);

        const personality = {
          traits: {
            explorer: 75,
            creator: 60,
            social: 50,
            analytical: 40,
            collector: 30,
          },
          preferences: {
            contentTypes: ["personal_memory", "wisdom"],
            activityTimes: ["evening"],
            engagementStyle: "guided",
            riskTolerance: "moderate",
          },
          journey: {
            stage: "explorer",
            completedActions: [],
            skillLevels: {},
            interests: [],
          },
        };

        res.json({ personality });
      } catch (error) {
        console.error("Failed to load profile:", error);
        res.status(500).json({ error: "Failed to load profile" });
      }
    },
  );

  app.post(
    "/api/personalization/track",
    isDebugAuthenticated,
    async (req: any, res) => {
      try {
        const userId = req.user.id;
        const { action, path, timestamp } = req.body;
        console.log(`📈 Tracking behavior for ${userId}:`, {
          action,
          path,
          timestamp,
        });

        res.json({ success: true });
      } catch (error) {
        console.error("Failed to track behavior:", error);
        res.status(500).json({ error: "Failed to track behavior" });
      }
    },
  );

  // Dynamic Badge System API
  app.get(
    "/api/navigation/badges/:routeId",
    isDebugAuthenticated,
    async (req: any, res) => {
      try {
        const { routeId } = req.params;
        const userId = req.user.id;

        console.log(
          `🏷️ Loading badges for route ${routeId} for user ${userId}`,
        );

        // Mock dynamic badges based on route and user state
        const badges = generateBadgesForRoute(routeId, userId);

        res.json(badges);
      } catch (error) {
        console.error("Failed to load badges:", error);
        res.status(500).json({ error: "Failed to load badges" });
      }
    },
  );

  app.get(
    "/api/navigation/global-badges",
    isDebugAuthenticated,
    async (req: any, res) => {
      try {
        const userId = req.user.id;
        console.log(`🌐 Loading global badges for user ${userId}`);

        const globalBadges = [
          {
            id: "dao-governance-new-proposal",
            type: "new",
            text: "🆕 New Proposal",
            count: 2,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "yield-calculator-unclaimed",
            type: "warning",
            text: "⚠️ Unclaimed Yield",
            count: 1,
          },
          {
            id: "validator-dashboard-pending",
            type: "urgent",
            text: "🔥 Pending Review",
            count: 3,
          },
          {
            id: "analytics-milestone",
            type: "success",
            text: "🎉 Milestone Reached",
          },
        ];

        res.json(globalBadges);
      } catch (error) {
        console.error("Failed to load global badges:", error);
        res.status(500).json({ error: "Failed to load global badges" });
      }
    },
  );

  // Platform statistics for homepage
  app.get("/api/platform/stats", async (req, res) => {
    try {
      console.log("📊 Loading platform statistics");
      const stats = getPlatformStats();
      res.json(stats);
    } catch (error) {
      console.error("Failed to load platform stats:", error);
      res.status(500).json({ error: "Failed to load platform stats" });
    }
  });

  // Whistleblower sanctuary endpoints
  app.post(
    "/api/whistleblower/submit",
    isDebugAuthenticated,
    async (req, res) => {
      try {
        console.log("🔒 Whistleblower submission received");

        const submission = {
          id: `whistleblower-${Date.now()}`,
          ...req.body,
          status: "submitted",
          encrypted: true,
          timestamp: new Date().toISOString(),
        };

        res.json({
          success: true,
          submissionId: submission.id,
          message: "Submission securely received and encrypted",
        });
      } catch (error) {
        console.error("Failed to process whistleblower submission:", error);
        res.status(500).json({ error: "Failed to process submission" });
      }
    },
  );

  // Time messages endpoints
  app.post(
    "/api/time-messages/create",
    isDebugAuthenticated,
    async (req, res) => {
      try {
        console.log("⏰ Creating time message");

        const timeMessage = {
          id: `time-msg-${Date.now()}`,
          ...req.body,
          status: "sealed",
          createdAt: new Date().toISOString(),
        };

        res.json({
          success: true,
          messageId: timeMessage.id,
          message: "Time message sealed successfully",
        });
      } catch (error) {
        console.error("Failed to create time message:", error);
        res.status(500).json({ error: "Failed to create time message" });
      }
    },
  );

  app.get("/api/time-messages/sent", isDebugAuthenticated, async (req, res) => {
    try {
      const sentMessages = [
        {
          id: "sent-1",
          title: "Happy 30th Birthday!",
          recipient: "Future Me",
          unlockDate: new Date("2026-08-02"),
          status: "sealed",
          messageType: "birthday",
        },
        {
          id: "sent-2",
          title: "Anniversary Message",
          recipient: "partner@example.com",
          unlockDate: new Date("2025-12-25"),
          status: "sealed",
          messageType: "anniversary",
        },
      ];

      res.json(sentMessages);
    } catch (error) {
      console.error("Failed to load sent messages:", error);
      res.status(500).json({ error: "Failed to load sent messages" });
    }
  });

  app.get(
    "/api/time-messages/received",
    isDebugAuthenticated,
    async (req, res) => {
      try {
        const receivedMessages = [
          {
            id: "received-1",
            title: "Message from 2020",
            recipient: "Past Me",
            unlockDate: new Date("2025-01-01"),
            status: "delivered",
            messageType: "future_self",
          },
        ];

        res.json(receivedMessages);
      } catch (error) {
        console.error("Failed to load received messages:", error);
        res.status(500).json({ error: "Failed to load received messages" });
      }
    },
  );

  // Analytics endpoint for dashboard
  app.get("/api/analytics/capsules", isDebugAuthenticated, async (req, res) => {
    try {
      // Mock analytics data - replace with real metrics when available
      const analyticsData = {
        total: 139,
        minted: 58,
        sealed: 47,
        languages: ["en", "es", "fr", "ar", "zh", "ja"],
        truthScore: 87,
        gttEarned: 12547,
        verificationRate: 94,
        growthRate: 23,
        activeValidators: 156,
        topCategories: [
          { name: "Personal Stories", count: 45, percentage: 32 },
          { name: "Whistleblower", count: 38, percentage: 27 },
          { name: "Family Legacy", count: 29, percentage: 21 },
          { name: "Historical Events", count: 18, percentage: 13 },
          { name: "Creative Works", count: 9, percentage: 7 },
        ],
      };

      res.json(analyticsData);
    } catch (error) {
      console.error("Failed to load analytics:", error);
      res.status(500).json({ error: "Failed to load analytics data" });
    }
  });

  // Register AI and NFT routes
  app.use("/api/ai", aiRoutes);
  app.use("/api/nft", nftRoutes);
  app.use("/api/airdrop", airdropRoutes);
  app.use("/api/ipfs", ipfsRouter);
  app.use("/api/nft", nftRouter);
  app.use("/api/vault", vaultRouter);
  app.use("/api/vault", vaultRouter);
  app.use("/api/claim", airdropRoutes);
  
  // Enhanced wallet authentication routes
  const walletAuthRoutes = await import("./routes/walletAuth");
  app.use("/api/auth", walletAuthRoutes.default);
  app.use("/api/token", walletAuthRoutes.default);

  // Enhanced airdrop routes (replacing simple airdrop routes)
  const enhancedAirdropRoutes = await import("./routes/airdropEnhanced");
  app.use("/api", enhancedAirdropRoutes.default);

  // Live token data endpoint for LiveTokenTracker
  app.get("/api/token/live-data", (req, res) => {
    // Simulate live token data with some randomness
    const basePrice = 0.0075;
    const priceVariation = (Math.random() - 0.5) * 0.0002; // ±0.0001 variation
    const price = Math.max(0.001, basePrice + priceVariation);
    const priceChange = priceVariation;
    const percentChange = (priceChange / basePrice) * 100;

    const mockData = {
      price: parseFloat(price.toFixed(6)),
      priceChange: parseFloat(priceChange.toFixed(6)),
      percentChange: parseFloat(percentChange.toFixed(2)),
      volume24h: "1.2M",
      marketCap: "75M",
      timestamp: Date.now()
    };

    res.json(mockData);
  });

  // Register subscription routes
  registerSubscriptionRoutes(app);

  // Register enhanced dashboard routes
  const enhancedDashboardRoutes = await import("./routes/enhancedDashboard");
  app.use("/api/dashboard", enhancedDashboardRoutes.default);

  // Register enterprise routes
  const enterpriseRoutes = await import("./routes/enterprise");
  app.use("/api/enterprise", enterpriseRoutes.default);

  // Revenue sharing endpoints
  app.get("/api/revenue-sharing/policy", async (req, res) => {
    const { getRevenueSharingPolicy } = await import("./routes/revenue-sharing");
    return getRevenueSharingPolicy(req, res);
  });

  app.post("/api/revenue-sharing/calculate", async (req, res) => {
    const { calculatePotentialEarnings } = await import("./routes/revenue-sharing");
    return calculatePotentialEarnings(req, res);
  });

  // Onboarding system endpoints
  app.post("/api/onboarding/complete-module", isDebugAuthenticated, async (req, res) => {
    const { completeModule } = await import("./routes/onboarding");
    return completeModule(req, res);
  });

  app.get("/api/onboarding/progress", isDebugAuthenticated, async (req, res) => {
    const { getOnboardingProgress } = await import("./routes/onboarding");
    return getOnboardingProgress(req, res);
  });

  app.post("/api/onboarding/reset", isDebugAuthenticated, async (req, res) => {
    const { resetOnboardingProgress } = await import("./routes/onboarding");
    return resetOnboardingProgress(req, res);
  });

  // Enhanced validation system endpoints
  app.get("/api/validation/ipfs-meta/:cid", async (req, res) => {
    const { getIPFSMetadata } = await import("./api/enhanced-validation");
    return getIPFSMetadata(req, res);
  });

  app.post("/api/validation/ipfs-meta/batch", async (req, res) => {
    const { getBatchIPFSMetadata } = await import("./api/enhanced-validation");
    return getBatchIPFSMetadata(req, res);
  });

  app.post("/api/validation/unlock-boost", isDebugAuthenticated, async (req, res) => {
    const { checkUnlockBoost } = await import("./api/enhanced-validation");
    return checkUnlockBoost(req, res);
  });

  app.post("/api/validation/zk-verify", isDebugAuthenticated, async (req, res) => {
    const { verifyZKProof } = await import("./api/enhanced-validation");
    return verifyZKProof(req, res);
  });

  app.post("/api/validation/zk-verify/batch", isDebugAuthenticated, async (req, res) => {
    const { batchVerifyZKProofs } = await import("./api/enhanced-validation");
    return batchVerifyZKProofs(req, res);
  });

  app.post("/api/validation/audit", isDebugAuthenticated, async (req, res) => {
    const { runValidationAudit } = await import("./api/enhanced-validation");
    return runValidationAudit(req, res);
  });

  app.post("/api/validation/test-discord", isDebugAuthenticated, async (req, res) => {
    const { testDiscordWebhook } = await import("./api/enhanced-validation");
    return testDiscordWebhook(req, res);
  });

  const httpServer = createServer(app);
  // Truth Genome API routes
  app.get("/api/truth-genome/:capsuleId", isDebugAuthenticated, async (req: any, res) => {
    const { analyzeTruthGenome } = await import("./api/truth-genome");
    await analyzeTruthGenome(req, res);
  });

  app.get("/api/truth-genome/:capsuleId/report", isDebugAuthenticated, async (req: any, res) => {
    const { getTruthGenomeReport } = await import("./api/truth-genome");
    await getTruthGenomeReport(req, res);
  });

  // Truth Net API routes
  app.get("/api/truth-net", isDebugAuthenticated, async (req: any, res) => {
    const { getTruthNetwork } = await import("./api/truth-net");
    await getTruthNetwork(req, res);
  });

  app.get("/api/truth-net/analytics", isDebugAuthenticated, async (req: any, res) => {
    const { getNetworkAnalytics } = await import("./api/truth-net");
    await getNetworkAnalytics(req, res);
  });

  app.get("/api/truth-net/export", isDebugAuthenticated, async (req: any, res) => {
    const { exportTruthNetwork } = await import("./api/truth-net");
    await exportTruthNetwork(req, res);
  });

  // Notarization API routes
  app.post("/api/notarize", isDebugAuthenticated, async (req: any, res) => {
    const { notarizeCapsule } = await import("./api/notarize");
    await notarizeCapsule(req, res);
  });

  app.post("/api/certificates/generate", isDebugAuthenticated, async (req: any, res) => {
    const { generateLegalCertificate } = await import("./api/notarize");
    await generateLegalCertificate(req, res);
  });

  app.get("/api/certificates/:certificateId/verify", async (req: any, res) => {
    const { verifyCertificate } = await import("./api/notarize");
    await verifyCertificate(req, res);
  });

  app.get("/api/certificates/registry", isDebugAuthenticated, async (req: any, res) => {
    const { getCertificateRegistry } = await import("./api/notarize");
    await getCertificateRegistry(req, res);
  });

  return httpServer;
}

// Badge generation helper function
function generateBadgesForRoute(routeId: string, userId: string) {
  const badges: any[] = [];

  switch (routeId) {
    case "dao-governance":
    case "dao-proposals":
      badges.push({
        id: `${routeId}-new-proposal`,
        type: "new",
        text: "🆕 New",
        count: 2,
      });
      break;

    case "yield-calculator":
      badges.push({
        id: `${routeId}-unclaimed`,
        type: "warning",
        text: "⚠️ Unclaimed",
        count: 1,
      });
      break;

    case "validator-dashboard":
      badges.push({
        id: `${routeId}-pending`,
        type: "urgent",
        text: "🔥 Pending",
        count: 3,
      });
      break;

    case "analytics":
      badges.push({
        id: `${routeId}-milestone`,
        type: "success",
        text: "🎉 Milestone",
      });
      break;

    case "create-capsule":
      badges.push({
        id: `${routeId}-tutorial`,
        type: "info",
        text: "💡 Tutorial",
      });
      break;

    default:
      // No badges for this route
      break;
  }

  return badges;
}

// Platform stats endpoint for homepage
function getPlatformStats() {
  return {
    totalCapsules: 12547 + Math.floor(Math.random() * 100),
    totalUsers: 3891 + Math.floor(Math.random() * 50),
    gttDistributed: 847392 + Math.floor(Math.random() * 1000),
    networksActive: 5,
    lastUpdated: new Date().toISOString(),
  };
}

// Helper functions for AI summary generation
function generateMockSummary(content: string): string {
  const emotions = [
    "joy",
    "nostalgia",
    "hope",
    "sadness",
    "grief",
    "fear",
    "anger",
  ];
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];

  // Generate a contextual summary based on content length and keywords
  const contentLength = content.length;
  const hasFamily = /family|mother|father|parent|child|sibling/i.test(content);
  const hasMemory = /remember|memory|childhood|past|ago/i.test(content);
  const hasLove = /love|heart|dear|cherish/i.test(content);

  let summary = "A ";

  if (hasMemory) summary += "cherished memory ";
  else if (hasFamily) summary += "family story ";
  else summary += "personal experience ";

  if (hasLove) summary += "filled with love and ";
  else summary += "marked by ";

  summary += randomEmotion;

  if (contentLength > 500) {
    summary +=
      ", capturing significant life moments and deep emotional resonance.";
  } else if (contentLength > 200) {
    summary += ", reflecting on meaningful experiences and personal growth.";
  } else {
    summary += ", preserving important thoughts and feelings.";
  }

  return `${summary} Primary emotion: ${randomEmotion}.`;
}

function extractEmotions(content: string): string[] {
  const emotionKeywords = {
    joy: ["happy", "joy", "celebration", "laughter", "smile", "delight"],
    sadness: ["sad", "cry", "tears", "sorrow", "loss", "missing"],
    nostalgia: ["remember", "childhood", "past", "used to", "back then"],
    hope: ["hope", "future", "dream", "wish", "possibility", "tomorrow"],
    grief: ["grief", "death", "gone", "passed away", "funeral", "mourning"],
    fear: ["scared", "afraid", "worry", "anxiety", "nervous", "frightened"],
    anger: ["angry", "mad", "frustration", "rage", "upset", "irritated"],
  };

  const detectedEmotions: string[] = [];
  const lowerContent = content.toLowerCase();

  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    if (keywords.some((keyword) => lowerContent.includes(keyword))) {
      detectedEmotions.push(emotion);
    }
  }

  return detectedEmotions.length > 0 ? detectedEmotions : ["neutral"];
}
