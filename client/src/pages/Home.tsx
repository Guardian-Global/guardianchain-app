import { useAuth } from "@/hooks/useAuth";
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
  TrendingUp, 
  Eye,
  LogOut,
  User
} from "lucide-react";
import { Link } from "wouter";

export default function Home() {
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

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Veritas
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
                <Badge variant="outline" className="text-xs">
                  {user.tier || 'EXPLORER'}
                </Badge>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                asChild
              >
                <Link href="/profile-dashboard">
                  <User className="h-4 w-4" />
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

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
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

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="verify">Verify</TabsTrigger>
            <TabsTrigger value="earn">Earn</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
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
                  <CardDescription>Progress to next tier: SEEKER</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current: EXPLORER</span>
                      <span>750/1000 points</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div className="text-sm text-gray-400">
                    Complete 5 more verifications to unlock SEEKER tier with enhanced rewards.
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create Truth Capsule
                </CardTitle>
                <CardDescription>
                  Submit new information for community verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" asChild>
                  <Link href="/create-capsule">
                    Create New Capsule
                  </Link>
                </Button>
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <Shield className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-sm font-medium">Veritas Seal</p>
                    <p className="text-xs text-gray-400">Professional verification</p>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <p className="text-sm font-medium">Truth Bounty</p>
                    <p className="text-xs text-gray-400">Crowdsourced investigation</p>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <Eye className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-sm font-medium">Public Accountability</p>
                    <p className="text-xs text-gray-400">Transparent oversight</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verify">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Verification Queue</CardTitle>
                <CardDescription>Help verify truth and earn GTT rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-400">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No capsules pending verification at the moment.</p>
                  <p className="text-sm">Check back later for new verification opportunities.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earn">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Earning Opportunities</CardTitle>
                <CardDescription>Multiple ways to earn GTT tokens</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-700/30 rounded-lg">
                    <h4 className="font-semibold mb-2">Verification Rewards</h4>
                    <p className="text-sm text-gray-400 mb-3">Earn 10-100 GTT per verified capsule</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Start Verifying
                    </Button>
                  </div>
                  <div className="p-4 bg-slate-700/30 rounded-lg">
                    <h4 className="font-semibold mb-2">Staking Rewards</h4>
                    <p className="text-sm text-gray-400 mb-3">Earn 8% APY on staked GTT</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Stake Tokens
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}