import { Router, Request, Response } from 'express';
import { isAuthenticated } from '../replitAuth';
import { storage } from '../storage';

const router = Router();

// Get user profile
router.get('/api/profile/:userId', isAuthenticated, async (req: any, res: Response) => {
  try {
    const { userId } = req.params;
    const requestingUserId = req.user.claims.sub;
    
    // Users can only view their own profile unless admin
    if (userId !== requestingUserId && !req.user.roles?.includes('ADMIN')) {
      return res.status(403).json({ message: 'Unauthorized to view this profile' });
    }
    
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return enhanced profile with stats
    const profile = {
      ...user,
      stats: {
        capsulesCreated: 0, // TODO: Get from database
        totalYieldEarned: 0, // TODO: Get from database  
        verificationScore: 100,
        followerCount: 0,
        followingCount: 0,
        gttBalance: 1000 // TODO: Get from smart contract
      },
      preferences: {
        theme: 'dark',
        emailNotifications: true,
        pushNotifications: false,
        aiAssistantEnabled: true,
        publicProfile: true,
        showStats: true,
        allowMessages: true
      }
    };
    
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/api/profile/:userId', isAuthenticated, async (req: any, res: Response) => {
  try {
    const { userId } = req.params;
    const requestingUserId = req.user.claims.sub;
    
    // Users can only update their own profile
    if (userId !== requestingUserId) {
      return res.status(403).json({ message: 'Unauthorized to update this profile' });
    }
    
    const updates = req.body;
    
    // Filter allowed updates
    const allowedFields = [
      'firstName', 'lastName', 'displayName', 'bio', 'location', 
      'occupation', 'website', 'twitter', 'linkedin', 'github',
      'interests', 'specialties', 'preferences'
    ];
    
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .reduce((obj: any, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});
    
    // Update user in database
    const updatedUser = await storage.updateUser(userId, filteredUpdates);
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// AI Chat endpoint
router.post('/api/ai/chat', isAuthenticated, async (req: any, res: Response) => {
  try {
    const { message, context } = req.body;
    const userId = req.user.claims.sub;
    
    // Calculate importance based on content
    const importance = calculateImportance(message);
    
    // Mock AI response (replace with actual AI integration)
    const aiResponse = generateAIResponse(message, context);
    
    // Calculate GTT cost based on complexity
    const gttCost = importance === 'critical' ? 5 : importance === 'high' ? 3 : 0;
    
    res.json({
      message: aiResponse,
      importance,
      gttCost,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in AI chat:', error);
    res.status(500).json({ message: 'AI service temporarily unavailable' });
  }
});

// Save AI memory
router.post('/api/ai/save-memory', isAuthenticated, async (req: any, res: Response) => {
  try {
    const { messageId, content, importance } = req.body;
    const userId = req.user.claims.sub;
    
    // TODO: Save to memories table
    console.log(`Saving memory for user ${userId}:`, { messageId, content, importance });
    
    res.json({
      success: true,
      memorySaved: true,
      gttCost: 10
    });
  } catch (error) {
    console.error('Error saving memory:', error);
    res.status(500).json({ message: 'Failed to save memory' });
  }
});

function calculateImportance(message: string): string {
  const criticalKeywords = ['urgent', 'emergency', 'critical', 'important', 'help'];
  const highKeywords = ['strategy', 'plan', 'investment', 'decision', 'analysis'];
  
  const lowerMessage = message.toLowerCase();
  
  if (criticalKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'critical';
  }
  if (highKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'high';
  }
  if (message.length > 100) {
    return 'medium';
  }
  return 'low';
}

function generateAIResponse(message: string, context: any): string {
  const responses = [
    "I understand your request. Based on your GUARDIANCHAIN activity, I recommend focusing on creating high-quality truth capsules to maximize your GTT yield.",
    "As your sovereign AI assistant, I can help you optimize your platform usage. Your verification score is excellent, which positions you well for higher yields.",
    "I notice you're interested in the token launch. The current phase shows strong progress, and early participation could yield significant benefits.",
    "Your profile analytics suggest you'd benefit from exploring the advanced capsule creation features. Would you like me to guide you through the process?",
    "Based on your tier status and GTT balance, I recommend considering the yield optimization strategies available in your dashboard."
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

export default router;