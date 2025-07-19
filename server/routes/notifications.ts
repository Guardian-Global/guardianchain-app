import type { Express } from "express";
import { simpleAuth } from "../middleware/auth";
import { 
  getUserPreferences, 
  updateUserPreferences, 
  setUserEmail,
  sendPreferencesUpdateConfirmation 
} from "../notifications/userPreferences";
import { sendDigest, sendMonthlyReport } from "../notifications/sendWeeklyDigest";
import { notifyMemorySaved } from "../notifications/notifyMemorySave";
import { notifyCapsuleRemix, notifyCapsuleSealed, notifyCapsuleReplayed } from "../notifications/triggerCapsuleEvent";
import { notifyLegacySetup, notifyLegacyExpiration } from "../notifications/notifyLegacyTrigger";
import { sendDAOVoteReceipt, notifyProposalUpdate } from "../notifications/notifyDAOVote";
import { notifyAdminOnCritical, notifyAdminUserAction, notifyAdminSystemHealth } from "../notifications/notifyAdmin";
import { notifyOptOut, notifyOptIn } from "../notifications/notifyOptOut";
import { setUserEmailPreference } from "../lib/mailer";

export function registerNotificationRoutes(app: Express) {
  // Get user notification preferences
  app.get('/api/notifications/preferences', simpleAuth, (req, res) => {
    const userId = (req as any).user.id;
    const preferences = getUserPreferences(userId);
    
    if (!preferences) {
      return res.json({
        userId,
        email: '',
        preferences: {
          capsuleEvents: true,
          memoryUpdates: true,
          legacyProtocol: true,
          daoGovernance: true,
          weeklyDigest: true,
          monthlyReport: true,
          securityAlerts: true,
          yieldUpdates: true,
        }
      });
    }
    
    res.json(preferences);
  });

  // Update user notification preferences
  app.put('/api/notifications/preferences', simpleAuth, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const { email, preferences } = req.body;
      
      if (email) {
        setUserEmail(userId, email);
      }
      
      if (preferences) {
        updateUserPreferences(userId, preferences);
      }
      
      await sendPreferencesUpdateConfirmation(userId);
      
      res.json({ success: true, message: 'Preferences updated successfully' });
    } catch (error) {
      console.error('Error updating preferences:', error);
      res.status(500).json({ error: 'Failed to update preferences' });
    }
  });

  // Trigger memory save notification
  app.post('/api/notifications/memory-saved', simpleAuth, async (req, res) => {
    try {
      const { message, reply, threadId } = req.body;
      const user = (req as any).user;
      
      await notifyMemorySaved({
        user: { email: req.body.email || 'user@example.com' },
        message,
        reply,
        threadId
      });
      
      res.json({ success: true, message: 'Memory save notification sent' });
    } catch (error) {
      console.error('Error sending memory notification:', error);
      res.status(500).json({ error: 'Failed to send notification' });
    }
  });

  // Trigger capsule event notifications
  app.post('/api/notifications/capsule-event', simpleAuth, async (req, res) => {
    try {
      const { eventType, capsuleId, remixerName, viewerCount } = req.body;
      const user = { email: req.body.email || 'user@example.com' };
      
      switch (eventType) {
        case 'remix':
          await notifyCapsuleRemix({ user, capsuleId, remixerName });
          break;
        case 'sealed':
          await notifyCapsuleSealed({ user, capsuleId });
          break;
        case 'replayed':
          await notifyCapsuleReplayed({ user, capsuleId, viewerCount });
          break;
        default:
          return res.status(400).json({ error: 'Invalid event type' });
      }
      
      res.json({ success: true, message: `${eventType} notification sent` });
    } catch (error) {
      console.error('Error sending capsule notification:', error);
      res.status(500).json({ error: 'Failed to send notification' });
    }
  });

  // Trigger legacy protocol notifications
  app.post('/api/notifications/legacy', simpleAuth, async (req, res) => {
    try {
      const { eventType, delegate, expirationDate } = req.body;
      const user = { email: req.body.email || 'user@example.com' };
      
      switch (eventType) {
        case 'setup':
          await notifyLegacySetup({ user, delegate });
          break;
        case 'expiration':
          await notifyLegacyExpiration({ user, expirationDate });
          break;
        default:
          return res.status(400).json({ error: 'Invalid legacy event type' });
      }
      
      res.json({ success: true, message: `Legacy ${eventType} notification sent` });
    } catch (error) {
      console.error('Error sending legacy notification:', error);
      res.status(500).json({ error: 'Failed to send notification' });
    }
  });

  // Trigger DAO vote notifications
  app.post('/api/notifications/dao-vote', simpleAuth, async (req, res) => {
    try {
      const { eventType, proposalId, voteChoice, votingPower, status, result } = req.body;
      const user = { email: req.body.email || 'user@example.com' };
      
      switch (eventType) {
        case 'receipt':
          await sendDAOVoteReceipt({ user, proposalId, voteChoice, votingPower });
          break;
        case 'update':
          await notifyProposalUpdate({ user, proposalId, status, result });
          break;
        default:
          return res.status(400).json({ error: 'Invalid DAO event type' });
      }
      
      res.json({ success: true, message: `DAO ${eventType} notification sent` });
    } catch (error) {
      console.error('Error sending DAO notification:', error);
      res.status(500).json({ error: 'Failed to send notification' });
    }
  });

  // Send weekly digest
  app.post('/api/notifications/weekly-digest', simpleAuth, async (req, res) => {
    try {
      const userData = {
        email: req.body.email || 'user@example.com',
        name: req.body.name || 'Guardian',
        weeklyYield: req.body.weeklyYield || 45.7,
        sealedCount: req.body.sealedCount || 3,
        remixedCount: req.body.remixedCount || 7,
        viewCount: req.body.viewCount || 156,
        topCapsule: req.body.topCapsule || 'Truth Capsule #1247',
        engagementRate: req.body.engagementRate || '23.4%',
        portfolioGrowth: req.body.portfolioGrowth || '12.8%'
      };
      
      await sendDigest(userData);
      res.json({ success: true, message: 'Weekly digest sent' });
    } catch (error) {
      console.error('Error sending weekly digest:', error);
      res.status(500).json({ error: 'Failed to send digest' });
    }
  });

  // Send monthly report
  app.post('/api/notifications/monthly-report', simpleAuth, async (req, res) => {
    try {
      const userData = {
        email: req.body.email || 'user@example.com',
        name: req.body.name || 'Guardian',
        monthlyGTT: req.body.monthlyGTT || 234.5,
        monthlyCapsules: req.body.monthlyCapsules || 12,
        monthlyAI: req.body.monthlyAI || 47,
        communityRank: req.body.communityRank || 156
      };
      
      await sendMonthlyReport(userData);
      res.json({ success: true, message: 'Monthly report sent' });
    } catch (error) {
      console.error('Error sending monthly report:', error);
      res.status(500).json({ error: 'Failed to send report' });
    }
  });

  // Update email preferences (with opt-out/opt-in notifications)
  app.post('/api/notifications/preferences/toggle', simpleAuth, async (req, res) => {
    try {
      const { email, enabled } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email address required' });
      }

      await setUserEmailPreference(email, enabled);
      
      const user = { email };
      if (enabled) {
        await notifyOptIn({ user });
      } else {
        await notifyOptOut({ user });
      }
      
      res.json({ success: true, message: `Email notifications ${enabled ? 'enabled' : 'disabled'}` });
    } catch (error) {
      console.error('Error toggling preferences:', error);
      res.status(500).json({ error: 'Failed to update preferences' });
    }
  });

  // Admin notification endpoints
  app.post('/api/notifications/admin/critical', simpleAuth, async (req, res) => {
    try {
      const { message } = req.body;
      await notifyAdminOnCritical(message);
      res.json({ success: true, message: 'Critical alert sent to admin' });
    } catch (error) {
      console.error('Error sending admin alert:', error);
      res.status(500).json({ error: 'Failed to send admin alert' });
    }
  });

  app.post('/api/notifications/admin/user-action', simpleAuth, async (req, res) => {
    try {
      const { action, userId, details } = req.body;
      await notifyAdminUserAction({ action, userId, details });
      res.json({ success: true, message: 'User action notification sent' });
    } catch (error) {
      console.error('Error sending user action notification:', error);
      res.status(500).json({ error: 'Failed to send notification' });
    }
  });

  app.post('/api/notifications/admin/system-health', simpleAuth, async (req, res) => {
    try {
      const healthData = req.body;
      await notifyAdminSystemHealth(healthData);
      res.json({ success: true, message: 'System health report sent' });
    } catch (error) {
      console.error('Error sending system health report:', error);
      res.status(500).json({ error: 'Failed to send report' });
    }
  });

  // Test email functionality with founder CC
  app.post('/api/notifications/test', simpleAuth, async (req, res) => {
    try {
      const { email, testType } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email address required' });
      }

      const testUser = { email, name: 'Test User' };
      
      let result;
      switch (testType) {
        case 'memory':
          result = await notifyMemorySaved({
            user: testUser,
            message: 'Test prompt for GUARDIANCHAIN AI',
            reply: 'This is a test response from your Sovereign AI assistant.',
            threadId: 'test-thread-123'
          });
          break;
        case 'capsule':
          result = await notifyCapsuleSealed({ user: testUser, capsuleId: 'TEST-001' });
          break;
        case 'digest':
          result = await sendDigest({
            ...testUser,
            weeklyYield: 25.5,
            sealedCount: 2,
            remixedCount: 4,
            viewCount: 89,
            topCapsule: 'Test Capsule #001',
            engagementRate: '18.7%',
            portfolioGrowth: '8.3%'
          });
          break;
        default:
          return res.status(400).json({ error: 'Invalid test type' });
      }
      
      const isConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
      
      res.json({ 
        success: true, 
        message: `Test ${testType} email ${isConfigured ? 'sent' : 'simulated'} to ${email}`,
        smtpConfigured: isConfigured,
        note: isConfigured ? 'Email sent via ProtonMail SMTP with founder@guardianchain.org CC backup' : 'Email simulated - configure ProtonMail SMTP to enable sending',
        founderBackup: 'All emails automatically CC founder@guardianchain.org for backup'
      });
    } catch (error) {
      console.error('Error sending test email:', error);
      const isConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
      
      res.json({ 
        success: false, 
        error: 'Email system ready but needs configuration',
        details: isConfigured ? error.message : 'ProtonMail SMTP credentials required',
        smtpConfigured: isConfigured,
        requiredSecrets: ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS']
      });
    }
  });

  // Test founder email specifically
  app.post('/api/notifications/test-founder', simpleAuth, async (req, res) => {
    try {
      const { testType = 'digest' } = req.body;
      
      const founderUser = { email: 'founder@guardianchain.org', name: 'GUARDIANCHAIN Founder' };
      
      let result;
      switch (testType) {
        case 'memory':
          result = await notifyMemorySaved({
            user: founderUser,
            message: 'Founder test prompt for GUARDIANCHAIN AI',
            reply: 'This is a test response for the founder showing AI memory system functionality.',
            threadId: 'founder-test-thread-456'
          });
          break;
        case 'capsule':
          result = await notifyCapsuleSealed({ user: founderUser, capsuleId: 'FOUNDER-TEST-001' });
          break;
        case 'digest':
          result = await sendDigest({
            ...founderUser,
            weeklyYield: 125.5,
            sealedCount: 12,
            remixedCount: 24,
            viewCount: 589,
            topCapsule: 'Founder Test Capsule #001',
            engagementRate: '87.3%',
            portfolioGrowth: '23.7%'
          });
          break;
        default:
          return res.status(400).json({ error: 'Invalid test type' });
      }
      
      res.json({ 
        success: true, 
        message: `Founder test ${testType} email sent to founder@guardianchain.org`,
        note: 'Direct founder email test - no CC needed'
      });
    } catch (error) {
      console.error('Error sending founder test email:', error);
      res.status(500).json({ 
        error: 'Failed to send founder test email',
        details: error.message
      });
    }
  });
}