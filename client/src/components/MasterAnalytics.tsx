import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share,
  Clock,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Zap,
  DollarSign,
  Award,
  Globe,
  Lock
} from "lucide-react";

// Master Analytics Component - Consolidates all analytics functionality
// Replaces: AnalyticsDashboard, CapsuleAnalytics, EmotionalHeatmap, EngagementAnalytics,
// MetricsPanel, PerformanceTracker, UserAnalytics, YieldAnalytics, etc.
interface MasterAnalyticsProps {
  view?: 'overview' | 'capsules' | 'users' | 'performance';
}

export default function MasterAnalytics({ view = 'overview' }: MasterAnalyticsProps) {
  const [activeView, setActiveView] = useState<'overview' | 'capsules' | 'users' | 'performance'>(view);
  const [timeRange, setTimeRange] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const OverviewAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Capsules', value: '2,847', change: '+12%', icon: BarChart3, color: 'text-blue-400' },
          { title: 'Active Users', value: '1,234', change: '+8%', icon: Users, color: 'text-green-400' },
          { title: 'GTT Generated', value: '45.2K', change: '+23%', icon: DollarSign, color: 'text-yellow-400' },
          { title: 'Engagement Rate', value: '87.3%', change: '+5%', icon: Activity, color: 'text-purple-400' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.change.startsWith('+');
          return (
            <Card key={index} className="bg-brand-secondary border-brand-surface">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                    <p className="text-sm text-brand-text-muted">{stat.title}</p>
                  </div>
                  <Badge variant={isPositive ? "default" : "destructive"} className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-brand-secondary border-brand-surface">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Platform Growth Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-brand-text-muted mx-auto mb-4" />
                <p className="text-brand-text-muted">Growth visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-secondary border-brand-surface">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Real-time Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-brand-surface rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-white">
                      {['Capsule created', 'Truth verified', 'GTT earned', 'User joined', 'NFT minted'][Math.floor(Math.random() * 5)]}
                    </span>
                  </div>
                  <span className="text-xs text-brand-text-muted">
                    {Math.floor(Math.random() * 60)}s ago
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const CapsuleAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-brand-secondary border-brand-surface">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-muted">Avg Truth Score</p>
                <p className="text-2xl font-bold text-green-400">89.2%</p>
              </div>
              <Target className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-secondary border-brand-surface">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-muted">Total Views</p>
                <p className="text-2xl font-bold text-blue-400">234K</p>
              </div>
              <Eye className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-secondary border-brand-surface">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-muted">Interactions</p>
                <p className="text-2xl font-bold text-purple-400">12.8K</p>
              </div>
              <Heart className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Top Performing Capsules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-brand-surface rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-accent/20 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-brand-accent">#{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">Truth Capsule {index + 1}</h4>
                    <p className="text-xs text-brand-text-muted">Created 2 days ago</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-green-400">{90 + index}% truth</span>
                    <span className="text-yellow-400">{(50 - index * 5).toFixed(1)} GTT</span>
                    <span className="text-blue-400">{(Math.random() * 5000).toFixed(0)} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-brand-secondary border-brand-surface">
          <CardHeader>
            <CardTitle>Emotional Heat Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {['Joy', 'Trust', 'Fear', 'Surprise', 'Sadness', 'Disgust', 'Anger', 'Anticipation'].map((emotion, index) => (
                <div key={emotion} className="text-center p-2 bg-brand-surface rounded">
                  <p className="text-xs text-brand-text-muted mb-1">{emotion}</p>
                  <Progress value={Math.random() * 100} className="h-2" />
                  <p className="text-xs text-white mt-1">{Math.floor(Math.random() * 100)}%</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-secondary border-brand-surface">
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Testimony', 'Evidence', 'Memory', 'Prediction'].map((category, index) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm text-white">{category}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={75 - index * 15} className="w-24 h-2" />
                    <span className="text-xs text-brand-text-muted w-8">{75 - index * 15}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const UserAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: 'New Users', value: '142', change: '+18%', icon: Users },
          { title: 'Active Today', value: '834', change: '+6%', icon: Activity },
          { title: 'Retention Rate', value: '76%', change: '+3%', icon: Target },
          { title: 'Avg Session', value: '12m', change: '+8%', icon: Clock }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-brand-secondary border-brand-surface">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-brand-text-muted">{stat.title}</p>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                    <Badge variant="outline" className="text-xs mt-1">{stat.change}</Badge>
                  </div>
                  <Icon className="w-6 h-6 text-brand-accent" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            User Demographics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-white mb-3">Geographic Distribution</h4>
              <div className="space-y-2">
                {['United States', 'United Kingdom', 'Germany', 'France', 'Other'].map((country, index) => (
                  <div key={country} className="flex items-center justify-between">
                    <span className="text-sm text-white">{country}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={45 - index * 8} className="w-20 h-2" />
                      <span className="text-xs text-brand-text-muted w-8">{45 - index * 8}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-white mb-3">User Tiers</h4>
              <div className="space-y-2">
                {['SOVEREIGN', 'CREATOR', 'SEEKER', 'EXPLORER'].map((tier, index) => (
                  <div key={tier} className="flex items-center justify-between">
                    <span className="text-sm text-white">{tier}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={[15, 25, 35, 25][index]} className="w-20 h-2" />
                      <span className="text-xs text-brand-text-muted w-8">{[15, 25, 35, 25][index]}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const PerformanceAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-brand-secondary border-brand-surface">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-muted">System Load</p>
                <p className="text-2xl font-bold text-green-400">23%</p>
              </div>
              <Activity className="w-8 h-8 text-green-400" />
            </div>
            <Progress value={23} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-brand-secondary border-brand-surface">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-muted">Response Time</p>
                <p className="text-2xl font-bold text-blue-400">145ms</p>
              </div>
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-secondary border-brand-surface">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-muted">Uptime</p>
                <p className="text-2xl font-bold text-green-400">99.9%</p>
              </div>
              <Award className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-brand-text-muted mx-auto mb-4" />
              <p className="text-brand-text-muted">Performance charts visualization</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Analytics Hub</h2>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-brand-surface border-brand-surface">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant={activeView === 'overview' ? 'default' : 'outline'}
          onClick={() => setActiveView('overview')}
          size="sm"
        >
          Overview
        </Button>
        <Button
          variant={activeView === 'capsules' ? 'default' : 'outline'}
          onClick={() => setActiveView('capsules')}
          size="sm"
        >
          Capsules
        </Button>
        <Button
          variant={activeView === 'users' ? 'default' : 'outline'}
          onClick={() => setActiveView('users')}
          size="sm"
        >
          Users
        </Button>
        <Button
          variant={activeView === 'performance' ? 'default' : 'outline'}
          onClick={() => setActiveView('performance')}
          size="sm"
        >
          Performance
        </Button>
      </div>

      {activeView === 'overview' && <OverviewAnalytics />}
      {activeView === 'capsules' && <CapsuleAnalytics />}
      {activeView === 'users' && <UserAnalytics />}
      {activeView === 'performance' && <PerformanceAnalytics />}
    </div>
  );
}