import { Request, Response } from "express";
import Stripe from 'stripe';

// Stripe checkout session creation for Pro tier upgrade
export async function createUpgradeSession(req: Request, res: Response) {
  try {
    // Check if Stripe is available
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ 
        error: "Stripe not configured. Please contact support." 
      });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { 
      apiVersion: "2024-06-20" 
    });

    // Get user information from session/auth
    const userId = req.user?.claims?.sub || req.body.userId;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Replace with your actual Stripe price ID for Pro tier ($29/month)
          price: process.env.STRIPE_PRO_PRICE_ID || "price_1234567890", 
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.origin || 'https://guardianchain.replit.app'}/dashboard?upgrade=success`,
      cancel_url: `${req.headers.origin || 'https://guardianchain.replit.app'}/upgrade?cancelled=true`,
      customer_email: req.user?.claims?.email,
      metadata: {
        userId: userId,
        tier: "pro",
        platform: "guardianchain"
      },
      subscription_data: {
        metadata: {
          userId: userId,
          tier: "pro"
        }
      }
    });

    // Log upgrade attempt for analytics
    console.log(`💳 Stripe checkout created for user ${userId}:`, {
      sessionId: session.id,
      amount: "$29/month",
      tier: "pro"
    });

    // Redirect to Stripe checkout
    if (session.url) {
      res.redirect(303, session.url);
    } else {
      res.status(500).json({ error: "Failed to create checkout session" });
    }

  } catch (error) {
    console.error("Stripe checkout error:", error);
    res.status(500).json({ 
      error: "Failed to create checkout session",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

// Webhook handler for successful payments
export async function handleStripeWebhook(req: Request, res: Response) {
  try {
    const Stripe = require('stripe');
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body, 
        sig, 
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return res.status(400).send(`Webhook Error: ${err}`);
    }

    // Handle successful subscription creation
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const tier = session.metadata?.tier || "pro";

      if (userId) {
        // Update user tier in database
        // In production, this would update Replit DB
        try {
          // Mock tier assignment for development
          localStorage.setItem(`tier-${userId}`, tier);
          localStorage.setItem(`stripe-session-${userId}`, session.id);
          localStorage.setItem(`upgrade-completed-${userId}`, new Date().toISOString());
          
          console.log(`✅ User ${userId} upgraded to ${tier} tier via Stripe`);
        } catch (error) {
          console.error("Failed to update user tier after payment:", error);
        }
      }
    }

    res.json({ received: true });

  } catch (error) {
    console.error("Webhook handler error:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
}

// Get user's current subscription status
export async function getSubscriptionStatus(req: Request, res: Response) {
  try {
    const userId = req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Check user's current tier and subscription status
    const tier = localStorage.getItem(`tier-${userId}`) || "guest";
    const stripeSessionId = localStorage.getItem(`stripe-session-${userId}`);
    const upgradeDate = localStorage.getItem(`upgrade-completed-${userId}`);

    res.json({
      userId,
      tier,
      hasActiveSubscription: tier === "pro" || tier === "enterprise",
      stripeSessionId,
      upgradeDate,
      features: {
        veritasTools: tier === "pro" || tier === "enterprise",
        unlimitedCapsules: tier === "pro" || tier === "enterprise", 
        advancedAnalytics: tier === "pro" || tier === "enterprise",
        gttLimit: tier === "pro" ? 500 : tier === "enterprise" ? 99999 : 10
      }
    });

  } catch (error) {
    console.error("Failed to get subscription status:", error);
    res.status(500).json({ error: "Failed to get subscription status" });
  }
}