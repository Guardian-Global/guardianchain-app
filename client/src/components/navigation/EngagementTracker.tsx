import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Star,
  Target,
  Trophy,
  Zap,
  Calendar,
  Award,
  TrendingUp,
  Gift,
  Crown,
  Heart,
} from "lucide-react";

interface EngagementMetrics {
  sessionTime: number;
  pagesVisited: string[];
  actionsCompleted: string[];
  streakDays: number;
  totalSessions: number;
  lastActive: string;
  engagementScore: number;
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  reward: string;
}

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  reward: string;
  expires: string;
}

export default function EngagementTracker() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<EngagementMetrics | null>(null);
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([]);
  const [sessionStartTime] = useState(Date.now());
  const [isVisible, setIsVisible] = useState(false);

  // Track page visits and session time
  useEffect(() => {
    if (!isAuthenticated) return;

    const trackSession = async () => {
      try {
        const response = await apiRequest(
          "POST",
          "/api/engagement/track-session",
          {
            sessionId: `session_${sessionStartTime}`,
            startTime: sessionStartTime,
            userAgent: navigator.userAgent,
            path: window.location.pathname,
          },
        );
        const data = await response.json();
        setMetrics(data.metrics);
      } catch (error) {
        console.error("Failed to track session:", error);
      }
    };

    trackSession();

    // Track every 30 seconds
    const interval = setInterval(trackSession, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, sessionStartTime]);

  // Load daily challenges
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadChallenges = async () => {
      try {
        const response = await apiRequest(
          "GET",
          "/api/engagement/daily-challenges",
        );
        const data = await response.json();
        setDailyChallenges(data.challenges);
      } catch (error) {
        console.error("Failed to load challenges:", error);
      }
    };

    loadChallenges();
  }, [isAuthenticated]);

  // Show engagement popup for milestones
  const checkMilestones = useCallback(
    (newMetrics: EngagementMetrics) => {
      if (!metrics) return;

      // Session time milestones
      const sessionMinutes = (Date.now() - sessionStartTime) / 60000;
      if (sessionMinutes >= 10 && metrics.sessionTime < 600) {
        toast({
          title: "Engagement Milestone! 🎉",
          description:
            "10 minutes of exploring GuardianChain! Earn 5 bonus GTT.",
        });
      }

      // Page visit milestones
      if (
        newMetrics.pagesVisited.length >= 5 &&
        metrics.pagesVisited.length < 5
      ) {
        toast({
          title: "Explorer Achievement! 🗺️",
          description:
            "You've visited 5 different pages. Discovery bonus: 10 GTT!",
        });
      }

      // Streak milestones
      if (newMetrics.streakDays > metrics.streakDays) {
        toast({
          title: `${newMetrics.streakDays} Day Streak! 🔥`,
          description: `Keep coming back! Streak bonus: ${newMetrics.streakDays * 2} GTT`,
        });
      }
    },
    [metrics, sessionStartTime, toast],
  );

  const completeChallenge = async (challengeId: string) => {
    try {
      const response = await apiRequest(
        "POST",
        `/api/engagement/complete-challenge/${challengeId}`,
      );
      const data = await response.json();

      toast({
        title: "Challenge Complete! 🏆",
        description: `You earned ${data.reward}!`,
      });

      // Refresh challenges
      const challengeResponse = await apiRequest(
        "GET",
        "/api/engagement/daily-challenges",
      );
      const challengeData = await challengeResponse.json();
      setDailyChallenges(challengeData.challenges);
    } catch (error) {
      console.error("Failed to complete challenge:", error);
    }
  };

  if (!isAuthenticated || !metrics) return null;

  const sessionMinutes = Math.floor((Date.now() - sessionStartTime) / 60000);
  const engagementLevel =
    metrics.engagementScore >= 80
      ? "Expert"
      : metrics.engagementScore >= 60
        ? "Advanced"
        : metrics.engagementScore >= 40
          ? "Intermediate"
          : "Beginner";

  return (
    <>
      {/* Floating engagement indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(!isVisible)}
          className="rounded-full w-12 h-12 bg-gradient-to-r from-brand-primary to-brand-accent shadow-lg"
        >
          <TrendingUp className="h-5 w-5" />
        </Button>
      </div>

      {/* Engagement panel */}
      {isVisible && (
        <Card className="fixed bottom-16 right-4 w-80 z-40 bg-slate-800/95 border-brand-primary/20 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-brand-primary" />
              Engagement Dashboard
              <Badge className="ml-auto bg-brand-accent/20 text-brand-accent">
                {engagementLevel}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Session stats */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-700/50 p-2 rounded">
                <div className="text-brand-primary font-medium">
                  {sessionMinutes}m
                </div>
                <div className="text-slate-400">This Session</div>
              </div>
              <div className="bg-slate-700/50 p-2 rounded">
                <div className="text-brand-accent font-medium">
                  {metrics.streakDays}
                </div>
                <div className="text-slate-400">Day Streak</div>
              </div>
            </div>

            {/* Daily challenges */}
            <div>
              <h4 className="text-white text-xs font-medium mb-2 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Daily Challenges
              </h4>
              <div className="space-y-2">
                {dailyChallenges.slice(0, 2).map((challenge) => (
                  <div
                    key={challenge.id}
                    className="bg-slate-700/30 p-2 rounded"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white text-xs">
                        {challenge.title}
                      </span>
                      <Badge className="text-xs bg-brand-green/20 text-brand-green">
                        {challenge.reward}
                      </Badge>
                    </div>
                    <Progress
                      value={(challenge.progress / challenge.maxProgress) * 100}
                      className="h-1"
                    />
                    {challenge.progress >= challenge.maxProgress && (
                      <Button
                        size="sm"
                        onClick={() => completeChallenge(challenge.id)}
                        className="w-full mt-1 h-6 text-xs bg-brand-green hover:bg-brand-green/90"
                      >
                        Claim Reward
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick achievements */}
            <div>
              <h4 className="text-white text-xs font-medium mb-2 flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                Recent Achievements
              </h4>
              <div className="flex gap-1">
                {metrics.achievements.slice(-3).map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`w-8 h-8 rounded flex items-center justify-center text-xs ${
                      achievement.unlocked
                        ? "bg-brand-accent/20 text-brand-accent"
                        : "bg-slate-700/50 text-slate-500"
                    }`}
                    title={achievement.title}
                  >
                    {achievement.icon === "star" && (
                      <Star className="h-3 w-3" />
                    )}
                    {achievement.icon === "crown" && (
                      <Crown className="h-3 w-3" />
                    )}
                    {achievement.icon === "heart" && (
                      <Heart className="h-3 w-3" />
                    )}
                    {achievement.icon === "zap" && <Zap className="h-3 w-3" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement score */}
            <div className="bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 p-2 rounded">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white text-xs">Engagement Score</span>
                <span className="text-brand-primary font-medium text-xs">
                  {metrics.engagementScore}/100
                </span>
              </div>
              <Progress value={metrics.engagementScore} className="h-1" />
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
