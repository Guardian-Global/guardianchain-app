// server/routes/capsule/[id].ts
import { Router } from 'express';
import { consolidatedAuth } from '../../auth/authConsolidation';
import { storage } from '../../storage-minimal';

const router = Router();

// Get specific capsule by ID (handles dynamic routing)
router.get('/', consolidatedAuth, async (req, res) => {
  try {
    const capsuleId = req.params.id;
    const capsule = await storage.getCapsule(capsuleId);

    if (!capsule) {
      return res.status(404).json({ error: 'Capsule not found' });
    }

    // Check if user has access to this capsule
    const userId = req.user?.id;
    if (capsule.user_id !== userId && capsule.visibility === 'private') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(capsule);
  } catch (error) {
    console.error('Error fetching capsule:', error);
    res.status(500).json({ error: 'Failed to fetch capsule' });
  }
});

export default router;