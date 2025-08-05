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
    <div className={`space-y-8 ${className}`}>
      <Card className="glass-card neon-glow-cyan card-hover">
        <CardHeader className="pb-6">
          <CardTitle className="text-[#00ffe1] flex items-center gap-4 text-2xl font-quantum">
            <div className="w-12 h-12 rounded-full animated-gradient flex items-center justify-center pulse-neon">
              <Palette className="h-6 w-6 text-black" />
            </div>
            AI Capsule Remixer
            {activeContest?.contest && (
              <Badge className="enhanced-badge ml-4 px-4 py-2 text-base">
                <Trophy className="h-4 w-4 mr-2" />
                Contest Live
              </Badge>
            )}
          </CardTitle>
          <p className="text-[#e6edf3] text-lg mt-4 font-web3">
            Transform your capsules with AI-powered artistic styles and compete for GTT rewards
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <label className="text-lg font-quantum text-[#00ffe1]">Choose Remix Style</label>
            <Select value={selectedStyle} onValueChange={setSelectedStyle}>
              <SelectTrigger className="glass-card neon-glow-purple text-[#f0f6fc] h-16 hover:neon-glow-cyan transition-all focus-glow font-web3 text-lg" data-testid="style-selector">
                <SelectValue placeholder="🎨 Select an artistic style..." />
              </SelectTrigger>
              <SelectContent className="glass-card neon-glow-magenta shadow-2xl">
                {remixStyles.map((style) => (
                  <SelectItem key={style.value} value={style.value} className="text-[#f0f6fc] focus:glass-card hover:neon-glow-cyan py-4 text-lg font-web3">
                    <span className="flex items-center gap-4">
                      <span className="text-2xl">{style.emoji}</span>
                      <span className="font-quantum">{style.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleRemix}
            disabled={remixMutation.isPending || !selectedStyle}
            className="enhanced-button w-full h-16 animated-gradient text-black hover:scale-110 transition-all duration-500 shadow-2xl hover:shadow-cyan-500/50 disabled:opacity-50 disabled:hover:scale-100 neon-glow-cyan font-quantum text-xl"
            data-testid="create-remix-button"
          >
            {remixMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-3 border-black border-t-transparent mr-4"></div>
                <span className="font-display">Creating Remix...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-6 w-6 mr-4" />
                <span className="font-display">Create AI Remix</span>
              </>
            )}
          </Button>

          {activeContest?.contest && (
            <div className="glass-card neon-glow-magenta p-6 rounded-2xl card-hover">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full animated-gradient flex items-center justify-center pulse-neon">
                  <Trophy className="h-5 w-5 text-black" />
                </div>
                <span className="text-[#f0f6fc] font-quantum text-xl">{activeContest.contest.name}</span>
                <Badge className="enhanced-badge text-base px-4 py-2 pulse-slow">LIVE</Badge>
              </div>
              <p className="text-lg text-[#e6edf3] leading-relaxed font-web3">
                Submit your remix to earn GTT tokens and win exclusive NFT rewards! 🏆✨
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Remix History */}
      {remixHistory?.remixes && remixHistory.remixes.length > 0 && (
        <Card className="bg-gradient-to-br from-[#0d1117] to-[#161b22] border-[#30363d] shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-[#00ffe1] flex items-center gap-3 text-xl">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#ff00d4] flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              Remix Gallery
              <Badge className="bg-[#30363d] text-[#f0f6fc] px-2 py-1">
                {remixHistory.remixes.length} Remixes
              </Badge>
            </CardTitle>
            <p className="text-[#8b949e] text-sm mt-2">
              Community creations in various artistic styles
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {remixHistory.remixes.map((remix: any) => (
                <div key={remix.id} className="group">
                  <div className="bg-gradient-to-br from-[#161b22] to-[#1a1f36] rounded-xl p-4 border border-[#30363d] transition-all duration-300 hover:border-[#00ffe1]/50 hover:shadow-lg hover:shadow-[#00ffe1]/10 hover:scale-105">
                    <div className="aspect-square bg-[#0d1117] rounded-lg mb-3 flex items-center justify-center border border-[#30363d] group-hover:border-[#00ffe1]/30 transition-colors">
                      <Palette className="h-10 w-10 text-[#8b949e] group-hover:text-[#00ffe1] transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[#00ffe1] font-semibold flex items-center gap-2">
                        <span className="text-base">🎨</span>
                        <span className="capitalize">{remix.remix_style}</span>
                      </p>
                      <p className="text-[#8b949e] text-sm">by {remix.username}</p>
                    </div>
                    {activeContest?.contest && (
                      <Button
                        size="sm"
                        onClick={() => submitToContestMutation.mutate(remix.id)}
                        disabled={submitToContestMutation.isPending}
                        className="w-full mt-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:from-rose-500 hover:to-pink-500 transition-all duration-300 text-sm font-medium"
                        data-testid={`submit-contest-${remix.id}`}
                      >
                        {submitToContestMutation.isPending ? (
                          <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent mr-2"></div>
                        ) : (
                          <>🚀 Submit to Contest</>
                        )}
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