import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Crown, 
  Shield,
  Globe,
  Target,
  Zap,
  Activity,
  BarChart3,
  PieChart,
  Vote,
  Lock,
  Coins,
  ArrowUpRight,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star,
  FileText,
  Settings
} from 'lucide-react';

interface DAOClient {
  id: string;
  name: string;
  industry: string;
  memberCount: number;
  treasuryValue: number;
  monthlyFee: number;
  setupFee: number;
  contractType: 'basic' | 'advanced' | 'enterprise';
  features: string[];
  startDate: string;
  renewalDate: string;
  status: 'active' | 'setup' | 'renewal';
}

interface GovernanceProposal {
  id: string;
  client: string;
  title: string;
  type: 'treasury' | 'governance' | 'technical' | 'membership';
  amount?: number;
  votingPower: number;
  forVotes: number;
  againstVotes: number;
  status: 'active' | 'passed' | 'failed' | 'executed';
  timeRemaining: string;
}

interface RevenueStream {
  type: string;
  monthlyRevenue: number;
  clients: number;
  growthRate: number;
  description: string;
}

export function EnterpriseDAOSuite() {
  const [activeTab, setActiveTab] = useState<'clients' | 'governance' | 'revenue' | 'analytics'>('clients');

  const [daoClients] = useState<DAOClient[]>([
    {
      id: '1',
      name: 'Fortune 500 Investment DAO',
      industry: 'Investment Management',
      memberCount: 2847,
      treasuryValue: 2500000000, // $2.5B
      monthlyFee: 500000,
      setupFee: 2000000,
      contractType: 'enterprise',
      features: ['Custom Governance', 'Treasury Management', 'Compliance Dashboard', 'White-label Interface'],
      startDate: '2024-08-15',
      renewalDate: '2025-08-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Global Innovation Collective',
      industry: 'Technology',
      memberCount: 8934,
      treasuryValue: 850000000, // $850M
      monthlyFee: 300000,
      setupFee: 1200000,
      contractType: 'enterprise',
      features: ['R&D Funding', 'IP Management', 'Patent DAO', 'Innovation Rewards'],
      startDate: '2024-06-20',
      renewalDate: '2025-06-20',
      status: 'active'
    },
    {
      id: '3',
      name: 'Sovereign Wealth Consortium',
      industry: 'Government/Sovereign',
      memberCount: 156,
      treasuryValue: 12000000000, // $12B
      monthlyFee: 1000000,
      setupFee: 5000000,
      contractType: 'enterprise',
      features: ['Multi-sig Treasury', 'Regulatory Compliance', 'Cross-border Governance', 'Economic Policy Tools'],
      startDate: '2024-03-10',
      renewalDate: '2025-03-10',
      status: 'active'
    },
    {
      id: '4',
      name: 'Healthcare Innovation DAO',
      industry: 'Healthcare',
      memberCount: 4562,
      treasuryValue: 450000000, // $450M
      monthlyFee: 250000,
      setupFee: 800000,
      contractType: 'advanced',
      features: ['Medical Research Funding', 'Clinical Trial Governance', 'Data Privacy Controls'],
      startDate: '2024-11-01',
      renewalDate: '2025-11-01',
      status: 'setup'
    }
  ]);

  const [activeProposals] = useState<GovernanceProposal[]>([
    {
      id: '1',
      client: 'Fortune 500 Investment DAO',
      title: 'Allocate $500M to DeFi Yield Strategy',
      type: 'treasury',
      amount: 500000000,
      votingPower: 100000000,
      forVotes: 67000000,
      againstVotes: 23000000,
      status: 'active',
      timeRemaining: '3 days'
    },
    {
      id: '2',
      client: 'Global Innovation Collective',
      title: 'Approve Quantum Computing Research Grant',
      type: 'treasury',
      amount: 50000000,
      votingPower: 45000000,
      forVotes: 42000000,
      againstVotes: 1500000,
      status: 'passed',
      timeRemaining: 'Completed'
    },
    {
      id: '3',
      client: 'Sovereign Wealth Consortium',
      title: 'Implement Multi-Chain Treasury Diversification',
      type: 'technical',
      votingPower: 15000000,
      forVotes: 14200000,
      againstVotes: 300000,
      status: 'executed',
      timeRemaining: 'Executed'
    }
  ]);

  const [revenueStreams] = useState<RevenueStream[]>([
    {
      type: 'Enterprise Setup Fees',
      monthlyRevenue: 8200000, // One-time converted to monthly avg
      clients: 4,
      growthRate: 156,
      description: 'Initial DAO setup and customization for enterprise clients'
    },
    {
      type: 'Monthly Management Fees',
      monthlyRevenue: 2050000,
      clients: 4,
      growthRate: 23,
      description: 'Ongoing DAO operations, governance tools, and support'
    },
    {
      type: 'Treasury Management (0.1% AUM)',
      monthlyRevenue: 1316666, // 0.1% of total AUM annually / 12
      clients: 4,
      growthRate: 89,
      description: 'Fee based on assets under management in DAO treasuries'
    },
    {
      type: 'Governance Platform SaaS',
      monthlyRevenue: 850000,
      clients: 12,
      growthRate: 234,
      description: 'White-label governance platform licensing'
    },
    {
      type: 'Compliance & Audit Services',
      monthlyRevenue: 650000,
      clients: 4,
      growthRate: 67,
      description: 'Regulatory compliance and treasury auditing services'
    }
  ]);

  const totalTreasuryValue = daoClients.reduce((sum, client) => sum + client.treasuryValue, 0);
  const totalMonthlyRevenue = revenueStreams.reduce((sum, stream) => sum + stream.monthlyRevenue, 0);
  const totalMembers = daoClients.reduce((sum, client) => sum + client.memberCount, 0);

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

  const getContractTypeColor = (type: string) => {
    switch (type) {
      case 'enterprise': return 'bg-purple-600/20 text-purple-400 border-purple-500/30';
      case 'advanced': return 'bg-blue-600/20 text-blue-400 border-blue-500/30';
      case 'basic': return 'bg-green-600/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-600/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600/20 text-green-400';
      case 'setup': return 'bg-yellow-600/20 text-yellow-400';
      case 'renewal': return 'bg-blue-600/20 text-blue-400';
      case 'passed': return 'bg-green-600/20 text-green-400';
      case 'failed': return 'bg-red-600/20 text-red-400';
      case 'executed': return 'bg-purple-600/20 text-purple-400';
      default: return 'bg-gray-600/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Enterprise DAO Suite</h2>
          <p className="text-slate-400">
            Managing {formatCurrency(totalTreasuryValue)} in DAO treasuries across {daoClients.length} enterprise clients
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
            {formatCurrency(totalMonthlyRevenue)}/month
          </Badge>
          <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30">
            {formatNumber(totalMembers)} Members
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
                <p className="text-sm text-slate-400">Treasury AUM</p>
                <p className="text-xl font-bold text-white">{formatCurrency(totalTreasuryValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Enterprise Clients</p>
                <p className="text-xl font-bold text-white">{daoClients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <Users className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Members</p>
                <p className="text-xl font-bold text-white">{formatNumber(totalMembers)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-600/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Monthly Revenue</p>
                <p className="text-xl font-bold text-white">{formatCurrency(totalMonthlyRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-slate-800 p-1 rounded-lg">
        <Button
          size="sm"
          variant={activeTab === 'clients' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('clients')}
          className="flex-1"
        >
          Enterprise Clients
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'governance' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('governance')}
          className="flex-1"
        >
          Governance Hub
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'revenue' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('revenue')}
          className="flex-1"
        >
          Revenue Streams
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'analytics' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('analytics')}
          className="flex-1"
        >
          Analytics
        </Button>
      </div>

      {/* Content Sections */}
      {activeTab === 'clients' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Enterprise DAO Clients</h3>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Building2 className="h-4 w-4 mr-2" />
              Onboard Enterprise Client
            </Button>
          </div>

          <div className="grid gap-6">
            {daoClients.map((client) => (
              <Card key={client.id} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-purple-600/20 rounded-lg">
                          <Building2 className="h-6 w-6 text-purple-400" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white">{client.name}</h4>
                          <p className="text-sm text-slate-400">{client.industry}</p>
                        </div>
                        <Badge className={getContractTypeColor(client.contractType)}>
                          {client.contractType.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(client.status)}>
                          {client.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-slate-500">Treasury Value</p>
                          <p className="text-lg font-bold text-white">{formatCurrency(client.treasuryValue)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Members</p>
                          <p className="text-lg font-bold text-white">{formatNumber(client.memberCount)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Monthly Fee</p>
                          <p className="text-lg font-bold text-green-400">{formatCurrency(client.monthlyFee)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Setup Fee</p>
                          <p className="text-lg font-bold text-blue-400">{formatCurrency(client.setupFee)}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500 mb-2">Features & Services</p>
                        <div className="flex flex-wrap gap-2">
                          {client.features.map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right ml-6">
                      <div className="mb-4">
                        <p className="text-xs text-slate-500">Contract Period</p>
                        <p className="text-sm text-white">{client.startDate}</p>
                        <p className="text-sm text-slate-400">to {client.renewalDate}</p>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Manage DAO
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Enterprise DAO Package</h4>
                  <p className="text-sm text-purple-300 mb-4">
                    Complete enterprise DAO solution with custom governance, treasury management, and compliance tools
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-purple-300">Setup Fee: $2M - $5M</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-purple-300">Monthly Fee: $250K - $1M</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-purple-300">Treasury Management: 0.1% AUM</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Average Client Value</p>
                  <p className="text-3xl font-bold text-green-400">{formatCurrency(3750000)}</p>
                  <p className="text-sm text-green-300">Annual Contract</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'governance' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Active Governance Proposals</h3>
            <div className="flex gap-2">
              <Badge className="bg-blue-600/20 text-blue-400">
                {activeProposals.filter(p => p.status === 'active').length} Active
              </Badge>
              <Badge className="bg-green-600/20 text-green-400">
                {activeProposals.filter(p => p.status === 'passed').length} Passed
              </Badge>
            </div>
          </div>
          
          <div className="grid gap-4">
            {activeProposals.map((proposal) => (
              <Card key={proposal.id} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${
                          proposal.type === 'treasury' ? 'bg-green-600/20' :
                          proposal.type === 'governance' ? 'bg-blue-600/20' :
                          proposal.type === 'technical' ? 'bg-purple-600/20' :
                          'bg-yellow-600/20'
                        }`}>
                          <Vote className={`h-5 w-5 ${
                            proposal.type === 'treasury' ? 'text-green-400' :
                            proposal.type === 'governance' ? 'text-blue-400' :
                            proposal.type === 'technical' ? 'text-purple-400' :
                            'text-yellow-400'
                          }`} />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white">{proposal.title}</h4>
                          <p className="text-sm text-slate-400">{proposal.client}</p>
                        </div>
                        <Badge className={getStatusColor(proposal.status)}>
                          {proposal.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      {proposal.amount && (
                        <div className="mb-4">
                          <p className="text-xs text-slate-500">Proposal Amount</p>
                          <p className="text-xl font-bold text-green-400">{formatCurrency(proposal.amount)}</p>
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">For: {formatNumber(proposal.forVotes)}</span>
                          <span className="text-slate-400">Against: {formatNumber(proposal.againstVotes)}</span>
                        </div>
                        <Progress 
                          value={(proposal.forVotes / proposal.votingPower) * 100} 
                          className="h-2" 
                        />
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>Total Voting Power: {formatNumber(proposal.votingPower)}</span>
                          <span>Participation: {(((proposal.forVotes + proposal.againstVotes) / proposal.votingPower) * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right ml-6">
                      <div className="mb-4">
                        <p className="text-xs text-slate-500">Time Remaining</p>
                        <p className="text-sm font-bold text-white">{proposal.timeRemaining}</p>
                      </div>
                      {proposal.status === 'active' && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          View Details
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'revenue' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Revenue Streams</h3>
          
          <div className="grid gap-4">
            {revenueStreams.map((stream, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-green-600/20 rounded-lg">
                          <DollarSign className="h-6 w-6 text-green-400" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white">{stream.type}</h4>
                          <p className="text-sm text-slate-400">{stream.description}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-slate-500">Monthly Revenue</p>
                          <p className="text-lg font-bold text-green-400">{formatCurrency(stream.monthlyRevenue)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Active Clients</p>
                          <p className="text-lg font-bold text-white">{stream.clients}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Growth Rate</p>
                          <p className="text-lg font-bold text-blue-400">+{stream.growthRate}%</p>
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

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-400" />
                  Revenue Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueStreams.map((stream, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400 text-sm">{stream.type}</span>
                        <span className="text-green-400 font-bold">{formatCurrency(stream.monthlyRevenue)}</span>
                      </div>
                      <Progress 
                        value={(stream.monthlyRevenue / totalMonthlyRevenue) * 100} 
                        className="h-2" 
                      />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>{stream.clients} clients</span>
                        <span>{((stream.monthlyRevenue / totalMonthlyRevenue) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-blue-400" />
                  Client Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Average Contract Value</span>
                    <span className="text-white font-medium">
                      {formatCurrency((totalMonthlyRevenue * 12) / daoClients.length)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total AUM Management</span>
                    <span className="text-purple-400 font-bold">{formatCurrency(totalTreasuryValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Average Members per DAO</span>
                    <span className="text-white font-medium">{formatNumber(totalMembers / daoClients.length)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Client Retention Rate</span>
                    <span className="text-green-400 font-bold">100%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-purple-900/50 to-green-900/50 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Enterprise DAO Market Leadership</h4>
                  <p className="text-purple-300 mb-4">
                    Managing {formatCurrency(totalTreasuryValue)} across {daoClients.length} enterprise DAOs with 100% client retention
                  </p>
                  <div className="flex items-center gap-4">
                    <ArrowUpRight className="h-5 w-5 text-green-400" />
                    <span className="text-sm text-green-300">
                      {formatCurrency(totalMonthlyRevenue * 12)} annual recurring revenue
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Projected 12m Revenue</p>
                  <p className="text-3xl font-bold text-green-400">
                    {formatCurrency(totalMonthlyRevenue * 12 * 1.8)}
                  </p>
                  <p className="text-sm text-green-300">80% growth projected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}