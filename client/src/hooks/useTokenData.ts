import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface TokenData {
  price: number;
  priceChange24h: number;
  volume24h: number;
  volumeChange24h: number;
  marketCap: number;
  totalSupply: number;
  circulatingSupply: number;
  holders: number;
  transactions24h: number;
  lastUpdated: string;
  burnRate: number;
  stakingApr: number;
  liquidityPools: Array<{
    pair: string;
    exchange: string;
    liquidity: number;
    volume24h: number;
  }>;
  feesCollected24h: number;
  foundationTreasury: number;
  communityRewards: number;
}

export function useTokenData() {
  const { data: tokenData, isLoading, error } = useQuery({
    queryKey: ['token-live-data'],
    queryFn: async (): Promise<TokenData> => {
      const response = await fetch('/api/token/live-data');
      if (!response.ok) {
        throw new Error('Failed to fetch token data');
      }
      return response.json();
    },
    refetchInterval: 120000, // Refetch every 2 minutes instead of 30 seconds
    staleTime: 100000, // Consider data stale after 100 seconds
  });

  const { data: historicalData } = useQuery({
    queryKey: ['token-history', '24h'],
    queryFn: async () => {
      const response = await fetch('/api/token/history/24h');
      if (!response.ok) {
        throw new Error('Failed to fetch historical data');
      }
      return response.json();
    },
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  const { data: metrics } = useQuery({
    queryKey: ['token-metrics'],
    queryFn: async () => {
      const response = await fetch('/api/token/metrics');
      if (!response.ok) {
        throw new Error('Failed to fetch token metrics');
      }
      return response.json();
    },
    refetchInterval: 60000, // Refetch every minute
  });

  return {
    tokenData,
    historicalData,
    metrics,
    isLoading,
    error
  };
}

export function useRealtimeTokenPrice() {
  const [price, setPrice] = useState(0.0075);
  const [change24h, setChange24h] = useState(12.34);

  useEffect(() => {
    // Simulate real-time price updates
    const interval = setInterval(() => {
      const priceVariation = (Math.random() - 0.5) * 0.0002;
      const changeVariation = (Math.random() - 0.5) * 2;
      
      setPrice(prev => Math.max(0.001, prev + priceVariation));
      setChange24h(prev => prev + changeVariation);
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  return { price, change24h };
}