import type { Express } from "express";
import Stripe from "stripe";
import { TIERS } from "../../client/src/lib/tiers";

// Mock Supabase client for development
const mockSupabaseClient = {
  from: (table: string) => ({
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        then: (callback: (result: any) => void) => {
          console.log(`Updated ${table} where ${column} = ${value}:`, data);
          callback({ data: [{ id: value, ...data }], error: null });
        },
      }),
    }),
  }),
};

let stripe: Stripe | null = null;

// Initialize Stripe if secret key is available
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });
}

export function registerStripeWebhook(app: Express) {
  app.post("/api/stripe/webhook", async (req, res) => {
    if (!stripe) {
      console.log(
        "Stripe webhook received but no Stripe secret key configured"
      );
      return res.status(400).json({ error: "Stripe not configured" });
    }

    try {
      const sig = req.headers["stripe-signature"] as string;
      let event: Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET!
        );
      } catch (err: any) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      // Handle subscription events
      if (
        event.type === "customer.subscription.created" ||
        event.type === "customer.subscription.updated"
      ) {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata.supabaseUserId;
        const tierName = subscription.metadata.tier as string;
        const tier = TIERS.find((t) => t.name === tierName);

        if (userId && tier) {
          // Update user's tier and credits
          await new Promise((resolve) => {
            mockSupabaseClient
              .from("users")
              .update({
                tier: tierName,
                capsuleMintCredits: tier.capsuleMints,
                lastTierRenewal: new Date().toISOString(),
                stripeCustomerId: subscription.customer,
                stripeSubscriptionId: subscription.id,
              })
              .eq("id", userId)
              .then(resolve);
          });

          console.log(
            `Updated user ${userId} to ${tierName} tier with ${tier.capsuleMints} credits`
          );
        }
      }

      // Handle payment success
      if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("Payment succeeded:", paymentIntent.id);
      }

      // Handle subscription cancellation
      if (event.type === "customer.subscription.deleted") {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata.supabaseUserId;

        if (userId) {
          await new Promise((resolve) => {
            mockSupabaseClient
              .from("users")
              .update({
                tier: "Explorer",
                capsuleMintCredits: 3, // Reset to free tier
                stripeSubscriptionId: null,
              })
              .eq("id", userId)
              .then(resolve);
          });

          console.log(
            `User ${userId} subscription cancelled, reset to Explorer tier`
          );
        }
      }

      res.status(200).json({ received: true });
    } catch (error: any) {
      console.error("Stripe webhook error:", error);
      res.status(500).json({ error: error.message });
    }
  });
}
