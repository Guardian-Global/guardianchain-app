import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAccount } from 'wagmi';
import ConnectWallet from '@/components/web3/connect-wallet';
import { 
  Vote, 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  X, 
  Plus,
  TrendingUp,
  Shield,
  Coins,
  Target
} from 'lucide-react';

export default function Governance() {
  const { isConnected } = useAccount();
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null);

  // Mock governance data (in production, this would come from Snapshot or on-chain governance)
  const proposals = [
    {
      id: 1,
      title: "Increase Truth Yield Multiplier for Elite Tier",
      description: "Proposal to increase the elite tier multiplier from 2.0x to 2.5x to better reward high-performing truth capsules",
      proposer: "0x1234...5678",
      status: "active",
      votesFor: 127850,
      votesAgainst: 23100,
      totalVotes: 150950,
      quorum: 100000,
      endTime: "2024-07-24T23:59:59Z",
      category: "parameters"
    },
    {
      id: 2,
      title: "Add New Verification Category: Scientific Research",
      description: "Proposal to add a dedicated verification category for peer-reviewed scientific research with enhanced verification requirements",
      proposer: "0x2345...6789",
      status: "active",
      votesFor: 89200,
      votesAgainst: 45300,
      totalVotes: 134500,
      quorum: 100000,
      endTime: "2024-07-22T23:59:59Z",
      category: "features"
    },
    {
      id: 3,
      title: "Reduce Claim Cooldown Period to 5 Days",
      description: "Proposal to reduce the GTT yield claim cooldown from 7 days to 5 days to improve creator liquidity",
      proposer: "0x3456...7890",
      status: "passed",
      votesFor: 156700,
      votesAgainst: 34200,
      totalVotes: 190900,
      quorum: 100000,
      endTime: "2024-07-15T23:59:59Z",
      category: "parameters"
    },
    {
      id: 4,
      title: "Treasury Allocation for Bug Bounty Program",
      description: "Allocate 50,000 GTT from treasury to fund a comprehensive bug bounty program for smart contract security",
      proposer: "0x4567...8901",
      status: "failed",
      votesFor: 67800,
      votesAgainst: 89200,
      totalVotes: 157000,
      quorum: 100000,
      endTime: "2024-07-10T23:59:59Z",
      category: "treasury"
    }
  ];

  const governanceStats = {
    totalProposals: 47,
    activeProposals: 2,
    totalVoters: 12543,
    totalGTTStaked: 2847392,
    treasuryBalance: 1250000,
    avgParticipation: 67.3
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-600';
      case 'passed': return 'bg-green-600';
      case 'failed': return 'bg-red-600';
      case 'pending': return 'bg-yellow-600';
      default: return 'bg-slate-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'parameters': return Target;
      case 'features': return Plus;
      case 'treasury': return Coins;
      default: return FileText;
    }
  };

  const formatVotes = (votes: number) => {
    return new Intl.NumberFormat().format(votes);
  };

  const getTimeRemaining = (endTime: string) => {
    const end = new Date(endTime);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          TruthDAO Governance
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Participate in GuardianChain governance by voting on proposals that shape the future of decentralized truth verification.
        </p>
      </div>

      {/* Governance Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <FileText className="h-6 w-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{governanceStats.totalProposals}</div>
            <div className="text-xs text-slate-400">Total Proposals</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{governanceStats.activeProposals}</div>
            <div className="text-xs text-slate-400">Active Proposals</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{governanceStats.totalVoters.toLocaleString()}</div>
            <div className="text-xs text-slate-400">Total Voters</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <Shield className="h-6 w-6 text-orange-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{governanceStats.totalGTTStaked.toLocaleString()}</div>
            <div className="text-xs text-slate-400">GTT Staked</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <Coins className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{governanceStats.treasuryBalance.toLocaleString()}</div>
            <div className="text-xs text-slate-400">Treasury GTT</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <Vote className="h-6 w-6 text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{governanceStats.avgParticipation}%</div>
            <div className="text-xs text-slate-400">Participation</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="proposals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800">
          <TabsTrigger value="proposals">Active Proposals</TabsTrigger>
          <TabsTrigger value="history">Proposal History</TabsTrigger>
          <TabsTrigger value="create">Create Proposal</TabsTrigger>
        </TabsList>

        <TabsContent value="proposals" className="space-y-4">
          {/* Wallet Connection */}
          {!isConnected && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ConnectWallet showNetworkInfo={false} />
              </div>
              <div className="lg:col-span-2">
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6 text-center">
                    <Vote className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Connect to Participate</h3>
                    <p className="text-slate-400">
                      Connect your wallet to view and vote on governance proposals. 
                      Your voting power is based on your GTT token holdings.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Active Proposals */}
          <div className="space-y-4">
            {proposals.filter(p => p.status === 'active').map((proposal) => {
              const Icon = getCategoryIcon(proposal.category);
              const votingProgress = (proposal.votesFor / proposal.totalVotes) * 100;
              const quorumProgress = (proposal.totalVotes / proposal.quorum) * 100;
              
              return (
                <Card key={proposal.id} className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="bg-slate-700 p-2 rounded-lg">
                          <Icon className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{proposal.title}</CardTitle>
                          <p className="text-sm text-slate-400 mt-1">{proposal.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-slate-500">by {proposal.proposer}</span>
                            <Badge className={getStatusColor(proposal.status)}>
                              {proposal.status}
                            </Badge>
                            <Badge className="bg-slate-600">
                              {proposal.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {getTimeRemaining(proposal.endTime)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Voting Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-green-400">For: {formatVotes(proposal.votesFor)}</span>
                          <span className="text-red-400">Against: {formatVotes(proposal.votesAgainst)}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${votingProgress}%` }}
                          />
                        </div>
                      </div>

                      {/* Quorum Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Quorum Progress</span>
                          <span className="text-white">{formatVotes(proposal.totalVotes)} / {formatVotes(proposal.quorum)}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-1">
                          <div 
                            className={`h-1 rounded-full transition-all duration-300 ${
                              quorumProgress >= 100 ? 'bg-green-600' : 'bg-blue-600'
                            }`}
                            style={{ width: `${Math.min(quorumProgress, 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Voting Buttons */}
                      <div className="flex gap-3">
                        <Button 
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          disabled={!isConnected}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Vote For
                        </Button>
                        <Button 
                          variant="destructive" 
                          className="flex-1"
                          disabled={!isConnected}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Vote Against
                        </Button>
                      </div>

                      {!isConnected && (
                        <p className="text-xs text-slate-500 text-center">
                          Connect your wallet to vote on this proposal
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="space-y-4">
            {proposals.filter(p => p.status !== 'active').map((proposal) => {
              const Icon = getCategoryIcon(proposal.category);
              const votingProgress = (proposal.votesFor / proposal.totalVotes) * 100;
              
              return (
                <Card key={proposal.id} className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="bg-slate-700 p-2 rounded-lg">
                          <Icon className="h-4 w-4 text-slate-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{proposal.title}</h4>
                          <p className="text-sm text-slate-400 mt-1">{proposal.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-slate-500">by {proposal.proposer}</span>
                            <Badge className={getStatusColor(proposal.status)}>
                              {proposal.status}
                            </Badge>
                            <Badge className="bg-slate-600">
                              {proposal.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-sm text-green-400">{Math.round(votingProgress)}% approval</div>
                        <div className="text-xs text-slate-500">{formatVotes(proposal.totalVotes)} votes</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Create New Proposal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8">
                  <Plus className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Proposal Creation Coming Soon</h3>
                  <p className="text-slate-400 max-w-md mx-auto">
                    The proposal creation interface is being integrated with Snapshot for gasless voting. 
                    Join our Discord to discuss proposals and governance ideas.
                  </p>
                  <div className="flex gap-3 justify-center mt-4">
                    <Button variant="outline" disabled>
                      <FileText className="h-4 w-4 mr-2" />
                      Draft Proposal
                    </Button>
                    <Button variant="outline" disabled>
                      <Vote className="h-4 w-4 mr-2" />
                      Submit to Snapshot
                    </Button>
                  </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Requirements for Proposals</h4>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• Minimum 1,000 GTT tokens to create a proposal</li>
                    <li>• Clear title and detailed description required</li>
                    <li>• Proposals must align with GuardianChain values</li>
                    <li>• 7-day voting period for most proposals</li>
                    <li>• 100,000 GTT minimum quorum for passage</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}