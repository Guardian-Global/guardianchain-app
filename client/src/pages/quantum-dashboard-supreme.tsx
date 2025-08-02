import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Crown,
  Sparkles,
  Zap,
  Shield,
  Star,
  Flame,
  Diamond,
  TrendingUp,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share,
  Download,
  Upload,
  Lock,
  Unlock,
  Globe,
  Search,
  Filter,
  Calendar,
  Clock,
  DollarSign,
  Award,
  Target,
  Cpu,
  Network,
  Database,
  GitBranch,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Settings,
  Bell,
  Mail,
  Phone
} from "lucide-react";

interface DashboardStats {
  truth_score: number;
  grief_score: number;
  total_capsules: number;
  verified_capsules: number;
  nft_count: number;
  gtt_balance: number;
  yield_earned: number;
  auction_wins: number;
  community_rank: number;
  reputation_tier: string;
  weekly_growth: number;
  influence_score: number;
}

interface ActivityItem {
  id: string;
  type: 'capsule_created' | 'nft_minted' | 'auction_won' | 'verification_completed' | 'yield_claimed';
  title: string;
  description: string;
  timestamp: string;
  value?: number;
  status: 'success' | 'pending' | 'failed';
  metadata?: any;
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action_url?: string;
}

export default function QuantumDashboardSupreme() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('all');

  // Fetch user dashboard stats
  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats", timeRange],
    enabled: isAuthenticated,
    refetchInterval: 30000
  });

  // Fetch recent activity
  const { data: recentActivity, isLoading: activityLoading } = useQuery({
    queryKey: ["/api/dashboard/activity"],
    enabled: isAuthenticated,
    refetchInterval: 60000
  });

  // Fetch notifications
  const { data: notifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ["/api/dashboard/notifications"],
    enabled: isAuthenticated,
    refetchInterval: 30000
  });

  // Fetch portfolio analytics
  const { data: portfolioData } = useQuery({
    queryKey: ["/api/dashboard/portfolio", timeRange],
    enabled: isAuthenticated
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'capsule_created': return <Upload className="w-4 h-4 text-cyan-400" />;
      case 'nft_minted': return <Diamond className="w-4 h-4 text-purple-400" />;
      case 'auction_won': return <Award className="w-4 h-4 text-yellow-400" />;
      case 'verification_completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'yield_claimed': return <DollarSign className="w-4 h-4 text-green-400" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'bronze': return 'text-orange-600';
      case 'silver': return 'text-gray-400';
      case 'gold': return 'text-yellow-400';
      case 'platinum': return 'text-purple-400';
      case 'diamond': return 'text-cyan-400';
      default: return 'text-gray-400';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <Card className="holographic-glass max-w-md border-cyan-500/30">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Access Restricted</h2>
            <p className="text-gray-300 mb-6">Connect your wallet to access the Quantum Dashboard</p>
            <Button className="quantum-field text-black font-bold">
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-display font-black text-gradient-quantum mb-2 animate-prismatic-shift">
              Quantum Dashboard
            </h1>
            <p className="text-cyan-300 font-web3">
              Welcome back, <span className="text-white font-bold">{user?.firstName}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Time Range Selector */}
            <div className="flex items-center gap-2">
              {['24h', '7d', '30d', '90d'].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                  className={timeRange === range ? 'quantum-field text-black' : 'text-gray-300'}
                >
                  {range}
                </Button>
              ))}
            </div>
            
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5 text-gray-300" />
              {notifications?.filter((n: Notification) => !n.read).length > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              )}
            </Button>
            
            {/* Settings */}
            <Button variant="ghost" size="sm">
              <Settings className="w-5 h-5 text-gray-300" />
            </Button>
          </div>
        </div>

        {/* User Profile Card */}
        <Card className="holographic-glass border-white/20 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="w-20 h-20 quantum-field border-4 border-cyan-500/50">
                  <AvatarImage src={user?.profileImageUrl} />
                  <AvatarFallback className="bg-cyan-600 text-white text-2xl">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-white">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    <Crown className="w-3 h-3 mr-1" />
                    {user?.tier}
                  </Badge>
                  {dashboardStats?.reputation_tier && (
                    <Badge className={`bg-gray-800 border-gray-600 ${getTierColor(dashboardStats.reputation_tier)}`}>
                      <Star className="w-3 h-3 mr-1" />
                      {dashboardStats.reputation_tier}
                    </Badge>
                  )}
                </div>
                <div className="text-gray-300">
                  <span className="text-cyan-400">Truth Score:</span> {dashboardStats?.truth_score || 0} •{' '}
                  <span className="text-purple-400">Community Rank:</span> #{dashboardStats?.community_rank || 'N/A'} •{' '}
                  <span className="text-yellow-400">GTT Balance:</span> {dashboardStats?.gtt_balance?.toLocaleString() || 0}
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <Button size="sm" className="quantum-field text-black">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Capsule
                </Button>
                <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-400">
                  <Diamond className="w-4 h-4 mr-2" />
                  Mint NFT
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800/50 border border-gray-700 mb-8">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-cyan-600">
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-purple-600">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="text-white data-[state=active]:bg-yellow-600">
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-white data-[state=active]:bg-green-600">
              Activity
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-white data-[state=active]:bg-red-600">
              Alerts
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Key Metrics */}
              <Card className="holographic-glass border-cyan-500/30 animate-morphic-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-cyan-300 mb-1">Truth Score</p>
                      <p className="text-3xl font-bold text-white">
                        {dashboardStats?.truth_score || 0}
                      </p>
                      <p className="text-xs text-green-400 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +{dashboardStats?.weekly_growth || 0}% this week
                      </p>
                    </div>
                    <div className="p-3 bg-cyan-500/20 rounded-full">
                      <Shield className="w-6 h-6 text-cyan-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="holographic-glass border-purple-500/30 animate-morphic-pulse animation-delay-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-300 mb-1">Total Capsules</p>
                      <p className="text-3xl font-bold text-white">
                        {dashboardStats?.total_capsules || 0}
                      </p>
                      <p className="text-xs text-purple-400">
                        {dashboardStats?.verified_capsules || 0} verified
                      </p>
                    </div>
                    <div className="p-3 bg-purple-500/20 rounded-full">
                      <Database className="w-6 h-6 text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="holographic-glass border-yellow-500/30 animate-morphic-pulse animation-delay-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-yellow-300 mb-1">GTT Balance</p>
                      <p className="text-3xl font-bold text-white">
                        {formatNumber(dashboardStats?.gtt_balance || 0)}
                      </p>
                      <p className="text-xs text-green-400">
                        +{dashboardStats?.yield_earned || 0} yield earned
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-500/20 rounded-full">
                      <DollarSign className="w-6 h-6 text-yellow-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="holographic-glass border-green-500/30 animate-morphic-pulse animation-delay-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-300 mb-1">NFT Collection</p>
                      <p className="text-3xl font-bold text-white">
                        {dashboardStats?.nft_count || 0}
                      </p>
                      <p className="text-xs text-green-400">
                        {dashboardStats?.auction_wins || 0} auction wins
                      </p>
                    </div>
                    <div className="p-3 bg-green-500/20 rounded-full">
                      <Diamond className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <Card className="holographic-glass border-white/20 h-fit">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-white flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-blue-400" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {activityLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin quantum-field w-8 h-8 rounded-full mb-2 mx-auto"></div>
                        <p className="text-gray-400">Loading activity...</p>
                      </div>
                    ) : (
                      recentActivity?.slice(0, 6).map((activity: ActivityItem) => (
                        <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800/30 transition-colors">
                          <div className="p-2 bg-gray-800 rounded-full">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-white">{activity.title}</h4>
                            <p className="text-sm text-gray-400">{activity.description}</p>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-medium ${getStatusColor(activity.status)}`}>
                              {activity.value && `+${activity.value} GTT`}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatTimeAgo(activity.timestamp)}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions & Progress */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card className="holographic-glass border-white/20">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-white flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full quantum-field text-black font-bold animate-morphic-pulse">
                      <Upload className="w-4 h-4 mr-2" />
                      Create Truth Capsule
                    </Button>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      <Diamond className="w-4 h-4 mr-2" />
                      Mint NFT
                    </Button>
                    <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                      <Award className="w-4 h-4 mr-2" />
                      Join Truth Auction
                    </Button>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Claim Yield
                    </Button>
                  </CardContent>
                </Card>

                {/* Progress Tracking */}
                <Card className="holographic-glass border-white/20">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-white flex items-center">
                      <Target className="w-5 h-5 mr-2 text-green-400" />
                      Tier Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Current: {user?.tier}</span>
                        <span className="text-cyan-400">Next: CREATOR</span>
                      </div>
                      <Progress value={65} className="h-2 bg-gray-800" />
                      <p className="text-xs text-gray-400 mt-1">
                        5 more capsules to unlock CREATOR tier
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Truth Score</span>
                        <span className="text-purple-400">{dashboardStats?.truth_score || 0}/1000</span>
                      </div>
                      <Progress value={(dashboardStats?.truth_score || 0) / 10} className="h-2 bg-gray-800" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Influence Score</span>
                        <span className="text-yellow-400">{dashboardStats?.influence_score || 0}/500</span>
                      </div>
                      <Progress value={(dashboardStats?.influence_score || 0) / 5} className="h-2 bg-gray-800" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Other tabs would continue here with similar enhanced styling */}
        </Tabs>
      </div>
    </div>
  );
}