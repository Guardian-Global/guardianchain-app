import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface SupabaseAsset {
  id: string;
  name: string;
  bucket: string;
  url: string;
  size: number;
  lastModified: string;
  type: string;
  category: string;
  value: number;
  recommendedUsage: string[];
  metadata: any;
}

interface AssetRecommendations {
  immediate: Array<{
    location: string;
    asset: SupabaseAsset;
    priority: string;
  }>;
  categories: {
    branding: SupabaseAsset[];
    hero: SupabaseAsset[];
    backgrounds: SupabaseAsset[];
    icons: SupabaseAsset[];
    showcase: SupabaseAsset[];
  };
}

interface AssetsDiscoveryResponse {
  success: boolean;
  totalAssets: number;
  buckets: number;
  assets: SupabaseAsset[];
  recommendations: AssetRecommendations;
}

export function useSupabaseAssets() {
  const {
    data: assetsData,
    isLoading,
    error,
    refetch,
  } = useQuery<AssetsDiscoveryResponse>({
    queryKey: ["supabase-assets"],
    queryFn: async () => {
      const response = await fetch("/api/supabase/assets/discover");
      if (!response.ok) {
        throw new Error("Failed to discover assets");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // Helper functions for easy asset access
  const getAssetsByCategory = (category: string): SupabaseAsset[] => {
    return (
      assetsData?.assets.filter((asset) => asset.category === category) || []
    );
  };

  const getAssetsByType = (type: string): SupabaseAsset[] => {
    return assetsData?.assets.filter((asset) => asset.type === type) || [];
  };

  const getHighestValueAssets = (count: number = 10): SupabaseAsset[] => {
    return assetsData?.assets.slice(0, count) || [];
  };

  const getAssetForUsage = (usage: string): SupabaseAsset | null => {
    const asset = assetsData?.assets.find((asset) =>
      asset.recommendedUsage.includes(usage),
    );
    return asset || null;
  };

  const getBrandingAssets = (): SupabaseAsset[] => {
    return getAssetsByCategory("branding");
  };

  const getHeroAssets = (): SupabaseAsset[] => {
    return getAssetsByCategory("hero");
  };

  const getBackgroundAssets = (): SupabaseAsset[] => {
    return getAssetsByCategory("background");
  };

  const getOptimizedUrl = async (
    asset: SupabaseAsset,
    options?: {
      width?: number;
      height?: number;
      quality?: number;
      format?: string;
    },
  ): Promise<string> => {
    if (!options) return asset.url;

    const params = new URLSearchParams();
    if (options.width) params.set("width", options.width.toString());
    if (options.height) params.set("height", options.height.toString());
    if (options.quality) params.set("quality", options.quality.toString());
    if (options.format) params.set("format", options.format);

    const response = await fetch(
      `/api/supabase/assets/optimized/${asset.bucket}/${asset.name}?${params.toString()}`,
    );

    if (response.ok) {
      const data = await response.json();
      return data.url || asset.url;
    }

    return asset.url;
  };

  return {
    // Data
    assets: assetsData?.assets || [],
    recommendations: assetsData?.recommendations,
    totalAssets: assetsData?.totalAssets || 0,
    buckets: assetsData?.buckets || 0,

    // Status
    isLoading,
    error,
    isSuccess: !!assetsData?.success,

    // Helper functions
    getAssetsByCategory,
    getAssetsByType,
    getHighestValueAssets,
    getAssetForUsage,
    getBrandingAssets,
    getHeroAssets,
    getBackgroundAssets,
    getOptimizedUrl,
    refetch,
  };
}

// Hook for specific asset categories
export function useBrandingAssets() {
  const { getBrandingAssets, isLoading, error } = useSupabaseAssets();
  return {
    brandingAssets: getBrandingAssets(),
    isLoading,
    error,
  };
}

export function useHeroAssets() {
  const { getHeroAssets, isLoading, error } = useSupabaseAssets();
  return {
    heroAssets: getHeroAssets(),
    isLoading,
    error,
  };
}

export function useBackgroundAssets() {
  const { getBackgroundAssets, isLoading, error } = useSupabaseAssets();
  return {
    backgroundAssets: getBackgroundAssets(),
    isLoading,
    error,
  };
}
