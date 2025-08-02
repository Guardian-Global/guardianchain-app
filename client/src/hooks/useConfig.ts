import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ProjectConfig {
  projectName: string;
  defaultTier: string;
  projectStatus: string;
  veritasSealRequired: boolean;
  stripeEnabled: boolean;
  capsuleReplayFee: number;
  griefScoreEnabled: boolean;
  aiModeration: string;
  ipfsPinning: string;
  allowedWallets: string[];
  network: string;
}

const defaultConfig: ProjectConfig = {
  projectName: "GuardianChain",
  defaultTier: "guest",
  projectStatus: "production",
  veritasSealRequired: true,
  stripeEnabled: true,
  capsuleReplayFee: 2.50,
  griefScoreEnabled: true,
  aiModeration: "on",
  ipfsPinning: "pinata",
  allowedWallets: ["metamask", "walletconnect"],
  network: "polygon-mainnet"
};

export function useConfig() {
  return useQuery({
    queryKey: ["/api/config"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/config");
        return await response.json();
      } catch (error) {
        console.warn("Config fetch failed, using fallback:", error);
        return defaultConfig;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });
}