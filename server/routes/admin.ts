import { Router } from 'express';
import { requireAdmin, requireSovereign } from '../middleware/requireAdmin';
import { adminRateLimiter } from '../middleware/rateLimiter';
import { db } from '../db';
import { users, capsules } from '@shared/schema';
import { eq, desc, count } from 'drizzle-orm';

const router = Router();

// Apply admin rate limiting to all admin routes
router.use(adminRateLimiter);

// Apply admin authentication to all routes
router.use(requireAdmin);

// Admin dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers] = await db.select({ count: count() }).from(users);
    const [totalCapsules] = await db.select({ count: count() }).from(capsules);
    
    const recentUsers = await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(10);

    const usersByTier = await db
      .select({
        tier: users.tier,
        count: count()
      })
      .from(users)
      .groupBy(users.tier);

    res.json({
      totalUsers: totalUsers.count,
      totalCapsules: totalCapsules.count,
      recentUsers,
      usersByTier,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch admin statistics',
      code: 'ADMIN_STATS_ERROR' 
    });
  }
});

// User management
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;

    const allUsers = await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    res.json({
      users: allUsers,
      page,
      limit,
      total: allUsers.length
    });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch users',
      code: 'ADMIN_USERS_ERROR' 
    });
  }
});

// Update user tier (admin only)
router.patch('/users/:userId/tier', async (req, res) => {
  try {
    const { userId } = req.params;
    const { tier } = req.body;

    const validTiers = ['EXPLORER', 'SEEKER', 'CREATOR', 'SOVEREIGN', 'ADMIN'];
    if (!validTiers.includes(tier)) {
      return res.status(400).json({ 
        error: 'Invalid tier specified',
        code: 'INVALID_TIER',
        validTiers 
      });
    }

    // Prevent non-sovereign users from creating admin accounts
    if (tier === 'ADMIN' && req.user?.tier !== 'SOVEREIGN') {
      return res.status(403).json({ 
        error: 'Only Sovereign users can create Admin accounts',
        code: 'SOVEREIGN_REQUIRED' 
      });
    }

    const [updatedUser] = await db
      .update(users)
      .set({ 
        tier, 
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) {
      return res.status(404).json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND' 
      });
    }

    console.log(`🔐 Admin ${req.user?.email} updated user ${updatedUser.email} tier to ${tier}`);
    
    res.json({
      success: true,
      user: updatedUser,
      message: `User tier updated to ${tier}`
    });
  } catch (error) {
    console.error('Update user tier error:', error);
    res.status(500).json({ 
      error: 'Failed to update user tier',
      code: 'UPDATE_TIER_ERROR' 
    });
  }
});

// System health check (sovereign only)
router.get('/system/health', requireSovereign, async (req, res) => {
  try {
    // Check database connectivity
    const [dbCheck] = await db.select({ count: count() }).from(users);
    
    // System metrics
    const systemHealth = {
      database: {
        status: 'healthy',
        totalUsers: dbCheck.count
      },
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        nodeVersion: process.version
      },
      timestamp: new Date().toISOString()
    };

    res.json(systemHealth);
  } catch (error) {
    console.error('System health check error:', error);
    res.status(500).json({ 
      error: 'System health check failed',
      code: 'HEALTH_CHECK_ERROR' 
    });
  }
});

// Admin logs (sovereign only)
router.get('/logs', requireSovereign, async (req, res) => {
  try {
    // This would typically integrate with a logging service
    // For now, return basic system information
    const logs = {
      recent_actions: [
        { action: 'User tier updated', timestamp: new Date().toISOString() },
        { action: 'Admin dashboard accessed', timestamp: new Date().toISOString() }
      ],
      system_status: 'operational',
      timestamp: new Date().toISOString()
    };

    res.json(logs);
  } catch (error) {
    console.error('Admin logs error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch admin logs',
      code: 'ADMIN_LOGS_ERROR' 
    });
  }
});

export default router;