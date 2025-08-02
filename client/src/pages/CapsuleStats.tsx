import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Eye, Heart, MessageCircle, Award } from "lucide-react";

interface CapsuleStats {
  totalCapsules: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  verificationRate: number;
  topPerformingCapsules: Array<{
    id: string;
    title: string;
    views: number;
    likes: number;
    verificationStatus: "verified" | "pending" | "rejected";
    griefScore: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  performanceMetrics: {
    avgViews: number;
    avgLikes: number;
    engagementRate: number;
    truthScore: number;
  };
}

export default function CapsuleStats() {
  const { data: stats, isLoading } = useQuery<CapsuleStats>({
    queryKey: ["/api/capsule/stats"],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Capsule Statistics</h1>
        <Badge variant="outline" className="text-sm">
          <TrendingUp className="w-4 h-4 mr-1" />
          Live Data
        </Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Capsules
            </CardTitle>
            <Award className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats?.totalCapsules.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Views
            </CardTitle>
            <Eye className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats?.totalViews.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Likes
            </CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats?.totalLikes.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Comments
            </CardTitle>
            <MessageCircle className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats?.totalComments.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Verification Rate</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {stats?.verificationRate}%
              </span>
            </div>
            <Progress value={stats?.verificationRate} className="h-2" />

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Engagement Rate</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {stats?.performanceMetrics.engagementRate}%
              </span>
            </div>
            <Progress value={stats?.performanceMetrics.engagementRate} className="h-2" />

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Truth Score</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {stats?.performanceMetrics.truthScore}/100
              </span>
            </div>
            <Progress value={stats?.performanceMetrics.truthScore} className="h-2" />
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.categoryBreakdown.map((category, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{category.category}</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {category.count} ({category.percentage}%)
                    </span>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Capsules */}
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Top Performing Capsules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.topPerformingCapsules.map((capsule, index) => (
              <div key={capsule.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">{capsule.title}</h3>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {capsule.views.toLocaleString()}
                    </span>
                    <span className="flex items-center">
                      <Heart className="w-4 h-4 mr-1" />
                      {capsule.likes.toLocaleString()}
                    </span>
                    <span>Grief Score: {capsule.griefScore}</span>
                  </div>
                </div>
                <Badge 
                  variant={capsule.verificationStatus === "verified" ? "default" : 
                          capsule.verificationStatus === "pending" ? "secondary" : "destructive"}
                  className="ml-4"
                >
                  {capsule.verificationStatus}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}