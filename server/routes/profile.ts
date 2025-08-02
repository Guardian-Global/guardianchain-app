import { Router } from 'express';
import { storage } from '../storage';
import { isDebugAuthenticated } from '../debugAuth';

const router = Router();

// Get user profile by ID - simple endpoint
router.get('/:userId', isDebugAuthenticated, async (req: any, res) => {
  try {
    const userId = req.params.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    // Mock profile data for development
    const mockProfile = {
      id: userId,
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@guardianchain.app',
      tier: 'EXPLORER',
      role: 'USER',
      walletAddress: '0x1234567890123456789012345678901234567890',
      truthScore: 87,
      capsulesCreated: 12,
      verificationCount: 45,
      gttEarned: 2547,
      reputation: 'Bronze',
      createdAt: new Date(Date.now() - 86400000 * 30).toISOString(), // 30 days ago
      lastLogin: new Date().toISOString()
    };

    res.json(mockProfile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Get detailed user profile
router.get('/detailed/:userId?', isDebugAuthenticated, async (req: any, res) => {
  try {
    const userId = req.params.userId || req.user?.id;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    // Get base user data
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user statistics
    const stats = await storage.getUserStats(userId);
    
    // Get user reputation
    const reputation = await storage.getUserReputation(userId);
    
    // Get user achievements
    const achievements = await storage.getUserAchievements(userId);

    const profile = {
      ...user,
      stats,
      reputation,
      achievements
    };

    res.json(profile);
  } catch (error) {
    console.error('Error fetching detailed profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/update', isDebugAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const updateData = req.body;
    
    // Validate required fields
    if (!updateData.firstName || !updateData.lastName) {
      return res.status(400).json({ error: 'First name and last name are required' });
    }

    const updatedUser = await storage.updateUserProfile(userId, updateData);
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Upload profile image
router.post('/upload-image', isDebugAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // In a real implementation, this would handle file upload
    // For now, return a placeholder response
    const imageUrl = '/assets/profile/default-avatar.jpg';
    
    await storage.updateUserProfile(userId, { 
      profileImageUrl: imageUrl 
    });

    res.json({ imageUrl });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Get user achievements
router.get('/achievements/:userId?', isDebugAuthenticated, async (req: any, res) => {
  try {
    const userId = req.params.userId || req.user?.id;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const achievements = await storage.getUserAchievements(userId);
    
    res.json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

// Award achievement to user
router.post('/award-achievement', isDebugAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user?.id;
    const { achievementId } = req.body;
    
    if (!userId || !achievementId) {
      return res.status(400).json({ error: 'User ID and achievement ID required' });
    }

    const achievement = await storage.awardAchievement(userId, achievementId);
    
    res.json(achievement);
  } catch (error) {
    console.error('Error awarding achievement:', error);
    res.status(500).json({ error: 'Failed to award achievement' });
  }
});

// Get user activity feed
router.get('/activity/:userId?', isDebugAuthenticated, async (req: any, res) => {
  try {
    const userId = req.params.userId || req.user?.id;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const activities = await storage.getUserActivity(userId, limit, offset);
    
    res.json(activities);
  } catch (error) {
    console.error('Error fetching user activity:', error);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

// Get user connections/followers
router.get('/connections/:userId?', isDebugAuthenticated, async (req: any, res) => {
  try {
    const userId = req.params.userId || req.user?.id;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const connections = await storage.getUserConnections(userId);
    
    res.json(connections);
  } catch (error) {
    console.error('Error fetching connections:', error);
    res.status(500).json({ error: 'Failed to fetch connections' });
  }
});

// Follow/unfollow user
router.post('/follow', isDebugAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user?.id;
    const { targetUserId, action } = req.body; // action: 'follow' | 'unfollow'
    
    if (!userId || !targetUserId) {
      return res.status(400).json({ error: 'User IDs required' });
    }

    if (userId === targetUserId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    const result = await storage.toggleUserFollow(userId, targetUserId, action);
    
    res.json(result);
  } catch (error) {
    console.error('Error toggling follow:', error);
    res.status(500).json({ error: 'Failed to update follow status' });
  }
});

export default router;