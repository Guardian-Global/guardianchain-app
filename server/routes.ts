import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupDebugAuth, isDebugAuthenticated } from "./debugAuth";

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
    const { capsuleId, authorId, yieldAmount } = req.body;
    
    if (!capsuleId) {
      return res.status(400).json({ error: 'Missing capsuleId' });
    }

    console.log('🔵 DEBUG: Replaying capsule:', capsuleId, 'Yield:', yieldAmount);

    // Create replay log entry
    const replayLogId = `replay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    
    const replayLog = {
      id: replayLogId,
      capsuleId,
      userId: req.user.id,
      replayType: 'standard',
      yieldAmount: yieldAmount || 2.50,
      transactionHash,
      sessionId: req.sessionID || `session_${Date.now()}`,
      ipAddress: req.ip || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      metadata: {
        authorId,
        requestTimestamp: new Date().toISOString(),
        platform: 'GuardianChain'
      },
      createdAt: new Date().toISOString()
    };

    const replayResult = {
      capsuleId,
      authorId,
      yieldAmount: yieldAmount || 2.50,
      replayCount: 1,
      timestamp: new Date().toISOString(),
      transactionHash,
      replayLogId
    };

    console.log('✅ DEBUG: Replay log created:', replayLog);
    console.log('✅ DEBUG: Capsule replay completed:', replayResult);
    res.json({ success: true, replay: replayResult, replayLog, message: 'Capsule replayed and yield distributed successfully' });
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
    console.log('🔵 DEBUG: /api/capsules GET called');
    const user = req.user;
    
    // Return mock capsules
    const mockCapsules = [
      {
        id: 'sample-capsule-1',
        title: 'Sample Truth Capsule',
        content: 'This is a sample capsule for demonstration.',
        capsuleType: 'news_verification',
        authorId: user.id,
        status: 'verified',
        verificationCount: 3,
        truthScore: 85,
        createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      }
    ];
    
    res.json(mockCapsules);
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