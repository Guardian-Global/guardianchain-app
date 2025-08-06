import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  TrendingUp, 
  Shield, 
  Globe, 
  Users, 
  Zap, 
  Award,
  Target,
  Database,
  Clock,
  Eye,
  Heart,
  Star,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface MetricData {
  value: number;
  change: number;
  trend: "up" | "down" | "stable";
  period: string;
}

interface DashboardMetrics {
  truthScore: MetricData;
  gttEarned: MetricData;
  capsulesCreated: MetricData;
  capsulesVerified: MetricData;
  networkReach: MetricData;
  vaultSize: MetricData;
  reputationScore: MetricData;
  lineageConnections: MetricData;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedAt: string;
  progress?: number;
  maxProgress?: number;
}

export default function EnhancedDashboardMetrics() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [viewMode, setViewMode] = useState<"overview" | "detailed">("overview");

  // Fetch dashboard metrics
  const { data: metricsData, isLoading } = useQuery({
    queryKey: ["/api/dashboard/metrics", selectedPeriod],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch achievements
  const { data: achievementsData } = useQuery({
    queryKey: ["/api/dashboard/achievements"],
    refetchInterval: 60000, // Refresh every minute
  });

  const metrics: DashboardMetrics = metricsData?.metrics || {
    truthScore: { value: 87, change: 5.2, trend: "up", period: "This week" },
    gttEarned: { value: 12547, change: 12.8, trend: "up", period: "This week" },
    capsulesCreated: { value: 23, change: 15.4, trend: "up", period: "This week" },
    capsulesVerified: { value: 19, change: 8.7, trend: "up", period: "This week" },
    networkReach: { value: 1843, change: -2.1, trend: "down", period: "This week" },
    vaultSize: { value: 156, change: 22.3, trend: "up", period: "This week" },
    reputationScore: { value: 94, change: 3.1, trend: "up", period: "This week" },
    lineageConnections: { value: 47, change: 18.9, trend: "up", period: "This week" }
  };

  const achievements: Achievement[] = achievementsData?.achievements || [
    {
      id: "first_capsule",
      title: "Truth Seeker",
      description: "Created your first truth capsule",
      icon: Shield,
      rarity: "common",
      unlockedAt: "2025-01-15",
      progress: 1,
      maxProgress: 1
    },
    {
      id: "verification_master",
      title: "Verification Master",
      description: "Verified 10 truth capsules",
      icon: Award,
      rarity: "rare",
      unlockedAt: "2025-01-20",
      progress: 10,
      maxProgress: 10
    },
    {
      id: "network_builder",
      title: "Network Builder",
      description: "Connected with 50 guardians",
      icon: Users,
      rarity: "epic",
      unlockedAt: "2025-02-01",
      progress: 47,
      maxProgress: 50
    }
  ];

  const MetricCard = ({ 
    title, 
    metric, 
    icon: Icon, 
    color, 
    formatter 
  }: { 
    title: string; 
    metric: MetricData; 
    icon: React.ComponentType<{ className?: string }>; 
    color: string;
    formatter?: (value: number) => string;
  }) => (
    <Card className="bg-slate-800/50 border-purple-500/20 hover:border-purple-400/40 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">{title}</p>
              <p className="text-2xl font-bold text-white">
                {formatter ? formatter(metric.value) : metric.value.toLocaleString()}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className={`flex items-center gap-1 ${
              metric.trend === "up" ? "text-green-400" : 
              metric.trend === "down" ? "text-red-400" : "text-gray-400"
            }`}>
              {metric.trend === "up" ? (
                <ArrowUp className="w-4 h-4" />
              ) : metric.trend === "down" ? (
                <ArrowDown className="w-4 h-4" />
              ) : null}
              <span className="text-sm font-medium">
                {metric.change > 0 ? "+" : ""}{metric.change}%
              </span>
            </div>
            <p className="text-xs text-gray-500">{metric.period}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
    const rarityColors = {
      common: "from-gray-500 to-gray-600",
      rare: "from-blue-500 to-blue-600",
      epic: "from-purple-500 to-purple-600",
      legendary: "from-yellow-500 to-orange-500"
    };

    const isCompleted = achievement.progress === achievement.maxProgress;

    return (
      <Card className={`bg-slate-800/50 border transition-all duration-200 ${
        isCompleted 
          ? "border-yellow-500/40 shadow-lg shadow-yellow-500/20" 
          : "border-purple-500/20 hover:border-purple-400/40"
      }`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${rarityColors[achievement.rarity]} flex items-center justify-center`}>
              <achievement.icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white">{achievement.title}</h3>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    achievement.rarity === "legendary" ? "border-yellow-500 text-yellow-400" :
                    achievement.rarity === "epic" ? "border-purple-500 text-purple-400" :
                    achievement.rarity === "rare" ? "border-blue-500 text-blue-400" :
                    "border-gray-500 text-gray-400"
                  }`}
                >
                  {achievement.rarity}
                </Badge>
              </div>
              <p className="text-sm text-gray-400 mb-2">{achievement.description}</p>
              
              {achievement.maxProgress && achievement.maxProgress > 1 && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">
                      {achievement.progress || 0} / {achievement.maxProgress}
                    </span>
                  </div>
                  <Progress 
                    value={((achievement.progress || 0) / achievement.maxProgress) * 100} 
                    className="h-2"
                  />
                </div>
              )}

              {isCompleted && (
                <div className="flex items-center gap-1 mt-2">
                  <Star className="w-3 h-3 text-yellow-400" />
                  <span className="text-xs text-yellow-400">
                    Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="bg-slate-800/50 border-purple-500/20">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="w-10 h-10 bg-gray-700 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-6 bg-gray-700 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Performance Metrics</h2>
          <p className="text-gray-400">Track your truth-telling impact and achievements</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1">
            {["1d", "7d", "30d", "90d"].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className="text-xs"
              >
                {period}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1">
            <Button
              variant={viewMode === "overview" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("overview")}
              className="text-xs"
            >
              Overview
            </Button>
            <Button
              variant={viewMode === "detailed" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("detailed")}
              className="text-xs"
            >
              Detailed
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Truth Score"
          metric={metrics.truthScore}
          icon={Target}
          color="from-green-500 to-emerald-600"
          formatter={(value) => `${value}%`}
        />
        
        <MetricCard
          title="GTT Earned"
          metric={metrics.gttEarned}
          icon={Zap}
          color="from-yellow-500 to-orange-600"
        />
        
        <MetricCard
          title="Capsules Created"
          metric={metrics.capsulesCreated}
          icon={Shield}
          color="from-blue-500 to-purple-600"
        />
        
        <MetricCard
          title="Verified Capsules"
          metric={metrics.capsulesVerified}
          icon={Award}
          color="from-purple-500 to-pink-600"
        />
        
        <MetricCard
          title="Network Reach"
          metric={metrics.networkReach}
          icon={Globe}
          color="from-cyan-500 to-blue-600"
        />
        
        <MetricCard
          title="Vault Storage"
          metric={metrics.vaultSize}
          icon={Database}
          color="from-indigo-500 to-purple-600"
          formatter={(value) => `${value} MB`}
        />
        
        <MetricCard
          title="Reputation Score"
          metric={metrics.reputationScore}
          icon={Star}
          color="from-pink-500 to-rose-600"
          formatter={(value) => `${value}%`}
        />
        
        <MetricCard
          title="Lineage Connections"
          metric={metrics.lineageConnections}
          icon={Users}
          color="from-teal-500 to-cyan-600"
        />
      </div>

      {/* Achievements Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">Recent Achievements</h3>
            <p className="text-gray-400">Your latest milestones and unlocked badges</p>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </div>

      {/* Real-time Activity Feed */}
      <Card className="bg-slate-800/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            Live Activity Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { action: "Capsule verified", time: "2 minutes ago", icon: Award, color: "text-green-400" },
              { action: "GTT reward earned", time: "15 minutes ago", icon: Zap, color: "text-yellow-400" },
              { action: "New lineage connection", time: "1 hour ago", icon: Users, color: "text-blue-400" },
              { action: "Truth score updated", time: "2 hours ago", icon: Target, color: "text-purple-400" }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                <activity.icon className={`w-4 h-4 ${activity.color}`} />
                <div className="flex-1">
                  <p className="text-sm text-white">{activity.action}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}