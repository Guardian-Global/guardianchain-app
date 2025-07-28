import React, { useEffect, useState } from "react";
import {
  distributeYield,
  getYieldDistributionStats,
  getUserYieldSummary,
} from "@/lib/yieldEngine";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  Coins,
  Activity,
  Play,
  BarChart3,
} from "lucide-react";
import { BRAND_COLORS, BRAND_NAME } from "@/lib/constants";

export default function YieldDistributionPage() {
  const [stats, setStats] = useState<any>(null);
  const [lastRun, setLastRun] = useState<string | null>(null);
  const [isDistributing, setIsDistributing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const distributionStats = await getYieldDistributionStats();
      setStats(distributionStats);
      setLastRun(distributionStats.lastDistribution);
    } catch (error) {
      console.error("Failed to load yield stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleDistribute = async () => {
    try {
      setIsDistributing(true);
      await distributeYield();
      await loadStats(); // Refresh stats after distribution
      setLastRun(new Date().toISOString());
    } catch (error) {
      console.error("Yield distribution error:", error);
    } finally {
      setIsDistributing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <section className="pt-20 pb-8 bg-gradient-to-br from-green-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            💰 Capsule Yield Distribution Engine
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            Automated GTT reward distribution system for {BRAND_NAME} creators
          </p>
          <Badge className="bg-green-600 text-white px-4 py-2">
            <Activity className="w-4 h-4 mr-2" />
            {stats?.distributionStatus === "healthy"
              ? "System Healthy"
              : "Monitoring"}
          </Badge>
        </div>
      </section>

      <div className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Distribution Controls */}
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Play
                  className="w-5 h-5 mr-2"
                  style={{ color: BRAND_COLORS.SUCCESS }}
                />
                Yield Distribution Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div>
                  <p className="text-slate-300 mb-2">
                    Distribute pending yield rewards to all eligible capsule
                    creators
                  </p>
                  {lastRun && (
                    <p className="text-sm text-slate-400">
                      Last distribution: {new Date(lastRun).toLocaleString()}
                    </p>
                  )}
                </div>
                <Button
                  onClick={handleDistribute}
                  disabled={isDistributing}
                  className="px-8 py-3"
                  style={{ backgroundColor: BRAND_COLORS.SUCCESS }}
                >
                  {isDistributing ? (
                    <>
                      <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                      Distributing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Run Yield Distribution
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Distribution Statistics */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400 flex items-center">
                    <Coins className="w-4 h-4 mr-2" />
                    Today's Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-400">
                    {stats.totalDistributedToday.toLocaleString()} GTT
                  </p>
                  <p className="text-xs text-slate-500 mt-1">24h Period</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Monthly Total
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-white">
                    {stats.totalDistributedThisMonth.toLocaleString()} GTT
                  </p>
                  <p className="text-xs text-slate-500 mt-1">This Month</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400 flex items-center">
                    <Activity className="w-4 h-4 mr-2" />
                    Active Capsules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: BRAND_COLORS.GUARDIAN }}
                  >
                    {stats.activeCapsules}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Earning Yield</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Total Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-blue-400">
                    {stats.totalUsers}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Active Creators</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Yield Analytics */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">
                        Average Yield per Capsule:
                      </span>
                      <span className="text-green-400 font-semibold">
                        {stats.averageYieldPerCapsule} GTT
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">
                        Top Earning Capsule:
                      </span>
                      <span className="text-yellow-400 font-semibold">
                        {stats.topEarningCapsule} GTT
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">
                        Distribution Status:
                      </span>
                      <Badge
                        className={
                          stats.distributionStatus === "healthy"
                            ? "bg-green-600"
                            : "bg-yellow-600"
                        }
                      >
                        {stats.distributionStatus}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    Distribution Formula
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-slate-300 text-sm">
                      Yield calculation formula:
                    </p>
                    <div className="bg-slate-700/50 p-4 rounded-lg">
                      <code className="text-green-400 text-sm">
                        yield = (views × 0.005) + (shares × 0.01) + (resonance ×
                        0.02)
                      </code>
                    </div>
                    <div className="space-y-2 text-sm text-slate-300">
                      <p>• Veritus verified capsules: 2x multiplier</p>
                      <p>• Tier bonuses applied automatically</p>
                      <p>• Daily distribution at midnight UTC</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recent Activity */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                Recent Distribution Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div>
                    <p className="text-white font-medium">
                      Capsule #1247: "Community Memorial"
                    </p>
                    <p className="text-sm text-slate-400">
                      15.5 GTT distributed to creator
                    </p>
                  </div>
                  <span className="text-xs text-slate-500">2 hours ago</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div>
                    <p className="text-white font-medium">
                      Capsule #1246: "Whistleblower Testimony"
                    </p>
                    <p className="text-sm text-slate-400">
                      8.2 GTT distributed to creator
                    </p>
                  </div>
                  <span className="text-xs text-slate-500">4 hours ago</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div>
                    <p className="text-white font-medium">
                      Capsule #1245: "Legal Evidence Archive"
                    </p>
                    <p className="text-sm text-slate-400">
                      22.1 GTT distributed to creator
                    </p>
                  </div>
                  <span className="text-xs text-slate-500">6 hours ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
