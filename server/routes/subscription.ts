import type { Express } from "express";
import Stripe from "stripe";
import { z } from "zod";
import { isDebugAuthenticated } from "../debugAuth";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-07-30.basil",
});

// Subscription plan configurations
const SUBSCRIPTION_PLANS = {
  EXPLORER: {
    name: "Explorer",
    priceMonthly: 0,
    priceYearly: 0,
    stripePriceIds: {
      monthly: null,
      yearly: null
    }
  },
  SEEKER: {
    name: "Seeker", 
    priceMonthly: 9,
    priceYearly: 90,
    stripePriceIds: {
      monthly: process.env.STRIPE_SEEKER_MONTHLY_PRICE_ID,
      yearly: process.env.STRIPE_SEEKER_YEARLY_PRICE_ID
    }
  },
  CREATOR: {
    name: "Creator",
    priceMonthly: 29,
    priceYearly: 290,
    stripePriceIds: {
      monthly: process.env.STRIPE_CREATOR_MONTHLY_PRICE_ID,
      yearly: process.env.STRIPE_CREATOR_YEARLY_PRICE_ID
    }
  },
  SOVEREIGN: {
    name: "Sovereign",
    priceMonthly: 99,
    priceYearly: 990,
    stripePriceIds: {
      monthly: process.env.STRIPE_SOVEREIGN_MONTHLY_PRICE_ID,
      yearly: process.env.STRIPE_SOVEREIGN_YEARLY_PRICE_ID
    }
  }
} as const;

const createSubscriptionSchema = z.object({
  planTier: z.enum(['SEEKER', 'CREATOR', 'SOVEREIGN']),
  billingCycle: z.enum(['monthly', 'yearly']),
  successUrl: z.string().optional(),
  cancelUrl: z.string().optional(),
});

const updateSubscriptionSchema = z.object({
  newPlanTier: z.enum(['EXPLORER', 'SEEKER', 'CREATOR', 'SOVEREIGN']),
  billingCycle: z.enum(['monthly', 'yearly']).optional(),
});

export function registerSubscriptionRoutes(app: Express) {
  
  // Get subscription plans
  app.get("/api/subscription/plans", (req, res) => {
    const plans = Object.entries(SUBSCRIPTION_PLANS).map(([tier, config]) => ({
      tier,
      name: config.name,
      priceMonthly: config.priceMonthly,
      priceYearly: config.priceYearly,
      features: getFeaturesByTier(tier as keyof typeof SUBSCRIPTION_PLANS),
      limits: getLimitsByTier(tier as keyof typeof SUBSCRIPTION_PLANS)
    }));
    
    res.json({ plans });
  });

  // Create subscription checkout session
  app.post("/api/subscription/create-checkout", isDebugAuthenticated, async (req, res) => {
    try {
      const validatedData = createSubscriptionSchema.parse(req.body);
      const { planTier, billingCycle, successUrl, cancelUrl } = validatedData;
      
      // Get user info
      const user = req.user as any;
      if (!user?.email) {
        return res.status(400).json({ error: "User email required" });
      }

      const plan = SUBSCRIPTION_PLANS[planTier];
      const priceId = plan.stripePriceIds[billingCycle];
      
      if (!priceId) {
        return res.status(400).json({ error: "Price ID not configured for selected plan" });
      }

      // Create or retrieve Stripe customer
      let customer;
      try {
        const customers = await stripe.customers.list({
          email: user.email,
          limit: 1,
        });
        
        if (customers.data.length > 0) {
          customer = customers.data[0];
        } else {
          customer = await stripe.customers.create({
            email: user.email,
            name: `${user.firstName} ${user.lastName}`.trim(),
            metadata: {
              userId: user.id,
              tier: planTier,
            },
          });
        }
      } catch (error) {
        console.error("Error managing Stripe customer:", error);
        return res.status(500).json({ error: "Failed to create customer" });
      }

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: successUrl || `${req.protocol}://${req.get('host')}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl || `${req.protocol}://${req.get('host')}/pricing`,
        metadata: {
          userId: user.id,
          planTier,
          billingCycle,
        },
        subscription_data: {
          metadata: {
            userId: user.id,
            planTier,
            billingCycle,
          },
        },
        allow_promotion_codes: true,
      });

      res.json({ 
        sessionId: session.id,
        url: session.url 
      });

    } catch (error: any) {
      console.error("Subscription creation error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create subscription checkout" });
    }
  });

  // Get current user subscription
  app.get("/api/subscription/current", isDebugAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      
      // For debug mode, return mock subscription data
      const mockSubscription = {
        id: "sub_debug_123",
        userId: user.id,
        planTier: user.tier || "EXPLORER",
        status: "active",
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        cancelAtPeriodEnd: false,
        features: getFeaturesByTier(user.tier || "EXPLORER"),
        limits: getLimitsByTier(user.tier || "EXPLORER"),
        usage: {
          capsulesCreated: user.usage?.capsulesCreated || 0,
          apiCallsMade: 0,
          storageUsed: 0,
        }
      };

      res.json({ subscription: mockSubscription });

    } catch (error) {
      console.error("Error fetching subscription:", error);
      res.status(500).json({ error: "Failed to fetch subscription" });
    }
  });

  // Update subscription
  app.post("/api/subscription/update", isDebugAuthenticated, async (req, res) => {
    try {
      const validatedData = updateSubscriptionSchema.parse(req.body);
      const { newPlanTier } = validatedData;
      const user = req.user as any;

      // For debug mode, just return success
      res.json({ 
        success: true, 
        message: `Subscription updated to ${newPlanTier}`,
        newTier: newPlanTier
      });

    } catch (error: any) {
      console.error("Subscription update error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update subscription" });
    }
  });

  // Cancel subscription
  app.post("/api/subscription/cancel", isDebugAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      
      // For debug mode, just return success
      res.json({ 
        success: true, 
        message: "Subscription will be canceled at the end of the current period"
      });

    } catch (error) {
      console.error("Subscription cancellation error:", error);
      res.status(500).json({ error: "Failed to cancel subscription" });
    }
  });

  // Stripe webhook handler
  app.post("/api/subscription/webhook", async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
      console.error("Stripe webhook secret not configured");
      return res.status(400).json({ error: "Webhook secret not configured" });
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).json({ error: "Webhook signature verification failed" });
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
          break;
        case 'customer.subscription.updated':
          await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
          break;
        case 'customer.subscription.deleted':
          await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;
        case 'invoice.payment_succeeded':
          await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
          break;
        case 'invoice.payment_failed':
          await handlePaymentFailed(event.data.object as Stripe.Invoice);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error("Error processing webhook:", error);
      res.status(500).json({ error: "Webhook processing failed" });
    }
  });
}

// Helper functions
function getFeaturesByTier(tier: string) {
  const features = {
    EXPLORER: ['basic_capsules', 'public_explorer'],
    SEEKER: ['basic_capsules', 'ai_analysis', 'truth_genome', 'public_explorer'],
    CREATOR: ['all_capsule_types', 'ai_analysis', 'nft_minting', 'api_access', 'truth_genome', 'custom_reels'],
    SOVEREIGN: ['everything', 'white_label', 'priority_support', 'custom_branding', 'advanced_analytics', 'dedicated_support']
  };
  
  return features[tier as keyof typeof features] || features.EXPLORER;
}

function getLimitsByTier(tier: string) {
  const limits = {
    EXPLORER: { capsulesLimit: 5, apiCallsPerMonth: 0, storageLimit: 100 },
    SEEKER: { capsulesLimit: 50, apiCallsPerMonth: 1000, storageLimit: 1000 },
    CREATOR: { capsulesLimit: 500, apiCallsPerMonth: 10000, storageLimit: 10000 },
    SOVEREIGN: { capsulesLimit: -1, apiCallsPerMonth: 100000, storageLimit: -1 }
  };
  
  return limits[tier as keyof typeof limits] || limits.EXPLORER;
}

// Webhook handlers
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log("Checkout completed:", session.id);
  // Update user subscription in database
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log("Subscription updated:", subscription.id);
  // Update user subscription status in database
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log("Subscription deleted:", subscription.id);
  // Mark subscription as canceled in database
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log("Payment succeeded:", invoice.id);
  // Update payment status in database
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log("Payment failed:", invoice.id);
  // Handle failed payment, send notification
}