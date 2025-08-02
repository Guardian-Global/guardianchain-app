import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/queryClient";

export interface TokenData {
  price: number;
  priceChange: number;
  marketCap: number;
  volume24h: number;
  totalSupply: number;
  circulatingSupply: number;
  holders: number;
  yieldRate: number;
  treasuryBalance: number;
}

export function useTokenData() {
  return useQuery({
    queryKey: ["/api/token/live-data"],
    queryFn: () => api.token.getLiveData(),
    refetchInterval: 30 * 1000, // Refresh every 30 seconds
    staleTime: 15 * 1000, // Consider stale after 15 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useTokenHistory() {
  return useQuery({
    queryKey: ["/api/token/history"],
    queryFn: () => api.token.getHistory(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}
