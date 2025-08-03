import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Vote as VoteIcon, Check, AlertCircle, Users, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

interface VoteData {
  success: boolean;
  votes: {
    totalVotes: number;
    themeVotes: Record<string, number>;
    topTheme: string;
  };
  clusterId: number;
}

export default function Vote() {
  const [clusterId, setClusterId] = useState<string>("0");
  const [customTheme, setCustomTheme] = useState("");
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const { data: voteData, refetch } = useQuery<VoteData>({
    queryKey: ["/api/dao/cluster-votes", clusterId],
    enabled: !!clusterId,
  });

  const voteMutation = useMutation({
    mutationFn: async (theme: string) => {
      return await apiRequest("POST", "/api/dao/vote-cluster-theme", {
        clusterId: parseInt(clusterId),
        theme
      });
    },
    onSuccess: () => {
      toast({
        title: "Vote Recorded",
        description: "Your theme vote has been successfully submitted",
      });
      refetch();
      setCustomTheme("");
    },
    onError: () => {
      toast({
        title: "Vote Failed",
        description: "Failed to record your vote. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleQuickVote = (theme: string) => {
    voteMutation.mutate(theme);
  };

  const handleCustomVote = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTheme.trim()) {
      voteMutation.mutate(customTheme.trim());
    }
  };

  const clusterOptions = [
    { value: "0", label: "Cluster 0: Grief & Loss", description: "Emotional processing and healing" },
    { value: "1", label: "Cluster 1: Family Memories", description: "Heritage and relationships" },
    { value: "2", label: "Cluster 2: Personal Growth", description: "Achievement and development" },
    { value: "3", label: "Cluster 3: Life Transitions", description: "Major life changes" },
  ];

  const popularThemes = [
    "Grief & Loss",
    "Family Memories", 
    "Personal Growth",
    "Life Transitions",
    "Love & Relationships",
    "Career Milestones",
    "Health Challenges",
    "Spiritual Journey"
  ];

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-12 h-12 text-yellow-400 mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Authentication Required</h2>
            <p className="text-slate-400 text-center mb-6">
              You must be logged in to participate in cluster theme voting
            </p>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-yellow-400 hover:bg-yellow-500 text-slate-900"
            >
              Sign In to Vote
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-yellow-400 mb-4">🗳️ Cluster Theme Voting</h1>
        <p className="text-purple-300 text-lg">
          Help refine AI-discovered emotional patterns through community governance
        </p>
      </div>

      <div className="grid gap-6">
        {/* Cluster Selection */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Select Cluster
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={clusterId} onValueChange={setClusterId}>
              <SelectTrigger className="w-full bg-slate-800 border-slate-600">
                <SelectValue placeholder="Choose a cluster to vote on..." />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {clusterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-slate-400">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Current Voting Results */}
        {voteData && (
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-purple-300 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Current Results for Cluster {clusterId}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Total Votes:</span>
                  <Badge className="bg-blue-400/20 text-blue-400">
                    {voteData.votes.totalVotes}
                  </Badge>
                </div>

                {Object.entries(voteData.votes.themeVotes)
                  .sort(([,a], [,b]) => b - a)
                  .map(([theme, count]) => (
                    <div key={theme} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        {theme === voteData.votes.topTheme && (
                          <Check className="w-4 h-4 text-green-400" />
                        )}
                        <span className="text-white">{theme}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-green-400 h-2 rounded-full transition-all"
                            style={{ width: `${(count / voteData.votes.totalVotes) * 100}%` }}
                          />
                        </div>
                        <span className="text-green-400 font-medium w-8">{count}</span>
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Vote Options */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-purple-300 flex items-center gap-2">
              <VoteIcon className="w-5 h-5" />
              Quick Vote
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {popularThemes.map((theme) => (
                <Button
                  key={theme}
                  variant="outline"
                  onClick={() => handleQuickVote(theme)}
                  disabled={voteMutation.isPending}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  {theme}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Custom Theme Input */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-purple-300">Suggest Custom Theme</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCustomVote} className="space-y-4">
              <Input
                value={customTheme}
                onChange={(e) => setCustomTheme(e.target.value)}
                placeholder="Enter your custom theme name..."
                className="bg-slate-800 border-slate-600 text-white"
                disabled={voteMutation.isPending}
              />
              <Button
                type="submit"
                disabled={!customTheme.trim() || voteMutation.isPending}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900"
              >
                {voteMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                    Submitting Vote...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <VoteIcon className="w-4 h-4" />
                    Submit Custom Theme
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* User Info */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">
                Voting as: <span className="text-white">{user?.firstName} {user?.lastName}</span>
              </span>
              <span className="text-slate-400">
                Tier: <Badge className="ml-1 bg-purple-400/20 text-purple-400">{user?.tier}</Badge>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}