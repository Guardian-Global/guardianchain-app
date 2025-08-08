// server/routes/auto-mint.ts
// Auto-mint capsule on registration + audit trail

import express from 'express';
import { consolidatedAuth } from '../auth/authConsolidation';
import { storage } from '../storage';
import { sendWelcomeEmail } from '../services/emailService';

const router = express.Router();

// Auto-mint welcome capsule for new user
export async function autoMintWelcomeCapsule(userId: string, userEmail: string, userData: any) {
  try {
    console.log(`🎁 Starting auto-mint welcome capsule for user: ${userId}`);
    
    // Check if user already has welcome capsule
    const existingCapsules = await storage.getUserCapsules(userId);
    const hasWelcomeCapsule = existingCapsules.some(capsule => 
      capsule.capsuleType === 'welcome' || capsule.metadata?.isWelcomeGift
    );
    
    if (hasWelcomeCapsule) {
      console.log(`⚠️ User ${userId} already has welcome capsule`);
      return null;
    }

    // Create welcome capsule
    const welcomeCapsule = {
      title: "🎉 Welcome to GuardianChain!",
      description: "Your exclusive onboarding NFT capsule marking the beginning of your Guardian journey.",
      content: `Welcome to GuardianChain, Guardian!

This special NFT capsule commemorates your entry into the future of decentralized truth verification and blockchain-based memory storage.

Guardian Details:
• Email: ${userEmail}
• Guardian ID: ${userId}  
• Join Date: ${new Date().toLocaleDateString()}
• Tier: ${userData.tier || 'EXPLORER'}

As a Guardian, you now have access to:
✓ Veritas Capsule minting and verification
✓ GTT token rewards through GriefScore™ yield
✓ DAO governance participation
✓ Time-locked proof systems  
✓ Community verification networks
✓ Attestation services and truth validation

Your journey into sovereign truth storage begins now. May your memories endure forever on the blockchain.

Welcome to the Guardian collective.`,
      
      mediaUrl: "/assets/welcome-nft.png",
      tags: ["welcome", "guardian", "onboarding", "official"],
      capsuleType: "welcome",
      verificationLevel: "platform_certified",
      isPublic: true,
      isReward: true,
      
      // NFT metadata
      tokenId: `welcome_${Date.now()}_${userId.slice(-8)}`,
      contractAddress: process.env.CAPSULE_CONTRACT_ADDRESS || "0x...",
      blockchain: "polygon",
      
      metadata: {
        isWelcomeGift: true,
        autoMinted: true,
        registrationDate: new Date().toISOString(),
        guardianTier: userData.tier || 'EXPLORER',
        specialType: "onboarding_nft",
        rarity: "unique",
        benefits: [
          "platform_access",
          "gtt_rewards", 
          "dao_voting",
          "verification_rights",
          "community_status"
        ],
        mintReason: "user_registration",
        systemGenerated: true
      }
    };

    // Mint the capsule
    const mintedCapsule = await storage.createCapsule(userId, welcomeCapsule);
    
    // Create audit trail entry
    const auditEntry = {
      capsuleId: mintedCapsule.id,
      userId: userId,
      action: "auto_mint_welcome",
      timestamp: new Date(),
      metadata: {
        system: "registration_rewards",
        trigger: "new_user_signup",
        userEmail: userEmail,
        mintedAt: new Date().toISOString(),
        capsuleType: "welcome",
        automated: true
      },
      ipAddress: "127.0.0.1", // System action
      userAgent: "GuardianChain-System"
    };
    
    await storage.createCapsuleAudit(auditEntry);
    
    // Award initial GTT tokens
    try {
      const gttBonus = 100;
      const userStats = await storage.getUserStats(userId);
      
      if (userStats) {
        await storage.updateUserStats(userId, {
          gttBalance: (userStats.gttBalance || 0) + gttBonus,
          totalEarnings: (userStats.totalEarnings || 0) + gttBonus,
          capsuleCount: (userStats.capsuleCount || 0) + 1,
          lastActivityAt: new Date()
        });
      } else {
        await storage.createUserStats(userId, {
          gttBalance: gttBonus,
          totalEarnings: gttBonus,
          capsuleCount: 1,
          lastActivityAt: new Date()
        });
      }
      
      console.log(`💰 Awarded ${gttBonus} GTT welcome bonus to user: ${userId}`);
    } catch (gttError) {
      console.warn('Failed to award GTT bonus:', gttError);
    }
    
    // Send welcome email
    try {
      await sendWelcomeEmail(userEmail, userData.displayName || userData.email);
    } catch (emailError) {
      console.warn('Welcome email failed:', emailError);
    }
    
    console.log(`✅ Welcome capsule auto-minted successfully for user: ${userId}`);
    
    return {
      capsule: mintedCapsule,
      audit: auditEntry,
      gttAwarded: 100
    };
    
  } catch (error) {
    console.error(`❌ Auto-mint failed for user ${userId}:`, error);
    
    // Create error audit trail
    try {
      await storage.createCapsuleAudit({
        userId: userId,
        action: "auto_mint_failed",
        timestamp: new Date(),
        metadata: {
          system: "registration_rewards",
          error: error.message,
          userEmail: userEmail
        },
        ipAddress: "127.0.0.1",
        userAgent: "GuardianChain-System"
      });
    } catch (auditError) {
      console.error('Failed to create error audit:', auditError);
    }
    
    throw error;
  }
}

// Manual trigger for admin to re-run welcome capsule
router.post('/admin/trigger-welcome/:userId', async (req, res) => {
  try {
    // Check admin authorization
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { userId } = req.params;
    const { force } = req.body; // Force re-mint even if already exists
    
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // If force is true, remove existing welcome capsules first
    if (force) {
      const existingCapsules = await storage.getUserCapsules(userId);
      const welcomeCapsules = existingCapsules.filter(c => 
        c.capsuleType === 'welcome' || c.metadata?.isWelcomeGift
      );
      
      for (const capsule of welcomeCapsules) {
        await storage.deleteCapsule(capsule.id);
        await storage.createCapsuleAudit({
          capsuleId: capsule.id,
          userId: userId,
          action: "admin_delete_welcome",
          timestamp: new Date(),
          metadata: {
            system: "admin_action", 
            reason: "forced_remint"
          },
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'] || 'Unknown'
        });
      }
    }
    
    const result = await autoMintWelcomeCapsule(userId, user.email, user);
    
    if (!result) {
      return res.json({ 
        message: 'User already has welcome capsule',
        existing: true 
      });
    }
    
    console.log(`🔧 Admin triggered welcome capsule for user: ${userId}`);
    
    res.json({
      message: 'Welcome capsule created successfully',
      capsule: result.capsule,
      gttAwarded: result.gttAwarded
    });
    
  } catch (error) {
    console.error('Error triggering welcome capsule:', error);
    res.status(500).json({ error: 'Failed to trigger welcome capsule' });
  }
});

// Get audit trail for a capsule
router.get('/audit/:capsuleId', consolidatedAuth, async (req: any, res) => {
  try {
    const { capsuleId } = req.params;
    
    // Check if user owns the capsule or is admin
    const capsule = await storage.getCapsule(capsuleId);
    if (!capsule) {
      return res.status(404).json({ error: 'Capsule not found' });
    }
    
    if (capsule.userId !== req.user.id && req.user.tier !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const auditTrail = await storage.getCapsuleAuditHistory(capsuleId);
    
    res.json(auditTrail);
  } catch (error) {
    console.error('Error fetching audit trail:', error);
    res.status(500).json({ error: 'Failed to fetch audit trail' });
  }
});

// Get all audit activity for admin
router.get('/admin/audit-activity', async (req, res) => {
  try {
    // Check admin authorization
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const limit = parseInt(req.query.limit as string) || 100;
    const action = req.query.action as string;
    
    const auditActivity = await storage.getAllCapsuleAuditActivity(limit, action);
    
    res.json(auditActivity);
  } catch (error) {
    console.error('Error fetching audit activity:', error);
    res.status(500).json({ error: 'Failed to fetch audit activity' });
  }
});

export { router as autoMintRoutes, autoMintWelcomeCapsule };