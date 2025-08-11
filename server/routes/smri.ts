import { Router } from 'express';
import { consolidatedAuth } from '../auth/authConsolidation';

const router = Router();

/**
 * Analyze capsule content to determine SMRI traits
 */
router.post('/analyze', consolidatedAuth, async (req: any, res) => {
  try {
    const { capsuleText } = req.body;

    if (!capsuleText) {
      return res.status(400).json({ error: 'Capsule text is required' });
    }

    console.log('🧠 Analyzing capsule for SMRI traits...');

    // AI-powered analysis of capsule content
    const traits = await analyzeCapsuleContent(capsuleText);

    console.log('✅ SMRI traits generated:', traits);

    res.json(traits);
  } catch (error) {
    console.error('❌ SMRI analysis failed:', error);
    res.status(500).json({
      error: 'Failed to analyze capsule for SMRI traits',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get SMRI badge metadata
 */
router.get('/badge/:tokenId', async (req, res) => {
  try {
    const { tokenId } = req.params;

    if (!tokenId) {
      return res.status(400).json({ error: 'Token ID is required' });
    }

    // In production, this would fetch from blockchain or database
    const mockBadgeData = {
      tokenId,
      name: `SMRI Badge #${tokenId}`,
      description: 'Subjective Memory Resonance Index Badge',
      image: `https://gateway.pinata.cloud/ipfs/QmSMRIBadge${tokenId}`,
      attributes: [
        { trait_type: 'Memory Type', value: 'emotional' },
        { trait_type: 'Grief Score', value: 'medium' },
        { trait_type: 'Trust Index', value: 85 },
        { trait_type: 'Profile Affinity', value: 'empathetic' }
      ]
    };

    console.log('📋 SMRI badge metadata requested:', tokenId);
    res.json(mockBadgeData);
  } catch (error) {
    console.error('❌ Failed to get SMRI badge metadata:', error);
    res.status(500).json({
      error: 'Failed to get badge metadata',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Analyze capsule content using AI to determine SMRI traits
 */
async function analyzeCapsuleContent(capsuleText: string): Promise<any> {
  // Analyze emotional content
  const emotionKeywords = {
    visual: ['see', 'picture', 'image', 'color', 'bright', 'dark', 'visual'],
    auditory: ['hear', 'sound', 'music', 'voice', 'loud', 'quiet', 'listen'],
    kinesthetic: ['feel', 'touch', 'warm', 'cold', 'soft', 'rough', 'move'],
    emotional: ['love', 'hate', 'happy', 'sad', 'angry', 'fear', 'joy'],
    cognitive: ['think', 'remember', 'analyze', 'understand', 'learn', 'know']
  };

  const griefKeywords = {
    low: ['happy', 'joy', 'celebration', 'success', 'achievement'],
    medium: ['miss', 'lost', 'gone', 'change', 'different'],
    high: ['death', 'died', 'funeral', 'grief', 'mourning', 'devastated'],
    transcendent: ['eternal', 'forever', 'transcend', 'beyond', 'infinite']
  };

  const affinityKeywords = {
    curious: ['wonder', 'question', 'explore', 'discover', 'why', 'how'],
    empathetic: ['understand', 'feel', 'compassion', 'care', 'help'],
    analytical: ['analyze', 'data', 'logic', 'reason', 'calculate'],
    protective: ['protect', 'guard', 'safe', 'secure', 'defend'],
    visionary: ['future', 'dream', 'vision', 'possibility', 'imagine']
  };

  const lowerText = capsuleText.toLowerCase();
  
  // Determine memory type
  let memoryType = 'emotional';
  let maxScore = 0;
  for (const [type, keywords] of Object.entries(emotionKeywords)) {
    const score = keywords.filter(keyword => lowerText.includes(keyword)).length;
    if (score > maxScore) {
      maxScore = score;
      memoryType = type as any;
    }
  }

  // Determine grief score
  let griefScore = 'medium';
  maxScore = 0;
  for (const [level, keywords] of Object.entries(griefKeywords)) {
    const score = keywords.filter(keyword => lowerText.includes(keyword)).length;
    if (score > maxScore) {
      maxScore = score;
      griefScore = level as any;
    }
  }

  // Determine profile affinity
  let profileAffinity = 'empathetic';
  maxScore = 0;
  for (const [affinity, keywords] of Object.entries(affinityKeywords)) {
    const score = keywords.filter(keyword => lowerText.includes(keyword)).length;
    if (score > maxScore) {
      maxScore = score;
      profileAffinity = affinity as any;
    }
  }

  // Calculate trust index based on content quality
  const trustIndex = Math.min(100, Math.max(50, 
    capsuleText.length * 0.1 + 
    (capsuleText.match(/[.!?]/g) || []).length * 5 +
    (lowerText.includes('truth') ? 10 : 0) +
    (lowerText.includes('honest') ? 10 : 0)
  )).toString();

  // Determine resonance frequency based on content energy
  const resonanceFrequency = 
    griefScore === 'high' ? 'delta' :
    griefScore === 'transcendent' ? 'gamma' :
    memoryType === 'cognitive' ? 'beta' :
    memoryType === 'emotional' ? 'theta' : 'alpha';

  // Determine temporal anchor
  const temporalAnchor = 
    lowerText.includes('will') || lowerText.includes('future') ? 'future' :
    lowerText.includes('was') || lowerText.includes('past') ? 'past' :
    lowerText.includes('eternal') || lowerText.includes('forever') ? 'eternal' : 'present';

  return {
    memoryType,
    griefScore,
    trustIndex,
    profileAffinity,
    resonanceFrequency,
    temporalAnchor
  };
}

export default router;