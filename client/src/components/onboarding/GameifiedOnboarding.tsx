import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Gift, 
  CheckCircle, 
  ArrowRight, 
  Sparkles,
  Coins,
  Crown,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTierContext } from "@/context/TierContext";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  reward: number;
  action: string;
  href?: string;
  completed: boolean;
  difficulty: "easy" | "medium" | "hard";
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  points: number;
  unlocked: boolean;
}

export default function GameifiedOnboarding() {
  const { userRole } = useTierContext();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const onboardingSteps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Welcome to GUARDIANCHAIN",
      description: "Complete your profile setup and earn your first 10 GTT tokens",
      icon: Shield,
      reward: 10,
      action: "Complete Profile",
      href: "/profile",
      completed: false,
      difficulty: "easy"
    },
    {
      id: "create-capsule",
      title: "Create Your First Truth Capsule",
      description: "Share your first piece of verified content and earn 25 GTT",
      icon: Target,
      reward: 25,
      action: "Create Capsule",
      href: "/create-capsule",
      completed: false,
      difficulty: "medium"
    },
    {
      id: "verify-content",
      title: "Verify Community Content",
      description: "Help verify 3 truth capsules and earn 15 GTT per verification",
      icon: CheckCircle,
      reward: 45,
      action: "Start Verifying",
      href: "/explorer",
      completed: false,
      difficulty: "medium"
    },
    {
      id: "connect-wallet",
      title: "Connect Your Crypto Wallet",
      description: "Link your wallet to enable GTT token transactions and earn 20 GTT",
      icon: Coins,
      reward: 20,
      action: "Connect Wallet",
      href: "/wallet",
      completed: false,
      difficulty: "easy"
    },
    {
      id: "invite-friends",
      title: "Invite 2 Friends",
      description: "Share GUARDIANCHAIN with friends and earn 50 GTT per referral",
      icon: Gift,
      reward: 100,
      action: "Share Referral",
      href: "/referrals",
      completed: false,
      difficulty: "hard"
    },
    {
      id: "upgrade-pro",
      title: "Unlock Pro Features",
      description: "Upgrade to Pro and unlock premium analytics plus 100 bonus GTT",
      icon: Crown,
      reward: 100,
      action: "Upgrade to Pro",
      href: "/upgrade",
      completed: false,
      difficulty: "hard"
    }
  ];

  const achievements: Achievement[] = [
    {
      id: "first-steps",
      name: "First Steps",
      description: "Complete your first onboarding step",
      icon: Star,
      points: 10,
      unlocked: completedSteps.length >= 1
    },
    {
      id: "content-creator",
      name: "Content Creator",
      description: "Create your first truth capsule",
      icon: Target,
      points: 25,
      unlocked: completedSteps.includes("create-capsule")
    },
    {
      id: "truth-guardian",
      name: "Truth Guardian",
      description: "Verify 3 community submissions",
      icon: Shield,
      points: 50,
      unlocked: completedSteps.includes("verify-content")
    },
    {
      id: "network-builder",
      name: "Network Builder",
      description: "Invite 2 friends successfully",
      icon: Gift,
      points: 100,
      unlocked: completedSteps.includes("invite-friends")
    },
    {
      id: "pro-member",
      name: "Pro Member",
      description: "Upgrade to Pro membership",
      icon: Crown,
      points: 150,
      unlocked: completedSteps.includes("upgrade-pro")
    }
  ];

  const completeStep = (stepId: string, reward: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps(prev => [...prev, stepId]);
      setTotalPoints(prev => prev + reward);
      setShowCelebration(true);
      
      toast({
        title: "🎉 Step Completed!",
        description: `You earned ${reward} GTT tokens!`,
      });

      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  const getProgressPercentage = () => {
    return (completedSteps.length / onboardingSteps.length) * 100;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-400 border-green-400";
      case "medium": return "text-yellow-400 border-yellow-400";
      case "hard": return "text-red-400 border-red-400";
      default: return "text-slate-400 border-slate-400";
    }
  };

  const getPointsMultiplier = () => {
    if (userRole === "pro" || userRole === "enterprise") return 2;
    if (userRole === "explorer") return 1.5;
    return 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto pt-20 space-y-6">
        {/* Header with Progress */}
        <Card className="bg-slate-800/50 border-slate-700 relative overflow-hidden">
          {showCelebration && (
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 animate-pulse" />
          )}
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="w-12 h-12 text-yellow-400" />
              <div>
                <CardTitle className="text-3xl text-white">Welcome to GUARDIANCHAIN</CardTitle>
                <CardDescription className="text-slate-300">
                  Complete your onboarding journey and earn GTT tokens
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{totalPoints * getPointsMultiplier()}</div>
                <div className="text-sm text-slate-400">GTT Earned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{completedSteps.length}/{onboardingSteps.length}</div>
                <div className="text-sm text-slate-400">Steps Complete</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{achievements.filter(a => a.unlocked).length}</div>
                <div className="text-sm text-slate-400">Achievements</div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-300">Overall Progress</span>
                <span className="text-white">{Math.round(getProgressPercentage())}%</span>
              </div>
              <Progress value={getProgressPercentage()} className="h-3" />
            </div>

            {userRole === "pro" || userRole === "enterprise" ? (
              <Badge className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600">
                <Crown className="w-3 h-3 mr-1" />
                Pro Member - 2x GTT Multiplier Active
              </Badge>
            ) : null}
          </CardHeader>
        </Card>

        {/* Onboarding Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {onboardingSteps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const Icon = step.icon;
            
            return (
              <Card 
                key={step.id} 
                className={`bg-slate-800/50 border-slate-700 transition-all duration-300 hover:border-purple-500/50 ${
                  isCompleted ? "border-green-500/50 bg-green-500/5" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${isCompleted ? "bg-green-500/20" : "bg-purple-500/20"}`}>
                        <Icon className={`w-6 h-6 ${isCompleted ? "text-green-400" : "text-purple-400"}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-white flex items-center gap-2">
                          {step.title}
                          {isCompleted && <CheckCircle className="w-5 h-5 text-green-400" />}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={getDifficultyColor(step.difficulty)}>
                            {step.difficulty.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                            <Coins className="w-3 h-3 mr-1" />
                            {step.reward * getPointsMultiplier()} GTT
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 mb-4">{step.description}</p>
                  
                  {!isCompleted ? (
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        onClick={() => {
                          if (step.href) {
                            window.location.href = step.href;
                          } else {
                            completeStep(step.id, step.reward);
                          }
                        }}
                      >
                        {step.action}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      <Button 
                        variant="outline"
                        size="icon"
                        onClick={() => completeStep(step.id, step.reward)}
                        title="Mark as completed"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">Completed!</span>
                      <Badge variant="outline" className="text-green-400 border-green-400 ml-auto">
                        +{step.reward * getPointsMultiplier()} GTT
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Achievements */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              Achievements
            </CardTitle>
            <CardDescription className="text-slate-300">
              Unlock special rewards as you progress through GUARDIANCHAIN
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                
                return (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border transition-all duration-300 ${
                      achievement.unlocked
                        ? "border-yellow-500/50 bg-yellow-500/5"
                        : "border-slate-700 bg-slate-800/30"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded ${achievement.unlocked ? "bg-yellow-500/20" : "bg-slate-700"}`}>
                        <Icon className={`w-5 h-5 ${achievement.unlocked ? "text-yellow-400" : "text-slate-500"}`} />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${achievement.unlocked ? "text-white" : "text-slate-400"}`}>
                          {achievement.name}
                        </h3>
                        <Badge 
                          variant="outline" 
                          className={achievement.unlocked ? "text-yellow-400 border-yellow-400" : "text-slate-500 border-slate-600"}
                        >
                          {achievement.points} pts
                        </Badge>
                      </div>
                    </div>
                    <p className={`text-sm ${achievement.unlocked ? "text-slate-300" : "text-slate-500"}`}>
                      {achievement.description}
                    </p>
                    
                    {achievement.unlocked && (
                      <div className="flex items-center gap-1 mt-2 text-yellow-400">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-medium">Unlocked!</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Completion Bonus */}
        {completedSteps.length === onboardingSteps.length && (
          <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/50">
            <CardHeader className="text-center">
              <Trophy className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
              <CardTitle className="text-2xl text-white">🎉 Onboarding Complete!</CardTitle>
              <CardDescription className="text-slate-300">
                You've mastered the basics of GUARDIANCHAIN. Here's your completion bonus!
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-lg px-4 py-2">
                <Crown className="w-5 h-5 mr-2" />
                +500 Bonus GTT Tokens
              </Badge>
              <p className="text-slate-300">
                You're now ready to explore the full power of decentralized truth verification!
              </p>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <a href="/dashboard">Go to Dashboard</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}