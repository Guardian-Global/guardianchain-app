import express from "express";
import Stripe from "stripe";

const router = express.Router();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing required Stripe secret: STRIPE_SECRET_KEY");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
});

// Storage pricing tiers (base cost + 25% markup)
const STORAGE_PRICING = {
  "64GB": 5.0, // $4.00 base + 25% = $5.00
  "128GB": 9.38, // $7.50 base + 25% = $9.38
  "256GB": 16.25, // $13.00 base + 25% = $16.25
  "512GB": 30.0, // $24.00 base + 25% = $30.00
  "1TB": 57.5, // $46.00 base + 25% = $57.50
  "2TB": 112.5, // $90.00 base + 25% = $112.50
};

// Create checkout session for storage capsules
router.post("/create-storage-session", async (req, res) => {
  try {
    const { size, email, userId } = req.body;

    if (!size || !(size in STORAGE_PRICING)) {
      return res.status(400).json({
        error:
          "Invalid storage size. Valid options: 64GB, 128GB, 256GB, 512GB, 1TB, 2TB",
      });
    }

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      client_reference_id: userId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${size} Permanent Storage Capsule`,
              description: `Permanent on-chain storage with ${size} capacity - No monthly fees, sovereign control`,
            },
            unit_amount: Math.round((STORAGE_PRICING as any)[size] * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        storageSize: size,
        userId: userId || "anonymous",
        productType: "storage_capsule",
      },
      success_url: `${req.headers.origin}/upload-capsule?size=${size}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/storage-capsules`,
    });

    res.json({
      sessionId: session.id,
      url: session.url,
      storageSize: size,
      price: (STORAGE_PRICING as any)[size],
    });
  } catch (error: any) {
    console.error("Stripe session creation error:", error);
    res.status(500).json({
      error: "Failed to create checkout session",
      message: error.message,
    });
  }
});

// Verify payment completion
router.get("/verify-payment/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      res.json({
        success: true,
        storageSize: session.metadata?.storageSize || "unknown",
        customerEmail: session.customer_email,
        amountPaid: (session.amount_total || 0) / 100,
        sessionId: session.id,
      });
    } else {
      res.json({
        success: false,
        paymentStatus: session.payment_status,
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      error: "Failed to verify payment",
    });
  }
});

// Get storage pricing info
router.get("/storage-pricing", (req, res) => {
  res.json({
    pricing: STORAGE_PRICING,
    currency: "USD",
    features: {
      "64GB": [
        "Permanent IPFS + blockchain storage",
        "No monthly fees - ever",
        "Private ownership & control",
      ],
      "128GB": [
        "Permanent IPFS + blockchain storage",
        "No monthly fees - ever",
        "Advanced encryption",
        "Private sovereignty",
      ],
      "256GB": [
        "Permanent IPFS + blockchain storage",
        "No monthly fees - ever",
        "Multi-format support",
        "Veritas Seal backed",
      ],
      "512GB": [
        "Permanent IPFS + blockchain storage",
        "No monthly fees - ever",
        "Professional encryption",
        "Time-stamped proof",
      ],
      "1TB": [
        "Permanent IPFS + blockchain storage",
        "No monthly fees - ever",
        "Enterprise-grade security",
        "Legacy preservation",
      ],
      "2TB": [
        "Permanent IPFS + blockchain storage",
        "No monthly fees - ever",
        "Ultimate sovereignty",
        "Immortalized forever",
      ],
    },
  });
});

export default router;
