import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Rocket, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Shield, 
  Star,
  Clock,
  Target,
  Zap,
  Crown,
  Building2,
  Globe,
  Activity,
  ArrowUpRight,
  CheckCircle,
  AlertTriangle,
  PieChart,
  BarChart3,
  Coins
} from 'lucide-react';

interface LaunchProject {
  id: string;
  name: string;
  symbol: string;
  category: string;
  totalRaise: number;
  currentRaise: number;
  participants: number;
  launchDate: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  status: 'upcoming' | 'live' | 'completed' | 'sold_out';
  roi: number;
  ath_multiplier: number;
}

interface LaunchMetrics {
  totalProjectsLaunched: number;
  totalRaised: number;
  averageROI: number;
  successRate: number;
  monthlyRevenue: number;
  activeProjects: number;
}

export function TokenLaunchpadPro() {
  const [activeTab, setActiveTab] = useState<'live' | 'completed' | 'upcoming' | 'analytics'>('live');

  const [projects] = useState<LaunchProject[]>([
    {
      id: '1',
      name: 'Guardian AI Protocol',
      symbol: 'GAI',
      category: 'AI Infrastructure',
      totalRaise: 50000000,
      currentRaise: 47500000,
      participants: 12847,
      launchDate: '2025-02-15',
      tier: 'platinum',
      status: 'live',
      roi: 0, // TBD
      ath_multiplier: 0
    },
    {
      id: '2',
      name: 'DeFi Yield Vault',
      symbol: 'DYV',
      category: 'DeFi',
      totalRaise: 25000000,
      currentRaise: 25000000,
      participants: 8934,
      launchDate: '2025-01-20',
      tier: 'gold',
      status: 'sold_out',
      roi: 847.3,
      ath_multiplier: 23.7
    },
    {
      id: '3',
      name: 'MetaVerse Gaming DAO',
      symbol: 'MVG',
      category: 'Gaming',
      totalRaise: 15000000,
      currentRaise: 15000000,
      participants: 5672,
      launchDate: '2025-01-05',
      tier: 'gold',
      status: 'completed',
      roi: 1247.8,
      ath_multiplier: 34.2
    },
    {
      id: '4',
      name: 'Quantum Computing Chain',
      symbol: 'QCC',
      category: 'Infrastructure',
      totalRaise: 75000000,
      currentRaise: 0,
      participants: 0,
      launchDate: '2025-03-01',
      tier: 'platinum',
      status: 'upcoming',
      roi: 0,
      ath_multiplier: 0
    }
  ]);

  const [metrics] = useState<LaunchMetrics>({
    totalProjectsLaunched: 147,
    totalRaised: 2850000000, // $2.85B
    averageROI: 487.3,
    successRate: 94.7,
    monthlyRevenue: 47500000, // $47.5M
    activeProjects: 23
  });

  const [pricingTiers] = useState([
    {
      name: 'Bronze Tier',
      price: '$5,000',
      allocation: '$50K max',
      features: ['Basic KYC', 'Standard allocation', 'Email support'],
      projects: 89,
      revenue: 445000
    },
    {
      name: 'Silver Tier',
      price: '$25,000',
      allocation: '$250K max',
      features: ['Priority access', 'Higher allocation', 'Telegram support', 'Research reports'],
      projects: 156,
      revenue: 3900000
    },
    {
      name: 'Gold Tier',
      price: '$100,000',
      allocation: '$1M max',
      features: ['Guaranteed allocation', 'Pre-sale access', 'Private calls', 'Custom research'],
      projects: 234,
      revenue: 23400000
    },
    {
      name: 'Platinum Tier',
      price: '$500,000',
      allocation: '$10M max',
      features: ['Institutional access', 'Deal co-creation', 'Token advisory', 'Private placement'],
      projects: 67,
      revenue: 33500000
    }
  ]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-600/20 text-green-400';
      case 'sold_out': return 'bg-yellow-600/20 text-yellow-400';
      case 'completed': return 'bg-blue-600/20 text-blue-400';
      case 'upcoming': return 'bg-purple-600/20 text-purple-400';
      default: return 'bg-gray-600/20 text-gray-400';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'bg-purple-600/20 text-purple-400 border-purple-500/30';
      case 'gold': return 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30';
      case 'silver': return 'bg-gray-600/20 text-gray-400 border-gray-500/30';
      case 'bronze': return 'bg-orange-600/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-600/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Token Launchpad Pro</h2>
          <p className="text-slate-400">
            {formatCurrency(metrics.totalRaised)} raised across {metrics.totalProjectsLaunched} successful launches
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
            {metrics.averageROI}% Avg ROI
          </Badge>
          <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30">
            {formatCurrency(metrics.monthlyRevenue)}/month
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Raised</p>
                <p className="text-xl font-bold text-white">{formatCurrency(metrics.totalRaised)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Rocket className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Projects Launched</p>
                <p className="text-xl font-bold text-white">{formatNumber(metrics.totalProjectsLaunched)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Success Rate</p>
                <p className="text-xl font-bold text-white">{metrics.successRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-600/20 rounded-lg">
                <Crown className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Monthly Revenue</p>
                <p className="text-xl font-bold text-white">{formatCurrency(metrics.monthlyRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-slate-800 p-1 rounded-lg">
        <Button
          size="sm"
          variant={activeTab === 'live' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('live')}
          className="flex-1"
        >
          Live Launches
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'completed' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('completed')}
          className="flex-1"
        >
          Completed
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'upcoming' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('upcoming')}
          className="flex-1"
        >
          Upcoming
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'analytics' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('analytics')}
          className="flex-1"
        >
          Revenue Analytics
        </Button>
      </div>

      {/* Content Sections */}
      {activeTab === 'live' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Live Token Launches</h3>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Rocket className="h-4 w-4 mr-2" />
              Submit Project
            </Button>
          </div>

          <div className="grid gap-6">
            {projects.filter(p => p.status === 'live' || p.status === 'sold_out').map((project) => (
              <Card key={project.id} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-purple-600/20 rounded-lg">
                          <Coins className="h-6 w-6 text-purple-400" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white">{project.name}</h4>
                          <p className="text-sm text-slate-400">{project.symbol} • {project.category}</p>
                        </div>
                        <Badge className={getTierColor(project.tier)}>
                          {project.tier.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-400">
                            {formatCurrency(project.currentRaise)} raised
                          </span>
                          <span className="text-white">
                            {((project.currentRaise / project.totalRaise) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress 
                          value={(project.currentRaise / project.totalRaise) * 100} 
                          className="h-2 mb-2" 
                        />
                        <p className="text-xs text-slate-500">
                          Target: {formatCurrency(project.totalRaise)}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-slate-500">Participants</p>
                          <p className="text-lg font-bold text-white">{formatNumber(project.participants)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Launch Date</p>
                          <p className="text-lg font-bold text-white">{project.launchDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Status</p>
                          <p className="text-lg font-bold text-green-400">
                            {project.status === 'sold_out' ? 'SOLD OUT' : 'LIVE'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right ml-6">
                      <Button 
                        className={project.status === 'sold_out' 
                          ? "bg-gray-600 cursor-not-allowed" 
                          : "bg-green-600 hover:bg-green-700"
                        }
                        disabled={project.status === 'sold_out'}
                      >
                        {project.status === 'sold_out' ? 'Sold Out' : 'Participate'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'completed' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Completed Launches</h3>
          
          <div className="grid gap-6">
            {projects.filter(p => p.status === 'completed').map((project) => (
              <Card key={project.id} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-blue-600/20 rounded-lg">
                          <CheckCircle className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white">{project.name}</h4>
                          <p className="text-sm text-slate-400">{project.symbol} • {project.category}</p>
                        </div>
                        <Badge className="bg-blue-600/20 text-blue-400">
                          COMPLETED
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-slate-500">Total Raised</p>
                          <p className="text-lg font-bold text-white">{formatCurrency(project.totalRaise)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Participants</p>
                          <p className="text-lg font-bold text-white">{formatNumber(project.participants)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Current ROI</p>
                          <p className="text-lg font-bold text-green-400">+{project.roi}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">ATH Multiplier</p>
                          <p className="text-lg font-bold text-purple-400">{project.ath_multiplier}x</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Upcoming Launches</h3>
            <Badge className="bg-purple-600/20 text-purple-400">
              {projects.filter(p => p.status === 'upcoming').length} Projects in Pipeline
            </Badge>
          </div>
          
          <div className="grid gap-6">
            {projects.filter(p => p.status === 'upcoming').map((project) => (
              <Card key={project.id} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-purple-600/20 rounded-lg">
                          <Clock className="h-6 w-6 text-purple-400" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white">{project.name}</h4>
                          <p className="text-sm text-slate-400">{project.symbol} • {project.category}</p>
                        </div>
                        <Badge className={getTierColor(project.tier)}>
                          {project.tier.toUpperCase()}
                        </Badge>
                        <Badge className="bg-purple-600/20 text-purple-400">
                          UPCOMING
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-slate-500">Target Raise</p>
                          <p className="text-lg font-bold text-white">{formatCurrency(project.totalRaise)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Launch Date</p>
                          <p className="text-lg font-bold text-white">{project.launchDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Tier</p>
                          <p className="text-lg font-bold text-purple-400">{project.tier.toUpperCase()}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right ml-6">
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        Get Notified
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-400" />
                  Revenue by Tier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pricingTiers.map((tier, index) => (
                    <div key={tier.name} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">{tier.name}</span>
                        <span className="text-green-400 font-bold">{formatCurrency(tier.revenue)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">{tier.projects} projects</span>
                        <span className="text-slate-500">{tier.price} entry</span>
                      </div>
                      <Progress 
                        value={(tier.revenue / Math.max(...pricingTiers.map(t => t.revenue))) * 100} 
                        className="h-2" 
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-blue-400" />
                  Platform Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Average Project Size</span>
                    <span className="text-white font-medium">
                      {formatCurrency(metrics.totalRaised / metrics.totalProjectsLaunched)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Platform Fee Revenue</span>
                    <span className="text-green-400 font-bold">
                      {formatCurrency(metrics.totalRaised * 0.025)} {/* 2.5% platform fee */}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tier Subscription Revenue</span>
                    <span className="text-green-400 font-bold">
                      {formatCurrency(pricingTiers.reduce((sum, tier) => sum + tier.revenue, 0))}
                    </span>
                  </div>
                  <div className="border-t border-slate-600 pt-2">
                    <div className="flex justify-between">
                      <span className="text-white font-medium">Total Platform Revenue</span>
                      <span className="text-green-400 font-bold text-xl">
                        {formatCurrency((metrics.totalRaised * 0.025) + pricingTiers.reduce((sum, tier) => sum + tier.revenue, 0))}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-purple-900/50 to-green-900/50 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Launchpad Performance</h4>
                  <p className="text-purple-300 mb-4">
                    Industry-leading {metrics.successRate}% success rate with {metrics.averageROI}% average ROI
                  </p>
                  <div className="flex items-center gap-4">
                    <ArrowUpRight className="h-5 w-5 text-green-400" />
                    <span className="text-sm text-green-300">
                      {formatCurrency(metrics.monthlyRevenue)} monthly recurring revenue
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Next 12 Months Projected</p>
                  <p className="text-3xl font-bold text-green-400">
                    {formatCurrency(metrics.monthlyRevenue * 12 * 1.5)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}