// server/routes/multi-session.ts
// Multi-session tracking & forced logout

import express from 'express';
import { consolidatedAuth } from '../auth/authConsolidation';
import { storage } from '../storage';

const router = express.Router();

// Get all active sessions for current user
router.get('/sessions', consolidatedAuth, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const sessions = await storage.getUserSessions(userId);

    // Add additional session info
    const enhancedSessions = sessions.map((session: any) => ({
      ...session,
      isCurrent: session.sessionToken === req.cookies.guardian_session_token,
      timeRemaining: session.expiresAt ? Math.max(0, new Date(session.expiresAt).getTime() - Date.now()) : 0
    }));

    res.json(enhancedSessions);
  } catch (error) {
    console.error('Error fetching user sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Revoke a specific session
router.delete('/sessions/:sessionId', consolidatedAuth, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;

    // Verify the session belongs to the current user
    const session = await storage.getSessionById(sessionId);
    if (!session || session.userId !== userId) {
      return res.status(404).json({ error: 'Session not found' });
    }

    await storage.revokeSession(sessionId);

    console.log(`🔐 Session revoked: ${sessionId} for user: ${userId}`);

    res.json({ message: 'Session revoked successfully' });
  } catch (error) {
    console.error('Error revoking session:', error);
    res.status(500).json({ error: 'Failed to revoke session' });
  }
});

// Revoke all other sessions (keep current one)
router.post('/revoke-all-others', consolidatedAuth, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const currentToken = req.cookies.guardian_session_token;

    const revokedCount = await storage.revokeAllOtherSessions(userId, currentToken);

    console.log(`🔐 Revoked ${revokedCount} other sessions for user: ${userId}`);

    res.json({ message: `${revokedCount} sessions revoked`, revokedCount });
  } catch (error) {
    console.error('Error revoking other sessions:', error);
    res.status(500).json({ error: 'Failed to revoke sessions' });
  }
});

// Admin endpoint - force logout user
router.post('/admin/force-logout/:userId', async (req, res) => {
  try {
    // Check admin authorization
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { userId } = req.params;
    
    const revokedCount = await storage.revokeAllUserSessions(userId);

    console.log(`🔐 Admin forced logout for user: ${userId}, revoked ${revokedCount} sessions`);

    res.json({ message: 'User logged out successfully', revokedCount });
  } catch (error) {
    console.error('Error forcing logout:', error);
    res.status(500).json({ error: 'Failed to force logout' });
  }
});

// Get active session count
router.get('/session-count', consolidatedAuth, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const count = await storage.getUserSessionCount(userId);

    res.json({ sessionCount: count });
  } catch (error) {
    console.error('Error getting session count:', error);
    res.status(500).json({ error: 'Failed to get session count' });
  }
});

export { router as multiSessionRoutes };