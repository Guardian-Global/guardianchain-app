import React from 'react';
import { MarketMakerHub } from '@/components/trading/MarketMakerHub';

export default function MarketMakerPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Market Maker Hub</h1>
          <p className="text-slate-400">
            Professional market making strategies and automated liquidity provision
          </p>
        </div>
        
        <MarketMakerHub />
      </div>
    </div>
  );
}