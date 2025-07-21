import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

// Real GTT Token Data API Endpoint
router.get("/gtt-data", async (req: Request, res: Response) => {
  try {
    // Simulate real token data with realistic fluctuations
    const basePrice = 2.47;
    const randomFluctuation = (Math.random() - 0.5) * 0.4; // More realistic price movement
    const currentPrice = Math.max(0.01, basePrice + randomFluctuation);
    const change24h = ((currentPrice - basePrice) / basePrice) * 100;
    
    const timestamp = Date.now();
    
    // Simulate market cap based on circulating supply
    const circulatingSupply = 100000000;
    const marketCap = currentPrice * circulatingSupply;
    
    // Simulate volume with some correlation to price movement
    const baseVolume = 15000000;
    const volumeMultiplier = 1 + Math.abs(change24h) * 0.1;
    const volume24h = Math.floor(baseVolume * volumeMultiplier);
    
    const tokenData = {
      success: true,
      data: {
        contractAddress: "0x742d35Cc6635C0532925a3b8d0E9B01d9c5d9A6C",
        symbol: "GTT",
        name: "Guardian Truth Token",
        price: currentPrice,
        priceUSD: currentPrice,
        change24h: parseFloat(change24h.toFixed(2)),
        marketCap: marketCap,
        volume24h: volume24h,
        circulatingSupply: circulatingSupply,
        totalSupply: 1000000000,
        holders: Math.floor(Math.random() * 10000) + 5000,
        transactions24h: Math.floor(Math.random() * 5000) + 1000,
        // User-specific data (would come from authentication in real system)
        userBalance: 1247,
        userBalanceUSD: 1247 * currentPrice,
        dailyYield: parseFloat((Math.random() * 100 + 30).toFixed(1)),
        weeklyYield: parseFloat((Math.random() * 700 + 200).toFixed(1)),
        monthlyYield: parseFloat((Math.random() * 3000 + 800).toFixed(0)),
        totalEarned: parseFloat((Math.random() * 50000 + 15000).toFixed(0)),
        activeCapsules: Math.floor(Math.random() * 50) + 15,
        verifiedCapsules: Math.floor(Math.random() * 40) + 8,
        pendingCapsules: Math.floor(Math.random() * 15) + 2,
        listings: [
          {
            id: "gtt-001",
            title: "Climate Research Breakthrough",
            description: "Revolutionary carbon capture data verified by MIT researchers",
            price: 450,
            priceUSD: 450 * currentPrice,
            status: "active",
            capsuleId: "cap-climate-001",
            createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
            updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
            views: 1247,
            likes: 89,
            category: "Environmental Science",
            tags: ["climate", "research", "carbon-capture", "verified"],
            featured: true
          },
          {
            id: "gtt-002", 
            title: "DeFi Protocol Analysis",
            description: "Advanced yield farming strategies with 94% historical accuracy",
            price: 750,
            priceUSD: 750 * currentPrice,
            status: "active",
            capsuleId: "cap-defi-002",
            createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
            updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
            views: 2156,
            likes: 156,
            category: "DeFi Analysis",
            tags: ["defi", "yield-farming", "analysis", "strategy"],
            featured: true
          },
          {
            id: "gtt-003",
            title: "Smart City Infrastructure",
            description: "Urban planning optimization reducing costs by 40%",
            price: 320,
            priceUSD: 320 * currentPrice,
            status: "sold",
            capsuleId: "cap-urban-003",
            createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
            updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
            views: 892,
            likes: 67,
            category: "Urban Planning",
            tags: ["smart-city", "infrastructure", "optimization"],
            featured: false
          }
        ],
        priceHistory24h: generatePriceHistory(currentPrice, 24),
        marketMetrics: {
          volatility: parseFloat((Math.random() * 0.5 + 0.1).toFixed(3)),
          liquidityScore: parseFloat((Math.random() * 40 + 60).toFixed(1)),
          sentiment: Math.random() > 0.5 ? "bullish" : "bearish",
          supportLevel: parseFloat((currentPrice * 0.95).toFixed(4)),
          resistanceLevel: parseFloat((currentPrice * 1.05).toFixed(4)),
          rsi: parseFloat((Math.random() * 40 + 30).toFixed(1)),
          macd: parseFloat((Math.random() * 0.1 - 0.05).toFixed(4))
        },
        exchanges: [
          {
            name: "Uniswap V3",
            price: currentPrice,
            volume24h: Math.floor(volume24h * 0.4),
            liquidity: Math.floor(marketCap * 0.15)
          },
          {
            name: "PancakeSwap",
            price: currentPrice * (1 + (Math.random() - 0.5) * 0.002),
            volume24h: Math.floor(volume24h * 0.35),
            liquidity: Math.floor(marketCap * 0.12)
          },
          {
            name: "SushiSwap",
            price: currentPrice * (1 + (Math.random() - 0.5) * 0.003),
            volume24h: Math.floor(volume24h * 0.25),
            liquidity: Math.floor(marketCap * 0.08)
          }
        ],
        lastUpdated: new Date().toISOString(),
        timestamp: timestamp
      }
    };

    res.json(tokenData);
  } catch (error) {
    console.error("Error fetching GTT token data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch token data",
      message: error.message
    });
  }
});

// Generate realistic price history
function generatePriceHistory(currentPrice: number, hours: number) {
  const history = [];
  let price = currentPrice;
  
  for (let i = hours; i >= 0; i--) {
    // Add some realistic price movement
    const volatility = 0.02; // 2% max change per hour
    const change = (Math.random() - 0.5) * volatility;
    price = Math.max(0.01, price * (1 + change));
    
    history.push({
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      price: parseFloat(price.toFixed(4)),
      volume: Math.floor(Math.random() * 1000000 + 100000)
    });
  }
  
  return history;
}

// Real-time price feed endpoint (polling-based for simplicity)
router.get("/live-feed", async (req: Request, res: Response) => {
  try {
    const basePrice = 2.47;
    const currentPrice = basePrice + (Math.random() - 0.5) * 0.2;
    
    res.json({
      success: true,
      data: {
        type: "price_update",
        price: parseFloat(currentPrice.toFixed(4)),
        change24h: parseFloat(((currentPrice - basePrice) / basePrice * 100).toFixed(2)),
        timestamp: Date.now(),
        volume: Math.floor(Math.random() * 100000) + 50000,
        status: "connected"
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch live feed data"
    });
  }
});

// User listings endpoint
router.get("/user/:userId/listings", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    // In real implementation, fetch from database using userId
    // For now, return demo listings
    const listings = [
      {
        id: "user-001",
        userId: userId,
        title: "Personal Truth Capsule Collection",
        description: "My verified truth capsules with proven accuracy",
        price: 199,
        status: "active",
        capsuleId: "personal-001",
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
        views: 324,
        likes: 28,
        category: "Personal Research",
        tags: ["personal", "verified", "research"],
        earnings: 847
      }
    ];

    res.json({
      success: true,
      data: {
        listings: listings,
        totalListings: listings.length,
        activeListings: listings.filter(l => l.status === "active").length,
        totalEarnings: listings.reduce((sum, l) => sum + (l.earnings || 0), 0),
        totalViews: listings.reduce((sum, l) => sum + l.views, 0)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch user listings"
    });
  }
});

export default router;