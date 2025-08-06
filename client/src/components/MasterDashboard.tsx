import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Shield,
  Award,
  Clock,
  Globe,
  Zap,
  Target,
  Coins,
  Star,
  FileText,
  Calendar
} from "lucide-react";

// Master Dashboard Component - Consolidates all dashboard functionality
// Replaces: Dashboard.tsx, AdminDashboard.tsx, UserDashboard.tsx, MetricsDashboard.tsx, etc.
export default function MasterDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'capsules' | 'analytics' | 'activity'>('overview');

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'My Capsules', value: '24', change: '+3', icon: FileText, color: 'text-blue-400' },
          { title: 'GTT Balance', value: '847.2', change: '+42.1', icon: Coins, color: 'text-yellow-400' },
          { title: 'Truth Score', value: '92.4%', change: '+2.1%', icon: Target, color: 'text-green-400' },
          { title: 'Community Rank', value: '#127', change: '+5', icon: Award, color: 'text-purple-400' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-brand-secondary border-brand-surface">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                  <Badge variant="outline" className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-sm text-brand-text-muted">{stat.title}</p>
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
              <Activity className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { action: 'Capsule "My Truth" verified', time: '2h ago', icon: Shield, color: 'text-green-400' },
                { action: 'Earned 15.3 GTT yield', time: '4h ago', icon: Coins, color: 'text-yellow-400' },
                { action: 'NFT "Memory #42" minted', time: '1d ago', icon: Star, color: 'text-purple-400' },
                { action: 'Truth Score increased to 92.4%', time: '2d ago', icon: TrendingUp, color: 'text-blue-400' }
              ].map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-brand-surface rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${activity.color}`} />
                      <span className="text-sm text-white">{activity.action}</span>
                    </div>
                    <span className="text-xs text-brand-text-muted">{activity.time}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-secondary border-brand-surface">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-brand-text-muted">Monthly GTT Goal</span>
                  <span className="text-white">847 / 1000</span>
                </div>
                <Progress value={84.7} className="h-3" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-brand-text-muted">Truth Score Progress</span>
                  <span className="text-white">92.4%</span>
                </div>
                <Progress value={92.4} className="h-3" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-brand-text-muted">Community Engagement</span>
                  <span className="text-white">78%</span>
                </div>
                <Progress value={78} className="h-3" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const CapsulesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">My Capsule Portfolio</h3>
        <Button size="sm" className="bg-brand-primary">
          <Zap className="w-4 h-4 mr-2" />
          Create New
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, index) => (
          <Card key={index} className="bg-brand-secondary border-brand-surface">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-white mb-1">Truth Capsule #{index + 1}</h4>
                  <p className="text-xs text-brand-text-muted">Created {index + 1} days ago</p>
                </div>
                <Badge variant={index % 3 === 0 ? "default" : "outline"} className="text-xs">
                  {index % 3 === 0 ? 'Verified' : 'Pending'}
                </Badge>
              </div>
              
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-text-muted">Truth Score</span>
                  <span className="text-green-400">{88 + index}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-text-muted">GTT Earned</span>
                  <span className="text-yellow-400">{(20 - index * 1.5).toFixed(1)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-text-muted">Engagement</span>
                  <span className="text-purple-400">{(Math.random() * 100).toFixed(0)}%</span>
                </div>
              </div>

              <div className="flex gap-2 text-xs text-brand-text-muted">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {Math.floor(Math.random() * 2000)}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  {Math.floor(Math.random() * 200)}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  {Math.floor(Math.random() * 50)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const AnalyticsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: 'Total Views', value: '45.2K', icon: Eye },
          { title: 'Interactions', value: '2.8K', icon: Heart },
          { title: 'Shares', value: '847', icon: MessageCircle },
          { title: 'Influence Score', value: '1,247', icon: TrendingUp }
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="bg-brand-secondary border-brand-surface">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-brand-text-muted">{metric.title}</p>
                    <p className="text-xl font-bold text-white">{metric.value}</p>
                  </div>
                  <Icon className="w-6 h-6 text-brand-accent" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-brand-secondary border-brand-surface">
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-brand-text-muted mx-auto mb-4" />
                <p className="text-brand-text-muted">Chart visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-secondary border-brand-surface">
          <CardHeader>
            <CardTitle>Top Performing Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-brand-surface rounded">
                  <div>
                    <p className="text-sm font-medium text-white">Truth Capsule #{index + 1}</p>
                    <p className="text-xs text-brand-text-muted">{(Math.random() * 5000).toFixed(0)} views</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {90 - index * 2}% truth
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const ActivityTab = () => (
    <div className="space-y-6">
      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Global Guardian Network Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-brand-surface rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-accent/20 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-brand-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      Guardian-{(Math.random() * 9999).toFixed(0)}
                    </p>
                    <p className="text-xs text-brand-text-muted">
                      {['Created capsule', 'Verified truth', 'Earned GTT', 'Joined network'][Math.floor(Math.random() * 4)]}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-brand-text-muted">
                    {Math.floor(Math.random() * 120)} mins ago
                  </p>
                  <Badge variant="outline" className="text-xs">
                    +{(Math.random() * 10).toFixed(1)} GTT
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">GuardianChain Dashboard</h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            <Shield className="w-3 h-3 mr-1" />
            SEEKER Tier
          </Badge>
          <Badge variant="default" className="text-sm">
            <Clock className="w-3 h-3 mr-1" />
            Online
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-4 bg-brand-surface">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="capsules">Capsules</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="capsules" className="space-y-6">
          <CapsulesTab />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsTab />
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <ActivityTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}