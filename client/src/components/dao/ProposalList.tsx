import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  Users,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Calendar,
  BarChart3,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Proposal, Vote } from "@shared/schema";

interface ProposalWithVotes extends Proposal {
  votes: Vote[];
  supportVotes: number;
  rejectVotes: number;
  abstainVotes: number;
  totalWeight: number;
}

interface ProposalListProps {
  onVote?: (
    proposalId: string,
    choice: "support" | "reject" | "abstain",
  ) => void;
  userAddress?: string;
}

export default function ProposalList({
  onVote,
  userAddress,
}: ProposalListProps) {
  const { data: proposals, isLoading } = useQuery<ProposalWithVotes[]>({
    queryKey: ["/api/dao/proposals"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-brand-accent text-white";
      case "closed":
        return "bg-brand-surface text-brand-light";
      case "executed":
        return "bg-brand-primary text-white";
      default:
        return "bg-brand-surface text-brand-light";
    }
  };

  const getVotePercentage = (votes: number, total: number) => {
    return total > 0 ? (votes / total) * 100 : 0;
  };

  const hasUserVoted = (proposal: ProposalWithVotes) => {
    return proposal.votes.some((vote) => vote.voterAddress === userAddress);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card
            key={i}
            className="bg-brand-secondary border-brand-surface animate-pulse"
          >
            <CardContent className="p-6">
              <div className="h-4 bg-brand-surface rounded mb-2"></div>
              <div className="h-3 bg-brand-surface rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-brand-light font-brand mb-2">
          DAO Governance Proposals
        </h2>
        <p className="text-brand-light/80">
          Vote on proposals that shape the future of GuardianChain
        </p>
      </div>

      {!proposals || proposals.length === 0 ? (
        <Card className="bg-brand-secondary border-brand-surface">
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-brand-light/40 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-brand-light mb-2">
              No Active Proposals
            </h3>
            <p className="text-brand-light/60">
              Check back later for new governance proposals to vote on.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {proposals.map((proposal) => {
            const supportPercent = getVotePercentage(
              proposal.supportVotes,
              proposal.totalWeight,
            );
            const rejectPercent = getVotePercentage(
              proposal.rejectVotes,
              proposal.totalWeight,
            );
            const abstainPercent = getVotePercentage(
              proposal.abstainVotes,
              proposal.totalWeight,
            );
            const userVoted = hasUserVoted(proposal);
            const isActive =
              proposal.status === "open" &&
              (!proposal.endTime || new Date(proposal.endTime) > new Date());

            return (
              <Card
                key={proposal.id}
                className="bg-brand-secondary border-brand-surface shadow-card"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-brand-light font-brand flex items-center gap-2">
                        {proposal.title}
                        <Badge className={getStatusColor(proposal.status!)}>
                          {proposal.status}
                        </Badge>
                      </CardTitle>
                      <p className="text-brand-light/80 mt-2">
                        {proposal.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-brand-light/60">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Created{" "}
                        {formatDistanceToNow(new Date(proposal.createdAt!))} ago
                      </span>
                    </div>
                    {proposal.endTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          Ends {formatDistanceToNow(new Date(proposal.endTime))}{" "}
                          from now
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{proposal.votes.length} votes</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Voting Results */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-brand-accent">
                        <ThumbsUp className="w-4 h-4" />
                        <span>Support ({proposal.supportVotes} votes)</span>
                      </div>
                      <span className="text-brand-light/60">
                        {supportPercent.toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={supportPercent}
                      className="h-2 bg-brand-surface"
                    >
                      <div
                        className="h-full bg-brand-accent rounded-full transition-all"
                        style={{ width: `${supportPercent}%` }}
                      />
                    </Progress>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-brand-danger">
                        <ThumbsDown className="w-4 h-4" />
                        <span>Reject ({proposal.rejectVotes} votes)</span>
                      </div>
                      <span className="text-brand-light/60">
                        {rejectPercent.toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={rejectPercent}
                      className="h-2 bg-brand-surface"
                    >
                      <div
                        className="h-full bg-brand-danger rounded-full transition-all"
                        style={{ width: `${rejectPercent}%` }}
                      />
                    </Progress>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-brand-light/60">
                        <Minus className="w-4 h-4" />
                        <span>Abstain ({proposal.abstainVotes} votes)</span>
                      </div>
                      <span className="text-brand-light/60">
                        {abstainPercent.toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={abstainPercent}
                      className="h-2 bg-brand-surface"
                    >
                      <div
                        className="h-full bg-brand-light/40 rounded-full transition-all"
                        style={{ width: `${abstainPercent}%` }}
                      />
                    </Progress>
                  </div>

                  {/* Voting Actions */}
                  <div className="flex gap-2 pt-4 border-t border-brand-surface">
                    {isActive && onVote && !userVoted ? (
                      <>
                        <Button
                          size="sm"
                          className="flex-1 bg-brand-accent hover:bg-brand-accent/90 text-white"
                          onClick={() => onVote(proposal.id, "support")}
                        >
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          Support
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1"
                          onClick={() => onVote(proposal.id, "reject")}
                        >
                          <ThumbsDown className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-brand-surface text-brand-light hover:bg-brand-surface"
                          onClick={() => onVote(proposal.id, "abstain")}
                        >
                          <Minus className="w-4 h-4 mr-1" />
                          Abstain
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-brand-surface text-brand-light hover:bg-brand-surface"
                        onClick={() =>
                          (window.location.href = `/dao/results/${proposal.id}`)
                        }
                      >
                        <BarChart3 className="w-4 h-4 mr-1" />
                        View Results
                      </Button>
                    )}
                  </div>

                  {userVoted && (
                    <div className="pt-4 border-t border-brand-surface">
                      <Badge className="bg-brand-primary text-white">
                        You have voted on this proposal
                      </Badge>
                    </div>
                  )}

                  {!isActive && (
                    <div className="pt-4 border-t border-brand-surface">
                      <Badge className="bg-brand-surface text-brand-light">
                        Voting has ended
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
