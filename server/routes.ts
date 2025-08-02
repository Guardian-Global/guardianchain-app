import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupDebugAuth, isDebugAuthenticated } from "./debugAuth";

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

  // Fix token data API with proper JSON response
  app.get('/api/token/live-data', (req, res) => {
    const basePrice = 0.0075;
    const priceVariation = (Math.random() - 0.5) * 0.0002;
    const currentPrice = Math.max(0.001, basePrice + priceVariation);
    
    const tokenData = {
      price: currentPrice,
      priceChange24h: 12.34 + (Math.random() - 0.5) * 5,
      volume24h: 2450000 + (Math.random() - 0.5) * 100000,
      marketCap: currentPrice * 200000000,
      totalSupply: 1000000000,
      circulatingSupply: 200000000,
      holders: 8547,
      transactions24h: 1234,
      lastUpdated: new Date().toISOString(),
      burnRate: 2.5,
      stakingApr: 15.2,
      liquidityPools: [],
      feesCollected24h: 196000,
      foundationTreasury: 15200000,
      communityRewards: 8900000
    };
    
    res.json(tokenData);
  });

  // Fix get-user-tier API with debug authentication
  app.get('/api/get-user-tier', isDebugAuthenticated, (req: any, res) => {
    const user = req.user;
    res.json({
      tier: user?.tier || "EXPLORER",
      authenticated: true,
      userId: user?.id,
      username: user?.firstName + ' ' + user?.lastName,
      email: user?.email,
      capabilities: {
        createCapsules: true,
        verifyContent: true,
        earnGTT: true,
        accessPremiumFeatures: user?.tier !== 'EXPLORER'
      }
    });
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}