// server/routes/api/admin.ts
import { Router } from 'express';
import { consolidatedAuth } from '../../auth/authConsolidation';
import { storage } from '../../storage-minimal';

const router = Router();

// Middleware to check admin access
const requireAdminAccess = (req: any, res: any, next: any) => {
  const userTier = req.user?.tier;
  if (userTier !== 'GUARDIAN' && userTier !== 'TITAN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Get admin statistics
router.get('/stats', consolidatedAuth, requireAdminAccess, async (req, res) => {
  try {
    // Mock admin statistics for development
    const stats = {
      totalUsers: 1247,
      totalCapsules: 3891,
      totalUnlocks: 892,
      totalRevenue: 15640,
      recentActivity: [
        {
          id: '1',
          type: 'capsule_created',
          user: 'user@example.com',
          details: 'Created new memory capsule',
          timestamp: new Date(Date.now() - 60000).toISOString(),
        },
        {
          id: '2',
          type: 'capsule_unlocked',
          user: 'viewer@example.com',
          details: 'Unlocked premium capsule',
          timestamp: new Date(Date.now() - 120000).toISOString(),
        },
        {
          id: '3',
          type: 'user_registered',
          user: 'newuser@example.com',
          details: 'New user registration',
          timestamp: new Date(Date.now() - 180000).toISOString(),
        },
        {
          id: '4',
          type: 'capsule_minted',
          user: 'creator@example.com',
          details: 'Minted capsule as NFT',
          timestamp: new Date(Date.now() - 240000).toISOString(),
        },
      ],
      topCapsules: [
        {
          id: '1',
          title: 'Memories of Summer',
          creator: 'artist@example.com',
          unlocks: 45,
          revenue: 340,
          grief_score: 75,
        },
        {
          id: '2',
          title: 'Lost Love Letter',
          creator: 'poet@example.com',
          unlocks: 38,
          revenue: 285,
          grief_score: 92,
        },
        {
          id: '3',
          title: 'Childhood Dreams',
          creator: 'dreamer@example.com',
          unlocks: 32,
          revenue: 240,
          grief_score: 58,
        },
      ],
      userTierDistribution: [
        { tier: 'SEEKER', count: 856, percentage: 68.7 },
        { tier: 'EXPLORER', count: 247, percentage: 19.8 },
        { tier: 'PIONEER', count: 89, percentage: 7.1 },
        { tier: 'GUARDIAN', count: 43, percentage: 3.4 },
        { tier: 'TITAN', count: 12, percentage: 1.0 },
      ],
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch admin statistics' });
  }
});

// User impersonation
router.post('/impersonate', consolidatedAuth, requireAdminAccess, async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // In a real implementation, you would:
    // 1. Verify the user exists
    // 2. Create an impersonation session
    // 3. Store the original admin user for restoration
    
    // For now, just return success
    res.json({
      success: true,
      message: `Impersonation started for ${email}`,
      impersonatedUser: email,
    });
  } catch (error) {
    console.error('Error starting impersonation:', error);
    res.status(500).json({ error: 'Failed to start impersonation' });
  }
});

// Stop impersonation
router.post('/stop-impersonate', consolidatedAuth, requireAdminAccess, async (req, res) => {
  try {
    // In a real implementation, restore the original admin session
    res.json({
      success: true,
      message: 'Impersonation stopped',
    });
  } catch (error) {
    console.error('Error stopping impersonation:', error);
    res.status(500).json({ error: 'Failed to stop impersonation' });
  }
});

export default router;