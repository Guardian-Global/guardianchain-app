import { Router } from "express";
import Stripe from "stripe";
import { storage } from "../storage";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing required Stripe secret: STRIPE_SECRET_KEY");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
});

const router = Router();

// Tier pricing configuration
const TIER_PRICING = {
  EXPLORER: 0, // Free tier
  SEEKER: 2999, // $29.99/month
  CREATOR: 9999, // $99.99/month
  SOVEREIGN: 29999, // $299.99/month
};

// One-time payment features pricing
const ONE_TIME_PRICING = {
  premium_capsule: 499, // $4.99
  priority_verification: 999, // $9.99
  advanced_analytics: 1999, // $19.99
  custom_domain: 4999, // $49.99
};

// Create payment intent for one-time payments
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency = "usd", metadata = {} } = req.body;
    
    if (!amount || amount < 50) { // Minimum $0.50
      return res.status(400).json({
        error: "Amount must be at least $0.50",
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Record payment in database
    if (req.user) {
      await storage.createPayment({
        userId: req.user.id,
        stripePaymentIntentId: paymentIntent.id,
        amount: amount.toString(),
        currency,
        status: "pending",
        paymentType: "one_time",
        metadata,
      });
    }

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error("Payment intent creation error:", error);
    res.status(500).json({
      error: "Failed to create payment intent",
      message: error.message,
    });
  }
});

// Create subscription for tier upgrades
router.post("/create-subscription", async (req, res) => {
  try {
    const { tier } = req.body;
    
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!tier || !(tier in TIER_PRICING)) {
      return res.status(400).json({
        error: "Invalid tier. Valid options: EXPLORER, SEEKER, CREATOR, SOVEREIGN",
      });
    }

    const priceAmount = TIER_PRICING[tier as keyof typeof TIER_PRICING];
    
    if (priceAmount === 0) {
      return res.status(400).json({
        error: "EXPLORER tier is free, no subscription needed",
      });
    }

    // Get or create Stripe customer
    let customer;
    if (req.user.stripeCustomerId) {
      try {
        customer = await stripe.customers.retrieve(req.user.stripeCustomerId);
      } catch (error) {
        console.error("Error retrieving customer:", error);
        customer = null;
      }
    }

    if (!customer) {
      customer = await stripe.customers.create({
        email: req.user.email,
        metadata: {
          userId: req.user.id,
          tier,
        },
      });

      // Update user with customer ID
      await storage.updateUser(req.user.id, {
        stripeCustomerId: customer.id,
      });
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: priceAmount,
            recurring: {
              interval: "month",
            },
            product_data: {
              name: `GuardianChain ${tier} Plan`,
              description: `${tier} tier subscription with enhanced features`,
            },
          },
        },
      ],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
      metadata: {
        userId: req.user.id,
        tier,
      },
    });

    // Record payment in database
    const invoice = subscription.latest_invoice as any;
    await storage.createPayment({
      userId: req.user.id,
      stripeSessionId: subscription.id,
      amount: priceAmount.toString(),
      currency: "usd",
      status: "pending",
      paymentType: "subscription",
      metadata: { tier, subscriptionId: subscription.id },
    });

    res.json({
      subscriptionId: subscription.id,
      clientSecret: invoice?.payment_intent?.client_secret,
      tier,
      amount: priceAmount,
    });
  } catch (error: any) {
    console.error("Subscription creation error:", error);
    res.status(500).json({
      error: "Failed to create subscription",
      message: error.message,
    });
  }
});

// Get subscription status
router.get("/subscription-status", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!req.user.stripeSubscriptionId) {
      return res.json({
        status: "inactive",
        tier: "EXPLORER",
      });
    }

    const subscription = await stripe.subscriptions.retrieve(
      req.user.stripeSubscriptionId
    );

    res.json({
      status: subscription.status,
      tier: req.user.tier || "EXPLORER",
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    });
  } catch (error: any) {
    console.error("Subscription status error:", error);
    res.status(500).json({
      error: "Failed to get subscription status",
      message: error.message,
    });
  }
});

// Cancel subscription
router.post("/cancel-subscription", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!req.user.stripeSubscriptionId) {
      return res.status(400).json({ error: "No active subscription found" });
    }

    const subscription = await stripe.subscriptions.update(
      req.user.stripeSubscriptionId,
      {
        cancel_at_period_end: true,
      }
    );

    res.json({
      message: "Subscription will be canceled at the end of the current period",
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentPeriodEnd: subscription.current_period_end,
    });
  } catch (error: any) {
    console.error("Subscription cancellation error:", error);
    res.status(500).json({
      error: "Failed to cancel subscription",
      message: error.message,
    });
  }
});

// Get payment history
router.get("/payment-history", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const payments = await storage.getUserPayments(req.user.id);
    
    res.json({
      payments: payments.map(payment => ({
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        paymentType: payment.paymentType,
        createdAt: payment.createdAt,
        metadata: payment.metadata,
      })),
    });
  } catch (error: any) {
    console.error("Payment history error:", error);
    res.status(500).json({
      error: "Failed to get payment history",
      message: error.message,
    });
  }
});

// Get pricing information
router.get("/pricing", async (req, res) => {
  try {
    res.json({
      tiers: {
        EXPLORER: {
          price: 0,
          name: "Explorer",
          features: [
            "Basic capsule creation",
            "Community access",
            "Standard verification",
            "5 GB storage",
          ],
        },
        SEEKER: {
          price: TIER_PRICING.SEEKER,
          name: "Seeker",
          features: [
            "All Explorer features",
            "Priority verification",
            "Advanced analytics",
            "25 GB storage",
            "Custom themes",
          ],
        },
        CREATOR: {
          price: TIER_PRICING.CREATOR,
          name: "Creator",
          features: [
            "All Seeker features",
            "White-label options",
            "API access",
            "100 GB storage",
            "Advanced AI tools",
          ],
        },
        SOVEREIGN: {
          price: TIER_PRICING.SOVEREIGN,
          name: "Sovereign",
          features: [
            "All Creator features",
            "Custom domain",
            "Priority support",
            "Unlimited storage",
            "Enterprise features",
          ],
        },
      },
      oneTime: ONE_TIME_PRICING,
    });
  } catch (error: any) {
    console.error("Pricing error:", error);
    res.status(500).json({
      error: "Failed to get pricing information",
    });
  }
});

export default router;