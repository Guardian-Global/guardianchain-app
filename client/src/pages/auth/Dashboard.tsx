import { useAuth } from "@/hooks/useAuth";
import { TierGate } from "@/components/auth/TierGate";
import { SubscriptionManager } from "@/components/subscription/SubscriptionManager";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Zap
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
          <Button onClick={() => window.location.href = '/api/login'}>
            Sign in with Replit
          </Button>
        </div>
      </div>
    );
  }

  const userTier = user.tier || 'EXPLORER';
  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'SEEKER': return Star;
      case 'CREATOR': return Zap;
      case 'SOVEREIGN': return Crown;
      default: return Shield;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'SEEKER': return 'text-purple-400';
      case 'CREATOR': return 'text-green-400';
      case 'SOVEREIGN': return 'text-yellow-400';
      default: return 'text-blue-400';
    }
  };

  const TierIcon = getTierIcon(userTier);
  const tierColor = getTierColor(userTier);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Veritas Dashboard
              </h1>
              <Badge variant="secondary" className="bg-green-600/20 text-green-400">
                Truth Network
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.profileImageUrl} />
                  <AvatarFallback className="bg-blue-600">
                    {user.firstName?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">
                  {user.firstName || user.email?.split('@')[0] || 'User'}
                </span>
                <Badge variant="outline" className={`text-xs ${tierColor}`}>
                  <TierIcon className="h-3 w-3 mr-1" />
                  {userTier}
                </Badge>
              </div>
              
              <Button variant="ghost" size="sm" asChild>
                <Link href="/settings">
                  <Settings className="h-4 w-4" />
                </Link>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = '/api/logout'}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {user.firstName || 'Truth Seeker'}!
          </h2>
          <p className="text-gray-400">
            Ready to verify truth and earn GTT rewards?
          </p>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="creator">
              Creator Tools
              {(userTier === 'CREATOR' || userTier === 'SOVEREIGN') && (
                <Badge className="ml-2 bg-green-600/20 text-green-400">Active</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="sovereign">
              Sovereign
              {userTier === 'SOVEREIGN' && (
                <Badge className="ml-2 bg-yellow-600/20 text-yellow-400">Active</Badge>
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
                  <p className="text-xs text-gray-400">Truth capsules created</p>
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
                  <CardDescription>Your latest verification activities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Verified: Climate Report 2024</p>
                      <p className="text-xs text-gray-400">+50 GTT • 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Created: Election Analysis</p>
                      <p className="text-xs text-gray-400">3 verifications pending • 4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Staked: 100 GTT</p>
                      <p className="text-xs text-gray-400">Earning rewards • 1 day ago</p>
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

            {/* Quick Actions */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button className="h-20 flex-col gap-2" asChild>
                    <Link href="/create-capsule">
                      <Plus className="h-6 w-6" />
                      Create Capsule
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                    <Link href="/verify">
                      <Shield className="h-6 w-6" />
                      Verify Truth
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                    <Link href="/earn">
                      <Coins className="h-6 w-6" />
                      Earn GTT
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription">
            <SubscriptionManager />
          </TabsContent>

          {/* Creator Tools Tab */}
          <TabsContent value="creator">
            <TierGate requiredTier="CREATOR">
              <div className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-green-400" />
                      Creator Dashboard
                    </CardTitle>
                    <CardDescription>
                      Advanced tools for professional truth verification
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Button className="h-20 flex-col gap-2" asChild>
                        <Link href="/api-access">
                          <TrendingUp className="h-6 w-6" />
                          API Access
                        </Link>
                      </Button>
                      <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                        <Link href="/analytics">
                          <Eye className="h-6 w-6" />
                          Analytics
                        </Link>
                      </Button>
                      <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                        <Link href="/truth-bounty">
                          <Coins className="h-6 w-6" />
                          Truth Bounties
                        </Link>
                      </Button>
                      <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                        <Link href="/custom-branding">
                          <Star className="h-6 w-6" />
                          Custom Branding
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TierGate>
          </TabsContent>

          {/* Sovereign Tab */}
          <TabsContent value="sovereign">
            <TierGate requiredTier="SOVEREIGN">
              <div className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-yellow-400" />
                      Sovereign Control Center
                    </CardTitle>
                    <CardDescription>
                      Enterprise-grade governance and revenue tools
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Button className="h-20 flex-col gap-2" asChild>
                        <Link href="/governance">
                          <Users className="h-6 w-6" />
                          Governance
                        </Link>
                      </Button>
                      <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                        <Link href="/revenue-sharing">
                          <Coins className="h-6 w-6" />
                          Revenue Sharing
                        </Link>
                      </Button>
                      <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                        <Link href="/white-label">
                          <Star className="h-6 w-6" />
                          White Label
                        </Link>
                      </Button>
                      <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                        <Link href="/enterprise-support">
                          <Shield className="h-6 w-6" />
                          Enterprise Support
                        </Link>
                      </Button>
                    </div>

                    <Card className="bg-slate-700/50 border-slate-600">
                      <CardHeader>
                        <CardTitle className="text-lg">Revenue Analytics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-2xl font-bold text-green-400">$2,450</p>
                            <p className="text-sm text-gray-400">This Month</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-blue-400">15.2%</p>
                            <p className="text-sm text-gray-400">Revenue Share</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-purple-400">$28,900</p>
                            <p className="text-sm text-gray-400">Total Earned</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </div>
            </TierGate>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}