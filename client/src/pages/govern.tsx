import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import {
  Plus,
  Users,
  Clock,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getContractAddress, CONTRACT_ABIS } from "@/lib/contracts";
import { formatEther } from "viem";
import VoteModal from "@/components/dao/VoteModal";
import FeeDisplay from "@/components/fees/FeeDisplay";
import TreasuryDisplay from "@/components/fees/TreasuryDisplay";
import AdminFeePanel from "@/components/fees/AdminFeePanel";
import { getFeeAmount } from "@/lib/feeConfig";

interface Proposal {
  id: number;
  title: string;
  description: string;
  proposer: string;
  votesFor: bigint;
  votesAgainst: bigint;
  deadline: number;
  executed: boolean;
  createdAt: number;
}

export default function Govern() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null,
  );
  const [newProposal, setNewProposal] = useState({
    title: "",
    description: "",
  });

  const { address, chainId } = useAccount();
  const { toast } = useToast();

  const daoAddress = chainId ? getContractAddress(chainId, "dao") : undefined;
  const gttAddress = chainId ? getContractAddress(chainId, "gtt") : undefined;

  // Get proposal count
  const { data: proposalCount } = useReadContract({
    address: daoAddress as `0x${string}`,
    abi: CONTRACT_ABIS.TruthDAO,
    functionName: "proposalCount",
    query: {
      enabled: !!daoAddress,
    },
  });

  // Get user's GTT balance
  const { data: gttBalance } = useReadContract({
    address: gttAddress as `0x${string}`,
    abi: CONTRACT_ABIS.GTTToken,
    functionName: "balanceOf",
    args: [address],
    query: {
      enabled: !!gttAddress && !!address,
    },
  });

  // Create proposal transaction
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const handleCreateProposal = async () => {
    if (!daoAddress || !newProposal.title || !newProposal.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      writeContract({
        address: daoAddress as `0x${string}`,
        abi: CONTRACT_ABIS.TruthDAO,
        functionName: "createProposal",
        args: [newProposal.title, newProposal.description],
      });
    } catch (error: any) {
      toast({
        title: "Proposal Creation Failed",
        description: error.message || "Failed to create proposal",
        variant: "destructive",
      });
    }
  };

  // Handle success
  if (isConfirmed && hash) {
    toast({
      title: "Proposal Created!",
      description: "Your proposal has been submitted to the DAO",
    });
    setIsCreateOpen(false);
    setNewProposal({ title: "", description: "" });
  }

  // Handle error
  if (error) {
    toast({
      title: "Transaction Failed",
      description: error.message,
      variant: "destructive",
    });
  }

  // Generate proposals array (in a real app, this would come from contract queries)
  const proposals: Proposal[] = [];
  const count = proposalCount ? Number(proposalCount) : 0;

  // Mock proposals for demonstration
  const mockProposals: Proposal[] = [
    {
      id: 1,
      title: "Increase Minimum GTT for Proposals",
      description:
        "Proposal to increase the minimum GTT balance required to create proposals from 1000 to 2500 GTT. This will help reduce spam and ensure only committed community members can create proposals.",
      proposer: "0x742d35Cc6634C0532925a3b8D40b5C0532925a3b",
      votesFor: BigInt("15000000000000000000000"), // 15,000 GTT
      votesAgainst: BigInt("8000000000000000000000"), // 8,000 GTT
      deadline: Math.floor(Date.now() / 1000) + 86400, // 24 hours from now
      executed: false,
      createdAt: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
    },
    {
      id: 2,
      title: "Community Treasury Allocation",
      description:
        "Allocate 10% of the community treasury to fund truth verification incentives and researcher grants. This will help grow the ecosystem and improve verification quality.",
      proposer: "0x8ba1f109551bd432803012645bd8c32c5b8a1f109",
      votesFor: BigInt("22000000000000000000000"), // 22,000 GTT
      votesAgainst: BigInt("5000000000000000000000"), // 5,000 GTT
      deadline: Math.floor(Date.now() / 1000) + 172800, // 48 hours from now
      executed: false,
      createdAt: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
    },
    {
      id: 3,
      title: "Upgrade Truth Verification Algorithm",
      description:
        "Implement new machine learning model for improved truth verification accuracy. This upgrade will enhance the platform's ability to detect misinformation and reward accurate content.",
      proposer: "0x923f107733be841e7be3b8d4c1b923f107733be8",
      votesFor: BigInt("18000000000000000000000"), // 18,000 GTT
      votesAgainst: BigInt("12000000000000000000000"), // 12,000 GTT
      deadline: Math.floor(Date.now() / 1000) - 3600, // Ended 1 hour ago
      executed: true,
      createdAt: Math.floor(Date.now() / 1000) - 259200, // 3 days ago
    },
  ];

  const allProposals = [...mockProposals].sort(
    (a, b) => b.createdAt - a.createdAt,
  );

  const getProposalStatus = (proposal: Proposal) => {
    if (proposal.executed) return { label: "Executed", color: "bg-gray-600" };
    if (Date.now() > proposal.deadline * 1000)
      return { label: "Ended", color: "bg-red-600" };
    return { label: "Active", color: "bg-green-600" };
  };

  const getProposalResult = (proposal: Proposal) => {
    return proposal.votesFor > proposal.votesAgainst ? "Passing" : "Failing";
  };

  const minBalance = BigInt("1000000000000000000000"); // 1000 GTT
  const canCreateProposal = gttBalance && gttBalance >= minBalance;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-purple-600 p-3 rounded-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                DAO Governance
              </h1>
            </div>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Participate in GuardianChain governance through GTT-weighted
              voting
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Total Proposals</p>
                    <p className="text-2xl font-bold text-white">
                      {allProposals.length}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Active Proposals</p>
                    <p className="text-2xl font-bold text-white">
                      {
                        allProposals.filter(
                          (p) => !p.executed && Date.now() < p.deadline * 1000,
                        ).length
                      }
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Your GTT Balance</p>
                    <p className="text-2xl font-bold text-white">
                      {gttBalance ? formatEther(gttBalance) : "0"}
                    </p>
                  </div>
                  <ThumbsUp className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Voting Power</p>
                    <p className="text-2xl font-bold text-white">
                      {gttBalance ? formatEther(gttBalance) : "0"}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">
              Governance Proposals
            </h2>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={!address || !canCreateProposal}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Proposal
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    Create New Proposal
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-slate-300">
                      Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter proposal title"
                      value={newProposal.title}
                      onChange={(e) =>
                        setNewProposal((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-slate-300">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your proposal in detail"
                      value={newProposal.description}
                      onChange={(e) =>
                        setNewProposal((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="bg-slate-700 border-slate-600 text-white min-h-32"
                    />
                  </div>
                  <div className="text-sm text-slate-400">
                    <p>• Minimum 1000 GTT required to create proposals</p>
                    <p>• Voting period: 3 days</p>
                    <p>• Proposals need more FOR votes than AGAINST to pass</p>
                  </div>
                  <Button
                    onClick={handleCreateProposal}
                    disabled={
                      isPending ||
                      isConfirming ||
                      !newProposal.title ||
                      !newProposal.description
                    }
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {isPending || isConfirming ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Proposal"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {!canCreateProposal && address && (
            <Card className="bg-yellow-900/20 border-yellow-700 mb-8">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <XCircle className="h-5 w-5 text-yellow-400" />
                  <div>
                    <p className="text-yellow-400 font-semibold">
                      Insufficient GTT Balance
                    </p>
                    <p className="text-yellow-200 text-sm">
                      You need at least 1000 GTT to create proposals. Current
                      balance: {gttBalance ? formatEther(gttBalance) : "0"} GTT
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Fee Information */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <FeeDisplay
              action="proposal"
              feeAmount={getFeeAmount("proposal")}
              userBalance={gttBalance?.toString()}
              className="mb-0"
            />
            <TreasuryDisplay chainId={chainId} className="mb-0" />
          </div>

          {/* Proposals List */}
          <div className="space-y-6">
            {allProposals.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-12 text-center">
                  <Users className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    No Proposals Yet
                  </h3>
                  <p className="text-slate-400 mb-4">
                    Be the first to create a governance proposal
                  </p>
                  {address && canCreateProposal && (
                    <Button
                      onClick={() => setIsCreateOpen(true)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create First Proposal
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              allProposals.map((proposal) => {
                const status = getProposalStatus(proposal);
                const result = getProposalResult(proposal);
                const totalVotes = proposal.votesFor + proposal.votesAgainst;
                const forPercentage =
                  totalVotes > 0
                    ? Number((proposal.votesFor * BigInt(100)) / totalVotes)
                    : 0;
                const againstPercentage =
                  totalVotes > 0
                    ? Number((proposal.votesAgainst * BigInt(100)) / totalVotes)
                    : 0;

                return (
                  <Card
                    key={proposal.id}
                    className="bg-slate-800/50 border-slate-700 hover:border-purple-500 transition-colors"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">
                              {proposal.title}
                            </h3>
                            <Badge className={status.color}>
                              {status.label}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`border-current ${
                                result === "Passing"
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {result}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-400">
                            Proposal #{proposal.id} • Created{" "}
                            {new Date(
                              proposal.createdAt * 1000,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-slate-300 line-clamp-3">
                        {proposal.description}
                      </p>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <ThumbsUp className="h-4 w-4 text-green-400" />
                              <span className="text-sm text-slate-400">
                                For
                              </span>
                            </div>
                            <span className="text-sm text-white">
                              {formatEther(proposal.votesFor)} GTT
                            </span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${forPercentage}%` }}
                            />
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            {forPercentage.toFixed(1)}%
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <ThumbsDown className="h-4 w-4 text-red-400" />
                              <span className="text-sm text-slate-400">
                                Against
                              </span>
                            </div>
                            <span className="text-sm text-white">
                              {formatEther(proposal.votesAgainst)} GTT
                            </span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-red-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${againstPercentage}%` }}
                            />
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            {againstPercentage.toFixed(1)}%
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span>Total: {formatEther(totalVotes)} GTT</span>
                          <span>
                            Proposer: {proposal.proposer.slice(0, 6)}...
                            {proposal.proposer.slice(-4)}
                          </span>
                        </div>
                        <Button
                          onClick={() => setSelectedProposal(proposal)}
                          variant="outline"
                          className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Admin Fee Management Panel */}
      {address && (
        <section className="mt-8">
          <AdminFeePanel />
        </section>
      )}

      {/* Vote Modal */}
      {selectedProposal && (
        <VoteModal
          isOpen={!!selectedProposal}
          onClose={() => setSelectedProposal(null)}
          proposal={selectedProposal}
        />
      )}
    </div>
  );
}
