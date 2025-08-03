import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, DollarSign, Star, Award, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface ThemeYieldData {
  theme: string;
  cluster: number;
  gttYield: number;
  engagementScore: number;
  velocityScore: number;
}

interface YieldResponse {
  success: boolean;
  yields: ThemeYieldData[];
  timestamp: string;
}

export default function Rewards() {
  const { data: yieldData, isLoading } = useQuery<YieldResponse>({
    queryKey: ["/api/gtt/theme-yield"],
    refetchInterval: 30000, // Refresh every 30 seconds for live leaderboard
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 2: return <Award className="w-5 h-5 text-gray-400" />;
      case 3: return <Star className="w-5 h-5 text-amber-600" />;
      default: return <Target className="w-5 h-5 text-slate-500" />;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1: return "bg-yellow-400/20 text-yellow-400 border-yellow-400/30";
      case 2: return "bg-gray-400/20 text-gray-400 border-gray-400/30";
      case 3: return "bg-amber-600/20 text-amber-600 border-amber-600/30";
      default: return "bg-slate-600/20 text-slate-400 border-slate-600/30";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 mb-4">🏆 GTT Rewards Leaderboard</h1>
          <p className="text-purple-300 text-lg">Loading theme performance data...</p>
        </div>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-slate-700 rounded-full"></div>
                    <div className="h-4 bg-slate-700 rounded w-32"></div>
                  </div>
                  <div className="h-6 bg-slate-700 rounded w-20"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!yieldData?.yields) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 mb-4">🏆 GTT Rewards Leaderboard</h1>
          <p className="text-purple-300 text-lg">No reward data available</p>
        </div>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-12 text-center">
            <DollarSign className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">No yield data found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sortedYields = [...yieldData.yields].sort((a, b) => b.gttYield - a.gttYield);
  const totalRewards = sortedYields.reduce((sum, item) => sum + item.gttYield, 0);
  const topPerformer = sortedYields[0];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-yellow-400 mb-4">🏆 GTT Rewards Leaderboard</h1>
        <p className="text-purple-300 text-lg max-w-2xl mx-auto">
          Live performance rankings of emotional themes based on engagement velocity and community resonance
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-green-400">{totalRewards.toFixed(1)} GTT</div>
            <div className="text-sm text-slate-300">Total Platform Rewards</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6 text-center">
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-yellow-400">{topPerformer?.theme || "N/A"}</div>
            <div className="text-sm text-slate-300">Leading Theme</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-blue-400">{sortedYields.length}</div>
            <div className="text-sm text-slate-300">Active Clusters</div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard Table */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-purple-300 flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Theme Performance Rankings
          </CardTitle>
          <p className="text-slate-400 text-sm">
            Rankings based on engagement score + velocity score × 1.5 multiplier
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-hidden rounded-lg">
            <table className="w-full">
              <thead className="bg-slate-800 border-b border-slate-700">
                <tr>
                  <th className="text-left p-4 text-slate-300 font-medium">Rank</th>
                  <th className="text-left p-4 text-slate-300 font-medium">Theme</th>
                  <th className="text-left p-4 text-slate-300 font-medium">Cluster</th>
                  <th className="text-left p-4 text-slate-300 font-medium">Engagement</th>
                  <th className="text-left p-4 text-slate-300 font-medium">Velocity</th>
                  <th className="text-right p-4 text-slate-300 font-medium">GTT Yield</th>
                </tr>
              </thead>
              <tbody>
                {sortedYields.map((theme, index) => {
                  const rank = index + 1;
                  const percentage = (theme.gttYield / totalRewards) * 100;
                  
                  return (
                    <tr
                      key={theme.cluster}
                      className="border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {getRankIcon(rank)}
                          <Badge className={`${getRankBadge(rank)} border`}>
                            #{rank}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-white">{theme.theme}</div>
                        <div className="text-xs text-slate-400">
                          {percentage.toFixed(1)}% of total rewards
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className="bg-blue-400/20 text-blue-400">
                          Cluster {theme.cluster}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="text-white font-medium">{theme.engagementScore.toFixed(1)}</div>
                          <div className="w-16 bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-blue-400 h-2 rounded-full"
                              style={{ width: `${(theme.engagementScore / 10) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="text-white font-medium">{theme.velocityScore.toFixed(1)}</div>
                          <div className="w-16 bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-purple-400 h-2 rounded-full"
                              style={{ width: `${(theme.velocityScore / 10) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="text-lg font-bold text-green-400">
                          {theme.gttYield.toFixed(1)} GTT
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Last Updated */}
      <div className="text-center mt-6 text-slate-500 text-sm">
        Last updated: {new Date(yieldData.timestamp).toLocaleString()}
        <span className="ml-2">• Updates every 30 seconds</span>
      </div>
    </div>
  );
}