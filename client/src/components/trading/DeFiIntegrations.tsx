import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Coins, 
  TrendingUp, 
  Shield, 
  Zap, 
  Target, 
  BarChart3,
  ArrowUpDown,
  Lock,
  Gift,
  Flame
} from 'lucide-react';

interface LiquidityPool {
  pair: string;
  tvl: number;
  apr: number;
  volume24h: number;
  protocol: string;
  rewards: string[];
}

interface YieldFarm {
  protocol: string;
  token: string;
  apr: number;
  tvl: number;
  risk: 'low' | 'medium' | 'high';
  lockPeriod: string;
}

export function DeFiIntegrations() {
  const [activeProtocol, setActiveProtocol] = useState('uniswap');

  const liquidityPools: LiquidityPool[] = [
    {
      pair: 'GTT/USDC',
      tvl: 15750000,
      apr: 125.7,
      volume24h: 2850000,
      protocol: 'Uniswap V3',
      rewards: ['GTT', 'UNI']
    },
    {
      pair: 'GTT/ETH',
      tvl: 8920000,
      apr: 89.3,
      volume24h: 1650000,
      protocol: 'Curve',
      rewards: ['GTT', 'CRV']
    },
    {
      pair: 'GTT/MATIC',
      tvl: 5640000,
      apr: 156.8,
      volume24h: 980000,
      protocol: 'QuickSwap',
      rewards: ['GTT', 'QUICK', 'dQUICK']
    },
    {
      pair: 'GTT/USDT',
      tvl: 12340000,
      apr: 98.4,
      volume24h: 2100000,
      protocol: 'SushiSwap',
      rewards: ['GTT', 'SUSHI']
    }
  ];

  const yieldFarms: YieldFarm[] = [
    {
      protocol: 'Aave',
      token: 'GTT',
      apr: 24.8,
      tvl: 45000000,
      risk: 'low',
      lockPeriod: 'None'
    },
    {
      protocol: 'Compound',
      token: 'GTT',
      apr: 31.2,
      tvl: 28000000,
      risk: 'low',
      lockPeriod: 'None'
    },
    {
      protocol: 'Yearn',
      token: 'GTT-USDC LP',
      apr: 89.7,
      tvl: 18500000,
      risk: 'medium',
      lockPeriod: '7 days'
    },
    {
      protocol: 'Convex',
      token: 'GTT-CRV',
      apr: 156.3,
      tvl: 12800000,
      risk: 'high',
      lockPeriod: '30 days'
    }
  ];

  const protocolIntegrations = [
    {
      name: 'Uniswap V3',
      logo: '🦄',
      status: 'active',
      features: ['Concentrated Liquidity', 'Fee Tiers', 'Range Orders'],
      tvl: '$24.5M',
      volume: '$4.8M/24h'
    },
    {
      name: 'Curve Finance',
      logo: '🌊',
      status: 'active',
      features: ['Stable Swaps', 'Low Slippage', 'Voting Escrow'],
      tvl: '$12.7M',
      volume: '$2.1M/24h'
    },
    {
      name: 'Aave',
      logo: '👻',
      status: 'active',
      features: ['Lending', 'Borrowing', 'Flash Loans'],
      tvl: '$45.0M',
      volume: '$1.8M/24h'
    },
    {
      name: 'Compound',
      logo: '🏛️',
      status: 'active',
      features: ['Money Markets', 'Governance', 'COMP Rewards'],
      tvl: '$28.0M',
      volume: '$1.2M/24h'
    },
    {
      name: '1inch',
      logo: '🔄',
      status: 'integration',
      features: ['DEX Aggregation', 'Best Rates', 'Gas Optimization'],
      tvl: 'Pending',
      volume: 'Pending'
    },
    {
      name: 'Balancer',
      logo: '⚖️',
      status: 'planned',
      features: ['Multi-Token Pools', 'Smart Pools', 'LBP'],
      tvl: 'Coming Soon',
      volume: 'Coming Soon'
    }
  ];

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toFixed(2)}`;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'integration': return 'bg-yellow-500';
      case 'planned': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Coins className="h-5 w-5 text-green-400" />
            DeFi Protocol Integrations
            <Badge variant="outline" className="text-purple-400 border-purple-400">
              INSTITUTIONAL
            </Badge>
          </CardTitle>
          <p className="text-slate-400">
            Deep liquidity pools, yield farming, and DeFi strategies for institutional capital deployment
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="liquidity" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800">
              <TabsTrigger value="liquidity">Liquidity Pools</TabsTrigger>
              <TabsTrigger value="farming">Yield Farming</TabsTrigger>
              <TabsTrigger value="protocols">Protocols</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="liquidity" className="mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-slate-400">Total Liquidity</span>
                    </div>
                    <div className="text-2xl font-bold text-white">$42.65M</div>
                    <div className="text-sm text-green-400">+15.8% this week</div>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-slate-400">24h Volume</span>
                    </div>
                    <div className="text-2xl font-bold text-white">$7.58M</div>
                    <div className="text-sm text-blue-400">+24.3% from yesterday</div>
                  </div>
                </div>

                {liquidityPools.map((pool, index) => (
                  <div key={index} className="p-4 bg-slate-800 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium text-lg">{pool.pair}</span>
                          <Badge variant="outline" className="text-xs">
                            {pool.protocol}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span>TVL: {formatCurrency(pool.tvl)}</span>
                          <span>Volume: {formatCurrency(pool.volume24h)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">
                          {pool.apr.toFixed(1)}%
                        </div>
                        <div className="text-sm text-slate-400">APR</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Gift className="h-4 w-4 text-purple-400" />
                        <span className="text-sm text-slate-400">Rewards:</span>
                        <div className="flex gap-1">
                          {pool.rewards.map((reward, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {reward}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button size="sm">
                        Add Liquidity
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="farming" className="mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-slate-800 rounded-lg text-center">
                    <Flame className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                    <div className="text-white font-medium">156.3%</div>
                    <div className="text-sm text-slate-400">Highest APR</div>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg text-center">
                    <Shield className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <div className="text-white font-medium">$113.8M</div>
                    <div className="text-sm text-slate-400">Total Staked</div>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg text-center">
                    <Target className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-white font-medium">$2.8M</div>
                    <div className="text-sm text-slate-400">Daily Rewards</div>
                  </div>
                </div>

                {yieldFarms.map((farm, index) => (
                  <div key={index} className="p-4 bg-slate-800 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium">{farm.protocol}</span>
                          <Badge variant="outline" className="text-xs">
                            {farm.token}
                          </Badge>
                          <div className={`w-2 h-2 rounded-full ${getRiskColor(farm.risk).replace('text-', 'bg-')}`} />
                          <span className={`text-xs ${getRiskColor(farm.risk)}`}>
                            {farm.risk.toUpperCase()} RISK
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span>TVL: {formatCurrency(farm.tvl)}</span>
                          <span>Lock: {farm.lockPeriod}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">
                          {farm.apr.toFixed(1)}%
                        </div>
                        <div className="text-sm text-slate-400">APR</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm text-slate-400">
                          {farm.lockPeriod === 'None' ? 'Flexible withdrawal' : `Locked for ${farm.lockPeriod}`}
                        </span>
                      </div>
                      <Button size="sm">
                        Stake GTT
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="protocols" className="mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {protocolIntegrations.map((protocol, index) => (
                    <div key={index} className="p-4 bg-slate-800 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{protocol.logo}</span>
                          <div>
                            <div className="text-white font-medium">{protocol.name}</div>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(protocol.status)}`} />
                              <span className="text-xs text-slate-400 capitalize">
                                {protocol.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <div className="text-white">{protocol.tvl}</div>
                          <div className="text-slate-400">{protocol.volume}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm text-slate-400">Features:</div>
                        <div className="flex flex-wrap gap-1">
                          {protocol.features.map((feature, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-700">
                        <Button size="sm" className="w-full" disabled={protocol.status !== 'active'}>
                          {protocol.status === 'active' ? 'Use Protocol' : 'Coming Soon'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-4">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-800 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">$154.3M</div>
                    <div className="text-sm text-slate-400">Total Value Locked</div>
                    <div className="text-xs text-green-400 mt-1">+28.7% this month</div>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1">$18.9M</div>
                    <div className="text-sm text-slate-400">Daily Volume</div>
                    <div className="text-xs text-blue-400 mt-1">+15.3% vs yesterday</div>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-400 mb-1">89.7%</div>
                    <div className="text-sm text-slate-400">Avg APR</div>
                    <div className="text-xs text-purple-400 mt-1">Across all pools</div>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-400 mb-1">24,891</div>
                    <div className="text-sm text-slate-400">Active LPs</div>
                    <div className="text-xs text-yellow-400 mt-1">+12.4% growth</div>
                  </div>
                </div>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Protocol Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Uniswap V3</span>
                        <span className="text-white">35.8%</span>
                      </div>
                      <Progress value={35.8} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Aave</span>
                        <span className="text-white">29.2%</span>
                      </div>
                      <Progress value={29.2} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Compound</span>
                        <span className="text-white">18.1%</span>
                      </div>
                      <Progress value={18.1} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Curve</span>
                        <span className="text-white">12.4%</span>
                      </div>
                      <Progress value={12.4} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Others</span>
                        <span className="text-white">4.5%</span>
                      </div>
                      <Progress value={4.5} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUpDown className="h-5 w-5 text-green-400" />
              <span className="text-green-400 font-medium">Institutional DeFi Program</span>
            </div>
            <p className="text-sm text-slate-300 mb-3">
              Join our institutional DeFi program for priority pool access, reduced fees, 
              and dedicated liquidity management support for holdings &gt; $1M.
            </p>
            <Button className="bg-green-600 hover:bg-green-700">
              Apply for Institutional Access
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}