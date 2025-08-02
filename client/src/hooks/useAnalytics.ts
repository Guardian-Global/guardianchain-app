import { useQuery } from "@tanstack/react-query";
import { api } from "../../../lib/apiClient";

export interface AnalyticsData {
  total: number;
  minted: number;
  sealed: number;
  languages: string[];
  truthScore: number;
  gttEarned: number;
  verificationRate: number;
  growthRate: number;
  activeValidators: number;
  topCategories: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
}

export function useAnalytics() {
  return useQuery({
    queryKey: ['/api/analytics/capsules'],
    queryFn: () => api.analytics.getCapsules(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

export function useFinancialAnalytics() {
  return useQuery({
    queryKey: ['/api/analytics/financial'],
    queryFn: () => api.analytics.getFinancial(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}