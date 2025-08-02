import { useAuth } from "@/hooks/useAuth";
import { TierGate } from "@/components/auth/TierGate";
import { SubscriptionManager } from "@/components/subscription/SubscriptionManager";
import { AIAdvisorPanel } from "@/components/dashboard/AIAdvisorPanel";
import { NFTAvatarSystem } from "@/components/dashboard/NFTAvatarSystem";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  Users,
  Coins,
  Award,
  Plus,
  Settings,
  TrendingUp,
  Eye,
  LogOut,
  User,
  Crown,
  Star,
  Zap,
  Brain,
  BarChart3,
  Wallet,
} from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Authentication Required</h2>
          <Button onClick={() => (window.location.href = "/api/login")}>
            Sign in with Replit
          </Button>
        </div>
      </div>
    );
  }

  const userTier = (user as any)?.tier || "EXPLORER";
  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "SEEKER":
        return Star;
      case "CREATOR":
        return Zap;
      case "SOVEREIGN":
        return Crown;
      default:
        return Shield;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "SEEKER":
        return "text-purple-400";
      case "CREATOR":
        return "text-green-400";
      case "SOVEREIGN":
        return "text-yellow-400";
      default:
        return "text-blue-400";
    }
  };

  const TierIcon = getTierIcon(userTier);
  const tierColor = getTierColor(userTier);
  const currentUser = user as any;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white">
      {/* Enhanced Header with Glass Effect */}
      <div className="border-b border-slate-800/50 bg-slate-800/30 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/logo/GUARDIANCHAIN_logo.png"
                  alt="GuardianChain"
                  className="h-8 w-auto"
                />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Truth Vault
                </h1>
              </div>
              <Badge
                variant="secondary"
                className="bg-emerald-600/20 text-emerald-400 border-emerald-500/30"
              >
                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse" />
                Live Network
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              {/* Enhanced Profile Panel */}
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/10">
                <Avatar className="h-10 w-10 ring-2 ring-purple-400/50">
                  <AvatarImage src={currentUser?.profileImageUrl} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold">
                    {currentUser?.firstName?.[0] ||
                      currentUser?.email?.[0]?.toUpperCase() ||
                      "G"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">
                    {currentUser?.firstName ||
                      currentUser?.email?.split("@")[0] ||
                      "Guardian"}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${tierColor} w-fit border-current/30`}
                  >
                    <TierIcon className="h-3 w-3 mr-1" />
                    {userTier}
                  </Badge>
                </div>
              </div>

              <Button variant="ghost" size="sm" className="rounded-xl">
                <Settings className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl"
                onClick={() => (window.location.href = "/api/logout")}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Welcome Section */}
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Welcome back, {currentUser?.firstName || "Truth Guardian"}!
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Your sovereign memory protocol awaits. Ready to preserve truth for
            digital immortality?
          </p>
        </div>

        {/* Navigation Shortcuts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Button
            asChild
            className="h-20 bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-2xl hover:scale-105 transition-all duration-200"
          >
            <Link
              href="/create-truth-capsule"
              className="flex flex-col items-center gap-2"
            >
              <Shield className="h-6 w-6 text-purple-400" />
              <span className="text-sm font-medium">Create Capsule</span>
            </Link>
          </Button>

          <Button
            asChild
            className="h-20 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl hover:scale-105 transition-all duration-200"
          >
            <Link
              href="/validator"
              className="flex flex-col items-center gap-2"
            >
              <Users className="h-6 w-6 text-blue-400" />
              <span className="text-sm font-medium">Validator Panel</span>
            </Link>
          </Button>

          <Button
            asChild
            className="h-20 bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-2xl hover:scale-105 transition-all duration-200"
          >
            <Link
              href="/dashboard/yield"
              className="flex flex-col items-center gap-2"
            >
              <Coins className="h-6 w-6 text-green-400" />
              <span className="text-sm font-medium">Capsule Yield</span>
            </Link>
          </Button>

          <Button
            asChild
            className="h-20 bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-2xl hover:scale-105 transition-all duration-200"
          >
            <Link href="/referral" className="flex flex-col items-center gap-2">
              <Award className="h-6 w-6 text-yellow-400" />
              <span className="text-sm font-medium">Refer + Earn</span>
            </Link>
          </Button>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="creator">
              Creator Tools
              {(userTier === "CREATOR" || userTier === "SOVEREIGN") && (
                <Badge className="ml-2 bg-green-600/20 text-green-400">
                  Active
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="sovereign">
              Sovereign
              {userTier === "SOVEREIGN" && (
                <Badge className="ml-2 bg-yellow-600/20 text-yellow-400">
                  Active
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-400" />
                    Truth Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400">95%</div>
                  <p className="text-xs text-gray-400">Verification accuracy</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Coins className="h-5 w-5 text-green-400" />
                    GTT Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">1,250</div>
                  <p className="text-xs text-gray-400">Available tokens</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Eye className="h-5 w-5 text-purple-400" />
                    Capsules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-400">23</div>
                  <p className="text-xs text-gray-400">
                    Truth capsules created
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-400" />
                    Rank
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-400">#47</div>
                  <p className="text-xs text-gray-400">Global leaderboard</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity & Tier Progress */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your latest verification activities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Verified: Climate Report 2024
                      </p>
                      <p className="text-xs text-gray-400">
                        +50 GTT • 2 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Created: Election Analysis
                      </p>
                      <p className="text-xs text-gray-400">
                        3 verifications pending • 4 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Staked: 100 GTT</p>
                      <p className="text-xs text-gray-400">
                        Earning rewards • 1 day ago
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Tier Progress</CardTitle>
                  <CardDescription>Progress to next tier</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current: {userTier}</span>
                      <span>750/1000 points</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div className="text-sm text-gray-400">
                    Complete 5 more verifications to unlock the next tier.
                  </div>
                  <Button size="sm" asChild>
                    <Link href="#subscription">View Upgrade Options</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* AI Advisor & NFT System */}
            <div className="grid lg:grid-cols-2 gap-6">
              <AIAdvisorPanel />
              <NFTAvatarSystem />
            </div>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="space-y-6">
            <TierGate requiredTier="EXPLORER">
              <SubscriptionManager />
            </TierGate>
          </TabsContent>

          {/* Creator Tools Tab */}
          <TabsContent value="creator" className="space-y-6">
            <TierGate requiredTier="CREATOR">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-slate-800/50 to-green-900/20 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-green-400" />
                      Creator Analytics
                    </CardTitle>
                    <CardDescription>
                      Monitor your content performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Total Capsules</span>
                        <span className="font-semibold">23</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Views</span>
                        <span className="font-semibold">15,420</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GTT Earned</span>
                        <span className="font-semibold text-green-400">
                          1,250
                        </span>
                      </div>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        View Detailed Analytics
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-slate-800/50 to-purple-900/20 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-purple-400" />
                      Revenue Streams
                    </CardTitle>
                    <CardDescription>Monetization dashboard</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Verification Rewards</span>
                        <span className="font-semibold text-green-400">
                          450 GTT
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Staking Returns</span>
                        <span className="font-semibold text-blue-400">
                          320 GTT
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Premium Access</span>
                        <span className="font-semibold text-purple-400">
                          480 GTT
                        </span>
                      </div>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        Withdraw Earnings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TierGate>
          </TabsContent>

          {/* Sovereign Tab */}
          <TabsContent value="sovereign" className="space-y-6">
            <TierGate requiredTier="SOVEREIGN">
              <div className="text-center py-12">
                <Crown className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Sovereign Features</h3>
                <p className="text-gray-400 mb-6">
                  Advanced governance and enterprise tools for truth
                  verification leaders.
                </p>
                <Button className="bg-yellow-600 hover:bg-yellow-700">
                  Access Sovereign Dashboard
                </Button>
              </div>
            </TierGate>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
