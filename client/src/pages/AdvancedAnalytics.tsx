import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  LineChart, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Eye, 
  Coins,
  Activity,
  Globe,
  Zap,
  Shield,
  Target,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalCapsules: number;
    totalViews: number;
    gttCirculating: number;
    revenueToday: number;
    userGrowth: number;
    engagementRate: number;
  };
  userMetrics: {
    daily: Array<{ date: string; users: number; capsules: number; views: number }>;
    demographics: Array<{ tier: string; count: number; percentage: number }>;
    retention: Array<{ day: number; percentage: number }>;
  };
  capsulePerformance: {
    topPerforming: Array<{
      id: string;
      title: string;
      views: number;
      engagement: number;
      gttEarned: number;
    }>;
    categoryBreakdown: Array<{ category: string; count: number; avgViews: number }>;
    viralContent: Array<{
      id: string;
      title: string;
      shareRate: number;
      viralScore: number;
    }>;
  };
  tokenAnalytics: {
    priceHistory: Array<{ date: string; price: number; volume: number }>;
    distribution: Array<{ holder: string; amount: number; percentage: number }>;
    stakingMetrics: {
      totalStaked: number;
      averageStakingPeriod: number;
      yieldDistributed: number;
    };
  };
  validatorStats: {
    activeValidators: number;
    averageReputationScore: number;
    consensusRate: number;
    validators: Array<{
      id: string;
      name: string;
      reputationScore: number;
      validations: number;
      accuracy: number;
    }>;
  };
}

export default function AdvancedAnalyticsPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'capsules' | 'tokens' | 'validators'>('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: analytics, isLoading, refetch } = useQuery<AnalyticsData>({
    queryKey: ['/api/analytics/comprehensive', timeRange],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Mock data for demonstration
  const defaultAnalytics: AnalyticsData = {
    overview: {
      totalUsers: 15847,
      activeUsers: 3924,
      totalCapsules: 8456,
      totalViews: 156789,
      gttCirculating: 45678912,
      revenueToday: 15642,
      userGrowth: 12.5,
      engagementRate: 68.3
    },
    userMetrics: {
      daily: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        users: Math.floor(Math.random() * 500) + 200,
        capsules: Math.floor(Math.random() * 100) + 50,
        views: Math.floor(Math.random() * 2000) + 1000
      })).reverse(),
      demographics: [
        { tier: 'EXPLORER', count: 8924, percentage: 56.3 },
        { tier: 'SEEKER', count: 4567, percentage: 28.8 },
        { tier: 'CREATOR', count: 1876, percentage: 11.8 },
        { tier: 'SOVEREIGN', count: 480, percentage: 3.1 }
      ],
      retention: [
        { day: 1, percentage: 85.2 },
        { day: 7, percentage: 72.8 },
        { day: 14, percentage: 65.4 },
        { day: 30, percentage: 58.9 }
      ]
    },
    capsulePerformance: {
      topPerforming: [
        { id: '1', title: 'Family Legacy Stories', views: 15674, engagement: 89.2, gttEarned: 2456 },
        { id: '2', title: 'Truth About Climate Change', views: 12890, engagement: 85.7, gttEarned: 1987 },
        { id: '3', title: 'War Veteran Memories', views: 9876, engagement: 92.1, gttEarned: 1654 }
      ],
      categoryBreakdown: [
        { category: 'Personal', count: 3456, avgViews: 287 },
        { category: 'Historical', count: 2134, avgViews: 456 },
        { category: 'Scientific', count: 1876, avgViews: 623 },
        { category: 'Cultural', count: 990, avgViews: 234 }
      ],
      viralContent: [
        { id: '1', title: 'Viral Truth Capsule', shareRate: 45.6, viralScore: 89.2 },
        { id: '2', title: 'Breaking Discovery', shareRate: 38.9, viralScore: 76.5 }
      ]
    },
    tokenAnalytics: {
      priceHistory: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        price: 0.0075 + (Math.random() - 0.5) * 0.001,
        volume: Math.floor(Math.random() * 1000000) + 500000
      })).reverse(),
      distribution: [
        { holder: 'Community Pool', amount: 15678912, percentage: 34.3 },
        { holder: 'Staking Rewards', amount: 12456789, percentage: 27.3 },
        { holder: 'Development Fund', amount: 8765432, percentage: 19.2 },
        { holder: 'Public Holders', amount: 8753219, percentage: 19.2 }
      ],
      stakingMetrics: {
        totalStaked: 28765432,
        averageStakingPeriod: 127,
        yieldDistributed: 1876543
      }
    },
    validatorStats: {
      activeValidators: 45,
      averageReputationScore: 87.3,
      consensusRate: 99.2,
      validators: [
        { id: '1', name: 'TruthKeeper', reputationScore: 98.5, validations: 1567, accuracy: 99.8 },
        { id: '2', name: 'GuardianNode', reputationScore: 96.2, validations: 1445, accuracy: 98.9 },
        { id: '3', name: 'VerityValidator', reputationScore: 94.8, validations: 1334, accuracy: 97.6 }
      ]
    }
  };

  const displayData = analytics || defaultAnalytics;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Real-time insights into platform performance and user engagement
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1">
              {['24h', '7d', '30d', '90d'].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setTimeRange(range as any)}
                >
                  {range}
                </Button>
              ))}
            </div>
            
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1">
          {[
            { key: 'overview', label: 'Overview', icon: BarChart },
            { key: 'users', label: 'Users', icon: Users },
            { key: 'capsules', label: 'Capsules', icon: Eye },
            { key: 'tokens', label: 'Tokens', icon: Coins },
            { key: 'validators', label: 'Validators', icon: Shield }
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={activeTab === key ? 'default' : 'ghost'}
              onClick={() => setActiveTab(key as any)}
              className="flex-1"
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </Button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                      <p className="text-2xl font-bold">{formatNumber(displayData.overview.totalUsers)}</p>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">+{displayData.overview.userGrowth}%</span>
                      </div>
                    </div>
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
                      <p className="text-2xl font-bold">{formatNumber(displayData.overview.activeUsers)}</p>
                      <div className="flex items-center mt-1">
                        <Activity className="w-4 h-4 text-purple-500 mr-1" />
                        <span className="text-sm text-gray-600">{displayData.overview.engagementRate}% engaged</span>
                      </div>
                    </div>
                    <Activity className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Capsules</p>
                      <p className="text-2xl font-bold">{formatNumber(displayData.overview.totalCapsules)}</p>
                      <div className="flex items-center mt-1">
                        <Eye className="w-4 h-4 text-orange-500 mr-1" />
                        <span className="text-sm text-gray-600">{formatNumber(displayData.overview.totalViews)} views</span>
                      </div>
                    </div>
                    <Eye className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">GTT Circulating</p>
                      <p className="text-2xl font-bold">{formatNumber(displayData.overview.gttCirculating)}</p>
                      <div className="flex items-center mt-1">
                        <Coins className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm text-gray-600">{formatCurrency(displayData.overview.revenueToday)} today</span>
                      </div>
                    </div>
                    <Coins className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChart className="w-5 h-5 mr-2" />
                    User Growth Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-center">
                      <LineChart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500">Interactive chart coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="w-5 h-5 mr-2" />
                    User Distribution by Tier
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {displayData.userMetrics.demographics.map((tier) => (
                      <div key={tier.tier} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{tier.tier}</span>
                          <span className="text-sm text-gray-600">{tier.count.toLocaleString()} ({tier.percentage}%)</span>
                        </div>
                        <Progress value={tier.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Performing Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Top Performing Capsules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayData.capsulePerformance.topPerforming.map((capsule, index) => (
                    <div key={capsule.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold">{capsule.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatNumber(capsule.views)} views • {capsule.engagement}% engagement
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {formatNumber(capsule.gttEarned)} GTT
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">earned</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>User Retention Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {displayData.userMetrics.retention.map((period) => (
                      <div key={period.day} className="space-y-2">
                        <div className="flex justify-between">
                          <span>Day {period.day}</span>
                          <span className="font-semibold">{period.percentage}%</span>
                        </div>
                        <Progress value={period.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {displayData.overview.engagementRate}%
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Average engagement rate</p>
                    <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Additional tabs would be implemented similarly */}
      </div>
    </div>
  );
}