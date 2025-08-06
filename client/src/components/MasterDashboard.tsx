import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  TrendingUp,
  Users,
  Zap,
  Shield,
  Clock,
  Eye,
  Heart,
  Coins,
  Activity,
  FileText,
  Target,
  Award,
  Star,
  Globe,
  Settings,
  AlertTriangle,
  CheckCircle,
  Timer,
  Wallet,
  Database,
  Server
} from "lucide-react";

interface DashboardMetrics {
  totalCapsules: number;
  totalUsers: number;
  totalGTT: number;
  dailyActiveUsers: number;
  weeklyGrowth: number;
  engagementRate: number;
  verificationRate: number;
  platformHealth: number;
}

interface UserStats {
  capsulesCreated: number;
  gttEarned: number;
  truthScore: number;
  rank: number;
  badges: number;
  friends: number;
  achievements: string[];
}

interface PlatformStats {
  serverStatus: 'healthy' | 'warning' | 'critical';
  uptime: number;
  responseTime: number;
  errorRate: number;
  activeConnections: number;
  databaseLoad: number;
}

interface MasterDashboardProps {
  userStats: UserStats;
  platformMetrics: DashboardMetrics;
  platformStats: PlatformStats;
  isAdmin?: boolean;
}

export default function MasterDashboard({ 
  userStats, 
  platformMetrics, 
  platformStats,
  isAdmin = false 
}: MasterDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400 bg-green-400/10 border-green-400';
      case 'warning': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400';
      case 'critical': return 'text-red-400 bg-red-400/10 border-red-400';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400';
    }
  };

  const DashboardOverview = () => {
    const overviewCards = [
      {
        title: "My Capsules",
        value: userStats.capsulesCreated,
        icon: FileText,
        color: "text-blue-400",
        change: "+12%",
        changeColor: "text-green-400"
      },
      {
        title: "GTT Earned",
        value: userStats.gttEarned.toLocaleString(),
        icon: Coins,
        color: "text-yellow-400",
        change: "+8.5%",
        changeColor: "text-green-400"
      },
      {
        title: "Truth Score",
        value: `${userStats.truthScore}%`,
        icon: Shield,
        color: "text-green-400",
        change: "+2.1%",
        changeColor: "text-green-400"
      },
      {
        title: "Community Rank",
        value: `#${userStats.rank}`,
        icon: Award,
        color: "text-purple-400",
        change: "↑5",
        changeColor: "text-green-400"
      }
    ];

    const platformCards = [
      {
        title: "Total Users",
        value: platformMetrics.totalUsers.toLocaleString(),
        icon: Users,
        color: "text-cyan-400",
        change: `+${platformMetrics.weeklyGrowth}%`,
        changeColor: "text-green-400"
      },
      {
        title: "Active Today",
        value: platformMetrics.dailyActiveUsers.toLocaleString(),
        icon: Activity,
        color: "text-orange-400",
        change: "+15.3%",
        changeColor: "text-green-400"
      },
      {
        title: "Platform Health",
        value: `${platformMetrics.platformHealth}%`,
        icon: Server,
        color: "text-green-400",
        change: "Stable",
        changeColor: "text-green-400"
      },
      {
        title: "Total GTT",
        value: `${(platformMetrics.totalGTT / 1000000).toFixed(1)}M`,
        icon: Zap,
        color: "text-yellow-400",
        change: "+22.7%",
        changeColor: "text-green-400"
      }
    ];

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Personal Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {overviewCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Card key={index} className="bg-hsl(220,39%,11%) border-hsl(220,39%,15%)">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-hsl(215,25%,65%)">{card.title}</p>
                        <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                        <p className={`text-xs ${card.changeColor}`}>{card.change}</p>
                      </div>
                      <Icon className={`w-8 h-8 ${card.color}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {isAdmin && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Platform Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {platformCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <Card key={index} className="bg-hsl(220,39%,11%) border-hsl(220,39%,15%)">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-hsl(215,25%,65%)">{card.title}</p>
                          <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                          <p className={`text-xs ${card.changeColor}`}>{card.change}</p>
                        </div>
                        <Icon className={`w-8 h-8 ${card.color}`} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-hsl(220,39%,11%) border-hsl(220,39%,15%)">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Truth Score Progress</span>
                    <span>{userStats.truthScore}%</span>
                  </div>
                  <Progress value={userStats.truthScore} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>GTT Growth Rate</span>
                    <span>+8.5%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Community Engagement</span>
                    <span>{platformMetrics.engagementRate}%</span>
                  </div>
                  <Progress value={platformMetrics.engagementRate} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-hsl(220,39%,11%) border-hsl(220,39%,15%)">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userStats.achievements.slice(0, 4).map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-hsl(220,39%,15%) rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-white">{achievement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const AnalyticsDashboard = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-hsl(220,39%,11%) border-hsl(220,39%,15%)">
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-hsl(215,25%,65%) mx-auto mb-4" />
                  <p className="text-hsl(215,25%,65%)">Chart visualization coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-hsl(220,39%,11%) border-hsl(220,39%,15%)">
            <CardHeader>
              <CardTitle>Capsule Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-hsl(215,25%,65%) mx-auto mb-4" />
                  <p className="text-hsl(215,25%,65%)">Chart visualization coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-hsl(220,39%,11%) border-hsl(220,39%,15%)">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-hsl(215,25%,65%)">Verification Rate</p>
                  <p className="text-2xl font-bold text-green-400">{platformMetrics.verificationRate}%</p>
                </div>
                <Shield className="w-8 h-8 text-green-400" />
              </div>
              <Progress value={platformMetrics.verificationRate} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-hsl(220,39%,11%) border-hsl(220,39%,15%)">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-hsl(215,25%,65%)">Engagement Rate</p>
                  <p className="text-2xl font-bold text-blue-400">{platformMetrics.engagementRate}%</p>
                </div>
                <Heart className="w-8 h-8 text-blue-400" />
              </div>
              <Progress value={platformMetrics.engagementRate} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-hsl(220,39%,11%) border-hsl(220,39%,15%)">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-hsl(215,25%,65%)">Growth Rate</p>
                  <p className="text-2xl font-bold text-yellow-400">{platformMetrics.weeklyGrowth}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-yellow-400" />
              </div>
              <Progress value={platformMetrics.weeklyGrowth} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const SystemHealth = () => (
    <div className="space-y-6">
      <Card className="bg-hsl(220,39%,11%) border-hsl(220,39%,15%)">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5" />
            Platform Status
            <Badge className={getStatusColor(platformStats.serverStatus)}>
              {platformStats.serverStatus.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{platformStats.uptime}%</p>
              <p className="text-sm text-hsl(215,25%,65%)">Uptime</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{platformStats.responseTime}ms</p>
              <p className="text-sm text-hsl(215,25%,65%)">Response Time</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">{platformStats.activeConnections}</p>
              <p className="text-sm text-hsl(215,25%,65%)">Active Connections</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-hsl(220,39%,11%) border-hsl(220,39%,15%)">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Database Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Database Load</span>
                  <span>{platformStats.databaseLoad}%</span>
                </div>
                <Progress value={platformStats.databaseLoad} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Error Rate</span>
                  <span>{platformStats.errorRate}%</span>
                </div>
                <Progress value={platformStats.errorRate} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-hsl(220,39%,11%) border-hsl(220,39%,15%)">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Real-time Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-hsl(220,39%,15%) rounded">
                <span className="text-sm">New Capsule Created</span>
                <span className="text-xs text-hsl(215,25%,65%)">2 min ago</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-hsl(220,39%,15%) rounded">
                <span className="text-sm">User Verification</span>
                <span className="text-xs text-hsl(215,25%,65%)">5 min ago</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-hsl(220,39%,15%) rounded">
                <span className="text-sm">GTT Transaction</span>
                <span className="text-xs text-hsl(215,25%,65%)">8 min ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">GuardianChain Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm">
            <Globe className="w-4 h-4 mr-2" />
            Public View
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-3' : 'grid-cols-2'}`}>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          {isAdmin && <TabsTrigger value="system">System Health</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <DashboardOverview />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsDashboard />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="system" className="space-y-6">
            <SystemHealth />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}