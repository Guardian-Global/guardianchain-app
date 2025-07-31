import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Bot, 
  TrendingUp, 
  DollarSign, 
  Zap, 
  Target, 
  BarChart3,
  Settings,
  Play,
  Pause,
  AlertCircle,
  CheckCircle,
  Activity
} from 'lucide-react';

interface MarketMakingStrategy {
  name: string;
  description: string;
  minSpread: number;
  maxSpread: number;
  orderSize: number;
  profitability: number;
  riskLevel: 'low' | 'medium' | 'high';
  isActive: boolean;
}

interface MarketMakerMetrics {
  totalVolume: number;
  dailyProfit: number;
  spreadCapture: number;
  uptime: number;
  successRate: number;
  riskScore: number;
}

export function MarketMakerHub() {
  const [strategies, setStrategies] = useState<MarketMakingStrategy[]>([
    {
      name: 'Conservative Grid',
      description: 'Low-risk market making with tight spreads',
      minSpread: 0.1,
      maxSpread: 0.3,
      orderSize: 10000,
      profitability: 23.7,
      riskLevel: 'low',
      isActive: true
    },
    {
      name: 'Aggressive Scalping',
      description: 'High-frequency trading with dynamic spreads',
      minSpread: 0.05,
      maxSpread: 0.8,
      orderSize: 50000,
      profitability: 67.3,
      riskLevel: 'high',
      isActive: true
    },
    {
      name: 'Balanced Arbitrage',
      description: 'Cross-exchange arbitrage opportunities',
      minSpread: 0.15,
      maxSpread: 0.5,
      orderSize: 25000,
      profitability: 45.2,
      riskLevel: 'medium',
      isActive: false
    }
  ]);

  const [metrics] = useState<MarketMakerMetrics>({
    totalVolume: 24580000,
    dailyProfit: 18750,
    spreadCapture: 0.23,
    uptime: 99.7,
    successRate: 87.3,
    riskScore: 2.8
  });

  const [autoRebalance, setAutoRebalance] = useState(true);
  const [riskLimit, setRiskLimit] = useState(100000);
  const [maxPosition, setMaxPosition] = useState(1000000);

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

  const toggleStrategy = (index: number) => {
    setStrategies(prev => prev.map((strategy, i) => 
      i === index ? { ...strategy, isActive: !strategy.isActive } : strategy
    ));
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Bot className="h-5 w-5 text-blue-400" />
            Market Maker Hub
            <Badge variant="outline" className="text-green-400 border-green-400">
              PROFESSIONAL
            </Badge>
          </CardTitle>
          <p className="text-slate-400">
            Automated market making strategies for consistent GTT liquidity provision
          </p>
        </CardHeader>
        <CardContent>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-slate-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-slate-400">24h Volume</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {formatCurrency(metrics.totalVolume)}
              </div>
              <div className="text-sm text-blue-400">+18.3% vs yesterday</div>
            </div>
            <div className="p-4 bg-slate-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-green-400" />
                <span className="text-sm text-slate-400">Daily P&L</span>
              </div>
              <div className="text-2xl font-bold text-green-400">
                +{formatCurrency(metrics.dailyProfit)}
              </div>
              <div className="text-sm text-green-400">+{metrics.profitability}% ROI</div>
            </div>
            <div className="p-4 bg-slate-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-slate-400">Spread Capture</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {(metrics.spreadCapture * 100).toFixed(2)}%
              </div>
              <div className="text-sm text-purple-400">Avg per trade</div>
            </div>
          </div>

          <Tabs defaultValue="strategies" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800">
              <TabsTrigger value="strategies">Strategies</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="strategies" className="mt-4">
              <div className="space-y-4">
                {strategies.map((strategy, index) => (
                  <div key={index} className="p-4 bg-slate-800 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded ${strategy.isActive ? 'bg-green-500/20' : 'bg-slate-700'}`}>
                          {strategy.isActive ? (
                            <Play className="h-4 w-4 text-green-400" />
                          ) : (
                            <Pause className="h-4 w-4 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="text-white font-medium text-lg">{strategy.name}</div>
                          <div className="text-sm text-slate-400">{strategy.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-green-400 font-medium">
                            +{strategy.profitability.toFixed(1)}%
                          </div>
                          <div className="text-sm text-slate-400">24h Return</div>
                        </div>
                        <Switch
                          checked={strategy.isActive}
                          onCheckedChange={() => toggleStrategy(index)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-white font-medium">
                          {strategy.minSpread}% - {strategy.maxSpread}%
                        </div>
                        <div className="text-xs text-slate-400">Spread Range</div>
                      </div>
                      <div>
                        <div className="text-purple-400 font-medium">
                          {formatCurrency(strategy.orderSize)}
                        </div>
                        <div className="text-xs text-slate-400">Order Size</div>
                      </div>
                      <div>
                        <div className={`font-medium ${getRiskColor(strategy.riskLevel)}`}>
                          {strategy.riskLevel.toUpperCase()}
                        </div>
                        <div className="text-xs text-slate-400">Risk Level</div>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1">
                          {strategy.isActive ? (
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-yellow-400" />
                          )}
                          <span className="text-sm text-white">
                            {strategy.isActive ? 'Active' : 'Paused'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400">Status</div>
                      </div>
                    </div>
                  </div>
                ))}

                <Button className="w-full mt-4" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Create Custom Strategy
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="mt-4">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">Success Rate</span>
                          <span className="text-green-400 font-medium">
                            {metrics.successRate.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">Uptime</span>
                          <span className="text-blue-400 font-medium">
                            {metrics.uptime.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">Risk Score</span>
                          <span className="text-yellow-400 font-medium">
                            {metrics.riskScore.toFixed(1)}/10
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">Sharpe Ratio</span>
                          <span className="text-purple-400 font-medium">2.34</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Strategy Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">Conservative Grid</span>
                          <span className="text-green-400 font-medium">+23.7%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">Aggressive Scalping</span>
                          <span className="text-green-400 font-medium">+67.3%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">Balanced Arbitrage</span>
                          <span className="text-slate-400 font-medium">Paused</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-800 rounded-lg text-center">
                    <Activity className="h-6 w-6 text-green-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-white">2,847</div>
                    <div className="text-sm text-slate-400">Trades Today</div>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg text-center">
                    <TrendingUp className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-white">0.23%</div>
                    <div className="text-sm text-slate-400">Avg Spread</div>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg text-center">
                    <Zap className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-white">147ms</div>
                    <div className="text-sm text-slate-400">Avg Latency</div>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg text-center">
                    <Target className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-white">94.3%</div>
                    <div className="text-sm text-slate-400">Fill Rate</div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-4">
              <div className="space-y-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Risk Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">Auto Rebalancing</div>
                          <div className="text-sm text-slate-400">
                            Automatically rebalance positions when risk exceeds limits
                          </div>
                        </div>
                        <Switch
                          checked={autoRebalance}
                          onCheckedChange={setAutoRebalance}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-white font-medium">Daily Risk Limit</label>
                        <Input
                          type="number"
                          value={riskLimit}
                          onChange={(e) => setRiskLimit(Number(e.target.value))}
                          className="bg-slate-700 border-slate-600"
                          placeholder="100000"
                        />
                        <div className="text-sm text-slate-400">
                          Maximum daily loss before auto-pause
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-white font-medium">Max Position Size</label>
                        <Input
                          type="number"
                          value={maxPosition}
                          onChange={(e) => setMaxPosition(Number(e.target.value))}
                          className="bg-slate-700 border-slate-600"
                          placeholder="1000000"
                        />
                        <div className="text-sm text-slate-400">
                          Maximum GTT position across all strategies
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Exchange Connections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full" />
                          <span className="text-white">Binance</span>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400">Connected</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full" />
                          <span className="text-white">Coinbase Pro</span>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400">Connected</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                          <span className="text-white">OKX</span>
                        </div>
                        <Badge className="bg-yellow-500/20 text-yellow-400">Connecting</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-4">
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">Advanced Analytics</h3>
                <p className="text-slate-400 mb-4">
                  Detailed performance charts and market analysis coming soon
                </p>
                <Button variant="outline">
                  Request Beta Access
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="h-5 w-5 text-blue-400" />
              <span className="text-blue-400 font-medium">Professional Market Making</span>
            </div>
            <p className="text-sm text-slate-300 mb-3">
              Institutional-grade market making infrastructure with sub-millisecond execution, 
              cross-exchange arbitrage, and professional risk management tools.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Upgrade to Professional
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}