import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Activity, Zap } from "lucide-react";
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

export default function ThemeYieldChart() {
  const { data: yieldData, isLoading } = useQuery<YieldResponse>({
    queryKey: ["/api/gtt/theme-yield"],
    refetchInterval: 60000, // Refresh every minute
  });

  const getYieldColor = (yieldValue: number) => {
    if (yieldValue >= 20) return "text-green-400 bg-green-400/20";
    if (yieldValue >= 15) return "text-yellow-400 bg-yellow-400/20";
    return "text-blue-400 bg-blue-400/20";
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-emerald-400";
    if (score >= 6) return "text-orange-400";
    return "text-slate-400";
  };

  if (isLoading) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-yellow-400 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            GTT Theme Yield Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-slate-800 rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-1/3 mb-2"></div>
                <div className="h-6 bg-slate-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!yieldData?.yields) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="py-8 text-center">
          <DollarSign className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-400">No yield data available</p>
        </CardContent>
      </Card>
    );
  }

  const totalYield = yieldData.yields.reduce((sum, item) => sum + item.gttYield, 0);
  const avgEngagement = yieldData.yields.reduce((sum, item) => sum + item.engagementScore, 0) / yieldData.yields.length;
  const avgVelocity = yieldData.yields.reduce((sum, item) => sum + item.velocityScore, 0) / yieldData.yields.length;

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-yellow-400 flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          GTT Theme Yield Analysis
        </CardTitle>
        <p className="text-slate-400 text-sm">
          Token rewards based on emotional engagement and velocity metrics
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-800 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-slate-300 text-sm">Total Yield</span>
            </div>
            <p className="text-xl font-bold text-green-400">{totalYield.toFixed(1)} GTT</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-slate-300 text-sm">Avg Engagement</span>
            </div>
            <p className="text-xl font-bold text-blue-400">{avgEngagement.toFixed(1)}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-slate-300 text-sm">Avg Velocity</span>
            </div>
            <p className="text-xl font-bold text-purple-400">{avgVelocity.toFixed(1)}</p>
          </div>
        </div>

        {/* Theme Yield Breakdown */}
        <div className="space-y-3">
          <h4 className="text-purple-300 font-medium">Yield by Theme</h4>
          {yieldData.yields
            .sort((a, b) => b.gttYield - a.gttYield)
            .map((theme) => (
              <div key={theme.cluster} className="bg-slate-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h5 className="text-white font-medium">{theme.theme}</h5>
                    <Badge className="bg-slate-700 text-slate-300">
                      Cluster {theme.cluster}
                    </Badge>
                  </div>
                  <Badge className={getYieldColor(theme.gttYield)}>
                    {theme.gttYield} GTT
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Engagement</span>
                    <span className={`font-medium ${getScoreColor(theme.engagementScore)}`}>
                      {theme.engagementScore.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Velocity</span>
                    <span className={`font-medium ${getScoreColor(theme.velocityScore)}`}>
                      {theme.velocityScore.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Yield Progress Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Yield Potential</span>
                    <span>{((theme.gttYield / totalYield) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all"
                      style={{ width: `${(theme.gttYield / totalYield) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))
          }
        </div>

        {/* Last Updated */}
        <div className="text-center text-slate-500 text-xs">
          Last calculated: {new Date(yieldData.timestamp).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}