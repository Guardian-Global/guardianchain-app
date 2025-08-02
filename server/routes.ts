import type { Express } from "express";
import { createServer, type Server } from "http";
import { registerGTTContractRoutes } from './routes/gttContract';
import { setupDebugAuth, isDebugAuthenticated } from "./debugAuth";
import { 
  distributeReplayYield, 
  calculateGriefYield, 
  getGTTBalance, 
  getContractInfo 
} from "./web3/gttYield";

// Get replay logs for analytics and tracking
function getReplayLogs(filters: any = {}) {
  // Mock replay logs data - in production this would query the database
  const mockLogs = [
    {
      id: 'replay_1754135800_abc123',
      capsuleId: 'cap_1754135000_xyz789',
      userId: 'debug-user-456',
      replayType: 'standard',
      yieldAmount: 2.50,
      transactionHash: '0x1234567890abcdef',
      sessionId: 'session_1754135800',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0',
      metadata: { platform: 'GuardianChain' },
      createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
    }
  ];
  
  return mockLogs.filter(log => {
    if (filters.capsuleId && log.capsuleId !== filters.capsuleId) return false;
    if (filters.userId && log.userId !== filters.userId) return false;
    if (filters.replayType && log.replayType !== filters.replayType) return false;
    return true;
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware - Setup Debug Auth for immediate testing
  setupDebugAuth(app);

  // Simple subscription status - no database calls
  app.get('/api/subscription/status', isDebugAuthenticated, async (req: any, res) => {
    console.log('🔵 DEBUG: /api/subscription/status called');
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
  });

  // Simple subscription upgrade - no database calls
  app.post('/api/subscription/upgrade', isDebugAuthenticated, async (req: any, res) => {
    console.log('🔵 DEBUG: /api/subscription/upgrade called');
    const { planId } = req.body;
    
    res.json({ 
      success: true, 
      message: "Subscription upgraded successfully",
      newTier: planId?.toUpperCase() || 'SEEKER'
    });
  });

  // Capsule Management Routes
  app.post('/api/capsules', isDebugAuthenticated, async (req: any, res) => {
    const { title, content, capsuleType, accessCost, tags, isSealed } = req.body;
    const authorId = req.user.id;

    if (!title || !content) {
      return res.status(400).json({ error: 'Missing required fields: title, content' });
    }

    const capsule = {
      id: `cap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      content,
      author: authorId,
      capsuleType: capsuleType || 'personal_memory',
      accessCost: accessCost || 0,
      tags: Array.isArray(tags) ? tags : [],
      isSealed: isSealed || false,
      verificationStatus: 'pending',
      truthScore: 0,
      views: 0,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('🔵 DEBUG: Creating capsule:', capsule);
    res.status(201).json({ success: true, capsule, message: 'Capsule created successfully' });
  });

  app.post('/api/trigger-stripe', isDebugAuthenticated, async (req: any, res) => {
    const { capsuleId, amount } = req.body;
    console.log('🔵 DEBUG: Triggering Stripe payment for capsule:', capsuleId, 'Amount:', amount);

    const paymentResult = {
      sessionId: `stripe_${Date.now()}`,
      amount: amount || 2.50,
      currency: 'GTT',
      status: 'completed',
      capsuleId,
      timestamp: new Date().toISOString()
    };

    console.log('✅ DEBUG: Stripe payment processed:', paymentResult);
    res.json({ success: true, payment: paymentResult, message: 'Payment processed and GTT rewards distributed' });
  });

  app.post('/api/replay-capsule', isDebugAuthenticated, async (req: any, res) => {
    const { 
      capsuleId, 
      authorId, 
      authorWalletAddress,
      viewerWalletAddress,
      truthScore = 75,
      verificationCount = 1,
      capsuleAge = Date.now() - 86400000 // 1 day old default
    } = req.body;
    
    if (!capsuleId) {
      return res.status(400).json({ error: 'Missing capsuleId' });
    }

    console.log('🔵 DEBUG: Processing capsule replay with Web3 yield distribution');

    try {
      // Calculate advanced grief-based yield
      const yieldCalculation = await calculateGriefYield(truthScore, verificationCount, capsuleAge);
      console.log('📊 Grief yield calculation:', yieldCalculation);

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
            yieldCalculation.totalYield
          );
          transactionHash = web3Result.authorTxHash;
          console.log('⛓️ Web3 yield distribution successful:', web3Result);
        } catch (web3Error) {
          console.warn('⚠️ Web3 yield distribution failed, continuing with mock:', web3Error);
          // Continue with mock data for development
        }
      }
      
      const replayLog = {
        id: replayLogId,
        capsuleId,
        userId: req.user.id,
        replayType: web3Result ? 'web3_verified' : 'standard',
        yieldAmount: Math.round(yieldCalculation.totalYield * 100),
        transactionHash,
        sessionId: req.sessionID || `session_${Date.now()}`,
        ipAddress: req.ip || 'unknown',
        userAgent: req.get('User-Agent') || 'unknown',
        metadata: {
          authorId,
          authorWalletAddress,
          viewerWalletAddress,
          yieldCalculation,
          web3Result,
          requestTimestamp: new Date().toISOString(),
          platform: 'GuardianChain'
        },
        createdAt: new Date().toISOString()
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
        isWeb3Verified: !!web3Result
      };

      console.log('✅ Advanced replay completed with grief-based yield');
      res.json({ 
        success: true, 
        replay: replayResult, 
        replayLog, 
        message: 'Capsule replayed with advanced grief-based yield distribution' 
      });

    } catch (error) {
      console.error('❌ Replay processing failed:', error);
      res.status(500).json({ 
        error: 'Replay processing failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  app.post('/api/purchase-capsule-access', isDebugAuthenticated, async (req: any, res) => {
    const { capsuleId, amount } = req.body;
    console.log('🔵 DEBUG: Processing capsule access purchase:', capsuleId, 'Amount:', amount);

    const sessionUrl = `https://checkout.stripe.com/pay/test_session_${Date.now()}`;
    res.json({ success: true, sessionUrl, amount, capsuleId, message: 'Payment session created' });
  });

  app.post('/api/distribute-gtt-yield', isDebugAuthenticated, async (req: any, res) => {
    const { recipientId, amount, reason, capsuleId } = req.body;
    
    console.log('🔵 DEBUG: Distributing GTT yield:', { recipientId, amount, reason, capsuleId });

    const distribution = {
      id: `dist_${Date.now()}`,
      recipientId,
      amount,
      reason,
      capsuleId,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };

    console.log('✅ DEBUG: GTT yield distributed:', distribution);
    res.json({ success: true, distribution, message: 'GTT yield distributed successfully' });
  });

  // Get replay logs for analytics
  app.get('/api/replay-logs', isDebugAuthenticated, async (req: any, res) => {
    const { capsuleId, userId, replayType, limit = 50 } = req.query;
    
    console.log('🔵 DEBUG: Fetching replay logs with filters:', { capsuleId, userId, replayType, limit });
    
    const filters = { capsuleId, userId, replayType };
    const logs = getReplayLogs(filters).slice(0, parseInt(limit));
    
    const analytics = {
      totalReplays: logs.length,
      totalYieldDistributed: logs.reduce((sum, log) => sum + log.yieldAmount, 0),
      uniqueUsers: new Set(logs.map(log => log.userId)).size,
      replayTypes: logs.reduce((acc, log) => {
        acc[log.replayType] = (acc[log.replayType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
    
    console.log('✅ DEBUG: Replay logs analytics:', analytics);
    res.json({ success: true, logs, analytics, message: 'Replay logs retrieved successfully' });
  });

  // Get replay logs for specific capsule
  app.get('/api/capsules/:capsuleId/replay-logs', isDebugAuthenticated, async (req: any, res) => {
    const { capsuleId } = req.params;
    const { limit = 20 } = req.query;
    
    console.log('🔵 DEBUG: Fetching replay logs for capsule:', capsuleId);
    
    const logs = getReplayLogs({ capsuleId }).slice(0, parseInt(limit));
    
    console.log('✅ DEBUG: Capsule replay logs retrieved:', logs.length, 'entries');
    res.json({ success: true, logs, capsuleId, message: 'Capsule replay logs retrieved successfully' });
  });

  // Get GTT balance for user wallet
  app.get('/api/gtt/balance/:address', isDebugAuthenticated, async (req: any, res) => {
    const { address } = req.params;
    
    try {
      console.log('🔵 DEBUG: Fetching GTT balance for address:', address);
      const balance = await getGTTBalance(address);
      
      console.log('✅ GTT balance retrieved:', balance);
      res.json({ success: true, address, balance, symbol: 'GTT' });
    } catch (error) {
      console.error('❌ Failed to get GTT balance:', error);
      res.status(500).json({ 
        error: 'Failed to get GTT balance', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  // Get GTT contract information
  app.get('/api/gtt/contract-info', async (req, res) => {
    try {
      console.log('🔵 DEBUG: Fetching GTT contract information');
      const contractInfo = await getContractInfo();
      
      if (contractInfo) {
        console.log('✅ GTT contract info retrieved');
        res.json({ success: true, contract: contractInfo });
      } else {
        res.status(500).json({ error: 'Failed to retrieve contract information' });
      }
    } catch (error) {
      console.error('❌ Failed to get contract info:', error);
      res.status(500).json({ 
        error: 'Failed to get contract info', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  // Calculate grief-based yield for capsule
  app.post('/api/gtt/calculate-yield', isDebugAuthenticated, async (req: any, res) => {
    const { truthScore, verificationCount, capsuleAge } = req.body;
    
    try {
      console.log('🔵 DEBUG: Calculating grief-based yield');
      const yieldCalculation = await calculateGriefYield(
        truthScore || 75,
        verificationCount || 1,
        capsuleAge || Date.now() - 86400000
      );
      
      console.log('✅ Yield calculation completed:', yieldCalculation);
      res.json({ success: true, yieldCalculation, message: 'Grief-based yield calculated successfully' });
    } catch (error) {
      console.error('❌ Yield calculation failed:', error);
      res.status(500).json({ 
        error: 'Yield calculation failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  // Direct GTT yield distribution endpoint
  app.post('/api/gtt/distribute-yield', isDebugAuthenticated, async (req: any, res) => {
    const { authorAddress, griefTier } = req.body;
    
    if (!authorAddress || !griefTier) {
      return res.status(400).json({ error: 'Missing authorAddress or griefTier' });
    }

    try {
      console.log('🔵 DEBUG: Direct GTT yield distribution:', { authorAddress, griefTier });
      
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
        status: 'completed',
        network: 'Polygon',
        blockNumber: Math.floor(Math.random() * 1000000) + 50000000
      };

      console.log('✅ GTT yield distributed:', distribution);
      res.json({ success: true, distribution, transactionHash, message: 'GTT yield distributed successfully' });
    } catch (error) {
      console.error('❌ GTT yield distribution failed:', error);
      res.status(500).json({ 
        error: 'GTT yield distribution failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  // GTT balance endpoint
  app.get('/api/gtt/balance/:address', isDebugAuthenticated, async (req: any, res) => {
    const { address } = req.params;
    
    try {
      console.log('🔵 DEBUG: Getting GTT balance for:', address);
      
      // Mock balance for development
      const mockBalance = "125.50";
      
      res.json({ success: true, balance: mockBalance, address });
    } catch (error) {
      console.error('❌ Failed to get GTT balance:', error);
      res.status(500).json({ 
        error: 'Failed to get GTT balance', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  // GTT contract info endpoint
  app.get('/api/gtt/contract-info', isDebugAuthenticated, async (req: any, res) => {
    try {
      console.log('🔵 DEBUG: Getting GTT contract info');
      
      const contractInfo = {
        name: 'GuardianChain Truth Token',
        symbol: 'GTT',
        totalSupply: '1000000000',
        decimals: 18,
        contractAddress: '0x0000000000000000000000000000000000000000',
        network: 'Polygon',
        status: 'development'
      };
      
      res.json({ success: true, contract: contractInfo });
    } catch (error) {
      console.error('❌ Failed to get contract info:', error);
      res.status(500).json({ 
        error: 'Failed to get contract info', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  // Register GTT Contract routes
  registerGTTContractRoutes(app);

  // Register metadata routes
  const { registerMetadataRoutes } = await import('./routes/metadata');
  registerMetadataRoutes(app);

  // Analytics dashboard endpoint
  app.get('/api/analytics/dashboard', isDebugAuthenticated, async (req: any, res) => {
    try {
      // Mock analytics data - in production this would query the database
      const analyticsData = {
        dailyReplays: {
          labels: Array.from({ length: 14 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toISOString().split('T')[0];
          }).reverse(),
          counts: [12, 19, 8, 15, 23, 18, 27, 31, 22, 16, 25, 29, 34, 28]
        },
        griefTierDistribution: {
          labels: ["Tier 1", "Tier 2", "Tier 3", "Tier 4", "Tier 5"],
          data: [45, 32, 28, 18, 12]
        },
        yieldDistribution: {
          total: 2850,
          byTier: [450, 640, 840, 720, 600]
        },
        topCapsules: [
          {
            id: 'cap_1754140000_abc123',
            title: 'A Message from the Past',
            replays: 156,
            yield: 312
          },
          {
            id: 'cap_1754139000_def456',
            title: 'Family Legacy',
            replays: 134,
            yield: 268
          },
          {
            id: 'cap_1754138000_ghi789',
            title: 'The Truth About...',
            replays: 98,
            yield: 196
          },
          {
            id: 'cap_1754137000_jkl012',
            title: 'War Stories',
            replays: 87,
            yield: 174
          },
          {
            id: 'cap_1754136000_mno345',
            title: 'Lost Memories',
            replays: 76,
            yield: 152
          }
        ]
      };

      console.log('📊 Analytics dashboard data requested');
      res.json(analyticsData);
    } catch (error) {
      console.error('❌ Analytics dashboard error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch analytics data',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Moderation logs endpoint
  app.get('/api/moderation/logs', isDebugAuthenticated, async (req: any, res) => {
    try {
      // Mock moderation logs - in production this would query the database
      const mockLogs = [
        {
          id: 'mod_1754140001',
          content: 'This capsule contains family memories from the 1980s...',
          user: 'user_abc123',
          reason: 'Content approved after review',
          severity: 1,
          flags: [],
          status: 'approved',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          reviewed_at: new Date(Date.now() - 3600000).toISOString(),
          reviewer: 'admin_def456'
        },
        {
          id: 'mod_1754140002', 
          content: 'A story about overcoming challenges in life...',
          user: 'user_xyz789',
          reason: 'Flagged for emotional content review',
          severity: 3,
          flags: ['emotional_content'],
          status: 'pending',
          created_at: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: 'mod_1754140003',
          content: 'Historical account of family immigration...',
          user: 'user_hist001',
          reason: 'Content contains sensitive historical information',
          severity: 2,
          flags: ['historical_content'],
          status: 'approved',
          created_at: new Date(Date.now() - 14400000).toISOString(),
          reviewed_at: new Date(Date.now() - 1800000).toISOString(),
          reviewer: 'admin_def456'
        }
      ];
      
      console.log('📋 Moderation logs requested');
      res.json(mockLogs);
    } catch (error) {
      console.error('❌ Moderation logs error:', error);
      res.status(500).json({ error: 'Failed to fetch moderation logs' });
    }
  });

  // Moderation statistics endpoint
  app.get('/api/moderation/stats', isDebugAuthenticated, async (req: any, res) => {
    try {
      const mockStats = {
        total: 156,
        pending: 8,
        approved: 132,
        rejected: 16,
        todayTotal: 12
      };
      
      console.log('📊 Moderation stats requested');
      res.json(mockStats);
    } catch (error) {
      console.error('❌ Moderation stats error:', error);
      res.status(500).json({ error: 'Failed to fetch moderation statistics' });
    }
  });

  // Moderation review action endpoint
  app.post('/api/moderation/review', isDebugAuthenticated, async (req: any, res) => {
    try {
      const { logId, action, reviewerNotes } = req.body;
      
      if (!logId || !action) {
        return res.status(400).json({ error: 'Missing required fields: logId, action' });
      }
      
      // In production, this would update the database
      const reviewResult = {
        logId,
        action,
        reviewerNotes,
        reviewedBy: req.user.id,
        reviewedAt: new Date().toISOString(),
        status: 'completed'
      };
      
      console.log('✅ Moderation review completed:', reviewResult);
      res.json(reviewResult);
    } catch (error) {
      console.error('❌ Moderation review failed:', error);
      res.status(500).json({ error: 'Failed to process moderation review' });
    }
  });

  // Capsule creation endpoint
  app.post('/api/capsules', isDebugAuthenticated, async (req: any, res) => {
    try {
      const { title, content, griefTier, category, nftTokenId, transactionHash } = req.body;
      
      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      // In production, this would create a capsule in the database
      const capsule = {
        id: `cap_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
        title,
        content,
        griefTier: griefTier || 3,
        category: category || 'memory',
        nftTokenId,
        transactionHash,
        author: req.user.id,
        createdAt: new Date().toISOString(),
        status: 'active'
      };
      
      console.log('📦 Capsule created:', { 
        id: capsule.id, 
        title, 
        griefTier: capsule.griefTier,
        category,
        nftTokenId 
      });
      
      res.json(capsule);
    } catch (error) {
      console.error('❌ Capsule creation failed:', error);
      res.status(500).json({ 
        error: 'Failed to create capsule',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get single capsule endpoint
  app.get('/api/capsules/:id', isDebugAuthenticated, async (req: any, res) => {
    try {
      const capsuleId = req.params.id;
      
      if (!capsuleId) {
        return res.status(400).json({ error: 'Capsule ID is required' });
      }

      // Mock single capsule data - in production this would query the database
      const mockCapsule = {
        id: capsuleId,
        title: 'Family Memories from the 1980s',
        content: `Growing up in a small town in the 1980s was a magical experience. I remember the summer evenings when the whole neighborhood would come alive with the sounds of children playing, lawn mowers humming, and the distant melody of ice cream trucks.

Our house was a modest two-story colonial with a wraparound porch where my grandmother would sit in her rocking chair, watching the world go by. She had the most incredible stories about our family's journey to America, tales that seemed like fairy tales to my young mind.

I can still smell the fresh-baked apple pies cooling on the windowsill and hear my mother's voice calling us in for dinner as the sun began to set. Those were simpler times, when a bicycle and your imagination were all you needed for adventure.

This memory is preserved here as a testament to the beauty of ordinary moments that become extraordinary in retrospect. The love, laughter, and lessons learned in that small town shaped who I am today.`,
        griefTier: 2,
        category: 'memory',
        nftTokenId: '1234',
        transactionHash: '0x' + Math.random().toString(16).slice(2, 66),
        author: req.user.id,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        status: 'active',
        replays: 15,
        yieldEarned: 30
      };
      
      console.log('📦 Single capsule requested:', capsuleId);
      res.json(mockCapsule);
    } catch (error) {
      console.error('❌ Failed to fetch capsule:', error);
      res.status(500).json({ 
        error: 'Failed to fetch capsule',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get user capsules endpoint
  app.get('/api/capsules', isDebugAuthenticated, async (req: any, res) => {
    try {
      // Mock user capsules - in production this would query the database
      const mockCapsules = [
        {
          id: 'cap_1754140001_abc123',
          title: 'Family Memories from the 1980s',
          content: 'Growing up in a small town...',
          griefTier: 2,
          category: 'memory',
          nftTokenId: '1234',
          author: req.user.id,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          status: 'active',
          replays: 12,
          yieldEarned: 24
        },
        {
          id: 'cap_1754140002_def456',
          title: 'A Message to Future Generations',
          content: 'The wisdom I want to pass down...',
          griefTier: 3,
          category: 'legacy',
          nftTokenId: '1235',
          author: req.user.id,
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          status: 'active',
          replays: 8,
          yieldEarned: 24
        }
      ];
      
      console.log('📋 User capsules requested');
      res.json(mockCapsules);
    } catch (error) {
      console.error('❌ Failed to fetch capsules:', error);
      res.status(500).json({ error: 'Failed to fetch capsules' });
    }
  });

  // Capsule replay endpoint
  app.post('/api/capsules/replay', isDebugAuthenticated, async (req: any, res) => {
    try {
      const { capsuleId, emotionalResponse, timestamp } = req.body;
      
      if (!capsuleId || typeof emotionalResponse !== 'number') {
        return res.status(400).json({ error: 'Capsule ID and emotional response are required' });
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
        status: 'completed'
      };

      console.log('🎬 Capsule replay completed:', {
        capsuleId,
        emotionalResponse,
        yieldAmount,
        user: req.user.id
      });

      res.json({
        success: true,
        replayId: replayRecord.id,
        yieldAmount,
        emotionalResponse,
        message: `Replay completed! You earned ${yieldAmount} GTT tokens.`
      });
    } catch (error) {
      console.error('❌ Capsule replay failed:', error);
      res.status(500).json({ 
        error: 'Failed to process capsule replay',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // AI Summary endpoint
  app.post('/api/ai-summary', isDebugAuthenticated, async (req: any, res) => {
    try {
      const { content, capsule_id } = req.body;
      
      if (!content) {
        return res.status(400).json({ error: 'Content is required' });
      }

      const summaryPrompt = `Summarize the following memory as 1 sentence and classify the primary emotion (joy, sadness, fear, anger, nostalgia, hope, grief):\n\n"${content}"`;

      // In production, this would use the actual OpenAI API
      // For now, we'll simulate the AI summary generation
      const mockSummary = generateMockSummary(content);
      
      console.log('🤖 AI Summary generated:', { 
        capsule_id, 
        summary: mockSummary.substring(0, 50) + '...' 
      });

      // In production, this would update the database
      // await storage.updateCapsuleSummary(capsule_id, mockSummary);

      res.status(200).json({ 
        summary: mockSummary,
        capsule_id,
        emotions_detected: extractEmotions(content)
      });
    } catch (error) {
      console.error('❌ AI Summary failed:', error);
      res.status(500).json({ 
        error: 'Failed to generate AI summary',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // ROI Analysis endpoint
  app.get('/api/roi/:id', isDebugAuthenticated, async (req: any, res) => {
    try {
      const capsuleId = req.params.id;
      
      if (!capsuleId) {
        return res.status(400).json({ error: 'Capsule ID is required' });
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
        roi: gttEarned > 0 ? '∞%' : '0%' // Infinite ROI since creation is free
      };

      console.log('📊 ROI Analysis requested:', { capsuleId, gttEarned });
      res.status(200).json(roiData);
    } catch (error) {
      console.error('❌ ROI Analysis failed:', error);
      res.status(500).json({ 
        error: 'Failed to generate ROI analysis',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Content moderation endpoint
  app.post('/api/moderate-content', isDebugAuthenticated, async (req: any, res) => {
    try {
      const { content } = req.body;
      
      if (!content) {
        return res.status(400).json({ error: 'Content is required' });
      }

      // Import moderation function
      const { moderateCapsule, calculateGriefScore } = await import('./lib/moderation');
      
      const moderationResult = await moderateCapsule(content);
      const griefScore = await calculateGriefScore(content);
      
      console.log('🔍 Content moderated:', { 
        isAllowed: moderationResult.isAllowed, 
        griefScore,
        flags: moderationResult.flags 
      });
      
      res.json({
        moderation: moderationResult,
        griefScore,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Content moderation failed:', error);
      res.status(500).json({ 
        error: 'Content moderation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Simple auth user endpoint - no database calls
  app.get('/api/auth/user', isDebugAuthenticated, async (req: any, res) => {
    console.log('🔵 DEBUG: /api/auth/user called');
    const sessionUser = req.user;
    
    const responseUser = {
      id: sessionUser.id,
      email: sessionUser.email,
      firstName: sessionUser.firstName,
      lastName: sessionUser.lastName,
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
  });

  // Login route for debug authentication - simulates successful login
  app.get('/api/login', (req, res) => {
    console.log('🔵 DEBUG: Login route accessed');
    // Simulate successful login and redirect to home
    res.redirect('/');
  });

  // Logout route for debug authentication
  app.get('/api/logout', (req, res) => {
    console.log('🔵 DEBUG: Logout route accessed');
    // Simply redirect to home (debug auth will show landing page)
    res.redirect('/');
  });

  // Capsule creation endpoint
  app.post('/api/capsules', isDebugAuthenticated, async (req: any, res) => {
    console.log('🔵 DEBUG: /api/capsules POST called');
    const user = req.user;
    const capsuleData = req.body;
    
    // Create a mock capsule with comprehensive data
    const newCapsule = {
      id: `capsule-${Date.now()}`,
      title: capsuleData.title,
      content: capsuleData.content,
      capsuleType: capsuleData.capsuleType,
      veritasSealType: capsuleData.veritasSealType,
      urgencyLevel: capsuleData.urgencyLevel || 'normal',
      sensitivityLevel: capsuleData.sensitivityLevel || 'public',
      legalImportance: capsuleData.legalImportance || 'standard',
      evidenceType: capsuleData.evidenceType,
      submissionMethod: capsuleData.submissionMethod || 'standard',
      tags: capsuleData.tags || [],
      authorId: user.id,
      status: 'pending',
      verificationCount: 0,
      truthScore: 0,
      isPrivate: capsuleData.isPrivate || false,
      accessCost: capsuleData.accessCost || 0,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('✅ DEBUG: Created capsule:', newCapsule);
    res.status(201).json(newCapsule);
  });

  // Get user capsules
  app.get('/api/capsules', isDebugAuthenticated, async (req: any, res) => {
    console.log('📋 User capsules requested');
    const user = req.user;
    
    // Return enhanced mock capsules with comprehensive data
    const mockCapsules = [
      {
        id: 'cap_1754140001_abc123',
        title: 'Family Legacy Documentation',
        content: 'Important family documents and memories preserved for future generations.',
        capsuleType: 'personal_memory',
        veritasSealType: 'notarized_statement',
        urgencyLevel: 'normal',
        sensitivityLevel: 'private',
        legalImportance: 'standard',
        authorId: user.id,
        status: 'verified',
        verificationCount: 2,
        truthScore: 92,
        tags: ['family', 'legacy', 'private'],
        accessCost: 0,
        viewCount: 5,
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        updatedAt: new Date(Date.now() - 86400000).toISOString()   // 1 day ago
      },
      {
        id: 'cap_1754140002_def456',
        title: 'Corporate Transparency Report',
        content: 'Quarterly financial disclosures and governance updates.',
        capsuleType: 'corporate_filing',
        veritasSealType: 'auditor_certified',
        urgencyLevel: 'high',
        sensitivityLevel: 'public',
        legalImportance: 'regulatory',
        authorId: user.id,
        status: 'pending',
        verificationCount: 0,
        truthScore: 0,
        tags: ['corporate', 'financial', 'transparency'],
        accessCost: 2.5,
        viewCount: 0,
        createdAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
        updatedAt: new Date(Date.now() - 43200000).toISOString()
      }
    ];
    
    res.json(mockCapsules);
  });

  // DAO Governance Routes
  
  // Get all proposals with voting data
  app.get('/api/dao/proposals', isDebugAuthenticated, async (req: any, res) => {
    console.log('🏛️ DAO proposals requested');
    
    const mockProposals = [
      {
        id: 'prop_1754140100_gov001',
        title: 'Increase GTT Yield Rewards for Truth Verification',
        description: 'Proposal to increase GTT token rewards from 10 to 15 tokens per verified truth capsule to incentivize more community participation in verification processes.',
        status: 'open',
        startTime: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        endTime: new Date(Date.now() + 518400000).toISOString(),  // 6 days from now
        createdBy: 'dao-member-123',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        votes: [
          {
            id: 'vote_001',
            proposalId: 'prop_1754140100_gov001',
            voterAddress: '0x1234567890abcdef',
            choice: 'support',
            weight: 1000,
            castAt: new Date(Date.now() - 43200000).toISOString()
          },
          {
            id: 'vote_002',
            proposalId: 'prop_1754140100_gov001',
            voterAddress: '0xfedcba0987654321',
            choice: 'support',
            weight: 750,
            castAt: new Date(Date.now() - 21600000).toISOString()
          },
          {
            id: 'vote_003',
            proposalId: 'prop_1754140100_gov001',
            voterAddress: '0x9876543210fedcba',
            choice: 'reject',
            weight: 500,
            castAt: new Date(Date.now() - 10800000).toISOString()
          }
        ],
        supportVotes: 2,
        rejectVotes: 1,
        abstainVotes: 0,
        totalWeight: 2250
      },
      {
        id: 'prop_1754140200_gov002',
        title: 'Implement Tiered Access for Premium Capsule Features',
        description: 'Introduce a tiered access system where premium features like advanced encryption, priority verification, and extended storage are available to higher-tier subscribers.',
        status: 'open',
        startTime: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        endTime: new Date(Date.now() + 345600000).toISOString(),   // 4 days from now
        createdBy: 'dao-member-456',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
        votes: [
          {
            id: 'vote_004',
            proposalId: 'prop_1754140200_gov002',
            voterAddress: '0xabcdef1234567890',
            choice: 'support',
            weight: 1500,
            castAt: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: 'vote_005',
            proposalId: 'prop_1754140200_gov002',
            voterAddress: '0x5678901234abcdef',
            choice: 'abstain',
            weight: 300,
            castAt: new Date(Date.now() - 43200000).toISOString()
          }
        ],
        supportVotes: 1,
        rejectVotes: 0,
        abstainVotes: 1,
        totalWeight: 1800
      }
    ];
    
    res.json(mockProposals);
  });

  // Create new proposal
  app.post('/api/dao/proposals', isDebugAuthenticated, async (req: any, res) => {
    console.log('🏛️ Creating new DAO proposal');
    const user = req.user;
    const { title, description, endTime } = req.body;
    
    const newProposal = {
      id: `prop_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      title,
      description,
      status: 'open',
      startTime: new Date().toISOString(),
      endTime: endTime ? new Date(endTime).toISOString() : null,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      votes: [],
      supportVotes: 0,
      rejectVotes: 0,
      abstainVotes: 0,
      totalWeight: 0
    };
    
    console.log('✅ Proposal created:', newProposal.id);
    res.status(201).json(newProposal);
  });

  // Vote on proposal
  app.post('/api/dao/vote', isDebugAuthenticated, async (req: any, res) => {
    console.log('🗳️ Processing DAO vote');
    const user = req.user;
    const { proposalId, choice } = req.body;
    
    // Simulate wallet address (in production, this would come from Web3 wallet)
    const walletAddress = user.walletAddress || `0x${Math.random().toString(16).substring(2, 42)}`;
    
    const vote = {
      id: `vote_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      proposalId,
      voterAddress: walletAddress,
      choice, // support, reject, abstain
      weight: 100, // Base voting weight (would be calculated from GTT holdings)
      castAt: new Date().toISOString()
    };
    
    console.log('✅ Vote recorded:', vote.id, 'Choice:', choice);
    res.status(201).json(vote);
  });

  // Get vote results for a specific proposal
  app.get('/api/dao/results/:id', isDebugAuthenticated, async (req: any, res) => {
    console.log('📊 Vote results requested for proposal:', req.params.id);
    const proposalId = req.params.id;
    
    // Mock vote data calculation (in production this would query the database)
    const mockVoteData = {
      'prop_1754140100_gov001': {
        title: 'Increase GTT Yield Rewards for Truth Verification',
        votes: [
          { choice: 'support', weight: 1000 },
          { choice: 'support', weight: 750 },
          { choice: 'reject', weight: 500 },
          { choice: 'abstain', weight: 200 }
        ]
      },
      'prop_1754140200_gov002': {
        title: 'Implement Tiered Access for Premium Capsule Features',
        votes: [
          { choice: 'support', weight: 1500 },
          { choice: 'abstain', weight: 300 },
          { choice: 'reject', weight: 200 }
        ]
      }
    };
    
    const proposalData = mockVoteData[proposalId as keyof typeof mockVoteData];
    
    if (!proposalData) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    
    // Calculate vote tallies
    let total = 0, support = 0, reject = 0, abstain = 0;
    proposalData.votes.forEach(vote => {
      const weight = Number(vote.weight);
      total += weight;
      if (vote.choice === 'support') support += weight;
      if (vote.choice === 'reject') reject += weight;
      if (vote.choice === 'abstain') abstain += weight;
    });
    
    const results = {
      title: proposalData.title,
      total,
      support,
      reject,
      abstain,
      supportPct: total ? ((support / total) * 100).toFixed(1) : '0',
      rejectPct: total ? ((reject / total) * 100).toFixed(1) : '0',
      abstainPct: total ? ((abstain / total) * 100).toFixed(1) : '0',
      result: support > reject ? 'Accepted' : 'Rejected',
      status: support > (total * 0.6) ? 'Passed' : support > reject ? 'Accepted' : 'Rejected'
    };
    
    console.log('✅ Vote results calculated:', results);
    res.json(results);
  });

  // Get truth certificates
  app.get('/api/dao/certificates', isDebugAuthenticated, async (req: any, res) => {
    console.log('📜 Truth certificates requested');
    
    const mockCertificates = [
      {
        id: 'cert_1754140300_abc123',
        capsuleId: 'cap_1754140001_abc123',
        walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        hash: '0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
        signedPdfUrl: '/certificates/truth_certificate_cap_1754140001_abc123.pdf',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
    
    res.json(mockCertificates);
  });

  // Fix token data API with proper JSON response
  app.get('/api/token/live-data', (req, res) => {
    res.status(200).json({
      price: 0.0075,
      priceChange: 0.0001,
      marketCap: 7500000
    });
  });

  // Fix get-user-tier API with debug authentication
  app.get('/api/get-user-tier', isDebugAuthenticated, (req: any, res) => {
    res.status(200).json({ tier: "seeker" });
  });

  // Admin configuration endpoints
  app.get('/api/admin/config', isDebugAuthenticated, async (req: any, res) => {
    const user = req.user;
    const isAdmin = user?.email === 'admin@guardianchain.app' || user?.tier === 'ADMIN';
    
    if (!isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const configItems = [
      { key: "projectName", value: "GuardianChain", type: "string", editable: false },
      { key: "defaultTier", value: "guest", type: "string", editable: true },
      { key: "projectStatus", value: "production", type: "string", editable: true },
      { key: "veritasSealRequired", value: "true", type: "boolean", editable: true },
      { key: "stripeEnabled", value: "true", type: "boolean", editable: true },
      { key: "capsuleReplayFee", value: "2.50", type: "number", editable: true },
      { key: "griefScoreEnabled", value: "true", type: "boolean", editable: true },
      { key: "aiModeration", value: "on", type: "string", editable: true },
      { key: "ipfsPinning", value: "pinata", type: "string", editable: true },
      { key: "network", value: "polygon-mainnet", type: "string", editable: false }
    ];

    res.json({ config: configItems, lastUpdated: new Date().toISOString() });
  });

  app.post('/api/admin/config', isDebugAuthenticated, async (req: any, res) => {
    const user = req.user;
    const isAdmin = user?.email === 'admin@guardianchain.app' || user?.tier === 'ADMIN';
    
    if (!isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { updates } = req.body;
    res.json({ 
      success: true, 
      appliedUpdates: Object.keys(updates || {}),
      updatedAt: new Date().toISOString()
    });
  });

  // Public config endpoint
  app.get('/api/config', async (req, res) => {
    const config = {
      projectName: "GuardianChain",
      defaultTier: "guest",
      projectStatus: "production",
      veritasSealRequired: true,
      stripeEnabled: true,
      capsuleReplayFee: 2.50,
      griefScoreEnabled: true,
      aiModeration: "on",
      ipfsPinning: "pinata",
      allowedWallets: ["metamask", "walletconnect"],
      network: "polygon-mainnet"
    };
    
    res.json(config);
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper functions for AI summary generation
function generateMockSummary(content: string): string {
  const emotions = ['joy', 'nostalgia', 'hope', 'sadness', 'grief', 'fear', 'anger'];
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
    summary += ", capturing significant life moments and deep emotional resonance.";
  } else if (contentLength > 200) {
    summary += ", reflecting on meaningful experiences and personal growth.";
  } else {
    summary += ", preserving important thoughts and feelings.";
  }
  
  return `${summary} Primary emotion: ${randomEmotion}.`;
}

function extractEmotions(content: string): string[] {
  const emotionKeywords = {
    joy: ['happy', 'joy', 'celebration', 'laughter', 'smile', 'delight'],
    sadness: ['sad', 'cry', 'tears', 'sorrow', 'loss', 'missing'],
    nostalgia: ['remember', 'childhood', 'past', 'used to', 'back then'],
    hope: ['hope', 'future', 'dream', 'wish', 'possibility', 'tomorrow'],
    grief: ['grief', 'death', 'gone', 'passed away', 'funeral', 'mourning'],
    fear: ['scared', 'afraid', 'worry', 'anxiety', 'nervous', 'frightened'],
    anger: ['angry', 'mad', 'frustration', 'rage', 'upset', 'irritated']
  };
  
  const detectedEmotions: string[] = [];
  const lowerContent = content.toLowerCase();
  
  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    if (keywords.some(keyword => lowerContent.includes(keyword))) {
      detectedEmotions.push(emotion);
    }
  }
  
  return detectedEmotions.length > 0 ? detectedEmotions : ['neutral'];
}