import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Vote, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  Shield,
  Coins,
  FileText
} from 'lucide-react';

export default function DAO() {
  const activeProposals = [
    {
      id: 1,
      title: "Update Truth Verification Threshold",
      description: "Proposal to increase minimum verification threshold from 3 to 5 validators for Veritas Seal certification",
      status: "active",
      votes: { for: 1247, against: 382 },
      totalVotes: 1629,
      timeLeft: "2 days",
      category: "verification"
    },
    {
      id: 2,
      title: "GTT Reward Distribution Adjustment",
      description: "Modify reward distribution to allocate 15% more tokens to active community validators",
      status: "active",
      votes: { for: 892, against: 234 },
      totalVotes: 1126,
      timeLeft: "5 days",
      category: "rewards"
    },
    {
      id: 3,
      title: "New Capsule Category: Environmental Evidence",
      description: "Create dedicated category for environmental truth claims with specialized validation protocols",
      status: "passed",
      votes: { for: 2341, against: 156 },
      totalVotes: 2497,
      timeLeft: "Completed",
      category: "governance"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-600';
      case 'passed': return 'bg-green-600';
      case 'rejected': return 'bg-red-600';
      default: return 'bg-slate-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'verification': return Shield;
      case 'rewards': return Coins;
      case 'governance': return FileText;
      default: return Vote;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white flex items-center justify-center">
          <Vote className="w-10 h-10 mr-3 text-blue-500" />
          Guardian DAO Governance
        </h1>
        <p className="text-slate-300 max-w-2xl mx-auto">
          Community-driven decision making for the GUARDIANCHAIN ecosystem. 
          Participate in proposals, vote on platform changes, and shape the future of truth preservation.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">2,847</div>
            <div className="text-sm text-slate-400">Active Voters</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <Vote className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">23</div>
            <div className="text-sm text-slate-400">Total Proposals</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">18</div>
            <div className="text-sm text-slate-400">Passed</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">76%</div>
            <div className="text-sm text-slate-400">Participation Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Proposals */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white mb-4">Active Proposals</h2>
        
        {activeProposals.map((proposal) => {
          const CategoryIcon = getCategoryIcon(proposal.category);
          const forPercentage = (proposal.votes.for / proposal.totalVotes) * 100;
          const againstPercentage = (proposal.votes.against / proposal.totalVotes) * 100;
          
          return (
            <Card key={proposal.id} className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                      <CategoryIcon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{proposal.title}</CardTitle>
                      <p className="text-slate-300 text-sm mt-1">{proposal.description}</p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(proposal.status)} text-white`}>
                    {proposal.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Voting Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400">For: {proposal.votes.for} ({forPercentage.toFixed(1)}%)</span>
                      <span className="text-red-400">Against: {proposal.votes.against} ({againstPercentage.toFixed(1)}%)</span>
                    </div>
                    <div className="flex space-x-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="bg-green-500 h-full" 
                        style={{ width: `${forPercentage}%` }}
                      />
                      <div 
                        className="bg-red-500 h-full" 
                        style={{ width: `${againstPercentage}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-slate-400">
                      <Clock className="w-4 h-4 mr-1" />
                      {proposal.timeLeft}
                    </div>
                    
                    {proposal.status === 'active' ? (
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Vote For
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
                          <XCircle className="w-4 h-4 mr-1" />
                          Vote Against
                        </Button>
                      </div>
                    ) : (
                      <Badge variant="outline" className="border-slate-600 text-slate-400">
                        Voting Closed
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* DAO Features */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">DAO Governance Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Shield className="w-12 h-12 text-blue-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Truth Verification Rules</h3>
              <p className="text-slate-400 text-sm">
                Propose and vote on verification standards, validator requirements, and Veritas Seal criteria.
              </p>
            </div>
            
            <div className="text-center">
              <Coins className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">GTT Token Economics</h3>
              <p className="text-slate-400 text-sm">
                Influence reward distribution, staking parameters, and tokenomics adjustments.
              </p>
            </div>
            
            <div className="text-center">
              <Users className="w-12 h-12 text-purple-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Community Governance</h3>
              <p className="text-slate-400 text-sm">
                Elect validators, approve platform updates, and manage community treasury funds.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-blue-900 to-purple-900 border-slate-700">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Ready to Participate?</h3>
          <p className="text-slate-300 mb-4">
            Hold GTT tokens to participate in governance. Your voice shapes the future of truth preservation.
          </p>
          <div className="flex justify-center space-x-3">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Connect Wallet
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300">
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}