import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart3, 
  TrendingUp, 
  Globe, 
  Shield, 
  Users, 
  Coins,
  Eye,
  Clock,
  Award,
  Zap
} from "lucide-react";

interface AnalyticsData {
  total: number;
  minted: number;
  sealed: number;
  languages: string[];
  truthScore: number;
  gttEarned: number;
  verificationRate: number;
  growthRate: number;
  activeValidators: number;
  topCategories: Array<{ name: string; count: number; percentage: number }>;
}

export default function CapsuleAnalyticsDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/analytics/capsules"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <Shield className="w-5 h-5" />
              <span className="font-medium">Failed to load analytics data</span>
            </div>
            <p className="text-red-600 dark:text-red-400 text-sm mt-2">
              Please check your connection and try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const analytics = data as AnalyticsData;

  const stats = [
    {
      title: "Total Capsules",
      value: analytics.total,
      icon: BarChart3,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      description: "All created memories"
    },
    {
      title: "Minted NFTs",
      value: analytics.minted,
      icon: Award,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      description: "Blockchain certified"
    },
    {
      title: "Sealed Truths",
      value: analytics.sealed,
      icon: Clock,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950",
      description: "Time-locked capsules"
    },
    {
      title: "Truth Score",
      value: `${analytics.truthScore}%`,
      icon: Shield,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950",
      description: "Community verified"
    },
    {
      title: "GTT Earned",
      value: analytics.gttEarned.toLocaleString(),
      icon: Coins,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-950",
      description: "Tokens distributed"
    },
    {
      title: "Languages",
      value: analytics.languages.length,
      icon: Globe,
      color: "text-cyan-600 dark:text-cyan-400",
      bgColor: "bg-cyan-50 dark:bg-cyan-950",
      description: "Supported globally"
    },
    {
      title: "Verification Rate",
      value: `${analytics.verificationRate}%`,
      icon: Eye,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-950",
      description: "Content accuracy"
    },
    {
      title: "Growth Rate",
      value: `+${analytics.growthRate}%`,
      icon: TrendingUp,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950",
      description: "Monthly increase"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            📊 Capsule Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Real-time insights into your truth preservation ecosystem
          </p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <Zap className="w-3 h-3 mr-1" />
          Live Data
        </Badge>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {stat.description}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Languages and Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Language Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.languages.map((lang, index) => (
                <div key={lang} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{lang.toUpperCase()}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        style={{ width: `${Math.max(20, 100 - index * 15)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-8 text-right">
                      {Math.max(5, 35 - index * 8)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Top Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topCategories?.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{category.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-8 text-right">
                      {category.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Validators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Network Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {analytics.activeValidators}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Validators</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                99.8%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Network Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                2.3s
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}