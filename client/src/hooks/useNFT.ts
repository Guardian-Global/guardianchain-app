import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../lib/apiClient";

export enum RarityTier {
  Common = 'Common',
  Uncommon = 'Uncommon',
  Rare = 'Rare',
  Epic = 'Epic',
  Legendary = 'Legendary',
}

export interface NFTMintRequest {
  capsuleId?: string;
  rarity?: RarityTier;
  boostedAPY?: number; // basis points
  earlyDAOAccess?: boolean;
  stakingMultiplier?: number; // basis points
  tierName?: string;
  mintTime?: number;
  metadata?: Record<string, unknown>;
}

export function useMintNFT() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NFTMintRequest) => api.nft.mint(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/capsules"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
    },
  });
}

export function useNFTMetadata(tokenId: string) {
  return useQuery({
    queryKey: ["/api/nft/metadata", tokenId],
    queryFn: () => api.nft.getMetadata(tokenId),
    enabled: !!tokenId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}
