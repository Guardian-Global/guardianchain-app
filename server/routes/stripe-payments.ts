import { Router } from "express";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing required Stripe secret: STRIPE_SECRET_KEY");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const router = Router();

// Create subscription for tier upgrades
router.post("/create-subscription", async (req, res) => {
  try {
    const { userId, tier, email } = req.body;

    if (!userId || !tier || !email) {
      return res.status(400).json({
        error: "Missing required fields: userId, tier, email",
      });
    }

    // Tier pricing (in cents)
    const tierPricing: Record<string, number> = {
      SEEKER: 2999, // $29.99/month
      CREATOR: 9999, // $99.99/month
      SOVEREIGN: 29999, // $299.99/month
    };

    const priceAmount = tierPricing[tier];
    if (!priceAmount) {
      return res.status(400).json({
        error: "Invalid tier selected",
      });
    }

    // Create or retrieve customer
    let customer;
    try {
      const customers = await stripe.customers.list({ email });
      customer = customers.data[0];
    } catch (error) {
      console.error("Error finding customer:", error);
    }

    if (!customer) {
      customer = await stripe.customers.create({
        email,
        metadata: { userId, tier },
      });
    }

    // Create the subscription
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
          },
        },
      ],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
    });

    const invoice = subscription.latest_invoice as any;
    res.json({
      subscriptionId: subscription.id,
      clientSecret: invoice?.payment_intent?.client_secret,
      customerId: customer.id,
    });
  } catch (error: any) {
    console.error("Error creating subscription:", error);
    res.status(500).json({
      error: "Failed to create subscription",
      details: error.message,
    });
  }
});

// Create one-time payment for GTT tokens
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, gttAmount, userId } = req.body;

    if (!amount || !gttAmount || !userId) {
      return res.status(400).json({
        error: "Missing required fields: amount, gttAmount, userId",
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      metadata: {
        userId,
        gttAmount: gttAmount.toString(),
        type: "gtt_purchase",
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({
      error: "Failed to create payment intent",
      details: error.message,
    });
  }
});

// Handle successful payments (webhook)
router.post("/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(400).send("Webhook secret not configured");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("Payment succeeded:", paymentIntent.id);

      // TODO: Update user's GTT balance in database
      // const { userId, gttAmount } = paymentIntent.metadata;
      // await storage.updateUserGTTBalance(userId, gttAmount);

      break;

    case "customer.subscription.created":
    case "customer.subscription.updated":
      const subscription = event.data.object as Stripe.Subscription;
      console.log("Subscription updated:", subscription.id);

      // TODO: Update user tier in database
      // const customerId = subscription.customer;
      // const customer = await stripe.customers.retrieve(customerId);
      // await storage.updateUserTier(customer.metadata.userId, customer.metadata.tier);

      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Get subscription status
router.get("/subscription/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // TODO: Get user's stripe customer ID from database
    // const user = await storage.getUser(userId);
    // if (!user?.stripeCustomerId) {
    //   return res.json({ hasSubscription: false });
    // }

    // const subscriptions = await stripe.subscriptions.list({
    //   customer: user.stripeCustomerId,
    //   status: 'active'
    // });

    // Mock response for now
    res.json({
      hasSubscription: false,
      tier: "EXPLORER",
    });
  } catch (error: any) {
    console.error("Error checking subscription:", error);
    res.status(500).json({
      error: "Failed to check subscription status",
    });
  }
});

export default router;
