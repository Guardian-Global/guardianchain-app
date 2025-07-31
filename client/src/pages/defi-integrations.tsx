import React from 'react';
import { DeFiIntegrations } from '@/components/trading/DeFiIntegrations';

export default function DeFiIntegrationsPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">DeFi Protocol Integrations</h1>
          <p className="text-slate-400">
            Access deep liquidity pools, yield farming, and institutional DeFi strategies
          </p>
        </div>
        
        <DeFiIntegrations />
      </div>
    </div>
  );
}