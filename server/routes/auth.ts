import { Express } from 'express';
import crypto from 'crypto';
import { storage } from '../storage';
import { consolidatedAuth } from '../auth/authConsolidation';

export function registerAuthRoutes(app: Express) {
  // Password reset request
  app.post('/api/auth/request-reset', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal whether email exists for security
        return res.json({ message: 'If an account with that email exists, a reset link has been sent' });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

      await storage.setResetToken(user.id, resetToken, expiresAt);

      // In a real app, you would send an email here
      // For development, just log the token
      console.log(`Password reset token for ${email}: ${resetToken}`);
      console.log(`Reset URL: http://localhost:5000/auth/reset-password?token=${resetToken}`);

      res.json({ message: 'If an account with that email exists, a reset link has been sent' });
    } catch (error) {
      console.error('Password reset request error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Get user's active sessions
  app.get('/api/auth/sessions', consolidatedAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const sessions = await storage.getUserActiveSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Terminate a specific session
  app.delete('/api/auth/sessions/:sessionId', consolidatedAuth, async (req: any, res) => {
    try {
      const { sessionId } = req.params;
      const userId = req.user.id;
      
      // Verify the session belongs to the user
      const sessions = await storage.getUserActiveSessions(userId);
      const sessionExists = sessions.some(session => session.id === sessionId);
      
      if (!sessionExists) {
        return res.status(404).json({ message: 'Session not found' });
      }

      await storage.terminateSession(sessionId);
      res.json({ message: 'Session terminated successfully' });
    } catch (error) {
      console.error('Error terminating session:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Get user's login history
  app.get('/api/auth/login-history', consolidatedAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Mock data for now - in production you'd implement proper login tracking
      const mockHistory = [
        {
          id: '1',
          ipAddress: '192.168.1.1',
          city: 'New York',
          region: 'NY',
          country: 'US',
          device: 'Chrome on Windows',
          success: true,
          loginTime: new Date().toISOString()
        },
        {
          id: '2',
          ipAddress: '10.0.0.1',
          city: 'San Francisco',
          region: 'CA',
          country: 'US',
          device: 'Safari on Mac',
          success: true,
          loginTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      res.json(mockHistory);
    } catch (error) {
      console.error('Error fetching login history:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
}