// client/src/pages/veritas/vote.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserTier } from '@/hooks/useUserTier';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Vote as VoteIcon, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Plus,
  Users,
  Trophy,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { ethers } from 'ethers';

interface Proposal {
  id: number;
  proposer: string;
  title: string;
  description: string;
  startTime: number;
  endTime: number;
  forVotes: string;
  againstVotes: string;
  state: 'Pending' | 'Active' | 'Succeeded' | 'Defeated' | 'Executed' | 'Cancelled';
  hasVoted?: boolean;
  userVote?: boolean;
  userVoteWeight?: string;
}

const VeritasVotePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { tier, hasAdminAccess } = useUserTier();
  const { toast } = useToast();

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [gttBalance, setGttBalance] = useState('0');
  const [votingPower, setVotingPower] = useState('0');
  const [creating, setCreating] = useState(false);
  const [voting, setVoting] = useState<{ [key: number]: boolean }>({});

  // New proposal form
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    target: '',
    callData: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchProposals();
      fetchGTTBalance();
    }
  }, [isAuthenticated]);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/veritas/proposals', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch proposals');
      }

      const data = await response.json();
      setProposals(data);
    } catch (error) {
      console.error('Error fetching proposals:', error);
      toast({
        title: "Failed to load proposals",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchGTTBalance = async () => {
    try {
      if (!window.ethereum) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      // Mock balance for development - replace with actual contract call
      const mockBalance = '25000';
      setGttBalance(mockBalance);
      setVotingPower(mockBalance);
    } catch (error) {
      console.error('Error fetching GTT balance:', error);
    }
  };

  const createProposal = async () => {
    if (!newProposal.title.trim() || !newProposal.description.trim()) {
      toast({
        title: "Missing required fields",
        description: "Please provide both title and description",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);

    try {
      const response = await fetch('/api/veritas/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newProposal),
      });

      if (!response.ok) {
        throw new Error('Failed to create proposal');
      }

      const result = await response.json();
      
      toast({
        title: "Proposal created successfully",
        description: `Proposal #${result.proposalId} is now active`,
      });

      // Reset form and refresh proposals
      setNewProposal({ title: '', description: '', target: '', callData: '' });
      fetchProposals();
    } catch (error) {
      console.error('Error creating proposal:', error);
      toast({
        title: "Failed to create proposal",
        description: "Please check your GTT balance and try again",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const vote = async (proposalId: number, support: boolean) => {
    setVoting(prev => ({ ...prev, [proposalId]: true }));

    try {
      const response = await fetch(`/api/veritas/proposals/${proposalId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ support }),
      });

      if (!response.ok) {
        throw new Error('Failed to vote');
      }

      toast({
        title: "Vote cast successfully",
        description: `You voted ${support ? 'FOR' : 'AGAINST'} proposal #${proposalId}`,
      });

      fetchProposals(); // Refresh to show updated vote counts
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Vote failed",
        description: "Please check your GTT balance and try again",
        variant: "destructive",
      });
    } finally {
      setVoting(prev => ({ ...prev, [proposalId]: false }));
    }
  };

  const getStateColor = (state: Proposal['state']) => {
    switch (state) {
      case 'Active': return 'bg-blue-500';
      case 'Succeeded': return 'bg-green-500';
      case 'Defeated': return 'bg-red-500';
      case 'Executed': return 'bg-purple-500';
      case 'Cancelled': return 'bg-gray-500';
      default: return 'bg-yellow-500';
    }
  };

  const getTimeRemaining = (endTime: number) => {
    const now = Math.floor(Date.now() / 1000);
    const remaining = endTime - now;
    
    if (remaining <= 0) return 'Ended';
    
    const days = Math.floor(remaining / (24 * 60 * 60));
    const hours = Math.floor((remaining % (24 * 60 * 60)) / (60 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-orange-500" />
            <h3 className="mt-2 text-lg font-medium">Authentication Required</h3>
            <p className="text-gray-500">Please log in to participate in DAO governance</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <VoteIcon className="h-6 w-6" />
              VeritasDAO Governance
            </CardTitle>
            <CardDescription>
              Participate in GuardianChain governance using your GTT voting power
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Your GTT Balance</p>
                  <p className="text-2xl font-bold">{Number(gttBalance).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Voting Power</p>
                  <p className="text-2xl font-bold">{Number(votingPower).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="h-fit">
                  Tier: {tier}
                </Badge>
                {hasAdminAccess && (
                  <Badge variant="default" className="h-fit">
                    DAO Admin
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="proposals" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="proposals">Active Proposals</TabsTrigger>
            <TabsTrigger value="create">Create Proposal</TabsTrigger>
          </TabsList>

          <TabsContent value="proposals" className="space-y-4">
            {loading ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-500">Loading proposals...</p>
                </CardContent>
              </Card>
            ) : proposals.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <VoteIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">No Active Proposals</h3>
                  <p className="text-gray-500">Be the first to create a governance proposal</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {proposals.map((proposal) => (
                  <Card key={proposal.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="flex items-center gap-2">
                            #{proposal.id} {proposal.title}
                            <Badge className={getStateColor(proposal.state)}>
                              {proposal.state}
                            </Badge>
                          </CardTitle>
                          <CardDescription>
                            Proposed by {proposal.proposer.slice(0, 10)}...
                          </CardDescription>
                        </div>
                        
                        {proposal.state === 'Active' && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            {getTimeRemaining(proposal.endTime)}
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-gray-700 dark:text-gray-300">
                        {proposal.description}
                      </p>
                      
                      {/* Vote Results */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-600">For</span>
                            <span className="text-sm font-bold">
                              {Number(ethers.formatUnits(proposal.forVotes, 18)).toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ 
                                width: `${
                                  Number(proposal.forVotes) + Number(proposal.againstVotes) === 0 
                                    ? 0 
                                    : (Number(proposal.forVotes) / (Number(proposal.forVotes) + Number(proposal.againstVotes))) * 100
                                }%` 
                              }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-red-600">Against</span>
                            <span className="text-sm font-bold">
                              {Number(ethers.formatUnits(proposal.againstVotes, 18)).toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-red-500 h-2 rounded-full" 
                              style={{ 
                                width: `${
                                  Number(proposal.forVotes) + Number(proposal.againstVotes) === 0 
                                    ? 0 
                                    : (Number(proposal.againstVotes) / (Number(proposal.forVotes) + Number(proposal.againstVotes))) * 100
                                }%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* User Vote Status */}
                      {proposal.hasVoted && (
                        <div className="flex items-center gap-2 text-sm">
                          {proposal.userVote ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span>
                            You voted <strong>{proposal.userVote ? 'FOR' : 'AGAINST'}</strong> with{' '}
                            <strong>{Number(ethers.formatUnits(proposal.userVoteWeight || '0', 18)).toLocaleString()}</strong> GTT
                          </span>
                        </div>
                      )}
                      
                      {/* Voting Buttons */}
                      {proposal.state === 'Active' && !proposal.hasVoted && Number(gttBalance) > 0 && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => vote(proposal.id, true)}
                            disabled={voting[proposal.id]}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            data-testid={`button-vote-for-${proposal.id}`}
                          >
                            {voting[proposal.id] ? 'Voting...' : 'Vote FOR'}
                          </Button>
                          <Button
                            onClick={() => vote(proposal.id, false)}
                            disabled={voting[proposal.id]}
                            variant="destructive"
                            className="flex-1"
                            data-testid={`button-vote-against-${proposal.id}`}
                          >
                            {voting[proposal.id] ? 'Voting...' : 'Vote AGAINST'}
                          </Button>
                        </div>
                      )}
                      
                      {proposal.state === 'Active' && Number(gttBalance) === 0 && (
                        <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                          <p className="text-sm text-yellow-700 dark:text-yellow-300">
                            You need GTT tokens to vote on proposals
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create New Proposal
                </CardTitle>
                <CardDescription>
                  Requires {Number(100000).toLocaleString()} GTT minimum to create a proposal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    placeholder="Proposal title"
                    value={newProposal.title}
                    onChange={(e) => setNewProposal(prev => ({ ...prev, title: e.target.value }))}
                    data-testid="input-proposal-title"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Detailed description of the proposal..."
                    value={newProposal.description}
                    onChange={(e) => setNewProposal(prev => ({ ...prev, description: e.target.value }))}
                    rows={6}
                    data-testid="textarea-proposal-description"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target Contract (Optional)</label>
                    <Input
                      placeholder="0x..."
                      value={newProposal.target}
                      onChange={(e) => setNewProposal(prev => ({ ...prev, target: e.target.value }))}
                      data-testid="input-proposal-target"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Call Data (Optional)</label>
                    <Input
                      placeholder="0x..."
                      value={newProposal.callData}
                      onChange={(e) => setNewProposal(prev => ({ ...prev, callData: e.target.value }))}
                      data-testid="input-proposal-calldata"
                    />
                  </div>
                </div>
                
                <Button
                  onClick={createProposal}
                  disabled={creating || Number(gttBalance) < 100000}
                  className="w-full"
                  size="lg"
                  data-testid="button-create-proposal"
                >
                  {creating ? 'Creating Proposal...' : 'Create Proposal'}
                </Button>
                
                {Number(gttBalance) < 100000 && (
                  <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="text-sm text-red-700 dark:text-red-300">
                      You need at least {Number(100000).toLocaleString()} GTT to create a proposal
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VeritasVotePage;