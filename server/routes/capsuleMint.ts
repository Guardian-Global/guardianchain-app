import { Router } from 'express';
import { consolidatedAuth } from '../auth/authConsolidation';
import { requireCertification } from '../middleware/requireCertification';
import { mintRateLimiter } from '../middleware/rateLimiter';
import { calculateMintFee, createStripeCheckoutSession, verifyStripePayment, checkGTTBalance, processGTTPayment } from '../services/mintingTiers';
import { db } from '../db';
// // import { capsules, capsuleMintLogs } from "../../compatibility/schema-adapter";
// Temporary: Using minimal exports
// Temporary: Mock table exports for minimal functionality
const capsules = null;
const capsuleMintLogs = null;
import { eq, desc } from 'drizzle-orm';

const router = Router();

// Apply mint rate limiting to all minting routes
router.use(mintRateLimiter);

// Get minting fee calculation
router.post('/calculate-fee', consolidatedAuth, async (req, res) => {
  try {
    const { capsuleId, paymentMethod = 'stripe' } = req.body;
    const user = req.user!;

    if (!capsuleId) {
      return res.status(400).json({ 
        error: 'Capsule ID is required',
        code: 'MISSING_CAPSULE_ID' 
      });
    }

    // Check if capsule exists and is owned by user
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

    if (capsule.authorId !== user.id) {
      return res.status(403).json({ 
        error: 'You can only mint your own capsules',
        code: 'NOT_CAPSULE_OWNER' 
      });
    }

    // Check if already minted
    if (capsule.nftTokenId) {
      return res.status(409).json({ 
        error: 'Capsule already minted as NFT',
        code: 'ALREADY_MINTED',
        tokenId: capsule.nftTokenId
      });
    }

    // Calculate fees based on user tier and GTT balance
    let hasGTTBalance = false;
    let gttBalance = { balance: "0", minimumRequired: "100" };

    if (paymentMethod === 'gtt' && user.walletAddress) {
      const gttCheck = await checkGTTBalance(user.walletAddress);
      hasGTTBalance = gttCheck.hasBalance;
      gttBalance = gttCheck;
    }

    const feeCalculation = calculateMintFee(user.tier, hasGTTBalance);

    res.json({
      capsuleId,
      paymentMethod,
      feeCalculation,
      gttBalance,
      canPayWithGTT: hasGTTBalance && paymentMethod === 'gtt',
      userTier: user.tier,
      capsuleTitle: capsule.title
    });

  } catch (error) {
    console.error('Fee calculation error:', error);
    res.status(500).json({ 
      error: 'Failed to calculate minting fee',
      code: 'FEE_CALCULATION_ERROR' 
    });
  }
});

// Create Stripe checkout session for minting
router.post('/create-checkout', consolidatedAuth, requireCertification, async (req, res) => {
  try {
    const { capsuleId } = req.body;
    const user = req.user!;
    const capsule = req.capsule!;

    // Calculate fee
    const feeCalculation = calculateMintFee(user.tier, false);
    
    if (feeCalculation.finalFee === 0) {
      return res.status(400).json({ 
        error: 'Free minting available for your tier. Use direct mint endpoint.',
        code: 'FREE_TIER_MINTING' 
      });
    }

    // Create Stripe checkout session
    const successUrl = `${req.protocol}://${req.get('host')}/mint/success`;
    const cancelUrl = `${req.protocol}://${req.get('host')}/mint/cancel`;

    const session = await createStripeCheckoutSession(
      feeCalculation.finalFee,
      capsuleId,
      user.id,
      successUrl,
      cancelUrl
    );

    // Log mint attempt
    await db.insert(capsuleMintLogs).values({
      capsuleId,
      userId: user.id,
      mintingFee: feeCalculation.finalFee.toString(),
      paymentMethod: 'stripe',
      stripeSessionId: session.id,
      status: 'payment_pending',
      userTier: user.tier
    });

    console.log(`💳 Stripe checkout created for capsule ${capsuleId} - Session: ${session.id}`);

    res.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
      amount: feeCalculation.finalFee,
      capsuleTitle: capsule.title
    });

  } catch (error) {
    console.error('Stripe checkout creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      code: 'CHECKOUT_CREATION_ERROR' 
    });
  }
});

// Process GTT payment for minting
router.post('/pay-with-gtt', consolidatedAuth, requireCertification, async (req, res) => {
  try {
    const { capsuleId } = req.body;
    const user = req.user!;
    const capsule = req.capsule!;

    if (!user.walletAddress) {
      return res.status(400).json({ 
        error: 'Wallet address required for GTT payment',
        code: 'WALLET_ADDRESS_REQUIRED' 
      });
    }

    // Check GTT balance
    const gttCheck = await checkGTTBalance(user.walletAddress);
    if (!gttCheck.hasBalance) {
      return res.status(400).json({ 
        error: 'Insufficient GTT balance',
        code: 'INSUFFICIENT_GTT_BALANCE',
        required: gttCheck.minimumRequired,
        balance: gttCheck.balance
      });
    }

    // Calculate fee with GTT discount
    const feeCalculation = calculateMintFee(user.tier, true);
    const gttAmount = Math.ceil(feeCalculation.finalFee / 100); // Convert cents to GTT (mock rate)

    // Process GTT payment
    const payment = await processGTTPayment(user.walletAddress, gttAmount, capsuleId);

    if (!payment.success) {
      return res.status(400).json({ 
        error: payment.error || 'GTT payment failed',
        code: 'GTT_PAYMENT_FAILED' 
      });
    }

    // Log successful GTT payment
    await db.insert(capsuleMintLogs).values({
      capsuleId,
      userId: user.id,
      mintingFee: gttAmount.toString(),
      paymentMethod: 'gtt',
      txHash: payment.txHash,
      status: 'payment_completed',
      userTier: user.tier
    });

    console.log(`💰 GTT payment successful for capsule ${capsuleId} - TX: ${payment.txHash}`);

    res.json({
      success: true,
      message: 'GTT payment successful',
      txHash: payment.txHash,
      amount: gttAmount,
      capsuleTitle: capsule.title,
      readyToMint: true
    });

  } catch (error) {
    console.error('GTT payment error:', error);
    res.status(500).json({ 
      error: 'Failed to process GTT payment',
      code: 'GTT_PAYMENT_ERROR' 
    });
  }
});

// Verify Stripe payment and complete mint
router.post('/verify-payment', consolidatedAuth, async (req, res) => {
  try {
    const { sessionId } = req.body;
    const user = req.user!;

    if (!sessionId) {
      return res.status(400).json({ 
        error: 'Session ID is required',
        code: 'MISSING_SESSION_ID' 
      });
    }

    // Verify Stripe payment
    const verification = await verifyStripePayment(sessionId);

    if (!verification.success) {
      return res.status(400).json({ 
        error: 'Payment verification failed',
        code: 'PAYMENT_VERIFICATION_FAILED',
        paymentStatus: verification.paymentStatus
      });
    }

    // Update mint log
    await db.update(capsuleMintLogs)
      .set({
        status: 'payment_completed',
        completedAt: new Date()
      })
      .where(eq(capsuleMintLogs.stripeSessionId, sessionId));

    console.log(`✅ Payment verified for session ${sessionId}`);

    res.json({
      success: true,
      message: 'Payment verified successfully',
      capsuleId: verification.capsuleId,
      amount: verification.amount,
      readyToMint: true
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ 
      error: 'Failed to verify payment',
      code: 'PAYMENT_VERIFICATION_ERROR' 
    });
  }
});

// Direct mint for free tiers or completed payments
router.post('/mint', consolidatedAuth, requireCertification, async (req, res) => {
  try {
    const { capsuleId } = req.body;
    const user = req.user!;
    const capsule = req.capsule!;

    // For free tiers, allow direct minting
    const feeCalculation = calculateMintFee(user.tier, false);
    const isFree = feeCalculation.finalFee === 0;

    if (!isFree) {
      // Check if payment was completed
      const [paymentLog] = await db
        .select()
        .from(capsuleMintLogs)
        .where(eq(capsuleMintLogs.capsuleId, capsuleId))
        .orderBy(desc(capsuleMintLogs.createdAt));

      if (!paymentLog || paymentLog.status !== 'payment_completed') {
        return res.status(400).json({ 
          error: 'Payment required before minting',
          code: 'PAYMENT_REQUIRED' 
        });
      }
    }

    // Mock NFT minting (replace with actual blockchain call)
    const mockTokenId = Math.floor(Math.random() * 1000000).toString();
    const mockTxHash = `0x${Math.random().toString(16).substring(2, 66)}`;

    // Update capsule with NFT data
    const [mintedCapsule] = await db
      .update(capsules)
      .set({
        nftTokenId: mockTokenId,
        nftMintTxHash: mockTxHash,
        nftContractAddress: '0x742d35Cc6634C0532925a3b8D9a4d8Ad2B5e7C4e', // Mock contract
        updatedAt: new Date()
      })
      .where(eq(capsules.id, capsuleId))
      .returning();

    // Log successful mint
    if (isFree) {
      await db.insert(capsuleMintLogs).values({
        capsuleId,
        userId: user.id,
        mintingFee: '0',
        paymentMethod: 'free',
        status: 'minted',
        userTier: user.tier,
        completedAt: new Date()
      });
    } else {
      await db.update(capsuleMintLogs)
        .set({
          status: 'minted',
          completedAt: new Date()
        })
        .where(eq(capsuleMintLogs.capsuleId, capsuleId));
    }

    console.log(`🎨 NFT minted successfully - Capsule: ${capsuleId}, Token: ${mockTokenId}`);

    res.json({
      success: true,
      message: 'Capsule minted as NFT successfully',
      capsule: mintedCapsule,
      nft: {
        tokenId: mockTokenId,
        txHash: mockTxHash,
        contractAddress: '0x742d35Cc6634C0532925a3b8D9a4d8Ad2B5e7C4e'
      }
    });

  } catch (error) {
    console.error('NFT minting error:', error);
    res.status(500).json({ 
      error: 'Failed to mint NFT',
      code: 'MINTING_ERROR' 
    });
  }
});

// Get minting history for user
router.get('/history', consolidatedAuth, async (req, res) => {
  try {
    const user = req.user!;

    const mintHistory = await db
      .select()
      .from(capsuleMintLogs)
      .where(eq(capsuleMintLogs.userId, user.id))
      .orderBy(desc(capsuleMintLogs.createdAt))
      .limit(50);

    res.json({
      history: mintHistory,
      count: mintHistory.length
    });

  } catch (error) {
    console.error('Mint history error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch minting history',
      code: 'MINT_HISTORY_ERROR' 
    });
  }
});

export default router;