import Stripe from 'stripe';

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
}) : null;

// Tier-based pricing structure
export interface MintingTier {
  name: string;
  tier: 'EXPLORER' | 'SEEKER' | 'CREATOR' | 'SOVEREIGN' | 'ADMIN';
  baseFee: number; // in USD cents
  discount: number; // percentage discount (0-1)
  gttDiscount: number; // additional GTT holder discount
  features: string[];
}

export const MINTING_TIERS: MintingTier[] = [
  {
    name: 'Explorer',
    tier: 'EXPLORER',
    baseFee: 500, // $5.00
    discount: 0,
    gttDiscount: 0.1, // 10% GTT discount
    features: ['Basic NFT minting', 'Standard metadata', 'Community verification']
  },
  {
    name: 'Seeker',
    tier: 'SEEKER',
    baseFee: 500,
    discount: 0.15, // 15% discount
    gttDiscount: 0.15, // 15% GTT discount
    features: ['Enhanced metadata', 'Priority verification', 'Lineage tracking']
  },
  {
    name: 'Creator',
    tier: 'CREATOR',
    baseFee: 500,
    discount: 0.25, // 25% discount
    gttDiscount: 0.2, // 20% GTT discount
    features: ['Premium features', 'Advanced lineage', 'Priority support', 'Custom traits']
  },
  {
    name: 'Sovereign',
    tier: 'SOVEREIGN',
    baseFee: 500,
    discount: 0.5, // 50% discount
    gttDiscount: 0.3, // 30% GTT discount
    features: ['All features', 'Governance rights', 'Revenue sharing', 'Custom contracts']
  },
  {
    name: 'Admin',
    tier: 'ADMIN',
    baseFee: 0, // Free minting for admins
    discount: 1.0, // 100% discount
    gttDiscount: 0,
    features: ['Free minting', 'All features', 'Administrative privileges']
  }
];

export function calculateMintFee(
  userTier: string,
  hasGTTBalance: boolean = false,
  baseFee: number = 500
): {
  originalFee: number;
  discount: number;
  gttDiscount: number;
  finalFee: number;
  tierInfo: MintingTier | null;
} {
  const tierInfo = MINTING_TIERS.find(t => t.tier === userTier) || MINTING_TIERS[0];
  
  // Apply tier discount
  const discountedFee = baseFee * (1 - tierInfo.discount);
  
  // Apply GTT discount if user has GTT balance
  const gttDiscountAmount = hasGTTBalance ? discountedFee * tierInfo.gttDiscount : 0;
  const finalFee = Math.max(0, discountedFee - gttDiscountAmount);
  
  return {
    originalFee: baseFee,
    discount: tierInfo.discount,
    gttDiscount: hasGTTBalance ? tierInfo.gttDiscount : 0,
    finalFee: Math.round(finalFee),
    tierInfo
  };
}

export async function createStripeCheckoutSession(
  amount: number,
  capsuleId: string,
  userId: string,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'GuardianChain Capsule Mint',
              description: `Mint capsule as NFT: ${capsuleId}`,
              images: ['https://your-domain.com/capsule-mint-image.png'],
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}&capsule_id=${capsuleId}`,
      cancel_url: `${cancelUrl}?capsule_id=${capsuleId}`,
      metadata: {
        capsuleId,
        userId,
        type: 'capsule_mint'
      },
      client_reference_id: userId,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      payment_intent_data: {
        description: `GuardianChain Capsule Mint: ${capsuleId}`,
        metadata: {
          capsuleId,
          userId,
          service: 'guardianchain'
        }
      }
    });

    return session;
  } catch (error) {
    console.error('Stripe checkout session creation error:', error);
    throw new Error('Failed to create payment session');
  }
}

export async function verifyStripePayment(sessionId: string): Promise<{
  success: boolean;
  capsuleId?: string;
  userId?: string;
  amount?: number;
  paymentStatus?: string;
}> {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === 'paid') {
      return {
        success: true,
        capsuleId: session.metadata?.capsuleId,
        userId: session.client_reference_id || session.metadata?.userId,
        amount: session.amount_total,
        paymentStatus: session.payment_status
      };
    }
    
    return {
      success: false,
      paymentStatus: session.payment_status
    };
  } catch (error) {
    console.error('Stripe payment verification error:', error);
    return { success: false };
  }
}

// Mock GTT balance check (replace with actual blockchain integration)
export async function checkGTTBalance(userAddress: string): Promise<{
  hasBalance: boolean;
  balance: string;
  minimumRequired: string;
}> {
  // Mock implementation - replace with actual Web3 call
  const mockBalance = Math.random() > 0.5 ? "1000" : "50";
  const minimumRequired = "100";
  
  return {
    hasBalance: parseFloat(mockBalance) >= parseFloat(minimumRequired),
    balance: mockBalance,
    minimumRequired
  };
}

// Mock GTT payment processing (replace with actual Web3 transaction)
export async function processGTTPayment(
  userAddress: string,
  amount: number,
  capsuleId: string
): Promise<{
  success: boolean;
  txHash?: string;
  error?: string;
}> {
  try {
    // Mock transaction - replace with actual Web3 call
    const mockTxHash = `0x${Math.random().toString(16).substring(2, 66)}`;
    
    // Simulate transaction processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log(`💰 Mock GTT payment processed: ${amount} GTT for capsule ${capsuleId}`);
    console.log(`📄 Mock transaction hash: ${mockTxHash}`);
    
    return {
      success: true,
      txHash: mockTxHash
    };
  } catch (error) {
    console.error('GTT payment processing error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'GTT payment failed'
    };
  }
}