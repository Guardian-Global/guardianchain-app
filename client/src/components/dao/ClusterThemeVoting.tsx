import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Vote, Users, TrendingUp, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ClusterThemeVotingProps {
  clusterId: number;
  currentTheme: string;
  className?: string;
}

interface VoteData {
  totalVotes: number;
  themeVotes: Record<string, number>;
  topTheme: string;
}

export default function ClusterThemeVoting({ 
  clusterId, 
  currentTheme, 
  className 
}: ClusterThemeVotingProps) {
  const [newTheme, setNewTheme] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: voteData } = useQuery<{
    success: boolean;
    votes: VoteData;
    clusterId: number;
  }>({
    queryKey: ["/api/dao/cluster-votes", clusterId],
  });

  const voteMutation = useMutation({
    mutationFn: async (theme: string) => {
      return await apiRequest("POST", "/api/dao/vote-cluster-theme", {
        clusterId,
        theme
      });
    },
    onSuccess: () => {
      toast({
        title: "Vote Recorded",
        description: "Your theme vote has been successfully recorded",
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/dao/cluster-votes", clusterId]
      });
      setNewTheme("");
    },
    onError: () => {
      toast({
        title: "Vote Failed",
        description: "Failed to record your vote. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleVote = (theme: string) => {
    voteMutation.mutate(theme);
  };

  const handleSubmitNewTheme = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTheme.trim()) {
      handleVote(newTheme.trim());
    }
  };

  const votes = voteData?.votes;
  const topThemes = votes ? Object.entries(votes.themeVotes)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3) : [];

  return (
    <Card className={`bg-slate-800 border-slate-700 ${className}`}>
      <CardHeader>
        <CardTitle className="text-yellow-400 flex items-center gap-2">
          <Vote className="w-5 h-5" />
          Community Theme Voting
        </CardTitle>
        <p className="text-slate-400 text-sm">
          Help refine the theme for Cluster {clusterId}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Analysis */}
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-slate-300 text-sm font-medium">AI Analysis</span>
          </div>
          <Badge className="bg-blue-400/20 text-blue-400 border-blue-400">
            {currentTheme}
          </Badge>
        </div>

        {/* Voting Results */}
        {votes && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-400" />
                <span className="text-slate-300 text-sm font-medium">Community Votes</span>
              </div>
              <Badge variant="outline" className="text-green-400 border-green-400">
                {votes.totalVotes} votes
              </Badge>
            </div>

            <div className="space-y-2">
              {topThemes.map(([theme, count]) => (
                <div key={theme} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                  <div className="flex items-center gap-2">
                    {theme === votes.topTheme && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                    <span className="text-slate-200">{theme}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-green-400 h-2 rounded-full"
                        style={{ width: `${(count / votes.totalVotes) * 100}%` }}
                      />
                    </div>
                    <span className="text-green-400 text-sm font-medium">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Vote Options */}
        <div className="space-y-2">
          <p className="text-slate-300 text-sm font-medium">Quick Vote</p>
          <div className="flex flex-wrap gap-2">
            {["Grief & Loss", "Family Memories", "Personal Growth", "Life Transitions"].map((theme) => (
              <Button
                key={theme}
                variant="outline"
                size="sm"
                onClick={() => handleVote(theme)}
                disabled={voteMutation.isPending}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                {theme}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Theme Input */}
        <form onSubmit={handleSubmitNewTheme} className="space-y-2">
          <p className="text-slate-300 text-sm font-medium">Suggest New Theme</p>
          <div className="flex gap-2">
            <Input
              value={newTheme}
              onChange={(e) => setNewTheme(e.target.value)}
              placeholder="Enter theme name..."
              className="bg-slate-900 border-slate-600 text-slate-100"
              disabled={voteMutation.isPending}
            />
            <Button
              type="submit"
              disabled={!newTheme.trim() || voteMutation.isPending}
              className="bg-yellow-400 hover:bg-yellow-500 text-slate-900"
            >
              {voteMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Vote className="w-4 h-4" />
              )}
            </Button>
          </div>
        </form>

        {/* Winner Display */}
        {votes?.topTheme && (
          <div className="bg-green-400/10 border border-green-400/30 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-medium">Community Choice</span>
            </div>
            <p className="text-slate-200 mt-1">{votes.topTheme}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}