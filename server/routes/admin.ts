import { Express } from 'express';
import { storage } from '../storage';
import { consolidatedAuth } from '../auth/authConsolidation';

export function registerAdminRoutes(app: Express) {
  // Admin sessions endpoint
  app.get('/api/admin/sessions', consolidatedAuth, async (req: any, res) => {
    try {
      // Check if user has admin privileges
      if (req.user?.tier !== 'ADMIN') {
        return res.status(403).json({ message: 'Admin privileges required' });
      }

      const sessionLogs = await storage.getSessionLogs();
      res.json(sessionLogs);
    } catch (error) {
      console.error('Error fetching session logs:', error);
      res.status(500).json({ message: 'Failed to fetch session logs' });
    }
  });

  // Create session log endpoint
  app.post('/api/admin/session-log', async (req, res) => {
    try {
      const sessionLog = await storage.createSessionLog(req.body);
      res.json(sessionLog);
    } catch (error) {
      console.error('Error creating session log:', error);
      res.status(500).json({ message: 'Failed to create session log' });
    }
  });

  // Update session log endpoint
  app.patch('/api/admin/session-log/:id', consolidatedAuth, async (req: any, res) => {
    try {
      // Check if user has admin privileges
      if (req.user?.tier !== 'ADMIN') {
        return res.status(403).json({ message: 'Admin privileges required' });
      }

      const { id } = req.params;
      const sessionLog = await storage.updateSessionLog(id, req.body);
      res.json(sessionLog);
    } catch (error) {
      console.error('Error updating session log:', error);
      res.status(500).json({ message: 'Failed to update session log' });
    }
  });
}