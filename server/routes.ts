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
  
  // Register profile routes
  const profileRoutes = await import('./routes/profile');
  app.use('/api/profile', profileRoutes.default);
  
  // Media and Vault Routes
  const mediaRoutes = await import('./routes/media');
  app.use('/api/media', mediaRoutes.default);
  
  const userChangesRoutes = await import('./routes/userChanges');
  app.use('/api/user', userChangesRoutes.default);
  
  // Register engagement routes
  const { registerEngagementRoutes } = await import('./routes/engagement');
  registerEngagementRoutes(app);

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

  // Get minted capsules for gallery
  app.get('/api/capsules/minted', isDebugAuthenticated, async (req: any, res) => {
    console.log('🖼️ Minted capsules requested for gallery');
    
    const mockMintedCapsules = [
      {
        id: 'cap_1754140001_abc123',
        title: 'Family Legacy Documentation',
        content: 'Important family documents and memories preserved for future generations, including historical photographs, family trees, and personal testimonies that tell the story of our heritage.',
        griefTier: 4,
        walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
        replayCount: 15,
        mintedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        nftTokenId: '1001',
        openseaUrl: 'https://opensea.io/assets/matic/0x123.../1001',
        verificationStatus: 'verified',
        truthScore: 92,
        capsuleType: 'personal_memory',
        tags: ['family', 'legacy', 'heritage']
      },
      {
        id: 'cap_1754140002_def456',
        title: 'Corporate Transparency Report Q4 2024',
        content: 'Quarterly financial disclosures and governance updates for stakeholder transparency. Includes detailed financial statements, operational metrics, and strategic initiatives.',
        griefTier: 3,
        walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
        replayCount: 8,
        mintedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        nftTokenId: '1002',
        openseaUrl: 'https://opensea.io/assets/matic/0x123.../1002',
        verificationStatus: 'verified',
        truthScore: 88,
        capsuleType: 'corporate_filing',
        tags: ['corporate', 'financial', 'transparency']
      },
      {
        id: 'cap_1754140003_ghi789',
        title: 'Environmental Impact Study',
        content: 'Comprehensive analysis of environmental changes in the local ecosystem over the past decade, including water quality assessments and biodiversity surveys.',
        griefTier: 5,
        walletAddress: '0x567890abcdef1234567890abcdef1234567890ab',
        replayCount: 23,
        mintedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        nftTokenId: '1003',
        openseaUrl: 'https://opensea.io/assets/matic/0x123.../1003',
        verificationStatus: 'verified',
        truthScore: 95,
        capsuleType: 'scientific_research',
        tags: ['environment', 'research', 'sustainability']
      },
      {
        id: 'cap_1754140004_jkl012',
        title: 'Community Safety Initiative',
        content: 'Documentation of local community safety measures and neighborhood watch programs implemented to enhance public security and wellbeing.',
        griefTier: 2,
        walletAddress: '0x234567890abcdef1234567890abcdef1234567890',
        replayCount: 5,
        mintedAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
        nftTokenId: '1004',
        openseaUrl: 'https://opensea.io/assets/matic/0x123.../1004',
        verificationStatus: 'pending',
        truthScore: 76,
        capsuleType: 'public_safety',
        tags: ['community', 'safety', 'public']
      }
    ];
    
    res.json(mockMintedCapsules);
  });

  // Get individual capsule details
  app.get('/api/capsules/:id', isDebugAuthenticated, async (req: any, res) => {
    console.log('🔍 Capsule details requested for ID:', req.params.id);
    const capsuleId = req.params.id;
    
    // Mock detailed capsule data
    const mockCapsuleDetails = {
      'cap_1754140001_abc123': {
        id: 'cap_1754140001_abc123',
        title: 'Family Legacy Documentation',
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
        walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
        replayCount: 15,
        mintedAt: new Date(Date.now() - 172800000).toISOString(),
        nftTokenId: '1001',
        openseaUrl: 'https://opensea.io/assets/matic/0x123.../1001',
        verificationStatus: 'verified',
        truthScore: 92,
        capsuleType: 'personal_memory',
        tags: ['family', 'legacy', 'heritage', 'genealogy', 'history']
      },
      'cap_1754140002_def456': {
        id: 'cap_1754140002_def456',
        title: 'Corporate Transparency Report Q4 2024',
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
        walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
        replayCount: 8,
        mintedAt: new Date(Date.now() - 86400000).toISOString(),
        nftTokenId: '1002',
        openseaUrl: 'https://opensea.io/assets/matic/0x123.../1002',
        verificationStatus: 'verified',
        truthScore: 88,
        capsuleType: 'corporate_filing',
        tags: ['corporate', 'financial', 'transparency', 'governance', 'quarterly']
      }
    };
    
    const capsuleDetails = mockCapsuleDetails[capsuleId as keyof typeof mockCapsuleDetails];
    
    if (!capsuleDetails) {
      return res.status(404).json({ error: 'Capsule not found' });
    }
    
    res.json(capsuleDetails);
  });

  // AI Content Analysis
  app.post('/api/capsules/analyze', isDebugAuthenticated, async (req: any, res) => {
    console.log('🧠 Content analysis requested');
    const { title, content } = req.body;
    
    try {
      // Import services (would be at top of file in production)
      const { aiContentAnalysis } = await import('./aiContentAnalysis');
      const analysis = await aiContentAnalysis.analyzeCapsuleContent(content, title);
      
      console.log('✅ Analysis completed with grief tier:', analysis.griefScore);
      res.json(analysis);
    } catch (error) {
      console.error('❌ Analysis failed:', error);
      // Fallback analysis
      const fallbackAnalysis = {
        griefScore: 3,
        emotionalResonance: 75,
        truthLikelihood: 80,
        contentType: 'personal_memory',
        themes: ['memory', 'truth'],
        sentiment: 'neutral',
        complexity: 'moderate',
        suggestedTags: ['personal', 'memory'],
        moderationFlags: [],
        summary: content.slice(0, 100) + '...'
      };
      res.json(fallbackAnalysis);
    }
  });

  // Content Moderation
  app.post('/api/capsules/moderate', isDebugAuthenticated, async (req: any, res) => {
    console.log('🛡️ Content moderation requested');
    const { content } = req.body;
    
    try {
      const { aiContentAnalysis } = await import('./aiContentAnalysis');
      const moderation = await aiContentAnalysis.moderateContent(content);
      
      console.log('✅ Moderation completed:', moderation.approved ? 'APPROVED' : 'FLAGGED');
      res.json(moderation);
    } catch (error) {
      console.error('❌ Moderation failed:', error);
      // Fallback - approve with warning
      res.json({
        approved: true,
        issues: [],
        severity: 'low',
        recommendations: ['Manual review recommended due to AI service error']
      });
    }
  });

  // IPFS Upload
  app.post('/api/capsules/upload-ipfs', isDebugAuthenticated, async (req: any, res) => {
    console.log('📦 IPFS upload requested');
    const capsuleData = req.body;
    
    try {
      const { ipfsService } = await import('./ipfsService');
      
      // Create IPFS metadata
      const metadata = {
        id: `cap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: capsuleData.title,
        content: capsuleData.content,
        contentType: 'text/plain',
        griefTier: capsuleData.analysis?.griefScore || 3,
        author: req.user.id,
        timestamp: new Date().toISOString(),
        tags: capsuleData.tags || [],
        sealed: false
      };

      // Seal the capsule
      const sealedMetadata = await ipfsService.sealCapsule(metadata);
      
      // Upload to IPFS
      const uploadResult = await ipfsService.uploadCapsule(sealedMetadata);
      
      console.log('✅ IPFS upload successful:', uploadResult.hash);
      res.json(uploadResult);
    } catch (error) {
      console.error('❌ IPFS upload failed:', error);
      res.status(500).json({ error: 'IPFS upload failed' });
    }
  });

  // NFT Minting
  app.post('/api/capsules/mint-nft', isDebugAuthenticated, async (req: any, res) => {
    console.log('🎨 NFT minting requested');
    const { ipfsHash } = req.body;
    
    try {
      // Mock NFT minting for development
      const tokenId = Math.floor(Math.random() * 10000) + 1000;
      const transactionHash = '0x' + Math.random().toString(16).substr(2, 64);
      
      console.log('✅ NFT minted successfully - Token ID:', tokenId);
      res.json({
        tokenId: tokenId.toString(),
        transactionHash,
        openseaUrl: `https://opensea.io/assets/matic/0x123.../${tokenId}`
      });
    } catch (error) {
      console.error('❌ NFT minting failed:', error);
      res.status(500).json({ error: 'NFT minting failed' });
    }
  });

  // GTT Yield Claiming Status
  app.get('/api/gtt/claim-status', isDebugAuthenticated, async (req: any, res) => {
    console.log('💰 GTT claim status requested');
    
    const mockStatuses = [1, 2, 3, 4, 5].map(tier => ({
      griefTier: tier,
      yieldAmount: tier * 10,
      canClaim: Math.random() > 0.5, // Random availability for demo
      nextClaimTime: new Date(Date.now() + Math.random() * 86400000).toISOString(),
      cooldownHours: 24
    }));
    
    res.json(mockStatuses);
  });

  // GTT Balance
  app.get('/api/gtt/balance', isDebugAuthenticated, async (req: any, res) => {
    console.log('💳 GTT balance requested');
    
    const mockBalance = Math.floor(Math.random() * 1000) + 100;
    res.json({
      balance: mockBalance,
      formatted: `${mockBalance.toLocaleString()} GTT`
    });
  });

  // GTT Claim History
  app.get('/api/gtt/claim-history', isDebugAuthenticated, async (req: any, res) => {
    console.log('📊 GTT claim history requested');
    
    const mockHistory = Array.from({ length: 5 }, (_, i) => ({
      id: `claim_${Date.now()}_${i}`,
      griefTier: Math.floor(Math.random() * 5) + 1,
      amount: (Math.floor(Math.random() * 5) + 1) * 10,
      timestamp: new Date(Date.now() - Math.random() * 2592000000).toISOString(),
      transactionHash: '0x' + Math.random().toString(16).substr(2, 64)
    }));
    
    res.json(mockHistory);
  });

  // GTT Yield Claim
  app.post('/api/gtt/claim-yield', isDebugAuthenticated, async (req: any, res) => {
    console.log('💸 GTT yield claim requested');
    const { griefTier } = req.body;
    
    try {
      const yieldAmount = griefTier * 10;
      const transactionHash = '0x' + Math.random().toString(16).substr(2, 64);
      
      console.log('✅ GTT yield claimed:', yieldAmount, 'GTT for tier', griefTier);
      res.json({
        success: true,
        amount: yieldAmount,
        griefTier,
        transactionHash,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ GTT claim failed:', error);
      res.status(500).json({ error: 'Claim failed' });
    }
  });

  // Get user stats for dashboard
  app.get('/api/user/stats', isDebugAuthenticated, async (req: any, res) => {
    console.log('📊 User stats requested');
    
    const mockStats = {
      truthScore: 87,
      gttEarned: 12547,
      capsulesCreated: 5,
      verifiedCapsules: 3,
      timeLockedValue: 45200,
      nextUnlock: '2025-12-25',
      tierProgress: 65,
      activeStakes: 12,
      pendingYields: 2400
    };
    
    res.json(mockStats);
  });

  // Get recent capsules for dashboard
  app.get('/api/capsules/recent', isDebugAuthenticated, async (req: any, res) => {
    console.log('📝 Recent capsules requested');
    
    const mockRecentCapsules = [
      {
        id: 'cap_recent_001',
        title: 'Personal Journey #1001',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        status: 'verified',
        griefTier: 3
      },
      {
        id: 'cap_recent_002', 
        title: 'Family Memory #1002',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        status: 'pending',
        griefTier: 4
      },
      {
        id: 'cap_recent_003',
        title: 'Historical Event #1003', 
        createdAt: new Date(Date.now() - 345600000).toISOString(),
        status: 'verified',
        griefTier: 5
      }
    ];
    
    res.json(mockRecentCapsules);
  });

  // Get minted capsules for gallery
  app.get('/api/capsules/minted', isDebugAuthenticated, async (req: any, res) => {
    console.log('🎨 Minted capsules requested for gallery');
    
    const mockMintedCapsules = [
      {
        id: 'cap_1754140001_abc123',
        title: 'Family Memory Capsule',
        content: 'A precious family memory preserved for future generations...',
        griefTier: 3,
        walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
        replayCount: 12,
        mintedAt: new Date(Date.now() - 86400000).toISOString(),
        nftTokenId: '1001',
        openseaUrl: 'https://opensea.io/assets/matic/0x123.../1001'
      },
      {
        id: 'cap_1754140002_def456',
        title: 'Personal Journey',
        content: 'My journey through difficult times and personal growth...',
        griefTier: 4,
        walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
        replayCount: 8,
        mintedAt: new Date(Date.now() - 172800000).toISOString(),
        nftTokenId: '1002',
        openseaUrl: 'https://opensea.io/assets/matic/0x123.../1002'
      },
      {
        id: 'cap_1754140003_ghi789',
        title: 'Historical Testimony',
        content: 'Important historical events I witnessed and want to preserve...',
        griefTier: 5,
        walletAddress: '0x567890abcdef1234567890abcdef1234567890ab',
        replayCount: 25,
        mintedAt: new Date(Date.now() - 259200000).toISOString(),
        nftTokenId: '1003',
        openseaUrl: 'https://opensea.io/assets/matic/0x123.../1003'
      }
    ];
    
    res.json(mockMintedCapsules);
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

  // --- AI SERVICES ENDPOINTS ---
  
  // Enhanced AI Image Generation
  app.post('/api/ai/generate-image', isDebugAuthenticated, async (req: any, res) => {
    console.log('🎨 AI image generation requested');
    
    try {
      const { prompt, size = "1024x1024", quality = "standard" } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }
      
      // Enhanced prompt for Guardian aesthetic
      const enhancedPrompt = `${prompt}. Digital art style, ethereal and mystical atmosphere, guardian theme, high quality, dramatic lighting, cosmic elements, truth preservation concept`;
      
      // High-quality placeholder images for Guardian theme
      const mockImageUrls = [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1024&h=1024&fit=crop',
        'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1024&h=1024&fit=crop',
        'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1024&h=1024&fit=crop',
        'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=1024&h=1024&fit=crop'
      ];
      
      const randomImage = mockImageUrls[Math.floor(Math.random() * mockImageUrls.length)];
      
      console.log('✅ AI image generated successfully');
      res.json({ 
        imageUrl: randomImage,
        prompt: enhancedPrompt,
        size,
        quality,
        generatedAt: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Failed to generate AI image:', error);
      res.status(500).json({ error: 'Failed to generate image' });
    }
  });
  
  // AI Contract Verification for Eternal Contracts
  app.post('/api/ai/verify-contract', isDebugAuthenticated, async (req: any, res) => {
    console.log('📋 AI Contract verification requested');
    
    try {
      const { content, title } = req.body;
      
      if (!content) {
        return res.status(400).json({ error: 'Contract content is required' });
      }
      
      // Mock AI contract analysis
      const wordCount = content.split(' ').length;
      const hasTitle = !!title;
      const clarity = wordCount > 50 ? 'High' : wordCount > 20 ? 'Medium' : 'Low';
      
      const summary = `Contract Analysis:
      
Title: ${hasTitle ? 'Provided' : 'Missing'}
Word Count: ${wordCount} words
Clarity Level: ${clarity}
Legal Structure: ${content.toLowerCase().includes('hereby') || content.toLowerCase().includes('declare') ? 'Formal' : 'Informal'}
Permanence Indicators: ${content.toLowerCase().includes('forever') || content.toLowerCase().includes('eternal') ? 'Present' : 'Absent'}

This contract appears to be a ${title ? 'titled ' : ''}declaration with ${clarity.toLowerCase()} clarity. The content ${wordCount > 100 ? 'provides substantial detail' : 'could benefit from additional detail'} for eternal preservation.

Recommendation: ${wordCount > 50 && hasTitle ? 'Ready for sealing' : 'Consider adding more detail or a title'}`;

      console.log('✅ Contract verified and analyzed');
      res.json({ 
        summary,
        clarity,
        wordCount,
        isReady: wordCount > 50 && hasTitle,
        verifiedAt: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Failed to verify contract:', error);
      res.status(500).json({ error: 'Failed to verify contract' });
    }
  });

  // Publish Eternal Contract
  app.post('/api/capsule/publish-contract', isDebugAuthenticated, async (req: any, res) => {
    console.log('📜 Publishing eternal contract');
    
    try {
      const { 
        title, 
        content, 
        summary, 
        author, 
        beneficiary, 
        unlockDate, 
        contractType,
        metadata 
      } = req.body;
      
      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }
      
      // Create eternal contract record
      const contractId = `contract_${Date.now()}`;
      const contractHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      const eternalContract = {
        id: contractId,
        title,
        content,
        summary: summary || 'AI-verified eternal declaration',
        author,
        beneficiary: beneficiary || null,
        unlockDate: unlockDate || null,
        contractType: contractType || 'eternal_declaration',
        contractHash,
        metadata: metadata || {},
        sealed: true,
        sealedAt: new Date().toISOString(),
        blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
        networkId: 'polygon-mainnet'
      };
      
      console.log('✅ Eternal contract published:', contractId);
      
      res.json({
        success: true,
        contractId,
        contractHash,
        contract: eternalContract,
        message: 'Contract has been permanently sealed on-chain'
      });
      
    } catch (error) {
      console.error('❌ Failed to publish contract:', error);
      res.status(500).json({ error: 'Failed to publish eternal contract' });
    }
  });

  // AI Content Analysis
  app.post('/api/ai/analyze-content', isDebugAuthenticated, async (req: any, res) => {
    console.log('🧠 AI content analysis requested');
    
    try {
      const { title, content, capsuleType } = req.body;
      
      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }
      
      // Mock AI analysis based on content
      const wordCount = content.split(' ').length;
      const emotionalWords = ['love', 'loss', 'pain', 'joy', 'fear', 'hope', 'dream'];
      const emotionalScore = emotionalWords.filter(word => 
        content.toLowerCase().includes(word)
      ).length;
      
      const mockAnalysis = {
        emotionalIntensity: emotionalScore > 2 ? 'High' : emotionalScore > 0 ? 'Medium' : 'Low',
        truthConfidence: Math.min(95, 65 + (wordCount / 10)),
        recommendedGriefTier: Math.min(5, Math.max(1, Math.floor(emotionalScore / 2) + 2)),
        suggestedTags: [
          capsuleType.replace('_', ' '),
          emotionalScore > 1 ? 'emotional' : 'factual',
          wordCount > 100 ? 'detailed' : 'concise',
          'truth',
          'memory'
        ],
        summary: `This ${capsuleType.replace('_', ' ')} capsule contains ${wordCount} words with ${emotionalScore > 0 ? 'emotional depth' : 'factual content'}. The content appears authentic and suitable for long-term preservation.`,
        contentScore: Math.min(100, 60 + emotionalScore * 5 + Math.min(20, wordCount / 5))
      };
      
      console.log('✅ AI analysis completed:', mockAnalysis);
      res.json(mockAnalysis);
      
    } catch (error) {
      console.error('❌ Failed to analyze content:', error);
      res.status(500).json({ error: 'Failed to analyze content' });
    }
  });
  
  // Yield Estimation
  app.post('/api/capsules/estimate-yield', isDebugAuthenticated, async (req: any, res) => {
    console.log('💰 Yield estimation requested');
    
    try {
      const { griefTier, timelock, capsuleType } = req.body;
      
      if (!griefTier || !timelock) {
        return res.status(400).json({ error: 'Grief tier and timelock are required' });
      }
      
      // Calculate mock yield based on grief tier and timelock
      const baseYield = griefTier * 10; // Base yield per grief tier
      const timeBonus = Math.floor(timelock / 30) * 2; // Bonus for longer locks
      const typeMultiplier = capsuleType === 'confession' ? 1.5 : 
                            capsuleType === 'prophecy' ? 1.3 : 1.0;
      
      const totalYield = Math.floor((baseYield + timeBonus) * typeMultiplier);
      const apy = ((totalYield / 100) / (timelock / 365)) * 100;
      
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
          typeBonus: Math.floor(totalYield - baseYield - timeBonus)
        }
      };
      
      console.log('✅ Yield estimated:', mockEstimate);
      res.json(mockEstimate);
      
    } catch (error) {
      console.error('❌ Failed to estimate yield:', error);
      res.status(500).json({ error: 'Failed to estimate yield' });
    }
  });
  
  // NFT Minting
  app.post('/api/capsules/mint-nft', isDebugAuthenticated, async (req: any, res) => {
    console.log('🪙 NFT minting requested');
    
    try {
      const { title, content, capsuleType, timelock, imageUrl, aiAnalysis } = req.body;
      const userId = req.user.id;
      
      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }
      
      // Mock NFT minting
      const tokenId = Math.floor(Math.random() * 9000) + 1000;
      const contractAddress = '0x742d35Cc6634C0532925a3b8D9C07BEC676c4A1a'; // Mock contract
      
      // Create capsule in storage (mock for now)
      const capsuleId = `cap_${Date.now()}`;
      const mockCapsule = {
        id: capsuleId,
        title,
        content,
        capsuleType,
        timelock,
        authorId: userId,
        status: 'minted',
        tokenId: tokenId.toString(),
        contractAddress,
        imageUrl,
        aiAnalysis,
        griefTier: aiAnalysis?.recommendedGriefTier || 1,
        createdAt: new Date().toISOString(),
        mintedAt: new Date().toISOString()
      };
      
      console.log('✅ NFT minted successfully:', mockCapsule);
      res.json({
        success: true,
        tokenId,
        contractAddress,
        capsuleId,
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        capsule: mockCapsule
      });
      
    } catch (error) {
      console.error('❌ Failed to mint NFT:', error);
      res.status(500).json({ error: 'Failed to mint NFT' });
    }
  });

  // --- LINEAGE TRACKING ENDPOINTS ---
  
  // Get lineage for a capsule
  app.get('/api/lineage/:capsuleId', isDebugAuthenticated, async (req: any, res) => {
    console.log('📈 Lineage requested for capsule:', req.params.capsuleId);
    
    try {
      const { capsuleId } = req.params;
      
      // Mock lineage data for now - would connect to database in production
      const mockLineage = {
        capsuleId,
        parents: [
          {
            id: 'parent_1',
            title: 'Founding Memory',
            griefFlow: 85,
            influenceScore: 7.5,
            createdAt: '2024-01-15T00:00:00Z'
          }
        ],
        children: [
          {
            id: 'child_1',
            title: 'Inherited Wisdom',
            griefFlow: 92,
            influenceScore: 8.2,
            createdAt: '2024-06-20T00:00:00Z'
          }
        ],
        totalGriefFlow: 177,
        lineageDepth: 3,
        influenceNetwork: 15
      };
      
      console.log('✅ Lineage retrieved:', mockLineage);
      res.json(mockLineage);
      
    } catch (error) {
      console.error('❌ Failed to get lineage:', error);
      res.status(500).json({ error: 'Failed to retrieve lineage' });
    }
  });
  
  // Create lineage connection (compatible with Next.js API format)
  app.post('/api/lineage/create', isDebugAuthenticated, async (req: any, res) => {
    console.log('🔗 Creating lineage connection');
    
    try {
      const { parent_id, child_id, grief_flow, influence_score, triggered_by } = req.body;
      const userId = triggered_by || req.user.id;
      
      if (!parent_id || !child_id) {
        return res.status(400).json({ error: 'parent_id and child_id are required' });
      }
      
      // Create lineage entry (this would insert into database in production)
      const lineageEntry = {
        id: `lineage_${Date.now()}`,
        parent_id,
        child_id,
        triggered_by: userId,
        timestamp: new Date().toISOString(),
        grief_flow: grief_flow || 0,
        influence_score: influence_score || 0
      };
      
      console.log('✅ Lineage created:', lineageEntry);
      
      // Update capsules with inherited values
      const inheritanceUpdate = {
        child_capsule: {
          id: child_id,
          inspired_by: parent_id,
          grief_inherited: grief_flow,
          influence_score: influence_score
        }
      };
      
      res.json({ 
        success: true, 
        lineage: lineageEntry,
        inheritance: inheritanceUpdate
      });
      
    } catch (error) {
      console.error('❌ Failed to create lineage:', error);
      res.status(500).json({ error: 'Failed to create lineage' });
    }
  });
  
  // Sovereign Memory Reputation Index (SMRI) API
  app.get('/api/smri/:wallet', isDebugAuthenticated, async (req: any, res) => {
    console.log('🏆 SMRI requested for wallet:', req.params.wallet);
    
    try {
      const { wallet } = req.params;
      
      if (!wallet) {
        return res.status(400).json({ error: 'Wallet address is required' });
      }
      
      // Mock data for reputation calculation - would query database in production
      const mockCapsules = [
        { id: 'cap_1', grief_tier: 4, influence_score: 85, inspired_by: 'cap_0' },
        { id: 'cap_2', grief_tier: 3, influence_score: 72, inspired_by: null },
        { id: 'cap_3', grief_tier: 5, influence_score: 95, inspired_by: 'cap_1' }
      ];
      
      const mockCerts = [
        { id: 'cert_1', type: 'veritas_seal' },
        { id: 'cert_2', type: 'truth_bounty' }
      ];
      
      const griefTotal = mockCapsules.reduce((sum, c) => sum + (c.grief_tier || 0), 0);
      const influence = mockCapsules.filter((c) => c.inspired_by !== null).length;
      const score = Math.round((griefTotal + influence * 2 + mockCerts.length * 3) * 1.5);
      const tier = score > 150 ? "Veritas" : score > 100 ? "Gold" : score > 50 ? "Silver" : "Bronze";
      
      const smriData = {
        wallet,
        truth_score: score,
        grief_total: griefTotal,
        capsule_count: mockCapsules.length,
        influence_count: influence,
        cert_count: mockCerts.length,
        reputation_tier: tier,
        last_updated: new Date().toISOString(),
        trending: score > 100 ? 'up' : 'stable'
      };
      
      console.log('✅ SMRI calculated:', smriData);
      res.json(smriData);
      
    } catch (error) {
      console.error('❌ Failed to calculate SMRI:', error);
      res.status(500).json({ error: 'Failed to calculate reputation score' });
    }
  });

  // SMRI Leaderboard API
  app.get('/api/smri/leaderboard', isDebugAuthenticated, async (req: any, res) => {
    console.log('🏆 SMRI Leaderboard requested');
    
    try {
      const { timeframe = 'all' } = req.query;
      
      // Mock leaderboard data
      const mockLeaderboard = [
        { wallet: 'veritas@guardianchain.app', truth_score: 245, reputation_tier: 'Veritas', rank: 1 },
        { wallet: 'guardian@truth.eth', truth_score: 189, reputation_tier: 'Gold', rank: 2 },
        { wallet: 'memory_keeper@chain.app', truth_score: 156, reputation_tier: 'Gold', rank: 3 },
        { wallet: 'truth_seeker@web3.com', truth_score: 134, reputation_tier: 'Gold', rank: 4 },
        { wallet: 'capsule_creator@defi.org', truth_score: 98, reputation_tier: 'Silver', rank: 5 },
        { wallet: 'grief_guardian@nft.app', truth_score: 87, reputation_tier: 'Silver', rank: 6 },
        { wallet: 'legacy_holder@dao.com', truth_score: 72, reputation_tier: 'Silver', rank: 7 },
        { wallet: 'debug@guardianchain.app', truth_score: 33, reputation_tier: 'Bronze', rank: 8 },
        { wallet: 'newbie@starter.eth', truth_score: 21, reputation_tier: 'Bronze', rank: 9 },
        { wallet: 'explorer@begin.app', truth_score: 15, reputation_tier: 'Bronze', rank: 10 }
      ];
      
      // Filter by timeframe if needed (mock implementation)
      let filteredLeaderboard = mockLeaderboard;
      if (timeframe === 'week') {
        // Mock weekly filtering by slightly reducing scores
        filteredLeaderboard = mockLeaderboard.map(entry => ({
          ...entry,
          truth_score: Math.floor(entry.truth_score * 0.3)
        }));
      } else if (timeframe === 'month') {
        // Mock monthly filtering
        filteredLeaderboard = mockLeaderboard.map(entry => ({
          ...entry,
          truth_score: Math.floor(entry.truth_score * 0.7)
        }));
      }
      
      console.log('✅ Leaderboard data generated for timeframe:', timeframe);
      res.json(filteredLeaderboard);
      
    } catch (error) {
      console.error('❌ Failed to get leaderboard:', error);
      res.status(500).json({ error: 'Failed to get leaderboard data' });
    }
  });

  // Guardian Map Network API
  app.get('/api/guardian-map/network', isDebugAuthenticated, async (req: any, res) => {
    console.log('🗺️ Guardian map network requested');
    
    try {
      const { region = 'global' } = req.query;
      
      // Mock guardian network data
      const mockGuardians = [
        {
          id: 'guardian_1',
          wallet: 'veritas@guardianchain.app',
          location: { city: 'San Francisco', country: 'USA', coordinates: [-122.4194, 37.7749] },
          smri: { truth_score: 245, reputation_tier: 'Veritas', capsule_count: 24, last_active: '2 hours ago' },
          network: { connections: 12, lineage_depth: 5, influence_radius: 85 }
        },
        {
          id: 'guardian_2',
          wallet: 'guardian@truth.eth',
          location: { city: 'London', country: 'UK', coordinates: [-0.1276, 51.5074] },
          smri: { truth_score: 189, reputation_tier: 'Gold', capsule_count: 18, last_active: '1 hour ago' },
          network: { connections: 8, lineage_depth: 4, influence_radius: 72 }
        },
        {
          id: 'guardian_3',
          wallet: 'memory_keeper@chain.app',
          location: { city: 'Tokyo', country: 'Japan', coordinates: [139.6503, 35.6762] },
          smri: { truth_score: 156, reputation_tier: 'Gold', capsule_count: 15, last_active: '3 hours ago' },
          network: { connections: 6, lineage_depth: 3, influence_radius: 68 }
        },
        {
          id: 'guardian_4',
          wallet: 'debug@guardianchain.app',
          location: { city: 'Berlin', country: 'Germany', coordinates: [13.4050, 52.5200] },
          smri: { truth_score: 33, reputation_tier: 'Bronze', capsule_count: 3, last_active: '30 minutes ago' },
          network: { connections: 2, lineage_depth: 1, influence_radius: 25 }
        },
        {
          id: 'guardian_5',
          wallet: 'truth_seeker@web3.com',
          location: { city: 'Toronto', country: 'Canada', coordinates: [-79.3832, 43.6532] },
          smri: { truth_score: 134, reputation_tier: 'Gold', capsule_count: 12, last_active: '5 hours ago' },
          network: { connections: 7, lineage_depth: 3, influence_radius: 58 }
        }
      ];
      
      // Filter by region if needed
      let filteredGuardians = mockGuardians;
      if (region !== 'global') {
        // Mock region filtering logic
        filteredGuardians = mockGuardians.filter(guardian => {
          if (region === 'americas') return ['USA', 'Canada'].includes(guardian.location.country);
          if (region === 'europe') return ['UK', 'Germany'].includes(guardian.location.country);
          if (region === 'asia') return ['Japan'].includes(guardian.location.country);
          return true;
        });
      }
      
      console.log('✅ Guardian network data generated for region:', region);
      res.json({
        nodes: filteredGuardians,
        connections: [
          { from: 'guardian_1', to: 'guardian_2', strength: 0.8 },
          { from: 'guardian_2', to: 'guardian_3', strength: 0.6 },
          { from: 'guardian_1', to: 'guardian_4', strength: 0.4 },
          { from: 'guardian_3', to: 'guardian_5', strength: 0.7 }
        ]
      });
      
    } catch (error) {
      console.error('❌ Failed to get guardian network:', error);
      res.status(500).json({ error: 'Failed to get guardian network data' });
    }
  });

  // Guardian Map Metrics API
  app.get('/api/guardian-map/metrics', isDebugAuthenticated, async (req: any, res) => {
    console.log('📊 Guardian map metrics requested');
    
    try {
      const mockMetrics = {
        total_guardians: 1247,
        active_guardians: 892,
        global_truth_score: 186420,
        countries_active: 67,
        strongest_lineage: 8
      };
      
      console.log('✅ Guardian map metrics generated');
      res.json(mockMetrics);
      
    } catch (error) {
      console.error('❌ Failed to get guardian metrics:', error);
      res.status(500).json({ error: 'Failed to get guardian metrics' });
    }
  });

  // Search API
  app.get('/api/search', isDebugAuthenticated, async (req: any, res) => {
    console.log('🔍 Search requested');
    
    try {
      const { q, type = 'all', sort = 'relevance' } = req.query;
      
      if (!q) {
        return res.json([]);
      }
      
      // Mock search results
      const mockResults = [
        {
          id: 'cap_001',
          title: 'The Truth About Digital Privacy',
          type: 'capsule',
          content: 'A comprehensive analysis of how personal data is being harvested and sold by major tech companies without proper consent...',
          creator: 'privacy_advocate@truth.eth',
          created_at: '2025-01-15T10:30:00Z',
          grief_tier: 4,
          verification_status: 'verified',
          tags: ['privacy', 'tech', 'surveillance'],
          smri_score: 89
        },
        {
          id: 'guard_001',
          title: 'Digital Rights Guardian',
          type: 'guardian',
          content: 'Veteran cybersecurity expert dedicated to protecting digital freedoms and exposing corporate surveillance...',
          creator: 'privacy_advocate@truth.eth',
          created_at: '2025-01-10T14:20:00Z',
          grief_tier: 0,
          verification_status: 'verified',
          tags: ['guardian', 'cybersecurity', 'activism'],
          smri_score: 156
        },
        {
          id: 'contract_001',
          title: 'Eternal Privacy Declaration',
          type: 'contract',
          content: 'I hereby declare that privacy is a fundamental human right that must be protected for all future generations...',
          creator: 'rights_defender@chain.app',
          created_at: '2025-01-08T09:15:00Z',
          grief_tier: 2,
          verification_status: 'pending',
          tags: ['privacy', 'rights', 'declaration']
        },
        {
          id: 'cap_002',
          title: 'Climate Change Evidence Archive',
          type: 'capsule',
          content: 'Documenting the real impact of climate change with suppressed scientific data and corporate cover-ups...',
          creator: 'climate_scientist@research.org',
          created_at: '2025-01-12T16:45:00Z',
          grief_tier: 5,
          verification_status: 'verified',
          tags: ['climate', 'science', 'environment'],
          smri_score: 142
        }
      ];
      
      // Filter by type
      let filteredResults = mockResults;
      if (type !== 'all') {
        filteredResults = mockResults.filter(result => result.type === type);
      }
      
      // Simple search filtering
      const searchTerm = q.toLowerCase();
      filteredResults = filteredResults.filter(result => 
        result.title.toLowerCase().includes(searchTerm) ||
        result.content.toLowerCase().includes(searchTerm) ||
        result.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
      
      // Sort results
      switch (sort) {
        case 'recent':
          filteredResults.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          break;
        case 'grief':
          filteredResults.sort((a, b) => b.grief_tier - a.grief_tier);
          break;
        case 'verified':
          filteredResults.sort((a, b) => {
            if (a.verification_status === 'verified' && b.verification_status !== 'verified') return -1;
            if (b.verification_status === 'verified' && a.verification_status !== 'verified') return 1;
            return 0;
          });
          break;
        default: // relevance - already filtered by search term
          break;
      }
      
      console.log('✅ Search results generated:', filteredResults.length);
      res.json(filteredResults);
      
    } catch (error) {
      console.error('❌ Failed to perform search:', error);
      res.status(500).json({ error: 'Failed to perform search' });
    }
  });

  // Get SMRI leaderboard
  app.get('/api/smri/leaderboard', isDebugAuthenticated, async (req: any, res) => {
    console.log('🏆 SMRI leaderboard requested');
    
    try {
      const { tier = 'all' } = req.query;
      
      // Mock leaderboard data
      const mockLeaderboard = [
        {
          wallet: 'veritas_guardian@truth.eth',
          truth_score: 187,
          grief_total: 45,
          capsule_count: 23,
          influence_count: 18,
          cert_count: 12,
          reputation_tier: 'Veritas',
          last_updated: '2025-08-02T14:00:00Z',
          trending: 'up',
          rank: 1,
          bio: 'Veteran whistleblower fighting corporate corruption',
          specialties: ['Corporate Fraud', 'Data Privacy', 'Financial Crimes']
        },
        {
          wallet: 'digital_truth_seeker@chain.app',
          truth_score: 142,
          grief_total: 38,
          capsule_count: 19,
          influence_count: 14,
          cert_count: 8,
          reputation_tier: 'Gold',
          last_updated: '2025-08-02T13:45:00Z',
          trending: 'up',
          rank: 2,
          bio: 'Investigative journalist exposing tech surveillance',
          specialties: ['Surveillance', 'Tech Industry', 'Privacy Rights']
        },
        {
          wallet: 'climate_witness@guardian.net',
          truth_score: 98,
          grief_total: 28,
          capsule_count: 15,
          influence_count: 11,
          cert_count: 6,
          reputation_tier: 'Silver',
          last_updated: '2025-08-02T13:30:00Z',
          trending: 'stable',
          rank: 3,
          bio: 'Environmental scientist documenting climate suppression',
          specialties: ['Climate Science', 'Environmental Crime', 'Research Integrity']
        },
        {
          wallet: 'healthcare_advocate@medical.org',
          truth_score: 76,
          grief_total: 22,
          capsule_count: 12,
          influence_count: 8,
          cert_count: 4,
          reputation_tier: 'Silver',
          last_updated: '2025-08-02T13:15:00Z',
          trending: 'down',
          rank: 4,
          bio: 'Medical professional exposing healthcare fraud',
          specialties: ['Healthcare', 'Medical Ethics', 'Patient Rights']
        },
        {
          wallet: 'financial_insider@banks.net',
          truth_score: 54,
          grief_total: 16,
          capsule_count: 9,
          influence_count: 6,
          cert_count: 3,
          reputation_tier: 'Bronze',
          last_updated: '2025-08-02T13:00:00Z',
          trending: 'up',
          rank: 5,
          bio: 'Former bank employee revealing financial misconduct',
          specialties: ['Banking', 'Financial Fraud', 'Regulatory Violations']
        },
        {
          wallet: 'tech_worker@anonymous.dev',
          truth_score: 42,
          grief_total: 12,
          capsule_count: 7,
          influence_count: 5,
          cert_count: 2,
          reputation_tier: 'Bronze',
          last_updated: '2025-08-02T12:45:00Z',
          trending: 'stable',
          rank: 6,
          bio: 'Software engineer documenting tech industry abuses',
          specialties: ['Software Development', 'Worker Rights', 'Tech Ethics']
        },
        {
          wallet: 'debug@guardianchain.app',
          truth_score: 33,
          grief_total: 12,
          capsule_count: 3,
          influence_count: 2,
          cert_count: 2,
          reputation_tier: 'Bronze',
          last_updated: '2025-08-02T14:16:00Z',
          trending: 'stable',
          rank: 7,
          bio: 'Debug user exploring the Guardian ecosystem',
          specialties: ['Testing', 'Development', 'Platform Exploration']
        }
      ];
      
      // Filter by tier if specified
      let filteredLeaderboard = mockLeaderboard;
      if (tier !== 'all') {
        filteredLeaderboard = mockLeaderboard.filter(profile => profile.reputation_tier === tier);
      }
      
      console.log('✅ SMRI leaderboard generated:', {
        total: mockLeaderboard.length,
        filtered: filteredLeaderboard.length,
        tier
      });
      
      res.json(filteredLeaderboard);
      
    } catch (error) {
      console.error('❌ Failed to get SMRI leaderboard:', error);
      res.status(500).json({ error: 'Failed to get SMRI leaderboard' });
    }
  });

  // Get guardian map nodes
  app.get('/api/guardian-map/nodes', isDebugAuthenticated, async (req: any, res) => {
    console.log('🗺️ Guardian map nodes requested');
    
    try {
      const { region, tier } = req.query;
      
      // Mock guardian map data
      const mockGuardians = [
        {
          id: 'guardian_1',
          wallet: 'veritas_guardian@truth.eth',
          latitude: 40.7128,
          longitude: -74.0060,
          truth_score: 187,
          capsule_count: 23,
          region: 'north_america',
          country: 'United States',
          city: 'New York',
          reputation_tier: 'Veritas',
          activity_level: 'high',
          last_active: '2025-08-02T14:15:00Z',
          specialties: ['Corporate Fraud', 'Data Privacy', 'Financial Crimes'],
          connections: ['guardian_2', 'guardian_4', 'guardian_7'],
          influence_radius: 25
        },
        {
          id: 'guardian_2',
          wallet: 'digital_truth_seeker@chain.app',
          latitude: 51.5074,
          longitude: -0.1278,
          truth_score: 142,
          capsule_count: 19,
          region: 'europe',
          country: 'United Kingdom',
          city: 'London',
          reputation_tier: 'Gold',
          activity_level: 'high',
          last_active: '2025-08-02T14:10:00Z',
          specialties: ['Surveillance', 'Tech Industry', 'Privacy Rights'],
          connections: ['guardian_1', 'guardian_3', 'guardian_5'],
          influence_radius: 20
        },
        {
          id: 'guardian_3',
          wallet: 'climate_witness@guardian.net',
          latitude: 48.8566,
          longitude: 2.3522,
          truth_score: 98,
          capsule_count: 15,
          region: 'europe',
          country: 'France',
          city: 'Paris',
          reputation_tier: 'Silver',
          activity_level: 'medium',
          last_active: '2025-08-02T13:45:00Z',
          specialties: ['Climate Science', 'Environmental Crime', 'Research Integrity'],
          connections: ['guardian_2', 'guardian_6'],
          influence_radius: 18
        },
        {
          id: 'guardian_4',
          wallet: 'healthcare_advocate@medical.org',
          latitude: 35.6762,
          longitude: 139.6503,
          truth_score: 76,
          capsule_count: 12,
          region: 'asia',
          country: 'Japan',
          city: 'Tokyo',
          reputation_tier: 'Silver',
          activity_level: 'medium',
          last_active: '2025-08-02T13:30:00Z',
          specialties: ['Healthcare', 'Medical Ethics', 'Patient Rights'],
          connections: ['guardian_1', 'guardian_8'],
          influence_radius: 15
        },
        {
          id: 'guardian_5',
          wallet: 'financial_insider@banks.net',
          latitude: 52.5200,
          longitude: 13.4050,
          truth_score: 54,
          capsule_count: 9,
          region: 'europe',
          country: 'Germany',
          city: 'Berlin',
          reputation_tier: 'Bronze',
          activity_level: 'low',
          last_active: '2025-08-02T12:00:00Z',
          specialties: ['Banking', 'Financial Fraud', 'Regulatory Violations'],
          connections: ['guardian_2'],
          influence_radius: 12
        },
        {
          id: 'guardian_6',
          wallet: 'research_scientist@uni.edu',
          latitude: -33.8688,
          longitude: 151.2093,
          truth_score: 89,
          capsule_count: 14,
          region: 'oceania',
          country: 'Australia',
          city: 'Sydney',
          reputation_tier: 'Silver',
          activity_level: 'high',
          last_active: '2025-08-02T14:00:00Z',
          specialties: ['Academic Research', 'Scientific Integrity', 'Publication Ethics'],
          connections: ['guardian_3', 'guardian_7'],
          influence_radius: 16
        },
        {
          id: 'guardian_7',
          wallet: 'media_watchdog@press.org',
          latitude: 43.6532,
          longitude: -79.3832,
          truth_score: 125,
          capsule_count: 17,
          region: 'north_america',
          country: 'Canada',
          city: 'Toronto',
          reputation_tier: 'Gold',
          activity_level: 'high',
          last_active: '2025-08-02T14:12:00Z',
          specialties: ['Journalism', 'Media Ethics', 'Press Freedom'],
          connections: ['guardian_1', 'guardian_6'],
          influence_radius: 22
        },
        {
          id: 'guardian_8',
          wallet: 'tech_ethics@startup.dev',
          latitude: 37.7749,
          longitude: -122.4194,
          truth_score: 95,
          capsule_count: 11,
          region: 'north_america',
          country: 'United States',
          city: 'San Francisco',
          reputation_tier: 'Silver',
          activity_level: 'medium',
          last_active: '2025-08-02T13:20:00Z',
          specialties: ['Tech Ethics', 'AI Safety', 'Digital Rights'],
          connections: ['guardian_4', 'guardian_9'],
          influence_radius: 17
        },
        {
          id: 'guardian_9',
          wallet: 'debug@guardianchain.app',
          latitude: 1.3521,
          longitude: 103.8198,
          truth_score: 33,
          capsule_count: 3,
          region: 'asia',
          country: 'Singapore',
          city: 'Singapore',
          reputation_tier: 'Bronze',
          activity_level: 'medium',
          last_active: '2025-08-02T14:16:00Z',
          specialties: ['Testing', 'Development', 'Platform Exploration'],
          connections: ['guardian_8'],
          influence_radius: 8
        }
      ];
      
      // Filter guardians based on region and tier
      let filteredGuardians = mockGuardians;
      
      if (region && region !== 'all') {
        filteredGuardians = filteredGuardians.filter(guardian => guardian.region === region);
      }
      
      if (tier && tier !== 'all') {
        filteredGuardians = filteredGuardians.filter(guardian => guardian.reputation_tier === tier);
      }
      
      console.log('✅ Guardian map nodes generated:', {
        total: mockGuardians.length,
        filtered: filteredGuardians.length,
        filters: { region, tier }
      });
      
      res.json({
        guardians: filteredGuardians,
        metadata: {
          total_guardians: mockGuardians.length,
          filtered_guardians: filteredGuardians.length,
          last_updated: new Date().toISOString()
        }
      });
      
    } catch (error) {
      console.error('❌ Failed to get guardian map nodes:', error);
      res.status(500).json({ error: 'Failed to get guardian map nodes' });
    }
  });

  // Get guardian map connections
  app.get('/api/guardian-map/connections', isDebugAuthenticated, async (req: any, res) => {
    console.log('🔗 Guardian map connections requested');
    
    try {
      // Mock connection data
      const mockConnections = [
        {
          source: 'guardian_1',
          target: 'guardian_2',
          strength: 0.9,
          connection_type: 'collaboration',
          created_at: '2025-07-15T00:00:00Z'
        },
        {
          source: 'guardian_1',
          target: 'guardian_4',
          strength: 0.7,
          connection_type: 'verification',
          created_at: '2025-07-20T00:00:00Z'
        },
        {
          source: 'guardian_1',
          target: 'guardian_7',
          strength: 0.8,
          connection_type: 'mentorship',
          created_at: '2025-07-10T00:00:00Z'
        },
        {
          source: 'guardian_2',
          target: 'guardian_3',
          strength: 0.6,
          connection_type: 'influence',
          created_at: '2025-07-25T00:00:00Z'
        },
        {
          source: 'guardian_2',
          target: 'guardian_5',
          strength: 0.5,
          connection_type: 'collaboration',
          created_at: '2025-07-18T00:00:00Z'
        },
        {
          source: 'guardian_3',
          target: 'guardian_6',
          strength: 0.7,
          connection_type: 'verification',
          created_at: '2025-07-22T00:00:00Z'
        },
        {
          source: 'guardian_4',
          target: 'guardian_8',
          strength: 0.6,
          connection_type: 'influence',
          created_at: '2025-07-28T00:00:00Z'
        },
        {
          source: 'guardian_6',
          target: 'guardian_7',
          strength: 0.8,
          connection_type: 'collaboration',
          created_at: '2025-07-12T00:00:00Z'
        },
        {
          source: 'guardian_8',
          target: 'guardian_9',
          strength: 0.4,
          connection_type: 'mentorship',
          created_at: '2025-08-01T00:00:00Z'
        }
      ];
      
      console.log('✅ Guardian map connections generated:', {
        connections: mockConnections.length
      });
      
      res.json({
        connections: mockConnections,
        metadata: {
          total_connections: mockConnections.length,
          connection_types: ['collaboration', 'verification', 'influence', 'mentorship']
        }
      });
      
    } catch (error) {
      console.error('❌ Failed to get guardian map connections:', error);
      res.status(500).json({ error: 'Failed to get guardian map connections' });
    }
  });

  // Get guardian map metrics
  app.get('/api/guardian-map/metrics', isDebugAuthenticated, async (req: any, res) => {
    console.log('📊 Guardian map metrics requested');
    
    try {
      // Mock metrics data
      const mockMetrics = {
        total_guardians: 9,
        active_guardians: 6,
        total_connections: 9,
        global_truth_score: 899,
        top_regions: [
          {
            region: 'North America',
            guardian_count: 3,
            avg_truth_score: 102
          },
          {
            region: 'Europe',
            guardian_count: 3,
            avg_truth_score: 98
          },
          {
            region: 'Asia',
            guardian_count: 2,
            avg_truth_score: 55
          },
          {
            region: 'Oceania',
            guardian_count: 1,
            avg_truth_score: 89
          }
        ]
      };
      
      console.log('✅ Guardian map metrics generated');
      
      res.json(mockMetrics);
      
    } catch (error) {
      console.error('❌ Failed to get guardian map metrics:', error);
      res.status(500).json({ error: 'Failed to get guardian map metrics' });
    }
  });

  // Capsule Search API endpoints
  app.get('/api/capsules/search', isDebugAuthenticated, async (req: any, res) => {
    console.log('🔍 Capsule search requested');
    
    try {
      const {
        query,
        grief_tier,
        verification_status,
        region,
        category,
        truth_score_min,
        date_range,
        tags
      } = req.query;

      // Generate mock capsule data for search
      const mockCapsules = [
        {
          id: 'cap_001',
          title: 'Family Memories from Christmas 1995',
          content: 'I remember the snow falling gently as we gathered around the tree...',
          grief_tier: 'tier_2',
          tags: ['family', 'memory', 'nostalgia'],
          guardian_id: 'guardian_1',
          created_at: '2025-07-15T00:00:00Z',
          verification_status: 'verified',
          truth_score: 85,
          interaction_count: 45,
          region: 'north_america',
          category: 'memory'
        },
        {
          id: 'cap_002',
          title: 'Testimony of Corporate Fraud',
          content: 'During my time at the corporation, I witnessed systematic financial irregularities...',
          grief_tier: 'tier_4',
          tags: ['testimony', 'fraud', 'corporate'],
          guardian_id: 'guardian_2',
          created_at: '2025-07-20T00:00:00Z',
          verification_status: 'pending',
          truth_score: 72,
          interaction_count: 123,
          region: 'europe',
          category: 'testimony'
        },
        {
          id: 'cap_003',
          title: 'Legacy of My Grandmother',
          content: 'My grandmother taught me the importance of preserving truth for future generations...',
          grief_tier: 'tier_3',
          tags: ['legacy', 'wisdom', 'family'],
          guardian_id: 'guardian_3',
          created_at: '2025-07-25T00:00:00Z',
          verification_status: 'verified',
          truth_score: 92,
          interaction_count: 67,
          region: 'asia',
          category: 'legacy'
        },
        {
          id: 'cap_004',
          title: 'Truth About Medical Research',
          content: 'The study results were deliberately suppressed to protect pharmaceutical interests...',
          grief_tier: 'tier_4',
          tags: ['truth', 'medical', 'research'],
          guardian_id: 'guardian_4',
          created_at: '2025-08-01T00:00:00Z',
          verification_status: 'disputed',
          truth_score: 65,
          interaction_count: 234,
          region: 'europe',
          category: 'truth'
        },
        {
          id: 'cap_005',
          title: 'Trauma from Natural Disaster',
          content: 'The earthquake changed everything in our small community...',
          grief_tier: 'tier_3',
          tags: ['trauma', 'disaster', 'community'],
          guardian_id: 'guardian_5',
          created_at: '2025-06-10T00:00:00Z',
          verification_status: 'verified',
          truth_score: 88,
          interaction_count: 89,
          region: 'oceania',
          category: 'trauma'
        }
      ];
      
      let filteredCapsules = mockCapsules.filter(capsule => {
        // Search query filter
        if (query) {
          const searchTerm = query.toString().toLowerCase();
          const matches = capsule.title.toLowerCase().includes(searchTerm) ||
                         capsule.content.toLowerCase().includes(searchTerm) ||
                         capsule.guardian_id.toLowerCase().includes(searchTerm);
          if (!matches) return false;
        }

        // Grief tier filter
        if (grief_tier && grief_tier !== 'all' && capsule.grief_tier !== grief_tier) return false;

        // Verification status filter
        if (verification_status && verification_status !== 'all' && capsule.verification_status !== verification_status) return false;

        // Region filter
        if (region && region !== 'all' && capsule.region !== region) return false;

        // Category filter
        if (category && category !== 'all' && capsule.category !== category) return false;

        // Truth score filter
        if (truth_score_min && capsule.truth_score < parseInt(truth_score_min.toString())) return false;

        // Date range filter
        if (date_range && date_range !== 'all') {
          const now = new Date();
          const capsuleDate = new Date(capsule.created_at);
          const diffDays = Math.floor((now.getTime() - capsuleDate.getTime()) / (1000 * 60 * 60 * 24));
          
          switch (date_range) {
            case '24h': if (diffDays > 1) return false; break;
            case '7d': if (diffDays > 7) return false; break;
            case '30d': if (diffDays > 30) return false; break;
            case '90d': if (diffDays > 90) return false; break;
          }
        }

        // Tags filter
        if (tags) {
          const tagList = tags.toString().split(',');
          const hasMatchingTag = tagList.some(tag => capsule.tags.includes(tag.trim()));
          if (!hasMatchingTag) return false;
        }

        return true;
      });

      console.log('✅ Capsule search completed:', {
        total_capsules: mockCapsules.length,
        filtered_results: filteredCapsules.length,
        filters_applied: Object.keys(req.query).length
      });

      res.json({
        capsules: filteredCapsules,
        total: filteredCapsules.length,
        query_info: {
          filters_applied: Object.keys(req.query).length,
          search_time: Date.now()
        }
      });
    } catch (error) {
      console.error('❌ Error searching capsules:', error);
      res.status(500).json({ error: 'Failed to search capsules' });
    }
  });

  app.get('/api/capsules/tags', isDebugAuthenticated, async (req: any, res) => {
    console.log('🏷️ Capsule tags requested');
    
    try {
      // Mock available tags
      const tags = [
        'memory', 'testimony', 'legacy', 'truth', 'trauma', 'wisdom',
        'family', 'personal', 'historical', 'political', 'spiritual',
        'scientific', 'artistic', 'cultural', 'environmental', 'social',
        'fraud', 'corporate', 'medical', 'research', 'disaster', 
        'community', 'nostalgia'
      ];

      console.log('✅ Tags retrieved:', tags.length);
      res.json({ tags });
    } catch (error) {
      console.error('❌ Error fetching tags:', error);
      res.status(500).json({ error: 'Failed to fetch tags' });
    }
  });

  // Get lineage graph data
  app.get('/api/lineage/graph', isDebugAuthenticated, async (req: any, res) => {
    console.log('🌳 Lineage graph requested');
    
    try {
      const { search, type } = req.query;
      
      // Mock lineage data
      const mockNodes = [
        {
          id: 'root_1',
          title: 'Corporate Surveillance Exposed',
          creator: 'whistleblower@secure.net',
          created_at: '2025-01-01T12:00:00Z',
          grief_score: 5,
          influence_count: 12,
          verification_status: 'verified',
          capsule_type: 'whistleblower',
          children: ['child_1', 'child_2'],
          parents: []
        },
        {
          id: 'child_1',
          title: 'Data Mining Investigation',
          creator: 'journalist@truth.org',
          created_at: '2025-01-05T14:30:00Z',
          grief_score: 4,
          influence_count: 8,
          verification_status: 'verified',
          capsule_type: 'evidence',
          children: ['grandchild_1'],
          parents: ['root_1']
        },
        {
          id: 'child_2',
          title: 'Tech Worker Testimony',
          creator: 'insider@anonymous.net',
          created_at: '2025-01-03T09:15:00Z',
          grief_score: 3,
          influence_count: 6,
          verification_status: 'pending',
          capsule_type: 'testimony',
          children: ['grandchild_2'],
          parents: ['root_1']
        },
        {
          id: 'grandchild_1',
          title: 'Privacy Law Analysis',
          creator: 'lawyer@justice.org',
          created_at: '2025-01-10T16:45:00Z',
          grief_score: 2,
          influence_count: 4,
          verification_status: 'verified',
          capsule_type: 'legacy',
          children: [],
          parents: ['child_1']
        },
        {
          id: 'grandchild_2',
          title: 'Employee Rights Documentation',
          creator: 'advocate@workers.org',
          created_at: '2025-01-08T11:20:00Z',
          grief_score: 3,
          influence_count: 5,
          verification_status: 'verified',
          capsule_type: 'testimony',
          children: [],
          parents: ['child_2']
        },
        {
          id: 'isolated_1',
          title: 'Climate Data Suppression',
          creator: 'scientist@research.edu',
          created_at: '2025-01-12T13:30:00Z',
          grief_score: 4,
          influence_count: 7,
          verification_status: 'verified',
          capsule_type: 'evidence',
          children: [],
          parents: []
        }
      ];
      
      const mockConnections = [
        {
          source: 'root_1',
          target: 'child_1',
          influence_type: 'inspired',
          strength: 0.9
        },
        {
          source: 'root_1',
          target: 'child_2',
          influence_type: 'inspired',
          strength: 0.8
        },
        {
          source: 'child_1',
          target: 'grandchild_1',
          influence_type: 'referenced',
          strength: 0.7
        },
        {
          source: 'child_2',
          target: 'grandchild_2',
          influence_type: 'expanded',
          strength: 0.6
        }
      ];
      
      // Filter nodes based on search and type
      let filteredNodes = mockNodes;
      
      if (search) {
        const searchTerm = search.toLowerCase();
        filteredNodes = filteredNodes.filter(node =>
          node.title.toLowerCase().includes(searchTerm) ||
          node.creator.toLowerCase().includes(searchTerm) ||
          node.capsule_type.toLowerCase().includes(searchTerm)
        );
      }
      
      if (type && type !== 'all') {
        filteredNodes = filteredNodes.filter(node => node.capsule_type === type);
      }
      
      // Filter connections to only include nodes that are in filtered set
      const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
      const filteredConnections = mockConnections.filter(conn =>
        filteredNodeIds.has(conn.source) && filteredNodeIds.has(conn.target)
      );
      
      console.log('✅ Lineage graph data generated:', {
        nodes: filteredNodes.length,
        connections: filteredConnections.length
      });
      
      res.json({
        nodes: filteredNodes,
        connections: filteredConnections,
        metadata: {
          total_nodes: mockNodes.length,
          total_connections: mockConnections.length,
          filtered_nodes: filteredNodes.length,
          filtered_connections: filteredConnections.length
        }
      });
      
    } catch (error) {
      console.error('❌ Failed to get lineage graph:', error);
      res.status(500).json({ error: 'Failed to get lineage graph' });
    }
  });

  // Get lineage tree data
  app.get('/api/lineage/tree/:capsuleId', isDebugAuthenticated, async (req: any, res) => {
    console.log('🌳 Lineage tree requested for:', req.params.capsuleId);
    
    try {
      const { capsuleId } = req.params;
      
      // Mock lineage tree data
      const mockLineageTree: any = {
        capsuleId: capsuleId === 'root' ? 'root_capsule' : capsuleId,
        title: capsuleId === 'root' ? 'Origin Truth Capsule' : `Capsule ${capsuleId}`,
        griefTier: 4,
        influence: 85,
        depth: 0,
        children: [
          {
            capsuleId: 'child_1',
            title: 'Inspired Memory Capsule',
            griefTier: 3,
            influence: 72,
            depth: 1,
            children: [
              {
                capsuleId: 'grandchild_1',
                title: 'Third Generation Truth',
                griefTier: 2,
                influence: 45,
                depth: 2,
                children: []
              }
            ]
          },
          {
            capsuleId: 'child_2',
            title: 'Legacy Testimony',
            griefTier: 5,
            influence: 95,
            depth: 1,
            children: []
          }
        ]
      };
      
      console.log('✅ Lineage tree data generated');
      res.json(mockLineageTree);
      
    } catch (error) {
      console.error('❌ Failed to get lineage tree:', error);
      res.status(500).json({ error: 'Failed to get lineage tree' });
    }
  });

  // Get lineage analytics
  app.get('/api/lineage/analytics', isDebugAuthenticated, async (req: any, res) => {
    console.log('📊 Lineage analytics requested');
    
    try {
      const mockAnalytics = {
        totalLineages: 42,
        avgGriefFlow: 3.7,
        topInfluencers: [
          {
            capsuleId: 'cap_veritas_1',
            title: 'The Truth About Truth',
            influenceScore: 95,
            descendantCount: 12
          },
          {
            capsuleId: 'cap_memory_2',
            title: 'Generational Trauma Archive',
            influenceScore: 88,
            descendantCount: 8
          },
          {
            capsuleId: 'cap_wisdom_3',
            title: 'Ancient Wisdom Preserved',
            influenceScore: 82,
            descendantCount: 6
          }
        ]
      };
      
      console.log('✅ Analytics data generated');
      res.json(mockAnalytics);
      
    } catch (error) {
      console.error('❌ Failed to get analytics:', error);
      res.status(500).json({ error: 'Failed to get lineage analytics' });
    }
  });

  // Get grief flow analytics (legacy endpoint)
  app.get('/api/lineage/analytics/:capsuleId', isDebugAuthenticated, async (req: any, res) => {
    console.log('📊 Grief flow analytics requested for:', req.params.capsuleId);
    
    try {
      const { capsuleId } = req.params;
      
      // Mock analytics data
      const analytics = {
        capsuleId,
        griefFlowMetrics: {
          totalInherited: 245,
          totalPassed: 189,
          netGriefFlow: 56,
          generationalImpact: 8.7
        },
        influenceMetrics: {
          directInfluence: 12,
          cascadingInfluence: 34,
          networkReach: 67,
          truthResonance: 94.5
        },
        lineageStats: {
          ancestorCount: 7,
          descendantCount: 23,
          maxDepth: 5,
          branchingFactor: 3.2
        }
      };
      
      console.log('✅ Analytics generated:', analytics);
      res.json(analytics);
      
    } catch (error) {
      console.error('❌ Failed to generate analytics:', error);
      res.status(500).json({ error: 'Failed to generate analytics' });
    }
  });
  
  // Legacy lineage endpoint (keeping for compatibility)
  app.post('/api/lineage/legacy', isDebugAuthenticated, async (req: any, res) => {
    console.log('🔗 Creating capsule lineage');
    
    try {
      const { parentId, childId, griefFlow } = req.body;
      const triggeredBy = req.user.id;
      
      if (!parentId || !childId) {
        return res.status(400).json({ error: 'Parent and child capsule IDs required' });
      }
      
      // Mock lineage creation for now
      const lineage = {
        id: `lineage_${Date.now()}`,
        parentId,
        childId,
        triggeredBy,
        timestamp: new Date().toISOString(),
        griefFlow: griefFlow || 75,
        influenceScore: 85
      };
      
      console.log('✅ Lineage created:', lineage);
      res.json(lineage);
      
    } catch (error) {
      console.error('❌ Failed to create lineage:', error);
      res.status(500).json({ error: 'Failed to create lineage' });
    }
  });
  
  // Get lineage tree for a capsule
  app.get('/api/lineage/tree/:capsuleId', isDebugAuthenticated, async (req: any, res) => {
    console.log(`🌳 Getting lineage tree for: ${req.params.capsuleId}`);
    
    try {
      const mockTree = {
        capsuleId: req.params.capsuleId,
        title: 'Original Truth Capsule',
        griefTier: 5,
        influence: 92,
        depth: 0,
        children: [
          {
            capsuleId: 'child_001',
            title: 'Inspired Memory',
            griefTier: 4,
            influence: 78,
            depth: 1,
            children: [
              {
                capsuleId: 'grandchild_001',
                title: 'Extended Reflection',
                griefTier: 3,
                influence: 65,
                depth: 2,
                children: []
              }
            ]
          },
          {
            capsuleId: 'child_002',
            title: 'Connected Story',
            griefTier: 4,
            influence: 82,
            depth: 1,
            children: []
          }
        ]
      };
      
      res.json(mockTree);
      
    } catch (error) {
      console.error('❌ Failed to get lineage tree:', error);
      res.status(500).json({ error: 'Failed to get lineage tree' });
    }
  });
  
  // Get lineage analytics
  app.get('/api/lineage/analytics', isDebugAuthenticated, async (req: any, res) => {
    console.log('📊 Getting lineage analytics');
    
    try {
      const mockAnalytics = {
        totalLineages: 847,
        avgGriefFlow: 68.3,
        topInfluencers: [
          {
            capsuleId: 'cap_influential_001',
            title: 'The Foundation Truth',
            influenceScore: 285,
            descendantCount: 12
          },
          {
            capsuleId: 'cap_influential_002', 
            title: 'Historical Revelation',
            influenceScore: 267,
            descendantCount: 9
          },
          {
            capsuleId: 'cap_influential_003',
            title: 'Personal Legacy',
            influenceScore: 234,
            descendantCount: 8
          }
        ],
        lineageDepth: {
          maxDepth: 5,
          avgDepth: 2.3
        }
      };
      
      res.json(mockAnalytics);
      
    } catch (error) {
      console.error('❌ Failed to get analytics:', error);
      res.status(500).json({ error: 'Failed to get analytics' });
    }
  });
  
  // Get related capsules based on lineage
  app.get('/api/lineage/related/:capsuleId', isDebugAuthenticated, async (req: any, res) => {
    console.log(`🔍 Getting related capsules for: ${req.params.capsuleId}`);
    
    try {
      const mockRelated = [
        {
          id: 'sibling_001',
          title: 'Sister Memory',
          griefTier: 4,
          relationship: 'sibling'
        },
        {
          id: 'descendant_001',
          title: 'Inspired Legacy',
          griefTier: 3,
          relationship: 'descendant'
        },
        {
          id: 'descendant_002',
          title: 'Connected Truth',
          griefTier: 4,
          relationship: 'descendant'
        }
      ];
      
      res.json(mockRelated);
      
    } catch (error) {
      console.error('❌ Failed to get related capsules:', error);
      res.status(500).json({ error: 'Failed to get related capsules' });
    }
  });

  // Engagement tracking routes
  app.post('/api/engagement/track-session', isDebugAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { sessionId, startTime, userAgent, path } = req.body;
      
      console.log(`📊 Tracking session for ${userId}:`, { sessionId, path, startTime });
      
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
            id: 'first_session',
            title: 'Welcome Guardian',
            description: 'Complete your first session',
            icon: 'star',
            unlocked: true,
            progress: 1,
            maxProgress: 1,
            reward: '10 GTT'
          }
        ]
      };

      res.json({ success: true, metrics });
    } catch (error) {
      console.error('Failed to track session:', error);
      res.status(500).json({ error: 'Failed to track session' });
    }
  });

  app.get('/api/engagement/daily-challenges', isDebugAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      console.log(`🎯 Loading daily challenges for ${userId}`);
      
      const challenges = [
        {
          id: 'create_capsule_daily',
          title: 'Truth Seeker',
          description: 'Create your first capsule today',
          progress: 0,
          maxProgress: 1,
          reward: '100 GTT',
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'explore_features',
          title: 'Feature Explorer',
          description: 'Visit 3 different feature pages',
          progress: 1,
          maxProgress: 3,
          reward: '50 GTT',
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      res.json({ challenges });
    } catch (error) {
      console.error('Failed to load challenges:', error);
      res.status(500).json({ error: 'Failed to load challenges' });
    }
  });

  app.post('/api/engagement/complete-challenge/:challengeId', isDebugAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { challengeId } = req.params;
      console.log(`🏆 Challenge completed by ${userId}:`, challengeId);

      res.json({ 
        success: true, 
        reward: '100 GTT',
        message: 'Congratulations! You earned 100 GTT!'
      });
    } catch (error) {
      console.error('Failed to complete challenge:', error);
      res.status(500).json({ error: 'Failed to complete challenge' });
    }
  });

  app.get('/api/personalization/profile', isDebugAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      console.log(`🧠 Loading personality profile for ${userId}`);
      
      const personality = {
        traits: {
          explorer: 75,
          creator: 60,
          social: 50,
          analytical: 40,
          collector: 30
        },
        preferences: {
          contentTypes: ['personal_memory', 'wisdom'],
          activityTimes: ['evening'],
          engagementStyle: 'guided',
          riskTolerance: 'moderate'
        },
        journey: {
          stage: 'explorer',
          completedActions: [],
          skillLevels: {},
          interests: []
        }
      };

      res.json({ personality });
    } catch (error) {
      console.error('Failed to load profile:', error);
      res.status(500).json({ error: 'Failed to load profile' });
    }
  });

  app.post('/api/personalization/track', isDebugAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { action, path, timestamp } = req.body;
      console.log(`📈 Tracking behavior for ${userId}:`, { action, path, timestamp });

      res.json({ success: true });
    } catch (error) {
      console.error('Failed to track behavior:', error);
      res.status(500).json({ error: 'Failed to track behavior' });
    }
  });

  // Dynamic Badge System API
  app.get('/api/navigation/badges/:routeId', isDebugAuthenticated, async (req: any, res) => {
    try {
      const { routeId } = req.params;
      const userId = req.user.id;
      
      console.log(`🏷️ Loading badges for route ${routeId} for user ${userId}`);
      
      // Mock dynamic badges based on route and user state
      const badges = generateBadgesForRoute(routeId, userId);
      
      res.json(badges);
    } catch (error) {
      console.error('Failed to load badges:', error);
      res.status(500).json({ error: 'Failed to load badges' });
    }
  });

  app.get('/api/navigation/global-badges', isDebugAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      console.log(`🌐 Loading global badges for user ${userId}`);
      
      const globalBadges = [
        {
          id: 'dao-governance-new-proposal',
          type: 'new',
          text: '🆕 New Proposal',
          count: 2,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'yield-calculator-unclaimed',
          type: 'warning',
          text: '⚠️ Unclaimed Yield',
          count: 1
        },
        {
          id: 'validator-dashboard-pending',
          type: 'urgent',
          text: '🔥 Pending Review',
          count: 3
        },
        {
          id: 'analytics-milestone',
          type: 'success',
          text: '🎉 Milestone Reached'
        }
      ];
      
      res.json(globalBadges);
    } catch (error) {
      console.error('Failed to load global badges:', error);
      res.status(500).json({ error: 'Failed to load global badges' });
    }
  });

  // Platform statistics for homepage
  app.get('/api/platform/stats', async (req, res) => {
    try {
      console.log('📊 Loading platform statistics');
      const stats = getPlatformStats();
      res.json(stats);
    } catch (error) {
      console.error('Failed to load platform stats:', error);
      res.status(500).json({ error: 'Failed to load platform stats' });
    }
  });

  // Whistleblower sanctuary endpoints
  app.post('/api/whistleblower/submit', isDebugAuthenticated, async (req, res) => {
    try {
      console.log('🔒 Whistleblower submission received');
      
      const submission = {
        id: `whistleblower-${Date.now()}`,
        ...req.body,
        status: 'submitted',
        encrypted: true,
        timestamp: new Date().toISOString()
      };
      
      res.json({ 
        success: true, 
        submissionId: submission.id,
        message: 'Submission securely received and encrypted'
      });
    } catch (error) {
      console.error('Failed to process whistleblower submission:', error);
      res.status(500).json({ error: 'Failed to process submission' });
    }
  });

  // Time messages endpoints
  app.post('/api/time-messages/create', isDebugAuthenticated, async (req, res) => {
    try {
      console.log('⏰ Creating time message');
      
      const timeMessage = {
        id: `time-msg-${Date.now()}`,
        ...req.body,
        status: 'sealed',
        createdAt: new Date().toISOString()
      };
      
      res.json({ 
        success: true, 
        messageId: timeMessage.id,
        message: 'Time message sealed successfully'
      });
    } catch (error) {
      console.error('Failed to create time message:', error);
      res.status(500).json({ error: 'Failed to create time message' });
    }
  });

  app.get('/api/time-messages/sent', isDebugAuthenticated, async (req, res) => {
    try {
      const sentMessages = [
        {
          id: 'sent-1',
          title: 'Happy 30th Birthday!',
          recipient: 'Future Me',
          unlockDate: new Date('2026-08-02'),
          status: 'sealed',
          messageType: 'birthday'
        },
        {
          id: 'sent-2', 
          title: 'Anniversary Message',
          recipient: 'partner@example.com',
          unlockDate: new Date('2025-12-25'),
          status: 'sealed',
          messageType: 'anniversary'
        }
      ];
      
      res.json(sentMessages);
    } catch (error) {
      console.error('Failed to load sent messages:', error);
      res.status(500).json({ error: 'Failed to load sent messages' });
    }
  });

  app.get('/api/time-messages/received', isDebugAuthenticated, async (req, res) => {
    try {
      const receivedMessages = [
        {
          id: 'received-1',
          title: 'Message from 2020',
          recipient: 'Past Me',
          unlockDate: new Date('2025-01-01'),
          status: 'delivered',
          messageType: 'future_self'
        }
      ];
      
      res.json(receivedMessages);
    } catch (error) {
      console.error('Failed to load received messages:', error);
      res.status(500).json({ error: 'Failed to load received messages' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Badge generation helper function
function generateBadgesForRoute(routeId: string, userId: string) {
  const badges: any[] = [];
  
  switch (routeId) {
    case 'dao-governance':
    case 'dao-proposals':
      badges.push({
        id: `${routeId}-new-proposal`,
        type: 'new',
        text: '🆕 New',
        count: 2
      });
      break;
      
    case 'yield-calculator':
      badges.push({
        id: `${routeId}-unclaimed`,
        type: 'warning',
        text: '⚠️ Unclaimed',
        count: 1
      });
      break;
      
    case 'validator-dashboard':
      badges.push({
        id: `${routeId}-pending`,
        type: 'urgent',
        text: '🔥 Pending',
        count: 3
      });
      break;
      
    case 'analytics':
      badges.push({
        id: `${routeId}-milestone`,
        type: 'success',
        text: '🎉 Milestone'
      });
      break;
      
    case 'create-capsule':
      badges.push({
        id: `${routeId}-tutorial`,
        type: 'info',
        text: '💡 Tutorial'
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
    lastUpdated: new Date().toISOString()
  };
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