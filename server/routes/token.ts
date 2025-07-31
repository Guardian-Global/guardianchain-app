import { Router } from 'express';
import { ethers } from 'ethers';

const router = Router();

// GTT Token Configuration (Plan B)
const GTT_CONFIG = {
  contractAddress: '0x742d35Cc66535C0532925a3b8d0E9B01d9c5d9A6C',
  totalSupply: 1000000000, // 1B GTT
  network: 'Polygon',
  chainId: 137
};

// Live token data endpoint
router.get('/live-data', async (req, res) => {
  try {
    // In production, this would aggregate data from:
    // - CoinGecko API for price data
    // - DEXScreener for DEX metrics
    // - Polygon blockchain for on-chain data
    // - Exchange APIs for volume data
    
    // Simulated realistic data with small variations
    const basePrice = 0.0075;
    const priceVariation = (Math.random() - 0.5) * 0.0002;
    const currentPrice = Math.max(0.001, basePrice + priceVariation);
    
    const baseVolume = 2450000;
    const volumeVariation = (Math.random() - 0.5) * 100000;
    const currentVolume = Math.max(50000, baseVolume + volumeVariation);
    
    const circulatingSupply = 200000000; // 20% of total supply circulating
    
    const tokenData = {
      price: currentPrice,
      priceChange24h: 12.34 + (Math.random() - 0.5) * 5, // ±2.5% variation
      volume24h: currentVolume,
      volumeChange24h: 18.7 + (Math.random() - 0.5) * 10, // ±5% variation
      marketCap: currentPrice * circulatingSupply,
      totalSupply: GTT_CONFIG.totalSupply,
      circulatingSupply: circulatingSupply,
      holders: 8547 + Math.floor(Math.random() * 20), // Slowly growing
      transactions24h: 1234 + Math.floor(Math.random() * 50),
      lastUpdated: new Date().toISOString(),
      
      // Additional metrics
      burnRate: 2.5, // 2.5% burn rate from transactions
      stakingApr: 15.2, // 15.2% APR for staking
      liquidityPools: [
        {
          pair: 'GTT/MATIC',
          exchange: 'QuickSwap',
          liquidity: 450000,
          volume24h: currentVolume * 0.6
        },
        {
          pair: 'GTT/USDC',
          exchange: 'SushiSwap',
          liquidity: 280000,
          volume24h: currentVolume * 0.4
        }
      ],
      
      // Plan B specific metrics
      feesCollected24h: currentVolume * 0.08, // 8% transaction fee
      foundationTreasury: 15200000, // Foundation treasury balance
      communityRewards: 8900000, // Community rewards pool
    };

    res.json(tokenData);
  } catch (error) {
    console.error('Error fetching live token data:', error);
    res.status(500).json({ error: 'Failed to fetch token data' });
  }
});

// Historical price data endpoint
router.get('/history/:timeframe', async (req, res) => {
  try {
    const { timeframe } = req.params; // 1h, 24h, 7d, 30d, 90d, 1y
    
    // Generate realistic historical data
    const dataPoints = timeframe === '1h' ? 60 : 
                      timeframe === '24h' ? 24 : 
                      timeframe === '7d' ? 7 : 
                      timeframe === '30d' ? 30 : 
                      timeframe === '90d' ? 90 : 365;
    
    const basePrice = 0.0075;
    const historical = [];
    
    for (let i = dataPoints; i >= 0; i--) {
      const timeAgo = new Date();
      if (timeframe === '1h') {
        timeAgo.setMinutes(timeAgo.getMinutes() - i);
      } else if (timeframe === '24h') {
        timeAgo.setHours(timeAgo.getHours() - i);
      } else {
        timeAgo.setDate(timeAgo.getDate() - i);
      }
      
      // Simulate price movements with trend
      const trend = Math.sin(i * 0.1) * 0.0005; // Overall upward trend
      const noise = (Math.random() - 0.5) * 0.0002; // Random variation
      const price = Math.max(0.001, basePrice + trend + noise);
      
      historical.push({
        timestamp: timeAgo.toISOString(),
        price: price,
        volume: 2000000 + (Math.random() * 1000000)
      });
    }
    
    res.json({
      timeframe,
      data: historical
    });
  } catch (error) {
    console.error('Error fetching historical data:', error);
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
});

// Token metrics summary
router.get('/metrics', async (req, res) => {
  try {
    const currentPrice = 0.0075;
    const circulatingSupply = 200000000;
    
    const metrics = {
      // Core metrics
      price: currentPrice,
      marketCap: currentPrice * circulatingSupply,
      fullyDilutedMarketCap: currentPrice * GTT_CONFIG.totalSupply,
      volume24h: 2450000,
      
      // Supply metrics
      totalSupply: GTT_CONFIG.totalSupply,
      circulatingSupply: circulatingSupply,
      maxSupply: GTT_CONFIG.totalSupply,
      
      // Distribution (Plan B)
      distribution: {
        founderAllocation: 200000000, // 20%
        communityRewards: 400000000,  // 40%
        protocolDevelopment: 250000000, // 25%
        enterprisePartnerships: 150000000 // 15%
      },
      
      // Financial metrics
      transactionFeeRate: 8.0, // 8% fee structure
      burnRate: 2.5, // 2.5% of fees burned
      stakingApr: 15.2,
      
      // Network stats
      holders: 8567,
      transactions24h: 1284,
      network: GTT_CONFIG.network,
      contractAddress: GTT_CONFIG.contractAddress
    };
    
    res.json(metrics);
  } catch (error) {
    console.error('Error fetching token metrics:', error);
    res.status(500).json({ error: 'Failed to fetch token metrics' });
  }
});

export default router;