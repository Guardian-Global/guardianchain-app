import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette, Sparkles, Trophy, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface CapsuleRemixerProps {
  capsuleId: string;
  className?: string;
}

const remixStyles = [
  { value: 'cyberpunk', label: 'Cyberpunk', emoji: '🌆' },
  { value: 'oil-painting', label: 'Oil Painting', emoji: '🎨' },
  { value: 'vaporwave', label: 'Vaporwave', emoji: '🌸' },
  { value: 'minimalist', label: 'Minimalist', emoji: '⚪' },
  { value: 'neon', label: 'Neon', emoji: '✨' },
  { value: 'vintage', label: 'Vintage', emoji: '📷' },
];

export default function CapsuleRemixer({ capsuleId, className }: CapsuleRemixerProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const queryClient = useQueryClient();

  // Get remix history
  const { data: remixHistory } = useQuery({
    queryKey: [`/api/capsule/remix-history/${capsuleId}`],
    enabled: !!capsuleId,
  });

  // Get active contest
  const { data: activeContest } = useQuery({
    queryKey: ['/api/remix/contest/active'],
  });

  const remixMutation = useMutation({
    mutationFn: async (style: string) => {
      const response = await fetch('/api/capsule/remix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          capsuleId,
          style,
          userId: user?.id || 'dev-user-123',
        }),
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Remix Created",
        description: `Your ${selectedStyle} remix has been generated!`,
      });
      queryClient.invalidateQueries({ queryKey: [`/api/capsule/remix-history/${capsuleId}`] });
      setSelectedStyle('');
    },
    onError: (error) => {
      toast({
        title: "Remix Failed",
        description: "Failed to create remix. Please try again.",
        variant: "destructive",
      });
    },
  });

  const submitToContestMutation = useMutation({
    mutationFn: async (remixId: string) => {
      const response = await fetch('/api/remix/contest/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          remixId,
          contestId: activeContest?.contest?.id,
          userId: user?.id || 'dev-user-123',
        }),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Submitted to Contest",
        description: "Your remix has been entered in the current contest!",
      });
    },
  });

  const handleRemix = () => {
    if (!selectedStyle) {
      toast({
        title: "Style Required",
        description: "Please select a remix style.",
        variant: "destructive",
      });
      return;
    }
    remixMutation.mutate(selectedStyle);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card className="bg-[#0d1117] border-[#30363d]">
        <CardHeader>
          <CardTitle className="text-[#00ffe1] flex items-center gap-2">
            <Palette className="h-5 w-5" />
            AI Capsule Remixer
            {activeContest?.contest && (
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-500 text-white ml-2">
                <Trophy className="h-3 w-3 mr-1" />
                Contest Active
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-[#8b949e]">Choose Remix Style</label>
            <Select value={selectedStyle} onValueChange={setSelectedStyle}>
              <SelectTrigger className="bg-[#161b22] border-[#30363d] text-[#f0f6fc]" data-testid="style-selector">
                <SelectValue placeholder="Select a style..." />
              </SelectTrigger>
              <SelectContent className="bg-[#161b22] border-[#30363d]">
                {remixStyles.map((style) => (
                  <SelectItem key={style.value} value={style.value} className="text-[#f0f6fc] focus:bg-[#0d1117]">
                    <span className="flex items-center gap-2">
                      <span>{style.emoji}</span>
                      <span>{style.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleRemix}
            disabled={remixMutation.isPending || !selectedStyle}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:opacity-90"
            data-testid="create-remix-button"
          >
            {remixMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Creating Remix...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Create AI Remix
              </>
            )}
          </Button>

          {activeContest?.contest && (
            <div className="p-3 bg-[#161b22] rounded-lg border border-[#30363d]">
              <div className="flex items-center gap-2 text-sm">
                <Trophy className="h-4 w-4 text-[#ff00d4]" />
                <span className="text-[#f0f6fc] font-medium">{activeContest.contest.name}</span>
              </div>
              <p className="text-xs text-[#8b949e] mt-1">
                Submit your remix to earn GTT and win exclusive NFT rewards!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Remix History */}
      {remixHistory?.remixes && remixHistory.remixes.length > 0 && (
        <Card className="bg-[#0d1117] border-[#30363d]">
          <CardHeader>
            <CardTitle className="text-[#00ffe1] flex items-center gap-2">
              <Users className="h-5 w-5" />
              Remix Gallery ({remixHistory.remixes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {remixHistory.remixes.map((remix: any) => (
                <div key={remix.id} className="relative group">
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-3 border border-[#30363d]">
                    <div className="aspect-square bg-[#161b22] rounded mb-2 flex items-center justify-center">
                      <Palette className="h-8 w-8 text-[#8b949e]" />
                    </div>
                    <div className="text-xs">
                      <p className="text-[#00ffe1] font-medium">🎨 {remix.remix_style}</p>
                      <p className="text-[#8b949e]">by {remix.username}</p>
                    </div>
                    {activeContest?.contest && (
                      <Button
                        size="sm"
                        onClick={() => submitToContestMutation.mutate(remix.id)}
                        disabled={submitToContestMutation.isPending}
                        className="w-full mt-2 bg-rose-600 text-white hover:bg-rose-700 text-xs"
                        data-testid={`submit-contest-${remix.id}`}
                      >
                        🚀 Submit to Contest
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}