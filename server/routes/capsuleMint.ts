import { Router } from 'express';
import { requireCapsuleOwnership } from '../middleware/requireAdmin';
import { mintRateLimiter } from '../middleware/rateLimiter';
import { db } from '../db';
import { capsules } from '@shared/schema';
import { eq } from 'drizzle-orm';

// Type definitions for capsule minting
interface CapsuleMintLog {
  id: string;
  userId: string;
  capsuleId: string;
  status: 'pending' | 'success' | 'failed';
  txHash?: string;
  errorMessage?: string;
  createdAt: Date;
}

const router = Router();

// Apply mint rate limiting
router.use(mintRateLimiter);

// Secure capsule minting endpoint
router.post('/mint', requireCapsuleOwnership, async (req, res) => {
  try {
    const { user } = req;
    const { capsuleId, mediaUrl, contractAddress } = req.body;

    if (!capsuleId) {
      return res.status(400).json({ 
        error: 'Capsule ID is required',
        code: 'MISSING_CAPSULE_ID' 
      });
    }

    // Verify capsule exists and user owns it
    const [existingCapsule] = await db
      .select()
      .from(capsules)
      .where(eq(capsules.id, capsuleId));

    if (!existingCapsule) {
      return res.status(404).json({ 
        error: 'Capsule not found',
        code: 'CAPSULE_NOT_FOUND' 
      });
    }

    if (existingCapsule.author !== user!.id && existingCapsule.author !== user!.email) {
      return res.status(403).json({ 
        error: 'Unauthorized: You do not own this capsule',
        code: 'CAPSULE_OWNERSHIP_REQUIRED',
        capsuleId,
        owner: existingCapsule.author
      });
    }

    // Check if capsule is already minted
    if (existingCapsule.nftTokenId) {
      return res.status(409).json({ 
        error: 'Capsule already minted as NFT',
        code: 'ALREADY_MINTED',
        tokenId: existingCapsule.nftTokenId
      });
    }

    // Log mint attempt
    console.log(`🧬 Mint attempt for capsule ${capsuleId} by user ${user!.email}`);

    // Mock NFT minting logic (replace with actual blockchain integration)
    const mockTxHash = `0x${Math.random().toString(16).substring(2, 66)}`;
    const mockTokenId = Math.floor(Math.random() * 10000).toString();

    // Update capsule with NFT information
    const [updatedCapsule] = await db
      .update(capsules)
      .set({
        nftTokenId: mockTokenId,
        nftTxHash: mockTxHash,
        nftContractAddress: contractAddress || process.env.VITE_CAPSULE_NFT_CONTRACT,
        updatedAt: new Date()
      })
      .where(eq(capsules.id, capsuleId))
      .returning();

    // Log successful mint
    const mintLog: Partial<CapsuleMintLog> = {
      userId: user!.id,
      capsuleId,
      status: 'success',
      txHash: mockTxHash,
      createdAt: new Date()
    };

    console.log(`✅ Successfully minted capsule ${capsuleId} as NFT #${mockTokenId}`);

    res.status(200).json({
      success: true,
      message: 'Capsule successfully minted as NFT',
      capsule: updatedCapsule,
      nft: {
        tokenId: mockTokenId,
        txHash: mockTxHash,
        contractAddress: contractAddress || process.env.VITE_CAPSULE_NFT_CONTRACT
      },
      mintLog
    });

  } catch (error) {
    console.error('Capsule minting error:', error);
    
    // Log failed mint attempt
    const mintLog: Partial<CapsuleMintLog> = {
      userId: req.user?.id,
      capsuleId: req.body.capsuleId,
      status: 'failed',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      createdAt: new Date()
    };

    res.status(500).json({ 
      error: 'Failed to mint capsule as NFT',
      code: 'MINT_ERROR',
      details: error instanceof Error ? error.message : 'Unknown error',
      mintLog
    });
  }
});

// Get capsule mint status
router.get('/status/:capsuleId', requireCapsuleOwnership, async (req, res) => {
  try {
    const { capsuleId } = req.params;
    const { user } = req;

    const [capsule] = await db
      .select()
      .from(capsules)
      .where(eq(capsules.id, capsuleId));

    if (!capsule) {
      return res.status(404).json({ 
        error: 'Capsule not found',
        code: 'CAPSULE_NOT_FOUND' 
      });
    }

    if (capsule.author !== user!.id && capsule.author !== user!.email) {
      return res.status(403).json({ 
        error: 'Unauthorized access to capsule',
        code: 'CAPSULE_ACCESS_DENIED' 
      });
    }

    const mintStatus = {
      capsuleId,
      isMinted: !!capsule.nftTokenId,
      nft: capsule.nftTokenId ? {
        tokenId: capsule.nftTokenId,
        txHash: capsule.nftTxHash,
        contractAddress: capsule.nftContractAddress
      } : null,
      capsule: {
        title: capsule.title,
        author: capsule.author,
        createdAt: capsule.createdAt
      }
    };

    res.json(mintStatus);
  } catch (error) {
    console.error('Capsule mint status error:', error);
    res.status(500).json({ 
      error: 'Failed to get capsule mint status',
      code: 'MINT_STATUS_ERROR' 
    });
  }
});

export default router;