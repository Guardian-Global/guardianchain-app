import express from 'express';
import Stripe from 'stripe';

const router = express.Router();

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Enhanced authentication status endpoint
router.get('/status', async (req, res) => {
  try {
    // Check if user is authenticated via session, JWT, or Web3 wallet
    const isAuthenticated = req.session?.user || req.headers.authorization;
    
    res.json({
      authenticated: !!isAuthenticated,
      user: req.session?.user || null,
      authMethods: ['stripe_identity', 'web3_wallet', 'biometric', 'enterprise_sso']
    });
  } catch (error) {
    res.status(500).json({ error: 'Authentication check failed' });
  }
});

// Stripe Identity verification endpoint
router.post('/stripe-identity', async (req, res) => {
  try {
    const verificationSession = await stripe.identity.verificationSessions.create({
      type: 'document',
      metadata: {
        user_id: req.session?.user?.id || 'anonymous',
        purpose: 'guardianchain_enterprise_kyc'
      },
      options: {
        document: {
          require_id_number: true,
          require_live_capture: true,
          require_matching_selfie: true,
        },
      },
    });

    res.json({
      verification_session_id: verificationSession.id,
      verification_session_url: verificationSession.url,
      client_secret: verificationSession.client_secret,
    });
  } catch (error) {
    console.error('Stripe Identity error:', error);
    res.status(500).json({ error: 'Identity verification setup failed' });
  }
});

// Web3 wallet authentication endpoint
router.post('/web3-wallet', async (req, res) => {
  try {
    const { address, signature, message } = req.body;
    
    // Verify the signature (simplified for demo)
    // In production, you would verify the signature against the message
    if (address && signature) {
      req.session.user = {
        id: address,
        type: 'web3_wallet',
        address: address,
        authenticated_at: new Date().toISOString()
      };
      
      res.json({
        success: true,
        user: req.session.user
      });
    } else {
      res.status(400).json({ error: 'Invalid wallet signature' });
    }
  } catch (error) {
    console.error('Web3 auth error:', error);
    res.status(500).json({ error: 'Web3 authentication failed' });
  }
});

// Enterprise SSO endpoint
router.get('/enterprise-sso', (req, res) => {
  // In production, this would redirect to your SSO provider
  // For demo purposes, we'll simulate the flow
  const ssoProviders = [
    'azure-ad',
    'google-workspace', 
    'okta',
    'auth0'
  ];
  
  res.json({
    available_providers: ssoProviders,
    redirect_url: '/api/auth/sso/callback',
    message: 'Enterprise SSO providers available'
  });
});

// Biometric authentication setup
router.post('/biometric-setup', async (req, res) => {
  try {
    const { credentialId, publicKey, userHandle } = req.body;
    
    // Store biometric credential (in production, store in secure database)
    req.session.biometric = {
      credentialId,
      publicKey,
      userHandle,
      registered_at: new Date().toISOString()
    };
    
    res.json({
      success: true,
      message: 'Biometric authentication configured'
    });
  } catch (error) {
    console.error('Biometric setup error:', error);
    res.status(500).json({ error: 'Biometric setup failed' });
  }
});

// Enhanced logout endpoint
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ error: 'Logout failed' });
    } else {
      res.json({ success: true, message: 'Logged out successfully' });
    }
  });
});

// User profile endpoint
router.get('/profile', (req, res) => {
  if (!req.session?.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  res.json({
    user: req.session.user,
    authMethods: {
      stripe_identity: !!req.session.stripe_verification,
      web3_wallet: req.session.user.type === 'web3_wallet',
      biometric: !!req.session.biometric,
      enterprise_sso: req.session.user.type === 'enterprise_sso'
    },
    permissions: [
      'enterprise_api_access',
      'premium_features',
      'advanced_analytics',
      'priority_support'
    ]
  });
});

export default router;