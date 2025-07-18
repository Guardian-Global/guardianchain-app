import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, BarChart3, Zap, Award } from "lucide-react";
import { BRAND_COLORS } from "@/lib/constants";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface YieldDataPoint {
  date: string;
  yieldAmount: number;
  emotionalResonance: number;
  viewCount: number;
  verificationCount: number;
  shareCount: number;
}

interface CapsuleAnalyticsProps {
  capsuleId: string;
  timeRange?: "7d" | "30d" | "90d" | "1y";
}

export default function CapsuleAnalyticsChart({ capsuleId, timeRange = "30d" }: CapsuleAnalyticsProps) {
  const [dataPoints, setDataPoints] = useState<YieldDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalYield, setTotalYield] = useState(0);
  const [avgResonance, setAvgResonance] = useState(0);

  useEffect(() => {
    async function fetchAnalyticsData() {
      setIsLoading(true);
      
      // Generate realistic demo data based on capsule ID and time range
      const generateMockData = (id: string, range: string): YieldDataPoint[] => {
        const days = range === "7d" ? 7 : range === "30d" ? 30 : range === "90d" ? 90 : 365;
        const data: YieldDataPoint[] = [];
        
        for (let i = days - 1; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          
          // Create varied performance patterns based on capsule ID
          const baseMultiplier = parseInt(id) % 3 + 1;
          const timeVariation = Math.sin((i / days) * Math.PI * 2) * 0.3 + 0.7;
          const randomFactor = 0.8 + Math.random() * 0.4;
          
          data.push({
            date: date.toISOString().split('T')[0],
            yieldAmount: baseMultiplier * timeVariation * randomFactor * (1 + i / 100),
            emotionalResonance: Math.min(95, 40 + baseMultiplier * 15 + timeVariation * 20 + Math.random() * 10),
            viewCount: Math.floor(baseMultiplier * timeVariation * randomFactor * (50 + i * 2)),
            verificationCount: Math.floor(baseMultiplier * timeVariation * (3 + i / 10)),
            shareCount: Math.floor(baseMultiplier * timeVariation * (8 + i / 5)),
          });
        }
        
        return data;
      };

      const mockData = generateMockData(capsuleId, timeRange);
      setDataPoints(mockData);
      
      // Calculate totals
      const total = mockData.reduce((sum, point) => sum + point.yieldAmount, 0);
      const avgRes = mockData.reduce((sum, point) => sum + point.emotionalResonance, 0) / mockData.length;
      
      setTotalYield(total);
      setAvgResonance(avgRes);
      setIsLoading(false);
    }

    fetchAnalyticsData();
  }, [capsuleId, timeRange]);

  const yieldChartData = {
    labels: dataPoints.map(dp => {
      const date = new Date(dp.date);
      return timeRange === "7d" ? 
        date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) :
        date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }),
    datasets: [
      {
        label: "Daily Yield (GTT)",
        data: dataPoints.map(dp => dp.yieldAmount),
        borderColor: BRAND_COLORS.GUARDIAN,
        backgroundColor: `${BRAND_COLORS.GUARDIAN}20`,
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Emotional Resonance",
        data: dataPoints.map(dp => dp.emotionalResonance),
        borderColor: "#FF6B9D",
        backgroundColor: "#FF6B9D20",
        tension: 0.4,
        fill: true,
        yAxisID: "y1",
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const engagementChartData = {
    labels: dataPoints.slice(-7).map(dp => {
      const date = new Date(dp.date);
      return date.toLocaleDateString("en-US", { weekday: "short" });
    }),
    datasets: [
      {
        label: "Views",
        data: dataPoints.slice(-7).map(dp => dp.viewCount),
        backgroundColor: "#4ECDC4",
        borderRadius: 6,
      },
      {
        label: "Verifications",
        data: dataPoints.slice(-7).map(dp => dp.verificationCount),
        backgroundColor: "#45B7D1",
        borderRadius: 6,
      },
      {
        label: "Shares",
        data: dataPoints.slice(-7).map(dp => dp.shareCount),
        backgroundColor: "#96CEB4",
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: "#334155",
        },
        ticks: {
          color: "#94A3B8",
        },
      },
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        grid: {
          color: "#334155",
        },
        ticks: {
          color: "#94A3B8",
        },
        title: {
          display: true,
          text: "GTT Yield",
          color: "#94A3B8",
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: "#94A3B8",
        },
        title: {
          display: true,
          text: "Emotional Resonance (%)",
          color: "#94A3B8",
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#94A3B8",
        },
      },
      tooltip: {
        backgroundColor: "#1E293B",
        titleColor: "#F1F5F9",
        bodyColor: "#E2E8F0",
        borderColor: "#475569",
        borderWidth: 1,
      },
    },
  };

  const engagementOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: "#334155",
        },
        ticks: {
          color: "#94A3B8",
        },
      },
      y: {
        grid: {
          color: "#334155",
        },
        ticks: {
          color: "#94A3B8",
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#94A3B8",
        },
      },
      tooltip: {
        backgroundColor: "#1E293B",
        titleColor: "#F1F5F9",
        bodyColor: "#E2E8F0",
        borderColor: "#475569",
        borderWidth: 1,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Performance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Yield</p>
                <p className="text-2xl font-bold text-white">
                  {totalYield.toFixed(2)} GTT
                </p>
              </div>
              <Zap className="w-8 h-8" style={{ color: BRAND_COLORS.GUARDIAN }} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Avg Resonance</p>
                <p className="text-2xl font-bold text-white">
                  {avgResonance.toFixed(0)}%
                </p>
              </div>
              <Award className="w-8 h-8 text-pink-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Views</p>
                <p className="text-2xl font-bold text-white">
                  {dataPoints.reduce((sum, dp) => sum + dp.viewCount, 0).toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Verifications</p>
                <p className="text-2xl font-bold text-white">
                  {dataPoints.reduce((sum, dp) => sum + dp.verificationCount, 0)}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Yield & Resonance Chart */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <TrendingUp className="w-5 h-5" style={{ color: BRAND_COLORS.GUARDIAN }} />
            Yield & Emotional Resonance Trends
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className="border-purple-400 text-purple-300">
              Capsule #{capsuleId}
            </Badge>
            <Badge variant="outline" className="border-slate-500 text-slate-300">
              {timeRange} view
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Line data={yieldChartData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>

      {/* Engagement Metrics */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <BarChart3 className="w-5 h-5" style={{ color: BRAND_COLORS.GUARDIAN }} />
            Weekly Engagement Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <Bar data={engagementChartData} options={engagementOptions} />
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Performance Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-3">Yield Analysis</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Peak daily yield:</span>
                  <span className="text-white font-medium">
                    {Math.max(...dataPoints.map(dp => dp.yieldAmount)).toFixed(2)} GTT
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Average daily yield:</span>
                  <span className="text-white font-medium">
                    {(totalYield / dataPoints.length).toFixed(2)} GTT
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Yield growth trend:</span>
                  <span className="text-green-400 font-medium">
                    +{((dataPoints[dataPoints.length - 1]?.yieldAmount / dataPoints[0]?.yieldAmount - 1) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-3">Engagement Insights</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Peak resonance:</span>
                  <span className="text-white font-medium">
                    {Math.max(...dataPoints.map(dp => dp.emotionalResonance)).toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Verification rate:</span>
                  <span className="text-white font-medium">
                    {((dataPoints.reduce((sum, dp) => sum + dp.verificationCount, 0) / 
                       dataPoints.reduce((sum, dp) => sum + dp.viewCount, 0)) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Share engagement:</span>
                  <span className="text-blue-400 font-medium">
                    {((dataPoints.reduce((sum, dp) => sum + dp.shareCount, 0) / 
                       dataPoints.reduce((sum, dp) => sum + dp.viewCount, 0)) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}