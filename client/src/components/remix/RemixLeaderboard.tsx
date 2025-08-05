import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Heart, Users, Flame, Crown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface RemixLeaderboardProps {
  contestId?: string;
  className?: string;
}

export default function RemixLeaderboard({ contestId, className }: RemixLeaderboardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [votedRemixes, setVotedRemixes] = useState<Set<string>>(new Set());

  // Get active contest if no contestId provided
  const { data: activeContest } = useQuery({
    queryKey: ['/api/remix/contest/active'],
    enabled: !contestId,
  });

  const currentContestId = contestId || activeContest?.contest?.id;

  // Get contest leaderboard
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: [`/api/remix/contest/leaderboard/${currentContestId}`],
    enabled: !!currentContestId,
  });

  const voteMutation = useMutation({
    mutationFn: async (remixId: string) => {
      const response = await fetch('/api/remix/contest/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          remixId,
          userId: user?.id || 'dev-user-123',
        }),
      });
      return response.json();
    },
    onSuccess: (data, remixId) => {
      toast({
        title: "Vote Cast",
        description: "Your vote has been recorded!",
      });
      setVotedRemixes(prev => new Set(prev).add(remixId));
      queryClient.invalidateQueries({ queryKey: [`/api/remix/contest/leaderboard/${currentContestId}`] });
    },
    onError: (error: any) => {
      toast({
        title: "Vote Failed",
        description: error.message || "Failed to cast vote. You may have already voted.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Card className={`bg-[#0d1117] border-[#30363d] ${className}`}>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#00ffe1] border-t-transparent mx-auto"></div>
          <p className="text-[#8b949e] mt-2">Loading leaderboard...</p>
        </CardContent>
      </Card>
    );
  }

  if (!currentContestId) {
    return (
      <Card className={`bg-[#0d1117] border-[#30363d] ${className}`}>
        <CardContent className="p-6 text-center">
          <Trophy className="h-12 w-12 text-[#8b949e] mx-auto mb-4" />
          <p className="text-[#8b949e]">No active remix contest</p>
        </CardContent>
      </Card>
    );
  }

  const entries = leaderboard?.entries || [];

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="h-4 w-4 text-yellow-400" />;
      case 1: return <Trophy className="h-4 w-4 text-gray-400" />;
      case 2: return <Trophy className="h-4 w-4 text-orange-400" />;
      default: return <span className="text-[#8b949e] text-sm">#{index + 1}</span>;
    }
  };

  const getRankBadgeColor = (index: number) => {
    switch (index) {
      case 0: return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      case 1: return "bg-gradient-to-r from-gray-400 to-gray-600";
      case 2: return "bg-gradient-to-r from-orange-400 to-orange-600";
      default: return "bg-[#30363d]";
    }
  };

  return (
    <Card className={`bg-gradient-to-br from-[#0d1117] to-[#161b22] border-[#30363d] shadow-2xl backdrop-blur-sm ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[#00ffe1] flex items-center gap-3 text-xl">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#ff00d4] to-[#7c3aed] flex items-center justify-center">
              <Flame className="h-4 w-4 text-black" />
            </div>
            Contest Leaderboard
          </CardTitle>
          <Badge className="bg-gradient-to-r from-[#ff00d4] to-[#7c3aed] text-white px-3 py-1">
            <Users className="h-3 w-3 mr-1" />
            {entries.length} Entries
          </Badge>
        </div>
        <p className="text-[#8b949e] text-sm mt-2">
          Vote for your favorite remixes and help creators win GTT rewards
        </p>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 text-[#8b949e] mx-auto mb-4" />
            <p className="text-[#8b949e]">No entries yet. Be the first to submit a remix!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry: any, index: number) => (
              <div
                key={entry.remix_id}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] ${
                  index < 3 
                    ? 'bg-gradient-to-r from-[#161b22] via-[#1a1f36] to-[#161b22] border-[#00ffe1]/30 shadow-lg shadow-[#00ffe1]/10' 
                    : 'bg-[#161b22] border-[#30363d] hover:border-[#00ffe1]/20 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getRankBadgeColor(index)}`}>
                    {getRankIcon(index)}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#0d1117] rounded border border-[#30363d] flex items-center justify-center">
                      <span className="text-xs">🎨</span>
                    </div>
                    <div>
                      <p className="text-[#f0f6fc] font-medium">{entry.username}</p>
                      <p className="text-xs text-[#8b949e]">{entry.remix_style} style</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[#00ffe1] font-bold flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {entry.votes}
                    </div>
                    <p className="text-xs text-[#8b949e]">votes</p>
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={() => voteMutation.mutate(entry.remix_id)}
                    disabled={voteMutation.isPending || votedRemixes.has(entry.remix_id)}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90"
                    data-testid={`vote-button-${entry.remix_id}`}
                  >
                    {votedRemixes.has(entry.remix_id) ? (
                      "Voted"
                    ) : voteMutation.isPending ? (
                      <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
                    ) : (
                      <>
                        <Heart className="h-3 w-3 mr-1" />
                        Vote
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {entries.length > 0 && (
          <div className="mt-6 p-4 bg-[#161b22] rounded-lg border border-[#30363d]">
            <div className="text-center text-sm text-[#8b949e]">
              <p>🏆 Top 3 winners receive GTT rewards and exclusive NFT badges</p>
              <p className="text-xs mt-1">Contest ends in 3 days • Vote for your favorites!</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}