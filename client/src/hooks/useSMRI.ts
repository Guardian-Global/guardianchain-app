import { useQuery } from "@tanstack/react-query";
import { api } from "../../../lib/apiClient";

export interface SMRIData {
  wallet: string;
  truth_score: number;
  grief_total: number;
  capsule_count: number;
  influence_count: number;
  cert_count: number;
  reputation_tier: string;
  last_updated: string;
  trending: string;
}

export function useSMRI(wallet: string) {
  return useQuery({
    queryKey: ["/api/smri", wallet],
    queryFn: () => api.smri.getByWallet(wallet),
    enabled: !!wallet,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useSMRILeaderboard() {
  return useQuery({
    queryKey: ["/api/smri/leaderboard"],
    queryFn: () => api.smri.getLeaderboard(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}
