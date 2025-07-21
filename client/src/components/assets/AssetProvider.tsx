import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAllAssets, getAssetsByType, supabase } from '@/lib/supabase';

interface Asset {
  id: string;
  name: string;
  bucket: string;
  type: string;
  url: string;
  size: number;
  lastModified: string;
  metadata?: any;
}

interface AssetContextType {
  assets: Asset[];
  logos: Asset[];
  videos: Asset[];
  nftIcons: Asset[];
  capsuleArt: Asset[];
  loading: boolean;
  error: string | null;
  refreshAssets: () => Promise<void>;
  getAssetByName: (name: string) => Asset | null;
  getAssetsByPattern: (pattern: string) => Asset[];
}

const AssetContext = createContext<AssetContextType | null>(null);

export const useAssets = () => {
  const context = useContext(AssetContext);
  if (!context) {
    throw new Error('useAssets must be used within an AssetProvider');
  }
  return context;
};

export const AssetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshAssets = async () => {
    if (!supabase) {
      setError('Supabase not configured. Please add your Supabase credentials.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const allAssets = await getAllAssets();
      setAssets(allAssets);
      
      console.log(`🎨 Loaded ${allAssets.length} assets from Supabase:`, {
        logos: allAssets.filter(a => a.name.toLowerCase().includes('logo')).length,
        videos: allAssets.filter(a => a.type === 'video').length,
        images: allAssets.filter(a => a.type === 'image').length,
        nfts: allAssets.filter(a => a.name.toLowerCase().includes('nft') || a.name.toLowerCase().includes('guardian')).length
      });
      
    } catch (err) {
      console.error('Error loading assets:', err);
      setError('Failed to load assets: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAssets();
  }, []);

  const getAssetByName = (name: string): Asset | null => {
    return assets.find(asset => 
      asset.name.toLowerCase().includes(name.toLowerCase())
    ) || null;
  };

  const getAssetsByPattern = (pattern: string): Asset[] => {
    return assets.filter(asset => 
      asset.name.toLowerCase().includes(pattern.toLowerCase()) ||
      asset.bucket.toLowerCase().includes(pattern.toLowerCase())
    );
  };

  // Categorize assets
  const logos = assets.filter(asset => 
    asset.name.toLowerCase().includes('logo') || 
    asset.name.toLowerCase().includes('brand') ||
    asset.bucket.toLowerCase().includes('logo')
  );

  const videos = assets.filter(asset => asset.type === 'video');
  
  const nftIcons = assets.filter(asset => 
    asset.name.toLowerCase().includes('nft') || 
    asset.name.toLowerCase().includes('guardian') ||
    asset.name.toLowerCase().includes('icon') ||
    asset.bucket.toLowerCase().includes('nft')
  );

  const capsuleArt = assets.filter(asset => 
    asset.name.toLowerCase().includes('capsule') || 
    asset.name.toLowerCase().includes('cover') ||
    asset.name.toLowerCase().includes('art') ||
    asset.bucket.toLowerCase().includes('capsule')
  );

  return (
    <AssetContext.Provider 
      value={{
        assets,
        logos,
        videos,
        nftIcons,
        capsuleArt,
        loading,
        error,
        refreshAssets,
        getAssetByName,
        getAssetsByPattern
      }}
    >
      {children}
    </AssetContext.Provider>
  );
};