import { Router } from "express";

const router = Router();

// Mock GTT token data endpoint
router.get("/token/live-data", (req, res) => {
  // Simulate live token data with some randomness
  const basePrice = 0.0075;
  const priceVariation = (Math.random() - 0.5) * 0.0002; // ±0.0001 variation
  const price = Math.max(0.001, basePrice + priceVariation);
  const priceChange = priceVariation;
  const percentChange = (priceChange / basePrice) * 100;

  const mockData = {
    price: parseFloat(price.toFixed(6)),
    priceChange: parseFloat(priceChange.toFixed(6)),
    percentChange: parseFloat(percentChange.toFixed(2)),
    volume24h: "1.2M",
    marketCap: "75M",
    timestamp: Date.now()
  };

  res.json(mockData);
});

export default router;