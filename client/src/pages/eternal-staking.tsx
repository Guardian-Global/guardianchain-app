import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Clock,
  TrendingUp,
  Vault,
  Infinity,
  Shield,
  Coins,
  Users,
  Calendar,
  Award,
  Lock,
  Heart,
  Star,
  Zap,
  DollarSign,
  BarChart3,
  Target,
} from 'lucide-react';

export default function EternalStaking() {
  const [selectedPool, setSelectedPool] = useState('');
  const [stakingAmount, setStakingAmount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0 });

  const stakingPools = [
    {
      id: 'memory-vault-100',
      name: '100-Year Memory Vault',
      duration: '100 Years',
      apy: '9%',
      multiplier: '136x', // Realistic 136x multiplier instead of 16,900%
      minStake: '250 GTT',
      totalStaked: '42.5K GTT', // Realistic total staked amount
      participants: '127', // Realistic participant count
      badge: 'FLAGSHIP',
      color: 'purple',
      description: 'Transform family memories into generational wealth',
      benefits: ['Ultimate Security', 'Infinite Recovery', 'Family Legacy', 'Compound Growth']
    },
    {
      id: 'time-capsule-50',
      name: '50-Year Time Capsule',
      duration: '50 Years',
      apy: '8%',
      multiplier: '47x', // Realistic 47x multiplier
      minStake: '150 GTT',
      totalStaked: '18.2K GTT', // Realistic total staked
      participants: '89', // Realistic participant count
      badge: 'POPULAR',
      color: 'blue',
      description: 'Mid-term growth with substantial returns',
      benefits: ['High Yield', 'Proven Track Record', 'Flexible Exit', 'Regular Rewards']
    },
    {
      id: 'legacy-boost-25',
      name: '25-Year Legacy Boost',
      duration: '25 Years',
      apy: '7%',
      multiplier: '5.4x', // Realistic 5.4x multiplier
      minStake: '100 GTT',
      totalStaked: '32.1K GTT', // Realistic total staked
      participants: '216', // Realistic participant count
      badge: 'ACCELERATED',
      color: 'green',
      description: 'Accelerated growth for building family legacy',
      benefits: ['Fast Growth', 'Lower Barrier', 'Family Focus', 'Quick Multiplier']
    },
    {
      id: 'truth-preservation-10',
      name: '10-Year Truth Preservation',
      duration: '10 Years',
      apy: '6%',
      multiplier: '1.8x', // Realistic 1.8x multiplier
      minStake: '50 GTT',
      totalStaked: '51.3K GTT', // Realistic total staked
      participants: '452', // Realistic participant count
      badge: 'STARTER',
      color: 'yellow',
      description: 'Perfect entry point for new truth guardians',
      benefits: ['Low Entry', 'Stable Returns', 'Learning Experience', 'Community Access']
    },
  ];

  const recentActivities = [
    { user: 'FamilyVault247', action: 'Staked 500 GTT', pool: '100-Year Memory Vault', time: '2 mins ago' },
    { user: 'TruthSeeker89', action: 'Claimed 45 GTT', pool: '25-Year Legacy Boost', time: '5 mins ago' },
    { user: 'MemoryKeeper', action: 'Staked 1,250 GTT', pool: '50-Year Time Capsule', time: '8 mins ago' },
    { user: 'LegacyBuilder', action: 'Renewed stake', pool: '100-Year Memory Vault', time: '12 mins ago' },
  ];

  const portfolioData = [
    { name: 'Active Stakes', value: '0 GTT', change: '+0 GTT (24h)', color: 'text-green-400' }, // New user starts with zero
    { name: 'Pending Rewards', value: '0 GTT', change: '+0 GTT (24h)', color: 'text-yellow-400' }, // No rewards yet
    { name: 'Total Earned', value: '0 GTT', change: '+0 GTT (7d)', color: 'text-purple-400' }, // No earnings yet
    { name: 'Portfolio Value', value: '$0', change: '+$0 (24h)', color: 'text-blue-400' }, // Zero portfolio value for new user
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate countdown for next reward distribution
      setTimeRemaining({
        days: Math.floor(Math.random() * 7),
        hours: Math.floor(Math.random() * 24),
        minutes: Math.floor(Math.random() * 60),
      });
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const getPoolColor = (color: string) => {
    const colors = {
      purple: 'from-purple-600 to-indigo-600',
      blue: 'from-blue-600 to-cyan-600',
      green: 'from-green-600 to-emerald-600',
      yellow: 'from-yellow-600 to-orange-600',
    };
    return colors[color as keyof typeof colors] || colors.purple;
  };

  const getBadgeColor = (badge: string) => {
    const badges = {
      FLAGSHIP: 'bg-purple-600/20 text-purple-400',
      POPULAR: 'bg-blue-600/20 text-blue-400',
      ACCELERATED: 'bg-green-600/20 text-green-400',
      STARTER: 'bg-yellow-600/20 text-yellow-400',
    };
    return badges[badge as keyof typeof badges] || badges.FLAGSHIP;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          {/* Staking Demo Video */}
          <div className="relative mb-8 mx-auto max-w-3xl">
            <div className="relative rounded-xl overflow-hidden bg-slate-800/50 border border-slate-700">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-auto"
                style={{ maxHeight: '300px' }}
              >
                <source src="/capsule_mint_sealed_staked_video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3">
                <div className="text-white text-sm font-medium">100-Year Staking Process</div>
                <div className="text-slate-300 text-xs">See how capsules are sealed and staked for generational returns</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl flex items-center justify-center">
              <Clock className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">
            100-Year Eternal Staking
            <Badge className="ml-4 bg-yellow-600/20 text-yellow-400">YIELD ACTIVE</Badge>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Stake your GTT tokens and memory capsules for generational returns. 
            Turn today's investment into tomorrow's family fortune.
          </p>
        </div>

        <Tabs defaultValue="pools" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
            <TabsTrigger value="pools" className="data-[state=active]:bg-purple-600">
              Staking Pools
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-purple-600">
              My Portfolio
            </TabsTrigger>
            <TabsTrigger value="rewards" className="data-[state=active]:bg-purple-600">
              Rewards
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Staking Pools */}
          <TabsContent value="pools" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {stakingPools.map((pool) => (
                <Card
                  key={pool.id}
                  className={`cursor-pointer transition-all duration-300 ${
                    selectedPool === pool.id
                      ? 'bg-purple-600/20 border-purple-500 ring-2 ring-purple-500/50'
                      : 'bg-slate-800/50 border-slate-700 hover:border-purple-500/50'
                  }`}
                  onClick={() => setSelectedPool(pool.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white text-xl mb-2">{pool.name}</CardTitle>
                        <Badge className={getBadgeColor(pool.badge)}>{pool.badge}</Badge>
                      </div>
                      <div className={`w-12 h-12 bg-gradient-to-br ${getPoolColor(pool.color)} rounded-lg flex items-center justify-center`}>
                        <Vault className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 text-sm mb-6">{pool.description}</p>
                    
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                        <div className="text-2xl font-bold text-white">{pool.apy}</div>
                        <p className="text-slate-400 text-xs">Annual APY</p>
                      </div>
                      <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                        <div className="text-2xl font-bold text-green-400">{pool.multiplier}</div>
                        <p className="text-slate-400 text-xs">Total Multiplier</p>
                      </div>
                    </div>

                    {/* Pool Stats */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Duration:</span>
                        <span className="text-white font-medium">{pool.duration}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Min Stake:</span>
                        <span className="text-white font-medium">{pool.minStake}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Total Staked:</span>
                        <span className="text-green-400 font-medium">{pool.totalStaked}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Participants:</span>
                        <span className="text-blue-400 font-medium">{pool.participants}</span>
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-2">
                      <h4 className="text-white font-medium text-sm">Benefits:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {pool.benefits.map((benefit) => (
                          <div key={benefit} className="flex items-center space-x-2 text-xs">
                            <Star className="h-3 w-3 text-yellow-400" />
                            <span className="text-slate-300">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Stake Action */}
            {selectedPool && (
              <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-3">
                    <Zap className="h-6 w-6 text-yellow-400" />
                    <span>Stake in {stakingPools.find(p => p.id === selectedPool)?.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <label className="text-slate-300 text-sm mb-2 block">Stake Amount (GTT)</label>
                      <div className="flex space-x-4 mb-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setStakingAmount(250)}
                          className="border-purple-500 text-purple-400"
                        >
                          250 GTT
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setStakingAmount(500)}
                          className="border-purple-500 text-purple-400"
                        >
                          500 GTT
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setStakingAmount(1000)}
                          className="border-purple-500 text-purple-400"
                        >
                          1,000 GTT
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-4">Projection</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Stake Amount:</span>
                          <span className="text-white">{stakingAmount} GTT</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Final Value:</span>
                          <span className="text-green-400 font-bold">
                            {(stakingAmount * 16.9).toLocaleString()} GTT
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Profit:</span>
                          <span className="text-green-400 font-bold">
                            {(stakingAmount * 15.9).toLocaleString()} GTT
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8"
                      disabled={stakingAmount === 0}
                    >
                      <Lock className="h-5 w-5 mr-2" />
                      Stake {stakingAmount} GTT for 100 Years
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Portfolio */}
          <TabsContent value="portfolio" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {portfolioData.map((item) => (
                <Card key={item.name} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white mb-1">{item.value}</div>
                      <p className="text-slate-400 text-sm mb-2">{item.name}</p>
                      <p className={`text-xs font-medium ${item.color}`}>{item.change}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Active Stakes */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Active Stakes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stakingPools.slice(0, 2).map((pool) => (
                    <div key={pool.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 bg-gradient-to-br ${getPoolColor(pool.color)} rounded-lg flex items-center justify-center`}>
                          <Vault className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{pool.name}</h4>
                          <p className="text-slate-400 text-sm">{pool.duration} • {pool.apy} APY</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">
                          {Math.floor(Math.random() * 2000) + 500} GTT
                        </div>
                        <div className="text-green-400 text-sm">
                          +{Math.floor(Math.random() * 50) + 10} GTT (24h)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rewards */}
          <TabsContent value="rewards" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Next Reward Distribution */}
              <Card className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-3">
                    <Award className="h-6 w-6 text-yellow-400" />
                    <span>Next Reward Distribution</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-yellow-400 mb-2">
                      {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m
                    </div>
                    <p className="text-slate-300">Until next payout</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Expected Reward:</span>
                      <span className="text-yellow-400 font-bold">124 GTT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total This Month:</span>
                      <span className="text-white">3,420 GTT</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <p className="text-xs text-slate-400 text-center">75% to next milestone</p>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                        <div>
                          <div className="text-white text-sm font-medium">{activity.user}</div>
                          <div className="text-slate-400 text-xs">{activity.action}</div>
                          <div className="text-slate-500 text-xs">{activity.pool}</div>
                        </div>
                        <div className="text-slate-400 text-xs">{activity.time}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Total Value Locked</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400 mb-2">$42.8M</div>
                  <p className="text-slate-400 text-sm">+$2.1M (24h)</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Active Stakers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-400 mb-2">8,818</div>
                  <p className="text-slate-400 text-sm">+247 (24h)</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Avg. Stake Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-400 mb-2">47 Years</div>
                  <p className="text-slate-400 text-sm">Growing commitment</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}