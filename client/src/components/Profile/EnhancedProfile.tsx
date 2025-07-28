import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Trophy,
  Target,
  Coins,
  Shield,
  Award,
  GitBranch,
  Eye,
  Share2,
  Vote,
  TrendingUp,
  Calendar,
  ExternalLink,
  Edit3,
  Settings,
} from "lucide-react";
import { BRAND_COLORS } from "@/lib/constants";

interface UserProfile {
  id: string;
  username: string;
  walletAddress: string;
  bio: string;
  avatar: string;
  reputation: number;
  xpPoints: number;
  totalCapsules: number;
  verifiedCapsules: number;
  gttBalance: string;
  badges: string[];
  achievements: Achievement[];
  socialLinks: Record<string, string>;
  isVerified: boolean;
  createdAt: string;
  stats: UserStats;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  iconUrl: string;
  unlockedAt: string;
}

interface UserStats {
  totalViews: number;
  totalShares: number;
  totalVotes: number;
  accuracyRate: number;
  daoParticipation: number;
  weeklyActive: boolean;
  monthlyRank: number;
  capsulesByType: Record<string, number>;
}

interface EnhancedProfileProps {
  user: UserProfile;
  isOwnProfile: boolean;
  onEdit?: () => void;
}

export default function EnhancedProfile({
  user,
  isOwnProfile,
  onEdit,
}: EnhancedProfileProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "text-yellow-400 bg-yellow-400/20";
      case "epic":
        return "text-purple-400 bg-purple-400/20";
      case "rare":
        return "text-blue-400 bg-blue-400/20";
      default:
        return "text-gray-400 bg-gray-400/20";
    }
  };

  const getXPProgress = () => {
    const currentLevel = Math.floor(user.xpPoints / 1000);
    const nextLevelXP = (currentLevel + 1) * 1000;
    const currentLevelXP = currentLevel * 1000;
    const progress =
      ((user.xpPoints - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
    return { currentLevel, progress, nextLevelXP };
  };

  const { currentLevel, progress, nextLevelXP } = getXPProgress();

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header */}
        <Card className="mb-8 bg-gradient-to-r from-slate-800/90 to-slate-700/90 border-slate-600">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Avatar & Basic Info */}
              <div className="flex flex-col items-center md:items-start">
                <div className="relative">
                  <img
                    src={user.avatar || "/default-avatar.png"}
                    alt={user.username}
                    className="w-24 h-24 rounded-full border-4 border-purple-500/50"
                  />
                  {user.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <div className="text-center md:text-left mt-4">
                  <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    {user.username}
                    {user.isVerified && (
                      <Badge className="bg-green-600 text-white">
                        Verified
                      </Badge>
                    )}
                  </h1>
                  <p className="text-slate-400 text-sm font-mono">
                    {user.walletAddress.slice(0, 6)}...
                    {user.walletAddress.slice(-4)}
                  </p>
                  <p className="text-slate-300 mt-2 max-w-md">{user.bio}</p>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {user.totalCapsules}
                  </div>
                  <div className="text-slate-400 text-sm">Capsules</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {user.verifiedCapsules}
                  </div>
                  <div className="text-slate-400 text-sm">Verified</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {user.gttBalance}
                  </div>
                  <div className="text-slate-400 text-sm">GTT</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {user.reputation}
                  </div>
                  <div className="text-slate-400 text-sm">Reputation</div>
                </div>
              </div>

              {/* Actions */}
              {isOwnProfile && (
                <div className="flex gap-2">
                  <Button
                    onClick={onEdit}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="border-slate-600">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* XP Progress */}
            <div className="mt-6 bg-slate-700/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-semibold">
                    Level {currentLevel}
                  </span>
                </div>
                <span className="text-slate-400 text-sm">
                  {user.xpPoints}/{nextLevelXP} XP
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-purple-600"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="capsules"
              className="data-[state=active]:bg-purple-600"
            >
              Capsules
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="data-[state=active]:bg-purple-600"
            >
              Achievements
            </TabsTrigger>
            <TabsTrigger
              value="nfts"
              className="data-[state=active]:bg-purple-600"
            >
              NFT Collection
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="data-[state=active]:bg-purple-600"
            >
              Activity
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Performance Metrics */}
              <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    <span className="text-white">Performance Metrics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                      <Eye className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                      <div className="text-lg font-bold text-white">
                        {user.stats.totalViews.toLocaleString()}
                      </div>
                      <div className="text-slate-400 text-xs">Total Views</div>
                    </div>
                    <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                      <Share2 className="w-5 h-5 text-green-400 mx-auto mb-1" />
                      <div className="text-lg font-bold text-white">
                        {user.stats.totalShares}
                      </div>
                      <div className="text-slate-400 text-xs">Shares</div>
                    </div>
                    <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                      <Vote className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                      <div className="text-lg font-bold text-white">
                        {user.stats.totalVotes}
                      </div>
                      <div className="text-slate-400 text-xs">DAO Votes</div>
                    </div>
                    <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                      <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                      <div className="text-lg font-bold text-white">
                        {user.stats.accuracyRate}%
                      </div>
                      <div className="text-slate-400 text-xs">Accuracy</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">
                          DAO Participation
                        </span>
                        <span className="text-white">
                          {user.stats.daoParticipation}%
                        </span>
                      </div>
                      <Progress
                        value={user.stats.daoParticipation}
                        className="h-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Badges */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-400" />
                    <span className="text-white">Recent Badges</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {user.badges.slice(0, 6).map((badge, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-slate-700/30 rounded"
                      >
                        <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                          <Award className="w-3 h-3 text-yellow-900" />
                        </div>
                        <span className="text-slate-300 text-sm">{badge}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Capsule Types Breakdown */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5 text-blue-400" />
                  <span className="text-white">Capsule Portfolio</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {Object.entries(user.stats.capsulesByType).map(
                    ([type, count]) => (
                      <div
                        key={type}
                        className="text-center p-3 bg-slate-700/30 rounded-lg"
                      >
                        <div className="text-lg font-bold text-white">
                          {count}
                        </div>
                        <div className="text-slate-400 text-xs capitalize">
                          {type.toLowerCase()}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  <span className="text-white">Achievements Unlocked</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {user.achievements.map((achievement) => (
                    <Card
                      key={achievement.id}
                      className="bg-slate-700/30 border-slate-600"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <img
                            src={achievement.iconUrl}
                            alt={achievement.title}
                            className="w-10 h-10 rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-white font-semibold text-sm">
                                {achievement.title}
                              </h3>
                              <Badge
                                className={getRarityColor(achievement.rarity)}
                              >
                                {achievement.rarity}
                              </Badge>
                            </div>
                            <p className="text-slate-400 text-xs mb-2">
                              {achievement.description}
                            </p>
                            <div className="flex items-center gap-1 text-slate-500 text-xs">
                              <Calendar className="w-3 h-3" />
                              {new Date(
                                achievement.unlockedAt
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs would be implemented similarly... */}
        </Tabs>
      </div>
    </div>
  );
}
