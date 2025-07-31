import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Gem, 
  TrendingUp, 
  Target,
  Coins,
  Shield,
  Star,
  Crown,
  Zap,
  BarChart3,
  DollarSign,
  Users,
  Trophy
} from 'lucide-react';

export default function TruthVaultDashboard() {
  const tokenMetrics = {
    currentPrice: 0.15,
    marketCap: 2750000,
    totalSupply: 2500000,
    circulatingSupply: 1847203,
    holders: 8429,
    dayChange: 19.05,
    weekChange: 42.7,
    monthChange: 156.3
  };

  const stakingPools = [
    {
      name: "Truth Preservation Vault",
      apy: "16%",
      lockPeriod: "100 years",
      totalStaked: "$2.1M",
      participants: 1247,
      multiplier: "5x",
      badge: "MAXIMUM YIELD"
    },
    {
      name: "Whistleblower Protection Pool",
      apy: "12%",
      lockPeriod: "25 years", 
      totalStaked: "$850K",
      participants: 892,
      multiplier: "3x",
      badge: "HIGH SECURITY"
    },
    {
      name: "Memory Capsule Rewards",
      apy: "8%",
      lockPeriod: "10 years",
      totalStaked: "$1.4M", 
      participants: 2156,
      multiplier: "2x",
      badge: "FAMILY LEGACY"
    }
  ];

  const recentActivity = [
    { action: "Truth Verification", user: "0x742d...9A6C", reward: "5,000 TRUTH", time: "2 min ago" },
    { action: "Whistleblower Disclosure", user: "Anonymous", reward: "25,000 TRUTH", time: "15 min ago" },
    { action: "Memory Capsule Minted", user: "0x8c7C...F0a73", reward: "1,200 TRUTH", time: "23 min ago" },
    { action: "Institutional Verification", user: "CourtsAI_Legal", reward: "8,500 TRUTH", time: "1 hr ago" },
    { action: "Time-Lock Message", user: "0x959C...239db", reward: "2,100 TRUTH", time: "2 hrs ago" }
  ];

  const valuationDrivers = [
    {
      factor: "Truth Verification Network",
      impact: "35%",
      description: "Growing ecosystem of verified truth capsules",
      metric: "12,847 verified capsules"
    },
    {
      factor: "Institutional Adoption",
      impact: "28%",
      description: "Courts, schools, sports events using platform",
      metric: "$2.7T addressable market"
    },
    {
      factor: "Token Scarcity Mechanism",
      impact: "22%",
      description: "Deflationary burning with verification",
      metric: "2.3% quarterly burn rate"
    },
    {
      factor: "Whistleblower Incentives",
      impact: "15%",
      description: "High-value truth disclosure rewards",
      metric: "25K TRUTH max rewards"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-blue-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            💎 TRUTH VAULT TOKEN DASHBOARD
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            The Ultimate Truth Preservation & Valuation Engine
          </p>
          <Badge className="bg-purple-600/20 text-purple-400 text-lg px-6 py-3">
            TRUTH - POWERING REALITY PRESERVATION
          </Badge>
        </div>

        {/* Token Price & Market Data */}
        <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-center text-3xl flex items-center justify-center space-x-3">
              <Gem className="h-8 w-8 text-purple-400" />
              <span>TRUTH TOKEN LIVE METRICS</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-6 bg-slate-800/50 rounded-lg">
                <DollarSign className="h-10 w-10 text-green-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-green-400">${tokenMetrics.currentPrice}</div>
                <p className="text-slate-300">Current Price</p>
                <p className="text-green-400 text-sm">+{tokenMetrics.dayChange}% (24h)</p>
              </div>
              <div className="text-center p-6 bg-slate-800/50 rounded-lg">
                <BarChart3 className="h-10 w-10 text-blue-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-blue-400">${(tokenMetrics.marketCap / 1000000).toFixed(2)}M</div>
                <p className="text-slate-300">Market Cap</p>
                <p className="text-blue-400 text-sm">Target: $150M+</p>
              </div>
              <div className="text-center p-6 bg-slate-800/50 rounded-lg">
                <Coins className="h-10 w-10 text-yellow-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-yellow-400">{(tokenMetrics.circulatingSupply / 1000000).toFixed(1)}M</div>
                <p className="text-slate-300">Circulating Supply</p>
                <p className="text-yellow-400 text-sm">{((tokenMetrics.circulatingSupply / tokenMetrics.totalSupply) * 100).toFixed(1)}% of total</p>
              </div>
              <div className="text-center p-6 bg-slate-800/50 rounded-lg">
                <Users className="h-10 w-10 text-purple-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-purple-400">{tokenMetrics.holders.toLocaleString()}</div>
                <p className="text-slate-300">Token Holders</p>
                <p className="text-purple-400 text-sm">Growing community</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-600/20 rounded-lg border border-green-500/30">
                <div className="text-2xl font-bold text-green-400">+{tokenMetrics.dayChange}%</div>
                <p className="text-slate-300">24 Hour Change</p>
              </div>
              <div className="text-center p-4 bg-blue-600/20 rounded-lg border border-blue-500/30">
                <div className="text-2xl font-bold text-blue-400">+{tokenMetrics.weekChange}%</div>
                <p className="text-slate-300">7 Day Change</p>
              </div>
              <div className="text-center p-4 bg-purple-600/20 rounded-lg border border-purple-500/30">
                <div className="text-2xl font-bold text-purple-400">+{tokenMetrics.monthChange}%</div>
                <p className="text-slate-300">30 Day Change</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Staking Pools */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            🏦 TRUTH STAKING VAULTS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stakingPools.map((pool, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-600 hover:border-purple-500/50 transition-all">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span>{pool.name}</span>
                    <Badge className={`
                      ${pool.badge === 'MAXIMUM YIELD' ? 'bg-yellow-600/20 text-yellow-400' : ''}
                      ${pool.badge === 'HIGH SECURITY' ? 'bg-red-600/20 text-red-400' : ''}
                      ${pool.badge === 'FAMILY LEGACY' ? 'bg-green-600/20 text-green-400' : ''}
                    `}>
                      {pool.badge}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-400 mb-2">{pool.apy}</div>
                      <p className="text-slate-300">Annual Percentage Yield</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Lock Period:</span>
                        <span className="text-white font-semibold">{pool.lockPeriod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Total Staked:</span>
                        <span className="text-green-400 font-semibold">{pool.totalStaked}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Participants:</span>
                        <span className="text-blue-400 font-semibold">{pool.participants}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Reward Multiplier:</span>
                        <span className="text-purple-400 font-semibold">{pool.multiplier}</span>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      <Crown className="h-4 w-4 mr-2" />
                      Stake TRUTH
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Valuation Drivers */}
        <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-center text-2xl">
              📈 TOKEN VALUATION DRIVERS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {valuationDrivers.map((driver, index) => (
                <div key={index} className="p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-bold">{driver.factor}</h3>
                    <Badge className="bg-green-600/20 text-green-400">
                      {driver.impact} Impact
                    </Badge>
                  </div>
                  <p className="text-slate-300 mb-3">{driver.description}</p>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <span className="text-green-400 text-sm font-semibold">{driver.metric}</span>
                  </div>
                  <Progress value={parseInt(driver.impact)} className="mt-3" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Feed */}
        <Card className="bg-slate-800/50 border-slate-700 mb-12">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-3">
              <Zap className="h-6 w-6 text-yellow-400" />
              <span>Live Truth Verification Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <div>
                      <p className="text-white font-semibold">{activity.action}</p>
                      <p className="text-slate-400 text-sm">{activity.user}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold">{activity.reward}</p>
                    <p className="text-slate-400 text-sm">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="text-center space-y-6">
          <div className="flex justify-center space-x-4">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8"
              onClick={() => window.location.href = '/whistleblower-sanctuary'}
            >
              <Shield className="h-5 w-5 mr-2" />
              Earn TRUTH Tokens
            </Button>
            
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
              onClick={() => window.location.href = '/specialized-intake'}
            >
              <Star className="h-5 w-5 mr-2" />
              High-Value Disclosure
            </Button>
            
            <Button 
              size="lg"
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8"
              onClick={() => window.location.href = '/memory-vault'}
            >
              <Trophy className="h-5 w-5 mr-2" />
              Memory Vault System
            </Button>
          </div>
          
          <p className="text-slate-300 text-lg">
            Join the Truth Preservation Revolution - Where Reality Has Value
          </p>
        </div>
      </div>
    </div>
  );
}