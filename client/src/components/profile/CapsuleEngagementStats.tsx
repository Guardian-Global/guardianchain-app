// CapsuleEngagementStats.tsx — Real-time Capsule Analytics

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';

interface CapsuleEngagementStatsProps {
  capsuleId: string;
}

interface CapsuleStats {
  views: number;
  shares: number;
  unlocks: number;
  last_viewed_at: string;
}

export default function CapsuleEngagementStats({ capsuleId }: CapsuleEngagementStatsProps) {
  const { data, error } = useSWR<CapsuleStats>(`/api/capsule/stats/${capsuleId}`, async (url) => {
    const res = await axios.get(url);
    return res.data;
  }, {
    refreshInterval: 5000, // Refresh every 5 seconds for real-time updates
    revalidateOnFocus: true,
  });

  if (error) return <div className="text-red-500">Error loading capsule stats</div>;
  
  if (!data) {
    return (
      <div className="p-6 bg-[#0f0f0f] text-white rounded-xl shadow-md animate-pulse space-y-3">
        <div className="h-4 w-2/3 bg-[#1c1c1c] rounded"></div>
        <div className="h-4 w-1/2 bg-[#1c1c1c] rounded"></div>
        <div className="h-4 w-1/3 bg-[#1c1c1c] rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-black p-6 rounded-xl text-white shadow-lg border border-slate-700 hover:border-cyan-500/50 transition-all duration-300">
      <h3 className="text-xl font-semibold mb-4 text-cyan-400">Capsule Engagement</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            Views
          </span>
          <span className="text-[#00ffe1] font-bold text-lg">{data.views.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
            Shares
          </span>
          <span className="text-[#00ffe1] font-bold text-lg">{data.shares.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
            Unlocks
          </span>
          <span className="text-[#00ffe1] font-bold text-lg">{data.unlocks.toLocaleString()}</span>
        </div>
        {data.last_viewed_at && (
          <div className="mt-4 pt-3 border-t border-slate-600">
            <span className="text-xs text-gray-500">
              Last viewed: {new Date(data.last_viewed_at).toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}