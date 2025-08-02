import { useEffect, useState } from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

interface AnalyticsData {
  dailyReplays: { labels: string[]; counts: number[] };
  griefTierDistribution: { labels: string[]; data: number[] };
  yieldDistribution: { total: number; byTier: number[] };
  topCapsules: Array<{
    id: string;
    title: string;
    replays: number;
    yield: number;
  }>;
}

export default function AnalyticsDashboard() {
  const {
    data: analyticsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/analytics/dashboard"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-red-500">Failed to load analytics data</p>
        </CardContent>
      </Card>
    );
  }

  const data = analyticsData as AnalyticsData;

  const dailyReplayChart = {
    labels: data?.dailyReplays?.labels || [],
    datasets: [
      {
        label: "Daily Replays",
        data: data?.dailyReplays?.counts || [],
        backgroundColor: "rgba(99, 102, 241, 0.5)",
        borderColor: "rgb(99, 102, 241)",
        borderWidth: 2,
      },
    ],
  };

  const griefTierChart = {
    labels: data?.griefTierDistribution?.labels || [
      "Tier 1",
      "Tier 2",
      "Tier 3",
      "Tier 4",
      "Tier 5",
    ],
    datasets: [
      {
        data: data?.griefTierDistribution?.data || [0, 0, 0, 0, 0],
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(147, 51, 234, 0.8)",
        ],
        borderWidth: 0,
      },
    ],
  };

  const yieldChart = {
    labels: ["Tier 1", "Tier 2", "Tier 3", "Tier 4", "Tier 5"],
    datasets: [
      {
        label: "GTT Yield Distribution",
        data: data?.yieldDistribution?.byTier || [0, 0, 0, 0, 0],
        backgroundColor: "rgba(168, 85, 247, 0.5)",
        borderColor: "rgb(168, 85, 247)",
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Replays</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20m8-10H4" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.dailyReplays?.counts?.reduce((a, b) => a + b, 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">Last 14 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total GTT Yield
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20m8-10H4" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.yieldDistribution?.total || 0} GTT
            </div>
            <p className="text-xs text-muted-foreground">
              Distributed to authors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Capsules
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.topCapsules?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              With recent activity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Grief Tier
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.griefTierDistribution?.data
                ? (
                    data.griefTierDistribution.data.reduce(
                      (sum, count, index) => sum + count * (index + 1),
                      0,
                    ) /
                    data.griefTierDistribution.data.reduce(
                      (sum, count) => sum + count,
                      0,
                    )
                  ).toFixed(1)
                : "0.0"}
            </div>
            <p className="text-xs text-muted-foreground">Platform average</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="yield">Yield</TabsTrigger>
          <TabsTrigger value="top">Top Capsules</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Replay Activity</CardTitle>
              <CardDescription>
                Capsule replays over the last 14 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Bar data={dailyReplayChart} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Grief Tier Distribution</CardTitle>
              <CardDescription>
                Distribution of capsules by grief tier
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Doughnut
                  data={griefTierChart}
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="yield" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>GTT Yield by Tier</CardTitle>
              <CardDescription>
                GTT token distribution across grief tiers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Line data={yieldChart} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="top" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Capsules</CardTitle>
              <CardDescription>
                Capsules with highest replay activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.topCapsules?.map((capsule, index) => (
                  <div
                    key={capsule.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{capsule.title}</p>
                        <p className="text-sm text-gray-500">
                          {capsule.replays} replays
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">
                        {capsule.yield} GTT
                      </p>
                      <p className="text-sm text-gray-500">yield earned</p>
                    </div>
                  </div>
                )) || (
                  <p className="text-center text-gray-500 py-8">
                    No capsule data available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
