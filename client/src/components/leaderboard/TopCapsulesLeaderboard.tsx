import React from 'react';
import useSWR from 'swr';
import { Trophy, Crown, Medal, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CapsuleReputationBadge from '../reputation/CapsuleReputationBadge';

interface LeaderboardEntry {
  id: string;
  title: string;
  username: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  total_score: number;
}

const getRankIcon = (index: number) => {
  switch (index) {
    case 0: return <Crown className="h-5 w-5 text-[#fbbf24]" />;
    case 1: return <Medal className="h-5 w-5 text-[#8b949e]" />;
    case 2: return <Award className="h-5 w-5 text-[#f59e0b]" />;
    default: return <span className="text-[#8b949e] font-bold">#{index + 1}</span>;
  }
};

export default function TopCapsulesLeaderboard() {
  const { data, isLoading } = useSWR('/api/leaderboard/capsules');

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-[#0d1117] to-[#161b22] border-[#30363d]">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <Trophy className="h-8 w-8 animate-pulse text-[#00ffe1]" />
            <span className="ml-2 text-[#8b949e]">Loading leaderboard...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-[#0d1117] to-[#161b22] border-[#30363d] shadow-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-[#00ffe1] flex items-center gap-3">
          <Trophy className="h-6 w-6" />
          Capsule Leaderboard
        </CardTitle>
        <p className="text-[#8b949e] text-sm">
          Top-performing capsules ranked by community engagement
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data?.map((capsule: LeaderboardEntry, idx: number) => (
            <div
              key={capsule.id}
              className="flex items-center justify-between p-4 bg-[#161b22] rounded-lg border border-[#30363d] hover:border-[#00ffe1]/30 transition-colors"
              data-testid={`leaderboard-item-${idx}`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8">
                  {getRankIcon(idx)}
                </div>
                <div>
                  <h3 className="text-[#f0f6fc] font-semibold">
                    {capsule.title}
                  </h3>
                  <p className="text-[#8b949e] text-sm">
                    by {capsule.username}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CapsuleReputationBadge tier={capsule.tier} />
                <div className="text-right">
                  <div className="text-[#00ffe1] font-bold">
                    {capsule.total_score.toLocaleString()}
                  </div>
                  <div className="text-[#8b949e] text-xs">
                    Score
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {(!data || data.length === 0) && (
          <div className="text-center py-8 text-[#8b949e]">
            No capsules found. Start creating and engaging to climb the leaderboard!
          </div>
        )}
      </CardContent>
    </Card>
  );
}