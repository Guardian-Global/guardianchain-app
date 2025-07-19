import { Router } from 'express';
import { z } from 'zod';
import { storage } from '../storage';
import { 
  userProfileSchema, 
  authRequestSchema, 
  ONBOARDING_STEPS, 
  USER_TIERS,
  TIER_PERMISSIONS,
  type UserProfile,
  type UserTier 
} from '../../client/src/lib/auth/enterprise-auth';

const router = Router();

// Mock session store (replace with proper session management)
const sessions = new Map<string, any>();

// Initiate authentication
router.post('/initiate', async (req, res) => {
  try {
    const { provider, tier, returnUrl, metadata } = authRequestSchema.parse(req.body);
    
    // Mock authentication flow - in production, integrate with actual OAuth providers
    const sessionId = crypto.randomUUID();
    const authUrl = `/api/auth/callback?provider=${provider}&session=${sessionId}&tier=${tier || USER_TIERS.PROFESSIONAL}`;
    
    // Store session data
    sessions.set(sessionId, {
      provider,
      tier: tier || USER_TIERS.PROFESSIONAL,
      returnUrl: returnUrl || '/',
      metadata,
      createdAt: new Date(),
      status: 'pending'
    });
    
    res.json({
      sessionId,
      redirectUrl: authUrl,
      provider,
      tier: tier || USER_TIERS.PROFESSIONAL
    });
  } catch (error) {
    console.error('Auth initiation error:', error);
    res.status(400).json({ 
      error: 'Invalid authentication request',
      message: error instanceof z.ZodError ? error.errors : 'Unknown error'
    });
  }
});

// Authentication callback
router.get('/callback', async (req, res) => {
  try {
    const { provider, session: sessionId, tier } = req.query;
    
    if (!sessionId || !sessions.has(sessionId as string)) {
      return res.status(400).json({ error: 'Invalid session' });
    }
    
    const sessionData = sessions.get(sessionId as string);
    
    // Mock user creation/retrieval
    const mockUser: UserProfile = {
      id: crypto.randomUUID(),
      email: `user@${provider}.com`,
      username: `user_${Date.now()}`,
      tier: (tier as UserTier) || USER_TIERS.PROFESSIONAL,
      verificationLevel: 'basic',
      permissions: TIER_PERMISSIONS[(tier as UserTier) || USER_TIERS.PROFESSIONAL] || [],
      onboardingStep: 1,
      aiAssistantEnabled: true,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      metadata: {
        provider,
        sessionId,
        ...sessionData.metadata
      }
    };
    
    // Store user session
    req.session = req.session || {};
    req.session.user = mockUser;
    req.session.authenticated = true;
    
    // Update session status
    sessions.set(sessionId as string, {
      ...sessionData,
      status: 'completed',
      user: mockUser
    });
    
    res.redirect(sessionData.returnUrl || '/');
  } catch (error) {
    console.error('Auth callback error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Get current session
router.get('/session', (req, res) => {
  if (req.session?.authenticated && req.session?.user) {
    res.json({
      user: req.session.user,
      accessToken: 'mock_access_token',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      provider: req.session.user.metadata?.provider || 'unknown'
    });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Get user profile
router.get('/profile', (req, res) => {
  if (req.session?.authenticated && req.session?.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Update user profile
router.patch('/profile', async (req, res) => {
  try {
    if (!req.session?.authenticated || !req.session?.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const updates = userProfileSchema.partial().parse(req.body);
    const updatedUser = { ...req.session.user, ...updates };
    
    // Update session
    req.session.user = updatedUser;
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(400).json({ 
      error: 'Invalid profile data',
      message: error instanceof z.ZodError ? error.errors : 'Unknown error'
    });
  }
});

// AI onboarding recommendations
router.post('/onboarding/recommendations', async (req, res) => {
  try {
    const { step, userContext } = req.body;
    
    if (!req.session?.authenticated) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const currentStep = ONBOARDING_STEPS.find(s => s.id === step);
    if (!currentStep) {
      return res.status(404).json({ error: 'Invalid onboarding step' });
    }
    
    // Use Anthropic AI for personalized recommendations
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY || '',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 500,
          messages: [{
            role: 'user',
            content: `You are an AI onboarding assistant for GUARDIANCHAIN, an enterprise Web3 platform. 

Current step: ${currentStep.title} - ${currentStep.description}
User context: ${JSON.stringify(userContext)}
AI prompt: ${currentStep.aiPrompt}

Provide onboarding recommendations in JSON format:
{
  "recommendations": [array of 3-5 specific actionable recommendations],
  "nextSteps": [array of immediate next actions],
  "estimatedTime": "time estimate",
  "tips": [array of helpful tips],
  "warnings": [array of potential issues to avoid]
}

Focus on enterprise-grade security, compliance, and optimal tier configuration.`
          }]
        })
      });

      if (response.ok) {
        const aiResponse = await response.json();
        const content = aiResponse.content[0]?.text;
        
        try {
          const recommendations = JSON.parse(content);
          return res.json(recommendations);
        } catch (parseError) {
          console.error('AI response parsing error:', parseError);
        }
      }
    } catch (aiError) {
      console.error('Anthropic AI error:', aiError);
    }
    
    // Fallback recommendations based on step and context
    const fallbackRecommendations = generateFallbackRecommendations(step, userContext);
    res.json(fallbackRecommendations);
    
  } catch (error) {
    console.error('Onboarding recommendations error:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Logout failed' });
      }
      res.clearCookie('connect.sid');
      res.json({ success: true });
    });
  } else {
    res.json({ success: true });
  }
});

// Tier upgrade endpoint
router.post('/upgrade-tier', async (req, res) => {
  try {
    if (!req.session?.authenticated || !req.session?.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const { tier } = req.body;
    if (!Object.values(USER_TIERS).includes(tier)) {
      return res.status(400).json({ error: 'Invalid tier' });
    }
    
    // Update user tier
    req.session.user.tier = tier;
    req.session.user.permissions = TIER_PERMISSIONS[tier] || [];
    req.session.user.verificationLevel = getRequiredVerificationLevel(tier);
    
    res.json(req.session.user);
  } catch (error) {
    console.error('Tier upgrade error:', error);
    res.status(500).json({ error: 'Tier upgrade failed' });
  }
});

// Permission check middleware
export const requirePermission = (permission: string) => {
  return (req: any, res: any, next: any) => {
    if (!req.session?.authenticated || !req.session?.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const user = req.session.user;
    const hasPermission = user.tier === USER_TIERS.SOVEREIGN || 
                         user.permissions.includes(permission) ||
                         user.permissions.includes('all:permissions');
    
    if (!hasPermission) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: permission,
        userTier: user.tier
      });
    }
    
    next();
  };
};

// Helper functions
function generateFallbackRecommendations(step: number, userContext: any) {
  const recommendations = {
    1: {
      recommendations: [
        'Select a tier that matches your organization size and needs',
        'Professional tier recommended for most users starting out',
        'Enterprise tier provides compliance tools for regulated industries',
        'Consider starting with Professional and upgrading as needed'
      ],
      nextSteps: [
        'Choose your desired tier level',
        'Review feature comparison',
        'Proceed to security setup'
      ],
      estimatedTime: '2-3 minutes',
      tips: [
        'You can upgrade your tier at any time',
        'Higher tiers include all lower tier features',
        'Enterprise tier includes dedicated support'
      ],
      warnings: [
        'Sovereign tier is for protocol-level access only',
        'Verify compliance requirements for your jurisdiction'
      ]
    },
    2: {
      recommendations: [
        'Enable at least two authentication methods for security',
        'Biometric authentication recommended for mobile users',
        'Web3 wallet integration required for blockchain features',
        'Stripe Identity for enterprise compliance verification'
      ],
      nextSteps: [
        'Select primary authentication method',
        'Configure backup authentication',
        'Test authentication flow'
      ],
      estimatedTime: '5-7 minutes',
      tips: [
        'Multiple auth methods increase security',
        'Web3 wallets enable token features',
        'Biometric auth works on supported devices'
      ],
      warnings: [
        'Store backup codes securely',
        'Test authentication before proceeding',
        'Some methods require device support'
      ]
    }
  };
  
  return recommendations[step as keyof typeof recommendations] || {
    recommendations: ['Complete current setup step', 'Follow on-screen instructions'],
    nextSteps: ['Continue with setup'],
    estimatedTime: '3-5 minutes',
    tips: ['Take your time with each step'],
    warnings: ['Ensure all information is accurate']
  };
}

function getRequiredVerificationLevel(tier: UserTier): string {
  const levels = {
    [USER_TIERS.STARTER]: 'basic',
    [USER_TIERS.PROFESSIONAL]: 'verified',
    [USER_TIERS.ENTERPRISE]: 'enterprise',
    [USER_TIERS.SOVEREIGN]: 'sovereign'
  };
  return levels[tier];
}

export default router;