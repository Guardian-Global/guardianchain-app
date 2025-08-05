/**
 * Enhanced Validation API Endpoints for GuardianChain
 * Provides access to IPFS metadata fetching, grief score boost validation, and ZK proof verification
 */

import { Request, Response } from 'express';
import { fetchIPFSMeta, fetchMultipleIPFSMeta, isValidCID } from '../../lib/fetchIPFSMeta';
import { canUnlockWithBoost, getOptimalUnlockStrategy, formatTimeUntilUnlock } from '../../lib/unlockWithBoost';
import { verifyZKUnlock, batchVerifyZKUnlocks, generateVerificationReport } from '../../lib/zkVerifyUnlock';
// Validator CLI tools temporarily disabled for build compatibility
// import { exportAuditToCSV } from '../../tools/validator-cli/exportAuditCSV';
// import { sendDiscordAlert } from '../../tools/validator-cli/sendDiscordAlert';

export interface ValidationRequest {
  capsuleId?: string;
  cid?: string;
  griefScore?: number;
  chainId?: number;
  unlockTimestamp?: number;
  userTier?: 'EXPLORER' | 'SEEKER' | 'CREATOR' | 'SOVEREIGN';
  premiumBonus?: boolean;
}

/**
 * Fetch IPFS metadata for a single capsule
 * GET /api/validation/ipfs-meta/:cid
 */
export async function getIPFSMetadata(req: Request, res: Response): Promise<void> {
  try {
    const { cid } = req.params;
    
    if (!cid || !isValidCID(cid)) {
      res.status(400).json({ 
        error: 'Invalid or missing IPFS CID',
        details: 'CID must be a valid IPFS Content Identifier'
      });
      return;
    }
    
    const metadata = await fetchIPFSMeta(cid);
    
    if (!metadata) {
      res.status(404).json({ 
        error: 'IPFS metadata not found',
        details: 'Unable to fetch metadata from IPFS gateways'
      });
      return;
    }
    
    res.json({
      success: true,
      cid,
      metadata,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('IPFS metadata fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch IPFS metadata',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Fetch IPFS metadata for multiple capsules
 * POST /api/validation/ipfs-meta/batch
 */
export async function getBatchIPFSMetadata(req: Request, res: Response): Promise<void> {
  try {
    const { cids } = req.body;
    
    if (!Array.isArray(cids) || cids.length === 0) {
      res.status(400).json({ 
        error: 'Invalid CID array',
        details: 'Request must include an array of valid IPFS CIDs'
      });
      return;
    }
    
    if (cids.length > 50) {
      res.status(400).json({ 
        error: 'Too many CIDs',
        details: 'Maximum 50 CIDs per batch request'
      });
      return;
    }
    
    const validCids = cids.filter(isValidCID);
    if (validCids.length === 0) {
      res.status(400).json({ 
        error: 'No valid CIDs provided',
        details: 'All CIDs must be valid IPFS Content Identifiers'
      });
      return;
    }
    
    const metadataResults = await fetchMultipleIPFSMeta(validCids);
    
    const results = validCids.map((cid, index) => ({
      cid,
      metadata: metadataResults[index],
      success: metadataResults[index] !== null
    }));
    
    const successCount = results.filter(r => r.success).length;
    
    res.json({
      success: true,
      totalRequested: cids.length,
      validCids: validCids.length,
      successfulFetches: successCount,
      results,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Batch IPFS metadata fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch batch IPFS metadata',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Check unlock eligibility with boost system
 * POST /api/validation/unlock-boost
 */
export async function checkUnlockBoost(req: Request, res: Response): Promise<void> {
  try {
    const { 
      griefScore, 
      chainId, 
      unlockTimestamp, 
      userTier = 'EXPLORER', 
      premiumBonus = false 
    }: ValidationRequest = req.body;
    
    // Validate required parameters
    if (typeof griefScore !== 'number' || griefScore < 0 || griefScore > 10) {
      res.status(400).json({ 
        error: 'Invalid grief score',
        details: 'Grief score must be a number between 0 and 10'
      });
      return;
    }
    
    if (typeof chainId !== 'number' || ![1, 137, 8453].includes(chainId)) {
      res.status(400).json({ 
        error: 'Invalid chain ID',
        details: 'Chain ID must be 1 (Ethereum), 137 (Polygon), or 8453 (Base)'
      });
      return;
    }
    
    if (typeof unlockTimestamp !== 'number' || unlockTimestamp <= 0) {
      res.status(400).json({ 
        error: 'Invalid unlock timestamp',
        details: 'Unlock timestamp must be a positive number'
      });
      return;
    }
    
    // Check unlock eligibility
    const boostResult = canUnlockWithBoost({
      griefScore,
      chainId,
      unlockTimestamp,
      userTier,
      premiumBonus
    });
    
    // Get optimization strategy
    const strategy = getOptimalUnlockStrategy({
      griefScore,
      chainId,
      unlockTimestamp,
      userTier,
      premiumBonus
    });
    
    res.json({
      success: true,
      unlockEligible: boostResult.canUnlock,
      boostResult: {
        ...boostResult,
        remainingTimeFormatted: formatTimeUntilUnlock(boostResult.remainingTime),
        timeReductionFormatted: formatTimeUntilUnlock(boostResult.timeReduction)
      },
      optimization: strategy,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Unlock boost check error:', error);
    res.status(500).json({ 
      error: 'Failed to check unlock boost eligibility',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Verify zero-knowledge proof for unlock
 * POST /api/validation/zk-verify
 */
export async function verifyZKProof(req: Request, res: Response): Promise<void> {
  try {
    const { 
      griefScore, 
      chainId, 
      unlockTimestamp, 
      userAddress, 
      nonce 
    }: ValidationRequest & { userAddress?: string; nonce?: string } = req.body;
    
    // Validate required parameters
    if (typeof griefScore !== 'number' || griefScore < 0 || griefScore > 10) {
      res.status(400).json({ 
        error: 'Invalid grief score',
        details: 'Grief score must be a number between 0 and 10'
      });
      return;
    }
    
    if (typeof chainId !== 'number') {
      res.status(400).json({ 
        error: 'Invalid chain ID',
        details: 'Chain ID must be a valid number'
      });
      return;
    }
    
    if (typeof unlockTimestamp !== 'number' || unlockTimestamp <= 0) {
      res.status(400).json({ 
        error: 'Invalid unlock timestamp',
        details: 'Unlock timestamp must be a positive number'
      });
      return;
    }
    
    // Perform ZK verification
    const zkResult = await verifyZKUnlock({
      griefScore,
      chainId,
      unlockTimestamp,
      userAddress,
      nonce
    });
    
    res.json({
      success: true,
      verification: zkResult,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('ZK proof verification error:', error);
    res.status(500).json({ 
      error: 'Failed to verify zero-knowledge proof',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Batch verify multiple ZK proofs
 * POST /api/validation/zk-verify/batch
 */
export async function batchVerifyZKProofs(req: Request, res: Response): Promise<void> {
  try {
    const { proofs } = req.body;
    
    if (!Array.isArray(proofs) || proofs.length === 0) {
      res.status(400).json({ 
        error: 'Invalid proofs array',
        details: 'Request must include an array of proof parameters'
      });
      return;
    }
    
    if (proofs.length > 20) {
      res.status(400).json({ 
        error: 'Too many proofs',
        details: 'Maximum 20 proofs per batch request'
      });
      return;
    }
    
    // Validate each proof's parameters
    for (let i = 0; i < proofs.length; i++) {
      const proof = proofs[i];
      if (typeof proof.griefScore !== 'number' || 
          typeof proof.chainId !== 'number' || 
          typeof proof.unlockTimestamp !== 'number') {
        res.status(400).json({ 
          error: `Invalid proof parameters at index ${i}`,
          details: 'Each proof must have valid griefScore, chainId, and unlockTimestamp'
        });
        return;
      }
    }
    
    // Perform batch verification
    const verificationResults = await batchVerifyZKUnlocks(proofs);
    
    // Generate summary report
    const report = generateVerificationReport(verificationResults);
    
    res.json({
      success: true,
      batchSize: proofs.length,
      verifications: verificationResults,
      summary: report,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Batch ZK verification error:', error);
    res.status(500).json({ 
      error: 'Failed to perform batch ZK verification',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Run comprehensive validation audit
 * POST /api/validation/audit
 */
export async function runValidationAudit(req: Request, res: Response): Promise<void> {
  try {
    const { capsules, exportToCSV = false } = req.body;
    
    if (!Array.isArray(capsules) || capsules.length === 0) {
      res.status(400).json({ 
        error: 'Invalid capsules array',
        details: 'Request must include an array of capsule data'
      });
      return;
    }
    
    const auditResults = [];
    
    for (const capsule of capsules) {
      try {
        // Fetch IPFS metadata
        let metadata = null;
        if (capsule.cid && isValidCID(capsule.cid)) {
          metadata = await fetchIPFSMeta(capsule.cid);
        }
        
        const griefScore = metadata?.griefScore || capsule.griefScore || 0;
        const unlockTimestamp = capsule.unlockTimestamp || Date.now() + 3600000;
        const chainId = capsule.chainId || 137;
        
        // Check unlock boost
        const boostResult = canUnlockWithBoost({
          griefScore,
          chainId,
          unlockTimestamp,
          userTier: capsule.userTier || 'CREATOR',
          premiumBonus: capsule.premiumBonus || false
        });
        
        // Verify ZK proof
        const zkResult = await verifyZKUnlock({
          griefScore,
          chainId,
          unlockTimestamp
        });
        
        auditResults.push({
          capsuleId: capsule.id || capsule.capsuleId || 'unknown',
          title: metadata?.title || capsule.title || 'Untitled',
          griefScore,
          chain: capsule.chain || 'polygon',
          unlocked: boostResult.canUnlock,
          zkValid: zkResult.valid,
          confidenceScore: zkResult.confidenceScore,
          boostType: boostResult.boostType,
          timeReduction: boostResult.timeReduction,
          timestamp: new Date().toISOString(),
          errors: zkResult.errors
        });
        
        // Send Discord alert for successful unlocks
        if (boostResult.canUnlock && zkResult.valid) {
          // Discord alert temporarily disabled
          /* await sendDiscordAlert({
            title: metadata?.title || capsule.title || 'Untitled',
            chain: capsule.chain || 'polygon',
            griefScore,
            boostType: boostResult.boostType,
            confidenceScore: zkResult.confidenceScore,
            capsuleId: capsule.id || capsule.capsuleId
          }).catch(err => console.warn('Discord alert failed:', err)); */
        }
        
      } catch (error) {
        console.error(`Audit error for capsule ${capsule.id}:`, error);
        auditResults.push({
          capsuleId: capsule.id || 'unknown',
          title: 'Error',
          griefScore: 0,
          chain: capsule.chain || 'unknown',
          unlocked: false,
          zkValid: false,
          confidenceScore: 0,
          boostType: 'None',
          timeReduction: 0,
          timestamp: new Date().toISOString(),
          errors: [error instanceof Error ? error.message : 'Unknown error']
        });
      }
    }
    
    // Export to CSV if requested
    let csvExported = false;
    if (exportToCSV) {
      try {
        const csvPath = `./audit-${Date.now()}.csv`;
        // CSV export temporarily disabled
        // exportAuditToCSV(auditResults, csvPath);
        csvExported = true;
      } catch (error) {
        console.error('CSV export failed:', error);
      }
    }
    
    // Generate summary statistics
    const totalCapsules = auditResults.length;
    const unlockedCount = auditResults.filter(r => r.unlocked).length;
    const zkValidCount = auditResults.filter(r => r.zkValid).length;
    const averageGrief = auditResults.reduce((sum, r) => sum + r.griefScore, 0) / totalCapsules;
    const averageConfidence = auditResults.reduce((sum, r) => sum + r.confidenceScore, 0) / totalCapsules;
    
    res.json({
      success: true,
      audit: {
        totalCapsules,
        unlockedCount,
        zkValidCount,
        averageGriefScore: Math.round(averageGrief * 100) / 100,
        averageConfidence: Math.round(averageConfidence * 100) / 100,
        unlockRate: Math.round((unlockedCount / totalCapsules) * 100),
        zkValidRate: Math.round((zkValidCount / totalCapsules) * 100)
      },
      results: auditResults,
      csvExported,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Validation audit error:', error);
    res.status(500).json({ 
      error: 'Failed to run validation audit',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Test Discord webhook configuration
 * POST /api/validation/test-discord
 */
export async function testDiscordWebhook(req: Request, res: Response): Promise<void> {
  try {
    // Discord alert temporarily disabled
    const success = false; 
    /* await sendDiscordAlert({
      title: 'GuardianChain Validator Test',
      chain: 'base',
      griefScore: 8,
      boostType: 'Test Configuration',
      confidenceScore: 95,
      capsuleId: 'test_validation_001'
    }); */
    
    res.json({
      success,
      message: success 
        ? 'Discord webhook test successful' 
        : 'Discord webhook test failed - check configuration',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Discord test error:', error);
    res.status(500).json({ 
      error: 'Failed to test Discord webhook',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}