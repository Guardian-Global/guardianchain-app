// server/routes/api/capsules.ts
import { Router } from 'express';
import { consolidatedAuth } from '../../auth/authConsolidation';
import { storage } from '../../storage-minimal.js';

const router = Router();

// Get user's capsules
router.get('/user', consolidatedAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const capsules = await storage.getCapsulesByUser(userId);
    res.json(capsules);
  } catch (error) {
    console.error('Error fetching user capsules:', error);
    res.status(500).json({ error: 'Failed to fetch capsules' });
  }
});

// Create new capsule
router.post('/', consolidatedAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { title, description, content, visibility, grief_score, media_url } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const capsuleData = {
      user_id: userId,
      title,
      description,
      content,
      visibility: visibility || 'private',
      grief_score,
      media_url,
    };

    const newCapsule = await storage.createCapsule(capsuleData);
    res.status(201).json(newCapsule);
  } catch (error) {
    console.error('Error creating capsule:', error);
    res.status(500).json({ error: 'Failed to create capsule' });
  }
});

// Get specific capsule
router.get('/:id', consolidatedAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const capsule = await storage.getCapsule(id);

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

// Update capsule
router.patch('/:id', consolidatedAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const capsule = await storage.getCapsule(id);
    if (!capsule) {
      return res.status(404).json({ error: 'Capsule not found' });
    }

    if (capsule.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updates = req.body;
    const updatedCapsule = await storage.updateCapsule(id, updates);
    res.json(updatedCapsule);
  } catch (error) {
    console.error('Error updating capsule:', error);
    res.status(500).json({ error: 'Failed to update capsule' });
  }
});

// Delete capsule
router.delete('/:id', consolidatedAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const capsule = await storage.getCapsule(id);
    if (!capsule) {
      return res.status(404).json({ error: 'Capsule not found' });
    }

    if (capsule.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await storage.deleteCapsule(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting capsule:', error);
    res.status(500).json({ error: 'Failed to delete capsule' });
  }
});

// Mint capsule as NFT
router.post('/:id/mint', consolidatedAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { metadata } = req.body;

    const capsule = await storage.getCapsule(id);
    if (!capsule) {
      return res.status(404).json({ error: 'Capsule not found' });
    }

    if (capsule.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Simulate minting process
    const mockTxHash = `0x${Math.floor(Math.random() * 1e16).toString(16).padStart(64, '0')}`;
    const mockIpfsHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    const veritasId = `VC-${id.slice(0, 6).toUpperCase()}-${mockTxHash.slice(-4)}`;
    const ipfsUrl = `https://ipfs.io/ipfs/${mockIpfsHash}/${id}.json`;

    // Update capsule with mint information
    const mintedCapsule = await storage.updateCapsule(id, {
      minted: true,
      mint_transaction: mockTxHash,
      ipfs_hash: mockIpfsHash,
      veritas_id: veritasId,
    });

    res.json({
      success: true,
      txHash: mockTxHash,
      ipfsUrl,
      veritasId,
      contractAddress: '0x742d35Cc6634C0532925a3b8D47C0c34b3AA3f5E', // Mock contract
      capsule: mintedCapsule,
    });
  } catch (error) {
    console.error('Error minting capsule:', error);
    res.status(500).json({ error: 'Failed to mint capsule' });
  }
});

export default router;