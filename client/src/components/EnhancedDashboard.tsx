import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, TrendingUp, Zap, Shield, Crown, Star, 
  BarChart3, Activity, Target, Flame, Award,
  ChevronRight, ArrowUp, ArrowDown, DollarSign,
  Users, FileText, Calendar, Sparkles
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { EnhancedCapsuleGallery } from "@/components/capsules/EnhancedCapsuleGallery";
import { AnimatedCapsuleInteraction } from "@/components/animations/AnimatedCapsuleInteraction";

interface DashboardStats {
  truthScore: number;
  gttEarned: number;
  capsulesCreated: number;
  capsulesReplayed: number;
  yieldGenerated: number;
  rank: number;
  streak: number;
  achievements: Achievement[];
  recentActivity: Activity[];
  tierProgress: TierProgress;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface Activity {
  id: string;
  type: "capsule_created" | "yield_earned" | "achievement_unlocked" | "tier_upgraded";
  description: string;
  timestamp: string;
  amount?: number;
}

interface TierProgress {
  currentTier: string;
  nextTier: string;
  progress: number;
  requirementsToNext: string[];
  benefits: string[];
}

export default function EnhancedDashboard() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/enhanced", selectedPeriod],
    enabled: !!user,
  });

  const { data: analytics } = useQuery({
    queryKey: ["/api/analytics/dashboard"],
    enabled: !!user,
  });

  if (isLoading || !stats) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "from-yellow-400 to-orange-500";
      case "epic": return "from-purple-400 to-pink-500";
      case "rare": return "from-blue-400 to-cyan-500";
      default: return "from-gray-400 to-gray-500";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "capsule_created": return FileText;
      case "yield_earned": return DollarSign;
      case "achievement_unlocked": return Trophy;
      case "tier_upgraded": return Crown;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Period Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Enhanced Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Advanced analytics and performance insights
          </p>
        </div>
        <div className="flex gap-2">
          {["7d", "30d", "90d", "1y"].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className="text-xs"
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Truth Score</p>
                <p className="text-3xl font-bold text-cyan-400">{stats.truthScore}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500">+5.2%</span>
                </div>
              </div>
              <Shield className="h-8 w-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">GTT Earned</p>
                <p className="text-3xl font-bold text-green-400">{stats.gttEarned.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500">+12.8%</span>
                </div>
              </div>
              <Zap className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-600/10"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Global Rank</p>
                <p className="text-3xl font-bold text-purple-400">#{stats.rank}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500">+3 ranks</span>
                </div>
              </div>
              <Trophy className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-600/10"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Truth Streak</p>
                <p className="text-3xl font-bold text-orange-400">{stats.streak}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Flame className="h-3 w-3 text-orange-500" />
                  <span className="text-xs text-orange-500">Active</span>
                </div>
              </div>
              <Flame className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-amber-600/10"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Yield APY</p>
                <p className="text-3xl font-bold text-yellow-400">18.5%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500">+2.1%</span>
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Tier Progress */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Tier Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-gradient-to-r from-cyan-500 to-purple-500">
                {stats.tierProgress.currentTier}
              </Badge>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <Badge variant="outline">
                {stats.tierProgress.nextTier}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{stats.tierProgress.progress}%</span>
              </div>
              <Progress value={stats.tierProgress.progress} className="h-2" />
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Requirements to {stats.tierProgress.nextTier}</h4>
              {stats.tierProgress.requirementsToNext.map((req, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="h-3 w-3" />
                  {req}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentActivity.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="p-2 rounded-full bg-background">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {activity.amount && (
                      <Badge variant="secondary" className="ml-auto">
                        +{activity.amount} GTT
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-500" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  achievement.earned
                    ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} text-white`
                    : "border-dashed border-muted bg-muted/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${achievement.earned ? "bg-white/20" : "bg-muted"}`}>
                    <Trophy className={`h-4 w-4 ${achievement.earned ? "text-white" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <h4 className={`font-medium text-sm ${achievement.earned ? "text-white" : "text-foreground"}`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-xs ${achievement.earned ? "text-white/80" : "text-muted-foreground"}`}>
                      {achievement.description}
                    </p>
                    {achievement.earned && achievement.earnedAt && (
                      <p className="text-xs text-white/60 mt-1">
                        Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Analytics Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-500" />
            Advanced Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="yield">Yield Analysis</TabsTrigger>
              <TabsTrigger value="social">Social Impact</TabsTrigger>
              <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="performance" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-cyan-400">95.2%</p>
                      <p className="text-sm text-muted-foreground">Truth Accuracy</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-400">2,847</p>
                      <p className="text-sm text-muted-foreground">Total Replays</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-400">73</p>
                      <p className="text-sm text-muted-foreground">Verified Capsules</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="yield" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Yield Breakdown</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Base Yield</span>
                        <span className="text-sm font-medium">12.3%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Truth Bonus</span>
                        <span className="text-sm font-medium">+4.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Tier Multiplier</span>
                        <span className="text-sm font-medium">+2.0%</span>
                      </div>
                      <hr />
                      <div className="flex justify-between font-medium">
                        <span>Total APY</span>
                        <span className="text-green-400">18.5%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Monthly Projections</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Conservative</span>
                        <span className="text-sm font-medium">+450 GTT</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Realistic</span>
                        <span className="text-sm font-medium">+680 GTT</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Optimistic</span>
                        <span className="text-sm font-medium">+920 GTT</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="social" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Users className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                      <p className="text-2xl font-bold">1,247</p>
                      <p className="text-sm text-muted-foreground">Followers</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Sparkles className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                      <p className="text-2xl font-bold">89.3%</p>
                      <p className="text-sm text-muted-foreground">Engagement Rate</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Star className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
                      <p className="text-2xl font-bold">4.8/5</p>
                      <p className="text-sm text-muted-foreground">Truth Rating</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="predictions" className="space-y-4">
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      AI-Powered Insights
                    </h4>
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                        <p className="text-sm text-green-400 font-medium">High Potential</p>
                        <p className="text-sm">Your capsules show 85% likelihood of viral growth in the next 30 days</p>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <p className="text-sm text-blue-400 font-medium">Optimization Tip</p>
                        <p className="text-sm">Creating capsules on Tuesdays increases engagement by 23%</p>
                      </div>
                      <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <p className="text-sm text-purple-400 font-medium">Trend Alert</p>
                        <p className="text-sm">Family heritage topics trending +45% in your network</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <Button asChild className="h-auto p-4">
              <Link href="/create">
                <div className="text-center">
                  <FileText className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-sm">Create Capsule</p>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4">
              <Link href="/analytics">
                <div className="text-center">
                  <BarChart3 className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-sm">View Analytics</p>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4">
              <Link href="/pricing">
                <div className="text-center">
                  <Crown className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-sm">Upgrade Tier</p>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4">
              <Link href="/profile">
                <div className="text-center">
                  <Users className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-sm">Edit Profile</p>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Capsule Gallery Integration */}
      <div className="mt-8">
        <AnimatedCapsuleInteraction
          capsuleId="dashboard-gallery"
          onInteraction={(type, id) => console.log(`Dashboard interaction: ${type} on ${id}`)}
        >
          <EnhancedCapsuleGallery 
            title="Recent Truth Capsules"
            subtitle="Latest verified submissions from the Guardian community"
            limit={6}
            showFilters={false}
            showViewModes={true}
          />
        </AnimatedCapsuleInteraction>
      </div>
    </div>
  );
}