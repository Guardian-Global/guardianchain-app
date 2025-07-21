import React from 'react';
import { useAssets } from './assets/AssetProvider';

export const SimpleAssetTest: React.FC = () => {
  const { assets, logos, loading, error } = useAssets();

  if (loading) return <div className="text-white">Loading assets...</div>;
  if (error) return <div className="text-red-400">Error: {error}</div>;

  return (
    <div className="bg-slate-800 p-4 rounded text-white">
      <h3 className="text-lg font-bold mb-4">Asset Test ({assets.length} total)</h3>
      
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Logos ({logos.length}):</h4>
        {logos.slice(0, 3).map((logo, i) => (
          <div key={i} className="mb-2">
            <p className="text-xs text-slate-300">{logo.name}</p>
            <img 
              src={logo.url} 
              alt={logo.name}
              className="h-8 w-auto border border-slate-600"
              onLoad={() => console.log('✅ Loaded:', logo.name)}
              onError={() => console.error('❌ Failed:', logo.name)}
            />
          </div>
        ))}
      </div>

      <div className="text-xs text-slate-400">
        <p>First logo URL: {logos[0]?.url}</p>
        <p>Total assets: {assets.length}</p>
      </div>
    </div>
  );
};