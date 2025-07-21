import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  User, 
  Shield, 
  Trophy, 
  Coins, 
  TrendingUp, 
  Star, 
  Award,
  Settings,
  Crown,
  Zap
} from "lucide-react";

interface UserTierInfo {
  current: string;
  nextTier: string;
  progress: number;
  benefits: string[];
  requirements: string;
}

const TIER_INFO: Record<string, UserTierInfo> = {
  EXPLORER: {
    current: "Explorer",
    nextTier: "Seeker", 
    progress: 25,
    benefits: ["5 capsules/month", "Basic verification", "Community access"],
    requirements: "10 verified capsules to advance"
  },
  SEEKER: {
    current: "Seeker",
    nextTier: "Creator",
    progress: 45,
    benefits: ["25 capsules/month", "Priority verification", "Advanced analytics"],
    requirements: "50 verified capsules to advance"
  },
  CREATOR: {
    current: "Creator", 
    nextTier: "Sovereign",
    progress: 70,
    benefits: ["100 capsules/month", "Premium features", "Revenue sharing"],
    requirements: "250 verified capsules to advance"
  },
  SOVEREIGN: {
    current: "Sovereign",
    nextTier: "Maximum Tier",
    progress: 100,
    benefits: ["Unlimited capsules", "Full platform access", "Governance voting"],
    requirements: "Maximum tier achieved"
  }
};

export default function ProfileDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: userStats } = useQuery({
    queryKey: ['/api/user/stats'],
    enabled: isAuthenticated && !!user,
    queryFn: () => apiRequest('GET', '/api/user/stats')
  });

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-slate-900 pt-16 flex items-center justify-center">
        <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-white">Authentication Required</CardTitle>
            <CardDescription>Please log in to view your profile</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <a href="/login">Login to Continue</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tierInfo = TIER_INFO[user.userTier as keyof typeof TIER_INFO] || TIER_INFO.EXPLORER;

  return (
    <div className="min-h-screen bg-slate-900 pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-purple-900/50 to-green-900/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-green-600 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-white" />
                </div>
                
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-slate-300 mb-4">@{user.username}</p>
                  
                  <div className="flex flex-wrap gap-4">
                    <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/50">
                      <Crown className="h-3 w-3 mr-1" />
                      {tierInfo.current} Tier
                    </Badge>
                    <Badge className="bg-green-600/20 text-green-300 border-green-500/50">
                      <Coins className="h-3 w-3 mr-1" />
                      {user.gttBalance} GTT
                    </Badge>
                    <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/50">
                      <Shield className="h-3 w-3 mr-1" />
                      Rep: {user.reputation}
                    </Badge>
                  </div>
                </div>

                <Button variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
              Overview
            </TabsTrigger>
            <TabsTrigger value="tier" className="data-[state=active]:bg-purple-600">
              Tier Progress
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-purple-600">
              Activity
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-600">
              Achievements
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-300">Total Capsules</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{user.totalCapsules}</div>
                  <p className="text-xs text-slate-400">Created by you</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-300">Verified</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">{user.verifiedCapsules}</div>
                  <p className="text-xs text-slate-400">Community verified</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-300">GTT Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-400">{user.gttBalance}</div>
                  <p className="text-xs text-slate-400">Available tokens</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-300">XP Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-400">{user.xpPoints}</div>
                  <p className="text-xs text-slate-400">Experience gained</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tier Progress Tab */}
          <TabsContent value="tier" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Tier Progression</CardTitle>
                <CardDescription>
                  Advance your tier to unlock more features and benefits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{tierInfo.current}</h3>
                    <p className="text-sm text-slate-400">Current Tier</p>
                  </div>
                  <div className="text-right">
                    <h3 className="text-lg font-semibold text-purple-400">{tierInfo.nextTier}</h3>
                    <p className="text-sm text-slate-400">Next Tier</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-white">{tierInfo.progress}%</span>
                  </div>
                  <Progress value={tierInfo.progress} className="w-full" />
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-white mb-2">Current Benefits</h4>
                    <ul className="space-y-1">
                      {tierInfo.benefits.map((benefit, index) => (
                        <li key={index} className="text-sm text-slate-300 flex items-center">
                          <Star className="h-3 w-3 mr-2 text-green-400" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-white mb-2">Requirements</h4>
                    <p className="text-sm text-slate-300">{tierInfo.requirements}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
                <CardDescription>Your latest actions on GUARDIANCHAIN</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                    <Shield className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="text-sm text-white">Created truth capsule</p>
                      <p className="text-xs text-slate-400">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                    <Trophy className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className="text-sm text-white">Earned verification badge</p>
                      <p className="text-xs text-slate-400">1 day ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                    <Coins className="h-5 w-5 text-amber-400" />
                    <div>
                      <p className="text-sm text-white">Received 50 GTT reward</p>
                      <p className="text-xs text-slate-400">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6 text-center">
                  <Award className="h-12 w-12 text-purple-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-white mb-2">Truth Pioneer</h3>
                  <p className="text-sm text-slate-400">Created your first capsule</p>
                  <Badge className="mt-2 bg-purple-600/20 text-purple-300">Earned</Badge>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6 text-center">
                  <Zap className="h-12 w-12 text-green-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-white mb-2">Verifier</h3>
                  <p className="text-sm text-slate-400">Verified 10 capsules</p>
                  <Badge className="mt-2 bg-green-600/20 text-green-300">Earned</Badge>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 opacity-50">
                <CardContent className="p-6 text-center">
                  <Crown className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-400 mb-2">Guardian Elite</h3>
                  <p className="text-sm text-slate-500">Reach Sovereign tier</p>
                  <Badge className="mt-2 bg-slate-600/20 text-slate-400">Locked</Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}