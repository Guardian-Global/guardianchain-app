import { useQuery } from "@tanstack/react-query";
import { api } from "../../../lib/apiClient";

export interface UserStats {
  truthScore: number;
  gttEarned: number;
  capsulesCreated: number;
  capsulesVerified: number;
  reputationTier: string;
  totalViews: number;
  totalLikes: number;
  totalShares: number;
}

export function useUserStats() {
  return useQuery({
    queryKey: ['/api/user/stats'],
    queryFn: () => api.user.getStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useUserTier() {
  return useQuery({
    queryKey: ['/api/get-user-tier'],
    queryFn: () => api.user.getTier(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}