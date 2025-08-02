import { Router } from 'express';
import { CapsuleService } from '../services/CapsuleService';
import { CapsuleCreationRequest, CapsuleSearchFilters } from '@shared/types/capsule';
import { isDebugAuthenticated } from '../debugAuth';

const router = Router();

/**
 * POST /api/capsules
 * Creates a new truth capsule
 */
router.post('/', isDebugAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    const creationRequest: CapsuleCreationRequest = {
      ...req.body,
      authorWalletAddress: req.body.authorWalletAddress || `0x${userId.substring(0, 40).padEnd(40, '0')}`
    };

    // Validate required fields
    const requiredFields = ['title', 'description', 'content', 'category'];
    for (const field of requiredFields) {
      if (!creationRequest[field as keyof CapsuleCreationRequest]) {
        return res.status(400).json({ error: `Field '${field}' is required` });
      }
    }

    const capsule = await CapsuleService.createCapsule(creationRequest);
    
    res.status(201).json({
      success: true,
      data: capsule,
      message: 'Truth capsule created successfully'
    });
  } catch (error: any) {
    console.error('Capsule creation error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create capsule',
      details: error.message 
    });
  }
});

/**
 * GET /api/capsules
 * Searches and retrieves capsules with filters
 */
router.get('/', async (req, res) => {
  try {
    const filters: CapsuleSearchFilters = {
      category: req.query.category as string,
      verificationStatus: req.query.verificationStatus as any || 'all',
      griefScoreRange: req.query.griefScoreMin && req.query.griefScoreMax 
        ? [Number(req.query.griefScoreMin), Number(req.query.griefScoreMax)]
        : undefined,
      dateRange: req.query.startDate && req.query.endDate
        ? { start: req.query.startDate as string, end: req.query.endDate as string }
        : undefined,
      author: req.query.author as string,
      location: req.query.location as string,
      tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
      minYieldAmount: req.query.minYieldAmount ? Number(req.query.minYieldAmount) : undefined,
      sortBy: (req.query.sortBy as any) || 'recent',
      sortOrder: (req.query.sortOrder as any) || 'desc',
      limit: Number(req.query.limit) || 20,
      offset: Number(req.query.offset) || 0
    };

    const capsules = await CapsuleService.searchCapsules(filters);
    const metrics = await CapsuleService.getCapsuleMetrics();
    
    res.json({
      success: true,
      data: capsules,
      pagination: {
        total: metrics.totalCapsules,
        page: Math.floor(filters.offset / filters.limit) + 1,
        limit: filters.limit,
        hasNext: filters.offset + filters.limit < metrics.totalCapsules,
        hasPrev: filters.offset > 0
      },
      filters,
      metrics
    });
  } catch (error: any) {
    console.error('Capsule search error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to search capsules',
      details: error.message 
    });
  }
});

/**
 * GET /api/capsules/explore
 * Public endpoint for capsule exploration
 */
router.get('/explore', async (req, res) => {
  try {
    // Mock data for demonstration - in production this would query the database
    const mockCapsules = [
      {
        capsuleId: 'caps_001',
        veritasId: 'VC-CAPSULE-001',
        title: 'My Grandmother\'s War Stories',
        description: 'Preserving the untold stories of courage during WWII',
        author: '0x1234...5678',
        category: 'family-legacy',
        griefScore: 85,
        verificationStatus: 'verified',
        createdAt: '2024-12-15T10:30:00Z',
        viewCount: 247,
        sealedAt: '2024-12-15T10:30:00Z',
        yieldAmount: '156.75',
        validatorWitness: ['0xvalidator1', '0xvalidator2'],
        metadataUri: 'ipfs://QmExample1',
        proofHash: '0xabcd1234',
        minted: true,
        claimable: true
      },
      {
        capsuleId: 'caps_002',
        veritasId: 'VC-CAPSULE-002',
        title: 'Environmental Data Coverup Evidence',
        description: 'Documentation of industrial pollution concealment',
        author: '0x5678...9012',
        category: 'environmental',
        griefScore: 92,
        verificationStatus: 'pending',
        createdAt: '2024-12-14T15:45:00Z',
        viewCount: 89,
        sealedAt: '2024-12-14T15:45:00Z',
        yieldAmount: '234.50',
        validatorWitness: ['0xvalidator3'],
        metadataUri: 'ipfs://QmExample2',
        proofHash: '0xefgh5678',
        minted: false,
        claimable: false
      },
      {
        capsuleId: 'caps_003',
        veritasId: 'VC-CAPSULE-003',
        title: 'Community Garden Victory',
        description: 'How our neighborhood saved the local green space',
        author: '0x9012...3456',
        category: 'community-story',
        griefScore: 64,
        verificationStatus: 'verified',
        createdAt: '2024-12-13T09:20:00Z',
        viewCount: 156,
        sealedAt: '2024-12-13T09:20:00Z',
        yieldAmount: '98.25',
        validatorWitness: ['0xvalidator1', '0xvalidator4'],
        metadataUri: 'ipfs://QmExample3',
        proofHash: '0xijkl9012',
        minted: true,
        claimable: true
      }
    ];

    res.json(mockCapsules);
  } catch (error: any) {
    console.error('Capsule exploration error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to load explorer data',
      details: error.message 
    });
  }
});

/**
 * GET /api/capsules/:id
 * Retrieves a specific capsule by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const capsuleId = req.params.id;
    
    // Mock single capsule data
    const mockCapsule = {
      capsuleId,
      veritasId: `VC-CAPSULE-${capsuleId.toUpperCase()}`,
      title: 'Sample Truth Capsule',
      description: 'A detailed truth preservation capsule',
      author: '0x1234567890123456789012345678901234567890',
      category: 'personal-memory',
      griefScore: 78,
      verificationStatus: 'verified',
      createdAt: new Date().toISOString(),
      viewCount: 42,
      sealedAt: new Date().toISOString(),
      yieldAmount: '125.50',
      validatorWitness: ['0xvalidator1', '0xvalidator2'],
      metadataUri: `ipfs://QmExample${capsuleId}`,
      proofHash: `0x${capsuleId.padEnd(64, '0')}`,
      minted: true,
      claimable: true,
      tags: ['memory', 'truth', 'preservation'],
      privacyLevel: 'public',
      mediaAttachments: []
    };
    
    res.json({
      success: true,
      data: mockCapsule
    });
  } catch (error: any) {
    console.error('Capsule retrieval error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve capsule',
      details: error.message 
    });
  }
});

/**
 * POST /api/capsules/:id/validate
 * Validates a capsule (validators only)
 */
router.post('/:id/validate', isDebugAuthenticated, async (req: any, res) => {
  try {
    const capsuleId = req.params.id;
    const userId = req.user?.claims?.sub;
    const validatorAddress = `0x${userId.substring(0, 40).padEnd(40, '0')}`;
    
    const { validationLevel, validationNotes } = req.body;
    
    if (!validationLevel || validationLevel < 1 || validationLevel > 3) {
      return res.status(400).json({ error: 'Valid validation level (1-3) required' });
    }
    
    const validation = await CapsuleService.validateCapsule(
      capsuleId,
      validatorAddress,
      validationLevel,
      validationNotes
    );
    
    res.json({
      success: true,
      data: validation,
      message: 'Capsule validation recorded'
    });
  } catch (error: any) {
    console.error('Capsule validation error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to validate capsule',
      details: error.message 
    });
  }
});

/**
 * POST /api/capsules/:id/vote
 * Records jury vote for capsule validation  
 */
router.post('/:id/vote', isDebugAuthenticated, async (req: any, res) => {
  try {
    const capsuleId = req.params.id;
    const userId = req.user?.claims?.sub;
    const { vote } = req.body; // 'yes', 'no', or 'abstain'
    
    if (!['yes', 'no', 'abstain'].includes(vote)) {
      return res.status(400).json({ error: 'Vote must be yes, no, or abstain' });
    }
    
    // Mock vote recording
    const voteRecord = {
      capsuleId,
      voter: userId,
      vote,
      votedAt: new Date().toISOString(),
      consensusWeight: 1.0
    };
    
    res.json({
      success: true,
      data: voteRecord,
      message: 'Jury vote recorded successfully'
    });
  } catch (error: any) {
    console.error('Vote recording error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to record vote',
      details: error.message 
    });
  }
});

/**
 * GET /api/capsules/:id/votes
 * Gets current voting status for a capsule
 */
router.get('/:id/votes', async (req, res) => {
  try {
    const capsuleId = req.params.id;
    
    // Mock voting data
    const votingStatus = {
      capsuleId,
      votes: {
        yes: 3,
        no: 1,
        abstain: 0
      },
      totalVoters: 4,
      requiredConsensus: 3,
      consensusReached: true,
      consensusResult: 'verified',
      votingDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
    };
    
    res.json({
      success: true,
      data: votingStatus
    });
  } catch (error: any) {
    console.error('Vote status error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get voting status',
      details: error.message 
    });
  }
});

/**
 * POST /api/capsules/:id/claim-yield
 * Claims yield for a capsule
 */
router.post('/:id/claim-yield', isDebugAuthenticated, async (req: any, res) => {
  try {
    const capsuleId = req.params.id;
    const userId = req.user?.claims?.sub;
    const claimerAddress = `0x${userId.substring(0, 40).padEnd(40, '0')}`;
    
    const yieldClaim = await CapsuleService.claimYield(capsuleId, claimerAddress);
    
    res.json({
      success: true,
      data: yieldClaim,
      message: 'Yield claim initiated'
    });
  } catch (error: any) {
    console.error('Yield claim error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to claim yield',
      details: error.message 
    });
  }
});

export default router;