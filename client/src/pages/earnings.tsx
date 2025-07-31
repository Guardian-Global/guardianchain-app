import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Coins, TrendingUp, Award, Calendar } from "lucide-react";
import { useTierContext } from "@/context/TierContext";

export default function EarningsPage() {
  const { userRole } = useTierContext();
  
  const isPro = userRole === "pro" || userRole === "enterprise";

  if (!isPro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-4xl mx-auto pt-20">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="text-center">
              <Coins className="w-16 h-16 mx-auto text-purple-400 mb-4" />
              <CardTitle className="text-2xl text-white">Earnings Dashboard</CardTitle>
              <CardDescription className="text-slate-300">
                Track your GTT token earnings and rewards
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="p-6 bg-slate-700/30 rounded-lg border border-purple-500/20">
                <h3 className="text-lg font-semibold text-white mb-2">Pro Feature Required</h3>
                <p className="text-slate-300 mb-4">
                  Access detailed earnings analytics with Pro membership.
                </p>
                <a href="/upgrade" className="inline-block px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700">
                  Upgrade to Pro
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto pt-20 space-y-6">
        {/* Header */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Coins className="w-8 h-8 text-purple-400" />
              Earnings Dashboard
            </CardTitle>
            <CardDescription className="text-slate-300">
              Track your GTT token earnings, staking rewards, and achievement bonuses
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Earnings Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total GTT</p>
                  <p className="text-2xl font-bold text-white">1,247</p>
                </div>
                <Coins className="w-8 h-8 text-purple-400" />
              </div>
              <Badge variant="outline" className="mt-2 text-green-400 border-green-400">
                +12.5% this month
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Staking Rewards</p>
                  <p className="text-2xl font-bold text-white">346</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
              <Badge variant="outline" className="mt-2 text-blue-400 border-blue-400">
                8.5% APY
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Referral Bonus</p>
                  <p className="text-2xl font-bold text-white">600</p>
                </div>
                <Award className="w-8 h-8 text-green-400" />
              </div>
              <Badge variant="outline" className="mt-2 text-purple-400 border-purple-400">
                12 referrals
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">This Month</p>
                  <p className="text-2xl font-bold text-white">124</p>
                </div>
                <Calendar className="w-8 h-8 text-orange-400" />
              </div>
              <Badge variant="outline" className="mt-2 text-orange-400 border-orange-400">
                +24 from last month
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Earning Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Monthly Goals</CardTitle>
              <CardDescription className="text-slate-300">
                Track your earning targets for this month
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">GTT Earning Goal</span>
                  <span className="text-white">124 / 200</span>
                </div>
                <Progress value={62} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">Referral Target</span>
                  <span className="text-white">3 / 5</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">Staking Rewards</span>
                  <span className="text-white">28 / 40</span>
                </div>
                <Progress value={70} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Earnings</CardTitle>
              <CardDescription className="text-slate-300">
                Your latest GTT token transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white text-sm">Referral Bonus</p>
                    <p className="text-slate-400 text-xs">2 hours ago</p>
                  </div>
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    +50 GTT
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white text-sm">Staking Reward</p>
                    <p className="text-slate-400 text-xs">1 day ago</p>
                  </div>
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    +12 GTT
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white text-sm">Truth Capsule Reward</p>
                    <p className="text-slate-400 text-xs">3 days ago</p>
                  </div>
                  <Badge variant="outline" className="text-purple-400 border-purple-400">
                    +25 GTT
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white text-sm">Achievement Bonus</p>
                    <p className="text-slate-400 text-xs">1 week ago</p>
                  </div>
                  <Badge variant="outline" className="text-orange-400 border-orange-400">
                    +100 GTT
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}