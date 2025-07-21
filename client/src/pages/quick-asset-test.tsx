import React from 'react';
import { useAssets } from "@/components/assets/AssetProvider";

export default function QuickAssetTest() {
  const { assets, logos, videos, nftIcons, capsuleArt, loading, error } = useAssets();

  return (
    <div className="min-h-screen bg-slate-900 pt-20 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Quick Asset Test</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-4">Loading Status</h2>
            <p>Loading: {loading ? 'Yes' : 'No'}</p>
            <p>Error: {error || 'None'}</p>
            <p>Total Assets: {assets.length}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Asset Breakdown</h2>
            <p>Logos: {logos.length}</p>
            <p>Videos: {videos.length}</p>
            <p>NFT Icons: {nftIcons.length}</p>
            <p>Capsule Art: {capsuleArt.length}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Raw Asset List</h2>
            <div className="bg-slate-800 p-4 rounded max-h-96 overflow-y-auto">
              {assets.map((asset, index) => (
                <div key={index} className="mb-2 text-sm">
                  <strong>{asset.name}</strong> - {asset.type} - {asset.bucket}
                  <br />
                  <a href={asset.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                    {asset.url}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Direct Image Display Test</h2>
            {assets.filter(a => a.type === 'image').slice(0, 5).map((asset, index) => (
              <div key={index} className="mb-4">
                <p className="mb-2">{asset.name}</p>
                <img 
                  src={asset.url} 
                  alt={asset.name}
                  className="max-w-xs max-h-32 object-contain border border-slate-600"
                  onError={(e) => {
                    console.error('Failed to load image:', asset.url);
                    (e.target as HTMLImageElement).style.border = '2px solid red';
                  }}
                  onLoad={() => {
                    console.log('Successfully loaded image:', asset.url);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}