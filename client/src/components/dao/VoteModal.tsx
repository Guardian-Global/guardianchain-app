import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import {
  ThumbsUp,
  ThumbsDown,
  Loader2,
  CheckCircle,
  XCircle,
  Users,
  Clock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { getContractAddress, CONTRACT_ABIS } from "@/lib/contracts";
import { formatEther } from "viem";

interface VoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: {
    id: number;
    title: string;
    description: string;
    proposer: string;
    votesFor: bigint;
    votesAgainst: bigint;
    deadline: number;
    executed: boolean;
    createdAt: number;
  };
}

export default function VoteModal({
  isOpen,
  onClose,
  proposal,
}: VoteModalProps) {
  const [voteChoice, setVoteChoice] = useState<boolean | null>(null);
  const { address, chainId } = useAccount();
  const { toast } = useToast();

  const daoAddress = chainId ? getContractAddress(chainId, "dao") : undefined;
  const gttAddress = chainId ? getContractAddress(chainId, "gtt") : undefined;

  // Check if user has already voted
  const { data: hasVoted } = useReadContract({
    address: daoAddress as `0x${string}`,
    abi: CONTRACT_ABIS.TruthDAO,
    functionName: "hasUserVoted",
    args: [BigInt(proposal.id), address],
    enabled: !!daoAddress && !!address,
  });

  // Get user's GTT balance (voting power)
  const { data: votingPower } = useReadContract({
    address: gttAddress as `0x${string}`,
    abi: CONTRACT_ABIS.GTTToken,
    functionName: "balanceOf",
    args: [address],
    enabled: !!gttAddress && !!address,
  });

  // Get user's vote weight if they've voted
  const { data: userVoteWeight } = useReadContract({
    address: daoAddress as `0x${string}`,
    abi: CONTRACT_ABIS.TruthDAO,
    functionName: "getUserVoteWeight",
    args: [BigInt(proposal.id), address],
    enabled: !!daoAddress && !!address && hasVoted,
  });

  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const handleVote = async (support: boolean) => {
    if (!daoAddress || !address) return;

    try {
      writeContract({
        address: daoAddress as `0x${string}`,
        abi: CONTRACT_ABIS.TruthDAO,
        functionName: "vote",
        args: [BigInt(proposal.id), support],
      });

      setVoteChoice(support);
    } catch (error: any) {
      toast({
        title: "Vote Failed",
        description: error.message || "Failed to submit vote",
        variant: "destructive",
      });
    }
  };

  // Handle success
  if (isConfirmed && hash) {
    toast({
      title: "Vote Submitted!",
      description: `Your vote has been recorded on the blockchain`,
    });
    onClose();
  }

  // Handle error
  if (error) {
    toast({
      title: "Transaction Failed",
      description: error.message,
      variant: "destructive",
    });
  }

  const isVotingActive = Date.now() < proposal.deadline * 1000;
  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const forPercentage =
    totalVotes > 0 ? Number((proposal.votesFor * 100n) / totalVotes) : 0;
  const againstPercentage =
    totalVotes > 0 ? Number((proposal.votesAgainst * 100n) / totalVotes) : 0;

  const timeRemaining = Math.max(0, proposal.deadline * 1000 - Date.now());
  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutesRemaining = Math.floor(
    (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-400" />
            {proposal.title}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Proposal #{proposal.id} • Created{" "}
            {new Date(proposal.createdAt * 1000).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Proposal Description */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm text-slate-400">
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white whitespace-pre-wrap">
                {proposal.description}
              </p>
            </CardContent>
          </Card>

          {/* Voting Status */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Voting Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Status:</span>
                <Badge
                  variant={isVotingActive ? "default" : "secondary"}
                  className={isVotingActive ? "bg-green-600" : "bg-gray-600"}
                >
                  {isVotingActive
                    ? "Active"
                    : proposal.executed
                    ? "Executed"
                    : "Ended"}
                </Badge>
              </div>

              {isVotingActive && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Time Remaining:</span>
                  <span className="text-white">
                    {hoursRemaining}h {minutesRemaining}m
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-slate-300">Total Votes:</span>
                <span className="text-white">
                  {formatEther(totalVotes)} GTT
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">Proposer:</span>
                <span className="text-white font-mono text-sm">
                  {proposal.proposer.slice(0, 6)}...
                  {proposal.proposer.slice(-4)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Vote Results */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm text-slate-400">
                Current Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4 text-green-400" />
                    <span className="text-white">For</span>
                  </div>
                  <span className="text-white">
                    {formatEther(proposal.votesFor)} GTT ({forPercentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${forPercentage}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ThumbsDown className="h-4 w-4 text-red-400" />
                    <span className="text-white">Against</span>
                  </div>
                  <span className="text-white">
                    {formatEther(proposal.votesAgainst)} GTT (
                    {againstPercentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${againstPercentage}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voting Power */}
          {address && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-sm text-slate-400">
                  Your Voting Power
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">GTT Balance:</span>
                  <span className="text-white">
                    {votingPower ? formatEther(votingPower) : "0"} GTT
                  </span>
                </div>

                {hasVoted && userVoteWeight && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Vote Weight Used:</span>
                    <span className="text-white">
                      {formatEther(userVoteWeight)} GTT
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Vote Status:</span>
                  <Badge
                    variant={hasVoted ? "default" : "outline"}
                    className={hasVoted ? "bg-blue-600" : "border-slate-600"}
                  >
                    {hasVoted ? "Voted" : "Not Voted"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          <Separator className="border-slate-700" />

          {/* Voting Actions */}
          {address && isVotingActive && !hasVoted && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                Cast Your Vote
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => handleVote(true)}
                  disabled={
                    isPending ||
                    isConfirming ||
                    !votingPower ||
                    votingPower === 0n
                  }
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isPending || isConfirming ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Voting...
                    </>
                  ) : (
                    <>
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      Vote For
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => handleVote(false)}
                  disabled={
                    isPending ||
                    isConfirming ||
                    !votingPower ||
                    votingPower === 0n
                  }
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {isPending || isConfirming ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Voting...
                    </>
                  ) : (
                    <>
                      <ThumbsDown className="mr-2 h-4 w-4" />
                      Vote Against
                    </>
                  )}
                </Button>
              </div>

              {(!votingPower || votingPower === 0n) && (
                <p className="text-sm text-yellow-400 text-center">
                  You need GTT tokens to vote on proposals
                </p>
              )}
            </div>
          )}

          {hasVoted && (
            <div className="text-center p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-blue-400">
                <CheckCircle className="h-5 w-5" />
                <span>You have already voted on this proposal</span>
              </div>
            </div>
          )}

          {!isVotingActive && (
            <div className="text-center p-4 bg-gray-900/20 border border-gray-700 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <XCircle className="h-5 w-5" />
                <span>Voting period has ended</span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
