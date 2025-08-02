import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, 
  Target, 
  Zap, 
  Gift, 
  Star,
  ArrowRight,
  X,
  Trophy
} from "lucide-react";
import { useOnboarding } from "./OnboardingProvider";
import { useTierContext } from "@/context/TierContext";

export default function OnboardingTrigger() {
  const { userRole } = useTierContext();
  const { 
    showOnboarding, 
    startOnboarding, 
    isOnboardingCompleted, 
    onboardingProgress 
  } = useOnboarding();
  const [showWelcomeCard, setShowWelcomeCard] = useState(false);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);

  // Show welcome card for new users
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const hasSeenCard = localStorage.getItem('onboarding-welcome-seen');
    if (!hasSeenCard && !isOnboardingCompleted && userRole === "guest") {
      setShowWelcomeCard(true);
      setHasSeenWelcome(false);
    } else {
      setHasSeenWelcome(true);
    }
  }, [isAuthenticated, isOnboardingCompleted, userRole]);

  const handleStartOnboarding = () => {
    setShowWelcomeCard(false);
    localStorage.setItem('onboarding-welcome-seen', 'true');
    startOnboarding();
  };

  const handleDismissWelcome = () => {
    setShowWelcomeCard(false);
    localStorage.setItem('onboarding-welcome-seen', 'true');
    setHasSeenWelcome(true);
  };

  // Don't show anything if user is not authenticated or already completed onboarding
  if (!isAuthenticated || isOnboardingCompleted) {
    return null;
  }

  return (
    <>
      {/* Welcome Card Overlay */}
      {showWelcomeCard && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-slate-800 border-slate-600 max-w-lg shadow-2xl animate-in slide-in-from-bottom-4">
            <CardHeader className="text-center relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 text-slate-400 hover:text-white"
                onClick={handleDismissWelcome}
              >
                <X className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full">
                  <Rocket className="w-12 h-12 text-purple-400" />
                </div>
              </div>
              
              <CardTitle className="text-2xl text-white mb-2">
                Welcome to GUARDIANCHAIN! 🎉
              </CardTitle>
              <CardDescription className="text-slate-300">
                You're about to join the future of truth verification. Let's get you started with a personalized tour!
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Onboarding Benefits */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 p-3 bg-slate-700/30 rounded-lg">
                  <Target className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-sm font-medium text-white">Quick Tour</div>
                    <div className="text-xs text-slate-400">5 minutes</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-slate-700/30 rounded-lg">
                  <Gift className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="text-sm font-medium text-white">Earn GTT</div>
                    <div className="text-xs text-slate-400">40+ tokens</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-slate-700/30 rounded-lg">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <div>
                    <div className="text-sm font-medium text-white">Learn Fast</div>
                    <div className="text-xs text-slate-400">Interactive</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-slate-700/30 rounded-lg">
                  <Star className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-sm font-medium text-white">Get Rewards</div>
                    <div className="text-xs text-slate-400">Achievements</div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="space-y-3">
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  onClick={handleStartOnboarding}
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Start Interactive Tour
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => window.location.href = "/gamified-onboarding"}
                  >
                    <Trophy className="w-4 h-4 mr-1" />
                    Gamified Journey
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1 text-slate-400"
                    onClick={handleDismissWelcome}
                  >
                    Skip for Now
                  </Button>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs text-slate-500">
                  You can restart this tour anytime from your profile settings
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Floating Onboarding Button */}
      {hasSeenWelcome && !showOnboarding && onboardingProgress < 100 && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg animate-bounce"
            onClick={startOnboarding}
          >
            <Target className="w-4 h-4 mr-2" />
            Continue Tour
            {onboardingProgress > 0 && (
              <Badge variant="secondary" className="ml-2">
                {Math.round(onboardingProgress)}%
              </Badge>
            )}
          </Button>
        </div>
      )}
    </>
  );
}