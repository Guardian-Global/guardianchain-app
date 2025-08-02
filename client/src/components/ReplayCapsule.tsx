import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Play, Pause, RotateCcw, Coins, Heart, Loader2, Zap } from "lucide-react";

interface ReplayCapsuleProps {
  capsuleId: string;
}

interface ReplayState {
  isPlaying: boolean;
  progress: number;
  emotionalIntensity: number;
  yieldEarned: number;
  stage: 'ready' | 'playing' | 'processing' | 'complete';
}

export default function ReplayCapsule({ capsuleId }: ReplayCapsuleProps) {
  const [replayState, setReplayState] = useState<ReplayState>({
    isPlaying: false,
    progress: 0,
    emotionalIntensity: 0,
    yieldEarned: 0,
    stage: 'ready'
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Replay mutation
  const replayMutation = useMutation({
    mutationFn: async ({ capsuleId, emotionalResponse }: {
      capsuleId: string;
      emotionalResponse: number;
    }) => {
      return apiRequest("POST", "/api/capsules/replay", {
        capsuleId,
        emotionalResponse,
        timestamp: new Date().toISOString()
      });
    },
    onSuccess: (data) => {
      setReplayState(prev => ({
        ...prev,
        stage: 'complete',
        yieldEarned: data.yieldAmount || 0
      }));
      
      queryClient.invalidateQueries({ queryKey: ["/api/capsules", capsuleId] });
      
      toast({
        title: "Capsule Replay Complete",
        description: `You earned ${data.yieldAmount || 0} GTT tokens!`,
      });
    },
    onError: (error: any) => {
      console.error("❌ Replay failed:", error);
      setReplayState(prev => ({ ...prev, stage: 'ready', isPlaying: false }));
      
      toast({
        title: "Replay Failed",
        description: error.message || "Failed to process capsule replay",
        variant: "destructive",
      });
    },
  });

  const startReplay = () => {
    setReplayState(prev => ({
      ...prev,
      isPlaying: true,
      stage: 'playing',
      progress: 0,
      emotionalIntensity: 0
    }));

    // Simulate replay experience with increasing emotional intensity
    let progress = 0;
    let emotionalIntensity = 0;
    
    const interval = setInterval(() => {
      progress += 2;
      emotionalIntensity = Math.min(100, emotionalIntensity + Math.random() * 15);
      
      setReplayState(prev => ({
        ...prev,
        progress,
        emotionalIntensity: Math.round(emotionalIntensity)
      }));

      if (progress >= 100) {
        clearInterval(interval);
        setReplayState(prev => ({
          ...prev,
          stage: 'processing',
          isPlaying: false
        }));
        
        // Process the replay
        setTimeout(() => {
          const finalEmotionalResponse = Math.round(emotionalIntensity);
          replayMutation.mutate({
            capsuleId,
            emotionalResponse: finalEmotionalResponse
          });
        }, 1500);
      }
    }, 150);
  };

  const pauseReplay = () => {
    setReplayState(prev => ({
      ...prev,
      isPlaying: false
    }));
  };

  const resetReplay = () => {
    setReplayState({
      isPlaying: false,
      progress: 0,
      emotionalIntensity: 0,
      yieldEarned: 0,
      stage: 'ready'
    });
  };

  const getEmotionalIntensityColor = (intensity: number) => {
    if (intensity >= 80) return "text-red-600";
    if (intensity >= 60) return "text-orange-600";
    if (intensity >= 40) return "text-yellow-600";
    if (intensity >= 20) return "text-blue-600";
    return "text-gray-600";
  };

  const getStageDescription = () => {
    switch (replayState.stage) {
      case 'ready':
        return 'Ready to experience this capsule and earn GTT yield';
      case 'playing':
        return 'Experiencing capsule content and measuring emotional resonance...';
      case 'processing':
        return 'Processing emotional response and calculating GTT yield...';
      case 'complete':
        return `Replay complete! You earned ${replayState.yieldEarned} GTT tokens.`;
      default:
        return '';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          Capsule Replay Experience
        </CardTitle>
        <CardDescription>
          {getStageDescription()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        {replayState.stage !== 'ready' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{replayState.progress}%</span>
            </div>
            <Progress value={replayState.progress} className="w-full" />
          </div>
        )}

        {/* Emotional Intensity Meter */}
        {replayState.stage === 'playing' && replayState.emotionalIntensity > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span>Emotional Resonance</span>
              </div>
              <span className={getEmotionalIntensityColor(replayState.emotionalIntensity)}>
                {replayState.emotionalIntensity}%
              </span>
            </div>
            <Progress 
              value={replayState.emotionalIntensity} 
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Higher emotional resonance increases GTT yield potential
            </p>
          </div>
        )}

        {/* Yield Display */}
        {replayState.stage === 'complete' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">GTT Earned</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-lg font-bold text-green-700">
                  {replayState.yieldEarned} GTT
                </span>
              </div>
            </div>
            <p className="text-sm text-green-600 mt-2">
              Yield calculation based on grief tier and emotional resonance
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-3">
          {replayState.stage === 'ready' && (
            <Button
              onClick={startReplay}
              className="flex-1"
              disabled={replayMutation.isPending}
            >
              <Play className="mr-2 h-4 w-4" />
              Start Replay Experience
            </Button>
          )}

          {replayState.stage === 'playing' && (
            <>
              {replayState.isPlaying ? (
                <Button onClick={pauseReplay} variant="outline">
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </Button>
              ) : (
                <Button onClick={startReplay} variant="outline">
                  <Play className="mr-2 h-4 w-4" />
                  Resume
                </Button>
              )}
              <Button onClick={resetReplay} variant="outline">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </>
          )}

          {replayState.stage === 'processing' && (
            <Button disabled className="flex-1">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing Replay...
            </Button>
          )}

          {replayState.stage === 'complete' && (
            <Button onClick={resetReplay} className="flex-1">
              <RotateCcw className="mr-2 h-4 w-4" />
              Replay Again
            </Button>
          )}
        </div>

        {/* Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Capsule replay simulates the emotional experience of the preserved memory</p>
          <p>• GTT yield is calculated based on grief tier and emotional resonance</p>
          <p>• Each replay contributes to the capsule's verification and truth score</p>
        </div>
      </CardContent>
    </Card>
  );
}