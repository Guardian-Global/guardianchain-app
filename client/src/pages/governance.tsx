import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useChainId } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  TRUTH_VAULT_ABI, 
  GTT_TOKEN_ABI, 
  getContractAddress,
  getNetworkName,
  getExplorerUrl
} from '@/lib/contracts';
import {
  Vote,
  Users,
  TrendingUp,
  Shield,
  Coins,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink
} from 'lucide-react';

interface Proposal {
  title: string;
  description: string;
  capsuleId: bigint;
  proposer: string;
  forVotes: bigint;
  againstVotes: bigint;
  executed: boolean;
  deadline: bigint;
}

export default function Governance() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { toast } = useToast();
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    capsuleId: ''
  });

  // Get contract addresses
  let vaultAddress, tokenAddress;
  try {
    vaultAddress = getContractAddress(chainId, 'TRUTH_VAULT');
    tokenAddress = getContractAddress(chainId, 'GTT_TOKEN');
  } catch (error) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-950 border border-yellow-800 rounded-lg p-6 text-center">
            <Shield className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Network Not Supported</h2>
            <p className="text-yellow-200">
              Please connect to a supported network to access DAO governance.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Read user's GTT balance
  const { data: gttBalance } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: GTT_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: {
      enabled: !!tokenAddress && !!address && isConnected
    }
  });

  // Read proposal count
  const { data: proposalCount } = useReadContract({
    address: vaultAddress as `0x${string}`,
    abi: TRUTH_VAULT_ABI,
    functionName: 'proposalCount',
    query: {
      enabled: !!vaultAddress && isConnected
    }
  });

  // Write contract hooks
  const { writeContract, isPending } = useWriteContract();

  const handleCreateProposal = async () => {
    if (!vaultAddress || !newProposal.title || !newProposal.description) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all proposal fields",
        variant: "destructive",
      });
      return;
    }

    try {
      writeContract({
        address: vaultAddress as `0x${string}`,
        abi: TRUTH_VAULT_ABI,
        functionName: 'createProposal',
        args: [
          newProposal.title,
          newProposal.description,
          BigInt(newProposal.capsuleId || 0)
        ],
      });

      // Reset form
      setNewProposal({ title: '', description: '', capsuleId: '' });
      
      toast({
        title: "Proposal Created",
        description: "Your governance proposal has been submitted",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create proposal",
        variant: "destructive",
      });
    }
  };

  const handleVote = async (proposalId: number, support: boolean) => {
    if (!vaultAddress) return;

    try {
      writeContract({
        address: vaultAddress as `0x${string}`,
        abi: TRUTH_VAULT_ABI,
        functionName: 'vote',
        args: [BigInt(proposalId), support],
      });

      toast({
        title: "Vote Cast",
        description: `You voted ${support ? 'for' : 'against'} the proposal`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to cast vote",
        variant: "destructive",
      });
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 text-center">
            <Shield className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
            <p className="text-slate-300">
              Connect your wallet to participate in DAO governance and view your GTT balance.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            TruthDAO Governance
          </h1>
          <p className="text-slate-400 text-lg">
            Shape the future of truth verification through decentralized governance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Coins className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-semibold">
                    {gttBalance ? formatEther(gttBalance) : '0'} GTT
                  </div>
                  <div className="text-sm text-slate-400">Your Balance</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-600 p-2 rounded-lg">
                  <Vote className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-semibold">
                    {proposalCount ? proposalCount.toString() : '0'}
                  </div>
                  <div className="text-sm text-slate-400">Total Proposals</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-600 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-semibold">Active</div>
                  <div className="text-sm text-slate-400">DAO Status</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-600 p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-semibold">High</div>
                  <div className="text-sm text-slate-400">Participation</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create New Proposal */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-green-400" />
              Create New Proposal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Proposal Title</Label>
              <Input
                id="title"
                value={newProposal.title}
                onChange={(e) => setNewProposal(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter proposal title..."
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newProposal.description}
                onChange={(e) => setNewProposal(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your proposal in detail..."
                className="bg-slate-700 border-slate-600 min-h-24"
              />
            </div>
            <div>
              <Label htmlFor="capsuleId">Related Capsule ID (Optional)</Label>
              <Input
                id="capsuleId"
                type="number"
                value={newProposal.capsuleId}
                onChange={(e) => setNewProposal(prev => ({ ...prev, capsuleId: e.target.value }))}
                placeholder="Enter capsule ID if relevant..."
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <Button
              onClick={handleCreateProposal}
              disabled={isPending || !newProposal.title || !newProposal.description}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {isPending ? "Creating..." : "Create Proposal"}
            </Button>
          </CardContent>
        </Card>

        {/* Active Proposals */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Vote className="h-5 w-5 text-blue-400" />
              Active Proposals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-slate-400">
              <Vote className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No active proposals at the moment.</p>
              <p className="text-sm mt-2">Create the first proposal to get started!</p>
            </div>
          </CardContent>
        </Card>

        {/* DAO Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-400" />
                Governance Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Voting Power</span>
                <span>1 GTT = 1 Vote</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Proposal Threshold</span>
                <span>100 GTT Minimum</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Voting Period</span>
                <span>7 Days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Execution Delay</span>
                <span>2 Days</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-yellow-400" />
                Treasury Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Total GTT Supply</span>
                <span>1B GTT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Circulating Supply</span>
                <span>Loading...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Treasury Balance</span>
                <span>Loading...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Yield Pool</span>
                <span>Active</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}