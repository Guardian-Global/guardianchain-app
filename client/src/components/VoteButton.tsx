import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Heart, HeartOff, Loader2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface VoteButtonProps {
  capsuleId: string;
  wallet?: string;
  initialLikes?: number;
  className?: string;
}

export function VoteButton({
  capsuleId,
  wallet,
  initialLikes = 0,
  className,
}: VoteButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [likes, setLikes] = useState(initialLikes);

  // Check if user has voted
  const { data: userVote, isLoading: checkingVote } = useQuery({
    queryKey: [`/api/capsules/${capsuleId}/user-vote/${wallet}`],
    enabled: !!wallet,
    retry: false,
  });

  // Get vote statistics
  const { data: voteStats, isLoading: loadingStats } = useQuery({
    queryKey: [`/api/capsules/${capsuleId}/votes`],
    retry: false,
  });

  // Update likes when vote stats change
  useEffect(() => {
    if (voteStats?.upvotes !== undefined) {
      setLikes(voteStats.upvotes);
    }
  }, [voteStats]);

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async (voteType: "upvote" | "downvote") => {
      if (!wallet) {
        throw new Error("Wallet connection required to vote");
      }

      return await apiRequest(`/api/capsules/${capsuleId}/vote`, {
        method: "POST",
        body: JSON.stringify({
          wallet,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: (data) => {
      // Update local likes count
      if (data.updatedLikes !== undefined) {
        setLikes(data.updatedLikes);
      }

      // Invalidate and refetch related queries
      queryClient.invalidateQueries({
        queryKey: [`/api/capsules/${capsuleId}/votes`],
      });
      queryClient.invalidateQueries({
        queryKey: [`/api/capsules/${capsuleId}/user-vote/${wallet}`],
      });

      toast({
        title: "Vote recorded",
        description: "Your vote has been successfully recorded.",
      });
    },
    onError: (error: Error) => {
      console.error("Vote error:", error);
      toast({
        title: "Vote failed",
        description:
          error.message || "Failed to record vote. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleVote = () => {
    if (!wallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to vote on capsules.",
        variant: "destructive",
      });
      return;
    }

    // Determine vote type based on current user vote status
    const voteType =
      userVote?.hasVoted && userVote.voteType === "upvote"
        ? "downvote"
        : "upvote";
    voteMutation.mutate(voteType);
  };

  const isVoting = voteMutation.isPending;
  const hasVoted = userVote?.hasVoted && userVote.voteType === "upvote";
  const isLoading = checkingVote || loadingStats;

  return (
    <Button
      variant={hasVoted ? "default" : "outline"}
      size="sm"
      onClick={handleVote}
      disabled={isVoting || isLoading}
      className={`flex items-center gap-2 ${className || ""}`}
    >
      {isVoting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : hasVoted ? (
        <Heart className="w-4 h-4 fill-current" />
      ) : (
        <HeartOff className="w-4 h-4" />
      )}

      <span className="text-sm font-medium">{isLoading ? "..." : likes}</span>

      {isVoting && <span className="text-xs opacity-75">Voting...</span>}
    </Button>
  );
}

export default VoteButton;
