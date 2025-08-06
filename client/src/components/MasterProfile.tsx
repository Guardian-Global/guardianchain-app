import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Star, 
  Calendar, 
  UserPlus, 
  Settings,
  FileText,
  Users,
  Trophy,
  Zap,
  Clock,
  Eye,
  Heart,
  TrendingUp,
  BarChart3,
  Activity,
  Upload,
  Palette,
  Globe
} from "lucide-react";

interface ProfileData {
  id: string;
  wallet: string;
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  coverImage?: string;
  truthScore: number;
  reputation: number;
  joinedAt: string;
  isVerified: boolean;
  badges: number;
  capsuleCount: number;
  friendCount: number;
  gttEarned: number;
  totalViews: number;
  recentActivity: number;
}

interface CapsuleStats {
  totalCapsules: number;
  verifiedCapsules: number;
  timeSealedCapsules: number;
  weeklyActivity: number;
  avgTruthScore: number;
  totalGTT: number;
  totalViews: number;
  engagementRate: number;
}

interface MasterProfileProps {
  profile: ProfileData;
  capsuleStats: CapsuleStats;
  isOwnProfile?: boolean;
  onEdit?: () => void;
}

export default function MasterProfile({ 
  profile, 
  capsuleStats, 
  isOwnProfile = false, 
  onEdit 
}: MasterProfileProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const getTruthScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400 border-green-500";
    if (score >= 75) return "text-blue-400 border-blue-500";
    if (score >= 60) return "text-yellow-400 border-yellow-500";
    return "text-red-400 border-red-500";
  };

  const ProfileHeader = () => (
    <Card className="bg-brand-secondary border-brand-surface overflow-hidden">
      {profile.coverImage && (
        <div 
          className="h-32 bg-gradient-to-r from-brand-primary to-brand-accent"
          style={{
            backgroundImage: `url(${profile.coverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}
      
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative">
            <img
              src={profile.avatar}
              alt={profile.displayName}
              className="w-24 h-24 rounded-full border-4 border-brand-surface object-cover"
            />
            {profile.isVerified && (
              <div className="absolute -bottom-2 -right-2">
                <div className="bg-green-500 rounded-full p-1">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  {profile.displayName}
                  {profile.isVerified && <Shield className="w-5 h-5 text-green-400" />}
                </h1>
                <p className="text-brand-text-secondary">@{profile.username}</p>
                <p className="text-sm text-brand-text-muted mt-2">{profile.bio}</p>
              </div>

              <div className="flex flex-col gap-2 mt-4 md:mt-0">
                <Badge className={`${getTruthScoreColor(profile.truthScore)} bg-transparent`}>
                  Truth Score: {profile.truthScore}%
                </Badge>
                {isOwnProfile && (
                  <Button onClick={onEdit} size="sm" className="bg-brand-primary hover:bg-brand-primary/80">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-xl font-bold text-white">{profile.capsuleCount}</p>
                <p className="text-sm text-brand-text-muted">Capsules</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-white">{profile.friendCount}</p>
                <p className="text-sm text-brand-text-muted">Friends</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-white">{profile.badges}</p>
                <p className="text-sm text-brand-text-muted">Badges</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-brand-accent">{profile.gttEarned} GTT</p>
                <p className="text-sm text-brand-text-muted">Earned</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ProfileStats = () => {
    const stats = [
      {
        title: "Total Capsules",
        value: capsuleStats.totalCapsules,
        icon: FileText,
        color: "text-blue-400",
        description: "Truth capsules created"
      },
      {
        title: "Verified",
        value: capsuleStats.verifiedCapsules,
        icon: Shield,
        color: "text-green-400",
        description: "Community verified"
      },
      {
        title: "Time Sealed",
        value: capsuleStats.timeSealedCapsules,
        icon: Clock,
        color: "text-purple-400",
        description: "Future unlock capsules"
      },
      {
        title: "Total Views",
        value: capsuleStats.totalViews,
        icon: Eye,
        color: "text-cyan-400",
        description: "Profile visits"
      },
      {
        title: "GTT Earned",
        value: capsuleStats.totalGTT,
        icon: Zap,
        color: "text-yellow-400",
        description: "Token rewards"
      },
      {
        title: "Engagement",
        value: `${capsuleStats.engagementRate}%`,
        icon: Heart,
        color: "text-pink-400",
        description: "Community interaction"
      }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-brand-secondary border-brand-surface">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-brand-text-muted">{stat.title}</p>
                    <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-brand-text-muted">{stat.description}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  const ProfileAnalytics = () => (
    <div className="space-y-6">
      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Truth Score Progress</span>
                <span>{profile.truthScore}%</span>
              </div>
              <Progress value={profile.truthScore} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Community Engagement</span>
                <span>{capsuleStats.engagementRate}%</span>
              </div>
              <Progress value={capsuleStats.engagementRate} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Weekly Activity</span>
                <span>{capsuleStats.weeklyActivity} actions</span>
              </div>
              <Progress value={Math.min((capsuleStats.weeklyActivity / 50) * 100, 100)} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-brand-secondary border-brand-surface">
          <CardHeader>
            <CardTitle className="text-sm">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Activity className="w-12 h-12 text-brand-text-muted mx-auto mb-2" />
                <p className="text-sm text-brand-text-muted">Activity timeline coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-secondary border-brand-surface">
          <CardHeader>
            <CardTitle className="text-sm">Growth Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-brand-text-muted mx-auto mb-2" />
                <p className="text-sm text-brand-text-muted">Growth charts coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const ProfileCustomization = () => (
    <div className="space-y-6">
      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Theme & Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Default', 'Cosmic', 'Ocean', 'Forest'].map((theme) => (
              <Button key={theme} variant="outline" size="sm" className="h-12">
                {theme}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Media Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button variant="outline" className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Upload Avatar
            </Button>
            <Button variant="outline" className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Upload Cover Image
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <ProfileHeader />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="customize">Customize</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <ProfileStats />
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <ProfileStats />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <ProfileAnalytics />
        </TabsContent>

        <TabsContent value="customize" className="space-y-6">
          <ProfileCustomization />
        </TabsContent>
      </Tabs>
    </div>
  );
}