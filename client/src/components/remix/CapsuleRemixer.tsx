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
      <Card className="bg-gradient-to-br from-[#0d1117] to-[#161b22] border-[#30363d] shadow-2xl backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-[#00ffe1] flex items-center gap-3 text-xl">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00ffe1] to-[#ff00d4] flex items-center justify-center">
              <Palette className="h-4 w-4 text-black" />
            </div>
            AI Capsule Remixer
            {activeContest?.contest && (
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-500 text-white ml-2 animate-pulse">
                <Trophy className="h-3 w-3 mr-1" />
                Contest Live
              </Badge>
            )}
          </CardTitle>
          <p className="text-[#8b949e] text-sm mt-2">
            Transform your capsules with AI-powered artistic styles
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-[#f0f6fc]">Choose Remix Style</label>
            <Select value={selectedStyle} onValueChange={setSelectedStyle}>
              <SelectTrigger className="bg-[#161b22] border-[#30363d] text-[#f0f6fc] h-12 hover:border-[#00ffe1]/50 transition-colors" data-testid="style-selector">
                <SelectValue placeholder="🎨 Select an artistic style..." />
              </SelectTrigger>
              <SelectContent className="bg-[#161b22] border-[#30363d] shadow-2xl">
                {remixStyles.map((style) => (
                  <SelectItem key={style.value} value={style.value} className="text-[#f0f6fc] focus:bg-[#0d1117] hover:bg-[#30363d]/50 py-3">
                    <span className="flex items-center gap-3">
                      <span className="text-lg">{style.emoji}</span>
                      <span className="font-medium">{style.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleRemix}
            disabled={remixMutation.isPending || !selectedStyle}
            className="w-full h-12 bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
            data-testid="create-remix-button"
          >
            {remixMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                <span className="font-medium">Creating Remix...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-3" />
                <span className="font-medium">Create AI Remix</span>
              </>
            )}
          </Button>

          {activeContest?.contest && (
            <div className="p-4 bg-gradient-to-r from-[#161b22] to-[#1a1f36] rounded-xl border border-[#30363d] shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#ff00d4] to-[#7c3aed] flex items-center justify-center">
                  <Trophy className="h-3 w-3 text-white" />
                </div>
                <span className="text-[#f0f6fc] font-semibold">{activeContest.contest.name}</span>
                <Badge className="bg-[#ff00d4] text-white text-xs animate-pulse">LIVE</Badge>
              </div>
              <p className="text-sm text-[#8b949e] leading-relaxed">
                Submit your remix to earn GTT tokens and win exclusive NFT rewards! 🏆
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