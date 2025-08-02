import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Coins, 
  TrendingUp, 
  Calendar, 
  Target,
  Zap,
  Lock,
  Unlock,
  BarChart3,
  PiggyBank,
  Award
} from "lucide-react";
import { Link } from "wouter";

export default function Yield() {
  const { user, isAuthenticated } = useAuth();
  const [stakingAmount, setStakingAmount] = useState<number>(100);
  const [stakingPeriod, setStakingPeriod] = useState<number>(30);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <Card className="bg-slate-800/50 border-slate-700 max-w-md">
          <CardHeader className="text-center">
            <Coins className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to access yield features.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/api/login">Login to Continue</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const calculateYield = (amount: number, period: number) => {
    const baseAPY = 0.12; // 12% base APY
    const userTier = (user as any)?.tier || 'EXPLORER';
    const tierMultiplier = userTier === 'SOVEREIGN' ? 1.5 : userTier === 'CREATOR' ? 1.25 : userTier === 'SEEKER' ? 1.1 : 1;
    const periodMultiplier = period >= 365 ? 1.5 : period >= 180 ? 1.25 : period >= 90 ? 1.1 : 1;
    
    const annualYield = amount * baseAPY * tierMultiplier * periodMultiplier;
    const periodYield = (annualYield * period) / 365;
    
    return {
      annual: annualYield,
      period: periodYield,
      apy: baseAPY * tierMultiplier * periodMultiplier * 100
    };
  };

  const yieldData = calculateYield(stakingAmount, stakingPeriod);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900/20 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-800/50 bg-slate-800/30 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/assets/logo/GUARDIANCHAIN_logo.png" 
                alt="GuardianChain" 
                className="h-8 w-auto"
              />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Capsule Yield
              </h1>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
            Maximize Your GTT Rewards
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Stake your GTT tokens to earn yields while supporting truth verification on the network.
          </p>
        </div>

        {/* Current Balance Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-slate-800/50 to-green-900/20 border-slate-700/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Coins className="h-5 w-5 text-green-400" />
                Available GTT
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">1,250</div>
              <p className="text-xs text-gray-400">Ready to stake</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-blue-900/20 border-slate-700/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock className="h-5 w-5 text-blue-400" />
                Staked GTT
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">850</div>
              <p className="text-xs text-gray-400">Currently earning</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-purple-900/20 border-slate-700/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-400" />
                Total Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">142.5</div>
              <p className="text-xs text-gray-400">Lifetime rewards</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-yellow-900/20 border-slate-700/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-400" />
                Current APY
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{yieldData.apy.toFixed(1)}%</div>
              <p className="text-xs text-gray-400">With tier bonus</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="calculator" className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger value="calculator">Yield Calculator</TabsTrigger>
            <TabsTrigger value="active">Active Stakes</TabsTrigger>
            <TabsTrigger value="history">Reward History</TabsTrigger>
          </TabsList>

          {/* Yield Calculator */}
          <TabsContent value="calculator" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-400" />
                    Staking Calculator
                  </CardTitle>
                  <CardDescription>
                    Calculate your potential GTT rewards
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Staking Amount (GTT)</label>
                    <div className="relative">
                      <input
                        type="range"
                        min="1"
                        max="10000"
                        value={stakingAmount}
                        onChange={(e) => setStakingAmount(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>1</span>
                        <span>{stakingAmount} GTT</span>
                        <span>10,000</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Staking Period (Days)</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[30, 90, 180, 365].map((period) => (
                        <Button
                          key={period}
                          variant={stakingPeriod === period ? "default" : "outline"}
                          onClick={() => setStakingPeriod(period)}
                          className="text-sm"
                        >
                          {period}d
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-700/50 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Estimated Yield:</span>
                      <span className="font-semibold text-green-400">
                        {yieldData.period.toFixed(2)} GTT
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Annual APY:</span>
                      <span className="font-semibold text-yellow-400">
                        {yieldData.apy.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Tier Multiplier:</span>
                      <Badge className="bg-purple-600/20 text-purple-400">
                        {(user as any)?.tier || 'EXPLORER'}
                      </Badge>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600">
                    <PiggyBank className="h-4 w-4 mr-2" />
                    Stake {stakingAmount} GTT
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                    Yield Breakdown
                  </CardTitle>
                  <CardDescription>
                    Understanding your rewards
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Base APY (12%)</span>
                      <span className="text-green-400">✓</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Tier Bonus</span>
                      <span className="text-blue-400">
                        +{(((user as any)?.tier === 'SOVEREIGN' ? 50 : (user as any)?.tier === 'CREATOR' ? 25 : (user as any)?.tier === 'SEEKER' ? 10 : 0))}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Period Bonus</span>
                      <span className="text-purple-400">
                        +{((stakingPeriod >= 365 ? 50 : stakingPeriod >= 180 ? 25 : stakingPeriod >= 90 ? 10 : 0))}%
                      </span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-xl p-4 border border-green-500/30">
                    <h4 className="font-semibold text-green-400 mb-2">Long-term Benefits</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Compound interest on rewards</li>
                      <li>• Higher tier progression</li>
                      <li>• Network governance participation</li>
                      <li>• Priority in truth verification</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Staking Tiers</h4>
                    {[
                      { tier: 'EXPLORER', min: 0, bonus: '0%', color: 'text-gray-400' },
                      { tier: 'SEEKER', min: 100, bonus: '+10%', color: 'text-purple-400' },
                      { tier: 'CREATOR', min: 1000, bonus: '+25%', color: 'text-green-400' },
                      { tier: 'SOVEREIGN', min: 10000, bonus: '+50%', color: 'text-yellow-400' }
                    ].map((tier) => (
                      <div key={tier.tier} className="flex justify-between items-center">
                        <span className={tier.color}>{tier.tier}</span>
                        <div className="text-right">
                          <span className="text-sm text-gray-400">{tier.min}+ GTT</span>
                          <span className={`ml-2 ${tier.color}`}>{tier.bonus}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Active Stakes */}
          <TabsContent value="active" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-blue-400" />
                  Active Staking Positions
                </CardTitle>
                <CardDescription>
                  Monitor your current stakes and rewards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { amount: 500, period: '90 days', progress: 45, earned: 12.5, unlockDate: '2025-04-15' },
                    { amount: 350, period: '180 days', progress: 20, earned: 8.2, unlockDate: '2025-07-20' },
                  ].map((stake, index) => (
                    <div key={index} className="p-4 bg-slate-700/50 rounded-xl border border-slate-600/50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-white">{stake.amount} GTT</h4>
                          <p className="text-sm text-gray-400">{stake.period} staking period</p>
                        </div>
                        <Badge variant="outline" className="text-green-400 border-green-500/30">
                          Active
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Progress</span>
                          <span className="text-blue-400">{stake.progress}% complete</span>
                        </div>
                        <Progress value={stake.progress} className="h-2" />
                        
                        <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                          <div>
                            <span className="text-gray-400">Earned:</span>
                            <span className="text-green-400 ml-2">{stake.earned} GTT</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Unlocks:</span>
                            <span className="text-purple-400 ml-2">{stake.unlockDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reward History */}
          <TabsContent value="history" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-400" />
                  Reward History
                </CardTitle>
                <CardDescription>
                  Track your GTT earning history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { date: '2025-08-01', type: 'Staking Reward', amount: '+2.4 GTT', source: '90-day stake' },
                    { date: '2025-07-31', type: 'Verification Bonus', amount: '+15.0 GTT', source: 'Truth verification' },
                    { date: '2025-07-30', type: 'Staking Reward', amount: '+2.4 GTT', source: '90-day stake' },
                    { date: '2025-07-29', type: 'Tier Bonus', amount: '+5.0 GTT', source: 'Creator tier upgrade' },
                    { date: '2025-07-28', type: 'Staking Reward', amount: '+2.4 GTT', source: '90-day stake' },
                  ].map((reward, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-white">{reward.type}</p>
                          <p className="text-sm text-gray-400">{reward.source}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold text-green-400">{reward.amount}</p>
                        <p className="text-xs text-gray-400">{reward.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}