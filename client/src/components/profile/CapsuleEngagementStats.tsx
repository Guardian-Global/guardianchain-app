import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface CapsuleEngagementStatsProps {
  capsuleId: string;
}

interface CapsuleStats {
  views: number;
  shares: number;
  unlocks: number;
  gttEarned: number;
  verifications: number;
  lastActivity: string;
}

export default function CapsuleEngagementStats({ capsuleId }: CapsuleEngagementStatsProps) {
  const { data, error, isLoading } = useQuery<CapsuleStats>({
    queryKey: [`/api/capsule/stats/${capsuleId}`],
    enabled: !!capsuleId,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (error) return <div className="text-red-500">Error loading capsule stats</div>;
  
  if (isLoading || !data) {
    return (
      <div className="p-6 bg-[#0f0f0f] text-white rounded-xl shadow-md animate-pulse space-y-3">
        <div className="h-4 w-2/3 bg-[#1c1c1c] rounded"></div>
        <div className="h-4 w-1/2 bg-[#1c1c1c] rounded"></div>
        <div className="h-4 w-1/3 bg-[#1c1c1c] rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-black p-6 rounded-xl text-white shadow-lg border border-[#30363d]">
      <h3 className="text-xl font-semibold mb-2">Capsule Engagement</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-400">Views</span>
          <span className="text-[#00ffe1] font-bold">{data.views.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Shares</span>
          <span className="text-[#00ffe1] font-bold">{data.shares.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Unlocks</span>
          <span className="text-[#00ffe1] font-bold">{data.unlocks.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">GTT Earned</span>
          <span className="text-[#ff00d4] font-bold">{data.gttEarned?.toLocaleString() || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Verifications</span>
          <span className="text-purple-400 font-bold">{data.verifications?.toLocaleString() || 0}</span>
        </div>
      </div>
    </div>
  );
}