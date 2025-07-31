import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  TrendingUp, 
  Shield, 
  Zap, 
  Users, 
  BarChart3,
  DollarSign,
  Clock,
  Target,
  Globe,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface InstitutionalMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

interface InstitutionalClient {
  name: string;
  type: 'hedge_fund' | 'family_office' | 'asset_manager' | 'bank';
  aum: number;
  gttAllocation: number;
  joinDate: Date;
  performance: number;
  status: 'active' | 'onboarding' | 'pending';
}

export function InstitutionalDashboard() {
  const [activeView, setActiveView] = useState('overview');

  const institutionalMetrics: InstitutionalMetric[] = [
    {
      label: 'Total AUM',
      value: '$2.8B',
      change: '+15.7%',
      trend: 'up'
    },
    {
      label: 'GTT Allocation',
      value: '$156M',
      change: '+28.3%',
      trend: 'up'
    },
    {
      label: 'Active Institutions',
      value: '47',
      change: '+12',
      trend: 'up'
    },
    {
      label: 'Avg Ticket Size',
      value: '$3.2M',
      change: '+8.9%',
      trend: 'up'
    }
  ];

  const institutionalClients: InstitutionalClient[] = [
    {
      name: 'Paradigm Capital',
      type: 'hedge_fund',
      aum: 8500000000,
      gttAllocation: 45000000,
      joinDate: new Date('2024-08-15'),
      performance: 127.8,
      status: 'active'
    },
    {
      name: 'Andreessen Horowitz',
      type: 'asset_manager',
      aum: 35000000000,
      gttAllocation: 28000000,
      joinDate: new Date('2024-09-22'),
      performance: 89.3,
      status: 'active'
    },
    {
      name: 'Binance Labs',
      type: 'asset_manager',
      aum: 12000000000,
      gttAllocation: 35000000,
      joinDate: new Date('2024-10-08'),
      performance: 156.7,
      status: 'active'
    },
    {
      name: 'Coinbase Ventures',
      type: 'asset_manager',
      aum: 6500000000,
      gttAllocation: 18000000,
      joinDate: new Date('2024-11-14'),
      performance: 67.2,
      status: 'onboarding'
    },
    {
      name: 'Three Arrows Capital',
      type: 'hedge_fund',
      aum: 15000000000,
      gttAllocation: 22000000,
      joinDate: new Date('2024-12-03'),
      performance: 98.4,
      status: 'pending'
    }
  ];

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(1)}B`;
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toFixed(2)}`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hedge_fund': return '🏛️';
      case 'family_office': return '👑';
      case 'asset_manager': return '📊';
      case 'bank': return '🏦';
      default: return '🏢';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'onboarding': return 'text-yellow-400';
      case 'pending': return 'text-blue-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'onboarding': return 'bg-yellow-500';
      case 'pending': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Building2 className="h-5 w-5 text-blue-400" />
            Institutional Dashboard
            <Badge variant="outline" className="text-purple-400 border-purple-400">
              ENTERPRISE
            </Badge>
          </CardTitle>
          <p className="text-slate-400">
            Real-time institutional client management and performance tracking
          </p>
        </CardHeader>
        <CardContent>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {institutionalMetrics.map((metric, index) => (
              <div key={index} className="p-4 bg-slate-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">{metric.label}</span>
                  <div className={`flex items-center gap-1 ${
                    metric.trend === 'up' ? 'text-green-400' : 
                    metric.trend === 'down' ? 'text-red-400' : 'text-slate-400'
                  }`}>
                    {metric.trend === 'up' && <TrendingUp className="h-3 w-3" />}
                    <span className="text-xs">{metric.change}</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-white">{metric.value}</div>
              </div>
            ))}
          </div>

          <Tabs defaultValue="clients" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800">
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="allocations">Allocations</TabsTrigger>
              <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            </TabsList>

            <TabsContent value="clients" className="mt-4">
              <div className="space-y-4">
                {institutionalClients.map((client, index) => (
                  <div key={index} className="p-4 bg-slate-800 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getTypeIcon(client.type)}</span>
                        <div>
                          <div className="text-white font-medium text-lg">{client.name}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-400 capitalize">
                              {client.type.replace('_', ' ')}
                            </span>
                            <div className={`w-2 h-2 rounded-full ${getStatusBadge(client.status)}`} />
                            <span className={`text-xs ${getStatusColor(client.status)} capitalize`}>
                              {client.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">
                          +{client.performance.toFixed(1)}%
                        </div>
                        <div className="text-sm text-slate-400">Performance</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-white font-medium">{formatCurrency(client.aum)}</div>
                        <div className="text-xs text-slate-400">Total AUM</div>
                      </div>
                      <div>
                        <div className="text-purple-400 font-medium">
                          {formatCurrency(client.gttAllocation)}
                        </div>
                        <div className="text-xs text-slate-400">GTT Allocation</div>
                      </div>
                      <div>
                        <div className="text-blue-400 font-medium">
                          {Math.floor((Date.now() - client.joinDate.getTime()) / (1000 * 60 * 60 * 24))}d
                        </div>
                        <div className="text-xs text-slate-400">Client Since</div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-blue-400" />
                          <span className="text-sm text-slate-400">
                            Allocation: {((client.gttAllocation / client.aum) * 100).toFixed(2)}% of AUM
                          </span>
                        </div>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="performance" className="mt-4">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-800 rounded-lg text-center">
                    <Target className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <div className="text-white font-medium">+127.8%</div>
                    <div className="text-sm text-slate-400">Best Performer</div>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg text-center">
                    <BarChart3 className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-white font-medium">+95.7%</div>
                    <div className="text-sm text-slate-400">Average Return</div>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg text-center">
                    <Shield className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-white font-medium">12.3%</div>
                    <div className="text-sm text-slate-400">Volatility</div>
                  </div>
                </div>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Performance by Client Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-300">🏛️ Hedge Funds</span>
                          <Badge variant="outline" className="text-xs">7 clients</Badge>
                        </div>
                        <span className="text-green-400 font-medium">+113.1%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-300">📊 Asset Managers</span>
                          <Badge variant="outline" className="text-xs">23 clients</Badge>
                        </div>
                        <span className="text-green-400 font-medium">+91.7%</span>
                      </div>
                      <Progress value={68} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-300">👑 Family Offices</span>
                          <Badge variant="outline" className="text-xs">12 clients</Badge>
                        </div>
                        <span className="text-green-400 font-medium">+87.3%</span>
                      </div>
                      <Progress value={62} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-300">🏦 Banks</span>
                          <Badge variant="outline" className="text-xs">5 clients</Badge>
                        </div>
                        <span className="text-green-400 font-medium">+79.5%</span>
                      </div>
                      <Progress value={55} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="allocations" className="mt-4">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Allocation Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">Direct GTT Holdings</span>
                          <span className="text-white">62.8%</span>
                        </div>
                        <Progress value={62.8} className="h-2" />
                        
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">GTT-LP Tokens</span>
                          <span className="text-white">24.1%</span>
                        </div>
                        <Progress value={24.1} className="h-2" />
                        
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">Staked GTT</span>
                          <span className="text-white">13.1%</span>
                        </div>
                        <Progress value={13.1} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Risk Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">Sharpe Ratio</span>
                          <span className="text-green-400 font-medium">2.34</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">Max Drawdown</span>
                          <span className="text-yellow-400 font-medium">-8.7%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">Beta</span>
                          <span className="text-blue-400 font-medium">0.73</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">Alpha</span>
                          <span className="text-green-400 font-medium">+47.2%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-800 rounded-lg text-center">
                    <DollarSign className="h-6 w-6 text-green-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-white">$156M</div>
                    <div className="text-sm text-slate-400">Total GTT Value</div>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg text-center">
                    <Users className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-white">47</div>
                    <div className="text-sm text-slate-400">Active Clients</div>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg text-center">
                    <Clock className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-white">8.3M</div>
                    <div className="text-sm text-slate-400">Avg Hold Period (days)</div>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg text-center">
                    <Zap className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-white">$3.2M</div>
                    <div className="text-sm text-slate-400">Avg Ticket Size</div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pipeline" className="mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-slate-800 rounded-lg text-center">
                    <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <div className="text-white font-medium">$890M</div>
                    <div className="text-sm text-slate-400">Pipeline Value</div>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg text-center">
                    <Clock className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                    <div className="text-white font-medium">23</div>
                    <div className="text-sm text-slate-400">Active Prospects</div>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg text-center">
                    <Target className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-white font-medium">67%</div>
                    <div className="text-sm text-slate-400">Close Rate</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        </div>
                        <div>
                          <div className="text-white font-medium">Pantera Capital</div>
                          <div className="text-sm text-slate-400">Hedge Fund • $150M potential</div>
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400">
                        Due Diligence
                      </Badge>
                    </div>
                    <Progress value={85} className="h-2" />
                    <div className="text-xs text-slate-400 mt-1">Expected close: Q1 2025</div>
                  </div>

                  <div className="p-4 bg-slate-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                          <Clock className="h-4 w-4 text-yellow-400" />
                        </div>
                        <div>
                          <div className="text-white font-medium">Galaxy Digital</div>
                          <div className="text-sm text-slate-400">Asset Manager • $85M potential</div>
                        </div>
                      </div>
                      <Badge className="bg-yellow-500/20 text-yellow-400">
                        Negotiation
                      </Badge>
                    </div>
                    <Progress value={65} className="h-2" />
                    <div className="text-xs text-slate-400 mt-1">Expected close: Q2 2025</div>
                  </div>

                  <div className="p-4 bg-slate-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <AlertTriangle className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                          <div className="text-white font-medium">Multicoin Capital</div>
                          <div className="text-sm text-slate-400">Hedge Fund • $120M potential</div>
                        </div>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-400">
                        Initial Contact
                      </Badge>
                    </div>
                    <Progress value={25} className="h-2" />
                    <div className="text-xs text-slate-400 mt-1">Expected close: Q3 2025</div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-5 w-5 text-purple-400" />
                    <span className="text-purple-400 font-medium">Institutional Onboarding</span>
                  </div>
                  <p className="text-sm text-slate-300 mb-3">
                    Fast-track institutional onboarding with dedicated relationship managers, 
                    custom allocation strategies, and white-glove service.
                  </p>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Schedule Demo
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}