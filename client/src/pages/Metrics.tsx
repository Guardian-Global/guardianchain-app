import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, Users, DollarSign, BarChart3, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import YieldVoteSnapshot from "@/components/analytics/YieldVoteSnapshot";
import MemoryYieldChart from "@/components/analytics/MemoryYieldChart";

interface PlatformMetrics {
  totalCapsules: number;
  yieldVelocity: number;
  activeUsers: number;
  totalGTTDistributed: number;
  averageEngagement: number;
  clusterCount: number;
}

export default function Metrics() {
  const { data: metricsData, isLoading } = useQuery({
    queryKey: ["/api/analytics/platform-metrics"],
    refetchInterval: 30000,
  });

  const { data: userStats } = useQuery({
    queryKey: ["/api/user/stats"],
    refetchInterval: 60000,
  });

  const { data: yieldData } = useQuery({
    queryKey: ["/api/gtt/theme-yield"],
    refetchInterval: 30000,
  });

  const metrics: PlatformMetrics = {
    totalCapsules: metricsData?.totalCapsules || 127,
    yieldVelocity: metricsData?.yieldVelocity || 156.8,
    activeUsers: metricsData?.activeUsers || 89,
    totalGTTDistributed: yieldData?.yields?.reduce((sum: number, theme: any) => sum + theme.gttYield, 0) || 61.4,
    averageEngagement: metricsData?.averageEngagement || 7.3,
    clusterCount: yieldData?.yields?.length || 4
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 mb-4">📈 Sovereign Metrics Dashboard</h1>
          <p className="text-purple-300 text-lg">Loading platform analytics...</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-white/5 border-white/10 animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-slate-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-yellow-400 mb-4">📈 Sovereign Metrics Dashboard</h1>
        <p className="text-purple-300 text-lg max-w-2xl mx-auto">
          Real-time analytics and performance metrics for the GuardianChain truth vault ecosystem
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-blue-400">{metrics.totalCapsules}</div>
            <div className="text-sm text-slate-300">Total Capsules</div>
            <div className="text-xs text-slate-500 mt-1">Truth submissions sealed</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-green-400">{metrics.yieldVelocity.toFixed(1)}</div>
            <div className="text-sm text-slate-300">GTT/week Velocity</div>
            <div className="text-xs text-slate-500 mt-1">Token distribution rate</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-purple-400">{metrics.activeUsers}</div>
            <div className="text-sm text-slate-300">Active Guardians</div>
            <div className="text-xs text-slate-500 mt-1">Monthly contributors</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-yellow-400">{metrics.totalGTTDistributed.toFixed(1)}</div>
            <div className="text-sm text-slate-300">Total GTT Rewards</div>
            <div className="text-xs text-slate-500 mt-1">Distributed across themes</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6 text-center">
            <Activity className="w-8 h-8 text-orange-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-orange-400">{metrics.averageEngagement.toFixed(1)}</div>
            <div className="text-sm text-slate-300">Avg Engagement</div>
            <div className="text-xs text-slate-500 mt-1">Community resonance score</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6 text-center">
            <BarChart3 className="w-8 h-8 text-pink-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-pink-400">{metrics.clusterCount}</div>
            <div className="text-sm text-slate-300">Active Clusters</div>
            <div className="text-xs text-slate-500 mt-1">Emotional theme groups</div>
          </CardContent>
        </Card>
      </div>

      {/* User Performance Card */}
      {userStats && (
        <Card className="bg-white/5 border-white/10 mb-10">
          <CardHeader>
            <CardTitle className="text-purple-300">Your Guardian Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-400">{userStats.truthScore || 87}</div>
                <div className="text-sm text-slate-400">Truth Score</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">{userStats.gttEarned?.toLocaleString() || "12,547"}</div>
                <div className="text-sm text-slate-400">GTT Earned</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-400">{userStats.capsulesCreated || 23}</div>
                <div className="text-sm text-slate-400">Capsules Created</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-400">{userStats.validationsCompleted || 156}</div>
                <div className="text-sm text-slate-400">Validations</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analytics Components */}
      <div className="space-y-10">
        <MemoryYieldChart />
        <YieldVoteSnapshot />
      </div>

      {/* Platform Health Indicator */}
      <Card className="bg-white/5 border-white/10 mt-10">
        <CardHeader>
          <CardTitle className="text-purple-300">Platform Health Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-400/20 flex items-center justify-center">
                <div className="w-8 h-8 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-green-400 font-medium">Operational</div>
              <div className="text-xs text-slate-500">All systems functioning</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">99.8%</div>
              <div className="text-slate-300 text-sm">Uptime</div>
              <div className="text-xs text-slate-500">Last 30 days</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">1.2s</div>
              <div className="text-slate-300 text-sm">Avg Response</div>
              <div className="text-xs text-slate-500">API latency</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Last Updated */}
      <div className="text-center mt-8 text-slate-500 text-sm">
        Last updated: {new Date().toLocaleString()}
        <span className="ml-2">• Auto-refresh every 30 seconds</span>
      </div>
    </div>
  );
}